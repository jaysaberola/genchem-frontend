import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (!base) {
    return res.status(500).json({ message: "API URL is not configured." });
  }

  try {
    const upstream = await fetch(`${base}/api/contact`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await upstream.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text || "Unexpected response from contact service." };
    }

    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({
      message: "Unable to reach the contact service. Please try again later.",
    });
  }
}
