import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const sessionsStore = getStore("sessions");
    const bwsStore = getStore("bodyweight");

    const sessionsList = await sessionsStore.list();
    const bwsList = await bwsStore.list();

    const sessions = {};
    await Promise.all((sessionsList.blobs || []).map(async (b) => {
      const data = await sessionsStore.get(b.key, { type: "json" });
      if (data?.sessionKey && data?.sessionData) {
        sessions[data.sessionKey] = data.sessionData;
      }
    }));

    const bodyweight = {};
    await Promise.all((bwsList.blobs || []).map(async (b) => {
      const data = await bwsStore.get(b.key, { type: "json" });
      if (data?.date && data?.weight) {
        bodyweight[data.date] = data.weight;
      }
    }));

    return json({
      sessions,
      bodyweight,
      meta: {
        sessionCount: Object.keys(sessions).length,
        bodyweightCount: Object.keys(bodyweight).length,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    return json({ error: e.message || "fetch failed" }, 500);
  }
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
