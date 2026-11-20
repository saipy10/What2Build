import type { Metadata } from "next";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { buildCompanyMetadata, renderCompanyPage } from "@/lib/companyPage";

export const revalidate = 1800;

interface CompanyPageProps {
  params: Promise<{ companySlug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SUPPORTED_COMPANIES).map((slug) => ({
    companySlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { companySlug } = await params;
  return buildCompanyMetadata(SUPPORTED_COMPANIES[companySlug], "blog");
}

export default async function CompanyResearchPage({ params }: CompanyPageProps) {
  const { companySlug } = await params;
  return renderCompanyPage(companySlug, "blog");
}
