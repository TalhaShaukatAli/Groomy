import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Example@gmail.com').click();
  await page.getByPlaceholder('Example@gmail.com').fill('henricksonethan@gmail.com');
  await page.getByPlaceholder('Example@gmail.com').press('Tab');
  await page.getByPlaceholder('ABC123').fill('123123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Customers' }).click();
  await page.getByRole('link', { name: 'View' }).first().click();
});