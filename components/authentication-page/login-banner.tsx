import { Check } from "lucide-react"

function LoginBanner() {
  return (
    <>
      {/* Left Content Section - Always dark theme | */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden border-l border-zinc-800 bg-zinc-950 lg:flex lg:px-12 xl:px-24">
        {/* Subtle grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 opacity-50 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" />
            <span className="text-xs font-semibold tracking-[0.04em] text-zinc-300 uppercase">
              Built for service businesses
            </span>
          </div>

          <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.08] font-extrabold tracking-[-0.04em] text-white">
            Stop guessing.
            <br />
            <em className="text-primary not-italic">Start knowing</em>
            <br />
            your numbers.
          </h2>

          <p className="max-w-125 text-lg leading-[1.7] font-light text-zinc-400">
            Klicktiv turns scattered spreadsheets into one live financial
            operating system for chimney, HVAC, and dryer vent companies. From
            commissions to profitability, your team sees the right numbers at
            the right time.
          </p>

          <div className="mt-4 flex flex-col gap-4">
            {[
              "Automated commission splits",
              "Job and cost tracking",
              "Custom-built for your workflow",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-zinc-300"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-[1rem] font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginBanner
