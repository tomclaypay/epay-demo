import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

// POST { text: string, size?: number }
export async function POST(req: NextRequest) {
  try {
    const { text, size = 256 } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // tạo PNG buffer (serverless-friendly, không ghi file)
    const png = await QRCode.toBuffer(text, {
      type: "png",
      width: Number(size) || 256,
      margin: 1,
      errorCorrectionLevel: "M",
    });

    return new NextResponse(png, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "QR error" },
      { status: 500 }
    );
  }
}
