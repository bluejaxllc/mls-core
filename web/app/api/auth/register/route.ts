import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, firstName, lastName } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email y contraseña son requeridos" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "La contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            // Don't reveal if email exists for security
            return NextResponse.json(
                { error: "No se pudo crear la cuenta. Verifique los datos e intente nuevamente." },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Generate verification token
        const verifyToken = crypto.randomUUID();
        const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user with generated ID
        const userId = crypto.randomUUID();
        const user = await prisma.user.create({
            data: {
                id: userId,
                email: email.toLowerCase().trim(),
                firstName: firstName?.trim() || null,
                lastName: lastName?.trim() || null,
                passwordHash,
                emailVerified: false,
                verifyToken,
                verifyExpires,
                roles: "user",
            }
        });

        // Send verification email
        const emailResult = await sendVerificationEmail(
            user.email,
            verifyToken,
            user.firstName || undefined
        );

        return NextResponse.json({
            success: true,
            message: "Cuenta creada. Revise su correo para verificar su email.",
            // Include preview URL in dev mode for testing
            ...(process.env.NODE_ENV === 'development' && emailResult.preview
                ? { verifyUrl: emailResult.preview }
                : {}
            ),
        });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
