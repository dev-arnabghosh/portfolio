"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { sectionAvailability } from "@/lib/data";
const navigation = [
    { label: "About", href: "#about", enabled: sectionAvailability.about },
    { label: "Experience", href: "#experience", enabled: sectionAvailability.experience },
    { label: "Skills", href: "#skills", enabled: sectionAvailability.skills },
    { label: "Projects", href: "#projects", enabled: sectionAvailability.projects },
    { label: "Education", href: "#education", enabled: sectionAvailability.education },
    { label: "Achievements", href: "#achievements", enabled: sectionAvailability.achievements },
    { label: "Contact", href: "#contact", enabled: sectionAvailability.contact },
].filter((item) => item.enabled);
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("about");
    const activeSectionRef = useRef("about");
    const navigationTargetRef = useRef<string | null>(null);
    const navigationFrameRef = useRef<number | null>(null);
    const updateActiveSection = (sectionId: string) => {
        if (activeSectionRef.current === sectionId) {
            return;
        }
        activeSectionRef.current = sectionId;
        setActiveSection(sectionId);
    };
    /* * Detect page scroll for navbar appearance. */ useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    /* * Lock body scroll while mobile drawer is open. */ useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);
    /* * Close drawer with Escape. */ useEffect(() => {
        if (!isMenuOpen) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);
    /* * Active section detection. * * The section closest to the sticky navbar is active. */ useEffect(() => {
        const detectActiveSection = () => {
            if (navigationTargetRef.current) {
                return;
            }
            const navbar = document.getElementById("portfolio-navbar");
            const navbarHeight = navbar?.getBoundingClientRect().height ?? 64;
            let currentSection = navigation[0]?.href.slice(1);
            let closestDistance = Infinity;
            for (const item of navigation) {
                const section = document.getElementById(item.href.slice(1));
                if (!section) {
                    continue;
                }
                const rect = section.getBoundingClientRect();
                if (rect.top <= navbarHeight + 8) {
                    const distance = Math.abs(rect.top - navbarHeight);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        currentSection = section.id;
                    }
                }
            }
            if (currentSection) {
                updateActiveSection(currentSection);
            }
        };
        detectActiveSection();
        window.addEventListener("scroll", detectActiveSection, { passive: true });
        window.addEventListener("resize", detectActiveSection);
        return () => {
            window.removeEventListener("scroll", detectActiveSection);
            window.removeEventListener("resize", detectActiveSection);
        };
    }, []);
    /* * Stop monitoring an old navigation request. */ const cancelNavigation = () => {
        if (navigationFrameRef.current !== null) {
            window.cancelAnimationFrame(navigationFrameRef.current);
            navigationFrameRef.current = null;
        }
    };
    /* * Monitor smooth scrolling until the requested section * reaches the navbar. */ const monitorNavigation =
        (sectionId: string, targetScrollY: number) => {
            cancelNavigation();
            const check = () => {
                if (navigationTargetRef.current !== sectionId) {
                    navigationFrameRef.current = null;
                    return;
                }
                const distance = Math.abs(window.scrollY - targetScrollY);
                if (distance <= 2) {
                    navigationTargetRef.current = null;
                    navigationFrameRef.current = null;
                    updateActiveSection(sectionId);
                    return;
                }
                navigationFrameRef.current = window.requestAnimationFrame(check);
            };
            navigationFrameRef.current = window.requestAnimationFrame(check);
        };

    /* * Navigate to a section. */ const handleNavigation = (
        event: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        event.preventDefault();
        const sectionId = href.slice(1);
        const target = document.getElementById(sectionId);
        if (!target) {
            return;
        }
        cancelNavigation();
        navigationTargetRef.current = sectionId;
        updateActiveSection(sectionId);
        window.history.pushState(null, "", href);
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => {
            const navbar = document.getElementById("portfolio-navbar");
            const navbarHeight = navbar?.getBoundingClientRect().height ?? 64;
            const targetScrollY =
                sectionId === "about"
                    ? 0
                    : Math.max(
                          0,
                          target.getBoundingClientRect().top + window.scrollY - navbarHeight + 64,
                      );
            window.scrollTo({ top: targetScrollY, behavior: "smooth" });
            monitorNavigation(sectionId, targetScrollY);
        });
    };

    /* * AG brand → About / top. */ const handleBrandClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();
        cancelNavigation();
        navigationTargetRef.current = "about";
        updateActiveSection("about");
        setIsMenuOpen(false);
        window.history.pushState(null, "", "/");
        window.scrollTo({ top: 0, behavior: "smooth" });
        monitorNavigation("about", 0);
    };
    return (
        <>
            {" "}
            {/* ========================================================= MAIN NAVBAR DESKTOP — UNCHANGED ========================================================== */}{" "}
            <motion.header
                id="portfolio-navbar"
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow] duration-300 ${isScrolled ? "border-border bg-background/90 shadow-sm backdrop-blur-xl" : "border-transparent bg-background"}`}
            >
                {" "}
                <nav
                    className="mx-auto max-w-(--content-width) px-6"
                    aria-label="Main navigation"
                >
                    {" "}
                    <div className="flex min-h-16 items-center justify-between">
                        {" "}
                        {/* Brand — DESKTOP UNCHANGED */}{" "}
                        <Link
                            href="/"
                            onClick={handleBrandClick}
                            className="group relative text-lg font-extrabold tracking-tight italic"
                            aria-label="Arnab Ghosh - Home"
                        >
                            {" "}
                            AG{" "}
                            <motion.span
                                className="absolute -bottom-1 left-0 h-px w-full origin-left bg-foreground"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            />{" "}
                        </Link>{" "}
                        {/* ================================================= DESKTOP NAVIGATION — UNCHANGED ================================================== */}{" "}
                        <div className="hidden items-center gap-6 md:flex">
                            {" "}
                            {navigation.map((item) => {
                                const sectionId = item.href.slice(1);
                                const isActive = activeSection === sectionId;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={(event) => handleNavigation(event, item.href)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`group relative py-2 text-sm ${
                                            isActive
                                                ? "font-semibold text-foreground"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        {item.label}

                                        <span
                                            className={`pointer-events-none absolute -bottom-0.5 left-1/2 h-0.5 w-[calc(100%+6px)] origin-left -translate-x-1/2 bg-foreground transition-transform duration-250 ease-out will-change-transform ${
                                                isActive
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </Link>
                                );
                            })}{" "}
                        </div>{" "}
                        {/* Desktop Theme — UNCHANGED */}{" "}
                        <div className="hidden md:block">
                            {" "}
                            <ThemeToggle />{" "}
                        </div>{" "}
                        {/* ================================================= MOBILE HEADER ONLY MOBILE PART ================================================== */}{" "}
                        <div className="flex items-center gap-1 md:hidden">
                            {" "}
                            <ThemeToggle />{" "}
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMenuOpen(true)}
                                aria-label="Open navigation menu"
                                aria-expanded={isMenuOpen}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-surface"
                            >
                                {" "}
                                <Menu
                                    size={20}
                                    strokeWidth={1.8}
                                />{" "}
                            </motion.button>{" "}
                        </div>{" "}
                    </div>{" "}
                </nav>{" "}
            </motion.header>{" "}
            {/* ============================================================= MOBILE RIGHT SLIDER ONLY MOBILE PART ============================================================= */}{" "}
            <AnimatePresence>
                {" "}
                {isMenuOpen && (
                    <>
                        {" "}
                        {/* Backdrop */}{" "}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-60 bg-(--backdrop) backdrop-blur-sm md:hidden"
                            aria-hidden="true"
                        />{" "}
                        {/* ================================================= RIGHT SIDE MOBILE SLIDER 60% WIDTH ================================================== */}{" "}
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed right-0 top-0 z-70 flex h-dvh w-[60%] flex-col border-l border-border bg-background shadow-2xl md:hidden"
                            aria-label="Mobile navigation"
                        >
                            {" "}
                            {/* Drawer Header */}{" "}
                            <div className="flex min-h-16 shrink-0 items-center justify-end border-b border-border px-4">
                                {" "}
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-label="Close navigation menu"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-surface"
                                >
                                    {" "}
                                    <X
                                        size={21}
                                        strokeWidth={1.8}
                                    />{" "}
                                </motion.button>{" "}
                            </div>{" "}
                            {/* Drawer Navigation */}{" "}
                            <nav
                                className="flex-1 overflow-y-auto px-3 py-5"
                                aria-label="Mobile navigation links"
                            >
                                {" "}
                                <div className="flex flex-col gap-1">
                                    {" "}
                                    {navigation.map((item, index) => {
                                        const sectionId = item.href.slice(1);
                                        const isActive = activeSection === sectionId;
                                        return (
                                            <motion.div
                                                key={item.href}
                                                initial={{ opacity: 0, x: 15 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                    duration: 0.25,
                                                    ease: "easeOut",
                                                }}
                                            >
                                                {" "}
                                                <Link
                                                    href={item.href}
                                                    onClick={(event) =>
                                                        handleNavigation(event, item.href)
                                                    }
                                                    aria-current={isActive ? "page" : undefined}
                                                    className={`block rounded-md px-3 py-3 text-sm transition-colors duration-200 ${isActive ? "bg-surface font-semibold text-foreground" : "text-muted-foreground hover:bg-surface hover:text-foreground"}`}
                                                >
                                                    {" "}
                                                    {item.label}{" "}
                                                </Link>{" "}
                                            </motion.div>
                                        );
                                    })}{" "}
                                </div>{" "}
                            </nav>{" "}
                        </motion.aside>{" "}
                    </>
                )}{" "}
            </AnimatePresence>{" "}
        </>
    );
}
