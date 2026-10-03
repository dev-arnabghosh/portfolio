"use client";

import {
    Award,
    CalendarDays,
    ChartNoAxesCombined,
    Code2,
    Database,
    GitPullRequest,
    Medal,
    Smartphone,
    Trophy,
    Bug,
} from "lucide-react";

import { motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";

import { achievements } from "@/lib/data";

const sectionVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const awardContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.09,
        },
    },
};

const awardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const impactContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const impactVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

/* -------------------------------------------------------
   Impact metric icon mapping
------------------------------------------------------- */

const impactIcons = [
    Bug,
    Database,
    GitPullRequest,
    Code2,
    Smartphone,
    ChartNoAxesCombined,
];

/* -------------------------------------------------------
   Count Up
------------------------------------------------------- */

function CountUp({
    value,
    start,
    duration = 1600,
}: {
    value: string;
    start: boolean;
    duration?: number;
}) {
    const numericValue = Number.parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[0-9]/g, "");

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) {
            setCount(0);
            return;
        }

        let animationFrame: number;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.round(numericValue * easedProgress));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(numericValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [start, numericValue, duration]);

    return (
        <>
            {count}
            {suffix}
        </>
    );
}

/* -------------------------------------------------------
   Impact Card
------------------------------------------------------- */

function ImpactCard({
    item,
    index,
}: {
    item: (typeof achievements.impact)[number];
    index: number;
}) {
    const [isVisible, setIsVisible] = useState(false);

    const ImpactIcon = impactIcons[index % impactIcons.length];

    return (
        <motion.article
            variants={impactVariants}
            onViewportEnter={() => setIsVisible(true)}
            viewport={{
                once: true,
                amount: 0.25,
            }}
            whileHover={{
                y: -5,
            }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
            className="group relative overflow-hidden rounded-lg border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-foreground/40 hover:shadow-sm sm:p-7"
        >
            {/* Card Content */}
            <div className="relative z-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    {/* Card Number */}
                    <span className="font-mono text-xs text-muted">
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Metric Icon */}
                    <motion.div
                        whileHover={{
                            scale: 1.08,
                            rotate: 5,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                        }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background"
                    >
                        <ImpactIcon
                            size={16}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                    </motion.div>
                </div>

                {/* Metric */}
                <motion.div
                    whileHover={{
                        scale: 1.04,
                    }}
                    transition={{
                        duration: 0.25,
                        ease: "easeOut",
                    }}
                    className="origin-left"
                >
                    <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                        <CountUp
                            value={item.value}
                            start={isVisible}
                        />
                    </p>

                    <h4 className="mt-2 text-base font-semibold tracking-tight">
                        {item.label}
                    </h4>
                </motion.div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {item.description}
                </p>
            </div>

            {/* Bottom Animation */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-5 right-5 h-px overflow-hidden bg-border sm:left-6 sm:right-6"
            >
                <motion.div
                    initial={{
                        x: "-100%",
                    }}
                    whileInView={{
                        x: "0%",
                    }}
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2 + index * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full w-full bg-foreground"
                />
            </div>
        </motion.article>
    );
}

export default function Achievements() {
    const hasAwards = achievements.awards.length > 0;
    const hasImpact = achievements.impact.length > 0;

    if (!hasAwards && !hasImpact) {
        return null;
    }

    return (
        <section
            id="achievements"
            aria-labelledby="achievements-heading"
            className="relative border-t border-border pt-(--space-section) pb-(--space-section)"
        >
            <div className="mx-auto w-full max-w-(--content-width) px-5 sm:px-8 lg:px-10">
                {/* Section Header */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mb-14 max-w-3xl"
                >
                    <div className="mb-4 flex items-center gap-3 text-muted">
                        <motion.span
                            initial={{
                                opacity: 0,
                                rotate: -20,
                                scale: 0.7,
                            }}
                            whileInView={{
                                opacity: 1,
                                rotate: 0,
                                scale: 1,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            aria-hidden="true"
                        >
                            <Trophy
                                size={18}
                                strokeWidth={1.8}
                            />
                        </motion.span>

                        <span className="text-sm font-medium uppercase tracking-[0.18em]">
                            Achievements
                        </span>
                    </div>

                    <h2
                        id="achievements-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        Professional Highlights
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Recognition and measurable contributions across engineering,
                        delivery and professional development.
                    </p>
                </motion.div>

                {/* Awards */}
                {hasAwards && (
                    <section
                        aria-labelledby="awards-heading"
                        className={hasImpact ? "mb-16" : ""}
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.55,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="mb-6 flex items-center gap-2.5"
                        >
                            <Medal
                                size={17}
                                strokeWidth={1.7}
                                aria-hidden="true"
                            />

                            <h3
                                id="awards-heading"
                                className="text-lg font-semibold tracking-tight"
                            >
                                Recognition & Awards
                            </h3>
                        </motion.div>

                        <motion.ol
                            variants={awardContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{
                                once: true,
                                amount: 0.1,
                            }}
                            className="overflow-hidden rounded-lg border border-border bg-surface"
                        >
                            {achievements.awards.map((award, index) => (
                                <motion.li
                                    key={`${award.title}-${award.date}`}
                                    variants={awardVariants}
                                    whileHover={{
                                        x: 4,
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                    className="group relative border-b border-border last:border-b-0"
                                >
                                    {/* Hover Line */}
                                    <motion.div
                                        className="absolute inset-y-0 left-0 w-px origin-top bg-foreground"
                                        initial={{
                                            scaleY: 0,
                                        }}
                                        whileHover={{
                                            scaleY: 1,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut",
                                        }}
                                        aria-hidden="true"
                                    />

                                    <div className="grid gap-4 p-5 sm:grid-cols-[48px_1fr_auto] sm:items-center sm:gap-6 sm:px-6 sm:py-5">
                                        {/* Number */}
                                        <span className="font-mono text-xs text-muted">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        {/* Award Information */}
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <Award
                                                    size={16}
                                                    strokeWidth={1.7}
                                                    aria-hidden="true"
                                                    className="shrink-0 text-muted"
                                                />

                                                <h4 className="text-sm font-semibold leading-6 sm:text-base">
                                                    {award.title}
                                                </h4>

                                                {award.count && award.count > 1 && (
                                                    <span className="rounded-sm border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                                                        ×{award.count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-muted sm:justify-end">
                                            <CalendarDays
                                                size={14}
                                                strokeWidth={1.7}
                                                aria-hidden="true"
                                            />

                                            <time className="text-xs font-medium sm:text-sm">
                                                {award.date}
                                            </time>
                                        </div>
                                    </div>

                                    {/* Bottom Hover Accent */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 h-px w-full origin-left bg-foreground"
                                        initial={{
                                            scaleX: 0,
                                        }}
                                        whileHover={{
                                            scaleX: 1,
                                        }}
                                        transition={{
                                            duration: 0.35,
                                            ease: "easeOut",
                                        }}
                                        aria-hidden="true"
                                    />
                                </motion.li>
                            ))}
                        </motion.ol>
                    </section>
                )}

                {/* Impact */}
                {hasImpact && (
                    <section aria-labelledby="impact-heading">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.55,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="mb-6 flex items-center gap-2.5"
                        >
                            <ChartNoAxesCombined
                                size={17}
                                strokeWidth={1.7}
                                aria-hidden="true"
                            />

                            <h3
                                id="impact-heading"
                                className="text-lg font-semibold tracking-tight"
                            >
                                Impact Highlights
                            </h3>
                        </motion.div>

                        <motion.div
                            variants={impactContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{
                                once: true,
                                amount: 0.1,
                            }}
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                        >
                            {achievements.impact.map((item, index) => (
                                <ImpactCard
                                    key={`${item.value}-${item.label}`}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </section>
                )}
            </div>
        </section>
    );
}