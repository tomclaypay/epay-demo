import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { loadTransactions } from "@/lib/supabase";

export async function GET() {
  try {
    const accountData = await loadTransactions("epay", "account.json");
    return NextResponse.json(accountData);
  } catch (error) {
    console.error("Error reading account data:", error);
    return NextResponse.json(
      { error: "Failed to load account data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const filePath = path.join(process.cwd(), "data", "account.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const accountData = JSON.parse(fileContents);

    // Update balances if provided
    if (body.balances) {
      accountData.balances = { ...accountData.balances, ...body.balances };
    }

    // Update last login
    accountData.lastLogin = new Date().toISOString();

    await fs.writeFile(filePath, JSON.stringify(accountData, null, 2));

    return NextResponse.json(accountData);
  } catch (error) {
    console.error("Error updating account data:", error);
    return NextResponse.json(
      { error: "Failed to update account data" },
      { status: 500 }
    );
  }
}
