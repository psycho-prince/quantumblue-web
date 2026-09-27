import { prisma } from './prisma';

// Industry-standard entitlement check:
// 1. Query Entitlement table (source of truth, written by webhook)
// 2. Check validUntil > now (handles expired subscriptions)
// 3. Check feature flags
// 4. Fall back to Subscription if no Entitlement record (legacy)

export interface EntitlementInfo {
  plan: string;
  active: boolean;
  limits: {
    maxDomains: number;
    maxAssets: number;
    scansPerMonth: number;
  };
  features: Record<string, boolean | number>;
  validUntil: Date | null;
  reason?: string;
}

export async function getOrganizationEntitlements(orgId: string): Promise<EntitlementInfo> {
  // PRIMARY: check Entitlement table (written by webhook on activation/expiry/cancel)
  const entitlement = await prisma.entitlement.findUnique({
    where: { organizationId: orgId },
  });

  if (entitlement) {
    const now = new Date();
    const active = entitlement.validUntil > now && entitlement.planCode !== 'free';

    if (!active) {
      return {
        plan: entitlement.planCode,
        active: false,
        limits: { maxDomains: 0, maxAssets: 0, scansPerMonth: 0 },
        features: {},
        validUntil: entitlement.validUntil,
        reason: entitlement.validUntil <= now ? 'expired' : 'inactive',
      };
    }

    return {
      plan: entitlement.planCode,
      active: true,
      limits: {
        maxDomains: entitlement.maxDomains,
        maxAssets: entitlement.maxAssets,
        scansPerMonth: entitlement.scansPerMonth,
      },
      features: entitlement.features as Record<string, boolean | number>,
      validUntil: entitlement.validUntil,
    };
  }

  // FALLBACK: check Subscription table (legacy — org has sub but no entitlement record yet)
  const activeSub = await prisma.subscription.findFirst({
    where: {
      clerkOrgId: orgId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!activeSub) {
    return {
      plan: 'FREE',
      active: false,
      limits: { maxDomains: 0, maxAssets: 0, scansPerMonth: 0 },
      features: {},
      validUntil: null,
      reason: 'no subscription',
    };
  }

  // Derive from planKey (same values as webhook PLAN_LIMITS)
  const planLimits: Record<string, { maxDomains: number; maxAssets: number; scansPerMonth: number; features: Record<string, boolean | number> }> = {
    'STARTER':   { maxDomains: 1,   maxAssets: 50,   scansPerMonth: 10,  features: { pqc_scan: true, cbom_export: true, pdf_report: true, basic_support: true } },
    'PRO':       { maxDomains: 10,  maxAssets: 500,  scansPerMonth: 50,  features: { pqc_scan: true, cbom_export: true, pdf_report: true, api_access: true, priority_support: true, team_seats: 3 } },
    'BUSINESS':  { maxDomains: 100, maxAssets: 5000, scansPerMonth: 500, features: { pqc_scan: true, cbom_export: true, pdf_report: true, api_access: true, priority_support: true, team_seats: 20, custom_connectors: true, sla: true } },
  };

  const l = planLimits[activeSub.planKey] || planLimits['STARTER'];

  return {
    plan: activeSub.planKey,
    active: true,
    limits: { maxDomains: l.maxDomains, maxAssets: l.maxAssets, scansPerMonth: l.scansPerMonth },
    features: l.features,
    validUntil: activeSub.currentPeriodEnd,
  };
}

// Feature gate: does org have this feature enabled?
export async function hasFeature(orgId: string, feature: string): Promise<boolean> {
  const e = await prisma.entitlement.findUnique({ where: { organizationId: orgId } });
  if (!e) return false;
  if (e.validUntil <= new Date()) return false;
  const features = e.features as Record<string, boolean | number> | null;
  if (!features) return false;
  const val = features[feature];
  return typeof val === 'boolean' ? val : typeof val === 'number' ? val > 0 : false;
}

// Usage limit check: can org create another X?
export async function checkLimit(orgId: string, usageType: 'maxDomains' | 'maxAssets' | 'scansPerMonth', currentCount: number) {
  const e = await prisma.entitlement.findUnique({ where: { organizationId: orgId } });
  if (!e || e.validUntil <= new Date()) {
    return { allowed: false, remaining: 0, limit: 0 };
  }
  const limit = e[usageType] as number;
  const remaining = Math.max(0, limit - currentCount);
  return { allowed: currentCount < limit, remaining, limit };
}
