import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/paperService";
import { generateProjectIdeas } from "@/lib/ai";
import { memoryDb } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Replace in Supabase only on success
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from("project_ideas").delete().eq("paper_id", paperId);

        const rowsToInsert = formattedIdeas.map((idea) => ({
          paper_id: paperId,
          title: idea.title,
          description: idea.description,
          features: idea.features,
          skills: idea.skills,
          technologies: idea.technologies,
          difficulty: idea.difficulty,
          research_connection: idea.researchConnection,
        }));

        await supabaseAdmin.from("project_ideas").insert(rowsToInsert);

        await supabaseAdmin.from("idea_generations").insert({
          paper_id: paperId,
          status: "SUCCESS",
          model: "openai/gpt-oss-120b",
        });
      } catch (err) {
        console.warn("Failed persisting regenerated ideas to Supabase:", err);
      }
    }

    // Save in memory store
    memoryDb.saveIdeas(paperId, formattedIdeas);

    return NextResponse.json({
      success: true,
      ideas: formattedIdeas,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to regenerate project ideas";
    console.error("Regenerate ideas error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
