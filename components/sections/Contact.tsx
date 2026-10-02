"use client";

import { ArrowUpRight, Mail, MapPin, Phone, Send } from "lucide-react";

import { motion, type Variants } from "motion/react";

import { profile, social } from "@/lib/data";

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

const contactContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const contactItemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
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

export default function Contact() {
    const hasEmail = Boolean(profile.email);
    const hasPhone = Boolean(profile.phone);
    const hasLocation = Boolean(profile.location);
    const hasLinkedin = Boolean(social.linkedin || profile.linkedin);
    const hasGithub = Boolean(social.github || profile.github);

    if (!hasEmail && !hasPhone && !hasLocation && !hasLinkedin && !hasGithub) {
        return null;
    }

    const linkedin = social.linkedin || profile.linkedin;
    const github = social.github || profile.github;

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative border-t border-border pt-[var(--space-section)] pb-[var(--space-section)]"
        >
            <div className="mx-auto w-full max-w-[var(--content-width)] px-5 sm:px-6">
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
                            <Send
                                size={18}
                                strokeWidth={1.8}
                            />
                        </motion.span>

                        <span className="text-sm font-medium uppercase tracking-[0.18em]">
                            Contact
                        </span>
                    </div>

                    <h2
                        id="contact-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        Let&apos;s Build Something
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Interested in working together, discussing an opportunity, or connecting
                        about software engineering?
                    </p>
                </motion.div>

                {/* Contact Content */}
                <motion.div
                    variants={contactContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                    className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
                >
                    {/* Primary Contact Card */}
                    <motion.div
                        variants={contactItemVariants}
                        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-7 sm:p-9"
                    >
                        <div className="relative z-10">
                            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted">
                                Get in touch
                            </p>

                            <h3 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                                Open to meaningful software engineering opportunities.
                            </h3>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                                I&apos;m available for conversations around full-stack web and
                                mobile development, engineering opportunities, and technical
                                collaborations.
                            </p>

                            {hasEmail && (
                                <motion.a
                                    href={`mailto:${profile.email}`}
                                    whileHover={{
                                        y: -2,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                    className="mt-8 inline-flex items-center gap-2.5 rounded-[var(--radius-md)] bg-button-background px-5 py-3 text-sm font-medium text-button-foreground"
                                >
                                    <Mail
                                        size={16}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                    Email Me
                                    <ArrowUpRight
                                        size={15}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </motion.a>
                            )}
                        </div>
                    </motion.div>

                    {/* Contact Details */}
                    <motion.div
                        variants={contactItemVariants}
                        className="rounded-[var(--radius-lg)] border border-border bg-surface"
                    >
                        <div className="divide-y divide-border">
                            {hasEmail && (
                                <ContactItem
                                    icon={Mail}
                                    label="Email"
                                    value={profile.email}
                                    href={`mailto:${profile.email}`}
                                />
                            )}

                            {hasPhone && (
                                <ContactItem
                                    icon={Phone}
                                    label="Phone"
                                    value={profile.phone}
                                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                                />
                            )}

                            {hasLocation && (
                                <ContactItem
                                    icon={MapPin}
                                    label="Location"
                                    value={profile.location}
                                />
                            )}

                            {hasLinkedin && linkedin && (
                                <ContactItem
                                    iconUrl="https://api.iconify.design/mdi:linkedin.svg?color=%230A66C2"
                                    label="LinkedIn"
                                    value="LinkedIn Profile"
                                    href={
                                        linkedin.startsWith("http")
                                            ? linkedin
                                            : `https://${linkedin}`
                                    }
                                    external
                                />
                            )}

                            {hasGithub && github && (
                                <ContactItem
                                    iconUrl="https://api.iconify.design/simple-icons:github.svg?color=%23666666"
                                    label="GitHub"
                                    value="GitHub Profile"
                                    href={github.startsWith("http") ? github : `https://${github}`}
                                    external
                                />
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function ContactItem({
    icon: Icon,
    iconUrl,
    label,
    value,
    href,
    external = false,
}: {
    icon?: typeof Mail;
    iconUrl?: string;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
}) {
    const content = (
        <div className="group flex items-center gap-4 p-5 sm:p-6">
            <motion.div
                whileHover={{
                    scale: 1.08,
                    rotate: 4,
                }}
                transition={{
                    duration: 0.2,
                    ease: "easeOut",
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-background"
            >
                {iconUrl ? (
                    <img
                        src={iconUrl}
                        alt=""
                        width={16}
                        height={16}
                        aria-hidden="true"
                        className="h-4 w-4"
                    />
                ) : Icon ? (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                ) : null}
            </motion.div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                    {label}
                </p>

                <p className="mt-1 truncate text-sm font-medium">{value}</p>
            </div>

            {href && (
                <ArrowUpRight
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                    className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                />
            )}
        </div>
    );

    if (!href) {
        return <div>{content}</div>;
    }

    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
        >
            {content}
        </a>
    );
}
