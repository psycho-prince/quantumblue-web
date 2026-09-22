import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ConnectorsClient, AWSConnectorsClient } from "./client";

export default async function ConnectorsPage() {
  const { userId, orgId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const internalOrgId = orgId || userId;

  const entitlement = await prisma.entitlement.findUnique({
    where: { organizationId: internalOrgId }
  });

  let hasGithub = false;
  let hasAws = false;
  if (entitlement && entitlement.features) {
    const features = entitlement.features as Record<string, unknown>;
    hasGithub = features.github_connector === true;
    hasAws = features.aws_connector === true;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Connectors</h1>
      <p className="text-gray-400 mb-8">
        Connect QuantumBlue to your external environments to automatically discover and map cryptographic assets.
      </p>

      <div className="grid gap-6">
        {/* GitHub Connector */}
        <div className="bg-[#111] border border-[#222] p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                GitHub 
                {!hasGithub && (
                  <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded-full border border-purple-800">
                    Pro Plan Required
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Scan repositories for hardcoded cryptography, keys, and certificates.
              </p>
            </div>
          </div>
          
          <ConnectorsClient hasGithub={hasGithub} />
        </div>
        {/* AWS Connector */}
        <div className="bg-[#111] border border-[#222] p-6 rounded-xl mt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Amazon Web Services (AWS)
                {!hasAws && (
                  <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded-full border border-purple-800">
                    Business Plan Required
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Scan your cloud infrastructure via cross-account assume-role. Discovers ACM certificates, ALB TLS policies, and KMS cryptography.
              </p>
            </div>
          </div>
          
          <AWSConnectorsClient hasAws={hasAws} />
        </div>

      </div>
    </div>
  );
}
