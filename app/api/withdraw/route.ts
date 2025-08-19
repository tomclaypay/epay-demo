import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method, currency, amount, bankAccount, walletAddress } = body;

    // Validate required fields
    if (!method || !currency || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const accountPath = path.join(process.cwd(), "tmp", "account.json");
    const accountContents = await fs.readFile(accountPath, "utf8");
    const accountData = JSON.parse(accountContents);

    if (accountData.balances[currency] < Number.parseFloat(amount)) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Calculate fees
    let fee = 0;
    if (method === "vietqr") {
      fee = Number.parseFloat(amount) * 0.001; // 0.1% fee
    } else if (method === "crypto") {
      const cryptoFees = {
        BTC: 0.0005,
        ETH: 0.005,
        USDT: 1,
        BNB: 0.001,
      };
      fee = cryptoFees[currency] || 0;
    }

    const withdrawData = {
      transactionId: `WTH_${Date.now()}`,
      method,
      currency,
      amount: Number.parseFloat(amount),
      fee,
      netAmount: Number.parseFloat(amount) - fee,
      status: "pending",
      type: "withdraw",
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 2 * 60 * 60 * 1000
      ).toISOString(), // 2 hours
      ...(method === "vietqr" &&
        bankAccount && {
          bankAccount: {
            bankName: bankAccount.bankName,
            accountNumber: bankAccount.accountNumber,
            accountName: bankAccount.accountName,
          },
        }),
      ...(method === "crypto" &&
        walletAddress && {
          walletAddress,
          network:
            currency === "USDT"
              ? "TRC20"
              : currency === "BNB"
              ? "BSC"
              : "Mainnet",
        }),
    };

    const transactionsPath = path.join(
      process.cwd(),
      "data",
      "transactions.json"
    );
    const transactionsContents = await fs.readFile(transactionsPath, "utf8");
    const transactionsData = JSON.parse(transactionsContents);

    transactionsData.transactions.unshift(withdrawData);
    await fs.writeFile(
      transactionsPath,
      JSON.stringify(transactionsData, null, 2)
    );

    accountData.balances[currency] -= Number.parseFloat(amount);
    await fs.writeFile(accountPath, JSON.stringify(accountData, null, 2));

    return NextResponse.json(withdrawData);
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
