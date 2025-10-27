import { test, expect } from '@playwright/test';

test.describe('Users Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in a real test, you'd set up proper auth
    await page.goto('/users');
  });

  test('should display users page', async ({ page }) => {
    // Should show page title
    await expect(page.locator('h1')).toContainText('Users');
    
    // Should show add user button
    await expect(page.locator('button:has-text("Add User")')).toBeVisible();
  });

  test('should show users list', async ({ page }) => {
    // Should show users table
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
    
    // Should show user cards
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount({ min: 0 });
  });

  test('should allow searching users', async ({ page }) => {
    // Fill search input
    await page.fill('input[placeholder*="Search users"]', 'john');
    
    // Should filter results
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount({ min: 0 });
  });

  test('should allow adding new user', async ({ page }) => {
    // Click add user button
    await page.click('button:has-text("Add User")');
    
    // Should show add user form
    await expect(page.locator('text=Add User')).toBeVisible();
    
    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="role"]', 'Customer');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=User created successfully')).toBeVisible();
  });

  test('should allow editing user', async ({ page }) => {
    // Click edit button on first user
    await page.click('button[data-testid="edit-user"]').first();
    
    // Should show edit form
    await expect(page.locator('text=Edit User')).toBeVisible();
    
    // Update name
    await page.fill('input[name="name"]', 'John Updated');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=User updated successfully')).toBeVisible();
  });

  test('should allow deleting user', async ({ page }) => {
    // Click delete button on first user
    await page.click('button[data-testid="delete-user"]').first();
    
    // Should show confirmation dialog
    await expect(page.locator('text=Are you sure?')).toBeVisible();
    
    // Confirm deletion
    await page.click('button:has-text("Delete")');
    
    // Should show success message
    await expect(page.locator('text=User deleted successfully')).toBeVisible();
  });
});
