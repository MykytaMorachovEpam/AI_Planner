import { test, expect } from '@playwright/test';

test('homepage has Task Planner title and heading', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Task Planner/i);
  await expect(page.getByRole('heading', { name: /Task Planner/i })).toBeVisible();
});
