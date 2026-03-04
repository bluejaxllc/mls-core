import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/auth/verify?status=error&msg=token_missing', req.url));
        }

        // Find user with this token
        const user = await prisma.user.findUnique({
            where: { verifyToken: token }
        });

        if (!user) {
            return NextResponse.redirect(new URL('/auth/verify?status=error&msg=invalid_token', req.url));
        }

        // Check expiration
        if (user.verifyExpires && new Date() > user.verifyExpires) {
            return NextResponse.redirect(new URL('/auth/verify?status=error&msg=expired', req.url));
        }

        // Verify the user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verifyToken: null,
                verifyExpires: null,
            }
        });

        // Redirect to verification success page
        return NextResponse.redirect(new URL('/auth/verify?status=success', req.url));

    } catch (error) {
        console.error("Verify Error:", error);
        return NextResponse.redirect(new URL('/auth/verify?status=error&msg=server_error', req.url));
    }
}
