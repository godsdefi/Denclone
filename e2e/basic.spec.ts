import { test, expect } from '@playwright/test';

test('basic navigation and interaction', async ({ page }) => {
  // Start from the homepage
  await page.goto('/');

  // Verify main navigation elements
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  await expect(page.getByTestId('app-navigation')).toBeVisible();

  // Check navigation to dashboard
  await page.getByRole('link', { name: /dashboard/i }).click();
  await expect(page.url()).toContain('/dashboard');
  await expect(page.getByText(/total profit/i)).toBeVisible();

  // Check navigation to opportunities
  await page.getByRole('link', { name: /opportunities/i }).click();
  await expect(page.url()).toContain('/opportunities');
  await expect(page.getByText(/arbitrage opportunities/i)).toBeVisible();

  // Test search functionality in opportunities
  await page.getByPlaceholder(/search by token/i).fill('ETH');
  await expect(page.getByText(/WETH/)).toBeVisible();
});

test('gas optimization meter interaction', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Verify the gas optimizer component
  await expect(page.getByText('Gas Optimizer')).toBeVisible();
  await expect(page.getByText('Standard')).toBeVisible();
  await expect(page.getByText('Optimized')).toBeVisible();

  // Wait for optimization animation
  await expect(page.getByText(/% SAVED/)).toBeVisible();
});

test('opportunity execution flow', async ({ page }) => {
  await page.goto('/opportunities');

  // Click on an opportunity
  await page.getByText(/arbitrage path/i).first().click();
  
  // Verify execution buttons are present
  await expect(page.getByRole('button', { name: /execute/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /simulate/i })).toBeVisible();
  
  // Check detailed metrics are shown
  await expect(page.getByText(/price impact/i)).toBeVisible();
  await expect(page.getByText(/execution details/i)).toBeVisible();
});