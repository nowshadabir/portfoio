"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";

export default function VivagoOverlay() {
  const [isVivagoOpen, setIsVivagoOpen] = useState(false);
  const vivagoWidth = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const closeVivago = () => {
    setIsVivagoOpen(false);
    animate(vivagoWidth, 0, { type: "spring", bounce: 0, duration: 0.5 });
  };

  const borderRadiusMobile = useTransform(vivagoWidth, [0, 800], ["0 0 50% 50%", "0 0 0 0"]);
  const borderRadiusDesktop = useTransform(vivagoWidth, [0, 800], ["50% 0 0 50%", "0 0 0 0"]);

  if (!mounted) return null;

  return (
    <>
      {/* Vivago Technologies Sticky Tab (Draggable) */}
      <motion.div 
        className={`fixed z-[160] bg-[#0A0A0A] text-white flex items-center shadow-lg pointer-events-auto cursor-grab active:cursor-grabbing group
                   ${isMobile 
                     ? "top-0 left-0 w-full h-[40px] flex-row justify-center gap-4 border-b border-white/10" 
                     : "right-0 top-1/2 -translate-y-1/2 w-[50px] py-6 flex-col border-l border-white/10"
                   }`}
        drag={!isVivagoOpen ? (isMobile ? "y" : "x") : false}
        dragConstraints={isMobile ? { top: 0, bottom: 0 } : { left: 0, right: 0 }}
        dragElastic={isMobile ? { top: 0, bottom: 0.6 } : { left: 0.6, right: 0 }}
        onDrag={(e, info) => {
          if (!isVivagoOpen) {
            if (isMobile) {
              vivagoWidth.set(Math.max(0, info.offset.y));
            } else {
              vivagoWidth.set(Math.max(0, -info.offset.x));
            }
          }
        }}
        onDragEnd={(e, info) => {
          if (!isVivagoOpen) {
            if (isMobile) {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                setIsVivagoOpen(true);
                animate(vivagoWidth, window.innerHeight, { type: "spring", bounce: 0, duration: 0.6 });
              } else {
                animate(vivagoWidth, 0, { type: "spring", bounce: 0.4 });
              }
            } else {
              if (info.offset.x < -150 || info.velocity.x < -500) {
                setIsVivagoOpen(true);
                animate(vivagoWidth, window.innerWidth, { type: "spring", bounce: 0, duration: 0.6 });
              } else {
                animate(vivagoWidth, 0, { type: "spring", bounce: 0.4 });
              }
            }
          }
        }}
        animate={isMobile 
          ? { opacity: isVivagoOpen ? 0 : 1, y: isVivagoOpen ? -50 : 0 }
          : { opacity: isVivagoOpen ? 0 : 1, x: isVivagoOpen ? 50 : 0 }
        }
        transition={{ duration: 0.3 }}
      >
        {/* Hover Tooltip (Desktop Only) */}
        {!isMobile && (
          <div className="absolute right-[60px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap bg-black/80 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Pull to left
          </div>
        )}

        <img src="/vivago-technologies-logo.webp" alt="Vivago Technologies Logo" className={`object-contain ${isMobile ? "w-5 h-auto" : "w-8 h-auto"}`} />
        <div className={`flex justify-center pointer-events-none ${isMobile ? "" : "mt-6"}`}>
          <span className={`text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase ${isMobile ? "" : "[writing-mode:vertical-lr]"}`}>
            Vivago Technologies
          </span>
        </div>
        
        {/* Pull Indicator for Mobile */}
        {isMobile && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full pointer-events-none"></div>
        )}
      </motion.div>

      {/* Vivago Overlay */}
      <motion.div
        data-lenis-prevent="true"
        className={`fixed bg-[#0A0A0A] z-[150] text-white flex flex-col justify-start overflow-y-auto overflow-x-hidden shadow-2xl overscroll-contain ${isMobile ? "top-0 left-0" : "right-0 top-0"}`}
        style={{ 
          width: isMobile ? '100vw' : vivagoWidth,
          height: isMobile ? vivagoWidth : '100vh',
          borderRadius: isMobile ? borderRadiusMobile : borderRadiusDesktop
        }}
      >
        <div className="w-full min-h-screen relative px-6 sm:px-10 lg:px-20 pt-24 pb-40 lg:py-20 flex flex-col justify-start lg:justify-center">
          {/* Close Button - Fixed to viewport for mobile scrolling */}
          <motion.button 
            onClick={closeVivago}
            className={`fixed z-[200] ${isMobile ? "top-6 right-6" : "top-10 right-10"} w-10 h-10 lg:w-12 lg:h-12 bg-[#1a1a1a] border border-white/10 rounded-full flex items-center justify-center hover:bg-[#333] transition-colors pointer-events-auto shadow-xl`}
            initial="closed"
            animate={isVivagoOpen ? "open" : "closed"}
            variants={{
              closed: { opacity: 0, scale: 0, rotate: -90 },
              open: { opacity: 1, scale: 1, rotate: 0, transition: { delay: 0.5, type: "spring" } }
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </motion.button>

          <motion.div 
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24"
            initial="closed"
            animate={isVivagoOpen ? "open" : "closed"}
            variants={{
              open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
              closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
          >
            {/* Left Column: Vision & Info */}
            <div className="flex flex-col justify-center mt-8 lg:mt-0">
              <motion.h2 
                className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50"
                variants={{ closed: { opacity: 0, y: 30, filter: "blur(10px)" }, open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100 } } }}
              >
                Vivago Technologies
              </motion.h2>
              <motion.p 
                className="text-base sm:text-lg lg:text-xl text-white/60 leading-relaxed mb-8 lg:mb-10 max-w-xl"
                variants={{ closed: { opacity: 0, y: 30, filter: "blur(10px)" }, open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100 } } }}
              >
                A premier web and SaaS development company based in Dhaka, Bangladesh. They specialize in engineering robust SaaS platforms, scalable custom ERPs, and high-performance web applications that drive modern businesses forward.
              </motion.p>

              {/* Service Tags */}
              <motion.div 
                className="flex flex-wrap gap-2 lg:gap-3 mb-10 lg:mb-12"
                variants={{ closed: { opacity: 0, y: 30, filter: "blur(10px)" }, open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100 } } }}
              >
                {["SaaS Development", "UI/UX Design", "Custom ERP", "Mobile Apps", "AI Integration"].map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border border-white/10 bg-white/5 text-xs lg:text-sm font-medium text-white/80 backdrop-blur-md">
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={{ closed: { opacity: 0, y: 30, filter: "blur(10px)" }, open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100 } } }}>
                <a href="https://vivagotechnologies.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 lg:gap-4 text-base lg:text-lg font-medium border-b border-[#D97A52]/30 pb-2 hover:border-[#D97A52] hover:gap-6 transition-all duration-300 pointer-events-auto text-[#D97A52]">
                  Visit vivagotechnologies.com
                  <svg width="16" height="16" className="lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </motion.div>
            </div>

            {/* Right Column: Bento Box Products */}
            <div className="flex flex-col">
              <motion.div variants={{ closed: { opacity: 0, y: 30, filter: "blur(10px)" }, open: { opacity: 1, y: 0, filter: "blur(0px)" } }}>
                <h3 className="text-xs lg:text-sm font-bold tracking-widest uppercase text-white/40 mb-4 lg:mb-6">Vivago Labs Products</h3>
              </motion.div>

              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {/* Product Card 1 */}
                <motion.div 
                  className="shrink-0 w-[280px] sm:w-auto snap-center group relative p-5 lg:p-6 rounded-2xl bg-[#111] border border-white/10 hover:border-[#1ABCFE]/50 transition-colors overflow-hidden pointer-events-auto cursor-pointer"
                  variants={{ closed: { opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }, open: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.4 } } }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1ABCFE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#1ABCFE]/10 border border-[#1ABCFE]/20 flex items-center justify-center mb-4 lg:mb-6">
                      <svg width="18" height="18" className="lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="#1ABCFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </div>
                    <h4 className="text-lg lg:text-xl font-bold mb-2 text-white group-hover:text-[#1ABCFE] transition-colors">MicroCampus</h4>
                    <p className="text-xs lg:text-sm text-white/50 leading-relaxed">A unified school management ecosystem bridging education and technology.</p>
                  </div>
                </motion.div>

                {/* Product Card 2 */}
                <motion.div 
                  className="shrink-0 w-[280px] sm:w-auto snap-center group relative p-5 lg:p-6 rounded-2xl bg-[#111] border border-white/10 hover:border-[#0ACF83]/50 transition-colors overflow-hidden pointer-events-auto cursor-pointer"
                  variants={{ closed: { opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }, open: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.4 } } }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0ACF83]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0ACF83]/10 border border-[#0ACF83]/20 flex items-center justify-center mb-4 lg:mb-6">
                      <svg width="18" height="18" className="lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="#0ACF83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <h4 className="text-lg lg:text-xl font-bold mb-2 text-white group-hover:text-[#0ACF83] transition-colors">LodgeOS</h4>
                    <p className="text-xs lg:text-sm text-white/50 leading-relaxed">Next-generation hotel management system for seamless hospitality operations.</p>
                  </div>
                </motion.div>

                {/* Product Card 3 (Full Width) */}
                <motion.div 
                  className="sm:col-span-2 shrink-0 w-[280px] sm:w-auto snap-center group relative p-5 lg:p-6 rounded-2xl bg-[#111] border border-white/10 hover:border-[#F24E1E]/50 transition-colors overflow-hidden pointer-events-auto cursor-pointer"
                  variants={{ closed: { opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }, open: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.4 } } }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F24E1E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 sm:flex sm:items-center sm:justify-between sm:gap-6">
                    <div>
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#F24E1E]/10 border border-[#F24E1E]/20 flex items-center justify-center mb-4">
                        <svg width="18" height="18" className="lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="#F24E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      </div>
                      <h4 className="text-lg lg:text-xl font-bold mb-2 text-white group-hover:text-[#F24E1E] transition-colors">Jewellery ERP</h4>
                      <p className="text-xs lg:text-sm text-white/50 leading-relaxed max-w-md">Comprehensive enterprise software designed specifically for jewellery businesses with precise precious metal tracking.</p>
                    </div>
                    <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300 w-12 h-12 rounded-full bg-[#F24E1E] items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
