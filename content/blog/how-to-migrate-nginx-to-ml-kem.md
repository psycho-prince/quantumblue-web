---
title: "How to Migrate Nginx to Post-Quantum ML-KEM (Kyber)"
description: "A complete technical guide on upgrading your Nginx web server to support ML-KEM (Kyber) and FIPS 203 post-quantum cryptography to prevent Harvest Now, Decrypt Later attacks."
date: "2026-09-18"
tags: ["Nginx", "DevOps", "PQC", "ML-KEM"]
---

With NIST finalizing **FIPS 203 (ML-KEM)**, legacy cryptographic algorithms like RSA and Elliptic Curve (ECDH) are now considered mathematically vulnerable to Cryptographically Relevant Quantum Computers (CRQCs). 

If you are running a standard Nginx reverse proxy, your traffic is currently susceptible to **Harvest Now, Decrypt Later (HNDL)** attacks. Attackers can record your encrypted TLS handshakes today and decrypt them once quantum hardware matures.

In this guide, we will walk through how to enable Post-Quantum Cryptography on Nginx.

## Step 1: Check your current vulnerability
Before modifying your server, you need to verify if your current TLS certificates and key exchanges are vulnerable.

> **[Run a Free PQC Risk Scan on your Domain](/scanner)** to instantly see your cryptographic grading.

## Step 2: Compile Nginx with OQS (Open Quantum Safe)
Standard OpenSSL does not fully support ML-KEM hybrid modes out of the box yet. You will need to compile Nginx with the `liboqs` fork of OpenSSL (OQS-OpenSSL).

```bash
git clone --branch main https://github.com/open-quantum-safe/openssl.git oqs-openssl
cd oqs-openssl
./config no-shared linux-x86_64 -lm
make -j
```

## Step 3: Configure Nginx TLS Ciphers
Once Nginx is compiled against OQS-OpenSSL, update your `nginx.conf` to prioritize hybrid quantum-safe key exchanges like `X25519MLKEM768`.

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    # Enable Hybrid Post-Quantum Key Exchange
    ssl_ecdh_curve X25519MLKEM768;
    
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers on;
}
```

## Step 4: Verify the Migration
Restart Nginx:
```bash
sudo systemctl restart nginx
```
Run your domain through the [QuantumBlue PQC Scanner](/scanner) again. If configured correctly, your Grade will jump from an **F (Critical)** to an **A+ (Quantum-Safe)**.

For a comprehensive infrastructure audit and Cryptographic Bill of Materials (CBOM), **[Start a QuantumBlue Free Trial](/sign-up)**.
