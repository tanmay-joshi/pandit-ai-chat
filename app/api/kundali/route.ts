import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Get all kundalis for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all kundalis for the user
    const kundalis = await prisma.kundali.findMany({
      where: { 
        user: { email: session.user.email } 
      },
      orderBy: { 
        updatedAt: "desc" 
      },
    });

    return NextResponse.json(kundalis);
  } catch (error) {
    console.error("Error fetching kundalis:", error);
    return NextResponse.json(
      { error: "Failed to fetch kundalis" },
      { status: 500 }
    );
  }
}

// Create a new kundali
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, dateOfBirth, placeOfBirth } = body;

    if (!fullName || !dateOfBirth || !placeOfBirth) {
      return NextResponse.json(
        { error: "Full name, date of birth and place of birth are required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new kundali
    const newKundali = await prisma.kundali.create({
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth), // Convert to Date object
        placeOfBirth,
        userId: user.id,
      },
    });

    return NextResponse.json(newKundali);
  } catch (error) {
    console.error("Error creating kundali:", error);
    return NextResponse.json(
      { error: "Failed to create kundali" },
      { status: 500 }
    );
  }
} 