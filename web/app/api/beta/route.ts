import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, company, phone } = body;

        // Validation
        if (!email || !name) {
            return NextResponse.json({ error: "Email and Name are required" }, { status: 400 });
        }

        // Check duplicates
        const existing = await prisma.betaUser.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json({ success: true, message: "Already registered!" });
        }

        // Create
        await prisma.betaUser.create({
            data: {
                email,
                name,
                company,
                phone
            }
        });

        return NextResponse.json({ success: true, message: "Registered successfully" });

    } catch (error) {
        console.error("Beta Signup Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
