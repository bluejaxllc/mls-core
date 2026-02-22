import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Staff List Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, roles, mlsStatus } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const data: Record<string, string> = {};
        if (roles !== undefined) data.roles = roles;
        if (mlsStatus !== undefined) {
            if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(mlsStatus)) {
                return NextResponse.json({ error: "Invalid status" }, { status: 400 });
            }
            data.mlsStatus = mlsStatus;
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updated = await prisma.user.update({
            where: { id },
            data
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Staff Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
