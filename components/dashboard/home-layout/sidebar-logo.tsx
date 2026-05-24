import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

// public
import KlicktivLogoLightMode from "@/public/kt_logo_name.png"
import KlicktivLogoDarkMode from "@/public/kt_logo_name_dark.png"
import KlicktivIconLightMode from "@/public/icon.png"
import KlicktivIconDarkMode from "@/public/icon_dark.png"

interface SidebarLogoIconProps {
  collapsed?: boolean
}

function SidebarLogoIcon({ collapsed }: SidebarLogoIconProps) {
  return (
    <>
      {/* Logo on the sidebar */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border transition-all duration-100",
          "justify-center px-2"
        )}
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          {/* Icon only (for collapsed sidebar) */}
          <div
            className={cn(
              "absolute flex items-center justify-center transition-all duration-200 ease-in-out",
              collapsed
                ? "h-15 w-15 scale-100 opacity-100"
                : "pointer-events-none h-8 w-8 scale-90 opacity-0"
            )}
          >
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={KlicktivIconLightMode}
                  alt="Klicktiv Logo"
                  width={2048}
                  height={2048}
                  className="dark:hidden"
                  priority
                  quality={100}
                />
                <Image
                  src={KlicktivIconDarkMode}
                  alt="Klicktiv Logo"
                  width={2048}
                  height={2048}
                  className="hidden dark:block"
                  priority
                  quality={100}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Press <Kbd>D</Kbd> to toggle between light & dark mode
              </TooltipContent>
            </Tooltip>
          </div>
          {/* Full logo (icon + text) */}
          <div
            className={cn(
              // for some reason if you remove this pt-2 the logo will corner so much up top and do not center, and no, items and justify center
              // wont do either
              "absolute flex pt-2 transition-all duration-200 ease-in-out",
              !collapsed
                ? "h-auto w-25 scale-90 opacity-100"
                : "pointer-events-none h-auto w-25 scale-90 opacity-0"
            )}
          >
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={KlicktivLogoLightMode}
                  alt="Klicktiv Logo"
                  width={1672}
                  height={941}
                  className="dark:hidden"
                  priority
                  quality={100}
                />
                <Image
                  src={KlicktivLogoDarkMode}
                  alt="Klicktiv Logo"
                  width={1672}
                  height={941}
                  className="hidden dark:block"
                  priority
                  quality={100}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Press <Kbd>D</Kbd> to toggle between light & dark mode
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarLogoIcon
