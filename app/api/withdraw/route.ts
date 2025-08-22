import { NextResponse } from "next/server";
import { loadTransactions, saveTransactions } from "@/lib/supabase";
import { epayAPI } from "@/lib/epay-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      method,
      amount,
      bankNameDest,
      bankAccountNumberDest,
      bankAccountNameDest,
      walletAddress,
      chainName,
    } = body;

    // Validate required fields
    if (!method || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const accountData = await loadTransactions("epay", "account.json");

    let actualAmount = amount;
    if (method === "vietqr") {
      actualAmount = amount * 23000;
    }

    if (accountData.balances[0].available < Number.parseFloat(amount)) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Calculate fees
    let fee = 0;
    const transactionId = `WTH_${Date.now()}`;
    const withdrawData = {
      transactionId,
      method,
      currency: "USD",
      amount: Number.parseFloat(amount),
      fee,
      status: "pending",
      type: "withdraw",
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 2 * 60 * 60 * 1000
      ).toISOString(), // 2 hours
      ref: "",
    };

    if (method === "vietqr") {
      const data = await epayAPI.createWithdraw({
        amount: Number.parseFloat(actualAmount),
        bankNameDest,
        bankAccountNumberDest,
        bankAccountNameDest,
        ref: transactionId,
        mt5Id: "123456",
      });
      withdrawData.ref = data.code;
    } else {
      const data = await epayAPI.createWithdrawalCrypto({
        chainName: chainName,
        customerId: "1",
        mt5Id: "1",
        usdAmount: amount,
        toAddress: walletAddress,
        ref: transactionId,
      });
      withdrawData.ref = data.code;
    }
    accountData.balances[0].available += Number.parseFloat(
      withdrawData.amount.toFixed(2)
    );

    await saveTransactions(accountData, "epay", "account.json");

    const transactionsData = await loadTransactions(
      "epay",
      "transactions.json"
    );

    transactionsData.transactions.unshift(withdrawData);
    await saveTransactions(transactionsData, "epay", "transactions.json");
    return NextResponse.json(withdrawData);
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
