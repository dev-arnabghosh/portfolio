"use client";

import { Briefcase, MapPin } from "lucide-react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
    type Variants,
} from "motion/react";
import { useRef } from "react";

import { experience } from "@/lib/data";

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants: Variants = {
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

export default function Experience() {
    const timelineRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 70%", "end 35%"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        mass: 0.25,
    });

    return (
        <section
            id="experience"
            aria-labelledby="experience-heading"
            className="border-t border-border"
        >
            <div className="mx-auto max-w-[var(--content-width)] px-6 py-[var(--space-section)]">
                {/* =====================================================
                    SECTION HEADER
                ===================================================== */}

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mb-14 max-w-2xl"
                >
                    <div className="mb-4 flex items-center gap-3 text-muted">
                        <Briefcase
                            size={18}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        <span className="text-sm font-medium uppercase tracking-[0.18em]">
                            Experience
                        </span>
                    </div>

                    <h2
                        id="experience-heading"
                        className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                    >
                        Professional Experience
                    </h2>

                    <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                        Experience building web and mobile applications across full-stack, frontend
                        and Java development roles.
                    </p>
                </motion.div>

                {/* =====================================================
                    DESKTOP / TABLET TIMELINE
                    ===================================================== */}

                <div
                    ref={timelineRef}
                    className="relative hidden md:block"
                >
                    {/* Background timeline */}
                    <div
                        aria-hidden="true"
                        className="absolute bottom-0 left-[7px] top-0 w-px bg-border"
                    />

                    {/* Scroll-driven progress line */}
                    <motion.div
                        aria-hidden="true"
                        style={{
                            scaleY: smoothProgress,
                            transformOrigin: "top",
                        }}
                        className="absolute bottom-0 left-[7px] top-0 w-px bg-foreground"
                    />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.08,
                        }}
                        className="space-y-10 md:space-y-12"
                    >
                        {experience.map((item, index) => (
                            <motion.article
                                key={`${item.company}-${item.role}`}
                                variants={itemVariants}
                                className="relative pl-12"
                            >
                                {/* Timeline Dot */}
                                <TimelineDot
                                    index={index}
                                    total={experience.length}
                                    progress={smoothProgress}
                                />

                                <ExperienceCard item={item} />
                            </motion.article>
                        ))}
                    </motion.div>
                </div>

                {/* =====================================================
                    MOBILE CAREER JOURNEY
                    ===================================================== */}

                <div className="md:hidden">
                    <div className="space-y-12">
                        {experience.map((item, index) => (
                            <MobileExperienceItem
                                key={`${item.company}-${item.role}-mobile`}
                                item={item}
                                index={index}
                                total={experience.length}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   DESKTOP TIMELINE DOT
   ========================================================= */

function TimelineDot({
    index,
    total,
    progress,
}: {
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    /*
     * Do not make the final dot depend on progress === 1.
     *
     * The last experience should activate slightly before
     * the timeline reaches its absolute end.
     */
    const threshold = index === 0 ? 0 : index === total - 1 ? 0.82 : index / (total - 1);

    const activeProgress = useTransform(
        progress,
        [Math.max(0, threshold - 0.08), threshold],
        [0, 1],
    );

    const scale = useTransform(activeProgress, [0, 1], [1, 1.15]);

    const innerOpacity = useTransform(activeProgress, [0, 1], [0, 1]);

    const innerScale = useTransform(activeProgress, [0, 1], [0.2, 1]);

    return (
        <motion.div
            style={{ scale }}
            whileHover={{ scale: 1.3 }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className="absolute left-0 top-2 z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-foreground bg-background"
            aria-hidden="true"
        >
            <motion.span
                style={{
                    opacity: innerOpacity,
                    scale: innerScale,
                }}
                className="h-full w-full rounded-full bg-foreground"
            />
        </motion.div>
    );
}

/* =========================================================
   MOBILE EXPERIENCE ITEM
   ========================================================= */

function MobileExperienceItem({
    item,
    index,
    total,
}: {
    item: (typeof experience)[number];
    index: number;
    total: number;
}) {
    const isLast = index === total - 1;

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 35,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.25,
            }}
            transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
        >
            {/* =====================================================
                MOBILE STEP HEADER
                ===================================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    x: -16,
                }}
                whileInView={{
                    opacity: 1,
                    x: 0,
                }}
                viewport={{
                    once: true,
                    amount: 0.5,
                }}
                transition={{
                    duration: 0.45,
                    ease: "easeOut",
                }}
                className="mb-4 flex items-center gap-3"
            >
                {/* Active number indicator */}
                <MobileStepNumber index={index} />

                {/* Horizontal progress line */}
                <motion.span
                    initial={{
                        scaleX: 0,
                    }}
                    whileInView={{
                        scaleX: 1,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.5,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.1,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-px flex-1 origin-left bg-border"
                />
            </motion.div>

            {/* =====================================================
                MOBILE CARD
                ===================================================== */}

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
                    delay: 0.08,
                    ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                    y: -4,
                }}
                whileTap={{
                    scale: 0.99,
                }}
                className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-foreground/40 hover:shadow-sm"
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight">{item.role}</h3>

                        <p className="mt-2 text-base font-medium text-muted-foreground">
                            {item.company}
                        </p>
                    </div>

                    <time
                        dateTime={item.startDate}
                        className="text-sm font-medium text-muted"
                    >
                        {item.startDate} — {item.endDate}
                    </time>

                    <div className="flex items-center gap-2 text-sm text-muted">
                        <MapPin
                            size={15}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        <span>{item.location}</span>
                    </div>
                </div>

                <div className="my-6 h-px bg-border" />

                <ul className="space-y-3">
                    {item.highlights.map((highlight) => (
                        <li
                            key={highlight}
                            className="relative pl-5 text-sm leading-7 text-muted-foreground"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute left-0 top-[0.7rem] h-1.5 w-1.5 rounded-full bg-foreground"
                            />

                            {highlight}
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* =====================================================
                MOBILE CONNECTOR
                ===================================================== */}

            {!isLast && <MobileConnector />}
        </motion.article>
    );
}

/* =========================================================
   MOBILE STEP NUMBER
   ========================================================= */

function MobileStepNumber({ index }: { index: number }) {
    return (
        <motion.div
            initial={{
                opacity: 0.45,
                scale: 0.9,
            }}
            whileInView={{
                opacity: 1,
                scale: 1,
            }}
            viewport={{
                once: true,
                amount: 0.5,
            }}
            transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-background"
            aria-label={`Experience ${index + 1}`}
        >
            {/* Solid active fill */}
            <motion.span
                initial={{
                    scale: 0,
                    opacity: 0,
                }}
                whileInView={{
                    scale: 1,
                    opacity: 1,
                }}
                viewport={{
                    once: true,
                    amount: 0.5,
                }}
                transition={{
                    duration: 0.4,
                    delay: 0.05,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 rounded-full bg-foreground"
                aria-hidden="true"
            />

            {/* Number */}
            <span className="relative z-10 text-xs font-bold text-background">
                {String(index + 1).padStart(2, "0")}
            </span>
        </motion.div>
    );
}

/* =========================================================
   MOBILE CONNECTOR
   ========================================================= */

function MobileConnector() {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scaleY: 0,
            }}
            whileInView={{
                opacity: 1,
                scaleY: 1,
            }}
            viewport={{
                once: true,
                amount: 0.5,
            }}
            transition={{
                duration: 0.5,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-8 flex h-8 w-px origin-top flex-col items-center bg-foreground"
            aria-hidden="true"
        />
    );
}

/* =========================================================
   REUSABLE EXPERIENCE CARD
   ========================================================= */

function ExperienceCard({ item }: { item: (typeof experience)[number] }) {
    return (
        <motion.div
            whileHover={{
                y: -3,
            }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
            className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-foreground/40 hover:shadow-sm sm:p-7 lg:p-8"
        >
            {/* Role + Date */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {item.role}
                    </h3>

                    <p className="mt-2 text-base font-medium text-muted-foreground">
                        {item.company}
                    </p>
                </div>

                <time
                    dateTime={item.startDate}
                    className="shrink-0 text-sm font-medium text-muted"
                >
                    {item.startDate} — {item.endDate}
                </time>
            </div>

            {/* Location */}
            <div className="mt-5 flex items-center gap-2 text-sm text-muted">
                <MapPin
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />

                <span>{item.location}</span>
            </div>

            {/* Highlights */}
            <ul className="mt-6 space-y-3">
                {item.highlights.map((highlight) => (
                    <li
                        key={highlight}
                        className="relative pl-5 text-sm leading-7 text-muted-foreground sm:text-base"
                    >
                        <span
                            aria-hidden="true"
                            className="absolute left-0 top-[0.7rem] h-1.5 w-1.5 rounded-full bg-foreground"
                        />

                        {highlight}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
