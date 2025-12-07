import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, CheckCircle2, Zap, Shield, Globe, MousePointerClick, RefreshCw, Layout } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeDMarquee from "../components/ThreeDMarquee";
import FeatureReveal from "../components/FeatureReveal";
import ParallaxGallery from "../components/ParallaxGallery";

gsap.registerPlugin(ScrollTrigger);
const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const container = useRef();

  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline();
    tl.from(".nav-item", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    })
      .from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      }, "-=0.5")
      .from(".hero-btn", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.3");

    // Floating animation for background blobs
    gsap.to(".blob", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 1
    });

    // Scroll Animations for Sections
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach(section => {
      gsap.from(section.children, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    });

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-white dark:bg-black overflow-hidden relative selection:bg-brand-blue/20 selection:text-brand-blue transition-colors duration-300">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="blob absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-blue/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="blob absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-red/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="blob absolute bottom-[-20%] left-[20%] w-96 h-96 bg-brand-yellow/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* SVG Filter Definition for Liquid Glass */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.012"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur
              in="noise"
              stdDeviation="2"
              result="blurred"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <nav className="fixed top-0 left-0 right-0 p-6 z-50 bg-transparent pointer-events-none">
        <div className="max-w-2xl liquid-glass p-4 rounded-3xl mx-auto flex justify-between items-center pointer-events-auto">
          <div className="nav-item flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              PindSync
            </span>
          </div>
          <div className="nav-item hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <ThemeToggle />
            <Link to="/login" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-green-600 hover:dark:bg-green-600 dark:hover:text-white hover:text-black -colors dark:bg-white dark:text-black">Login</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative pt-16  lg:pt-32  px-4 sm:px-6 lg:px-24 overflow-hidden min-h-screen flex items-center justify-start">

        {/* Background Marquee */}
        <div className="absolute inset-0 z-0 opacity-90 dark:opacity-60 select-none pointer-events-none overflow-hidden">
          <ThreeDMarquee
            className="h-full w-full"
            images={[
              { src: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop", alt: "Schedule" },
              { src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop", alt: "Office" },
              { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop", alt: "Data" },
              { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop", alt: "Planning" },
              { src: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop", alt: "Calendar app" },
              { src: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2674&auto=format&fit=crop", alt: "Success" },
              { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop", alt: "Strategy" },
              { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop", alt: "Team" },
              { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop", alt: "Work" },
              { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop", alt: "Collaboration" },
              { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop", alt: "Startup" }
            ]}
            cols={4}
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/20 to-white/20 dark:from-black/20 dark:via-black/20 dark:to-black"></div>
        </div>

        <div className="max-w-3xl ml-0 lg:ml-12 text-left relative z-10 w-full lg:w-1/2">
          <div className="space-y-12 mb-16">
            <h1 className="hero-text mt-40 text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter">
              Master Your Schedule <br />
              <span className="text-brand-green block ">
                Sync Your Life
              </span>
            </h1>
            <p className="hero-text max-w-lg text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              The ultimate tool to seamlessly manage your Google Calendar.
              Create, organize, and sync events with a beautiful, modern interface.
            </p>

            <div className="hero-text flex flex-col sm:flex-row items-center sm:items-start justify-start gap-4 pt-4">
              <Link
                to="/login"
                className="hero-btn group relative inline-flex items-center gap-3 px-8 py-4 bg-brand-blue text-white text-lg font-semibold rounded-full overflow-hidden shadow-xl shadow-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/40 transition-all hover:-translate-y-1"
              >
                <span className="relative z-10">Get Started with Google</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FEATURES TEXT SECTION */}
      <section id="features-text" className="animate-section min-h-screen flex items-center justify-center   py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl md:text-9xl font-black text-black dark:text-white mb-8 tracking-tighter">Why Choose PindSync?</h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">Everything you need to manage your calendar effectively, wrapped in a beautiful interface.</p>
        </div>
      </section>

      {/* FEATURES CARDS SECTION */}
      <section id="features-cards" className="animate-section min-h-screen flex items-center justify-left ml-20 py-24 relative overflow-hidden">
        {/* Background Marquee for Cards */}
        {/* <div className="absolute inset-0 z-0 opacity-100 select-none pointer-events-none overflow-hidden">
          <ThreeDMarquee
            className="h-full w-full"
            images={[
              { src: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop", alt: "Schedule" },
              { src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop", alt: "Office" },
              { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop", alt: "Data" },
              { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop", alt: "Planning" },
              { src: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop", alt: "Calendar app" },
              { src: "https://images.unsplash.com/photo-1506784335131-e699942350ce?q=80&w=2668&auto=format&fit=crop", alt: "Meeting" },
              { src: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2674&auto=format&fit=crop", alt: "Success" },
              { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop", alt: "Strategy" },
              { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop", alt: "Team" },
              { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop", alt: "Work" },
              { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop", alt: "Collaboration" },
              { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop", alt: "Startup" }
            ]}
            cols={4}
          />
          <div className="absolute inset-0 bg-white/90 dark:bg-black/80"></div>
        </div> */}

        <div className="w-[50%] h-[50%] relative z-10">
          <FeatureReveal />
        </div>
      </section>

      {/* HOW IT WORKS TEXT SECTION */}
      <section id="how-it-works-text" className="animate-section min-h-screen flex items-center justify-center py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl md:text-9xl font-black text-black dark:text-white mb-8 tracking-tighter">How It Works</h2>
          <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">Get started in minutes with our simple 3-step process.</p>
        </div>
      </section>

      {/* HOW IT WORKS STEPS SECTION */}
      <section id="how-it-works-steps" className="animate-section min-h-screen flex items-center justify-center py-24 relative overflow-hidden">
        {/* Background Marquee for How It Works */}
        <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none overflow-hidden">
          {/* <ThreeDMarquee
            className="h-full w-full"
            images={[
              { src: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop", alt: "Schedule" },
              { src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop", alt: "Office" },
              { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop", alt: "Data" },
              { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop", alt: "Planning" },
              { src: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop", alt: "Calendar app" },
              { src: "https://images.unsplash.com/photo-1506784335131-e699942350ce?q=80&w=2668&auto=format&fit=crop", alt: "Meeting" },
              { src: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2674&auto=format&fit=crop", alt: "Success" },
              { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop", alt: "Strategy" },
              { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop", alt: "Team" },
              { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop", alt: "Work" },
              { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop", alt: "Collaboration" },
              { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop", alt: "Startup" }
            ]}
            cols={4}
          /> */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-blue/30 via-brand-red/30 to-brand-blue/30 border-t-2 border-dashed border-brand-blue/30 z-0"></div>

            {[
              {
                icon: MousePointerClick,
                title: "1. Connect",
                desc: "Sign in with your Google account to authorize secure access.",
                color: "text-brand-blue",
                bg: "bg-brand-blue/10",
                border: "border-brand-blue"
              },
              {
                icon: RefreshCw,
                title: "2. Sync",
                desc: "We automatically fetch your calendars and events in real-time.",
                color: "text-brand-red",
                bg: "bg-brand-red/10",
                border: "border-brand-red"
              },
              {
                icon: Layout,
                title: "3. Manage",
                desc: "Create, edit, and organize events from our beautiful dashboard.",
                color: "text-brand-green",
                bg: "bg-brand-green/10",
                border: "border-brand-green"
              }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-24 h-24 ${step.bg} dark:bg-opacity-10 rounded-full shadow-lg flex items-center justify-center mb-6 border-4 ${step.border} dark:border-opacity-20 group hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-10 h-10 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="animate-section min-h-screen flex items-center justify-center py-24 relative overflow-hidden bg-white dark:bg-black">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <ParallaxGallery />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* <span className="inline-block py-1 px-3 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-6 border border-brand-blue/20 backdrop-blur-sm">
            Ready to get started?
          </span> */}
          <h2 className="text-6xl md:text-8xl font-black text-black dark:text-white mb-8 tracking-tighter drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Organize your life <br /> using <span className="text-green-600">PindSync</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium p-4 rounded-2xl">
          Start syncing smarter and let PindSync keep your day running without the chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-lg font-bold rounded-full overflow-hidden hover:scale-105 hover:bg-green-600 hover:text-white dark:hover:text-black dark:hover:bg-green-600 transition-transform duration-300 shadow-xl"
            >
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 h-[50vh] text-center border-t border-gray-100 dark:border-black bg-white/50 dark:bg-black backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PindSync.
          </p>
          <div className="flex gap-6 text-gray-400">

            <a href="https://github.com/abhishekratnakar31/Google-Calendar-Sync" className="hover:text-brand-blue transition-colors">GitHub</a>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
