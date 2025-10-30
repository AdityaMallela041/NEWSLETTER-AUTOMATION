export async function GET() {
  return Response.json({
    total: 132,
    summaries: 548,
    topics: 27,
    updatedAt: new Date().toISOString(),
  })
}
