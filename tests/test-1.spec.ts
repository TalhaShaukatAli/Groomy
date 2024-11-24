import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Example@gmail.com').click();
  await page.getByPlaceholder('Example@gmail.com').fill('henricksonethan@gmail.com');
  await page.getByPlaceholder('Example@gmail.com').press('Tab');
  await page.getByPlaceholder('ABC123').fill('123123');
  await page.getByPlaceholder('ABC123').press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Customers' }).click();
  await page.getByRole('link', { name: 'Add New Customer >' }).click();
  await page.locator('input[name="firstName"]').fill('q');
  await page.locator('input[name="lastName"]').fill('q');
  await page.locator('input[name="phone"]').fill('q');
  await page.locator('input[name="email"]').fill('d');
  await page.locator('input[name="street"]').fill('f');
  await page.locator('input[name="city"]').fill('d');
  await page.locator('input[name="state"]').fill('d');
  await page.getByRole('spinbutton').fill('156');
  await page.getByRole('button', { name: 'Create Customer' }).click();
});