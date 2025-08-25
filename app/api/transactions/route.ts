import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { loadTransactions } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'deposit' | 'withdraw' | 'all'
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const offset = Number.parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";
    console.log({ type, limit, offset });
    const transactionsData = await loadTransactions(
      "epay",
      "transactions.json"
    );

    // Filter by type if specified
    let filteredTransactions = transactionsData.transactions;
    // summary statistics
    const totalDeposits = filteredTransactions
      .filter((tx) => tx.type === "deposit" && tx.status === "success")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalWithdrawals = filteredTransactions
      .filter((tx) => tx.type === "withdraw" && tx.status === "success")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const netBalance = totalDeposits - totalWithdrawals;
    const depositCount = filteredTransactions.filter(
      (tx) => tx.type === "deposit"
    ).length;
    const withdrawalCount = filteredTransactions.filter(
      (tx) => tx.type === "withdraw"
    ).length;

    if (type && type !== "all") {
      filteredTransactions = transactionsData.transactions.filter(
        (tx) => tx.type === type
      );
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        (tx) =>
          tx.transactionId.toLowerCase().includes(lowerSearch) ||
          (tx.walletAddress &&
            tx.walletAddress.toLowerCase().includes(lowerSearch)) ||
          (tx.bankAccountNumberDest &&
            tx.bankAccountNumberDest.toLowerCase().includes(lowerSearch)) ||
          (tx.bankAccountNameDest &&
            tx.bankAccountNameDest.toLowerCase().includes(lowerSearch)) ||
          (tx.bankNameDest &&
            tx.bankNameDest.toLowerCase().includes(lowerSearch))
      );
    }

    // Calculate total pages
    const totalPages = Math.ceil(filteredTransactions.length / limit);

    // Apply pagination
    const paginatedTransactions = filteredTransactions.slice(
      offset,
      offset + limit
    );

    const response = {
      transactions: paginatedTransactions,
      pagination: {
        total: filteredTransactions.length,
        limit,
        totalPages,
        offset,
        hasMore: offset + limit < filteredTransactions.length,
      },
      stats: {
        totalDeposits,
        totalWithdrawals,
        netBalance,
        depositCount,
        withdrawalCount,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error reading transactions:", error);
    return NextResponse.json(
      { error: "Failed to load transactions" },
      { status: 500 }
    );
  }
}
