import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all articles (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get articles error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت مقالات" },
      { status: 500 }
    );
  }
}

// POST create article
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
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

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "عنوان، اسلاگ و محتوا الزامی است" },
        { status: 400 }
      );
    }

    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "این اسلاگ قبلاً استفاده شده است" },
        { status: 400 }
      );
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published: published || false,
        featured: featured || false,
        readTime: readTime || 5,
        metaTitle,
        metaDesc,
        categoryId,
        tags: tagIds?.length
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

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد مقاله" },
      { status: 500 }
    );
  }
}
