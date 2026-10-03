"use client";

import { AnimatePresence, motion } from "motion/react";
import { Mail, MessageSquare, RotateCcw, Send, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormErrors {
    name?: string;
    mobile?: string;
    email?: string;
    message?: string;
}

interface TouchedFields {
    name?: boolean;
    mobile?: boolean;
    email?: boolean;
    message?: boolean;
}

const CONTACT_EMAIL = "arnabghosh.developer@gmail.com";
const CONTACT_PHONE = "+91 8777 046 270";
const CONTACT_PHONE_LINK = "+918777046270";

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    /*
     * Strong practical email validation.
     *
     * This validates the structure of the address, but cannot verify
     * whether the mailbox actually exists.
     */
    const isValidEmail = (value: string): boolean => {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
            return false;
        }

        if (trimmedValue.length > 254) {
            return false;
        }

        if (/\s/.test(trimmedValue)) {
            return false;
        }

        const parts = trimmedValue.split("@");

        if (parts.length !== 2) {
            return false;
        }

        const [localPart, domain] = parts;

        if (!localPart || !domain) {
            return false;
        }

        if (localPart.length > 64 || domain.length > 253) {
            return false;
        }

        if (localPart.startsWith(".") || localPart.endsWith(".")) {
            return false;
        }

        if (localPart.includes("..") || domain.includes("..")) {
            return false;
        }

        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

        return emailPattern.test(trimmedValue);
    };

    const validateForm = (): FormErrors => {
        const nextErrors: FormErrors = {};

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        /*
         * Required fields
         */
        if (!trimmedName) {
            nextErrors.name = "Name is required.";
        } else if (trimmedName.length < 2) {
            nextErrors.name = "Name must be at least 2 characters.";
        } else if (trimmedName.length > 100) {
            nextErrors.name = "Name must be 100 characters or less.";
        }

        if (!trimmedMessage) {
            nextErrors.message = "Message is required.";
        } else if (trimmedMessage.length < 10) {
            nextErrors.message = "Message must be at least 10 characters.";
        } else if (trimmedMessage.length > 5000) {
            nextErrors.message = "Message must be 5000 characters or less.";
        }

        /*
         * Optional mobile number.
         * If provided, it must be a valid international number.
         */
        if (mobile && !isValidPhoneNumber(mobile)) {
            nextErrors.mobile = "Please enter a valid mobile number.";
        }

        /*
         * Optional email.
         * If provided, it must be structurally valid.
         */
        if (trimmedEmail && !isValidEmail(trimmedEmail)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        return nextErrors;
    };

    const formErrors = validateForm();

    const hasValidationErrors = Object.keys(formErrors).length > 0;

    const hasRequiredFields = name.trim().length > 0 && message.trim().length > 0;

    const isFormReady = hasRequiredFields && !hasValidationErrors && !isSubmitting;

    const hasSomethingToReset = Boolean(
        name.trim() || mobile || email.trim() || message.trim() || status !== "idle",
    );

    const markTouched = (field: keyof TouchedFields) => {
        setTouched((current) => ({
            ...current,
            [field]: true,
        }));
    };

    const clearSubmissionStatus = () => {
        if (status !== "idle") {
            setStatus("idle");
            setErrorMessage("");
        }
    };

    const handleReset = () => {
        if (isSubmitting) return;

        setName("");
        setMobile("");
        setEmail("");
        setMessage("");

        setErrors({});
        setTouched({});

        setStatus("idle");
        setErrorMessage("");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        setTouched({
            name: true,
            mobile: true,
            email: true,
            message: true,
        });

        const validationErrors = validateForm();

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setStatus("idle");
            setErrorMessage("");
            return;
        }

        setIsSubmitting(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    mobile: mobile.trim(),
                    email: email.trim(),
                    message: message.trim(),
                }),
            });

            let data: { error?: string } = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(data.error || "Unable to send your message at this moment.");
            }

            setStatus("success");

            setName("");
            setMobile("");
            setEmail("");
            setMessage("");

            setErrors({});
            setTouched({});
        } catch (error) {
            console.error("Contact form error:", error);

            setStatus("error");
            setErrorMessage("Unable to send your message at this moment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setName(value);
        markTouched("name");
        clearSubmissionStatus();

        const nextErrors = validateForm();

        setErrors((current) => ({
            ...current,
            name: nextErrors.name,
        }));
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setEmail(value);
        markTouched("email");
        clearSubmissionStatus();

        const trimmedValue = value.trim();

        setErrors((current) => ({
            ...current,
            email:
                trimmedValue && !isValidEmail(trimmedValue)
                    ? "Please enter a valid email address."
                    : undefined,
        }));
    };

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;

        setMessage(value);
        markTouched("message");
        clearSubmissionStatus();

        const trimmedValue = value.trim();

        setErrors((current) => ({
            ...current,
            message: !trimmedValue
                ? "Message is required."
                : trimmedValue.length < 10
                  ? "Message must be at least 10 characters."
                  : trimmedValue.length > 5000
                    ? "Message must be 5000 characters or less."
                    : undefined,
        }));
    };

    const handleMobileChange = (value: string | undefined) => {
        const nextValue = value ?? "";

        setMobile(nextValue);
        markTouched("mobile");
        clearSubmissionStatus();

        setErrors((current) => ({
            ...current,
            mobile:
                nextValue && !isValidPhoneNumber(nextValue)
                    ? "Please enter a valid mobile number."
                    : undefined,
        }));
    };

    const shouldShowError = (field: keyof FormErrors): boolean => {
        return Boolean(touched[field] && errors[field]);
    };

    const getInputClasses = (field: keyof FormErrors, additionalClasses = "") => {
        const hasError = shouldShowError(field);

        return [
            "w-full rounded-md border bg-background text-sm outline-none",
            "transition-all duration-200",
            "placeholder:text-muted",
            "focus:border-foreground",
            "focus:ring-2 focus:ring-foreground/10",
            hasError ? "border-danger" : "border-border",
            additionalClasses,
        ].join(" ");
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-(--backdrop) p-4 backdrop-blur-sm sm:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget && !isSubmitting) {
                                onClose();
                            }
                        }}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="contact-form-heading"
                            className="relative my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
                            initial={{
                                opacity: 0,
                                y: 20,
                                scale: 0.98,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 12,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {/* Header */}
                            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
                                <div className="min-w-0">
                                    <div className="mb-2 flex items-center gap-2.5 text-muted">
                                        <MessageSquare
                                            size={16}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />

                                        <span className="text-xs font-medium uppercase tracking-[0.16em]">
                                            Get in touch
                                        </span>
                                    </div>

                                    <h2
                                        id="contact-form-heading"
                                        className="text-xl font-semibold tracking-tight sm:text-2xl"
                                    >
                                        Send me a message
                                    </h2>

                                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                                        Have an opportunity or want to discuss something? I&apos;d
                                        love to hear from you.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    aria-label="Close contact form"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted transition-colors duration-200 hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X
                                        size={16}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="min-h-0 overflow-y-auto px-5 py-4 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-6 sm:py-5"
                            >
                                <div className="space-y-3.5">
                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="contact-name"
                                            className="mb-1.5 block text-xs font-medium sm:text-sm"
                                        >
                                            Name <span className="text-danger">*</span>
                                        </label>

                                        <div className="relative">
                                            <User
                                                size={15}
                                                strokeWidth={1.7}
                                                aria-hidden="true"
                                                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted"
                                            />

                                            <input
                                                id="contact-name"
                                                name="name"
                                                type="text"
                                                disabled={isSubmitting}
                                                value={name}
                                                onChange={handleNameChange}
                                                onBlur={() => markTouched("name")}
                                                autoComplete="name"
                                                placeholder="Your name"
                                                maxLength={100}
                                                aria-invalid={shouldShowError("name")}
                                                aria-describedby={
                                                    shouldShowError("name")
                                                        ? "contact-name-error"
                                                        : undefined
                                                }
                                                className={getInputClasses(
                                                    "name",
                                                    "h-10 pl-9 pr-3",
                                                )}
                                            />
                                        </div>

                                        {shouldShowError("name") && (
                                            <p
                                                id="contact-name-error"
                                                className="mt-1.5 text-xs font-medium text-danger"
                                            >
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Mobile */}
                                    <div>
                                        <label
                                            htmlFor="contact-mobile"
                                            className="mb-1.5 block text-xs font-medium sm:text-sm"
                                        >
                                            Mobile{" "}
                                            <span className="text-xs font-normal text-muted">
                                                (optional)
                                            </span>
                                        </label>

                                        <PhoneInput
                                            id="contact-mobile"
                                            international
                                            defaultCountry="IN"
                                            countryCallingCodeEditable={false}
                                            value={mobile || undefined}
                                            onChange={handleMobileChange}
                                            onBlur={() => markTouched("mobile")}
                                            disabled={isSubmitting}
                                            placeholder="Your mobile number"
                                            aria-invalid={shouldShowError("mobile")}
                                            aria-describedby={
                                                shouldShowError("mobile")
                                                    ? "contact-mobile-error"
                                                    : undefined
                                            }
                                            className={`contact-phone-input ${
                                                shouldShowError("mobile")
                                                    ? "contact-phone-input-error"
                                                    : ""
                                            }`}
                                        />

                                        {shouldShowError("mobile") && (
                                            <p
                                                id="contact-mobile-error"
                                                className="mt-1.5 text-xs font-medium text-danger"
                                            >
                                                {errors.mobile}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="contact-email"
                                            className="mb-1.5 block text-xs font-medium sm:text-sm"
                                        >
                                            Email{" "}
                                            <span className="text-xs font-normal text-muted">
                                                (optional)
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <Mail
                                                size={15}
                                                strokeWidth={1.7}
                                                aria-hidden="true"
                                                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted"
                                            />

                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                inputMode="email"
                                                disabled={isSubmitting}
                                                value={email}
                                                onChange={handleEmailChange}
                                                onBlur={() => markTouched("email")}
                                                autoComplete="email"
                                                placeholder="Your email address"
                                                maxLength={254}
                                                spellCheck={false}
                                                aria-invalid={shouldShowError("email")}
                                                aria-describedby={
                                                    shouldShowError("email")
                                                        ? "contact-email-error"
                                                        : undefined
                                                }
                                                className={getInputClasses(
                                                    "email",
                                                    "h-10 pl-9 pr-3",
                                                )}
                                            />
                                        </div>

                                        {shouldShowError("email") && (
                                            <p
                                                id="contact-email-error"
                                                className="mt-1.5 text-xs font-medium text-danger"
                                            >
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label
                                            htmlFor="contact-message"
                                            className="mb-1.5 block text-xs font-medium sm:text-sm"
                                        >
                                            Message <span className="text-danger">*</span>
                                        </label>

                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            disabled={isSubmitting}
                                            value={message}
                                            onChange={handleMessageChange}
                                            onBlur={() => markTouched("message")}
                                            rows={3}
                                            maxLength={5000}
                                            placeholder="Write your message..."
                                            aria-invalid={shouldShowError("message")}
                                            aria-describedby={
                                                shouldShowError("message")
                                                    ? "contact-message-error"
                                                    : undefined
                                            }
                                            className={getInputClasses(
                                                "message",
                                                "min-h-24 resize-y px-3 py-2.5 leading-5",
                                            )}
                                        />

                                        {shouldShowError("message") && (
                                            <p
                                                id="contact-message-error"
                                                className="mt-1.5 text-xs font-medium text-danger"
                                            >
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Success */}
                                <AnimatePresence initial={false}>
                                    {status === "success" && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -4,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -4,
                                            }}
                                            role="status"
                                            className="mt-3 rounded-md border border-success-border bg-success-background px-3 py-2.5 text-sm font-medium text-success"
                                        >
                                            Your message has been sent successfully.
                                        </motion.div>
                                    )}

                                    {/* Error */}
                                    {status === "error" && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -4,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -4,
                                            }}
                                            role="alert"
                                            className="mt-3 rounded-md border border-danger-border bg-danger-background px-3 py-2.5 text-sm leading-5 text-danger"
                                        >
                                            <p className="font-medium">{errorMessage}</p>

                                            <p className="mt-1">
                                                You can email me at{" "}
                                                <a
                                                    href={`mailto:${CONTACT_EMAIL}`}
                                                    className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-75"
                                                >
                                                    {CONTACT_EMAIL}
                                                </a>{" "}
                                                or call{" "}
                                                <a
                                                    href={`tel:${CONTACT_PHONE_LINK}`}
                                                    className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-75"
                                                >
                                                    {CONTACT_PHONE}
                                                </a>
                                                .
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Actions */}
                                <div className="mt-4 flex items-center justify-between gap-2.5">
                                    {hasSomethingToReset && (
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            disabled={isSubmitting}
                                            className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted transition-colors duration-200 hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <RotateCcw
                                                size={13}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />
                                            <span>Reset</span>
                                        </button>
                                    )}
                                    <div className="ml-auto flex items-center gap-2.5">
                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={onClose}
                                            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium transition-colors duration-200 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>

                                        <motion.button
                                            type="submit"
                                            disabled={!isFormReady}
                                            whileHover={isFormReady ? { y: -2 } : undefined}
                                            whileTap={isFormReady ? { scale: 0.98 } : undefined}
                                            transition={{
                                                duration: 0.2,
                                            }}
                                            className="inline-flex h-10 items-center justify-center gap-2.5 rounded-md px-5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                                            style={{
                                                backgroundColor: "var(--foreground)",
                                                color: "var(--background)",
                                            }}
                                        >
                                            <Send
                                                size={15}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />

                                            {isSubmitting ? "Sending..." : "Send"}
                                        </motion.button>
                                    </div>
                                </div>

                                {!isFormReady && !isSubmitting && !status && (
                                    <p className="mt-2.5 text-right text-[11px] text-muted">
                                        Complete the mandatory fields to send your message.
                                    </p>
                                )}
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
