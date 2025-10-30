export async function GET() {
  return Response.json([
    { name: "AI", value: 24 },
    { name: "ML", value: 18 },
    { name: "NLP", value: 12 },
    { name: "Vision", value: 10 },
  ])
}
