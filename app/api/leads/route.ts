import { NextRequest, NextResponse } from "next/server";

const GS_URL =
  "https://script.google.com/macros/s/AKfycbxc3lyCeE4aIR3HZqRXjsUJr16G8-ZXXw7dqZEQEKbOhgUcLvuNtH8MYteLCksoZjw4/exec";

export async function GET() {
  try {
    const response = await fetch(GS_URL, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid response from Google Sheets", raw: text.slice(0, 1000) },
        { status: 502 },
      );
    }

    // Google Apps Script returns {success:true, data:[...]}
    const leads = data?.data ?? data;
    return NextResponse.json(Array.isArray(leads) ? leads : []);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to fetch leads" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(GS_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid response from Google Sheets",
          raw: text.slice(0, 1000),
        },
        { status: 502 },
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        { success: false, error: data?.error || "Request failed" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to process request",
      },
      { status: 500 },
    );
  }
}
