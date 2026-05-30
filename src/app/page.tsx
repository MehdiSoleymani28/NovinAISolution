"use client";

import { Header } from "@/components/header";
import { TechBackground } from "@/components/tech-background";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
// import { TutorialsSection } from "@/components/tutorials-section"; // TODO: فعال‌سازی پس از تکمیل محتوا
import { ToolsSection } from "@/components/tools-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <TechBackground />
      <Header />
      <div className="flex-1 relative z-10">
        <HeroSection />
        <ServicesSection />
        {/* <TutorialsSection /> // TODO: فعال‌سازی پس از تکمیل محتوا */}
        <ToolsSection />
        <AboutSection />
        <ContactSection />
      </div>
      <ChatWidget />
      <Footer />
    </main>
  );
}
