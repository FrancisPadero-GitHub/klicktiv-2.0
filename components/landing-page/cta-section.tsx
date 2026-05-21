import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-primary py-16 text-center"
    >
      {/* Radial glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/15 opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <h2 className="animate-fade-up mx-auto max-w-175 text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-extrabold tracking-[-0.03em] text-primary-foreground">
          Ready to see exactly
          <br />
          where your money is?
        </h2>
        <p className="animate-fade-up-delay-1 mx-auto mt-4 max-w-120 text-[1.05rem] leading-[1.7] text-primary-foreground/75">
          Book a free 30-minute consultation. Tell us what&apos;s slowing you
          down - we&apos;ll show you what your business could look like with
          Klicktiv.
        </p>
        <div className="animate-fade-up-delay-2 mt-12 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="https://advancedvirtualstaff.com/booking"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-background px-8 py-3.75 text-[0.95rem] font-semibold text-foreground shadow-lg shadow-foreground/15 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/20"
          >
            Book a Free Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-primary-foreground/30 px-8 py-3.75 text-[0.95rem] font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
          >
            See All Features →
          </Link>
        </div>
      </div>
    </section>
  )
}
