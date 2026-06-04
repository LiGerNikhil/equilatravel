import { NextRequest, NextResponse } from "next/server";

const GS_URL =
  "https://script.google.com/macros/s/AKfycbxc3lyCeE4aIR3HZqRXjsUJr16G8-ZXXw7dqZEQEKbOhgUcLvuNtH8MYteLCksoZjw4/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      action: "create",
      name: body.name || "",
      phone: body.phone || "",
      email: body.email || "",
      service: body.service || "",
      pickup: body.pickup || "",
      destination: body.destination || "",
      date: body.date || "",
      message: body.message || "",
    };

    const response = await fetch(GS_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
          status: response.status,
          raw: text.slice(0, 1000),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to submit lead",
      },
      { status: 500 },
    );
  }
}
