import type { Metadata } from "next";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { buildCompanyMetadata, renderCompanyPage } from "@/lib/companyPage";

export const revalidate = 1800;

interface CompanyResearchPapersPageProps {
  params: Promise<{ companySlug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SUPPORTED_COMPANIES).map((slug) => ({
    companySlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: CompanyResearchPapersPageProps): Promise<Metadata> {
  const { companySlug } = await params;
  return buildCompanyMetadata(SUPPORTED_COMPANIES[companySlug], "research");
}

export default async function CompanyResearchPapersPage({
  params,
}: CompanyResearchPapersPageProps) {
  const { companySlug } = await params;
  return renderCompanyPage(companySlug, "research");
}
