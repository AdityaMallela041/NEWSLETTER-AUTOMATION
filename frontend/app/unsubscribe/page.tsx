export default function UnsubscribePage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="max-w-lg rounded-xl border border-border/60 bg-card/60 p-8 text-center backdrop-blur">
        <h1 className="text-2xl font-semibold">Unsubscribed</h1>
        <p className="mt-2 text-muted-foreground">
          You have been unsubscribed successfully. You can resubscribe anytime.
        </p>
        <div className="mt-6">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-white"
            style={{ background: "linear-gradient(var(--accent-gradient))" }}
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
