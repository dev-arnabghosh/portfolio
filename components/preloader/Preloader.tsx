"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const ANIMATION_DURATION = 2200;
const EXIT_DURATION = 500;
const EXIT_DELAY = 300;

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [animationFinished, setAnimationFinished] = useState(false);

    useEffect(() => {
        const handleLoad = () => {
            setPageLoaded(true);
        };

        if (document.readyState === "complete") {
            setPageLoaded(true);
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => {
            window.removeEventListener("load", handleLoad);
        };
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setAnimationFinished(true);
        }, ANIMATION_DURATION);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!pageLoaded || !animationFinished) {
            return;
        }

        setIsLoading(false);
    }, [pageLoaded, animationFinished]);

    return (
        <AnimatePresence
            onExitComplete={() => {
                window.dispatchEvent(new Event("preloaderComplete"));
            }}
        >
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-background"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: {
                            delay: EXIT_DELAY / 1000,
                            duration: EXIT_DURATION / 1000,
                            ease: [0.22, 1, 0.36, 1],
                        },
                    }}
                >
                    <motion.div
                        className="relative h-16 w-16 overflow-hidden bg-foreground"
                        initial={{
                            scale: 0.7,
                            opacity: 0,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {/* AG — initial contrast */}
                        <motion.span
                            className="absolute inset-0 z-30 flex items-center justify-center text-base font-bold italic tracking-tight text-background"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{
                                delay: 1.65,
                                duration: 0.2,
                                ease: "easeInOut",
                            }}
                        >
                            AG
                        </motion.span>

                        {/* Square fill */}
                        <motion.div
                            className="absolute inset-x-0 bottom-0 z-20 bg-background"
                            initial={{
                                height: "0%",
                            }}
                            animate={{
                                height: "100%",
                            }}
                            transition={{
                                delay: 0.55,
                                duration: 1.1,
                                ease: [0.65, 0, 0.35, 1],
                            }}
                        />

                        {/* AG — final contrast */}
                        <motion.span
                            className="absolute inset-0 z-40 flex items-center justify-center text-base font-bold italic tracking-tight text-foreground"
                            initial={{
                                opacity: 0,
                                scale: 0.92,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.15,
                                    ease: "easeOut",
                                },
                            }}
                            transition={{
                                delay: 1.65,
                                duration: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            AG
                        </motion.span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
