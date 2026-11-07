import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/paperService";
import { generateProjectIdeas } from "@/lib/ai";
import { prisma, memoryDb } from "@/lib/db";

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

    // Explicitly generate fresh AI ideas
    const result = await generateProjectIdeas({
      title: paper.title,
      description: paper.description,
      companyName: "company" in paper && paper.company ? paper.company.name : "AI Research Org",
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

    // Replace in Prisma only on success
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
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          },
        });
      } catch (err) {
        console.warn("Failed persisting regenerated ideas in Prisma:", err);
      }
    }

    // Replace in memory store
    memoryDb.saveIdeas(paperId, formattedIdeas);

    return NextResponse.json({
      success: true,
      message: "Regenerated project ideas successfully",
      ideas: formattedIdeas,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to regenerate project ideas";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
