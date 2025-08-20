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

    const transactionsData = await loadTransactions(
      "epay",
      "transactions.json"
    );

    // Filter by type if specified
    let filteredTransactions = transactionsData.transactions;
    if (type && type !== "all") {
      filteredTransactions = transactionsData.transactions.filter(
        (tx) => tx.type === type
      );
    }

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
        offset,
        hasMore: offset + limit < filteredTransactions.length,
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
