
"use client";

import { useEffect } from "react";

export default function CopyProtection() {
    useEffect(() => {
        // Enable protection only in production.
        if (process.env.NODE_ENV !== "production") {
            return;
        }

        const handleCopy = (event: ClipboardEvent) => {
            event.preventDefault();
        };

        const handleCut = (event: ClipboardEvent) => {
            event.preventDefault();
        };

        const handleDragStart = (event: DragEvent) => {
            event.preventDefault();
        };

        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const isModifier = event.ctrlKey || event.metaKey;

            // Block Ctrl/Cmd + C
            if (isModifier && key === "c") {
                event.preventDefault();
                return;
            }

            // Block Ctrl/Cmd + X
            if (isModifier && key === "x") {
                event.preventDefault();
                return;
            }

            // Block Ctrl/Cmd + S
            if (isModifier && key === "s") {
                event.preventDefault();
                return;
            }

            // Block Ctrl/Cmd + U
            if (isModifier && key === "u") {
                event.preventDefault();
                return;
            }

            // Block F12
            if (event.key === "F12") {
                event.preventDefault();
                return;
            }

            // Block Ctrl/Cmd + Shift + I
            if (isModifier && event.shiftKey && key === "i") {
                event.preventDefault();
                return;
            }

            // Block Ctrl/Cmd + Shift + J
            if (isModifier && event.shiftKey && key === "j") {
                event.preventDefault();
                return;
            }

            // Block Ctrl/Cmd + Shift + C
            if (isModifier && event.shiftKey && key === "c") {
                event.preventDefault();
                return;
            }
        };

        document.addEventListener("copy", handleCopy);
        document.addEventListener("cut", handleCut);
        document.addEventListener("dragstart", handleDragStart);
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("cut", handleCut);
            document.removeEventListener("dragstart", handleDragStart);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}
