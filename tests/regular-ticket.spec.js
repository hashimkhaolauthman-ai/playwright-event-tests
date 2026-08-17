import { test, expect } from '@playwright/test';

test('buy regular ticket for faaji nights lagos', async ({ page }) => {
  await page.goto('https://event-staging.getbookt.io/faaji-nights-lagos-1852');

  // Open the ticket modal
  await page.getByRole('button', { name: 'Buy ticket' }).click();

  // Find the exact "Regular" label, then walk up to its specific card
  const regularCard = page
    .getByText('Regular', { exact: true })
    .locator('xpath=ancestor::div[contains(@class, "rounded-[15px]")][1]');

  // Click "+" only within that specific card
  await regularCard.getByText('+', { exact: true }).click();

  // Fill required attendee details
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('hashimkhaolauthman@gmail.com');
  await page.getByRole('textbox', { name: 'Confirm Email' }).fill('hashimkhaolauthman@gmail.com');
  await page.getByRole('textbox', { name: 'Enter local number' }).fill('8143545037');
  await page.getByRole('textbox', { name: 'First name' }).fill('Rani');
  await page.getByRole('textbox', { name: 'Last name' }).fill('Babs');

  // Click RSVP (confirmed exact button name)
  await page.getByRole('button', { name: 'RSVP', exact: true }).click();

  // Confirm thank you page
  await expect(page.getByText('Thank You!', { exact: true })).toBeVisible();
});