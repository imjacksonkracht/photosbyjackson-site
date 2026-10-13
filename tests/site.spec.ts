import { expect, test, type Page } from "@playwright/test";
import { allProjects, categoryOrder, heroSlides, projects } from "../content/projects";

import { readFileSync, existsSync } from "node:fs";

const routes = ["/", "/work", ...categoryOrder.map((c) => `/work/${c}`), ...projects.map((p) => `/work/${p.slug}`), "/about", "/contact"];

async function settle(page: Page) {
  // Scroll the whole page so lazy images load and in-view reveals fire.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
  await page.waitForLoadState("networkidle");
}

for (const route of routes) {
  test(`${route} renders without errors, broken images, or overflow`, async ({ page }) => {
    const errors: string[] = [];
    const failed: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));

    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await settle(page);

    const broken = await page.evaluate(() =>
      [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    );
    expect(broken).toEqual([]);
    expect(failed).toEqual([]);
    expect(errors).toEqual([]);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    const missingAlt = await page.locator("img:not([alt]), img[alt='']").count();
    expect(missingAlt).toBe(0);
  });
}

test("every photo referenced by the site exists as public files", async () => {
  const generated = JSON.parse(readFileSync("content/photos.generated.json", "utf8")) as Record<string, { path: string }>;
  const referenced = new Set<string>();
  for (const p of allProjects) {
    referenced.add(p.cover);
    p.sequence.forEach((r) => ("photos" in r ? r.photos : [r.photo]).forEach((id) => referenced.add(id)));
  }
  for (const id of referenced) expect(generated[id], id).toBeTruthy();
  for (const [id, g] of Object.entries(generated)) {
    for (const suffix of ["-640.avif", "-1280.avif", "-2048.avif", ".webp"]) {
      expect(existsSync(`public${g.path}${suffix}`), `${id}${suffix}`).toBe(true);
    }
    expect(g.path, id).toMatch(/^\/(photos|images)\/[a-z0-9-]+\/[a-z0-9-]+$/);
  }
  for (const p of projects) expect(existsSync(`public/og/${p.slug}.jpg`), p.slug).toBe(true);
});

test("internal links all resolve", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ["/", "/work", "/about", "/contact"]) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!));
    hrefs.forEach((h) => seen.add(h.split("#")[0]));
  }
  for (const href of seen) {
    const res = await request.get(href, { maxRedirects: 0 });
    expect(res.status(), href).toBe(200);
  }
});

test("old Canva URL redirects to the portfolio, any capitalization", async ({ request }) => {
  for (const path of ["/portfolio", "/Portfolio", "/PORTFOLIO", "/portfolio/concerts"]) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status(), path).toBe(308);
    expect(res.headers().location, path).toMatch(/\/work$/);
  }
  const tagged = await request.get("/portfolio?ref=ig", { maxRedirects: 0 });
  expect(tagged.headers().location).toMatch(/\/work\?ref=ig$/);
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://photosbyjackson.org/work/hcgg-petty-theft");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://photosbyjackson.org/sitemap.xml");
});

test("category filter updates the list and the URL", async ({ page }) => {
  await page.goto("/work");
  const filters = page.getByRole("navigation", { name: "Filter work by category" });
  await expect(filters.getByRole("listitem")).toHaveText(["All", "Live Music", "Events", "Portraits"]);
  await filters.getByRole("link", { name: "Events" }).click();
  await expect(page).toHaveURL(/\/work\/events$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Events");
  const projectsList = page.getByRole("region", { name: "Projects" });
  await expect(projectsList.getByRole("heading", { level: 2, name: "Gator Grill Club" })).toBeVisible();
  await expect(projectsList.getByRole("heading", { level: 2, name: "Gator Gallop" })).toBeVisible();
  await expect(projectsList.getByRole("heading", { level: 2, name: "Swamp Fest" })).toHaveCount(0);
  await filters.getByRole("link", { name: "Portraits" }).click();
  await expect(page).toHaveURL(/\/work\/portraits$/);
  await expect(projectsList.getByRole("heading", { level: 2, name: /General Body Headshots/ })).toBeVisible();
  await expect(projectsList.getByRole("heading", { level: 2, name: /Recruitment Portraits/ })).toBeVisible();
  await filters.getByRole("link", { name: "Live Music" }).click();
  await expect(page).toHaveURL(/\/work\/music$/);
  await expect(projectsList.getByRole("heading", { level: 2, name: /Drake & J\. Cole/ })).toBeVisible();
  await expect(projectsList.getByRole("heading", { level: 2, name: "Gator Jam" })).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/work\/portraits$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Portraits & Headshots");
});

test("sports is gone from navigation and its URLs redirect", async ({ page, request }) => {
  for (const [from, to] of [
    ["/work/sports", /\/work$/],
    ["/work/gator-gallop-2026", /\/work\/gator-gallop$/],
    ["/work/its-all-a-blur-tour", /\/work\/drake-j-cole-its-all-a-blur-tour$/],
    ["/work/gator-jam", /\/work\/music$/],
    ["/work/headshots", /\/work\/florida-cicerones-general-body-headshots$/],
    ["/work/florida-cicerones", /\/work\/florida-cicerones-recruitment-portraits$/],
  ] as const) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect([307, 308], from).toContain(res.status());
    expect(res.headers().location, from).toMatch(to);
  }
  await page.goto("/");
  await expect(page.getByRole("link", { name: /^Sports/ })).toHaveCount(0);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/work/sports");
  expect(sitemap).not.toContain("gator-gallop-2026");
  expect(sitemap).not.toContain("/work/gator-jam");
});

test("about page shows the behind-the-scenes photo", async ({ page }) => {
  await page.goto("/about");
  const img = page.getByRole("img", { name: /Jackson Kracht raises a camera/ });
  await expect(img).toBeVisible();
  await expect(img).toHaveJSProperty("complete", true);
  expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  expect(await img.evaluate((i: HTMLImageElement) => i.currentSrc)).toContain("/images/about/jackson-behind-the-scenes");
});

test("lightbox opens, navigates by keyboard, and returns focus", async ({ page }) => {
  await page.goto("/work/hcgg-petty-theft");
  const first = page.getByRole("button", { name: /Open photo 1 of 10/ });
  await first.click();
  const dialog = page.getByRole("dialog", { name: /photo viewer/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/^01/)).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText(/^02/)).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText(/^10/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
});

test("mobile menu opens, traps focus, and closes", async ({ page }, info) => {
  test.skip(!info.project.name.startsWith("mobile"), "menu is shown below 768px");
  await page.goto("/");
  const button = page.getByRole("button", { name: "Menu" });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  const close = page.getByRole("button", { name: "Close" });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("dialog", { name: "Site menu" });
  await expect(menu.getByRole("link", { name: "Work" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await button.click();
  await menu.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(menu).toBeHidden();
});

test.describe("contact form", () => {
  test("shows inline errors and focuses the first invalid field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText("Enter your email so I can reply.")).toBeVisible();
    await expect(page.getByText("Choose what you’d like photographed.")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeFocused();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Email").blur();
    await expect(page.getByText("Enter an email like name@example.com.")).toBeVisible();
  });

  async function fill(page: Page) {
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("What should I photograph?").selectOption("music");
    await page.getByLabel("Location").fill("Test venue");
    await page.getByLabel("Details").fill("A synthetic test inquiry for an evening show.");
  }

  test("reports that delivery isn't configured instead of claiming success", async ({ page }) => {
    await page.goto("/contact");
    await fill(page);
    await page.waitForTimeout(3200); // past the minimum time-on-page spam check
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.locator("form [role=alert]")).toContainText("Online booking isn’t connected yet");
    await expect(page.getByText("Inquiry sent.")).toHaveCount(0);
  });

  test("shows the success state when the API accepts the inquiry", async ({ page }) => {
    await page.route("/api/contact", (route) => route.fulfill({ json: { ok: true } }));
    await page.goto("/contact");
    await fill(page);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByRole("status")).toContainText("Inquiry sent.");
    await expect(page.getByRole("status")).toContainText("test@example.com");
  });

  test("API rejects invalid payloads", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "", email: "x", type: "nope", message: "", startedAt: Date.now() - 10_000 },
    });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.errors)).toEqual(expect.arrayContaining(["name", "email", "type", "message"]));
  });
});

test("reduced motion disables the hero entrance", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const duration = await page.locator(".hero-settle").evaluate((el) => getComputedStyle(el).animationDuration);
  expect(parseFloat(duration)).toBeLessThan(0.01);
  await context.close();
});

test("public pages show no exposure captions or photo counts", async ({ page }) => {
  for (const route of ["/", "/work", "/work/hcgg-petty-theft", "/about"]) {
    await page.goto(route);
    const text = await page.locator("main").innerText();
    expect(text, route).not.toMatch(/ISO \d|ƒ\/\d|1\/\d+s/);
    expect(text, route).not.toMatch(/\d+ photo(graph)?s/i);
  }
});

test("hero slideshow crossfades without shifting layout", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  const slides = page.locator("[data-slide]");
  await expect(slides).toHaveCount(heroSlides.length);
  await expect(slides.nth(0)).toHaveAttribute("data-active", "");
  const before = await page.locator("#hero-title").boundingBox();
  await page.clock.runFor(7600);
  await expect(slides.nth(1)).toHaveAttribute("data-active", "", { timeout: 5000 });
  await expect(slides.nth(0)).not.toHaveAttribute("data-active", "");
  const after = await page.locator("#hero-title").boundingBox();
  expect(after).toEqual(before);
});

test("hero stays on the first slide with reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.clock.install();
  await page.goto("/");
  await page.clock.runFor(16000);
  await expect(page.locator("[data-slide]").nth(0)).toHaveAttribute("data-active", "");
  await context.close();
});

test("footer contact link opens the contact form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("button", { name: "Send inquiry" })).toBeVisible();
});
