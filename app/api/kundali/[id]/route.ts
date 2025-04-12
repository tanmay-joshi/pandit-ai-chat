import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get a specific kundali
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const kundali = await prisma.kundali.findUnique({
      where: { 
        id: params.id,
        user: { email: session.user.email }
      },
    });

    if (!kundali) {
      return NextResponse.json({ error: "Kundali not found" }, { status: 404 });
    }

    return NextResponse.json(kundali);
  } catch (error) {
    console.error("Error fetching kundali:", error);
    return NextResponse.json(
      { error: "Failed to fetch kundali" },
      { status: 500 }
    );
  }
}

// Update a kundali
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership
    const existingKundali = await prisma.kundali.findUnique({
      where: { 
        id: params.id,
        user: { email: session.user.email }
      },
    });

    if (!existingKundali) {
      return NextResponse.json({ error: "Kundali not found" }, { status: 404 });
    }

    // Update kundali
    const updatedKundali = await prisma.kundali.update({
      where: { id: params.id },
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        placeOfBirth,
      },
    });

    return NextResponse.json(updatedKundali);
  } catch (error) {
    console.error("Error updating kundali:", error);
    return NextResponse.json(
      { error: "Failed to update kundali" },
      { status: 500 }
    );
  }
}

// Delete a kundali
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingKundali = await prisma.kundali.findUnique({
      where: { 
        id: params.id,
        user: { email: session.user.email }
      },
    });

    if (!existingKundali) {
      return NextResponse.json({ error: "Kundali not found" }, { status: 404 });
    }

    // Delete kundali
    await prisma.kundali.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting kundali:", error);
    return NextResponse.json(
      { error: "Failed to delete kundali" },
      { status: 500 }
    );
  }
} 