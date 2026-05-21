import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function PainSection() {
  return (
    <section id="pain-section">
      <div className="bg-muted/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div>
            <p className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">
              Sound familiar?
            </p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-extrabold tracking-[-0.03em] text-foreground">
              Your finances are running
              <br />
              on faith and formulas.
            </h2>
            <p className="mt-4 mb-12 text-lg text-balance text-muted-foreground">
              Most business service owners don&apos;t have a money problem. They
              have a visibility problem. Here&apos;s what that looks likes.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
            {/* Card 1 */}
            <div className="space-y-4">
              {/* 1. Changed px-6 to p-2 to apply even padding on all sides */}
              <Card className="aspect-video overflow-hidden p-2">
                {/* 2. Removed w-64 and changed to h-full w-full so it naturally fills the space minus the p-2. Moved border/shadow here for cleaner rounding. */}
                <div className="relative h-full w-full overflow-hidden rounded-sm border border-border/50 shadow-sm">
                  <Image
                    src="/pain-section-1.png"
                    alt="spreadsheet"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-xl font-semibold text-foreground">
                  Spreadsheet overload
                </h3>
                <p className="my-4 text-lg text-muted-foreground">
                  Three tabs for commissions, two for payroll, one for jobs -
                  and none of them agree with each other
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="space-y-4">
              <Card className="aspect-video overflow-hidden p-2">
                <div className="relative h-full w-full overflow-hidden rounded-sm border border-border/50 shadow-sm">
                  <Image
                    src="/pain-section-2.png"
                    alt="spreadsheet"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-xl font-semibold text-foreground">
                  Hours lost every week
                </h3>
                <p className="my-4 text-lg text-muted-foreground">
                  You&apos;re manually reconciling job data, calculating splits,
                  and chasing down numbers instead of running your business.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="space-y-4">
              <Card className="aspect-video overflow-hidden p-2">
                <div className="relative h-full w-full overflow-hidden rounded-sm border border-border/50 shadow-sm">
                  <Image
                    src="/pain-section-3.png"
                    alt="spreadsheet"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </Card>
              <div className="sm:max-w-sm">
                <h3 className="text-xl font-semibold text-foreground">
                  Commission disputes
                </h3>
                <p className="my-4 text-lg text-muted-foreground">
                  Your techs don&apos;t trust the math. Neither do your
                  subcontractors. And you&apos;re not sure who&apos;s right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
