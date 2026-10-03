"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { InternalLink } from "@/config/types";
import { homePage } from "@/content/home";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { renderFixedDocument } from "@/lib/fixed-template/render";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  if (!isFixedTemplate()) return null;
  const skin = siteSkin();
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = path === "/" ? "home" : "inner";
  const currentSlug = page === "inner" ? path.split("/").filter(Boolean).at(-1) ?? "" : "";
  const nav = links
    .filter((link) => link.slug.replace(/^\/+|\/+$/g, ""))
    .map((link) => ({
      slug: link.slug.replace(/^\/+|\/+$/g, ""),
      label: link.label,
      href: routePath(link.slug),
    }));
  if (skin === "resource") {
    return (
      <header className="resource-site-header">
        <div className="resource-site-header__inner">
          <Link href="/" className="resource-site-header__brand" aria-label="Ride A Pet home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetPath(siteConfig.assets.logo)} alt="Ride A Pet" />
            <span>{siteConfig.game.name || siteConfig.shortName}</span>
          </Link>
          <nav className="resource-site-header__nav" aria-label="Primary navigation">
            {nav.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className={item.slug === currentSlug ? "is-active" : undefined}
                aria-current={item.slug === currentSlug ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    );
  }
  const rendered = renderFixedDocument({
    skin,
    page,
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug,
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: page === "home" ? assetPath(siteConfig.assets.cover) : null,
    heading: page === "home" ? homePage.hero.heading : null,
    lead: page === "home" ? homePage.hero.lead : null,
  });
  return <div dangerouslySetInnerHTML={{ __html: rendered.chrome }} />;
}
