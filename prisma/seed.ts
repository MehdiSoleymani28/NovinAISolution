import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('🔍 Checking if database needs seeding...')

  const courseCount = await prisma.course.count()
  if (courseCount > 0) {
    console.log('✅ Database already has courses, skipping seed.')
    return
  }

  console.log('📦 Seeding database with initial data...')

  // Create default admin
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@novinaisolution.com' },
  })
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: 'admin@novinaisolution.com',
        password: 'admin123',
        name: 'مدیر NovinAI',
      },
    })
  }

  // Create default categories
  const categories = [
    { name: 'اتوماسیون و ورکفلو', slug: 'automation-workflow', color: '#3B82F6' },
    { name: 'دستیارهای هوشمند', slug: 'ai-agents', color: '#8B5CF6' },
    { name: 'ابزارهای AI', slug: 'ai-tools', color: '#10B981' },
    { name: 'پرامپت‌نویسی', slug: 'prompt-engineering', color: '#F59E0B' },
    { name: 'No-Code AI', slug: 'no-code-ai', color: '#EF4444' },
    { name: 'آموزش عملی', slug: 'practical-tutorial', color: '#06B6D4' },
  ]

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (!existing) await prisma.category.create({ data: cat })
  }

  // Create default tags
  const tags = [
    { name: 'ChatGPT', slug: 'chatgpt' },
    { name: 'Claude', slug: 'claude' },
    { name: 'Make', slug: 'make' },
    { name: 'n8n', slug: 'n8n' },
    { name: 'AI Agent', slug: 'ai-agent' },
    { name: 'RAG', slug: 'rag' },
    { name: 'LangChain', slug: 'langchain' },
    { name: 'اتوماسیون', slug: 'automation' },
    { name: 'ورکفلو', slug: 'workflow' },
    { name: 'پرامپت', slug: 'prompt' },
    { name: 'No-Code', slug: 'no-code' },
    { name: 'دستیار هوشمند', slug: 'assistant' },
    { name: 'چت‌بات', slug: 'chatbot' },
    { name: 'کسب‌وکار', slug: 'business' },
  ]

  for (const tag of tags) {
    const existing = await prisma.tag.findUnique({ where: { slug: tag.slug } })
    if (!existing) await prisma.tag.create({ data: tag })
  }

  // Create default courses
  const courses = [
    {
      title: 'کار حرفه‌ای با ChatGPT و Claude',
      slug: 'chatgpt-claude-professional',
      excerpt: 'یادگیری پرامپت‌نویسی حرفه‌ای و استفاده مؤثر از مدل‌های زبانی بزرگ. از نوشتن پرامپت‌های دقیق تا ساخت سیستم‌های پرامپت زنجیره‌ای.',
      content: '# کار حرفه‌ای با ChatGPT و Claude\n\nاین دوره جامع، شما رو از سطح مبتدی به یک کاربر حرفه‌ای مدل‌های زبانی بزرگ می‌رسونه.\n\n## آنچه یاد خواهید گرفت\n\n### بخش اول: آشنایی با مدل‌های زبانی\n- آشنایی با ChatGPT و Claude و تفاوت‌های اون‌ها\n- نحوه انتخاب مدل مناسب برای هر کاربرد\n\n### بخش دوم: پرامپت‌نویسی حرفه‌ای\n- اصول نوشتن پرامپت‌های مؤثر و دقیق\n- تکنیک‌های Chain-of-Thought و Few-Shot\n- پرامپت‌نویسی برای خروجی‌های ساختاریافته\n\n### بخش سوم: کاربرد در کسب‌وکار\n- تولید محتوای خودکار\n- تحلیل داده و گزارش‌نویسی با AI\n- ساخت سیستم‌های پاسخگویی هوشمند\n\n### بخش چهارم: پروژه عملی\n- ساخت یک سیستم تولید محتوا خودکار\n- پیاده‌سازی دستیار ایمیل هوشمند\n\n## پیشنیازها\nهیچ پیشنیاز فنی خاصی نیاز نیست.\n\n## مخاطبین\n- کارمندانی که می‌خوان کاراشون رو با AI سریع‌تر کنن\n- صاحبان کسب‌وکار که می‌خوان از AI استفاده کنن',
      category: 'مقدماتی',
      level: 'beginner',
      duration: '۸ ساعت',
      lessonsCount: 18,
      price: 'رایگان',
      features: JSON.stringify(['دسترسی مادام‌العمر به محتوای دوره', 'پروژه‌های عملی واقعی', 'پشتیبانی از مدرس', 'گواهی پایان دوره', 'به‌روزرسانی‌های رایگان']),
      syllabus: JSON.stringify([{ title: 'آشنایی با مدل‌های زبانی', lessons: 4 }, { title: 'پرامپت‌نویسی حرفه‌ای', lessons: 6 }, { title: 'کاربرد در کسب‌وکار', lessons: 4 }, { title: 'پروژه عملی', lessons: 4 }]),
      instructor: 'تیم نوین ای‌آی سولوشن',
      published: true,
      featured: true,
      order: 1,
    },
    {
      title: 'ساخت ورکفلو با Make و n8n',
      slug: 'make-n8n-workflow',
      excerpt: 'آموزش عملی ساخت جریان‌های کاری خودکار. از اتصال سرویس‌ها تا ساخت پایپ‌لاین‌های پیچیده پردازش داده.',
      content: '# ساخت ورکفلو با Make و n8n\n\nاین دوره عملی، شما رو قادر می‌سازه تا هر نوع فرآیند کاری رو خودکار کنید.\n\n## آنچه یاد خواهید گرفت\n\n### بخش اول: مقدمه اتوماسیون\n- مفهوم اتوماسیون و ورکفلو\n- آشنایی با Make و n8n\n\n### بخش دوم: ساخت ورکفلو با Make\n- رابط کاربری Make و نحوه کار با اون\n- اتصال سرویس‌های مختلف\n- ساخت سناریوهای خودکار\n\n### بخش سوم: ساخت ورکفلو با n8n\n- نصب و راه‌اندازی n8n\n- Node‌های مختلف و کاربردهای اون‌ها\n- ساخت ورکفلوهای پیچیده\n\n### بخش چهارم: پروژه‌های عملی\n- ورکفلو تولید خودکار محتوا\n- ورکفلو پاسخگویی هوشمند مشتری\n- ورکفلو گزارش‌دهی خودکار\n\n## پیشنیازها\nآشنایی اولیه با کامپیوتر و اینترنت. نیاز به دانش برنامه‌نویسی نیست.',
      category: 'عملی',
      level: 'intermediate',
      duration: '۱۲ ساعت',
      lessonsCount: 24,
      price: 'رایگان',
      features: JSON.stringify(['آموزش دو ابزار Make و n8n', 'بیش از ۱۰ پروژه عملی', 'قالب‌های ورکفلو آماده', 'پشتیبانی از مدرس', 'گواهی پایان دوره']),
      syllabus: JSON.stringify([{ title: 'مقدمه اتوماسیون', lessons: 3 }, { title: 'ساخت ورکفلو با Make', lessons: 7 }, { title: 'ساخت ورکفلو با n8n', lessons: 8 }, { title: 'پروژه‌های عملی', lessons: 6 }]),
      instructor: 'تیم نوین ای‌آی سولوشن',
      published: true,
      featured: true,
      order: 2,
    },
    {
      title: 'ساخت AI Agent سفارشی',
      slug: 'custom-ai-agent',
      excerpt: 'طراحی و پیاده‌سازی دستیارهای هوشمند اختصاصی. از ساخت Agent با LangChain تا پیاده‌سازی RAG و ابزارهای اختصاصی.',
      content: '# ساخت AI Agent سفارشی\n\nاین دوره پیشرفته، شما رو یاد می‌ده چطور دستیارهای هوشمند اختصاصی بسازید.\n\n## آنچه یاد خواهید گرفت\n\n### بخش اول: مفاهیم پایه AI Agent\n- تفاوت Chatbot و AI Agent\n- معماری یک AI Agent\n\n### بخش دوم: LangChain و LlamaIndex\n- آشنایی با LangChain و مفاهیم اون\n- ساخت Chain‌های سفارشی\n\n### بخش سوم: RAG\n- مفهوم RAG و چرا مهمه\n- آماده‌سازی دانش‌نامه\n- Embedding و Vector Database\n- پیاده‌سازی RAG عملی\n\n### بخش چهارم: ابزارهای اختصاصی\n- مفهوم Function Calling\n- ساخت ابزارهای سفارشی برای Agent\n\n### بخش پنجم: استقرار و نگهداری\n- استقرار Agent روی سرور\n- مانیتورینگ و لاگ‌گیری\n\n## پیشنیازها\n- آشنایی اولیه با برنامه‌نویسی (پایتون توصیه می‌شه)',
      category: 'پیشرفته',
      level: 'advanced',
      duration: '۱۸ ساعت',
      lessonsCount: 30,
      price: 'رایگان',
      features: JSON.stringify(['آموزش عملی LangChain و RAG', 'ساخت AI Agent کامل از صفر', 'کدهای آماده و قابل استفاده', 'پشتیبانی ویژه از مدرس', 'گواهی پایان دوره']),
      syllabus: JSON.stringify([{ title: 'مفاهیم پایه AI Agent', lessons: 5 }, { title: 'LangChain و LlamaIndex', lessons: 7 }, { title: 'RAG عملی', lessons: 7 }, { title: 'ابزارهای اختصاصی', lessons: 6 }, { title: 'استقرار و نگهداری', lessons: 5 }]),
      instructor: 'تیم نوین ای‌آی سولوشن',
      published: true,
      featured: true,
      order: 3,
    },
    {
      title: 'اتوماسیون کسب‌وکار عملی',
      slug: 'business-automation-practical',
      excerpt: 'پیاده‌سازی واقعی اتوماسیون در سناریوهای مختلف: تولید خودکار محتوا، پاسخگویی هوشمند مشتری، گزارش‌دهی خودکار.',
      content: '# اتوماسیون کسب‌وکار عملی\n\nاین دوره کاملاً کاربردی، شما رو مستقیماً وارد سناریوهای واقعی کسب‌وکار می‌کنه.\n\n## آنچه یاد خواهید گرفت\n\n### بخش اول: تولید خودکار محتوا\n- ساخت پایپ‌لاین تولید محتوای وبلاگ با AI\n- تولید خودکار پست شبکه‌های اجتماعی\n\n### بخش دوم: پاسخگویی هوشمند مشتری\n- ساخت چت‌بات ساده بدون کدنویسی\n- اتصال چت‌بات به دانش‌نامه شرکت\n\n### بخش سوم: گزارش‌دهی خودکار\n- جمع‌آوری خودکار داده از منابع مختلف\n- تولید گزارش‌های دوره‌ای با AI\n\n### بخش چهارم: مدیریت هوشمند اسناد\n- دسته‌بندی خودکار ایمیل‌ها و اسناد\n- استخراج اطلاعات از PDF و تصویر\n\n### بخش پنجم: یکپارچه‌سازی و اندازه‌گیری\n- اتصال اتوماسیون‌ها به هم\n- اندازه‌گیری بازدهی و ROI\n\n## پیشنیازها\n- آشنایی اولیه با AI و Make یا n8n',
      category: 'کاربردی',
      level: 'intermediate',
      duration: '۱۰ ساعت',
      lessonsCount: 20,
      price: 'رایگان',
      features: JSON.stringify(['سناریوهای واقعی کسب‌وکار', 'قالب‌های آماده اتوماسیون', 'پروژه‌های عملی متنوع', 'پشتیبانی از مدرس', 'گواهی پایان دوره']),
      syllabus: JSON.stringify([{ title: 'تولید خودکار محتوا', lessons: 5 }, { title: 'پاسخگویی هوشمند مشتری', lessons: 5 }, { title: 'گزارش‌دهی خودکار', lessons: 4 }, { title: 'مدیریت هوشمند اسناد', lessons: 3 }, { title: 'یکپارچه‌سازی و اندازه‌گیری', lessons: 3 }]),
      instructor: 'تیم نوین ای‌آی سولوشن',
      published: true,
      featured: true,
      order: 4,
    },
  ]

  for (const course of courses) {
    const existing = await prisma.course.findUnique({ where: { slug: course.slug } })
    if (!existing) await prisma.course.create({ data: course })
  }

  console.log('✅ Database seeded successfully!')
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
