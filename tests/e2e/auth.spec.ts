import { test, expect } from '@playwright/test';

test.describe('Back Office Authentication', () => {
  test('should complete login and account selection flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Check if we're on the login page
    await expect(page.locator('h2')).toContainText('Sign In');
    
    // Fill in credentials
    await page.fill('input[type="email"]', 'admin@taxidia.com');
    await page.fill('input[type="password"]', 'password');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should redirect to account selection
    await expect(page).toHaveURL(/select-account/);
    await expect(page.locator('h2')).toContainText('Select Account');
    
    // Select an account
    await page.click('button:has-text("Continue to Dashboard")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without credentials
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Email Address')).toBeVisible();
    await expect(page.locator('text=Password')).toBeVisible();
  });

  test('should handle login errors', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Login failed')).toBeVisible();
  });
});
