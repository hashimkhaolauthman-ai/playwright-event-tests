import { test, expect } from "@playwright/test";

test.describe('Bookt Game Night event', () => {

	test('shows error toast when paid ticket has invalid email input', async ({ page }) => {
		await page.goto('https://event-staging.getbookt.io/game-night-15680');

		const buyTicketButton = page.getByText('Buy ticket');
		await buyTicketButton.waitFor({ state: 'visible' });
		await buyTicketButton.click();

		const friendCard = page.locator('div')
			.filter({ hasText: 'Friend' })
			.filter({ hasText: 'Get your hands on' })
			.last();
		await friendCard.getByText('+').click();

		await page.locator('img[alt="Paystack logo"]').click();

		await page.getByPlaceholder('Email', { exact: true }).waitFor({ state: 'visible', timeout: 20000 });
		await page.getByPlaceholder('Email', { exact: true }).fill('notarealemail');
		await page.getByPlaceholder('Confirm Email').fill('notarealemail');
		await page.getByPlaceholder('First name').fill('Test');
		await page.getByPlaceholder('Last name').fill('User');
		await page.getByPlaceholder('Enter local number').fill('8012345678');

		await Promise.all([
			page.waitForSelector('.Toastify__toast', { timeout: 8000 }).catch(() => null),
			page.getByText('Continue With Paystack').click(),
		]);

		const toastText = await page.locator('.Toastify').innerText().catch(() => '');
		console.log('Toast said:', toastText);

		expect(toastText.length).toBeGreaterThan(0);
		await expect(page).toHaveURL(/game-night-15680/);
	});

	test('heart icon count increments on click and decrements on unclick', async ({ page }) => {
		await page.goto('https://event-staging.getbookt.io/game-night-15680');

		const likesCount = page.getByLabel('Likes Count');
		const likeContainer = page.locator('div').filter({ has: likesCount }).last();
		const heartButton = likeContainer.locator('button');

		const initialText = await likesCount.innerText();
		const initialCount = parseInt(initialText, 10);

		await heartButton.click();
		await expect(likesCount).toHaveText(`${initialCount + 1}likes`);

		await heartButton.click();
		await expect(likesCount).toHaveText(`${initialCount}likes`);
	});

});