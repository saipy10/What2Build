import { NextResponse } from "next/server";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export async function GET() {
  const companies = Object.values(SUPPORTED_COMPANIES).map((comp) => ({
    name: comp.name,
    slug: comp.slug,
    description: comp.description,
    tagline: comp.tagline,
    researchUrl: comp.researchUrl,
    color: comp.color,
    iconName: comp.iconName,
    papersCount: 10,
  }));

  return NextResponse.json({
    success: true,
    data: companies,
  });
}

