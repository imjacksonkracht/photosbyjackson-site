// Full-page screenshots for visual review, written to screenshots/ (gitignored).
//   npm run screenshots
import { test } from "@playwright/test";

const pages = [
  ["home", "/"],
  ["work", "/work"],
  ["music", "/work/music"],
  ["project", "/work/hcgg-petty-theft"],
  ["about", "/about"],
  ["contact", "/contact"],
] as const;

for (const [name, url] of pages) {
  test(`screenshot ${name}`, async ({ page }, info) => {
    await page.goto(url);
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await page.screenshot({ path: `screenshots/${info.project.name}-${name}.png`, fullPage: true });
  });
}
