import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single article by slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await db.article.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Get article error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت مقاله" },
      { status: 500 }
    );
  }
}

// PUT update article
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const {
      title,
      excerpt,
      content,
      coverImage,
      published,
      featured,
      readTime,
      metaTitle,
      metaDesc,
      categoryId,
      tagIds,
    } = body;

    const existing = await db.article.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    // Update tags: delete old, create new
    if (tagIds !== undefined) {
      await db.articleTag.deleteMany({
        where: { articleId: existing.id },
      });
    }

    const article = await db.article.update({
      where: { slug },
      data: {
        title,
        excerpt,
        content,
        coverImage,
        published,
        featured,
        readTime,
        metaTitle,
        metaDesc,
        categoryId,
        tags: tagIds !== undefined
          ? {
              create: tagIds.map((tagId: string) => ({ tagId })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی مقاله" },
      { status: 500 }
    );
  }
}

// DELETE article
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existing = await db.article.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    await db.article.delete({ where: { slug } });

    return NextResponse.json({ message: "مقاله حذف شد" });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "خطا در حذف مقاله" },
      { status: 500 }
    );
  }
}
