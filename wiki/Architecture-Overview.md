# Architecture Overview

The Quantum Blue ecosystem is built on a highly scalable, zero-trust microservices architecture. It is designed to handle enterprise-scale cryptographic workloads without compromising on speed or security.

## 🏗️ 1. The Go Cryptographic Daemon (The Engine)
At the heart of the platform sits the **Quantum Blue Daemon**, a proprietary engine written in Go (Golang). Go was selected for its exceptional concurrency models and high-performance cryptographic standard libraries.

* **Stateless Operation:** The daemon generates massive ML-DSA-65 keys in-memory. It never persists private keys to disk, ensuring that even if the physical server is compromised, no cryptographic material can be extracted.
* **REST API & CLI:** The daemon exposes `/v1/sign` and `/v1/verify` endpoints for programmatic access, while also serving as a robust CLI tool for local developer environments.

## 🌐 2. The Next.js Edge Network (The BFF)
To provide a seamless developer experience and robust tenant isolation, we utilize a **Next.js Backend-For-Frontend (BFF)** deployed on the edge.

* **Authentication & Rate Limiting:** The BFF intercepts all API requests (like `/api/pqc-keys`) and validates the user's session and organization quota against our database. 
* **Proxy Routing:** Once authenticated, the BFF securely provisions a temporary, hashed internal token and proxies the request to the Go Engine. This ensures the Go Engine is completely shielded from public internet traffic.

## 🗄️ 3. PostgreSQL & Immutable Audit Logs
Every operation within Quantum Blue is tracked to satisfy strict regulatory compliance frameworks (like the Indian Evidence Act §65B).

* **Multi-Tenant Isolation:** The database uses strict relational integrity to separate keys, audit events, and assets by `Organization`.
* **API Key Hashing:** API keys are never stored in plain text. They are hashed using `SHA-256` before being stored in the database, guaranteeing that a database breach does not result in compromised API access.
* **The `AuditEvent` Table:** Every time a post-quantum key is requested or a file is signed, an immutable record is created, tracking the exact timestamp, the organization, and the success/failure status.
