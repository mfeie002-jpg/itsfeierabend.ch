import { test, expect } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  installEssentialConsent,
  waitForHydratedPage,
} from "./site-contract";

test.describe("release visual evidence", () => {
  test("captures the German homepage at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await installEssentialConsent(page);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForHydratedPage(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Weniger Administration. Bessere Abläufe. Ihr persönlicher KI-Partner.",
    );
    await assertNoHorizontalOverflow(page);

    await page.screenshot({
      path: "test-results/visual-evidence/home-desktop-1440.png",
      fullPage: true,
    });
  });

  test("captures the German audit entry at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installEssentialConsent(page);

    await page.goto("/audit", { waitUntil: "domcontentloaded" });
    await waitForHydratedPage(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Zuerst die Website. Dann der Geschäftskontext.",
    );
    await assertNoHorizontalOverflow(page);

    await page.screenshot({
      path: "test-results/visual-evidence/audit-mobile-390.png",
      fullPage: true,
    });
  });
});
