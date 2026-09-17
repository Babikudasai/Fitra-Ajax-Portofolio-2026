/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Snowflake, Maximize, Zap, Cpu, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// --- Types ---
interface LoadingScreenProps {
  onComplete: () => void;
}

// --- Loading Screen Component ---
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Menyimpan referensi fungsi agar tidak terjadi stale closure
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Kata-kata yang diputar (diterjemahkan/disesuaikan untuk kesan elegan)
  const words = useMemo(() => ["DESAIN", "KREASI", "INSPIRASI"], []);

  // Efek Rotasi Kata (Setiap 900ms)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setWordIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => clearInterval(intervalId);
  }, [words.length]);

  // Efek Penghitung Kemajuan (2.7 detik)
  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 2700;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(currentProgress);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Jika mencapai 100, tunggu 400ms lalu panggil onComplete
        setTimeout(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Format angka menjadi 3 digit (mis. 007, 042, 100)
  const formattedProgress = Math.floor(progress).toString().padStart(3, "0");

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg)" }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Cinematic ease
    >
      {/* Background Noise/Grid Halus (Opsional untuk kesan futuristik) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Elemen 1: Label Sistem Futuristik */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" style={{ boxShadow: '0 0 10px var(--accent)' }} />
        <div className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-[var(--muted)]">
          SYS.PORTFOLIO <span className="text-[var(--accent)]">// INIT</span>
        </div>
      </motion.div>

      {/* Elemen Tambahan Futuristik: Koordinat (Kanan Atas) */}
      <motion.div
        className="absolute top-8 right-8 md:top-12 md:right-12 font-mono text-[10px] text-[var(--muted)] tracking-widest text-right hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        LAT: -6.2088<br/>
        LNG: 106.8456<br/>
        <span className="text-[var(--accent)]/50">SECURE_CONNECTION</span>
      </motion.div>

      {/* Elemen 2: Kata-kata Berputar dengan Efek Blur */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-3xl md:text-5xl lg:text-7xl font-display font-light tracking-[0.3em] text-transparent bg-clip-text"
            style={{ 
              backgroundImage: "linear-gradient(180deg, var(--text) 0%, var(--muted) 100%)",
            }}
            initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95, y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(8px)", scale: 1.05, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Elemen 3: Penghitung (Counter) Monospace */}
      <motion.div
        className="absolute bottom-12 right-8 md:bottom-16 md:right-12 flex items-baseline gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <span className="font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase mb-1">
          Loading Data
        </span>
        <div className="font-mono text-5xl md:text-7xl lg:text-8xl text-[var(--text)] tabular-nums font-light tracking-tighter">
          {formattedProgress}
        </div>
        <span className="font-mono text-xl text-[var(--muted)]">%</span>
      </motion.div>

      {/* Elemen 4: Bilah Progres (Lebih tipis dan bercahaya neon) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--stroke)]">
        <motion.div
          className="h-full origin-left"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "0 0 15px var(--accent), 0 0 5px var(--accent)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

// --- Seamless Video Component ---
const SeamlessVideo: React.FC = () => {
  const [active, setActive] = useState(0);
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (v1Ref.current) {
      v1Ref.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const checkTime = () => {
      const currentVideo = active === 0 ? v1Ref.current : v2Ref.current;
      const nextVideo = active === 0 ? v2Ref.current : v1Ref.current;

      if (currentVideo && nextVideo && !isNaN(currentVideo.duration) && currentVideo.duration > 0) {
        const duration = currentVideo.duration;
        const currentTime = currentVideo.currentTime;
        
        // Dinamis: fade duration maksimal 2 detik, atau 15% dari durasi video jika videonya pendek
        const fadeDuration = Math.min(2.0, duration * 0.15);
        const timeLeft = duration - currentTime;

        // Trigger crossfade jika mendekati akhir ATAU video sudah berhenti (misal karena tab tidak aktif)
        if ((timeLeft <= fadeDuration || currentVideo.ended) && (nextVideo.paused || nextVideo.ended)) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => {});
          setActive(active === 0 ? 1 : 0);
        }
      }
      animationFrameId = requestAnimationFrame(checkTime);
    };
    animationFrameId = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  return (
    <div className="absolute inset-0 h-full w-full scale-[1.15] origin-center opacity-80 landscape:opacity-50 md:opacity-50 transform-gpu">
      <video 
        ref={v1Ref}
        muted 
        playsInline 
        autoPlay
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[2000ms] ease-in-out will-change-[opacity] ${active === 0 ? 'opacity-100' : 'opacity-0'}`}
        src="/background.mp4"
      />
      <video 
        ref={v2Ref}
        muted 
        playsInline 
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[2000ms] ease-in-out will-change-[opacity] ${active === 1 ? 'opacity-100' : 'opacity-0'}`}
        src="/background.mp4"
      />
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [skillIndex, setSkillIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLoading) return; // Wait until loading finishes
    
    // Select all elements with the 'gsap-fade-up' class inside our container
    const fadeUpElements = gsap.utils.toArray('.gsap-fade-up');
    fadeUpElements.forEach((elem: any) => {
      gsap.from(elem, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%', // trigger when top of element hits 85% of viewport
          toggleActions: 'play none none reverse' // play on enter, reverse on leave back
        }
      });
    });

    // Stagger animation for project items
    gsap.from('.gsap-project-item', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.gsap-projects-container',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

  }, { scope: containerRef, dependencies: [isLoading] });

  const skills = useMemo(() => [
    "MODERN ARCHITECT",
    "PRODUCT R&D",
    "IoT ENGINEER",
    "FULL-STACK ENGINEER",
    "CYBER SECURITY",
    "ELECTRONICS ENGINEER"
  ], []);

  useEffect(() => {
    if (isLoading) return;
    const intervalId = setInterval(() => {
      setSkillIndex((prev) => (prev + 1) % skills.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [isLoading, skills.length]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Space+Grotesk:wght@300;400;500&family=Space+Mono&display=swap');
        
        :root {
          --bg: #030303;
          --text: #f0f0f0;
          --muted: #4a4a4a;
          --stroke: #121212;
          --accent: #ff6a00;
        }
        
        body {
          background-color: var(--bg);
          color: var(--text);
          margin: 0;
          overflow-x: hidden;
        }
        
        .font-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .font-mono {
          font-family: 'Space Mono', monospace;
        }

        .font-futuristic {
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main
        style={{
          opacity: isLoading ? 0 : 1,
          transform: isLoading ? "scale(0.98)" : "scale(1)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          pointerEvents: isLoading ? "none" : "auto", 
        }}
        className="relative min-h-screen w-full bg-black font-sans text-white selection:bg-white selection:text-black transform-gpu"
        ref={containerRef}
      >
        {/* Main Container Frame / HERO */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col"
        >
        {/* Background Layer with Video and Subtle Gradients */}
        <div className="absolute top-0 left-0 w-full z-0 overflow-hidden bg-black pointer-events-none h-[60dvh] landscape:h-full landscape:inset-0 md:h-full md:inset-0">
          {/* Seamless Video Background */}
          <SeamlessVideo />
          
          {/* Subtle Corner Gradients (Opacity reduced further to 2%) */}
          <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-orange-500/2 blur-[120px] transform-gpu" />
          <div className="absolute -right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/2 blur-[120px] transform-gpu" />
          
          {/* Dark Overlay to ensure text readability - Fades to solid black on mobile bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-20% via-black/80 to-black landscape:from-black/20 landscape:via-black/40 landscape:to-black/80 md:from-black/20 md:via-black/40 md:to-black/80" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col flex-1 w-full max-w-[1920px] mx-auto p-6 sm:p-10 md:p-16 lg:p-20">
          {/* Mobile Portrait Spacer to push content down */}
          <div className="h-[40dvh] shrink-0 md:hidden landscape:hidden" />
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row w-full items-start justify-between gap-8 md:gap-0">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-xl"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-futuristic font-bold tracking-widest uppercase leading-tight">
                FITRA AJAX // <br />
                <div className="relative h-[2.6em] mt-2 sm:mt-3 overflow-hidden text-[var(--accent)]">
                  <AnimatePresence>
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: "0%" }}
                      exit={{ opacity: 0, y: "-100%" }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 will-change-transform"
                    >
                      {skills[skillIndex].split(' ')[0]} <br />
                      {skills[skillIndex].split(' ').slice(1).join(' ')}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </h1>
              <p className="mt-4 sm:mt-8 max-w-md text-xs sm:text-sm leading-relaxed text-zinc-400 font-light">
                Developed with high-end skills and a pixel-perfect frame for those who don't just browse the web—they build it. Code your dreams....
              </p>
              
              <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
                {[Snowflake, Maximize, Zap].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors"
                  >
                    <Icon size={18} className="text-zinc-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex items-center gap-6 sm:gap-8 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-zinc-500"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span>1/26</span>
                <div className="h-[1px] w-8 sm:w-12 bg-zinc-800" />
              </div>
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                NEXT PRODUCT
              </button>
            </motion.div>
          </header>

          {/* Bottom Section */}
          <div className="mt-12 md:mt-auto flex flex-col md:flex-row w-full items-start md:items-end justify-between gap-12 md:gap-0 pb-8 md:pb-0">
            {/* Project Card - Hidden on mobile to match the clean look of the reference image */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden md:flex group relative w-full md:max-w-[380px] items-center gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="relative h-20 w-28 sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-900 border border-white/5">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/9/9c/ESP32-C3_RISC-V_NodeMCU_board.jpg" 
                  alt="ESP32 Development Board" 
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 overflow-hidden">
                <h3 className="font-mono text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-white truncate">
                  V-01: SMART IOT HUB
                </h3>
                <p className="text-[9px] sm:text-[10px] leading-relaxed text-zinc-400 line-clamp-2">
                  Embedded systems and connected sensors for real-time data processing and automation.
                </p>
                <button className="mt-1 flex w-fit items-center gap-2 rounded-lg bg-white text-black px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-bold hover:bg-zinc-200 transition-colors">
                  <Cpu size={11} />
                  Explore System
                </button>
              </div>
            </motion.div>

            {/* Technical Specs & Tags */}
            <div className="flex flex-col items-start md:items-end gap-8 sm:gap-12 w-full md:w-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full sm:w-80"
              >
                <h4 className="mb-6 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                  TECHNICAL SPECS
                </h4>
                <div className="space-y-4 font-mono text-[10px] sm:text-[11px]">
                  {[
                    { label: "Stack", value: "React + Node + SQL" },
                    { label: "Logic", value: "V8 - Runtime Logic" },
                    { label: "Uptime", value: "99.9% High-Avail" },
                    { label: "Scale", value: "Responsive Modern Layout" },
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-zinc-500">{spec.label}</span>
                      <span className="text-zinc-300">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="hidden md:flex flex-wrap gap-2 justify-start md:justify-end"
              >
                {["8K RAW", "A+", "ULTRA-WIDE", "NEURAL-SYNC"].map((tag, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-center rounded-full border border-white/10 px-3 py-1 sm:px-4 sm:py-1.5 font-mono text-[8px] sm:text-[9px] tracking-widest text-zinc-400 hover:border-white/30 hover:text-white transition-colors cursor-default bg-white/5"
                  >
                    {tag}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        </motion.div>

        {/* --- SCROLL SECTION STYLED WITH GSAP --- */}
        <div className="relative w-full bg-black z-20 py-24 md:py-40 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-white/10">
          
          <div className="max-w-[1920px] mx-auto">
            {/* Title Section */}
            <div className="mb-20 md:mb-32">
              <h2 className="gsap-fade-up font-futuristic text-2xl md:text-4xl lg:text-5xl font-bold tracking-widest uppercase mb-4">
                BEYOND <span className="text-[var(--accent)]">THE CODE</span>
              </h2>
              <div className="gsap-fade-up h-[1px] w-24 bg-[var(--accent)] mb-8" />
              <p className="gsap-fade-up max-w-2xl text-sm md:text-base leading-relaxed text-zinc-400 font-light">
                Every project is a bridge between complex engineering and human experience. Here is a deeper look into the systems, architectures, and algorithms that power the future of connectivity. Scroll down to see GSAP animations in action.
              </p>
            </div>

            {/* Projects/Experience Grid */}
            <div className="gsap-projects-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Project Item 1 */}
              <div className="gsap-project-item group relative p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-colors overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-8 p-4 rounded-2xl bg-black/50 inline-block">
                  <Cpu className="text-[var(--accent)]" size={24} />
                </div>
                <h3 className="font-mono text-sm md:text-base font-bold tracking-widest text-white mb-2">NEURAL SYNC</h3>
                <p className="text-xs md:text-sm text-zinc-500 mb-6 line-clamp-3">
                  A high-throughput IoT pipeline built with C++ and Go, handling over 1M edge events per second with sub-ms latency.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase group-hover:opacity-80 transition-opacity">
                  View Architecture <ArrowRight size={12} />
                </button>
              </div>

              {/* Project Item 2 */}
              <div className="gsap-project-item group relative p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-colors overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-8 p-4 rounded-2xl bg-black/50 inline-block">
                  <Zap className="text-blue-500" size={24} />
                </div>
                <h3 className="font-mono text-sm md:text-base font-bold tracking-widest text-white mb-2">QUANTUM CORE</h3>
                <p className="text-xs md:text-sm text-zinc-500 mb-6 line-clamp-3">
                  Cybersecurity layer leveraging Zero-Trust architecture. Protects edge-nodes from unauthorized flashing and firmware tampering.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-blue-500 uppercase group-hover:opacity-80 transition-opacity">
                  Read Case Study <ArrowRight size={12} />
                </button>
              </div>

              {/* Project Item 3 */}
              <div className="gsap-project-item group relative p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-colors overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-8 p-4 rounded-2xl bg-black/50 inline-block">
                  <Snowflake className="text-teal-400" size={24} />
                </div>
                <h3 className="font-mono text-sm md:text-base font-bold tracking-widest text-white mb-2">FROSTBITE GUI</h3>
                <p className="text-xs md:text-sm text-zinc-500 mb-6 line-clamp-3">
                  A performant front-end dashboard built in React using WebGL rendering for thousands of real-time sensor dots without dropped frames.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-teal-400 uppercase group-hover:opacity-80 transition-opacity">
                  Explore Demo <ArrowRight size={12} />
                </button>
              </div>

            </div>
          </div>
        </div>

      </main>
    </>
  );
}
