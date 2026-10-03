"use client";

import { ArrowUp, ArrowUpRight, Heart } from "lucide-react";
import { motion } from "motion/react";
import type { MouseEvent, ReactNode } from "react";

import { profile, social } from "@/lib/data";

export default function Footer() {
    const linkedin = social.linkedin || profile.linkedin;
    const github = social.github || profile.github;

    return (
        <footer className="border-t border-border">
            <div className="bg-foreground text-background">
                <div className="mx-auto w-full max-w-(--content-width) px-5 sm:px-6">
                    {/* Main Footer */}
                    <div className="flex flex-col gap-10 py-12 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                        {/* Identity */}
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
                                amount: 0.3,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="max-w-md"
                        >
                            <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
                                Full Stack Developer
                            </p>

                            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                {profile.name}
                            </h2>

                            <p className="mt-3 max-w-sm text-sm leading-6 opacity-60">
                                Building web and mobile applications with Java, Spring Boot, React
                                and React Native.
                            </p>
                        </motion.div>

                        {/* Actions */}
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
                                amount: 0.3,
                            }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="flex flex-wrap items-center gap-5"
                        >
                            {linkedin && (
                                <FooterLink
                                    href={
                                        linkedin.startsWith("http")
                                            ? linkedin
                                            : `https://${linkedin}`
                                    }
                                    label="LinkedIn"
                                    plain
                                >
                                    <img
                                        src="https://api.iconify.design/mdi/linkedin.svg?color=%230A66C2"
                                        alt=""
                                        width={36}
                                        height={36}
                                        aria-hidden="true"
                                        className="h-9 w-9"
                                    />
                                </FooterLink>
                            )}

                            {github && (
                                <FooterLink
                                    href={github.startsWith("http") ? github : `https://${github}`}
                                    label="GitHub"
                                    plain
                                >
                                    <img
                                        src="https://api.iconify.design/simple-icons/github.svg?color=%23666666"
                                        alt=""
                                        width={36}
                                        height={36}
                                        aria-hidden="true"
                                        className="h-9 w-9"
                                    />
                                </FooterLink>
                            )}

                            <FooterLink
                                href="#"
                                label="Back to top"
                                onClick={(event) => {
                                    event.preventDefault();

                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                            >
                                <ArrowUp
                                    size={16}
                                    strokeWidth={1.7}
                                    aria-hidden="true"
                                />
                            </FooterLink>
                        </motion.div>
                    </div>

                    {/* Divider */}
                    <motion.div
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
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-px origin-left bg-background/15"
                        aria-hidden="true"
                    />

                    {/* Bottom Row */}
                    <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs opacity-45">
                            © {new Date().getFullYear()} {profile.name}. All rights reserved.
                        </p>

                        <p className="flex items-center gap-1.5 text-xs opacity-45">
                            Designed &amp; built with
                            <Heart
                                size={12}
                                strokeWidth={1.8}
                                className="fill-current"
                                aria-hidden="true"
                            />
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({
    href,
    label,
    children,
    onClick,
    plain = false,
}: {
    href: string;
    label: string;
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    plain?: boolean;
}) {
    const isExternal = href.startsWith("http");

    return (
        <motion.a
            href={href}
            aria-label={label}
            onClick={onClick}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            whileHover={{
                y: -3,
            }}
            whileTap={{
                scale: 0.94,
            }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className={
                plain
                    ? "flex items-center justify-center text-background/70 transition-colors duration-200 hover:text-background"
                    : "flex h-10 w-10 items-center justify-center rounded-md border border-background/15 bg-background/5 text-background transition-colors duration-200 hover:border-background/30 hover:bg-background/10"
            }
        >
            {children}
        </motion.a>
    );
}
