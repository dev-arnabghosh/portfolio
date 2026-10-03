"use client";

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { profile, sectionAvailability } from "@/lib/data";

export default function Hero() {
    const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

    useEffect(() => {
        const handlePreloaderComplete = () => {
            setIsPreloaderComplete(true);
        };

        window.addEventListener("preloaderComplete", handlePreloaderComplete);

        return () => {
            window.removeEventListener("preloaderComplete", handlePreloaderComplete);
        };
    }, []);

    return (
        <section
            id="about"
            aria-labelledby="hero-heading"
            className="relative overflow-hidden"
        >
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-(--content-width) items-center gap-12 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-16 lg:py-24">
                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={isPreloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                    transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="order-2 md:order-1"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={isPreloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                        transition={{
                            delay: 0.1,
                            duration: 0.5,
                        }}
                        className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-muted"
                    >
                        {profile.title}
                    </motion.p>

                    <motion.h1
                        id="hero-heading"
                        initial={{ opacity: 0, y: 18 }}
                        animate={isPreloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                        transition={{
                            delay: 0.15,
                            duration: 0.6,
                        }}
                        className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                    >
                        {profile.name}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={isPreloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                        transition={{
                            delay: 0.22,
                            duration: 0.6,
                        }}
                        className="mt-5 max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground sm:text-2xl"
                    >
                        {profile.headline}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={isPreloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                        transition={{
                            delay: 0.29,
                            duration: 0.6,
                        }}
                        className="mt-6 max-w-xl text-base leading-7 text-muted-foreground"
                    >
                        Full Stack Developer with {profile.experience} of experience building web
                        and mobile applications with scalable architecture, reusable components and
                        thoughtful user experiences.
                    </motion.p>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={isPreloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                        transition={{
                            delay: 0.36,
                            duration: 0.6,
                        }}
                        className="mt-8 flex flex-col gap-3 sm:flex-row"
                    >
                        <a
                            href="/resume.pdf"
                            download
                            className="group inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
                            style={{
                                backgroundColor: "var(--foreground)",
                                color: "var(--background)",
                            }}
                        >
                            Resume
                            <Download
                                size={16}
                                strokeWidth={1.8}
                                className="ml-2 transition-transform duration-300 group-hover:translate-y-0.5"
                                aria-hidden="true"
                            />
                        </a>

                        {sectionAvailability.contact && (
                            <Link
                                href="#contact"
                                className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface"
                            >
                                Connect
                            </Link>
                        )}
                    </motion.div>
                </motion.div>

                {/* Portrait */}
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.94,
                        x: 24,
                    }}
                    animate={
                        isPreloaderComplete
                            ? {
                                  opacity: 1,
                                  scale: 1,
                                  x: 0,
                              }
                            : {
                                  opacity: 0,
                                  scale: 0.94,
                                  x: 24,
                              }
                    }
                    transition={{
                        duration: 0.8,
                        delay: 0.15,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="order-1 flex justify-center md:order-2 md:justify-end"
                >
                    <motion.div
                        whileHover={{ scale: 1.015 }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut",
                        }}
                        className="relative w-full max-w-105 select-none"
                    >
                        <div className="overflow-hidden rounded-lg border border-border bg-surface">
                            <Image
                                src="/images/arnab-ghosh.jpg"
                                alt="Arnab Ghosh, Full Stack Developer"
                                width={1254}
                                height={1254}
                                priority
                                draggable={false}
                                className="h-auto w-full select-none object-cover grayscale"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
