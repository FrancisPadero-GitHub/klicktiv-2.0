import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroHeader } from "./header"
import Image from "next/image"
import { Check, ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="flex min-h-screen flex-col justify-center bg-linear-to-b from-background to-muted">
          {/* Adjusted vertical padding for mobile vs desktop */}
          <div className="relative py-16 md:py-24">
            {/* Added px-4 sm:px-6 lg:px-8 to contain content on mobile */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="md:w-1/2">
                <div>
                  {/* Scaled down text size slightly for very small screens */}
                  <h1 className="max-w-md text-4xl font-medium text-balance sm:text-5xl md:text-6xl">
                    {" "}
                    Stop guessing.
                    <br />
                    <em className="text-primary not-italic">Start knowing</em>
                    <br />
                    your numbers.
                  </h1>

                  {/* Removed px-2, changed pt-10 to mt-6 for cleaner spacing */}
                  <p className="animate-fade-up-delay-2 leading-light mx-auto mt-6 max-w-xl text-base font-light text-muted-foreground sm:text-lg">
                    Klicktiv turns scattered spreadsheets into one live
                    financial operating system for chimney, HVAC, and dryer vent
                    companies. From commissions to profitability, your team sees
                    the right numbers at the right time.
                  </p>

                  {/* Changed to flex-col on mobile, flex-row on larger screens. Adjusted mt. */}
                  <div className="mt-8 flex flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:items-center">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="#link">
                        <span className="text-nowrap">
                          Book a Free Consultation
                        </span>
                      </Link>
                    </Button>
                    <Button
                      key={2}
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Link href="#features">
                        See What We Build{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-12">
                  {/* Tags */}
                  <div className="animate-fade-up-delay-4 flex flex-wrap items-center justify-start gap-2.5">
                    {[
                      "Commission splits automated",
                      "No spreadsheets",
                      "Custom-built for you",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-1.5 text-[0.82rem] font-medium text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/50 hover:text-accent-foreground/80"
                      >
                        <Check className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Softened mobile image transforms so it fits nicely on a phone screen */}
            <div className="mt-16 translate-x-2 px-4 perspective-near sm:translate-x-8 md:absolute md:top-40 md:-right-6 md:bottom-16 md:left-1/2 md:mt-0 md:translate-x-0 md:px-0">
              <div className="relative h-full before:absolute before:-inset-x-4 before:top-0 before:bottom-7 before:skew-x-3 before:rounded-[calc(var(--radius)+1rem)] before:border before:border-foreground/5 before:bg-foreground/5 md:before:skew-x-6">
                <div className="relative h-full -translate-y-6 skew-x-3 overflow-hidden rounded-(--radius) border border-transparent bg-background shadow-md ring-1 shadow-foreground/10 ring-foreground/5 md:-translate-y-12 md:skew-x-6">
                  <Image
                    src="/klicktiv-dashboard-overview.png"
                    alt="app screen"
                    width="2880"
                    height="1842"
                    loading="eager"
                    className="size-full object-cover object-top-left"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
