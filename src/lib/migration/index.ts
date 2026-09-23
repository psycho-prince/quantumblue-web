/**
 * QuantumBlue Proof-of-Migration Library
 *
 * Core primitives for cryptographic evidence, migration tracking,
 * integrity verification, and risk scoring.
 */

import crypto from "crypto";

// ---- Evidence hashing ----

/** SHA-256 hash of a serialized payload (the content integrity fingerprint) */
export function hashPayload(payload: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

/** Verify an evidence artifact's integrity by recomputing its content hash */
export function verifyIntegrity(
  payload: Record<string, unknown>,
  expectedContentHash: string
): { ok: boolean; computedHash: string } {
  const computed = hashPayload(payload);
  return { ok: computed === expectedContentHash, computedHash: computed };
}

// ---- Migration event helpers ----

/** Build a before/after state snapshot for a cryptographic migration */
export interface MigrationSnapshot {
  /** Algorithm/primitive before migration (e.g. "RSA-2048", "ECDSA-P256") */
  beforePrimitive: string;
  /** Algorithm/primitive after migration (e.g. "ML-KEM-768", "ML-DSA-65") */
  afterPrimitive: string;
  /** Was a hybrid mode used during transition? */
  hybrid: boolean;
  /** Key sizes, parameters, curves — before */
  beforeParameters?: Record<string, unknown>;
  /** Key sizes, parameters, curves — after */
  afterParameters?: Record<string, unknown>;
  /** Human-readable description of what changed */
  description: string;
  /** ISO timestamp of when the migration occurred */
  migratedAt: string;
  /** Optional: identifier of the system/asset that was migrated */
  assetRef?: string;
}

/** Serialize a MigrationSnapshot into the beforeState/afterState JSON stored in the DB */
export function snapshotToMigrationState(snap: MigrationSnapshot) {
  return {
    before: {
      primitive: snap.beforePrimitive,
      parameters: snap.beforeParameters || {},
      hybrid: false,
      description: snap.description,
      timestamp: snap.migratedAt,
      assetRef: snap.assetRef,
    },
    after: {
      primitive: snap.afterPrimitive,
      parameters: snap.afterParameters || {},
      hybrid: snap.hybrid,
      description: snap.description,
      timestamp: snap.migratedAt,
      assetRef: snap.assetRef,
    },
  };
}

// ---- Evidence artifact builder ----

export interface EvidenceConfig {
  evidenceType: "MIGRATION_PROOF" | "CONFIGURATION_SNAPSHOT" | "INTEGRITY_ATTESTATION";
  payload: Record<string, unknown>;
  publicKey?: string;
  keyId?: string;
  signatureAlgorithm?: string;
  signature?: string;
  timestampAuthority?: "RFC-3161" | "QUANTUMBLUE" | "EXTERNAL";
  bsaCertificateNumber?: string;
  bsaCertificate?: string;
  custodyInitialAction?: string;
  custodyInitialActor?: string;
  custodyInitialDetail?: string;
}

/** Build the custody chain entry for a new evidence artifact */
function buildInitialCustody(
  cfg: EvidenceConfig & { timestamp: string }
): Array<{ action: string; actor: string; timestamp: string; detail?: string }> {
  return [
    {
      action: cfg.custodyInitialAction || "CREATED",
      actor: cfg.custodyInitialActor || "quantumblue-api",
      timestamp: cfg.timestamp,
      detail: cfg.custodyInitialDetail || "Evidence artifact created",
    },
  ];
}

/** Create an evidence artifact record (the data shape to store in Prisma) */
export function buildEvidenceArtifact(
  orgId: string,
  migrationEventId: string | null,
  cfg: EvidenceConfig
) {
  const timestamp = new Date().toISOString();
  const custody = buildInitialCustody({ ...cfg, timestamp });

  return {
    organizationId: orgId,
    migrationEventId,
    evidenceType: cfg.evidenceType,
    payload: cfg.payload,
    contentHash: hashPayload(cfg.payload),
    publicKey: cfg.publicKey || undefined,
    keyId: cfg.keyId || undefined,
    signatureAlgorithm: cfg.signatureAlgorithm || undefined,
    signature: cfg.signature || undefined,
    timestampedAt: new Date(),
    timestampAuthority: cfg.timestampAuthority || "QUANTUMBLUE",
    custodyChain: custody,
    bsaCertificateNumber: cfg.bsaCertificateNumber || undefined,
    bsaCertificate: cfg.bsaCertificate || undefined,
    verified: false,
  };
}

// ---- Risk scoring ----

export type QuantumSecurityLevel =
  | "PQ-READY"      // post-quantum algorithm in use
  | "HYBRID"        // classical + PQ hybrid
  | "VULNERABLE"    // classical-only, quantum-vulnerable
  | "UNKNOWN";       // insufficient data

export interface RiskFactors {
  algorithm: string;
  keySize?: number;
  dataSensitivity: "critical" | "confidential" | "internal" | "public";
  dataLifetimeYears: number;
  internetExposed: boolean;
  dependencyCount: number;
  migrationComplexity: "low" | "medium" | "high";
  cryptoAgility: number; // 1-5 score
}

/**
 * Compute a quantum risk score (0-100) for a cryptographic asset.
 *
 * Higher = more urgent to migrate.
 *
 * Factors:
 *  - Algorithm quantum vulnerability (biggest weight)
 *  - Data sensitivity × data lifetime (long-lived sensitive data is the real target)
 *  - Internet exposure (harvest-now-decrypt-later risk surface)
 *  - Dependency count (blast radius if this primitive breaks)
 *  - Migration complexity (lower complexity → more actionable → slightly lower urgency score
 *    because it's easier to fix, but still flagged)
 *  - Crypto agility (higher agility → easier to respond → lower urgency)
 */
export function computeQuantumRisk(factors: RiskFactors): {
  score: number;
  level: QuantumSecurityLevel;
  priority: 1 | 2 | 3;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  // Algorithm vulnerability (0-40 points)
  const isPQC = factors.algorithm.toUpperCase().includes("ML-KEM") ||
                factors.algorithm.toUpperCase().includes("ML-DSA") ||
                factors.algorithm.toUpperCase().includes("DILITHIUM") ||
                factors.algorithm.toUpperCase().includes("FALCON") ||
                factors.algorithm.toUpperCase().includes("SPHINCS");
  const isHybrid = factors.algorithm.toUpperCase().includes("HYBRID");
  const isClassicalVulnerable = !isPQC && !isHybrid &&
    (factors.algorithm.toUpperCase().includes("RSA") ||
     factors.algorithm.toUpperCase().includes("ECC") ||
     factors.algorithm.toUpperCase().includes("ECDSA") ||
     factors.algorithm.toUpperCase().includes("EC") ||
     factors.algorithm.toUpperCase().includes("AES") === false && factors.algorithm.toUpperCase().includes("DH"));

  if (isPQC) {
    score += 0;
    reasons.push("Post-quantum algorithm in use");
  } else if (isHybrid) {
    score += 10;
    reasons.push("Hybrid classical+PQ mode — transitional state");
  } else if (isClassicalVulnerable) {
    score += 40;
    reasons.push(`Classical vulnerable algorithm: ${factors.algorithm}`);
  } else {
    score += 10;
    reasons.push("Algorithm quantum status unknown or not classified as vulnerable");
  }

  // Data sensitivity × lifetime (0-25 points)
  const sensitivityWeight: Record<string, number> = { critical: 3, confidential: 2, internal: 1, public: 0 };
  const sensitivityPoints = (sensitivityWeight[factors.dataSensitivity] || 0) * Math.min(factors.dataLifetimeYears, 10);
  score += Math.min(sensitivityPoints, 25);
  if (factors.dataSensitivity === "critical" && factors.dataLifetimeYears > 5) {
    reasons.push("Long-lived critical data — high HNDL risk");
  } else if (factors.dataSensitivity === "confidential" && factors.dataLifetimeYears > 3) {
    reasons.push("Confidential data with multi-year lifetime");
  }

  // Internet exposure (0-15 points)
  if (factors.internetExposed) {
    score += 15;
    reasons.push("Internet-facing — harvest-now-decrypt-later surface");
  }

  // Dependency count (0-10 points)
  if (factors.dependencyCount > 10) {
    score += 10;
    reasons.push(`High dependency count (${factors.dependencyCount}) — large blast radius`);
  } else if (factors.dependencyCount > 3) {
    score += 5;
    reasons.push(`Moderate dependency count (${factors.dependencyCount})`);
  }

  // Migration complexity penalty (subtract 0-5 points for easy migrations)
  const complexityOffset = factors.migrationComplexity === "low" ? 5 : factors.migrationComplexity === "medium" ? 0 : -5;
  score = Math.max(0, Math.min(100, score + complexityOffset));
  if (factors.migrationComplexity === "low") reasons.push("Low migration complexity — actionable");

  // Crypto agility bonus (subtract 0-5)
  score = Math.max(0, Math.min(100, score - (factors.cryptoAgility - 1) * 1.25));

  // Determine level and priority
  let level: QuantumSecurityLevel;
  let priority: 1 | 2 | 3;

  if (isPQC) {
    level = "PQ-READY";
    priority = 3;
  } else if (score >= 60) {
    level = "VULNERABLE";
    priority = 1;
  } else if (score >= 30) {
    level = isHybrid ? "HYBRID" : "VULNERABLE";
    priority = 2;
  } else {
    level = isHybrid ? "HYBRID" : "VULNERABLE";
    priority = 3;
  }

  if (score < 10) level = "PQ-READY";

  return { score: Math.round(score), level, priority, reasons };
}

// ---- Public verification response shape ----

export interface PublicVerificationResult {
  id: string;
  evidenceType: string;
  organization: { id: string; name: string };
  migrationEvent: {
    id: string;
    migrationType: string;
    status: string;
    beforeState: Record<string, unknown>;
    afterState: Record<string, unknown>;
    createdAt: string;
    completedAt: string | null;
    asset: { id: string; kind: string; identifier: string; displayName: string | null } | null;
  } | null;
  payload: Record<string, unknown>;
  contentHash: string;
  computedHash: string;
  integrityOk: boolean;
  signature: { present: boolean; algorithm: string | null } | null;
  signatureOk: boolean | null;
  publicKey: string | null;
  keyId: string | null;
  timestampedAt: string | null;
  timestampAuthority: string | null;
  timestampOk: boolean;
  custodyChain: Array<{ action: string; actor: string; timestamp: string; detail?: string }>;
  custodyOk: boolean;
  verified: boolean;
  bsaCertificateNumber: string | null;
  overallStatus: "VERIFIED" | "FAILED" | "PENDING";
  verifiedAt: string | null;
}
