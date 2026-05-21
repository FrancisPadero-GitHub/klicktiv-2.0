import Image from "next/image"

export default function PainSection() {
  return (
    <section id="pain-section">
      <div className="bg-muted/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
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
          <div className="mt-5 grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <div className="space-y-3">
              <div className="mx-auto max-w-[18rem] overflow-hidden rounded-2xl border border-border/40 bg-transparent shadow-none sm:max-w-none">
                <Image
                  src="/pain-section-1.png"
                  alt="spreadsheet"
                  width={2816}
                  height={1536}
                  className="h-auto w-full object-cover object-top"
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
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

            <div className="space-y-3">
              <div className="mx-auto max-w-[18rem] overflow-hidden rounded-2xl border border-border/40 bg-transparent shadow-none sm:max-w-none">
                <Image
                  src="/pain-section-2.png"
                  alt="spreadsheet"
                  width={2816}
                  height={1536}
                  loading="lazy"
                  className="h-auto w-full object-cover object-top"
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
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

            <div className="space-y-3">
              <div className="mx-auto max-w-[18rem] overflow-hidden rounded-2xl border border-border/40 bg-transparent shadow-none sm:max-w-none">
                <Image
                  src="/pain-section-3.png"
                  alt="spreadsheet"
                  width={2816}
                  height={1536}
                  className="h-auto w-full object-cover object-top"
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
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
