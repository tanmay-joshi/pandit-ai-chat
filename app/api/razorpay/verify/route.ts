import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, email } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount || !email) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET!;
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { wallet: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user doesn't have a wallet, create one
    let wallet;
    if (!user.wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: amount,
          transactions: {
            create: {
              amount,
              type: "recharge",
              description: `Razorpay recharge: ${razorpay_payment_id}`
            }
          }
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
    } else {
      wallet = await prisma.wallet.update({
        where: { id: user.wallet.id },
        data: {
          balance: { increment: amount },
          transactions: {
            create: {
              amount,
              type: "recharge",
              description: `Razorpay recharge: ${razorpay_payment_id}`
            }
          }
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
    }

    return NextResponse.json({ success: true, wallet });
  } catch (error) {
    console.error("Razorpay payment verification error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
} 