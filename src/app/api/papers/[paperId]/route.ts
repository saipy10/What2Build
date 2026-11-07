import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/paperService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;
    const paper = await getPaperById(paperId);

    if (!paper) {
      return NextResponse.json(
        { success: false, error: "Paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paper,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve paper";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
