import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "tmp", "payment-methods.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const paymentMethods = JSON.parse(fileContents);

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error("Error reading payment methods:", error);
    return NextResponse.json(
      { error: "Failed to load payment methods" },
      { status: 500 }
    );
  }
}
