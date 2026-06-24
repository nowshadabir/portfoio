"use client";

import React, { useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";

// Mock Data
const projectsData: Record<string, any> = {
  "finde": {
    name: "Finde",
    logoInitial: "F",
    category: "MOBILE APP DESIGN",
    year: "2026",
    descriptionHtml: `<b>Finde (User App)</b> is a consumer-facing platform focused on discovery, real-time utility, and social interaction.<br/><br/>
    <h3 class="text-xl font-bold mt-6 mb-2">Event Discovery Module</h3>
    <p class="mb-4">Features an <b>Activity Hub</b> to view "Where & When," venue facilities, and linked food offers. It ensures transparency with clear ticket prices and organizer profiles, driven by a Smart Calendar with date and location filters.</p>
    <h3 class="text-xl font-bold mt-6 mb-2">Food & Discount Hub</h3>
    <p class="mb-4">Provides live merchant offers directly via Finde Business, third-party aggregator integration, and an algorithm-driven personalized "For You" feed. Includes a unique <b>Live Vibe Check</b> for real-time visibility of a merchant’s "Free/Busy" status.</p>
    <h3 class="text-xl font-bold mt-6 mb-2">Engagement & Rewards</h3>
    <p class="mb-4">Gamification mechanics ensure high-quality user contributions through a robust review system. Users earn <b>Finde Points</b> for interactions, which unlock exclusive loyalty tiers and private deals.</p>
    <h3 class="text-xl font-bold mt-6 mb-2">Community & Content (The Feed)</h3>
    <p>A social media layer designed to drive organic growth. It features a scrolling feed for sharing experiences, smart tagging for merchants and friends, and full interaction capabilities. <b>Finde Groups</b> allow users to coordinate social meetups with capacity management and join requests.</p>`,
    services: [
      "Product Strategy",
      "UI/UX Design",
      "Mobile App Design",
      "Interaction Design"
    ],
    challenge: "Designing a unified mobile interface that seamlessly balances a powerful event/food discovery engine with deep social engagement and gamified rewards, all without overwhelming the user.",
    role: "Lead Product Designer responsible for architecting the entire mobile application journey, from core discovery flows to community engagement layers.",
    uiImages: [
      "/project-contents/finde/images/finde-home-light.jpeg",
      "/project-contents/finde/images/finde-home-dark.jpeg",
      "/project-contents/finde/images/finde-explore-light.jpeg",
      "/project-contents/finde/images/finde-explore-dark.jpeg",
      "/project-contents/finde/images/finde-profile-light.jpeg",
      "/project-contents/finde/images/finde-profile-dark.jpeg"
    ]
  },
  "understood": {
    name: "Understood",
    logoInitial: "U",
    category: "PRODUCT DESIGN | VISUAL BRANDING",
    year: "2026",
    descriptionHtml: `<b>Understood</b> is a learning insights platform used primarily across <b>Belgium and Netherlands</b> that helps parents better interpret a child's academic progress through simplified visualizations and contextual feedback. The system was designed to reduce cognitive overload while making educational performance more transparent and meaningful.`,
    services: [
      "Product design",
      "Visual branding",
      "Graphic design",
      "Interaction design"
    ],
    challenge: "Parents lack a reliable way to understand whether a child has genuinely understood daily lessons beyond verbal reassurance or test scores. The challenge was to design a simple, interpretable system that helps surface comprehension gaps early while making learning progress more visible and actionable.",
    role: "Sole designer responsible for the complete product experience. from branding and visual systems to UX flows, interaction decisions, and high-fidelity interfaces."
  },
  "rameshwaram-cafe": {
    name: "The Rameshwaram Cafe",
    logoIcon: true, // we can render an SVG
    category: "MARKETING WEBSITE",
    year: "2025",
    descriptionHtml: `<b>The Rameshwaram Cafe</b> is a premium South Indian quick-service restaurant chain that needed a digital presence to match its monumental offline popularity. The objective was to create a high-performance marketing website that tells their story and facilitates easy menu exploration.`,
    services: ["Web Design", "Development", "Brand Strategy"],
    challenge: "Translating the chaotic, vibrant energy of a bustling South Indian cafe into a structured, elegant digital experience without losing its authentic charm.",
    role: "Lead Developer and Technical Architect."
  },
  "hatti-kaapi": {
    name: "Hatti Kaapi",
    logoInitial: "H",
    category: "E-COMMERCE",
    year: "2025",
    descriptionHtml: `<b>Hatti Kaapi</b> required a modern e-commerce overhaul to scale their packaged coffee sales nationally. The platform needed to feel artisanal yet function with the efficiency of a modern D2C brand.`,
    services: ["E-Commerce Strategy", "UI/UX Design", "Shopify Development"],
    challenge: "Creating a seamless checkout flow while educating customers on the nuances of traditional filter coffee.",
    role: "UI/UX Designer and Shopify Expert."
  },
  "echo-systems": {
    name: "Echo Systems",
    logoIcon: true,
    category: "SAAS DASHBOARD",
    year: "2024",
    descriptionHtml: `<b>Echo Systems</b> provides enterprise-grade data monitoring. The dashboard needed a complete redesign to handle massive data density without overwhelming the user.`,
    services: ["UX Research", "Dashboard Design", "Design System"],
    challenge: "Visualizing complex, multi-layered data sets in a way that is instantly readable for executives while remaining detailed enough for analysts.",
    role: "Product Designer."
  }
};

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const project = projectsData[resolvedParams.id];

  // If project doesn't exist, show 404
  if (!project) {
    notFound();
  }

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SmoothScroll>
      {/* Entry Transition Overlay */}
      <motion.div
        className="fixed top-0 left-0 right-0 bg-[#1e1e1e] z-[99999] pointer-events-none"
        initial={{ height: "100vh", borderBottomLeftRadius: "0%", borderBottomRightRadius: "0%" }}
        animate={{ height: "0vh", borderBottomLeftRadius: "100%", borderBottomRightRadius: "100%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <main className="min-h-screen bg-[#F5F5F3] text-[#111] pt-24 pb-32 px-6 sm:px-12 md:px-20 selection:bg-[#FCE145] selection:text-[#111]">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Breadcrumbs */}
          <Link href="/#projects" className="inline-flex items-center gap-2 text-[#555] hover:text-[#111] transition-colors mb-24 font-medium tracking-wide">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Projects / <span className="text-[#111] font-bold">{project.name}</span>
          </Link>

          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
            {/* Left: Logo & Name */}
            <div className="flex items-center gap-6">
              {project.logoInitial ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#111] rounded-[16px] text-white flex items-center justify-center text-3xl sm:text-4xl font-bold tracking-tighter">
                  {project.logoInitial}
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#111] rounded-full flex items-center justify-center text-[#111]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 22h20L12 2zm0 4l6 14H6l6-14z"/></svg>
                </div>
              )}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight">
                {project.name}
              </h1>
            </div>

            {/* Right: Category & Year */}
            <div className="text-left md:text-right">
              <h3 className="text-lg sm:text-xl font-bold tracking-widest uppercase text-[#111]">
                {project.category}
              </h3>
              <p className="text-lg sm:text-xl font-mono text-[#555] mt-2">
                {project.year}
              </p>
            </div>
          </div>

          <hr className="border-[#D6D6D6] mb-20" />

          {/* Description */}
          <div className="mb-24">
            <p 
              className="text-2xl sm:text-3xl md:text-4xl leading-[1.4] text-[#333] font-medium max-w-5xl"
              dangerouslySetInnerHTML={{ __html: project.descriptionHtml }}
            />
          </div>

          {/* Services */}
          <div className="mb-24">
            <h4 className="text-2xl font-bold mb-6">Services:</h4>
            <div className="flex flex-wrap gap-4">
              {project.services.map((service: string, index: number) => (
                <span 
                  key={index}
                  className="px-6 py-2.5 rounded-full border border-[#D6D6D6] text-base font-medium text-[#111] bg-transparent"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Challenge & Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h4 className="text-2xl font-bold mb-6">Challenge:</h4>
              <p className="text-lg leading-relaxed text-[#333] font-medium">
                {project.challenge}
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-6">Role:</h4>
              <p className="text-lg leading-relaxed text-[#333] font-medium">
                {project.role}
              </p>
            </div>
          </div>

          {/* UI Showcase */}
          {project.uiImages && (
            <div className="mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <h4 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-[#111]">
                  UI Showcase
                </h4>
                <p className="text-lg font-mono text-[#555] max-w-sm">
                  A glimpse into the core screens and design system of the application.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {project.uiImages.map((src: string, index: number) => (
                  <div key={index} className="w-full aspect-[9/19.5] rounded-[32px] overflow-hidden border-8 border-[#111] bg-[#111] shadow-2xl group cursor-crosshair">
                    <img 
                      src={src} 
                      alt={`${project.name} UI Screen ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-[24px]" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </SmoothScroll>
  );
}
