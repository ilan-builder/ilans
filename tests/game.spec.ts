import { test, expect } from '@playwright/test';

test.describe('Ilans Game', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display role selection screen', async ({ page }) => {
    await page.goto('/');

    // Check title is visible
    await expect(page.getByText('אילנס')).toBeVisible();
    await expect(page.getByText('משחק מילים בעברית')).toBeVisible();

    // Check both role buttons are visible
    await expect(page.getByText('מכשיר מסביר')).toBeVisible();
    await expect(page.getByText('מכשיר טיימר')).toBeVisible();
  });

  test('main device: should create room and show room code', async ({ page }) => {
    await page.goto('/');

    // Select main device role
    await page.getByText('מכשיר מסביר').click();

    // Click create game button
    await page.getByText('צור משחק חדש').click();

    // Wait for room code to appear (4-digit number)
    await expect(page.getByText('קוד החדר')).toBeVisible({ timeout: 10000 });

    // Room code should be visible (look for 4-digit pattern)
    const roomCodeElement = page.locator('.text-5xl.font-mono');
    await expect(roomCodeElement).toBeVisible();
    const roomCode = await roomCodeElement.textContent();
    expect(roomCode).toMatch(/^\d{4}$/);

    // Should show waiting for timer device
    await expect(page.getByText('ממתין למכשיר הטיימר')).toBeVisible();
  });

  test('timer device: should show join room screen', async ({ page }) => {
    await page.goto('/');

    // Select timer device role
    await page.getByText('מכשיר טיימר').click();

    // Should show join room screen
    await expect(page.getByText('הכניסו את קוד החדר')).toBeVisible();
    await expect(page.getByPlaceholder('0000')).toBeVisible();
    await expect(page.getByText('הצטרף')).toBeVisible();
  });

  test('timer device: should show error for invalid room code', async ({ page }) => {
    await page.goto('/');

    // Select timer device role
    await page.getByText('מכשיר טיימר').click();

    // Enter invalid room code
    await page.getByPlaceholder('0000').fill('9999');
    await page.getByText('הצטרף').click();

    // Should show error message
    await expect(page.getByText('חדר לא נמצא')).toBeVisible({ timeout: 5000 });
  });

  test('main device: setup screen should have team inputs', async ({ page }) => {
    await page.goto('/');

    // Select main device and create room
    await page.getByText('מכשיר מסביר').click();
    await page.getByText('צור משחק חדש').click();

    // Wait for setup screen
    await expect(page.getByText('קבוצות')).toBeVisible({ timeout: 10000 });

    // Should have 2 team input fields by default
    const teamInputs = page.locator('input[placeholder^="קבוצה"]');
    await expect(teamInputs).toHaveCount(2);

    // Should have duration options
    await expect(page.getByText('משך סיבוב')).toBeVisible();
    await expect(page.getByText("60ש'")).toBeVisible();

    // Should have difficulty options
    await expect(page.getByText('רמת קושי')).toBeVisible();
    await expect(page.getByText('קל')).toBeVisible();
    await expect(page.getByText('בינוני')).toBeVisible();
    await expect(page.getByText('קשה')).toBeVisible();

    // Should have target score options
    await expect(page.getByText('נקודות לניצחון')).toBeVisible();
  });

  test('main device: should be able to add teams', async ({ page }) => {
    await page.goto('/');

    // Select main device and create room
    await page.getByText('מכשיר מסביר').click();
    await page.getByText('צור משחק חדש').click();

    // Wait for setup screen
    await expect(page.getByText('קבוצות')).toBeVisible({ timeout: 10000 });

    // Click add team button
    await page.getByText('+ הוסף קבוצה').click();

    // Should now have 3 team inputs
    const teamInputs = page.locator('input[placeholder^="קבוצה"]');
    await expect(teamInputs).toHaveCount(3);
  });

  test('UI elements should not overflow on mobile', async ({ page }) => {
    await page.goto('/');

    // Check no horizontal scrollbar
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // Select main device
    await page.getByText('מכשיר מסביר').click();
    await page.getByText('צור משחק חדש').click();

    // Wait for setup screen and check overflow again
    await expect(page.getByText('קבוצות')).toBeVisible({ timeout: 10000 });

    const hasHorizontalScrollAfter = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScrollAfter).toBe(false);
  });
});

test.describe('Two Device Flow', () => {
  test('main and timer device should sync via room code', async ({ browser }) => {
    // Create two browser contexts (simulating two devices)
    const mainContext = await browser.newContext();
    const timerContext = await browser.newContext();

    const mainPage = await mainContext.newPage();
    const timerPage = await timerContext.newPage();

    // Clear storage
    await mainPage.goto('https://alias-2.vercel.app');
    await mainPage.evaluate(() => localStorage.clear());
    await mainPage.reload();

    await timerPage.goto('https://alias-2.vercel.app');
    await timerPage.evaluate(() => localStorage.clear());
    await timerPage.reload();

    // Main device: create room
    await mainPage.getByText('מכשיר מסביר').click();
    await mainPage.getByText('צור משחק חדש').click();

    // Wait for room code
    await expect(mainPage.getByText('קוד החדר')).toBeVisible({ timeout: 10000 });
    const roomCodeElement = mainPage.locator('.text-5xl.font-mono');
    const roomCode = await roomCodeElement.textContent();

    // Timer device: join room
    await timerPage.getByText('מכשיר טיימר').click();
    await timerPage.getByPlaceholder('0000').fill(roomCode!);
    await timerPage.getByText('הצטרף').click();

    // Timer device should show waiting screen
    await expect(timerPage.getByText('מחובר לחדר')).toBeVisible({ timeout: 10000 });

    // Main device should show timer device connected
    await expect(mainPage.getByText('מכשיר הטיימר מחובר')).toBeVisible({ timeout: 10000 });

    // Cleanup
    await mainContext.close();
    await timerContext.close();
  });
});
