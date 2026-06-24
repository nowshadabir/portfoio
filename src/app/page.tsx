"use client";

import React, { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";
import VivagoOverlay from "@/components/VivagoOverlay";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(href);
    }, 600);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerControls = useAnimation();
  const liquidControls = useAnimation();
  const textControls = useAnimation();
  const homeControls = useAnimation();
  const restControls = useAnimation();
  
  const [isSectionTransitioning, setIsSectionTransitioning] = useState(false);
  const columnControls = useAnimation();
  
  const mainRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isTransitioning || isSectionTransitioning) return;
    
    setIsSectionTransitioning(true);

    if (isMenuOpen) {
      handleToggle();
      // Wait for menu close animation to start
      await new Promise(r => setTimeout(r, 200));
    }

    // 1. Wipe IN (5 columns down)
    await columnControls.start(i => ({
      scaleY: 1,
      transformOrigin: "top",
      transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
    }));

    // 2. Jump to target
    const targetId = href.startsWith('/') ? href.substring(1) : href;
    const isHash = targetId.startsWith('#');
    const target = isHash ? document.querySelector(targetId) : null;
    
    if (target) {
      const yPos = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: yPos, behavior: 'instant' });
    } else if (href === '#home' || href === '/') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    await new Promise(r => setTimeout(r, 100));

    // 3. Wipe OUT (5 columns shrink down)
    await columnControls.start(i => ({
      scaleY: 0,
      transformOrigin: "bottom",
      transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
    }));

    setIsSectionTransitioning(false);
  };

  useGSAP(() => {
    // --- Intro Timeline ---
    const introTl = gsap.timeline();

    document.body.style.overflow = "hidden";

    gsap.set('.intro-signature', { top: "50%", xPercent: -50, yPercent: -50, scale: 2 });
    gsap.set('.hero-content', { opacity: 0 });

    introTl.to('.signature-path', {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      delay: 0.2
    });

    introTl.to('.intro-signature', {
      top: "15%",
      yPercent: 0,
      scale: 1,
      duration: 1,
      ease: "power3.inOut"
    }, "+=0.2");

    introTl.to('.hero-content', {
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      onComplete: () => {
        document.body.style.overflow = "";
      }
    }, "-=0.5");

    // --- Main Scroll Timeline ---
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 2.5,
      }
    });

    // 1. Hero Section sliding up
    mainTl.to('.hero-section', { yPercent: -100, ease: "none", duration: 1 }, 0);

    // 2. Yellow Section parallax
    mainTl.fromTo('.parallax-bg', { yPercent: 0 }, { yPercent: -20, ease: "none", duration: 4.5 }, 0);
    mainTl.fromTo('.parallax-float', { yPercent: 40 }, { yPercent: -20, ease: "none", duration: 4.5 }, 0);

    // 3. Dark Section sliding up (ends at 2.5)
    mainTl.to('.dark-section', { yPercent: -100, ease: "none", duration: 1 }, 1.5);
    
    // 4. Dark Section text reveal (starts strictly AFTER sliding stops with a pause)
    mainTl.fromTo('.dark-word', 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        stagger: 0.2,
        ease: "power1.inOut"
      }, 
      3.0 // Guaranteed pause from 2.5 to 3.0 where user scrolls but nothing moves
    );

    // 5. Dark Section SVG Line Draw
    mainTl.fromTo('.dark-line-path', 
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" }, 
      3.5
    );

    // 6. About Section sliding up
    mainTl.to('.about-section', { yPercent: -100, ease: "none", duration: 1 }, 4.5);

    // 7. About Section Scrolling Timeline
    mainTl.to('.experience-list', 
      { y: "-100%", ease: "none", duration: 3.5 },
      5.5
    );

  }, { scope: mainRef });

  const handleToggle = async () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      
      // Close Sequence
      // 1. Hide text quickly
      homeControls.start({ opacity: 0, y: 10, transition: { duration: 0.2 } });
      restControls.start({ opacity: 0, y: 10, transition: { duration: 0.2 } });
      
      // 2. Shrink height
      textControls.start({ bottom: 16, left: 26, right: 26, color: "#000000", transition: { type: "spring", stiffness: 120, damping: 22 } });
      liquidControls.start({ height: "0%", borderTopLeftRadius: "100%", borderTopRightRadius: "100%", transition: { type: "spring", stiffness: 120, damping: 22 } });
      await containerControls.start({ height: 52, transition: { type: "spring", stiffness: 120, damping: 22 } });
      
      // 3. Shrink width
      await containerControls.start({ width: 130, borderRadius: 26, transition: { type: "spring", stiffness: 120, damping: 22 } });
      
    } else {
      setIsMenuOpen(true);
      
      // Open Sequence
      // 1. Expand width
      const expandedWidth = typeof window !== 'undefined' ? Math.min(480, window.innerWidth - 32) : 480;
      await containerControls.start({ width: expandedWidth, transition: { type: "spring", stiffness: 120, damping: 20 } });
      
      // 2. Expand height
      textControls.start({ bottom: 20, left: 24, right: 24, color: "#ffffff", transition: { type: "spring", stiffness: 100, damping: 20 } });
      liquidControls.start({ height: "101%", borderTopLeftRadius: "0%", borderTopRightRadius: "0%", transition: { type: "spring", stiffness: 100, damping: 20 } });
      containerControls.start({ height: 160, borderRadius: 32, transition: { type: "spring", stiffness: 100, damping: 20 } });
      
      // Wait for height to mostly finish
      await new Promise(r => setTimeout(r, 400));
      
      // 3. Show HOME
      await homeControls.start({ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } });
      
      // 4. Show the rest from left to right
      restControls.start(i => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.15, ease: "easeOut" } }));
    }
  };

  return (
    <main id="home" ref={mainRef} className="relative bg-[#FCE145] text-[#111]">
      <div className="scroll-container h-[600vh] md:h-[1000vh] w-full relative">
        <div id="about" className="absolute top-[61.11%] left-0 w-full h-1 pointer-events-none" />
        
        {/* Sticky viewport container */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          
          {/* Second Section (Yellow Reveal) */}
          <section className="absolute inset-0 z-0 bg-[#FCE145] overflow-hidden flex flex-col items-center justify-center">
            {/* Halftone Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
            
            {/* White Brush Strokes */}
            <svg className="absolute w-[120%] max-w-[1200px] h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 text-white parallax-float" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M-50 150 Q 50 20 150 150 T 350 150 T 550 50 T 750 150 T 900 80" stroke="white" strokeWidth="25" strokeLinecap="round" fill="none" style={{ filter: 'url(#rough)' }}/>
               <defs>
                 <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" /></filter>
               </defs>
            </svg>

            {/* Portrait Image (Full Background) */}
            <img src="/portrait.png" alt="Portrait" className="absolute inset-0 w-full h-full object-cover scale-[1.2] parallax-bg z-10 origin-top" />

            {/* Floating Glass Pills */}
            <div className="absolute bottom-[140px] left-0 w-full px-4 flex flex-wrap justify-center gap-3 z-20 pointer-events-auto sm:pointer-events-none sm:bottom-0 sm:h-full sm:block sm:px-0">
              
              {/* UI/UX Developer */}
              <div className="relative sm:absolute sm:top-[30%] sm:left-[10%] group parallax-float hover:scale-105 sm:hover:scale-110 transition-transform duration-500 cursor-default pointer-events-auto">
                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full group-hover:bg-blue-500/50 transition-colors"></div>
                <div className="relative bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-full text-xs sm:text-lg font-medium shadow-2xl flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </div>
                  UI/UX Designer
                </div>
              </div>

              {/* Creative Developer */}
              <div className="relative sm:absolute sm:bottom-[20%] sm:left-[20%] group parallax-float hover:scale-105 sm:hover:scale-110 transition-transform duration-500 cursor-default pointer-events-auto" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full group-hover:bg-green-500/50 transition-colors"></div>
                <div className="relative bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-full text-xs sm:text-lg font-medium shadow-2xl flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </div>
                  Frontend Developer
                </div>
              </div>

              {/* Full-Stack Engineer */}
              <div className="relative sm:absolute sm:top-[45%] sm:right-[10%] group parallax-float hover:scale-105 sm:hover:scale-110 transition-transform duration-500 cursor-default pointer-events-auto" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full group-hover:bg-purple-500/50 transition-colors"></div>
                <div className="relative bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-full text-xs sm:text-lg font-medium shadow-2xl flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  </div>
                  Performance Engineer
                </div>
              </div>

            </div>

          </section>

          {/* Dark Charcoal Section */}
          <section className="dark-section absolute top-[100vh] left-0 z-10 bg-[#121212] h-screen w-full overflow-hidden flex flex-col items-center justify-center border-t border-[#222]">
            {/* Dot Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 2px, transparent 2px)', backgroundSize: '36px 36px' }}></div>

            {/* Floating Icons (Moved to full screen relative) */}
            {/* Figma Logo (Top-Left on Mobile, Mid-Left Desktop) */}
            <div className="absolute top-[12%] left-[8%] sm:top-[50%] sm:-translate-y-1/2 sm:left-[5%] lg:left-[10%] dark-parallax-icon z-20 opacity-90 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] scale-[0.8] sm:scale-100 origin-center" data-speed="0.8">
              <svg width="76" height="114" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19C14.7467 19 19 23.2533 19 28.5Z" fill="#1ABCFE"/>
                <path d="M0 47.5C0 52.7467 4.25329 57 9.5 57C14.7467 57 19 52.7467 19 47.5V38H9.5C4.25329 38 0 42.2533 0 47.5Z" fill="#0ACF83"/>
                <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
                <path d="M19 19V38H28.5C33.7467 38 38 33.7467 38 28.5C38 23.2533 33.7467 19 28.5 19H19Z" fill="#F24E1E"/>
                <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#A259FF"/>
              </svg>
            </div>

            {/* Space Invader (Top-Right on Mobile, Top-Right Desktop) */}
            <div className="absolute top-[8%] right-[8%] sm:top-[25%] sm:right-[5%] lg:right-[15%] dark-parallax-icon z-20 opacity-100 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] scale-[0.8] sm:scale-100 origin-center" data-speed="1.4">
               <svg width="88" height="64" viewBox="0 0 11 8" fill="#D97A52" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
                  <rect x="2" y="0" width="1" height="1"/>
                  <rect x="8" y="0" width="1" height="1"/>
                  <rect x="3" y="1" width="1" height="1"/>
                  <rect x="7" y="1" width="1" height="1"/>
                  <rect x="2" y="2" width="7" height="1"/>
                  <rect x="1" y="3" width="2" height="1"/>
                  <rect x="4" y="3" width="3" height="1"/>
                  <rect x="8" y="3" width="2" height="1"/>
                  <rect x="0" y="4" width="11" height="1"/>
                  <rect x="0" y="5" width="1" height="1"/>
                  <rect x="2" y="5" width="1" height="1"/>
                  <rect x="8" y="5" width="1" height="1"/>
                  <rect x="10" y="5" width="1" height="1"/>
                  <rect x="0" y="6" width="1" height="1"/>
                  <rect x="2" y="6" width="1" height="1"/>
                  <rect x="8" y="6" width="1" height="1"/>
                  <rect x="10" y="6" width="1" height="1"/>
                  <rect x="3" y="7" width="2" height="1"/>
                  <rect x="6" y="7" width="2" height="1"/>
               </svg>
            </div>

            {/* Pen Tool Icon (Bottom-Right on Mobile, Bottom-Right Desktop) */}
            <div className="absolute bottom-[20%] right-[10%] sm:bottom-[20%] sm:right-[10%] lg:right-[20%] -rotate-12 dark-parallax-icon z-20 opacity-90 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] scale-[0.8] sm:scale-100 origin-center" data-speed="1.1">
               <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="#1a1a1a" stroke="#A3AC4C" strokeWidth="1.5"/>
                  <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                  <path d="M2 2l7.586 7.586"/>
                  <circle cx="11" cy="11" r="2" fill="#D97A52" stroke="none"/>
               </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-[1200px] px-8 text-center mt-[-5vh] sm:mt-0">
              {/* Headline Text */}
              <h2 className="dark-headline text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#f5f5f5] leading-[1.2] sm:leading-[1.15] relative z-10 flex flex-wrap justify-center gap-x-2 sm:gap-x-5 gap-y-1 sm:gap-y-4 px-2 sm:px-0 mt-8 sm:mt-0">
                {"4+ years of designing and developing seamless user".split(' ').map((word, i) => (
                  <span key={`static-${i}`} className="inline-block">{word}</span>
                ))}
                {"experiences that stand".split(' ').map((word, i) => (
                  <span key={`fade-${i}`} className="inline-block dark-word">{word}</span>
                ))}
                <span className="inline-block relative dark-word">
                  out.
                  {/* SVG Squiggly Line starting from 'out.' */}
                  <svg 
                    className="dark-line absolute top-[85%] right-[62%] pointer-events-none z-[-1]" 
                    width="1000" height="300"
                    viewBox="0 0 1000 300"
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      className="dark-line-path"
                      d="M 1000 0 C 1000 40, 990 80, 960 90 C 930 100, 910 60, 880 60 C 850 60, 820 160, 750 160 C 680 160, 620 80, 550 100 C 480 120, 250 250, 0 280" 
                      stroke="#f5f5f5" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      pathLength="1"
                      style={{ strokeDasharray: '1', strokeDashoffset: '1' }}
                    />
                  </svg>
                </span>
              </h2>
            </div>
          </section>

          {/* Hero Section (White Foreground Mask) */}
          <section 
            className="hero-section absolute top-0 left-0 z-20 bg-[var(--background)] w-full h-[calc(100vh+200px)] shadow-[0_20px_50px_rgba(0,0,0,0.1)]" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 60px), 80% calc(100% - 60px), 80% 100%, 65% 100%, 65% calc(100% - 150px), 35% calc(100% - 150px), 35% calc(100% - 40px), 20% calc(100% - 40px), 20% calc(100% - 90px), 0 calc(100% - 90px))' }}
          >
            
            <div className="bg-grid absolute inset-0 z-0 pointer-events-none"></div>

            {/* Inner Wrapper to keep content exactly centered in the first 100vh */}
            <div className="w-full h-[100vh] flex flex-col items-center justify-center relative z-10">
              
              {/* Top Squiggle / Signature */}
              <div className="intro-signature absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2] z-20">
                <svg 
                  width="200" 
                  height="80" 
                  viewBox="0 0 200 80" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-80"
                >
                  <path 
                    className="signature-path"
                    d="M 15 65 C 15 25, 30 15, 30 45 C 30 55, 40 45, 45 60 C 50 50, 60 50, 60 60 C 60 70, 75 60, 80 60 L 95 50 L 80 65 L 105 65 C 115 55, 115 45, 125 55 M 125 40 L 125 43" 
                    stroke="#D97A52" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    pathLength="1"
                    style={{ strokeDasharray: '1', strokeDashoffset: '1' }}
                  />
                </svg>
              </div>

              {/* Main Center Content */}
              <div className="w-full flex flex-col items-center justify-center relative z-10 px-6 sm:px-12 xl:px-0 -mt-10 gap-8">
                
                {/* Center Title */}
                <div className="flex flex-col items-center text-center px-0 shrink-0 hero-content opacity-0 z-10">
                  <h1 className="font-display font-bold leading-[0.85] tracking-[-0.04em] text-[#1a1a1a] flex flex-col items-center uppercase">
                    <div className="relative flex justify-center">
                      {"Nowshad".split("").map((letter, index) => (
                        <motion.span 
                          key={index}
                          className="inline-block text-[clamp(4rem,15vw,12rem)] text-[#1a1a1a] origin-bottom"
                          animate={{
                            y: [0, -8, 0],
                            scaleY: [1, 1.05, 1],
                            rotate: [0, -2, 0]
                          }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 4,
                            delay: index * 0.04
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </h1>
                </div>

                {/* Subtitles (Under NOWSHAD) */}
                <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 hero-content opacity-0 mt-2 px-4 z-20">
                  {/* Left Section */}
                  <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 w-full sm:flex-1">
                    <div className="h-[1px] bg-black/20 flex-1 block sm:hidden max-w-[50px]"></div>
                    <span className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#555] whitespace-nowrap">
                      Web Designer
                    </span>
                    <div className="h-[1px] bg-black/20 flex-1 hidden sm:block"></div>
                    <div className="h-[1px] bg-black/20 flex-1 block sm:hidden max-w-[50px]"></div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6 w-full sm:flex-1">
                    <div className="h-[1px] bg-black/20 flex-1 block sm:hidden max-w-[50px]"></div>
                    <div className="h-[1px] bg-black/20 flex-1 hidden sm:block"></div>
                    <span className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#555] whitespace-nowrap">
                      Based in Dhaka, Bangladesh
                    </span>
                    <div className="h-[1px] bg-black/20 flex-1 block sm:hidden max-w-[50px]"></div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* About Section (Monolith Timeline - Light Theme) */}
          <section className="about-section absolute top-[100vh] left-0 z-30 bg-[#F9F9F9] h-screen w-full overflow-hidden border-t border-[#E5E5E5]">
            {/* Ambient Background Noise */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
              
              {/* Left Side: Sticky Header */}
              <div className="w-full md:w-5/12 h-auto md:h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 md:py-0 border-b md:border-b-0 md:border-r border-black/10 relative z-20 bg-[#F9F9F9]">
                {/* Subtle Glow */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#FCE145]/60 blur-[100px] rounded-full pointer-events-none"></div>
                <h2 className="text-5xl sm:text-7xl lg:text-[6rem] font-display font-bold text-[#111] leading-[0.85] tracking-tight uppercase">
                  The <br/>
                  <span className="text-[#111] bg-[#FCE145] px-4 py-2 inline-block mt-4 rounded-lg">Journey</span>
                </h2>
                <div className="mt-10 h-[3px] w-16 bg-[#111]"></div>
              </div>

              {/* Right Side: Scrolling Timeline */}
              <div className="w-full md:w-7/12 h-full relative overflow-hidden pointer-events-auto">
                <div className="experience-list absolute top-[50vh] w-full px-4 sm:px-16 lg:px-24 flex flex-col gap-0 pb-[30vh]">
                  
                  {[
                    { year: "2024 - Present", role: "Chief Technology Officer", company: "Trip Zone", current: true },
                    { year: "2024 - Present", role: "Managing Director", company: "Vivago Technologies", current: true },
                    { year: "2024", role: "Co-ordinator, Cox's Bazar", company: "Anti-Discrimination Student Movement", current: false },
                    { year: "2023 - 2024", role: "Senior Web Developer", company: "IDEAGO Marketing Solutions", current: false },
                    { year: "2022 - 2023", role: "Technical Analyst", company: "Youth Network Centre", current: false },
                  ].map((exp, i) => (
                    <div key={i} className="group relative py-12 border-b border-black/10 transition-colors hover:border-black/30">
                      {/* Hover Highlight Background */}
                      <div className="absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-12 transition-transform duration-500 ease-out group-hover:translate-x-4">
                        {/* Year */}
                        <div className="flex items-center gap-3 w-40 shrink-0">
                          {exp.current && <span className="w-2.5 h-2.5 rounded-full bg-[#0ACF83] animate-pulse shadow-[0_0_10px_#0ACF83]"></span>}
                          <span className={`font-mono text-sm tracking-widest ${exp.current ? 'text-[#111] font-bold' : 'text-black/50 font-medium'}`}>
                            {exp.year}
                          </span>
                        </div>
                        
                        {/* Details */}
                        <div className="flex flex-col">
                          <h3 className="text-2xl sm:text-4xl font-display font-bold text-[#111] group-hover:text-[#D97A52] transition-colors duration-300">
                            {exp.role}
                          </h3>
                          <p className="text-lg text-black/60 mt-2 font-medium">
                            {exp.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

            </div>
          </section>

        </div>
      </div>

      {/* Curated Projects Section */}
      <section id="projects" className="curated-projects relative z-40 bg-[#F5F5F3] w-full pt-32 pb-24 text-[#111] border-t border-[#D6D6D6]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#111] mb-6">
              Curated Projects
            </h2>
            <p className="text-lg md:text-xl text-[#333] max-w-3xl mx-auto font-medium leading-relaxed">
              Selection of projects across branding, product design, and visual systems - each one built with intention.
            </p>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#D6D6D6]">
            
            {/* Project 1 */}
            <Link href="/projects/understood" onClick={(e) => handleProjectClick(e, "/projects/understood")} className="group relative border-r border-b border-[#D6D6D6] aspect-square sm:aspect-[4/3] flex flex-col items-center justify-between p-8 sm:p-12 overflow-hidden cursor-pointer bg-[#F5F5F3]">
              {/* Hover Background Image (Placeholder) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
              
              <span className="relative z-10 font-mono text-sm tracking-widest text-[#555] group-hover:text-[#111] transition-colors duration-500">2026</span>
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="text-3xl md:text-4xl font-bold font-display flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#111] rounded-[10px] text-white flex items-center justify-center text-xl font-bold tracking-tighter">U</div>
                  Understood
                </div>
                {/* View Project Button */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500">
                  <div className="bg-[#F5F5F3] border border-[#D6D6D6] px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white transition-colors shadow-sm">
                    View project 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-[#111]">Product Design | Visual Branding</span>
            </Link>

            {/* Project 2 */}
            <Link href="/projects/rameshwaram-cafe" onClick={(e) => handleProjectClick(e, "/projects/rameshwaram-cafe")} className="group relative border-r border-b border-[#D6D6D6] aspect-square sm:aspect-[4/3] flex flex-col items-center justify-between p-8 sm:p-12 overflow-hidden cursor-pointer bg-[#F5F5F3]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E6D5B8] to-[#D5B07C] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
              
              <span className="relative z-10 font-mono text-sm tracking-widest text-[#555] group-hover:text-[#111] transition-colors duration-500">2025</span>
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="text-3xl md:text-4xl font-serif text-center flex flex-col items-center gap-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 22h20L12 2zm0 4l6 14H6l6-14z"/></svg>
                  The Rameshwaram Cafe
                </div>
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500">
                  <div className="bg-[#F5F5F3] border border-[#D6D6D6] px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white transition-colors shadow-sm">
                    View project 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-[#111]">Marketing Website</span>
            </Link>

            {/* Project 3 */}
            <Link href="/projects/hatti-kaapi" onClick={(e) => handleProjectClick(e, "/projects/hatti-kaapi")} className="group relative border-r border-b border-[#D6D6D6] aspect-square sm:aspect-[4/3] flex flex-col items-center justify-between p-8 sm:p-12 overflow-hidden cursor-pointer bg-[#F5F5F3]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
              
              <span className="relative z-10 font-mono text-sm tracking-widest text-[#555] group-hover:text-[#111] transition-colors duration-500">2025</span>
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="text-3xl md:text-4xl font-display font-bold italic text-center flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center not-italic">H</div>
                  Hatti Kaapi
                </div>
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500">
                  <div className="bg-[#F5F5F3] border border-[#D6D6D6] px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white transition-colors shadow-sm">
                    View project 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-[#111]">E-Commerce</span>
            </Link>

            {/* Project 4 */}
            <Link href="/projects/echo-systems" onClick={(e) => handleProjectClick(e, "/projects/echo-systems")} className="group relative border-r border-b border-[#D6D6D6] aspect-square sm:aspect-[4/3] flex flex-col items-center justify-between p-8 sm:p-12 overflow-hidden cursor-pointer bg-[#F5F5F3]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
              
              <span className="relative z-10 font-mono text-sm tracking-widest text-[#555] group-hover:text-[#111] transition-colors duration-500">2024</span>
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="text-3xl md:text-4xl font-display font-bold text-center flex flex-col items-center gap-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                  Echo Systems
                </div>
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500">
                  <div className="bg-[#F5F5F3] border border-[#D6D6D6] px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white transition-colors shadow-sm">
                    View project 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-[#111]">SaaS Dashboard</span>
            </Link>

          </div>
        </div>
      </section>

      {/* Contact Section - Creative */}
      <section className="contact-section relative z-40 bg-[#F5F5F3] w-full py-32 md:py-48 overflow-hidden border-t border-black/10 flex flex-col items-center justify-center">
        
        {/* Massive Background Marquee */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none flex">
          <motion.div 
            className="flex gap-8 whitespace-nowrap text-[8rem] md:text-[20rem] font-display font-black uppercase tracking-tighter text-[#111]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          >
            <h2>LET'S WORK TOGETHER — LET'S WORK TOGETHER — LET'S WORK TOGETHER — LET'S WORK TOGETHER — </h2>
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#111] rounded-full flex items-center justify-center mb-8 shadow-2xl overflow-hidden group cursor-pointer border-4 border-[#111]">
             <span className="text-4xl md:text-5xl group-hover:rotate-[20deg] transition-transform origin-bottom-right">👋</span>
          </div>
          
          <h3 className="text-3xl md:text-5xl lg:text-7xl font-bold font-display uppercase tracking-tight text-[#111] max-w-4xl mb-12 leading-[1.1]">
            Have a project in mind? Let's create something beautiful.
          </h3>

          <a href="mailto:hello@nowshadabir.com" className="group relative inline-flex items-center gap-4 md:gap-6 text-2xl md:text-4xl lg:text-5xl font-display font-black text-[#111] transition-colors duration-300">
            hello@nowshadabir.com
            <span className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#111] group-hover:bg-[#0ACF83] text-white rounded-full flex items-center justify-center transition-colors duration-300 shadow-xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-2 transition-transform duration-300 w-6 h-6 md:w-8 md:h-8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="footer-section relative z-40 bg-[#050505] w-full pt-20 pb-10 px-6 sm:px-12 text-white/50 border-t border-[#222] overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 mb-32">
          
          {/* Copyright */}
          <div className="flex flex-col items-center lg:items-start gap-2 text-center lg:text-left">
            <span className="text-white font-bold text-lg md:text-xl tracking-wide uppercase font-display">Vivago Technologies</span>
            <span className="text-sm font-medium">© 2026 All rights reserved.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/70">
            <a href="#" className="hover:text-[#FFFFFF] transition-colors relative group">
              LinkedIn
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FFFFFF] transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="hover:text-[#FFFFFF] transition-colors relative group">
              Twitter
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FFFFFF] transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="hover:text-[#FFFFFF] transition-colors relative group">
              Dribbble
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FFFFFF] transition-all group-hover:w-full"></span>
            </a>
          </div>

        </div>

        {/* Massive Watermark */}
        <div className="absolute bottom-[-5vw] left-1/2 -translate-x-1/2 w-[110%] text-center select-none pointer-events-none flex justify-center">
          <h1 className="text-[22vw] font-display font-black text-white/[0.02] leading-none tracking-tighter">
            VIVAGO
          </h1>
        </div>
      </footer>

      {/* Global Elements (Menu & Tab outside scroll container to remain truly fixed) */}
      <div className="fixed inset-0 pointer-events-none z-[100]">

        {/* Section Transition Overlay (5 Columns) */}
        <div className="fixed inset-0 z-[99998] pointer-events-none flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="flex-1 bg-[#1a1a1a]"
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={columnControls}
              custom={i}
            />
          ))}
        </div>

        {/* Bottom Menu Button */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex justify-center items-end pointer-events-auto">
          <motion.div
            initial={{ borderRadius: 26, width: 130, height: 52 }}
            animate={containerControls}
            className={`overflow-hidden shadow-2xl flex flex-col relative ${
              isMenuOpen ? "cursor-default" : "cursor-pointer hover:brightness-105"
            }`}
            style={{ backgroundColor: "#FCE145" }}
            onClick={() => !isMenuOpen && handleToggle()}
          >
            {/* Black Liquid Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] z-0"
              initial={{ height: "0%", borderTopLeftRadius: "100%", borderTopRightRadius: "100%" }}
              animate={liquidControls}
            />

            {/* Links Container (Horizontal) */}
            <div className="absolute top-0 left-0 right-0 h-[100px] px-3 sm:px-8 flex items-center justify-center gap-4 sm:gap-10 z-10 pointer-events-none">
              <motion.a href="#home" onClick={(e) => handleSectionClick(e, "#home")} initial={{ opacity: 0, y: 20 }} animate={homeControls} className="font-sans font-bold text-[15px] sm:text-[22px] tracking-wide text-white whitespace-nowrap group relative overflow-hidden inline-block" style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}>
                <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                  <span className="block pr-2">HOME</span>
                  <span className="block absolute top-full left-0 pr-2 text-[#FCE145]">HOME</span>
                </div>
              </motion.a>
              {[
                { name: "WORKS", href: "#projects" },
                { name: "ABOUT", href: "#about" },
                { name: "CONTACT", href: "#contact" }
              ].map((item, i) => (
                <motion.a key={item.name} href={item.href} onClick={(e) => handleSectionClick(e, item.href)} custom={i} initial={{ opacity: 0, y: 20 }} animate={restControls} className="font-sans font-bold text-[13px] sm:text-[19px] tracking-wide text-white whitespace-nowrap group relative overflow-hidden inline-block" style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}>
                  <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                    <span className="block pr-2">{item.name}</span>
                    <span className="block absolute top-full left-0 pr-2 text-[#FCE145]">{item.name}</span>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Shifting Bottom Bar (Menu text & Icon) */}
            <motion.div className="absolute z-10 flex items-center justify-between" initial={{ bottom: 16, left: 26, right: 26, color: "#000000" }} animate={textControls}>
              <span className="text-[15px] font-medium tracking-wide pointer-events-none">Menu</span>
              <div className="relative w-[16px] h-[16px] flex items-center justify-center" style={{ cursor: isMenuOpen ? "pointer" : "inherit", pointerEvents: isMenuOpen ? "auto" : "none" }} onClick={(e) => { if (isMenuOpen) { e.stopPropagation(); handleToggle(); } }}>
                <motion.span className="absolute left-0 w-full h-[1.5px] bg-current" initial={false} animate={{ top: isMenuOpen ? "50%" : "35%", y: "-50%", rotate: isMenuOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 22 }} />
                <motion.span className="absolute left-0 w-full h-[1.5px] bg-current" initial={false} animate={{ top: isMenuOpen ? "50%" : "65%", y: "-50%", rotate: isMenuOpen ? -45 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 22 }} />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <VivagoOverlay />

        {/* Global Page Transition Overlay */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] z-[99999] pointer-events-none"
          initial={{ height: "0vh", borderTopLeftRadius: "100%", borderTopRightRadius: "100%" }}
          animate={{ 
            height: isTransitioning ? "100vh" : "0vh", 
            borderTopLeftRadius: isTransitioning ? "0%" : "100%", 
            borderTopRightRadius: isTransitioning ? "0%" : "100%" 
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

      </div>
    </main>
  );
}
