---
title: Technical Spec & Compliance Checklist
---

# QuantumBlue CLI — Compliance & Control Checklist

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

> **Disclaimer**: Control mapping — not a representation that QuantumBlue itself guarantees statutory compliance or legal admissibility. QuantumBlue provides technical controls that support applicable legal and evidentiary requirements.
