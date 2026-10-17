import { footerNav, footerUtilityBar, footerBottomRail } from "@/data/nav";
import { NavLink } from "@/components/site/nav-link";

/**
 * Site footer — shared across every public surface.
 *
 * White background + dark text — explicit Tailwind colors (not CSS vars)
 * so the footer renders identically on both the dark marketing landing
 * and the light help center pages. The marketing page's full-bleed
 * video background stops where the footer starts.
 *
 * Layout (top → bottom):
 *   1. Product image (hangs left) + six-column nav grid
 *   2. Musicosy logo (right-aligned, masked adnote-logo.png in --accent)
 *   3. Utility bar (6 quick-access links)
 *   4. Bottom rail (© 2026 Musicosy Corp. + 5 legal links + English)
 */
export function SiteFooter() {
  return (
    <footer
      className="relative z-10 mt-auto border-t border-neutral-200 bg-white text-neutral-900"
      style={{ "--accent": "oklch(0.16 0.008 60)" } as React.CSSProperties}
    >
      {/* Product image + six-column nav grid.
          Image hangs left (shrink-0), grid fills the rest.
          Both the image and the footer bg are white so there's no gray
          flash on load — the img element gets bg-white to match. */}
      <div className="w-full px-6 py-12 lg:px-10">
        <div className="flex gap-10">
          {/* Product image — hangs left */}
          <div className="hidden shrink-0 lg:block lg:bg-white">
            <img
              src="/footer-bg.png"
              alt="Musicosy headphones"
              className="h-40 w-auto bg-white object-contain"
              loading="eager"
            />
          </div>

          {/* Six-column nav grid */}
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4 xl:gap-x-6">
            {footerNav.map((group) => (
              <div key={group.label + group.path}>
                <NavLink
                  href={group.path}
                  className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-accent"
                >
                  {group.label}
                </NavLink>
                <ul className="mt-4 space-y-2.5">
                  {(group.children ?? []).map((child) => (
                    <li key={child.label + child.path}>
                      <NavLink
                        href={child.path}
                        className="text-sm text-neutral-700 transition-colors hover:text-accent"
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo — right-aligned, above the utility bar */}
      <div className="w-full px-6 pb-6 lg:px-10">
        <div className="flex justify-end">
          <div
            role="img"
            aria-label="Musicosy"
            className="h-9 w-[150px]"
            style={{
              backgroundColor: "var(--accent)",
              WebkitMaskImage: "url('/adnote-logo.png')",
              maskImage: "url('/adnote-logo.png')",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "right center",
              maskPosition: "right center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
        </div>
      </div>

      {/* Utility bar — 6 quick-access links */}
      <div className="border-t border-neutral-200 px-6 py-4 lg:px-10">
        <nav
          aria-label="Footer utility"
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          {footerUtilityBar.map((item) => (
            <NavLink
              key={item.label + item.path}
              href={item.path}
              className="text-xs font-medium uppercase tracking-wider text-neutral-500 transition-colors hover:text-accent"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom rail — © 2026 Musicosy Corp. + 5 legal links + English */}
      <div className="border-t border-neutral-200 px-6 py-5 lg:px-10">
        <div className="flex flex-col gap-3 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Musicosy Corp.</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {footerBottomRail.map((item) => (
              <NavLink
                key={item.label + item.path}
                href={item.path}
                className="transition-colors hover:text-neutral-900"
              >
                {item.label}
              </NavLink>
            ))}
            <span className="cursor-pointer transition-colors hover:text-neutral-900">English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
