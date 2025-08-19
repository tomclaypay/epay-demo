import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'deposit' | 'withdraw' | 'all'
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const transactionsPath = path.join(process.cwd(), "data", "transactions.json")
    const transactionsContents = await fs.readFile(transactionsPath, "utf8")
    const transactionsData = JSON.parse(transactionsContents)

    // Filter by type if specified
    let filteredTransactions = transactionsData.transactions
    if (type && type !== "all") {
      filteredTransactions = transactionsData.transactions.filter((tx) => tx.type === type)
    }

    // Apply pagination
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit)

    const response = {
      transactions: paginatedTransactions,
      pagination: {
        total: filteredTransactions.length,
        limit,
        offset,
        hasMore: offset + limit < filteredTransactions.length,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error reading transactions:", error)
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 })
  }
}
