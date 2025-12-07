import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './Curve.css';

const routes = {
    "/": "Home",
    "/about": "About",
    "/events": "Events",
    "/gcal": "Google Sync",
    "/login": "Login"
};

export const anim = (variants) => ({
    variants,
    initial: "initial",
    animate: "enter",
    exit: "exit"
});

export default function Curve({ children, backgroundColor }) {
    const location = useLocation();

    const [dimensions, setDimensions] = useState({
        width: null,
        height: null
    });

    useEffect(() => {
        function resize() {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div className='page curve' style={{ backgroundColor }}>
            <div
                style={{ opacity: dimensions.width == null ? 1 : 0 }}
                className='background'
            />

            <motion.p className='route' {...anim(text)}>
                {routes[location.pathname] || "PindSync"}
            </motion.p>

            {dimensions.width != null && <SVG {...dimensions} />}

            {children}
        </div>
    );
}

// ... existing imports

// ... routes definition

// ... anim function

// ... Curve component

export const SVG = ({ height, width }) => {
    const initialPath = `
    M0 300 
    Q${width / 2} 0 ${width} 300
    L${width} ${height + 300}
    Q${width / 2} ${height + 600} 0 ${height + 300}
    L0 0
  `;

    const targetPath = `
    M0 300
    Q${width / 2} 0 ${width} 300
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    L0 0
  `;

    return (
        <motion.svg {...anim(translate)} className="curve-svg">
            <motion.path {...anim(curve(initialPath, targetPath))} />
        </motion.svg>
    );
};

/* ANIMATION VARIANTS */

export const text = {
    initial: {
        opacity: 1,
    },
    enter: {
        opacity: 0,
        top: -100,
        transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
        transitionEnd: { top: "47.5%" }
    },
    exit: {
        opacity: 0,
        top: "40%",
        transition: { duration: 0.5, delay: 0, ease: [0.33, 1, 0.68, 1] }
    }
};

export const curve = (initialPath, targetPath) => ({
    initial: { d: initialPath },
    enter: {
        d: targetPath,
        transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
        d: initialPath,
        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
    }
});

export const translate = {
    initial: { top: "-300px" },
    enter: {
        top: "-100vh",
        transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
        transitionEnd: { top: "100vh" }
    },
    exit: {
        top: "-300px",
        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
    }
};
