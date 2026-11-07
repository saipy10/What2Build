// In-memory fallback repository when Supabase is not reached or during local development
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
  updatedAt?: Date;
}

const memoryStore = {
  companies: new Map<string, MemoryCompany>(),
  papers: new Map<string, MemoryPaper[]>(),
  ideas: new Map<string, MemoryProjectIdea[]>(),
  lastRefreshed: new Map<string, Date>(),
};

export const memoryDb = {
  getCompanyBySlug: (slug: string) => memoryStore.companies.get(slug),
  saveCompany: (company: MemoryCompany) => {
    memoryStore.companies.set(company.slug, { ...company, updatedAt: new Date() });
    return memoryStore.companies.get(company.slug)!;
  },
  getPapersByCompany: (companySlug: string) => memoryStore.papers.get(companySlug) || [],
  savePapers: (papers: MemoryPaper[]) => {
    for (const paper of papers) {
      const existing = memoryStore.papers.get(paper.companyId) || [];
      const updated = [paper, ...existing.filter((p) => p.sourceUrl !== paper.sourceUrl)];
      memoryStore.papers.set(paper.companyId, updated);
    }
  },
  getPaperById: (id: string): MemoryPaper | undefined => {
    for (const list of memoryStore.papers.values()) {
      const found = list.find((p) => p.id === id);
      if (found) return found;
    }
    return undefined;
  },
  getIdeasByPaperId: (paperId: string) => memoryStore.ideas.get(paperId) || [],
  saveIdeas: (paperId: string, ideas: MemoryProjectIdea[]) => {
    memoryStore.ideas.set(paperId, ideas);
  },
  getLastRefreshed: (key: string) => memoryStore.lastRefreshed.get(key),
  setLastRefreshed: (key: string, date: Date) => {
    memoryStore.lastRefreshed.set(key, date);
  },
};
