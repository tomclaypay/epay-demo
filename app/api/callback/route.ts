import { loadTransactions, saveTransactions } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

// POST { text: string, size?: number }
export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      orderType,
      orderRef,
      orderCode,
      orderStatus,
      orderAmount,
      isCrypto,
      usdAmount,
      reason,
      secretKey,
    } = await req.json();

    console.log("orderId", orderId);

    if (!orderId || !orderType || !orderRef || !orderCode || !orderStatus) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    if (secretKey !== process.env.SECRET_KEY) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 400 }
      );
    }

    const transactionsData = await loadTransactions(
      "epay",
      "transactions.json"
    );
    console.log("transactionsData", transactionsData);

    const accountData = await loadTransactions("epay", "account.json");

    const transaction = transactionsData.transactions.find(
      (transaction) => transaction.ref === orderCode
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.status !== "pending") {
      return NextResponse.json(
        { error: "Transaction already processed" },
        { status: 400 }
      );
    }

    if (orderStatus === "SUCCEED") {
      console.log("accountData", accountData);
      transaction.status = "success";
      if (orderType === "DEPOSIT") {
        accountData.balances[0].available += Number.parseFloat(
          transaction.amount
        );
      } else {
        accountData.balances[0].available -= Number.parseFloat(
          transaction.amount
        );
      }
    } else if (orderStatus === "CANCELED") {
      transaction.status = "cancel";
    }

    transaction.updatedAt = new Date().toISOString();
    const transactionId = transaction.transactionId;
    const index = transactionsData.transactions.findIndex(
      (transaction) => transaction.transactionId === transactionId
    );
    if (index !== -1) {
      transactionsData.transactions[index] = transaction;
    }

    await saveTransactions(transactionsData, "epay", "transactions.json");
    await saveTransactions(accountData, "epay", "account.json");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    console.log("e", e);
    return NextResponse.json(
      { error: e?.message || "Callback error" },
      { status: 500 }
    );
  }
}
