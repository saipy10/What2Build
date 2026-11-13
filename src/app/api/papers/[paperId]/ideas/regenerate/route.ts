import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/paperService";
import { generateProjectIdeas, getConfiguredAiModel } from "@/lib/ai";
import { memoryDb } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  const { paperId } = await params;
  const configuredModel = getConfiguredAiModel();
  try {
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
          model: configuredModel,
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

    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from("idea_generations").insert({
          paper_id: paperId,
          status: "FAILED",
          model: configuredModel,
        });
      } catch (logErr) {
        console.warn("Failed logging failed regeneration to Supabase:", logErr);
      }
    }

    const lower = message.toLowerCase();
    const isLimitError =
      lower.includes("limit") ||
      lower.includes("rate") ||
      lower.includes("429") ||
      lower.includes("quota");

    const userMessage = isLimitError
      ? "API limits reached. Please try again later."
      : message;

    return NextResponse.json(
      { success: false, error: userMessage },
      { status: 500 }
    );
  }
}
