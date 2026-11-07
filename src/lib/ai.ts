import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const ProjectIdeaItemSchema = z.object({
  title: z.string().describe("A concise, compelling title for the software project"),
  description: z.string().describe("Clear, engaging summary of what the developer could build"),
  features: z.array(z.string()).min(2).max(5).describe("Key functionality and practical feature components"),
  skills: z.array(z.string()).min(2).max(5).describe("Concrete software, engineering, and machine learning skills demonstrated"),
  technologies: z.array(z.string()).min(2).max(6).describe("Recommended tech stack, frameworks, tools, and libraries"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("Developer difficulty level: Idea 1 must be Beginner, Idea 2 must be Intermediate, Idea 3 must be Advanced"),
  researchConnection: z.string().describe("Clear explanation of how the project translates or implements concepts from the research paper or blog"),
});

export const ProjectIdeasResponseSchema = z.object({
  ideas: z.array(ProjectIdeaItemSchema).length(3).describe("Exactly three distinct software project ideas: [Beginner, Intermediate, Advanced]"),
});

export type ProjectIdeaItem = z.infer<typeof ProjectIdeaItemSchema>;
export type ProjectIdeasResponse = z.infer<typeof ProjectIdeasResponseSchema>;

export async function generateProjectIdeas(paper: {
  title: string;
  description: string;
  companyName: string;
  sourceUrl: string;
  authors: string[];
}): Promise<ProjectIdeasResponse> {
  const apiKey =
    process.env.GROQ_API ||
    process.env.GROQ_API_KEY ||
    process.env.GROK_API ||
    process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API key is not configured in .env. Please set GROQ_API or GROK_API."
    );
  }

  const prompt = `
You are an elite Staff Software Engineer and AI Research Lead at "What2Build".
Your mission is to analyze the following publication/blog from ${paper.companyName} and devise exactly THREE distinct, realistic, and inspiring software project ideas that a software developer or AI engineer can build for their portfolio or startup.

Publication Details:
- Title: ${paper.title}
- Published by: ${paper.companyName}
- Authors: ${paper.authors.length ? paper.authors.join(", ") : "Team"}
- Source URL: ${paper.sourceUrl}
- Summary:
${paper.description}

CRITICAL REQUIREMENT - Strict 3-Tier Difficulty Progression:
1. Idea 1 MUST have difficulty: "Beginner"
   - Scope: Basic prototype, educational inspector, simple UI wrapper, or lightweight CLI utility demonstrating the core concept. Accessible to early career developers.
2. Idea 2 MUST have difficulty: "Intermediate"
   - Scope: Production-ready applied system, API microservice, real-time workflow pipeline, or end-user developer tool with auth, state management, or asynchronous tasks.
3. Idea 3 MUST have difficulty: "Advanced"
   - Scope: Frontier autonomous multi-agent orchestration, complex distributed architecture, high-performance model parallel pipeline, or cutting-edge domain experiment.

Return a JSON object conforming exactly to this structure:
{
  "ideas": [
    {
      "title": "Project Title",
      "description": "Engaging description",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "difficulty": "Beginner",
      "researchConnection": "Explanation of connection"
    },
    {
      "title": "Project Title",
      "description": "Engaging description",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "difficulty": "Intermediate",
      "researchConnection": "Explanation of connection"
    },
    {
      "title": "Project Title",
      "description": "Engaging description",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "difficulty": "Advanced",
      "researchConnection": "Explanation of connection"
    }
  ]
}
`;

  const freeModel = process.env.GROQ_MODEL || process.env.GROK_MODEL || "openai/gpt-oss-120b";
  const isGroqKey = apiKey.startsWith("gsk_");
  const baseURL = isGroqKey ? "https://api.groq.com/openai/v1" : "https://api.x.ai/v1";

  const res = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: freeModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert Staff AI Engineer. You MUST respond with a valid json object with an 'ideas' array containing exactly 3 items where item 1 is Beginner, item 2 is Intermediate, and item 3 is Advanced.",
        },
        {
          role: "user",
          content: `${prompt}\n\nRespond with valid json containing the 3 ideas.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API request failed (${res.status}): ${errText}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq API returned an empty response");
  }

  const parsed = JSON.parse(content);
  const validated = ProjectIdeasResponseSchema.safeParse(parsed);
  if (validated.success) {
    validated.data.ideas[0].difficulty = "Beginner";
    validated.data.ideas[1].difficulty = "Intermediate";
    validated.data.ideas[2].difficulty = "Advanced";
    return validated.data;
  }

  if (Array.isArray(parsed.ideas) && parsed.ideas.length >= 3) {
    const ideas = parsed.ideas.slice(0, 3).map((idea: any, idx: number) => ({
      title: String(idea.title || `Project Idea ${idx + 1}`),
      description: String(idea.description || "Actionable software development concept."),
      features: Array.isArray(idea.features) ? idea.features.map(String) : ["Core implementation", "User interface"],
      skills: Array.isArray(idea.skills) ? idea.skills.map(String) : ["Full-stack development", "API integration"],
      technologies: Array.isArray(idea.technologies) ? idea.technologies.map(String) : ["TypeScript", "Next.js", "Python"],
      difficulty: (idx === 0 ? "Beginner" : idx === 1 ? "Intermediate" : "Advanced") as "Beginner" | "Intermediate" | "Advanced",
      researchConnection: String(idea.researchConnection || "Translates the core techniques into real code."),
    }));
    return { ideas: ideas as [ProjectIdeaItem, ProjectIdeaItem, ProjectIdeaItem] };
  }

  throw new Error("Groq API response did not match the expected 3-idea schema.");
}
