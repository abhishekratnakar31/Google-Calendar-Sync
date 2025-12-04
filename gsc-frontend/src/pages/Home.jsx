import React, { useRef } from "react";
import { Calendar, ArrowRight, CheckCircle2, Zap, Shield, Globe, MousePointerClick, RefreshCw, Layout } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

      <nav className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="nav-item flex items-center gap-2">
            <div className="p-2.5 bg-brand-blue rounded-xl shadow-lg shadow-brand-blue/20 transform transition-transform hover:scale-105">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              PindSync
            </span>
          </div>
          <div className="nav-item hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-brand-blue transition-colors dark:text-gray-300 dark:hover:text-brand-blue">Features</a>
            <a href="#how-it-works" className="hover:text-brand-blue transition-colors dark:text-gray-300 dark:hover:text-brand-blue">How it Works</a>
            <ThemeToggle />
            <a href="http://localhost:8000/auth/init" className="px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-colors dark:bg-brand-blue/20 dark:text-blue-300">Login</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-16 pb-24 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-8 mb-16">
            <div className="hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
              </span>
              v2.0 is now live
            </div>
            <h1 className="hero-text text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Master Your Schedule <br />
              <span className="text-brand-blue">
                Sync Your Life
              </span>
            </h1>
            <p className="hero-text max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              The ultimate tool to seamlessly manage your Google Calendar.
              Create, organize, and sync events with a beautiful, modern interface.
            </p>

            <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="http://localhost:8000/auth/init"
                className="hero-btn group relative inline-flex items-center gap-3 px-8 py-4 bg-brand-blue text-white text-lg font-semibold rounded-full overflow-hidden shadow-xl shadow-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/40 transition-all hover:-translate-y-1"
              >
                <span className="relative z-10">Get Started with Google</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section id="features" className="animate-section py-24 bg-white/50 dark:bg-black backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose PindSync?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Everything you need to manage your calendar effectively, wrapped in a beautiful interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast Sync",
                desc: "Real-time synchronization with Google Calendar API ensures you never miss a beat.",
                color: "text-brand-yellow",
                bg: "bg-brand-yellow/10",
                border: "border-brand-yellow/20"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is yours. We use official Google OAuth for maximum security and privacy.",
                color: "text-brand-blue",
                bg: "bg-brand-blue/10",
                border: "border-brand-blue/20"
              },
              {
                icon: Globe,
                title: "Access Anywhere",
                desc: "Manage your schedule from any device with our responsive, modern web interface.",
                color: "text-brand-green",
                bg: "bg-brand-green/10",
                border: "border-brand-green/20"
              }
            ].map((feature, idx) => (
              <div key={idx} className={`p-8 ${feature.bg} dark:bg-opacity-10 rounded-3xl shadow-sm border ${feature.border} dark:border-opacity-20 hover:shadow-xl transition-all duration-300 group`}>
                <div className={`w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="animate-section py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50 dark:bg-black/50 -z-10 skew-y-3 transform origin-top-left scale-110"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Get started in minutes with our simple 3-step process.</p>
          </div>

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
                border: "border-brand-blue/20"
              },
              {
                icon: RefreshCw,
                title: "2. Sync",
                desc: "We automatically fetch your calendars and events in real-time.",
                color: "text-brand-red",
                bg: "bg-brand-red/10",
                border: "border-brand-red/20"
              },
              {
                icon: Layout,
                title: "3. Manage",
                desc: "Create, edit, and organize events from our beautiful dashboard.",
                color: "text-brand-green",
                bg: "bg-brand-green/10",
                border: "border-brand-green/20"
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
      <section className="animate-section py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-blue dark:bg-brand-red/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-brand-blue/30">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-brand-yellow/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to organize your life?</h2>
              <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">Join thousands of users who have streamlined their schedule with PindSync.</p>
              <a
                href="http://localhost:8000/auth/init"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue text-lg font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-gray-100 dark:border-black bg-white/50 dark:bg-black backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PindSync. Crafted with ❤️ for productivity.
          </p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-brand-blue transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-blue transition-colors">GitHub</a>
            <a href="#" className="hover:text-brand-blue transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
