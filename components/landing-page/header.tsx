"use client"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import { cn } from "@/lib/utils"

// public
import KlicktivLogo from "@/public/kt_logo_name.png"
import KlicktivLogoDark from "@/public/kt_logo_name_dark.png"

const menuItems = [
  { name: "Features", href: "/#features" },
  { name: "How It Works", href: "/#how" },
  { name: "Who It's For", href: "/#who" },
  { name: "FAQ's", href: "/#faqs" },
  { name: "Contact", href: "/#cta" },
  { name: "About us", href: "/#about-us" },
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-20 w-full transition-all duration-300",
          isScrolled &&
            "border-b border-border/60 bg-background/75 backdrop-blur-lg"
        )}
      >
        <div className="mx-auto max-w-5xl rounded-b-md px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex h-auto w-25 items-center space-x-2"
              >
                <Image
                  src={KlicktivLogo}
                  title="Go to landing page"
                  alt="Klicktiv"
                  width={1672}
                  height={941}
                  priority
                  className="block dark:hidden"
                />
                <Image
                  src={KlicktivLogoDark}
                  title="Go to landing page"
                  alt="Klicktiv"
                  width={1672}
                  height={941}
                  priority
                  className="hidden dark:block"
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
              </button>

              <div className="m-auto hidden size-fit pt-4 lg:block">
                <ul className="flex gap-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={item.href} className="text-base">
                          <span>{item.name}</span>
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border bg-background p-6 shadow-2xl shadow-foreground/10 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 pt-4 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href="/login">
                    <span>Login</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link
                    href="https://advancedvirtualstaff.com/booking"
                    target="_blank"
                  >
                    <span>Book a Demo</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                >
                  <Link
                    href="https://advancedvirtualstaff.com/booking"
                    target="_blank"
                  >
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
