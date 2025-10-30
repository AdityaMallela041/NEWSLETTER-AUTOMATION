export async function GET() {
  const days = Array.from({ length: 10 }, (_, i) => i)
  return Response.json(
    days.map((d) => ({
      date: new Date(Date.now() - (9 - d) * 86400000).toLocaleDateString(),
      count: 10 + Math.round(8 * Math.sin(d / 2)) + d,
    })),
  )
}
