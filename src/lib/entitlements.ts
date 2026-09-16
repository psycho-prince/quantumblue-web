import { prisma } from './prisma';

export async function getOrganizationEntitlements(orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!org) {
    return { plan: 'FREE', limits: { maxScans: 5 }, active: false };
  }

  const activeSub = org.subscriptions[0];

  if (activeSub && activeSub.planKey === 'PRO') {
    return { plan: 'PRO', limits: { maxScans: 100 }, active: true };
  }
  
  if (activeSub && activeSub.planKey === 'BUSINESS') {
    return { plan: 'BUSINESS', limits: { maxScans: 1000 }, active: true };
  }

  return { plan: 'FREE', limits: { maxScans: 5 }, active: true };
}
