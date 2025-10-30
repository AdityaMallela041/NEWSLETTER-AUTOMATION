import { NextResponse, type NextRequest } from "next/server"

// Mock storage (in production, use a database)
const newsletters = [
  {
    id: "n1",
    eventName: "Tech Summit 2025",
    description: "Annual technology conference featuring industry leaders",
    place: "San Francisco, CA",
    date: new Date().toISOString(),
    time: "09:00",
    contactEmail: "contact@techsummit.com",
    tags: ["Technology", "Conference"],
    image: "/tech-summit.jpg",
    status: "published",
  },
  {
    id: "n2",
    eventName: "AI Workshop Series",
    description: "Hands-on workshop on artificial intelligence and machine learning",
    place: "New York, NY",
    date: new Date(Date.now() + 86400000).toISOString(),
    time: "14:00",
    contactEmail: "workshops@ailearn.com",
    tags: ["AI", "Workshop"],
    image: "/ai-workshop.png",
    status: "draft",
  },
  {
    id: "n3",
    eventName: "Business Networking Event",
    description: "Connect with entrepreneurs and business leaders",
    place: "Boston, MA",
    date: new Date(Date.now() + 2 * 86400000).toISOString(),
    time: "18:00",
    contactEmail: "events@business.com",
    tags: ["Business", "Networking"],
    image: "/networking-event.png",
    status: "published",
  },
]

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const index = newsletters.findIndex((n) => n.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
  }

  newsletters.splice(index, 1)
  return NextResponse.json({ success: true })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const newsletter = newsletters.find((n) => n.id === id)

  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
  }

  // Simulate retriggering the newsletter
  // In production, this would trigger an actual newsletter send or regeneration
  const retriggeredNewsletter = {
    ...newsletter,
    updatedAt: new Date().toISOString(),
    lastTriggeredAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    message: `Newsletter "${newsletter.eventName}" has been retriggered successfully`,
    newsletter: retriggeredNewsletter,
  })
}
