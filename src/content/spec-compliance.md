---
title: Technical Spec & Compliance Checklist
---

# QuantumBlue CLI — Compliance & Control Checklist

QuantumBlue is a **Continuous Cryptographic Posture Management (CCPM)** platform. The CLI is the command-line interface to the platform — it performs hybrid PQC signing, CBOM generation, TLS surface scanning, and (in Phase 2+) eBPF runtime discovery. This page maps the CLI's technical controls to relevant compliance frameworks.

## Post-Quantum Cryptography

- **ML-DSA-65 (FIPS 204)**: Digital signature standard
- **ML-KEM-768 (FIPS 203)**: Key encapsulation standard
- **Hybrid Signatures**: ML-DSA-65 + Ed25519 for PQC migration with classical verification compatibility
- **RFC 3161**: Trusted timestamping — proof of existence

## Evidence Integrity (BSA §63)

- **BSA §63 Certificate Engine**: Court-ready evidence certificates under Bharatiya Sakshya Adhiniyam, 2023 — Section 63
- **SHA-256 Hashing**: Cryptographic fingerprint for evidence integrity
- **Chain of Custody**: Tamper-evident hash-chained event log
- **Metadata Capture**: Device make, model, serial, IMEI/UIN, MAC, OS, BIOS, firmware
- **Certificate Workflow**: Generate, validate, sign, issue, revoke under BSA §63

### Legacy Note

IEA §65B(4) is retained solely as a historical compatibility note. The primary current-law reference for electronic evidence is BSA §63.

## Security Controls (IT Act)

- **§43**: Access and data-integrity controls
- **§66**: Security incident evidence capture
- **§66C**: Authentication, MFA, and identity controls
- **§66E**: Sensitive-data protection
- **§72/72A**: Confidentiality and personal-information controls

## Privacy (DPDP Framework)

- **AES-256-GCM**: Encryption at rest
- **Data Classification**: Public / Low / Medium / High / Restricted
- **Retention Enforcement**: Per-classification retention periods
- **Controlled Deletion**: Soft-delete and permanent-purge workflows

## CCPM Platform Controls

- **External Attack Surface Scanner**: TLS certificate scanning with HNDL risk grading (Phase 1, live)
- **eBPF Runtime Discovery**: Zero-instrumentation production crypto observation (Phase 2)
- **Cryptographic Asset Graph**: Single source of truth for what crypto runs in production
- **Shift-Left Guardrail**: GitHub/GitLab PR blocking for legacy crypto (Phase 4)
- **Migration Engine**: Envoy/Istio/Kong PQC routing with one-click rollback (Phase 3)
- **Proof of Migration**: Auditable artifact for every completed migration
- **DSPM Integration**: Automated HNDL prioritization from data-sensitivity tags (Phase 4)

## Control Mapping

| Framework | QuantumBlue Capability |
|-----------|----------------------|
| BSA §63 | Electronic evidence + certificate workflow |
| IT Act §43 | Access/data-integrity controls |
| IT Act §66 | Security incident evidence |
| IT Act §66C | Authentication & identity controls |
| IT Act §66E | Sensitive-data protection |
| IT Act §72/72A | Confidentiality & information controls |
| DPDP Framework | Personal-data governance |
| NIST FIPS 203/204 | ML-KEM-768 / ML-DSA-65 implementation |
| CCPA / GDPR | Data classification + controlled deletion |

> **Disclaimer**: Control mapping — not a representation that QuantumBlue itself guarantees statutory compliance or legal admissibility. QuantumBlue provides technical controls that support applicable legal and evidentiary requirements.
