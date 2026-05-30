import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const body = await req.json();
    const { sessionKey, sessionData, bodyweight } = body || {};
    if (!sessionKey || !sessionData) {
      return json({ error: "missing sessionKey or sessionData" }, 400);
    }

    const sessions = getStore("sessions");
    await sessions.setJSON(sessionKey, {
      sessionKey,
      sessionData,
      savedAt: new Date().toISOString(),
    });

    if (bodyweight && typeof bodyweight === "object") {
      const bws = getStore("bodyweight");
      for (const [date, weight] of Object.entries(bodyweight)) {
        if (!weight) continue;
        await bws.setJSON(date, { date, weight: String(weight), savedAt: new Date().toISOString() });
      }
    }

    return json({ ok: true, key: sessionKey });
  } catch (e) {
    return json({ error: e.message || "save failed" }, 500);
  }
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
