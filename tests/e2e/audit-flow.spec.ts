import { test, expect } from "@playwright/test";

// Smoke test for the complete free-audit flow.
// - Loads the public /audit form
// - Fills every required field
// - Mocks the create-audit edge function so CI does not touch prod
// - Confirms the form redirects to a private report URL that renders

test("free audit flow: submit → redirect → report skeleton", async ({ page }) => {
  const fakeToken = "00000000-0000-4000-8000-000000000001";
  const corsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
  };

  // Keep the smoke test hermetic while exercising the production form path.
  // The real widget is external, but the form still receives a valid token.
  await page.route("https://challenges.cloudflare.com/turnstile/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `window.turnstile = {
        render(_element, options) {
          queueMicrotask(() => options.callback("e2e-turnstile-token"));
          return "e2e-widget";
        },
        reset() {},
        remove() {},
      };`,
    });
  });

  // Intercept the create-audit invocation and return a successful response.
  await page.route("**/functions/v1/create-audit**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        token: fakeToken,
        redirect_path: `/audit/r/${fakeToken}`,
      }),
    });
  });

  // Intercept the report fetch so the result page has something to render.
  await page.route("**/functions/v1/get-audit-report-v0**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({
        status: "ready",
        overall_score: 72,
        category_scores: { technical: 80, content: 70, trust: 65, conversion: 60, automation: 90 },
        top_actions: [],
        signals: [],
        website_url: "https://example.com",
      }),
    });
  });

  await page.goto("/audit");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByLabel(/Website-URL|Website URL/i).fill("https://example.com");
  await page.getByLabel(/Vorname|First name/i).fill("Test");
  await page.getByLabel(/Nachname|Last name/i).fill("Runner");
  await page.getByRole("textbox", { name: /E-Mail-Adresse|Email/i }).fill("qa@example.com");

  // The processing consent checkbox is the first checkbox.
  await page.getByRole("checkbox").first().check();

  await page.getByRole("button", { name: /Audit starten|Start audit/i }).click();

  await page.waitForURL(new RegExp(`/audit/r/${fakeToken}`));
  await expect(page.locator("body")).toContainText(/72|Score|Report/i);
});
