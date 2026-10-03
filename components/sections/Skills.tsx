"use client";

import { useState } from "react";
import {
    Braces,
    Database,
    Layers3,
    PanelsTopLeft,
    Server,
    Wrench,
    CodeXml,
    ListChecks,
    Cpu
} from "lucide-react";
import { motion, type Variants } from "motion/react";

import { skills } from "@/lib/data";

interface Skill {
    name: string;
    icon: string;
}

interface SkillCategory {
    key: keyof typeof skills;
    number: string;
    title: string;
    description: string;
    icon: typeof Braces;
}

const skillCategories: SkillCategory[] = [
    {
        key: "languages",
        number: "01",
        title: "Languages",
        description: "Core programming and query languages.",
        icon: CodeXml,
    },
    {
        key: "backend",
        number: "02",
        title: "Backend",
        description: "Application frameworks, APIs and backend architecture.",
        icon: Server,
    },
    {
        key: "frontendAndMobile",
        number: "03",
        title: "Frontend & Mobile",
        description: "Web and mobile technologies for application interfaces.",
        icon: PanelsTopLeft,
    },
    {
        key: "databases",
        number: "04",
        title: "Databases",
        description: "Database systems and database programming technologies.",
        icon: Database,
    },
    {
        key: "toolsAndDevelopment",
        number: "05",
        title: "Tools & Development",
        description: "Development, testing and version-control tooling.",
        icon: Wrench,
    },
    {
        key: "practices",
        number: "06",
        title: "Practices",
        description: "Engineering practices and development processes.",
        icon: ListChecks,
    },
];

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

const categoryVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
    },

    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            delay: index * 0.08,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const skillContainerVariants: Variants = {
    hidden: {},

    visible: {
        transition: {
            staggerChildren: 0.045,
        },
    },
};

const skillVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.92,
        y: 8,
    },

    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function Skills() {
    return (
        <section
            id="skills"
            aria-labelledby="skills-heading"
            className="border-t border-border"
        >
            <div className="mx-auto max-w-(--content-width) px-5 py-(--space-section) sm:px-6">
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
                            <Layers3
                                size={18}
                                strokeWidth={1.8}
                            />
                        </motion.span>

                        <span className="text-sm font-medium uppercase tracking-[0.18em]">
                            Skills
                        </span>
                    </div>

                    <h2
                        id="skills-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        Technical Stack
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Technologies, tools and engineering practices used across full-stack web and
                        mobile application development.
                    </p>
                </motion.div>

                {/* Core Technologies */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
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
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mb-6 overflow-hidden rounded-lg border border-border bg-surface"
                >
                    <div className="flex flex-col border-b border-border sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
                            <Cpu
                                size={17}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            <span className="text-sm font-medium">Core Technologies</span>
                        </div>

                        <div className="border-t border-border px-5 py-3 text-xs text-muted sm:border-l sm:border-t-0 sm:px-6">
                            Full Stack · Web · Mobile
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <FeaturedSkill
                            skill={skills.languages[0]}
                            index={0}
                        />

                        <FeaturedSkill
                            skill={skills.backend[1]}
                            index={1}
                        />

                        <FeaturedSkill
                            skill={skills.frontendAndMobile[0]}
                            index={2}
                        />

                        <FeaturedSkill
                            skill={skills.frontendAndMobile[2]}
                            index={3}
                        />
                    </div>
                </motion.div>

                {/* Skill Categories */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {skillCategories.map((category, index) => (
                        <SkillCategoryCard
                            key={category.key}
                            category={category}
                            index={index}
                            skills={skills[category.key]}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Skill Icon                                                                  */
/* -------------------------------------------------------------------------- */

function SkillIcon({ skill, size = 32 }: { skill: Skill; size?: number }) {
    const [imageError, setImageError] = useState(false);

    const fallbackLetter = skill.name.charAt(0).toUpperCase();

    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-sm border border-border bg-surface font-semibold text-foreground"
            style={{
                width: size + 10,
                height: size + 10,
            }}
        >
            {!imageError ? (
                <img
                    src={skill.icon}
                    alt={`${skill.name} icon`}
                    width={size}
                    height={size}
                    loading="lazy"
                    draggable={false}
                    onError={() => setImageError(true)}
                    className="h-full w-full select-none object-contain p-1.5"
                />
            ) : (
                <span
                    aria-hidden="true"
                    className="text-sm font-bold"
                >
                    {fallbackLetter}
                </span>
            )}
        </div>
    );
}
/* -------------------------------------------------------------------------- */
/* Featured Skill                                                              */
/* -------------------------------------------------------------------------- */

function FeaturedSkill({ skill, index }: { skill: Skill; index: number }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 15,
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
                duration: 0.45,
                delay: index * 0.08,
            }}
            whileHover={{
                y: -4,
            }}
            className="group/featured relative flex min-h-28 cursor-default items-center gap-3 border-b border-border p-5 transition-colors duration-300 last:border-b-0 hover:bg-background sm:min-h-32 sm:border-b-0 sm:border-r sm:p-6"
        >
            {/* Technology hover area */}
            <div className="group/technology relative flex min-w-0 items-center gap-3">
                <motion.div
                    whileHover={{
                        scale: 1.12,
                        rotate: 4,
                    }}
                    transition={{
                        duration: 0.25,
                        ease: "easeOut",
                    }}
                >
                    <SkillIcon
                        skill={skill}
                        size={32}
                    />
                </motion.div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{skill.name}</p>

                    <p className="mt-1 text-xs text-muted">Core technology</p>
                </div>

                {/* Technology tooltip */}
                <div
                    role="tooltip"
                    className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-40 origin-bottom -translate-x-1/2 translate-y-2 rotate-[-8deg] scale-90 whitespace-nowrap rounded-sm bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background opacity-0 shadow-sm transition-all duration-250 ease-out group-hover/technology:translate-y-0 group-hover/technology:rotate-0 group-hover/technology:scale-100 group-hover/technology:opacity-100"
                >
                    {skill.name}
                </div>
            </div>

            {/* Subtle hover progress */}
            <motion.span
                initial={{
                    scaleX: 0,
                }}
                whileHover={{
                    scaleX: 1,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
                className="absolute bottom-0 left-5 right-5 h-px origin-left bg-foreground sm:left-6 sm:right-6"
                aria-hidden="true"
            />
        </motion.div>
    );
}

/* -------------------------------------------------------------------------- */
/* Skill Category Card                                                         */
/* -------------------------------------------------------------------------- */

function SkillCategoryCard({
    category,
    index,
    skills: categorySkills,
}: {
    category: SkillCategory;
    index: number;
    skills: Skill[];
}) {
    return (
        <motion.article
            custom={index}
            variants={categoryVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.15,
            }}
            whileHover={{
                y: -5,
            }}
            className="group relative overflow-hidden rounded-lg border border-border bg-surface p-5 transition-[border-color,box-shadow] duration-300 hover:border-foreground/40 hover:shadow-sm sm:p-6"
        >
            <div className="relative z-10">
                {/* Category heading */}
                <div className="mb-7 flex items-start justify-between gap-4">
                    <div>
                        <span className="font-mono text-xs text-muted">{category.number}</span>

                        <h3 className="mt-2 text-xl font-semibold tracking-tight">
                            {category.title}
                        </h3>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                            {category.description}
                        </p>
                    </div>

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
                        <category.icon
                            size={16}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                    </motion.div>
                </div>

                {/* Skills */}
                <motion.ul
                    variants={skillContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                    aria-label={`${category.title} skills`}
                >
                    {categorySkills.map((skill) => (
                        <SkillItem
                            key={skill.name}
                            skill={skill}
                        />
                    ))}
                </motion.ul>
            </div>

            {/* Bottom animation */}
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

/* -------------------------------------------------------------------------- */
/* Skill Item                                                                  */
/* -------------------------------------------------------------------------- */

function SkillItem({ skill }: { skill: Skill }) {
    return (
        <motion.li
            variants={skillVariants}
            whileHover={{
                y: -3,
                x: 2,
            }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className="group/skill relative flex min-h-14 items-center gap-3 overflow-visible rounded-md border border-border bg-background px-3 py-2.5 transition-[border-color,background-color,box-shadow] duration-250 hover:border-foreground/40 hover:bg-surface hover:shadow-sm"
        >
            {/* Technology hover area */}
            <div className="group/technology relative flex min-w-0 flex-1 items-center gap-3">
                <motion.div
                    whileHover={{
                        scale: 1.14,
                        rotate: 5,
                    }}
                    transition={{
                        duration: 0.2,
                        ease: "easeOut",
                    }}
                >
                    <SkillIcon
                        skill={skill}
                        size={24}
                    />
                </motion.div>

                <span className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm">
                    {skill.name}
                </span>

                {/* Technology tooltip */}
                <div
                    role="tooltip"
                    className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-40 origin-bottom -translate-x-1/2 translate-y-2 rotate-[-8deg] scale-90 whitespace-nowrap rounded-sm bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background opacity-0 shadow-sm transition-all duration-250 ease-out group-hover/technology:translate-y-0 group-hover/technology:rotate-0 group-hover/technology:scale-100 group-hover/technology:opacity-100"
                >
                    {skill.name}
                </div>
            </div>

            {/* Hover accent */}
            <motion.span
                initial={{
                    scaleX: 0,
                }}
                whileHover={{
                    scaleX: 1,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeOut",
                }}
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-foreground"
                aria-hidden="true"
            />
        </motion.li>
    );
}
