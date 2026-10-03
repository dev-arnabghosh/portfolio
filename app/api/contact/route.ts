import { NextResponse } from "next/server";

import { Resend } from "resend";

const RECIPIENT_EMAIL = "arnabghosh.developer@gmail.com";
const FROM_EMAIL = "onboarding@resend.dev";

interface ContactRequest {
    name?: string;
    mobile?: string;
    email?: string;
    message?: string;
}

export async function POST(request: Request) {
    try {
        const body: ContactRequest = await request.json();

        const name = body.name?.trim() ?? "";
        const mobile = body.mobile?.trim() ?? "";
        const email = body.email?.trim() ?? "";
        const message = body.message?.trim() ?? "";

        // ========================================
        // SERVER-SIDE VALIDATION
        // ========================================

        if (!name) {
            return NextResponse.json(
                { error: "Name is required." },
                { status: 400 },
            );
        }

        if (name.length < 2) {
            return NextResponse.json(
                { error: "Name must contain at least 2 characters." },
                { status: 400 },
            );
        }

        if (name.length > 100) {
            return NextResponse.json(
                { error: "Name is too long." },
                { status: 400 },
            );
        }

        if (!message) {
            return NextResponse.json(
                { error: "Message is required." },
                { status: 400 },
            );
        }

        if (message.length < 10) {
            return NextResponse.json(
                { error: "Message must contain at least 10 characters." },
                { status: 400 },
            );
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { error: "Message is too long." },
                { status: 400 },
            );
        }

        // ========================================
        // EMAIL VALIDATION
        // ========================================

        if (email) {
            if (email.length > 254) {
                return NextResponse.json(
                    { error: "Email address is too long." },
                    { status: 400 },
                );
            }

            if (/\s/.test(email)) {
                return NextResponse.json(
                    { error: "Please enter a valid email address." },
                    { status: 400 },
                );
            }

            if ((email.match(/@/g) ?? []).length !== 1) {
                return NextResponse.json(
                    { error: "Please enter a valid email address." },
                    { status: 400 },
                );
            }

            const [localPart, domain] = email.split("@");

            if (!localPart || !domain) {
                return NextResponse.json(
                    { error: "Please enter a valid email address." },
                    { status: 400 },
                );
            }

            if (localPart.length > 64 || domain.length > 253) {
                return NextResponse.json(
                    { error: "Please enter a valid email address." },
                    { status: 400 },
                );
            }

            if (
                localPart.startsWith(".") ||
                localPart.endsWith(".") ||
                localPart.includes("..")
            ) {
                return NextResponse.json(
                    { error: "Please enter a valid email address." },
                    { status: 400 },
                );
            }

            const emailPattern =
                /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

            if (!emailPattern.test(email)) {
                return NextResponse.json(
                    { error: "Please enter a valid email address." },
                    { status: 400 },
                );
            }
        }

        // ========================================
        // MOBILE VALIDATION
        // ========================================

        if (mobile && mobile.length > 30) {
            return NextResponse.json(
                { error: "Mobile number is too long." },
                { status: 400 },
            );
        }

        // The client uses react-phone-number-input for phone validation.
        // The API intentionally performs a lightweight structural check here
        // rather than trusting the client-side validation completely.
        if (mobile) {
            const normalizedMobile = mobile.replace(/[\s().-]/g, "");

            if (!/^\+?[0-9]{7,15}$/.test(normalizedMobile)) {
                return NextResponse.json(
                    { error: "Please enter a valid mobile number." },
                    { status: 400 },
                );
            }
        }

        // ========================================
        // RESEND CONFIGURATION
        // ========================================

        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error("RESEND_API_KEY is not configured.");

            return NextResponse.json(
                { error: "Email service is not configured." },
                { status: 500 },
            );
        }

        const resend = new Resend(resendApiKey);

        // ========================================
        // EMAIL CONTENT
        // ========================================

        const emailContent = `
            <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #171717;">
                <h2 style="margin-bottom: 20px;">
                    New Contact Form Message
                </h2>

                <p>
                    <strong>Name:</strong><br />
                    ${escapeHtml(name)}
                </p>

                ${
                    mobile
                        ? `
                            <p>
                                <strong>Mobile:</strong><br />
                                ${escapeHtml(mobile)}
                            </p>
                        `
                        : ""
                }

                ${
                    email
                        ? `
                            <p>
                                <strong>Email:</strong><br />
                                ${escapeHtml(email)}
                            </p>
                        `
                        : ""
                }

                <p>
                    <strong>Message:</strong><br />
                    ${escapeHtml(message).replace(/\n/g, "<br />")}
                </p>
            </div>
        `;

        // ========================================
        // SEND EMAIL
        // ========================================

        const { data, error } = await resend.emails.send({
            from: `Portfolio Contact <${FROM_EMAIL}>`,
            to: [RECIPIENT_EMAIL],
            subject: `New portfolio message from ${name}`,
            html: emailContent,
            ...(email ? { replyTo: email } : {}),
        });

        if (error) {
            console.error("Resend error:", error);

            return NextResponse.json(
                {
                    error: "Failed to send the message. Please try again.",
                },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                id: data?.id,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Contact API error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong. Please try again.",
            },
            { status: 500 },
        );
    }
}

// ========================================
// HTML ESCAPING
// ========================================

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
