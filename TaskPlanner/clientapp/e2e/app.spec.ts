<<<<<<< HEAD
import { test, expect } from '@playwright/test';

test('homepage has Task Planner title and heading', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Task Planner/i);
  await expect(page.getByRole('heading', { name: /Task Planner/i })).toBeVisible();
}); 
=======
 
>>>>>>> b2d6a39 (chore: add untracked E2E test file app.spec.ts)
