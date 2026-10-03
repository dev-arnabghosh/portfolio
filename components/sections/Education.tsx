"use client";

import { Award, BookMarked, CalendarDays, GraduationCap, School, University } from "lucide-react";

import { motion, type Variants } from "motion/react";

import { education } from "@/lib/data";

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
        y: 32,
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

const featuredVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
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

function getEducationIcon(degree: string) {
    if (degree.toLowerCase().includes("bachelor")) {
        return GraduationCap;
    }

    if (degree.toLowerCase().includes("xii")) {
        return School;
    }

    return BookMarked;
}

export default function Education() {
    if (education.length === 0) {
        return null;
    }

    const featuredEducation = education[0];
    const secondaryEducation = education.slice(1);

    const FeaturedIcon = getEducationIcon(featuredEducation.degree);

    return (
        <section
            id="education"
            aria-labelledby="education-heading"
            className="relative border-t border-border pt-(--space-section) pb-(--space-section)"
        >
            <div className="mx-auto w-full max-w-(--content-width) px-5 sm:px-6">
                {/* Section Header */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
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
                            <GraduationCap
                                size={18}
                                strokeWidth={1.8}
                            />
                        </motion.span>

                        <span className="text-sm font-medium uppercase tracking-[0.18em]">
                            Education
                        </span>
                    </div>

                    <h2
                        id="education-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        Academic Foundation
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Academic background in Electronics and Communication Engineering with a
                        strong foundation in software development and computer science.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                >
                    {/* Featured Education */}
                    <motion.article
                        variants={featuredVariants}
                        className="group relative overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-300"
                    >
                        <div className="grid lg:grid-cols-[1fr_auto]">
                            {/* Main Content */}
                            <div className="p-6 sm:p-8 lg:p-10">
                                {/* Degree Header */}
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <motion.div
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border bg-background"
                                            whileHover={{
                                                scale: 1.08,
                                                rotate: 5,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                ease: "easeOut",
                                            }}
                                        >
                                            <FeaturedIcon
                                                size={20}
                                                strokeWidth={1.7}
                                                aria-hidden="true"
                                            />
                                        </motion.div>

                                        <div className="min-w-0">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-muted">
                                                01
                                            </p>

                                            <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                                                {featuredEducation.degree}
                                            </h3>

                                            {featuredEducation.field && (
                                                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                                    {featuredEducation.field}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* CGPA */}
                                    {featuredEducation.cgpa && (
                                        <motion.div
                                            whileHover={{
                                                y: -3,
                                                scale: 1.03,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                ease: "easeOut",
                                            }}
                                            className="flex w-fit shrink-0 items-center gap-3 border-t border-border pt-3 sm:border-t-0 sm:pt-0"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                                                <Award
                                                    size={14}
                                                    strokeWidth={1.7}
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                                                    CGPA
                                                </p>

                                                <p className="text-base font-semibold">
                                                    {featuredEducation.cgpa}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Institution & University */}
                                <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
                                    <div className="flex items-start gap-3 rounded-sm border border-border bg-background p-4">
                                        <University
                                            size={17}
                                            strokeWidth={1.7}
                                            className="mt-0.5 shrink-0 text-muted"
                                            aria-hidden="true"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                                                Institution
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-5">
                                                {featuredEducation.institution}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-sm border border-border bg-background p-4">
                                        <School
                                            size={17}
                                            strokeWidth={1.7}
                                            className="mt-0.5 shrink-0 text-muted"
                                            aria-hidden="true"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                                                University
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-5">
                                                {featuredEducation.university}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Period */}
                                <div className="mt-8">
                                    <div className="mb-2 flex items-center justify-between text-xs text-muted">
                                        <span>{featuredEducation.startYear}</span>

                                        <span>{featuredEducation.endYear}</span>
                                    </div>

                                    <div
                                        className="relative h-px overflow-visible bg-border"
                                        aria-label={`Academic period from ${featuredEducation.startYear} to ${featuredEducation.endYear}`}
                                    >
                                        <motion.div
                                            className="absolute inset-y-0 left-0 w-full origin-left bg-foreground"
                                            initial={{
                                                scaleX: 0,
                                            }}
                                            whileInView={{
                                                scaleX: 1,
                                            }}
                                            viewport={{
                                                once: true,
                                            }}
                                            transition={{
                                                duration: 1,
                                                delay: 0.35,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        />

                                        <motion.span
                                            className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground bg-background"
                                            initial={{
                                                scale: 0,
                                            }}
                                            whileInView={{
                                                scale: 1,
                                            }}
                                            viewport={{
                                                once: true,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                delay: 0.35,
                                            }}
                                        />

                                        <motion.span
                                            className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground bg-background"
                                            initial={{
                                                scale: 0,
                                            }}
                                            whileInView={{
                                                scale: 1,
                                            }}
                                            viewport={{
                                                once: true,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                delay: 1.1,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Coursework */}
                                {featuredEducation.coursework &&
                                    featuredEducation.coursework.length > 0 && (
                                        <div className="mt-8">
                                            <div className="mb-3 flex items-center gap-2">
                                                <BookMarked
                                                    size={15}
                                                    strokeWidth={1.7}
                                                    aria-hidden="true"
                                                />

                                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                                                    Coursework
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {featuredEducation.coursework.map(
                                                    (course, index) => (
                                                        <motion.span
                                                            key={course}
                                                            initial={{
                                                                opacity: 0,
                                                                y: 8,
                                                            }}
                                                            whileInView={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            viewport={{
                                                                once: true,
                                                            }}
                                                            transition={{
                                                                duration: 0.35,
                                                                delay: 0.55 + index * 0.07,
                                                            }}
                                                            whileHover={{
                                                                y: -2,
                                                            }}
                                                            className="rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:border-foreground"
                                                        >
                                                            {course}
                                                        </motion.span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Graduation Indicator */}
                            <motion.div
                                className="hidden w-28 border-l border-border lg:flex lg:items-center lg:justify-center"
                                whileHover={{
                                    y: -2,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <motion.div
                                        whileHover={{
                                            scale: 1.08,
                                            rotate: 5,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            ease: "easeOut",
                                        }}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background"
                                    >
                                        <GraduationCap
                                            size={19}
                                            strokeWidth={1.7}
                                            aria-hidden="true"
                                        />
                                    </motion.div>

                                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                                        Graduation
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.article>

                    {/* Secondary Education */}
                    {secondaryEducation.length > 0 && (
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            {secondaryEducation.map((item, index) => {
                                const Icon = getEducationIcon(item.degree);

                                return (
                                    <motion.article
                                        key={`${item.degree}-${item.endYear}`}
                                        variants={itemVariants}
                                        whileHover={{
                                            y: -5,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            ease: "easeOut",
                                        }}
                                        className="group relative overflow-hidden rounded-lg border border-border bg-surface p-6 transition-colors duration-300 hover:border-foreground sm:p-7"
                                    >
                                        {/* Bottom Hover Line */}
                                        <motion.div
                                            className="absolute inset-x-0 bottom-0 h-px origin-left bg-foreground"
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
                                        />

                                        {/* Card Header */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-start gap-3.5">
                                                <motion.div
                                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border bg-background"
                                                    whileHover={{
                                                        scale: 1.08,
                                                        rotate: 5,
                                                    }}
                                                    transition={{
                                                        duration: 0.25,
                                                        ease: "easeOut",
                                                    }}
                                                >
                                                    <Icon
                                                        size={18}
                                                        strokeWidth={1.7}
                                                        aria-hidden="true"
                                                    />
                                                </motion.div>

                                                <div className="min-w-0">
                                                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-muted">
                                                        {String(index + 2).padStart(2, "0")}
                                                    </p>

                                                    <h3 className="text-lg font-semibold leading-tight tracking-tight">
                                                        {item.degree}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1.5 text-muted">
                                                <CalendarDays
                                                    size={14}
                                                    strokeWidth={1.7}
                                                    aria-hidden="true"
                                                />

                                                <span className="text-xs font-medium">
                                                    {item.endYear}
                                                </span>
                                            </div>
                                        </div>

                                        {/* School Information */}
                                        <div className="mt-6 border-t border-border pt-5">
                                            <p className="text-sm font-medium leading-5">
                                                {item.institution}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-muted">
                                                {item.university}
                                            </p>
                                        </div>

                                        {/* Result */}
                                        {item.percentage && (
                                            <div className="mt-5 flex items-end justify-between">
                                                <span className="text-xs uppercase tracking-[0.14em] text-muted">
                                                    Result
                                                </span>

                                                <motion.span
                                                    whileHover={{
                                                        scale: 1.04,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="text-xl font-semibold tracking-tight"
                                                >
                                                    {item.percentage}
                                                </motion.span>
                                            </div>
                                        )}
                                    </motion.article>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
