import { NextResponse } from 'next/server';
import tls from 'tls';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    let host = domain.toLowerCase().trim();
    host = host.replace(/^https?:\/\//, '');
    host = host.split('/')[0];
    host = host.split(':')[0]; // remove port if present

    if (!host) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
    }

    const certData = await new Promise<{
      subject: string;
      issuer: string;
      validFrom: string;
      validTo: string;
      bits: number;
      pubkeyAlgorithm: string;
      protocol: string | null;
    }>((resolve, reject) => {
      let timeoutId: NodeJS.Timeout; // eslint-disable-line prefer-const
      
      const socket = tls.connect(443, host, { 
        servername: host, 
        rejectUnauthorized: false,
      }, () => {
        clearTimeout(timeoutId);
        try {
          const cert = socket.getPeerCertificate(false);
          const protocol = socket.getProtocol();
          
          if (!cert || !cert.subject) {
            socket.destroy();
            return reject(new Error('No certificate found'));
          }

          const getStr = (val: string | string[] | undefined): string | undefined => Array.isArray(val) ? val[0] : val;

          let pubkeyAlgorithm = 'Unknown';
          try {
            if ((cert as any).raw) {
              const x509 = new crypto.X509Certificate((cert as any).raw);
              pubkeyAlgorithm = x509.publicKey.asymmetricKeyType || 'Unknown';
            }
          } catch {}

          resolve({
            subject: getStr(cert.subject?.CN) || host,
            issuer: getStr(cert.issuer?.O) || getStr(cert.issuer?.CN) || 'Unknown',
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            bits: cert.bits || 0,
            pubkeyAlgorithm,
            protocol
          });
        } catch(e) {
          reject(e);
        } finally {
          socket.destroy();
        }
      });

      socket.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });

      timeoutId = setTimeout(() => {
        socket.destroy();
        reject(new Error('Connection timed out'));
      }, 8000);
    });

    // Analyze PQC Readiness
    // Classical vulnerable algos: rsaEncryption, id-ecPublicKey, id-ecc, ecdsa-with-SHA256, etc.
    const isPQC = certData.pubkeyAlgorithm.toLowerCase().includes('dilithium') || 
                  certData.pubkeyAlgorithm.toLowerCase().includes('falcon') ||
                  certData.pubkeyAlgorithm.toLowerCase().includes('sphincs') ||
                  certData.pubkeyAlgorithm.toLowerCase().includes('ml-dsa');
                  
    const isVulnerable = !isPQC && (certData.pubkeyAlgorithm.includes('rsa') || certData.pubkeyAlgorithm.includes('ec'));

    return NextResponse.json({
      success: true,
      domain: host,
      certificate: certData,
      analysis: {
        isPQC,
        isVulnerable,
        riskLevel: isPQC ? 'SAFE' : 'CRITICAL',
        message: isPQC 
          ? "Quantum-Safe! This domain uses Post-Quantum Cryptography." 
          : "Vulnerable to 'Harvest Now, Decrypt Later'. Attackers can record this traffic today and decrypt it when a Cryptographically Relevant Quantum Computer (CRQC) becomes available.",
        grade: isPQC ? 'A+' : 'F'
      }
    });

  } catch (error) {
    console.error("Scanner Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to scan domain. Check if the domain is reachable on port 443.' 
    }, { status: 500 });
  }
}
