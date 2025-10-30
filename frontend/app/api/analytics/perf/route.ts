export async function GET() {
  return Response.json([
    { label: "Summarization", score: 82 },
    { label: "Tagging", score: 74 },
    { label: "Routing", score: 66 },
    { label: "Clustering", score: 58 },
  ])
}
