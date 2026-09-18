import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scanId = params.id;
    
    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      include: { findings: true }
    });

    let status = "unknown";
    let color = "#9ca3af"; // gray

    if (!scan) {
      status = "not found";
    } else {
      const hasVulnerable = scan.findings.some(f => 
        f.primitive.toLowerCase().includes("rsa") || 
        f.primitive.toLowerCase().includes("ec") || 
        f.primitive.toLowerCase().includes("des")
      );
      
      const hasPqc = scan.findings.some(f => 
        f.primitive.toLowerCase().includes("ml-dsa") || 
        f.primitive.toLowerCase().includes("ml-kem") || 
        f.primitive.toLowerCase().includes("dilithium") ||
        f.primitive.toLowerCase().includes("falcon") ||
        f.primitive.toLowerCase().includes("sphincs")
      );

      if (hasVulnerable) {
        status = "vulnerable";
        color = "#ef4444"; // red-500
      } else if (hasPqc) {
        status = "quantum-safe";
        color = "#22c55e"; // green-500
      } else {
        status = "analyzed";
        color = "#3b82f6"; // blue-500
      }
    }

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="20">
      <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <clipPath id="a">
        <rect width="160" height="20" rx="3" fill="#fff"/>
      </clipPath>
      <g clip-path="url(#a)">
        <path fill="#555" d="M0 0h65v20H0z"/>
        <path fill="${color}" d="M65 0h95v20H65z"/>
        <path fill="url(#b)" d="M0 0h160v20H0z"/>
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="32.5" y="15" fill="#010101" fill-opacity=".3">PQC</text>
        <text x="32.5" y="14">PQC</text>
        <text x="111.5" y="15" fill="#010101" fill-opacity=".3">${status}</text>
        <text x="111.5" y="14">${status}</text>
      </g>
    </svg>`;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600"
      }
    });
  } catch (error) {
    return new NextResponse("Error generating badge", { status: 500 });
  }
}
