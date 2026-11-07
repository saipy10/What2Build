import { NextRequest, NextResponse } from "next/server";
import { getCompanyPapers } from "@/lib/paperService";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const company = SUPPORTED_COMPANIES[slug.toLowerCase()];

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not supported" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get("filter") || "blog") as "blog" | "research";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 5), 50);

    // Force discovery refresh with the requested filter
    const papers = await getCompanyPapers(slug.toLowerCase(), true, filter, limit);

    return NextResponse.json({
      success: true,
      filter,
      message: `${filter === "research" ? "Research papers" : "Company blogs"} refreshed successfully`,
      count: papers.length,
      papers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to refresh papers";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
