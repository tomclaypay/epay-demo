import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { epayAPI } from "@/lib/epay-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method, amount, walletAddress } = body;

    // Validate required fields
    if (!method || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const isProd = process.env.NODE_ENV === "production";
    const transactionsPath = isProd
      ? path.join("/tmp", "transactions.json")
      : path.join(process.cwd(), "data", "transactions.json");
    const transactionsContents = await fs.readFile(transactionsPath, "utf8");
    const transactionsData = JSON.parse(transactionsContents);

    // Mock deposit processing
    const transactionId = `DEP_${Date.now()}`;
    const depositData = {
      transactionId: transactionId,
      method,
      mt5ID: "123456",
      currency: "USD",
      amount: Number.parseFloat(amount),
      status: "pending",
      type: "deposit",
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      hashId: "",
      depositAddress: "",
    };

    // For VietQR, generate QR code data
    if (method === "vietqr") {
      const data = await epayAPI.createDeposit({
        amount: Number.parseFloat(amount),
        mt5Id: "123456",
        ref: transactionId,
      });
      depositData.hashId = data.hashId;
    }

    // For crypto, generate deposit address
    if (method === "crypto") {
      depositData.depositAddress = walletAddress;
    }

    transactionsData.transactions.unshift(depositData);
    await fs.writeFile(
      transactionsPath,
      JSON.stringify(transactionsData, null, 2)
    );

    return NextResponse.json(depositData);
  } catch (error) {
    console.error("Error processing deposit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
