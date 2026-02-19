import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.betaUser.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Beta List Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();
        if (!id || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
        }
        const updated = await prisma.betaUser.update({
            where: { id },
            data: { status }
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Beta Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

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
