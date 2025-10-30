export async function GET() {
  return Response.json([
    {
      title: "Transformers: Beyond Attention",
      snippet: "A survey on the latest architectural advances and efficient training.",
      url: "https://example.com/ai-article-1",
    },
    {
      title: "Evaluating LLM Agents",
      snippet: "Benchmarks and frameworks for complex tool-using agents.",
      url: "https://example.com/ai-article-2",
    },
    {
      title: "Vision-Language Models in the Wild",
      snippet: "From research to production: challenges and patterns.",
      url: "https://example.com/ai-article-3",
    },
  ])
}
