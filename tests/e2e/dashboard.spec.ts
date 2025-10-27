import { test, expect } from '@playwright/test';

test.describe('Back Office Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in a real test, you'd set up proper auth
    await page.goto('/dashboard');
  });

  test('should display dashboard with KPIs', async ({ page }) => {
    // Should show dashboard title
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Should show KPI cards
    await expect(page.locator('text=Total Bookings')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Conversion Rate')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
  });

  test('should display charts', async ({ page }) => {
    // Should show booking trends chart
    await expect(page.locator('text=Booking Trends')).toBeVisible();
    
    // Should show revenue by provider chart
    await expect(page.locator('text=Revenue by Provider')).toBeVisible();
  });

  test('should show provider performance table', async ({ page }) => {
    // Should show provider performance section
    await expect(page.locator('text=Provider Performance')).toBeVisible();
    
    // Should show table headers
    await expect(page.locator('th:has-text("Provider")')).toBeVisible();
    await expect(page.locator('th:has-text("Response Time")')).toBeVisible();
    await expect(page.locator('th:has-text("Success Rate")')).toBeVisible();
  });

  test('should allow refresh and export', async ({ page }) => {
    // Click refresh button
    await page.click('button:has-text("Refresh")');
    
    // Should show loading state
    await expect(page.locator('[data-testid="loading"]')).toBeVisible();
    
    // Click export button
    await page.click('button:has-text("Export")');
    
    // Should trigger download (in real implementation)
    // await expect(page.locator('text=Export started')).toBeVisible();
  });
});
