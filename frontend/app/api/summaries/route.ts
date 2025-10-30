import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    {
      id: "s1",
      title: "Scaling LLM Inference on GPUs",
      model: "Groq LLaMA-3.1-8B",
      summary:
        "Batching requests and reusing KV caches significantly reduces latency and cost while preserving quality for many workloads.",
    },
    {
      id: "s2",
      title: "Advances in Retrieval-Augmented Generation",
      model: "Gemini 1.5 Flash",
      summary:
        "Improved retrieval strategies and hybrid dense-sparse indexes enhance factual accuracy in generated outputs.",
    },
  ])
}
