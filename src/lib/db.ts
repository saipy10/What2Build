import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if a valid DATABASE_URL is available
const isDatabaseConfigured = !!process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("randompassword");

export const prisma =
  globalForPrisma.prisma ??
  (isDatabaseConfigured
    ? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null);

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

// In-memory fallback repository when PostgreSQL is not configured locally
export interface MemoryPaper {
  id: string;
  companyId: string;
  title: string;
  description: string;
  publishedAt: Date;
  authors: string[];
  sourceUrl: string;
  externalId?: string | null;
  category?: string;
  contentType?: "blog" | "research";
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryProjectIdea {
  id: string;
  paperId: string;
  title: string;
  description: string;
  features: string[];
  skills: string[];
  technologies: string[];
  difficulty: string;
  researchConnection: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryCompany {
  id: string;
  name: string;
  slug: string;
  description: string;
  researchUrl: string;
}

const memoryStore = {
  companies: new Map<string, MemoryCompany>(),
  papers: new Map<string, MemoryPaper>(),
  ideas: new Map<string, MemoryProjectIdea[]>(),
  lastRefreshed: new Map<string, Date>(),
};

export const memoryDb = {
  getCompanyBySlug: (slug: string) => memoryStore.companies.get(slug),
  saveCompany: (company: MemoryCompany) => {
    memoryStore.companies.set(company.slug, company);
    return company;
  },
  getPapersByCompany: (companySlug: string) => {
    return Array.from(memoryStore.papers.values())
      .filter((p) => p.companyId === companySlug)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  },
  getPaperById: (id: string) => memoryStore.papers.get(id),
  savePapers: (papers: MemoryPaper[]) => {
    papers.forEach((p) => memoryStore.papers.set(p.id, p));
  },
  getIdeasByPaperId: (paperId: string) => memoryStore.ideas.get(paperId) || [],
  saveIdeas: (paperId: string, ideas: MemoryProjectIdea[]) => {
    memoryStore.ideas.set(paperId, ideas);
  },
  getLastRefreshed: (slug: string) => memoryStore.lastRefreshed.get(slug),
  setLastRefreshed: (slug: string, date: Date) => memoryStore.lastRefreshed.set(slug, date),
};

