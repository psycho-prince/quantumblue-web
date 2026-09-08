# Cryptographic Standards: ML-DSA

Quantum Blue's primary directive is to protect digital assets against decryption by quantum computers. To achieve this, we have standardized our platform entirely around **Module-Lattice-Based Cryptography**.

## 🛑 The Problem with RSA and ECC
Classical public-key cryptography (like RSA and Elliptic Curve Cryptography) relies on the mathematical difficulty of factoring large prime numbers or solving discrete logarithms. While these problems take classical supercomputers billions of years to solve, a Quantum Computer running **Shor's Algorithm** can solve them in a matter of seconds.

## 🛡️ The Solution: ML-DSA (CRYSTALS-Dilithium)
In August 2024, the National Institute of Standards and Technology (NIST) published the official Federal Information Processing Standard (FIPS 204) for Post-Quantum Digital Signatures, establishing **ML-DSA** as the global standard.

Quantum Blue natively implements ML-DSA to secure all digital signatures across our platform.

### How it Works (Learning With Errors)
Instead of prime factorization, ML-DSA is built on the **Learning With Errors (LWE)** problem over module lattices. 
Imagine a multi-dimensional grid (a lattice). If you select a point on that grid and introduce a small amount of random mathematical "noise" or error, finding the original point becomes an exponentially hard problem. 

Currently, no known classical *or* quantum algorithm can solve the LWE problem efficiently. 

### Security Levels
Quantum Blue currently enforces **ML-DSA-65**.
* According to NIST, ML-DSA-65 provides a security strength equivalent to AES-192.
* This level of security is explicitly designed to protect highly sensitive enterprise and government data from well-funded, state-sponsored quantum adversaries.

By migrating to Quantum Blue today, your organization is immediately compliant with upcoming global regulations (like the NSA's Commercial National Security Algorithm Suite 2.0 directive) that mandate a complete transition to Post-Quantum Cryptography.
