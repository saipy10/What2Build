import { NextRequest, NextResponse } from "next/server";
import { getCompanyPapers } from "@/lib/paperService";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export async function GET(
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

    const papers = await getCompanyPapers(slug.toLowerCase(), false, filter, limit);

    return NextResponse.json({
      success: true,
      filter,
      company: {
        name: company.name,
        slug: company.slug,
        description: company.description,
        tagline: company.tagline,
        researchUrl: company.researchUrl,
        blogUrl: company.blogUrl,
        color: company.color,
      },
      papers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch papers";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
