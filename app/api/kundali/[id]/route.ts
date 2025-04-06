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
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "Kundali ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the kundali and verify ownership
    const kundali = await prisma.kundali.findUnique({
      where: { id },
      include: { user: { select: { email: true } } }
    });

    if (!kundali) {
      return NextResponse.json({ error: "Kundali not found" }, { status: 404 });
    }

    // Verify ownership
    if (kundali.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Remove user field from response
    const { user, ...kundaliData } = kundali;
    return NextResponse.json(kundaliData);
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
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "Kundali ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the kundali and verify ownership
    const kundali = await prisma.kundali.findUnique({
      where: { id },
      include: { user: { select: { email: true } } }
    });

    if (!kundali) {
      return NextResponse.json({ error: "Kundali not found" }, { status: 404 });
    }

    // Verify ownership
    if (kundali.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get the update data
    const body = await req.json();
    const { fullName, dateOfBirth, placeOfBirth } = body;

    // Update the kundali
    const updatedKundali = await prisma.kundali.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(placeOfBirth && { placeOfBirth }),
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
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "Kundali ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the kundali and verify ownership
    const kundali = await prisma.kundali.findUnique({
      where: { id },
      include: { user: { select: { email: true } } }
    });

    if (!kundali) {
      return NextResponse.json({ error: "Kundali not found" }, { status: 404 });
    }

    // Verify ownership
    if (kundali.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the kundali
    await prisma.kundali.delete({
      where: { id },
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