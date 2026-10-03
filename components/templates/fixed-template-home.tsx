import { NativeBanner } from "@/components/integrations/native-banner";
import { ResponsiveBanner } from "@/components/integrations/responsive-banner";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { enabledCorePages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function ResourceHome({ home, entries }: { home: HomePageDefinition; entries: Array<{ href: string; title: string; text: string }> }) {
  return (
    <main className="resource-home-main">
      <section className="resource-home-hero">
        <div className="resource-home-hero__copy">
          <p className="resource-home-hero__eyebrow">ROBLOX GUIDE HUB</p>
          <h1>{home.hero.heading}</h1>
          <p className="resource-home-hero__lead">{home.hero.lead}</p>
          {home.hero.primaryLink ? <a className="resource-home-hero__cta" href={routePath(home.hero.primaryLink.slug)}>{home.hero.primaryLink.label}</a> : null}
        </div>
        <div className="resource-home-hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(siteConfig.assets.cover)} alt="Ride A Pet Roblox gameplay artwork" />
        </div>
      </section>

      <ResponsiveBanner />

      <section className="resource-home-guides" aria-labelledby="guide-links-title">
        <div className="resource-home-guides__heading">
          <p>START HERE</p>
          <h2 id="guide-links-title">Explore the guides</h2>
        </div>
        <div className="resource-guide-grid">
          {entries.map((entry) => <a key={entry.href} href={entry.href}><strong>{entry.title}</strong><span>{entry.text}</span></a>)}
        </div>
      </section>

      <NativeBanner />

      <div className="resource-home-content" dangerouslySetInnerHTML={{ __html: supplement(home) }} />
    </main>
  );
}

function supplement(home: HomePageDefinition): string {
  const sections = home.sections.map((section) => {
    const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
    const intro = section.intro ? `<p>${esc(section.intro)}</p>` : "";
    const table = section.table
      ? `<div class="table-wrap"><table><caption>${esc(section.table.caption)}</caption><thead><tr>${section.table.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
      : "";
    const subsections = (section.subsections ?? []).map((subsection) => `<section><h3>${esc(subsection.heading)}</h3>${subsection.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}${subsection.bullets?.length ? `<ul>${subsection.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>` : ""}</section>`).join("");
    const bullets = section.bullets?.length ? `<ul>${section.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>` : "";
    const steps = section.steps?.length ? `<ol>${section.steps.map((step) => `<li><b>${esc(step.heading)}</b> ${esc(step.description)}</li>`).join("")}</ol>` : "";
    const links = section.links?.length ? `<ul>${section.links.map((link) => `<li><a href="${esc(routePath(link.slug))}">${esc(link.label)}</a>${link.description ? ` — ${esc(link.description)}` : ""}</li>`).join("")}</ul>` : "";
    return `<section id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${table}${subsections}${bullets}${steps}${links}</section>`;
  }).join("");
  return sections;
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = enabledCorePages.map((page) => ({
    href: routePath(page.slug),
    title: page.navLabel,
    text: page.description,
  }));
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    supplementHtml: supplement(home),
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      {skin === "resource" ? <ResourceHome home={home} entries={entries} /> : <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />}
      {home.faq.length ? (
        <div className="site-container"><Faq items={home.faq} /></div>
      ) : null}
    </>
  );
}
