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

    if (!orderId || !orderType || !orderCode || !orderStatus) {
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

    const accountData = await loadTransactions("epay", "account.json");

    const transaction = transactionsData.transactions.find(
      (transaction) => transaction.ref === orderCode
    );

    if (transaction.status !== "pending" && !isCrypto) {
      return NextResponse.json(
        { error: "Transaction already processed" },
        { status: 400 }
      );
    }
    if (isCrypto) {
      const depositData = {
        transactionId: `DEP_${Date.now()}`,
        method: "crypto",
        mt5ID: "123456",
        currency: "USD",
        amount: Number.parseFloat(usdAmount.toFixed(2)),
        status: "success",
        type: "deposit",
        createdAt: new Date().toISOString(),
        estimatedCompletion: new Date(
          Date.now() + 30 * 60 * 1000
        ).toISOString(),
        hashId: "",
        depositAddress: "",
        ref: "",
      };
      transactionsData.transactions.unshift(depositData);
    }

    if (orderStatus === "SUCCEED") {
      transaction.status = "success";
      if (orderType === "DEPOSIT") {
        if (isCrypto) {
          accountData.balances[0].available += Number.parseFloat(
            usdAmount.toFixed(2)
          );
        } else
          accountData.balances[0].available += Number.parseFloat(
            transaction.amount.toFixed(2)
          );
      } else {
        accountData.balances[0].available -= Number.parseFloat(
          transaction.amount.toFixed(2)
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
