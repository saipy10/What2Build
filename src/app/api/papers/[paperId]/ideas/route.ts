import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/paperService";
import { generateProjectIdeas } from "@/lib/ai";
import { memoryDb } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;

    // Check Supabase
    if (supabaseAdmin) {
      try {
        const { data: ideas, error } = await supabaseAdmin
          .from("project_ideas")
          .select("*")
          .eq("paper_id", paperId)
          .order("created_at", { ascending: true });

        if (!error && ideas && ideas.length > 0) {
          return NextResponse.json({
            success: true,
            source: "cache",
            ideas: ideas.map((i) => ({
              id: i.id,
              paperId: i.paper_id,
              title: i.title,
              description: i.description,
              features: i.features || [],
              skills: i.skills || [],
              technologies: i.technologies || [],
              difficulty: i.difficulty,
              researchConnection: i.research_connection,
              createdAt: i.created_at,
              updatedAt: i.updated_at,
            })),
          });
        }
      } catch (err) {
        console.warn("Supabase error getting ideas:", err);
      }
    }

    // Fallback: Check in-memory store
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

    // Generate fresh ideas with AI
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

    // Persist to Supabase if available
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
        console.warn("Failed persisting ideas to Supabase:", err);
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
