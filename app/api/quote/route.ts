const requiredFields = ["name", "vehicle", "collection", "delivery", "date"] as const;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return Response.json({ error: "Email delivery is not configured." }, { status: 503 });
  }

  const data = await request.formData();
  const values = Object.fromEntries(data.entries());
  const missing = requiredFields.filter((field) => !String(values[field] ?? "").trim());
  const email = String(values.email ?? "").trim();

  const phone = String(values.phone ?? "").trim();
  if (missing.length || (!phone && !/^\S+@\S+\.\S+$/.test(email)) || (email && !/^\S+@\S+\.\S+$/.test(email))) {
    return Response.json({ error: "Please provide a phone number or a valid email, and complete the required fields." }, { status: 400 });
  }

  const text = [
    "New AUMOREX transport enquiry",
    "",
    `Contact name: ${values.name}`,
    `Phone: ${phone || "—"}`,
    `Email: ${email || "—"}`,
    `Additional information: ${values.details || "—"}`,
    `Vehicle: ${values.vehicle}`,
    `Approximate weight: ${values.weight || "—"}`,
    `Collection: ${values.collection}`,
    `Delivery: ${values.delivery}`,
    `Preferred date: ${values.date}`,
    `Vehicle runs: ${values.running || "—"}`,
    `Flexible dates: ${values.flexible ? "Yes" : "No"}`,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject: `AUMOREX quote request — ${values.vehicle}`, text }),
  });

  if (!response.ok) return Response.json({ error: "Email delivery failed." }, { status: 502 });
  return Response.json({ ok: true });
}
