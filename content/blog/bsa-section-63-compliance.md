---
title: "BSA §63 Electronic Evidence Compliance Software"
description: "How to certify digital evidence under Bharatiya Sakshya Adhiniyam (BSA) Section 63 using compliant software and cryptographic timestamps."
date: "2026-09-26"
tags: ["Compliance", "India", "BSA Section 63", "Digital Evidence"]
---

Under Section 63 of the Bharatiya Sakshya Adhiniyam (BSA), electronic records must be properly authenticated to be admissible as evidence, requiring a certificate that verifies the integrity and source of the digital data. Compliance software automates this certification process by generating verifiable cryptographic proofs, ensuring your digital evidence meets the strict legal standards set by the BSA.

The BSA §63 mandates that any electronic record produced as evidence must be accompanied by a certificate signed by a person in charge of the computer or device. Modern compliance software streamlines this by leveraging algorithms like SHA-256 or SHA-3 for hashing the evidence, and applying RFC 3161 timestamping to prove the data existed at a specific point in time and has not been altered. Furthermore, looking ahead, ensuring these hashes and signatures are generated using post-quantum cryptographic algorithms (such as ML-DSA) guarantees long-term admissibility even as quantum computing threats evolve.

By integrating these specific cryptographic standards, compliance software not only fulfills the immediate §63 requirements but also aligns with the broader [DPDP Act encryption requirements](/blog/dpdp-act-encryption-requirements) for data protection.

You can check your own organization's readiness for handling digital evidence under the new standards using our **[Quantum Readiness Scanner](/scanner)**.
