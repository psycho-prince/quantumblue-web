export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { getOrganizationAssets } from "@/lib/migration/assets";
import { AssetInventoryTable } from "@/app/dashboard/inventory/AssetInventoryTable";
import { RiskSummaryPanel } from "@/app/dashboard/inventory/RiskSummaryPanel";

export const metadata = { title: "Cryptographic Inventory | QuantumBlue" };

export default async function InventoryPage() {
  const orgId = process.env.NEXT_PUBLIC_ORG_ID || "org-test-001";

  const [assets, migrationSummary, evidenceSummary] = await Promise.all([
    getOrganizationAssets(orgId),
    prisma.migrationEvent.groupBy({ by: ["status"], where: { organizationId: orgId }, _count: true }),
    prisma.evidenceArtifact.groupBy({ by: ["verified"], where: { organizationId: orgId }, _count: true }),
  ]);

  const ms = migrationSummary.reduce((acc, r: { status: string; _count: number }) => { acc[r.status] = r._count; return acc; }, {} as Record<string, number>);
  const es = evidenceSummary.reduce((acc, r: { verified: boolean; _count: number }) => { acc[r.verified ? "verified" : "unverified"] = r._count; return acc; }, {} as Record<string, number>);

  const priorityCounts = {
    1: assets.filter((a: { _riskPriority: number }) => a._riskPriority === 1).length,
    2: assets.filter((a: { _riskPriority: number }) => a._riskPriority === 2).length,
    3: assets.filter((a: { _riskPriority: number }) => a._riskPriority === 3).length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="text-accent-blue font-bold text-[10px] uppercase tracking-[0.2em] block font-mono">CRYPTOGRAPHIC_DIGITAL_TWIN</span>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mt-2">Cryptographic Inventory</h1>
          <p className="text-zinc-500 text-sm font-mono mt-2 max-w-2xl">
            Every cryptographic asset your organization depends on — where it lives, what it protects, and its quantum exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="p-6 bg-black border border-border-bright">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">TOTAL_ASSETS</div>
            <div className="text-3xl font-bold text-white font-mono">{assets.length}</div>
          </div>
          <div className="p-6 bg-black border border-border-bright">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">PRIORITY_1</div>
            <div className="text-3xl font-bold text-accent-red font-mono">{priorityCounts[1] || 0}</div>
          </div>
          <div className="p-6 bg-black border border-border-bright">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">MIGRATIONS</div>
            <div className="text-2xl font-bold text-white font-mono">
              <span className="text-accent-green">{ms.complete || 0}</span>
              <span className="text-zinc-600 ml-1">/{ms.complete + ms.in_progress + ms.pending || 0}</span>
            </div>
          </div>
          <div className="p-6 bg-black border border-border-bright">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">VERIFIED_EVIDENCE</div>
            <div className="text-3xl font-bold text-white font-mono">{es.verified || 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <RiskSummaryPanel
              priorityCounts={priorityCounts}
              totalAssets={assets.length}
              verifiedEvidence={es.verified || 0}
              unverifiedEvidence={es.unverified || 0}
              migrations={ms}
            />
          </div>
          <div className="lg:col-span-3">
            <AssetInventoryTable assets={assets} />
          </div>
        </div>
      </div>
    </div>
  );
}
