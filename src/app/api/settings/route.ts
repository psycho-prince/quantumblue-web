import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const authResult = await auth().catch((e: unknown) => ({ error: String(e) })) as { orgId?: string; userId?: string; error?: string };
    const orgId = authResult?.orgId || authResult?.userId;

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.orgSettings.findUnique({
      where: { organizationId: orgId }
    });

    return NextResponse.json(settings || fallback_settings());
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await auth().catch((e: unknown) => ({ error: String(e) })) as { orgId?: string; userId?: string; error?: string };
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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function fallback_settings() {
  return { aiProvider: "none", aiApiKey: "", customAiEndpoint: "" };
}
