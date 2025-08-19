import { NextResponse } from "next/server";
import { epayAPI } from "@/lib/epay-api";
import { supabase } from "@/lib/supabase"; // đã config ở lib/supabase.ts

const BUCKET = "epay";
const FILE_PATH = "transactions.json";

async function loadTransactions() {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(FILE_PATH);

  if (error) {
    if (error.message.includes("not found")) {
      return { transactions: [] }; // chưa có file thì khởi tạo
    }
    throw error;
  }

  const text = await data.text();
  return JSON.parse(text);
}

async function saveTransactions(transactions: any) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(FILE_PATH, JSON.stringify(transactions), {
      upsert: true,
      contentType: "application/json",
    });
  if (error) throw error;
}

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

    // Load transactions từ Supabase Storage
    const transactionsData = await loadTransactions();
    let actualAmount = amount;
    if (method === "vietqr") {
      actualAmount = amount / 23000;
    }
    // Mock deposit processing
    const transactionId = `DEP_${Date.now()}`;
    const depositData = {
      transactionId,
      method,
      mt5ID: "123456",
      currency: "USD",
      amount: Number.parseFloat(actualAmount.toFixed(2)),
      status: "pending",
      type: "deposit",
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      hashId: "",
      depositAddress: "",
      ref: "",
    };

    // VietQR → gọi Epay API
    if (method === "vietqr") {
      const data = await epayAPI.createDeposit({
        amount: Number.parseFloat(amount),
        mt5Id: "123456",
        ref: transactionId,
      });
      depositData.hashId = data.hashId;
      depositData.ref = data.code;
    }

    // Lưu vào Supabase Storage
    transactionsData.transactions.unshift(depositData);
    await saveTransactions(transactionsData);

    return NextResponse.json(depositData);
  } catch (error) {
    console.error("Error processing deposit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
