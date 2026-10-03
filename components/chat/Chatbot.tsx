"use client";

import { RotateCcw, Send, Sparkles, User, X } from "lucide-react";

import {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from "react";

type MessageRole = "user" | "assistant";

interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
}

type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-chatbot-messages";

const ICON_BASE_URL = "https://api.iconify.design/emojione-monotone/bug.svg";

const LIGHT_BUG_ICON = `${ICON_BASE_URL}?color=%23171717`;
const DARK_BUG_ICON = `${ICON_BASE_URL}?color=%23f5f5f5`;

const INITIAL_MESSAGE: ChatMessage = {
    id: "welcome-message",
    role: "assistant",
    content:
        "Hi! I'm Cracky, Arnab's portfolio assistant. Ask me about his experience, skills, projects, education, or achievements.",
};

const SUGGESTED_QUESTIONS = [
    "Tell me about Arnab's experience",
    "What technologies does he work with?",
    "What React projects has he worked on?",
    "Tell me about his AI experience",
];

/* ============================================================
   MESSAGE VALIDATION
============================================================ */

function isValidStoredMessage(value: unknown): value is ChatMessage {
    if (!value || typeof value !== "object") {
        return false;
    }

    const message = value as Record<string, unknown>;

    return (
        typeof message.id === "string" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    );
}

function getStoredMessages(): ChatMessage[] {
    if (typeof window === "undefined") {
        return [INITIAL_MESSAGE];
    }

    try {
        const stored = window.sessionStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [INITIAL_MESSAGE];
        }

        const parsed: unknown = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [INITIAL_MESSAGE];
        }

        const validMessages = parsed.filter(isValidStoredMessage);

        if (validMessages.length === 0) {
            return [INITIAL_MESSAGE];
        }

        return validMessages;
    } catch (error) {
        console.error("Unable to restore chatbot session:", error);
        return [INITIAL_MESSAGE];
    }
}

/* ============================================================
   CHAT FORMATTER
============================================================ */

function formatInlineText(text: string): ReactNode[] {
    const parts: ReactNode[] = [];

    /*
     * Supports:
     *
     * **bold**
     * __bold__
     * *italic*
     * _italic_
     * ***bold italic***
     * ___bold italic___
     * `inline code`
     * [link text](https://example.com)
     * https://example.com
     *
     * Also supports basic nested emphasis such as:
     * **bold *italic***
     * *italic **bold***
     *
     * Formatting is processed recursively so nested inline
     * Markdown can be rendered correctly.
     */

    const pushText = (value: string, key: string) => {
        if (!value) return;

        parts.push(
            <Fragment key={key}>
                {value}
            </Fragment>,
        );
    };

    const renderInline = (
        value: string,
        parentKey = "inline",
    ): ReactNode[] => {
        const result: ReactNode[] = [];

        /*
         * Order matters:
         * 1. Links
         * 2. Inline code
         * 3. Bold + italic
         * 4. Bold
         * 5. Italic
         * 6. Plain URLs
         */
        const pattern =
            /(\[[^\]]+\]\((https?:\/\/[^)\s]+)\)|`[^`\n]+`|(\*\*\*[^*\n]+\*\*\*|___[^_\n]+___)|(\*\*[^*\n]+\*\*|__[^_\n]+__)|(\*(?!\s|\*)[^*\n]+\*(?!\*)|_(?!\s|_)[^_\n]+_(?!_))|https?:\/\/[^\s<]+)/g;

        let lastIndex = 0;
        let match: RegExpExecArray | null;
        let key = 0;

        while ((match = pattern.exec(value)) !== null) {
            if (match.index > lastIndex) {
                result.push(
                    <Fragment key={`${parentKey}-text-${key++}`}>
                        {value.slice(lastIndex, match.index)}
                    </Fragment>,
                );
            }

            const token = match[0];

            /*
             * Markdown link
             */
            if (token.startsWith("[") && token.includes("](")) {
                const linkMatch = token.match(
                    /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/,
                );

                if (linkMatch) {
                    result.push(
                        <a
                            key={`${parentKey}-link-${key++}`}
                            href={linkMatch[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 transition-opacity hover:opacity-70"
                        >
                            {renderInline(
                                linkMatch[1],
                                `${parentKey}-link`,
                            )}
                        </a>,
                    );
                }
            }

            /*
             * Inline code
             *
             * Markdown inside code is intentionally NOT parsed.
             */
            else if (
                token.startsWith("`") &&
                token.endsWith("`")
            ) {
                result.push(
                    <code
                        key={`${parentKey}-code-${key++}`}
                        className={[
                            "rounded",
                            "border border-border",
                            "bg-background",
                            "px-1.5 py-0.5",
                            "font-mono text-[0.9em]",
                        ].join(" ")}
                    >
                        {token.slice(1, -1)}
                    </code>,
                );
            }

            /*
             * Bold + italic
             *
             * ***text***
             * ___text___
             */
            else if (
                (token.startsWith("***") &&
                    token.endsWith("***")) ||
                (token.startsWith("___") &&
                    token.endsWith("___"))
            ) {
                result.push(
                    <strong
                        key={`${parentKey}-bold-italic-${key++}`}
                        className="font-semibold"
                    >
                        <em className="italic">
                            {renderInline(
                                token.slice(3, -3),
                                `${parentKey}-bold-italic`,
                            )}
                        </em>
                    </strong>,
                );
            }

            /*
             * Bold
             *
             * **text**
             * __text__
             */
            else if (
                (token.startsWith("**") &&
                    token.endsWith("**")) ||
                (token.startsWith("__") &&
                    token.endsWith("__"))
            ) {
                result.push(
                    <strong
                        key={`${parentKey}-bold-${key++}`}
                        className="font-semibold"
                    >
                        {renderInline(
                            token.slice(2, -2),
                            `${parentKey}-bold`,
                        )}
                    </strong>,
                );
            }

            /*
             * Italic
             *
             * *text*
             * _text_
             */
            else if (
                (token.startsWith("*") &&
                    token.endsWith("*")) ||
                (token.startsWith("_") &&
                    token.endsWith("_"))
            ) {
                result.push(
                    <em
                        key={`${parentKey}-italic-${key++}`}
                        className="italic"
                    >
                        {renderInline(
                            token.slice(1, -1),
                            `${parentKey}-italic`,
                        )}
                    </em>,
                );
            }

            /*
             * Plain URL
             */
            else if (
                token.startsWith("http://") ||
                token.startsWith("https://")
            ) {
                result.push(
                    <a
                        key={`${parentKey}-url-${key++}`}
                        href={token}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 transition-opacity hover:opacity-70"
                    >
                        {token}
                    </a>,
                );
            }

            lastIndex = match.index + token.length;
        }

        if (lastIndex < value.length) {
            result.push(
                <Fragment key={`${parentKey}-text-${key++}`}>
                    {value.slice(lastIndex)}
                </Fragment>,
            );
        }

        return result;
    };

    return renderInline(text);
}

function formatAssistantMessage(content: string): ReactNode {
    const lines = content.replace(/\r\n/g, "\n").split("\n");

    const elements: ReactNode[] = [];

    let currentParagraph: string[] = [];
    let currentListItems: string[] = [];
    let currentListType: "bullet" | "numbered" | null = null;

    const flushParagraph = () => {
        if (currentParagraph.length === 0) {
            return;
        }

        const text = currentParagraph.join(" ").trim();

        if (text) {
            elements.push(
                <p
                    key={`paragraph-${elements.length}`}
                    className="leading-6"
                >
                    {formatInlineText(text)}
                </p>,
            );
        }

        currentParagraph = [];
    };

    const flushList = () => {
        if (currentListItems.length === 0 || !currentListType) {
            return;
        }

        if (currentListType === "bullet") {
            elements.push(
                <ul
                    key={`list-${elements.length}`}
                    className="my-1.5 list-disc space-y-1.5 pl-5"
                >
                    {currentListItems.map((item, index) => (
                        <li
                            key={`bullet-${index}`}
                            className="pl-1"
                        >
                            {formatInlineText(item)}
                        </li>
                    ))}
                </ul>,
            );
        } else {
            elements.push(
                <ol
                    key={`list-${elements.length}`}
                    className="my-1.5 list-decimal space-y-1.5 pl-5"
                >
                    {currentListItems.map((item, index) => (
                        <li
                            key={`numbered-${index}`}
                            className="pl-1"
                        >
                            {formatInlineText(item)}
                        </li>
                    ))}
                </ol>,
            );
        }

        currentListItems = [];
        currentListType = null;
    };

    const flushAll = () => {
        flushParagraph();
        flushList();
    };

    lines.forEach((rawLine) => {
        const line = rawLine.trim();

        /* ------------------------------------------------------
           EMPTY LINE
        ------------------------------------------------------ */

        if (!line) {
            flushAll();
            return;
        }

        /* ------------------------------------------------------
           BULLET LIST

           Supports:
           - item
           * item
           + item
        ------------------------------------------------------ */

        const bulletMatch = line.match(/^[-*+]\s+(.+)$/);

        if (bulletMatch) {
            flushParagraph();

            if (currentListType !== "bullet") {
                flushList();
                currentListType = "bullet";
            }

            currentListItems.push(bulletMatch[1]);
            return;
        }

        /* ------------------------------------------------------
           NUMBERED LIST
        ------------------------------------------------------ */

        const numberedMatch = line.match(/^\d+\.\s+(.+)$/);

        if (numberedMatch) {
            flushParagraph();

            if (currentListType !== "numbered") {
                flushList();
                currentListType = "numbered";
            }

            currentListItems.push(numberedMatch[1]);
            return;
        }

        /* ------------------------------------------------------
           MARKDOWN HEADINGS

           # Heading
           ## Heading
           ### Heading
        ------------------------------------------------------ */

        const headingMatch = line.match(/^#{1,3}\s+(.+)$/);

        if (headingMatch) {
            flushAll();

            elements.push(
                <p
                    key={`heading-${elements.length}`}
                    className="mt-1 font-semibold leading-6"
                >
                    {formatInlineText(headingMatch[1])}
                </p>,
            );

            return;
        }

        /* ------------------------------------------------------
           STANDALONE BOLD LINE

           Example:
           **Full Stack Developer — Wellness Web & Mobile (POC)**
        ------------------------------------------------------ */

        if (line.startsWith("**") && line.includes("**") && line.indexOf("**", 2) > 2) {
            flushAll();

            elements.push(
                <p
                    key={`strong-line-${elements.length}`}
                    className="mt-2 first:mt-0 font-semibold leading-6"
                >
                    {formatInlineText(line)}
                </p>,
            );

            return;
        }

        /* ------------------------------------------------------
           NORMAL TEXT
        ------------------------------------------------------ */

        flushList();
        currentParagraph.push(line);
    });

    flushAll();

    return <div className="space-y-2">{elements}</div>;
}

/* ============================================================
   CHATBOT
============================================================ */

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [theme, setTheme] = useState<Theme>("light");
    const [isHydrated, setIsHydrated] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    /* ============================================================
       MOVABLE CHAT BUBBLE
    ============================================================ */

    const [bubblePosition, setBubblePosition] = useState({
        x: 0,
        y: 0,
    });

    const bubbleDragRef = useRef({
        isDragging: false,
        hasMoved: false,
        startPointerX: 0,
        startPointerY: 0,
        startX: 0,
        startY: 0,
    });

    const handleBubblePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
        if (event.button !== 0) {
            return;
        }

        bubbleDragRef.current = {
            isDragging: true,
            hasMoved: false,
            startPointerX: event.clientX,
            startPointerY: event.clientY,
            startX: bubblePosition.x,
            startY: bubblePosition.y,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleBubblePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
        if (!bubbleDragRef.current.isDragging) {
            return;
        }

        const deltaX = event.clientX - bubbleDragRef.current.startPointerX;

        const deltaY = event.clientY - bubbleDragRef.current.startPointerY;

        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            bubbleDragRef.current.hasMoved = true;
        }

        const isSmallScreen = window.innerWidth < 640;

        const buttonSize = isSmallScreen ? 56 : 64;
        const edgeMargin = isSmallScreen ? 16 : 24;

        /*
         * The bubble starts at:
         *
         * right: edgeMargin
         * bottom: edgeMargin
         *
         * Therefore:
         *
         * X = 0
         *     means original right position.
         *
         * Negative X
         *     moves the bubble left.
         *
         * Positive X
         *     would move it outside the viewport,
         *     so positive X is not allowed.
         *
         * Same principle applies to Y.
         */

        const maxX = 0;
        const maxY = 0;

        const minX = -Math.max(0, window.innerWidth - buttonSize - edgeMargin * 2);

        const minY = -Math.max(0, window.innerHeight - buttonSize - edgeMargin * 2);

        const nextX = Math.min(Math.max(bubbleDragRef.current.startX + deltaX, minX), maxX);

        const nextY = Math.min(Math.max(bubbleDragRef.current.startY + deltaY, minY), maxY);

        setBubblePosition({
            x: nextX,
            y: nextY,
        });
    };

    const handleBubblePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
        if (!bubbleDragRef.current.isDragging) {
            return;
        }

        bubbleDragRef.current.isDragging = false;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        /*
         * Only open/close Cracky when the interaction
         * was a click rather than a drag.
         */

        if (!bubbleDragRef.current.hasMoved) {
            setIsOpen((current) => !current);
        }
    };

    /* ============================================================
       THEME
    ============================================================ */

    useEffect(() => {
        const updateTheme = () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");

            setTheme(currentTheme === "dark" ? "dark" : "light");
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    /* ============================================================
       SESSION STORAGE
    ============================================================ */

    useEffect(() => {
        const storedMessages = getStoredMessages();

        setMessages(storedMessages);
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        try {
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Unable to save chatbot session:", error);
        }
    }, [messages, isHydrated]);

    /* ============================================================
       SCROLL
    ============================================================ */

    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "end",
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isLoading, isOpen, scrollToBottom]);

    /* ============================================================
       INPUT FOCUS
    ============================================================ */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const timeout = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 250);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [isOpen]);

    /* ============================================================
       ESCAPE KEY
    ============================================================ */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    /* ============================================================
       TEXTAREA
    ============================================================ */

    const resizeTextarea = useCallback(() => {
        const textarea = inputRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }, []);

    useEffect(() => {
        resizeTextarea();
    }, [input, resizeTextarea]);

    /* ============================================================
       SEND MESSAGE
    ============================================================ */

    const sendMessage = useCallback(
        async (messageText?: string) => {
            const text = (messageText ?? input).trim();

            if (!text || isLoading) {
                return;
            }

            setHasError(false);

            const userMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "user",
                content: text,
            };

            const updatedMessages = [...messages, userMessage];

            setMessages(updatedMessages);
            setInput("");
            setIsLoading(true);

            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: updatedMessages.map((message) => ({
                            role: message.role,
                            content: message.content,
                        })),
                    }),
                });

                let data: {
                    message?: string;
                    error?: string;
                };

                try {
                    data = await response.json();
                } catch {
                    throw new Error("Invalid response received from the chatbot server.");
                }

                if (!response.ok) {
                    throw new Error(data.error || "Unable to generate a response.");
                }

                if (typeof data.message !== "string" || !data.message.trim()) {
                    throw new Error("The chatbot returned an empty response.");
                }

                const assistantMessage: ChatMessage = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: data.message.trim(),
                };

                setMessages((currentMessages) => [...currentMessages, assistantMessage]);
            } catch (error) {
                console.error("Chatbot error:", error);

                setHasError(true);

                const errorMessage: ChatMessage = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "I couldn't process that message right now. Please try again.",
                };

                setMessages((currentMessages) => [...currentMessages, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        },
        [input, isLoading, messages],
    );

    /* ============================================================
       FORM
    ============================================================ */

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void sendMessage();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== "Enter") {
            return;
        }

        /*
         * MOBILE / TABLET
         *
         * Enter always creates a new line.
         * The send button is used to submit.
         */

        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        if (isMobile) {
            return;
        }

        /*
         * DESKTOP
         *
         * Enter = send
         * Shift + Enter = new line
         */

        if (!event.shiftKey) {
            event.preventDefault();

            if (!isLoading) {
                void sendMessage();
            }
        }
    };

    /* ============================================================
       SUGGESTIONS
    ============================================================ */

    const handleSuggestion = (question: string) => {
        if (isLoading) {
            return;
        }

        void sendMessage(question);
    };

    /* ============================================================
       CLEAR SESSION
    ============================================================ */

    const clearConversation = () => {
        setMessages([INITIAL_MESSAGE]);
        setInput("");
        setHasError(false);

        try {
            window.sessionStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Unable to clear chatbot session:", error);
        }

        window.setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    /* ============================================================
       TOGGLE
    ============================================================ */

    const toggleChat = () => {
        setIsOpen((current) => !current);
    };

    /* ============================================================
       BUG ICON
    ============================================================ */

    const bugIcon = theme === "dark" ? DARK_BUG_ICON : LIGHT_BUG_ICON;

    const bugIconForBtn = theme === "dark" ? LIGHT_BUG_ICON : DARK_BUG_ICON;

    return (
        <>
            {/* ========================================================
                FLOATING CHAT BUTTON
            ======================================================== */}

            <div
                className={[
                    "group fixed right-4 bottom-4 z-70",
                    "sm:right-6 sm:bottom-6",
                    "transition-opacity duration-300 ease-out",
                    isOpen ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100",
                ].join(" ")}
                style={{
                    transform: `translate3d(${bubblePosition.x}px, ${bubblePosition.y}px, 0)`,
                }}
            >
                {/* Tooltip */}

                <div
                    className={[
                        "pointer-events-none absolute",
                        "right-0 bottom-full mb-3",
                        "whitespace-nowrap",
                        "rounded-md",
                        "border border-border",
                        "bg-button-foreground",
                        "px-3 py-1.5",
                        "text-xs font-medium text-button-background",
                        "shadow-lg",
                        "translate-y-1 opacity-0",
                        "transition-all duration-200",
                        "group-hover:translate-y-0",
                        "group-hover:opacity-100",
                    ].join(" ")}
                >
                    Cracky: Your AI Assistant
                    {/* Tooltip arrow */}
                    <span
                        className={[
                            "absolute right-5 top-full",
                            "h-2 w-2",
                            "-translate-y-1/2 rotate-45",
                            "border-r border-b border-border",
                            "bg-button-foreground",
                        ].join(" ")}
                    />
                </div>

                <button
                    type="button"
                    onPointerDown={handleBubblePointerDown}
                    onPointerMove={handleBubblePointerMove}
                    onPointerUp={handleBubblePointerUp}
                    onPointerCancel={handleBubblePointerUp}
                    aria-label="Open Cracky portfolio assistant"
                    aria-expanded={isOpen}
                    className={[
                        "relative flex h-14 w-14",
                        "items-center justify-center",
                        "rounded-full",
                        "border border-border",
                        "bg-button-foreground",
                        "text-button-background",
                        "shadow-lg",
                        "touch-none",
                        "cursor-grab",
                        "transition-all duration-300",
                        "hover:-translate-y-1",
                        "hover:scale-105",
                        "hover:shadow-xl",
                        "active:scale-95",
                        "active:cursor-grabbing",
                        "focus:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-foreground/30",
                        "sm:h-16 sm:w-16",
                    ].join(" ")}
                >
                    <img
                        src={bugIconForBtn}
                        alt=""
                        width={40}
                        height={40}
                        aria-hidden="true"
                        draggable={false}
                        className={[
                            "relative z-10",
                            "pointer-events-none",
                            "select-none",
                            "transition-transform duration-300",
                            "group-hover:rotate-6",
                            "group-hover:scale-110",
                        ].join(" ")}
                    />
                </button>
            </div>

            {/* ========================================================
                CHAT WINDOW
            ======================================================== */}

            <div
                className={[
                    "fixed inset-x-3 bottom-3 z-80",
                    "sm:right-6 sm:bottom-6 sm:left-auto",
                    "w-auto sm:w-105",
                    "origin-bottom-right",
                    "transition-all duration-300",
                    "ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none translate-y-5 scale-95 opacity-0",
                ].join(" ")}
            >
                <section
                    aria-label="Cracky portfolio assistant"
                    className={[
                        "flex h-[min(680px,calc(100dvh-24px))]",
                        "flex-col overflow-hidden",
                        "rounded-lg",
                        "border border-border",
                        "bg-background",
                        "shadow-2xl",
                        "sm:h-170",
                    ].join(" ")}
                >
                    {/* ====================================================
                        HEADER
                    ==================================================== */}

                    <header
                        className={[
                            "flex shrink-0 items-center",
                            "justify-between",
                            "border-b border-border",
                            "bg-surface/70",
                            "px-4 py-3",
                            "backdrop-blur-md",
                        ].join(" ")}
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className={[
                                    "relative flex h-10 w-10 shrink-0",
                                    "items-center justify-center",
                                    "rounded-md",
                                    "border border-border",
                                    "bg-background",
                                    "transition-all duration-300",
                                    "hover:scale-105",
                                    "hover:-rotate-3",
                                ].join(" ")}
                            >
                                <img
                                    src={bugIcon}
                                    alt=""
                                    width={21}
                                    height={21}
                                    aria-hidden="true"
                                    draggable={false}
                                />
                            </div>

                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-semibold text-foreground">
                                    Cracky
                                </h2>

                                <div className="mt-0.5">
                                    <span className="text-xs text-muted">Portfolio Assistant</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {/* Clear */}

                            <button
                                type="button"
                                onClick={clearConversation}
                                aria-label="Clear conversation"
                                title="Clear conversation"
                                className={[
                                    "flex h-9 w-9",
                                    "items-center justify-center",
                                    "rounded-md",
                                    "text-muted",
                                    "transition-all duration-200",
                                    "hover:-translate-y-0.5",
                                    "hover:bg-background",
                                    "hover:text-foreground",
                                    "active:scale-95",
                                ].join(" ")}
                            >
                                <RotateCcw
                                    size={17}
                                    strokeWidth={1.8}
                                />
                            </button>

                            {/* Close */}

                            <button
                                type="button"
                                onClick={toggleChat}
                                aria-label="Close Cracky"
                                title="Close chatbot"
                                className={[
                                    "flex h-9 w-9",
                                    "items-center justify-center",
                                    "rounded-md",
                                    "text-muted",
                                    "transition-all duration-200",
                                    "hover:-translate-y-0.5",
                                    "hover:bg-background",
                                    "hover:text-foreground",
                                    "active:scale-95",
                                ].join(" ")}
                            >
                                <X
                                    size={19}
                                    strokeWidth={1.8}
                                />
                            </button>
                        </div>
                    </header>

                    {/* ====================================================
                        MESSAGES
                    ==================================================== */}

                    <div
                        className={[
                            "min-h-0 flex-1 overflow-y-auto",
                            "px-4 py-4",
                            "scrollbar-thin",
                            "scrollbar-thumb-border",
                        ].join(" ")}
                    >
                        <div className="space-y-4">
                            {messages.map((message) => {
                                const isUser = message.role === "user";

                                return (
                                    <div
                                        key={message.id}
                                        className={[
                                            "flex w-full",
                                            isUser ? "justify-end" : "justify-start",
                                            "animate-in",
                                            "fade-in",
                                            "slide-in-from-bottom-2",
                                            "duration-300",
                                        ].join(" ")}
                                    >
                                        <div
                                            className={[
                                                "flex max-w-[88%]",
                                                "items-end gap-2",
                                                isUser ? "flex-row-reverse" : "flex-row",
                                            ].join(" ")}
                                        >
                                            {/* Message icon */}

                                            <div
                                                className={[
                                                    "flex h-7 w-7 shrink-0",
                                                    "items-center justify-center",
                                                    "rounded-md",
                                                    "border border-border",
                                                    isUser ? "bg-button-background" : "bg-surface",
                                                    "transition-transform duration-200",
                                                    "hover:scale-105",
                                                ].join(" ")}
                                            >
                                                {isUser ? (
                                                    <User
                                                        size={14}
                                                        strokeWidth={1.8}
                                                        className="text-button-foreground"
                                                    />
                                                ) : (
                                                    <img
                                                        src={bugIcon}
                                                        alt=""
                                                        width={14}
                                                        height={14}
                                                        aria-hidden="true"
                                                        draggable={false}
                                                    />
                                                )}
                                            </div>

                                            {/* Message bubble */}

                                            <div
                                                className={[
                                                    "rounded-lg",
                                                    "px-3.5 py-2.5",
                                                    "text-sm leading-6",
                                                    "transition-all duration-200",
                                                    isUser
                                                        ? [
                                                              "rounded-br-sm",
                                                              "bg-button-background",
                                                              "text-button-foreground",
                                                          ].join(" ")
                                                        : [
                                                              "rounded-bl-sm",
                                                              "border border-border",
                                                              "bg-surface",
                                                              "text-foreground",
                                                          ].join(" "),
                                                ].join(" ")}
                                            >
                                                {isUser ? (
                                                    <p className="whitespace-pre-wrap wrap-break-word">
                                                        {message.content}
                                                    </p>
                                                ) : (
                                                    <div className="wrap-break-word">
                                                        {formatAssistantMessage(message.content)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* ==================================================
                                TYPING INDICATOR
                            ================================================== */}

                            {isLoading && (
                                <div
                                    className={[
                                        "flex items-end gap-2",
                                        "animate-in fade-in",
                                        "slide-in-from-bottom-2",
                                        "duration-300",
                                    ].join(" ")}
                                >
                                    <div
                                        className={[
                                            "flex h-7 w-7 shrink-0",
                                            "items-center justify-center",
                                            "rounded-md",
                                            "border border-border",
                                            "bg-surface",
                                        ].join(" ")}
                                    >
                                        <img
                                            src={bugIcon}
                                            alt=""
                                            width={14}
                                            height={14}
                                            aria-hidden="true"
                                            draggable={false}
                                        />
                                    </div>

                                    <div
                                        className={[
                                            "rounded-lg rounded-bl-sm",
                                            "border border-border",
                                            "bg-surface",
                                            "px-4 py-3",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={[
                                                    "h-1.5 w-1.5 rounded-full",
                                                    "animate-bounce",
                                                    "bg-muted",
                                                    "[animation-delay:-0.3s]",
                                                ].join(" ")}
                                            />

                                            <span
                                                className={[
                                                    "h-1.5 w-1.5 rounded-full",
                                                    "animate-bounce",
                                                    "bg-muted",
                                                    "[animation-delay:-0.15s]",
                                                ].join(" ")}
                                            />

                                            <span
                                                className={[
                                                    "h-1.5 w-1.5 rounded-full",
                                                    "animate-bounce",
                                                    "bg-muted",
                                                ].join(" ")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* ====================================================
                        SUGGESTIONS
                    ==================================================== */}

                    {messages.length <= 1 && !isLoading && (
                        <div
                            className={["shrink-0", "border-t border-border", "px-4 py-3"].join(
                                " ",
                            )}
                        >
                            <div className="mb-2 flex items-center gap-1.5">
                                <Sparkles
                                    size={13}
                                    className="text-muted"
                                    strokeWidth={1.8}
                                />

                                <span className="text-xs font-medium text-muted">Try asking</span>
                            </div>

                            <div className={["grid grid-cols-1 gap-2", "sm:grid-cols-2"].join(" ")}>
                                {SUGGESTED_QUESTIONS.map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        onClick={() => handleSuggestion(question)}
                                        className={[
                                            "w-full",
                                            "rounded-md",
                                            "border border-border",
                                            "bg-background",
                                            "px-3 py-2",
                                            "text-left text-xs leading-5",
                                            "text-foreground",
                                            "transition-all duration-200",
                                            "hover:-translate-y-0.5",
                                            "hover:bg-surface",
                                            "hover:shadow-sm",
                                            "active:scale-[0.98]",
                                        ].join(" ")}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ====================================================
                        ERROR
                    ==================================================== */}

                    {hasError && (
                        <div className="shrink-0 px-4 pb-2">
                            <div
                                className={[
                                    "rounded-md",
                                    "border border-border",
                                    "bg-surface",
                                    "px-3 py-2",
                                    "text-xs text-muted",
                                ].join(" ")}
                            >
                                Something went wrong. Please try sending your message again.
                            </div>
                        </div>
                    )}

                    {/* ====================================================
                        INPUT
                    ==================================================== */}

                    <div
                        className={[
                            "shrink-0",
                            "border-t border-border",
                            "bg-background",
                            "p-3",
                        ].join(" ")}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className={[
                                "flex items-end gap-2",
                                "rounded-md",
                                "border border-border",
                                "bg-surface",
                                "p-2",
                                "transition-all duration-200",
                                "focus-within:border-foreground/30",
                                "focus-within:ring-2",
                                "focus-within:ring-foreground/5",
                            ].join(" ")}
                        >
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Cracky..."
                                rows={1}
                                maxLength={2000}
                                disabled={isLoading}
                                aria-label="Message Cracky"
                                className={[
                                    "min-h-9 max-h-30",
                                    "flex-1 resize-none",
                                    "bg-transparent",
                                    "px-1.5 py-2",
                                    "text-sm text-foreground",
                                    "placeholder:text-muted",
                                    "focus:outline-none",
                                    "disabled:cursor-not-allowed",
                                    "disabled:opacity-60",
                                ].join(" ")}
                            />

                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                aria-label="Send message to Cracky"
                                className={[
                                    "flex h-9 w-9 shrink-0",
                                    "items-center justify-center",
                                    "rounded-md",
                                    "transition-all duration-200",
                                    "hover:-translate-y-0.5",
                                    "hover:scale-105",
                                    "active:scale-95",
                                    "disabled:cursor-not-allowed",
                                    "disabled:opacity-30",
                                    "disabled:hover:translate-y-0",
                                    "disabled:hover:scale-100",
                                    "bg-button-foreground",
                                    "text-button-background",
                                ].join(" ")}
                            >
                                <Send
                                    size={16}
                                    strokeWidth={1.8}
                                />
                            </button>
                        </form>

                        <div className="mt-2 flex items-center justify-between px-1">
                            <span className="text-[10px] text-muted">
                                <span className="hidden sm:inline">
                                    Enter to send · Shift + Enter for new line
                                </span>

                                <span className="sm:hidden">Enter for new line</span>
                            </span>

                            <span className="text-[10px] text-muted">{input.length}/2000</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* ========================================================
                MOBILE BACKDROP
            ======================================================== */}

            {isOpen && (
                <button
                    type="button"
                    aria-label="Close Cracky"
                    onClick={() => setIsOpen(false)}
                    className={["fixed inset-0 z-75", "bg-foreground/5", "sm:hidden"].join(" ")}
                />
            )}
        </>
    );
}
