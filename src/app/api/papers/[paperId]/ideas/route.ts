import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/paperService";
import { generateProjectIdeas } from "@/lib/ai";
import { prisma, memoryDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;

    // Check Prisma DB
    if (prisma) {
      try {
        const ideas = await prisma.projectIdea.findMany({
          where: { paperId },
          orderBy: { createdAt: "asc" },
        });

        if (ideas.length > 0) {
          return NextResponse.json({
            success: true,
            source: "cache",
            ideas,
          });
        }
      } catch (err) {
        console.warn("Prisma error getting ideas:", err);
      }
    }

    // Check in-memory store
    const memIdeas = memoryDb.getIdeasByPaperId(paperId);
    return NextResponse.json({
      success: true,
      source: memIdeas.length ? "cache" : "empty",
      ideas: memIdeas,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch project ideas";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(
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

    // Generate fresh ideas with Groq API (no silent templates)
    const result = await generateProjectIdeas({
      title: paper.title,
      description: paper.description,
      companyName: "company" in paper && paper.company ? paper.company.name : "AI Lab",
      sourceUrl: paper.sourceUrl,
      authors: paper.authors || [],
    });

    const now = new Date();
    const formattedIdeas = result.ideas.map((item, idx) => ({
      id: `${paperId}-idea-${idx + 1}-${Date.now()}`,
      paperId,
      title: item.title,
      description: item.description,
      features: item.features,
      skills: item.skills,
      technologies: item.technologies,
      difficulty: item.difficulty,
      researchConnection: item.researchConnection,
      createdAt: now,
      updatedAt: now,
    }));

    // Persist in Prisma if available
    if (prisma) {
      try {
        await prisma.projectIdea.deleteMany({ where: { paperId } });
        for (const idea of formattedIdeas) {
          await prisma.projectIdea.create({
            data: {
              paperId,
              title: idea.title,
              description: idea.description,
              features: idea.features,
              skills: idea.skills,
              technologies: idea.technologies,
              difficulty: idea.difficulty,
              researchConnection: idea.researchConnection,
            },
          });
        }
        await prisma.ideaGeneration.create({
          data: {
            paperId,
            status: "SUCCESS",
            model: "openai/gpt-oss-120b",
          },
        });
      } catch (err) {
        console.warn("Failed persisting ideas to Prisma:", err);
      }
    }

    // Persist in memory store
    memoryDb.saveIdeas(paperId, formattedIdeas);

    return NextResponse.json({
      success: true,
      source: "generated",
      ideas: formattedIdeas,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate project ideas";
    console.error("Project ideas generation error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
