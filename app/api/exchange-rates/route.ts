import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "tmp", "exchange-rates.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const exchangeRates = JSON.parse(fileContents);

    // Update timestamp to current time
    exchangeRates.timestamp = new Date().toISOString();

    return NextResponse.json(exchangeRates);
  } catch (error) {
    console.error("Error reading exchange rates:", error);
    return NextResponse.json(
      { error: "Failed to load exchange rates" },
      { status: 500 }
    );
  }
}
