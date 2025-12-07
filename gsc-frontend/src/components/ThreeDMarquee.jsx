"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useEffect } from "react";
import Lenis from "lenis";

export const ThreeDMarquee = ({
    images,
    className = "",
    cols = 4,
    onImageClick,
}) => {
    // Smooth scroll init
    useEffect(() => {
        const lenis = new Lenis();
        let rafId;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
        };
    }, []);

    // Scroll animation setup
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "150vh"]);

    // Clone the image list multiple times for seamless scrolling and density
    const duplicatedImages = [...images, ...images, ...images];

    const groupSize = Math.ceil(duplicatedImages.length / cols);
    const imageGroups = Array.from({ length: cols }, (_, index) =>
        duplicatedImages.slice(index * groupSize, (index + 1) * groupSize)
    );

    const handleImageClick = (image, globalIndex) => {
        if (onImageClick) {
            onImageClick(image, globalIndex);
        } else if (image.href) {
            window.open(image.href, image.target || "_self");
        }
    };

    return (
        <section
            ref={container}
            className={`mx-auto block h-screen max-sm:h-[400px] overflow-hidden rounded-2xl bg-transparent ${className}`}
        >
            <motion.div style={{ y }} className="relative h-full w-full">
                <div
                    className="flex w-full h-full items-center justify-center"
                    style={{
                        transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg) scale(0.9)",
                    }}
                >
                    <div className="w-full overflow-hidden scale-90 sm:scale-100">
                        <div
                            className={`relative grid h-full w-full origin-center 
              grid-cols-3 sm:grid-cols-${cols} gap-2 transform 
              `}
                        >
                            {imageGroups.map((imagesInGroup, idx) => (
                                <motion.div
                                    key={`column-${idx}`}
                                    animate={{ y: idx % 2 === 0 ? [0, -100] : [0, 100] }}
                                    transition={{
                                        duration: idx % 2 === 0 ? 20 : 25,
                                        repeat: Infinity,
                                        repeatType: "loop", // Changed to loop for continuous flow if preferred, or "reverse" to match exactly. Original was reverse.
                                        // The user said "it should not stop the transition". Continuous loop is usually better for marquees.
                                        // But original was "reverse" with 100/-100. Let's stick to a continuous looking flow or the original "reverse".
                                        // The prompt said "transition of the column", implying the movement.
                                        // Let's use "reverse" as per original code to be safe, but maybe with larger range if needed?
                                        // Original: animate={{ y: idx % 2 === 0 ? 100 : -100 }}, repeatType: "reverse"
                                        repeatType: "reverse",
                                        ease: "linear",
                                    }}
                                    className={`flex flex-col items-center gap-6 relative ${idx % 2 === 0 ? '-mt-24' : 'mt-24'}`}
                                >
                                    <div className="absolute left-0 top-0 h-full w-0.5 bg-white dark:bg-black" />
                                    {imagesInGroup.map((image, imgIdx) => {
                                        const globalIndex = idx * groupSize + imgIdx;
                                        const isClickable = image.href || onImageClick;

                                        return (
                                            <div key={`img-${imgIdx}`} className="relative">
                                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
                                                <motion.img
                                                    whileHover={{ y: -10 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    src={image.src}
                                                    alt={image.alt}
                                                    width={970}
                                                    height={700}
                                                    className={`aspect-[970/700] w-full max-w-[200px] rounded-lg object-cover ring ring-gray-300/30 dark:ring-gray-800/50 shadow-xl hover:shadow-2xl transition-shadow duration-300 ${isClickable ? "cursor-pointer" : ""
                                                        }`}
                                                    onClick={() => handleImageClick(image, globalIndex)}
                                                />
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ThreeDMarquee;
