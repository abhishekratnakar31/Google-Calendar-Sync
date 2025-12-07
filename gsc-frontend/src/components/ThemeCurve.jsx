import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { anim } from './Curve';
import { useTheme } from '../context/ThemeContext';
import './Curve.css';

export default function ThemeCurve() {
    const { isTransitioning, theme } = useTheme();

    return (
        <AnimatePresence mode="wait">
            {isTransitioning && <ThemeCurveContent currentTheme={theme} />}
        </AnimatePresence>
    );
}

function ThemeCurveContent({ currentTheme }) {
    const [dimensions, setDimensions] = useState({
        width: null,
        height: null
    });

    // Lock text at mount time:
    // If current is 'light', we are switching to 'dark' -> Text: "Dark Mode"
    // If current is 'dark', we are switching to 'light' -> Text: "Light Mode"
    const [modeText] = useState(currentTheme === 'light' ? 'Dark Mode' : 'Light Mode');

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

    const themeTextAnim = {
        initial: {
            opacity: 1,
            top: "100vh"
        },
        enter: {
            opacity: 1,
            top: "40%",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
            opacity: 1,
            top: "100vh",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
        }
    };

    return (
        <div className='page curve' style={{ pointerEvents: 'none', zIndex: 9999 }}>
            <div
                style={{ opacity: dimensions.width == null ? 1 : 0 }}
                className='background'
            />

            <motion.p
                className='route'
                {...anim(themeTextAnim)}
                style={{ color: 'white', zIndex: 10000 }} // Text always white on black curve
            >
                {modeText}
            </motion.p>

            {dimensions.width != null && <ThemeSVG {...dimensions} />}
        </div>
    );
}

const ThemeSVG = ({ height, width }) => {
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

    const themeAnim = {
        initial: {
            top: "100vh"
        },
        enter: {
            top: "-300px",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
            top: "-200vh",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
        }
    };

    const themeCurveAnim = {
        initial: { d: initialPath },
        enter: {
            d: targetPath,
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
            d: initialPath,
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
        }
    };

    return (
        <motion.svg variants={themeAnim} initial="initial" animate="enter" exit="exit" className="curve-svg" style={{ pointerEvents: "none" }}>
            <motion.path variants={themeCurveAnim} />
        </motion.svg>
    );
};
