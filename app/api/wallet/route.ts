import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

// Get wallet information
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 10, // Get only last 10 transactions
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user doesn't have a wallet, create one
    if (!user.wallet) {
      const wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 100, // Start with 100 free credits
          transactions: {
            create: {
              amount: 100,
              type: "welcome_bonus",
              description: "Welcome bonus"
            }
          }
        },
        include: {
          transactions: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        }
      });

      return NextResponse.json({ wallet });
    }

    return NextResponse.json({ wallet: user.wallet });
  } catch (error) {
    console.error("Error getting wallet:", error);
    return NextResponse.json(
      { error: "Failed to get wallet information" },
      { status: 500 }
    );
  }
}

// Add funds to wallet
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, type = "recharge", description = "Wallet recharge" } = body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { wallet: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user doesn't have a wallet, create one
    if (!user.wallet) {
      const wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: amount,
          transactions: {
            create: {
              amount,
              type,
              description
            }
          }
        },
        include: {
          transactions: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        }
      });

      return NextResponse.json({ wallet });
    }

    // Add funds to existing wallet
    const updatedWallet = await prisma.wallet.update({
      where: {
        id: user.wallet.id
      },
      data: {
        balance: {
          increment: amount
        },
        transactions: {
          create: {
            amount,
            type,
            description
          }
        }
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    return NextResponse.json({ wallet: updatedWallet });
  } catch (error) {
    console.error("Error adding funds to wallet:", error);
    return NextResponse.json(
      { error: "Failed to add funds to wallet" },
      { status: 500 }
    );
  }
} 