export async function POST() {
  await new Promise((r) => setTimeout(r, 600))
  return Response.json({ ok: true })
}
