import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Split text content into chunks of ~500 characters,
 * respecting paragraph and sentence boundaries.
 */
function splitIntoChunks(text: string, maxChunkSize = 500): string[] {
  const chunks: string[] = [];

  // First, split by paragraphs (double newlines or single newlines)
  const paragraphs = text
    .split(/\n{1,2}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If adding the whole paragraph fits, add it
    if (currentChunk.length + paragraph.length + 1 <= maxChunkSize) {
      currentChunk = currentChunk ? currentChunk + "\n" + paragraph : paragraph;
    } else {
      // Save current chunk if not empty
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }

      // If the paragraph itself is too long, split by sentences
      if (paragraph.length > maxChunkSize) {
        const sentences = paragraph.split(/(?<=[.!?؟。])\s+/);
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length + 1 <= maxChunkSize) {
            currentChunk = currentChunk
              ? currentChunk + " " + sentence
              : sentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
            }
            // If a single sentence is longer than maxChunkSize, force split it
            if (sentence.length > maxChunkSize) {
              let remaining = sentence;
              while (remaining.length > 0) {
                const slice = remaining.slice(0, maxChunkSize);
                chunks.push(slice);
                remaining = remaining.slice(maxChunkSize);
              }
              currentChunk = "";
            } else {
              currentChunk = sentence;
            }
          }
        }
      } else {
        currentChunk = paragraph;
      }
    }
  }

  // Push remaining content
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// GET: List all KnowledgeEntry records with chunk count
export async function GET() {
  try {
    const entries = await db.knowledgeEntry.findMany({
      include: {
        _count: {
          select: { chunks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      source: entry.source,
      sourceType: entry.sourceType,
      chunkCount: entry._count.chunks,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get knowledge entries error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات دانش" },
      { status: 500 }
    );
  }
}

// POST: Create a new knowledge entry with text content and auto-chunk
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, source, sourceType } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "عنوان و محتوا الزامی است" },
        { status: 400 }
      );
    }

    // Create the knowledge entry
    const entry = await db.knowledgeEntry.create({
      data: {
        title,
        content,
        source: source || null,
        sourceType: sourceType || "text",
      },
    });

    // Split content into chunks
    const chunks = splitIntoChunks(content);

    // Create chunk records
    if (chunks.length > 0) {
      await db.knowledgeChunk.createMany({
        data: chunks.map((chunkContent, index) => ({
          entryId: entry.id,
          content: chunkContent,
          chunkIndex: index,
        })),
      });
    }

    // Return the entry with chunk count
    const result = await db.knowledgeEntry.findUnique({
      where: { id: entry.id },
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });

    return NextResponse.json(
      {
        ...result,
        chunkCount: result?._count.chunks ?? 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create knowledge entry error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد اطلاعات دانش" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a knowledge entry and all its chunks
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "شناسه اطلاعات دانش الزامی است" },
        { status: 400 }
      );
    }

    const existing = await db.knowledgeEntry.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "اطلاعات دانش یافت نشد" },
        { status: 404 }
      );
    }

    // Chunks will be deleted automatically due to onDelete: Cascade
    await db.knowledgeEntry.delete({ where: { id } });

    return NextResponse.json({ message: "اطلاعات دانش با موفقیت حذف شد" });
  } catch (error) {
    console.error("Delete knowledge entry error:", error);
    return NextResponse.json(
      { error: "خطا در حذف اطلاعات دانش" },
      { status: 500 }
    );
  }
}
