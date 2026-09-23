export type MigrationEvent = {
  id: string;
  organizationId: string;
  assetId: string | null;
  migrationType: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  status: "pending" | "in_progress" | "complete" | "verified" | "failed";
  description: string | null;
  initiatedBy: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EvidenceArtifact = {
  id: string;
  organizationId: string;
  migrationEventId: string | null;
  evidenceType: string;
  payload: Record<string, unknown>;
  contentHash: string;
  signature: string | null;
  signatureAlgorithm: string | null;
  publicKey: string | null;
  keyId: string | null;
  timestampedAt: Date | null;
  timestampAuthority: string | null;
  timestampToken: string | null;
  custodyChain: Array<{ action: string; actor: string; timestamp: string; detail?: string }>;
  bsaCertificate: string | null;
  bsaCertificateNumber: string | null;
  verified: boolean;
  verificationError: string | null;
  createdAt: Date;
  updatedAt: Date;
};
