---
title: "Understanding FIPS 204: Why ML-DSA is Replacing ECDSA"
description: "An engineer's breakdown of FIPS 204 (ML-DSA) and why the industry is moving towards hybrid digital signatures to maintain compliance."
date: "2026-09-17"
tags: ["Cryptography", "Compliance", "FIPS 204", "ML-DSA"]
---

The National Institute of Standards and Technology (NIST) has officially published **FIPS 204**, standardizing the Module-Lattice-Based Digital Signature Algorithm (ML-DSA), formerly known as CRYSTALS-Dilithium.

## Why is ECDSA Dead?
For the last decade, ECDSA (Elliptic Curve Digital Signature Algorithm) has secured almost every software update, timestamp, and JWT token on the internet. However, Shor's Algorithm running on a quantum computer can easily solve the Elliptic Curve Discrete Logarithm Problem (ECDLP), completely breaking ECDSA.

## The Hybrid Approach
You cannot simply swap ECDSA for ML-DSA overnight. Many legacy clients (like older browsers or IoT devices) do not understand ML-DSA signatures. 

The industry standard is the **Hybrid Signature**. A hybrid signature computes *both* a classical signature (like ECDSA or Ed25519) and a post-quantum signature (ML-DSA), concatenating them together.

If the quantum algorithm is found to have a flaw, the classical algorithm still protects you. If a quantum computer breaks the classical algorithm, the quantum algorithm protects you.

## Automating the Migration
Updating thousands of code repositories to use Hybrid Signatures is a massive undertaking. 

With the **[QuantumBlue CLI](/scanner)**, you can automatically scan your entire codebase, generate a Cryptographic Bill of Materials (CBOM), and pinpoint exactly where legacy ECDSA signatures are being used in your application.

> Start mapping your cryptographic risk today with a **[Free QuantumBlue Account](/sign-up)**.
