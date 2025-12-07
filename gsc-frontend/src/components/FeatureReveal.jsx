"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Zap, Shield, Globe, MoveUpRight as ArrowIcon } from "lucide-react";

const visualData = [
    {
        key: 1,
        title: "Lightning Fast Sync",
        desc: "Real-time synchronization with Google Calendar API ensures you never miss a beat.",
        icon: Zap,
        color: "text-brand-yellow",
        bg: "bg-brand-yellow/10",
        border: "border-brand-yellow/20"
    },
    {
        key: 2,
        title: "Secure & Private",
        desc: "Your data is yours. We use official Google OAuth for maximum security and privacy.",
        icon: Shield,
        color: "text-brand-blue",
        bg: "bg-brand-blue/10",
        border: "border-brand-blue/20"
    },
    {
        key: 3,
        title: "Access Anywhere",
        desc: "Manage your schedule from any device with our responsive, modern web interface.",
        icon: Globe,
        color: "text-brand-green",
        bg: "bg-brand-green/10",
        border: "border-brand-green/20"
    },
];

const FeatureReveal = () => {
    const [focusedItem, setFocusedItem] = useState(null);
    const [isLargeScreen, setIsLargeScreen] = useState(true);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const smoothX = useSpring(cursorX, { stiffness: 300, damping: 40 });
    const smoothY = useSpring(cursorY, { stiffness: 300, damping: 40 });

    useEffect(() => {
        const updateScreen = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };
        updateScreen();
        window.addEventListener("resize", updateScreen);
        return () => window.removeEventListener("resize", updateScreen);
    }, []);

    const onMouseTrack = (e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
    };

    const onHoverActivate = (item) => {
        setFocusedItem(item);
    };

    const onHoverDeactivate = () => {
        setFocusedItem(null);
    };

    return (
        <div
            className="relative mx-auto w-full min-h-fit rounded-md overflow-visible py-10"
            onMouseMove={onMouseTrack}
            onMouseLeave={onHoverDeactivate}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {visualData.map((item) => (
                    <div
                        key={item.key}
                        className="group p-6 cursor-pointer relative flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-white/5 transition-colors duration-300 rounded-xl"
                        onMouseEnter={() => onHoverActivate(item)}
                    >
                        {/* Mobile View Card (Always visible on small screens) */}
                        {!isLargeScreen && (
                            <div className={`w-full p-6 mb-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl`}>
                                <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10`}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        )}

                        <h2
                            className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter transition-all duration-300 ${focusedItem?.key === item.key
                                    ? "text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white translate-x-2"
                                    : "text-gray-300 dark:text-gray-700"
                                }`}
                        >
                            {item.title}
                        </h2>

                        <button
                            className={`hidden sm:block p-3 rounded-full border border-gray-200 dark:border-gray-800 text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:border-black dark:group-hover:border-white transition-all duration-300 transform group-hover:rotate-45`}
                        >
                            <ArrowIcon className="w-6 h-6" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Floating Card Reveal (Desktop Only) */}
            {isLargeScreen && focusedItem && (
                <motion.div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: smoothX,
                        top: smoothY,
                        x: "-50%",
                        y: "-50%",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <div className={`w-[320px] p-8 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl`}>
                        <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/10`}>
                            <focusedItem.icon className={`w-7 h-7 ${focusedItem.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{focusedItem.title}</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{focusedItem.desc}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default FeatureReveal;
