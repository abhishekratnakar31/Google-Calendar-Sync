"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const images = [
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506784335131-e699942350ce?q=80&w=2668&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2674&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop"
];

const Column = ({ images, y }) => {
    return (
        <motion.div
            className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
            style={{ y }}
        >
            {images.map((src, i) => (
                <div key={i} className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
                    <img
                        src={src}
                        alt="image"
                        className="w-full h-full object-cover pointer-events-none"
                    />
                </div>
            ))}
        </motion.div>
    );
};

const ParallaxGallery = () => {
    const gallery = useRef(null);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    const { scrollYProgress } = useScroll({
        target: gallery,
        offset: ["start end", "end start"],
    });

    const { height } = dimension;
    const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

    useEffect(() => {
        const lenis = new Lenis();

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        const resize = () => {
            setDimension({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", resize);
        const rafId = requestAnimationFrame(raf);
        resize();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return (
        <div
            ref={gallery}
            className="relative box-border flex h-[150vh] gap-[2vw] overflow-hidden bg-transparent p-[2vw] opacity-40 rotate-[0deg] scale-110"
        >
            <Column images={[images[0], images[1], images[2]]} y={y} />
            <Column images={[images[3], images[4], images[5]]} y={y2} />
            <Column images={[images[6], images[7], images[8]]} y={y3} />
            <Column images={[images[9], images[10], images[11]]} y={y4} />

            {/* Overlay gradient to fade out edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black z-10 pointer-events-none"></div>
        </div>
    );
};

export default ParallaxGallery;
