import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const authResult: any = await auth().catch(e => ({ error: String(e) }));
    const orgId = authResult?.orgId || authResult?.userId;
    
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.orgSettings.findUnique({
      where: { organizationId: orgId }
    });

    return NextResponse.json(settings || { aiProvider: "none", aiApiKey: "", customAiEndpoint: "" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult: any = await auth().catch(e => ({ error: String(e) }));
    const orgId = authResult?.orgId || authResult?.userId;
    
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { aiProvider, aiApiKey, customAiEndpoint } = await req.json();

    const settings = await prisma.orgSettings.upsert({
      where: { organizationId: orgId },
      update: { aiProvider, aiApiKey, customAiEndpoint },
      create: { 
        organizationId: orgId,
        aiProvider: aiProvider || "none",
        aiApiKey: aiApiKey || "",
        customAiEndpoint: customAiEndpoint || ""
      }
    });

    return NextResponse.json(settings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
