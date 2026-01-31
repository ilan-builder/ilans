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

    // Check title is visible (with emoji)
    await expect(page.getByText('אליקו')).toBeVisible();
    await expect(page.getByText('משחק מילים מטורף!')).toBeVisible();

    // Check both role buttons are visible
    await expect(page.getByText('מכשיר מסביר')).toBeVisible();
    await expect(page.getByText('מכשיר טיימר')).toBeVisible();

    // Check instructions button
    await expect(page.getByText('איך משחקים?')).toBeVisible();
  });

  test('main device: should create room and show room code', async ({ page }) => {
    await page.goto('/');

    // Select main device role
    await page.getByText('מכשיר מסביר').click();

    // Click create game button
    await page.getByText('צור משחק חדש').click();

    // Wait for room code to appear (4-digit number)
    await expect(page.getByText('קוד החדר')).toBeVisible({ timeout: 10000 });

    // Room code should be visible (look for 4-digit pattern in gradient text)
    const roomCodeElement = page.locator('.text-3xl.font-mono.gradient-text');
    await expect(roomCodeElement).toBeVisible();
    const roomCode = await roomCodeElement.textContent();
    expect(roomCode).toMatch(/^\d{4}$/);

    // Should show waiting for timer device
    await expect(page.getByText('ממתין לטיימר...').first()).toBeVisible();
  });

  test('timer device: should show join room screen', async ({ page }) => {
    await page.goto('/');

    // Select timer device role
    await page.getByText('מכשיר טיימר').click();

    // Should show join room screen
    await expect(page.getByText('הכניסו את קוד החדר')).toBeVisible();
    await expect(page.getByPlaceholder('0000')).toBeVisible();
    await expect(page.getByText('הצטרף למשחק')).toBeVisible();
  });

  test('timer device: should show error for invalid room code', async ({ page }) => {
    await page.goto('/');

    // Select timer device role
    await page.getByText('מכשיר טיימר').click();

    // Enter invalid room code
    await page.getByPlaceholder('0000').fill('9999');
    await page.getByText('הצטרף למשחק').click();

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

  test('should have stop game button on setup screen', async ({ page }) => {
    await page.goto('/');

    // Create a room
    await page.getByText('מכשיר מסביר').click();
    await page.getByText('צור משחק חדש').click();

    // Wait for setup screen
    await expect(page.getByText('קבוצות')).toBeVisible({ timeout: 10000 });

    // Should have stop game button (shows ✕ with title "סיים משחק")
    await expect(page.getByTitle('סיים משחק')).toBeVisible();

    // Click stop game
    await page.getByTitle('סיים משחק').click();

    // Should return to role selection
    await expect(page.getByText('מכשיר מסביר')).toBeVisible();
    await expect(page.getByText('מכשיר טיימר')).toBeVisible();
  });

  test('should show instructions modal', async ({ page }) => {
    await page.goto('/');

    // Click instructions button
    await page.getByText('איך משחקים?').click();

    // Modal should appear
    await expect(page.getByText('שני מכשירים')).toBeVisible();
    await expect(page.getByText('מהלך המשחק:')).toBeVisible();
    await expect(page.getByText('גניבה!')).toBeVisible();

    // Close modal
    await page.getByText('הבנתי, בואו נשחק!').click();

    // Modal should be closed
    await expect(page.getByText('מהלך המשחק:')).not.toBeVisible();
  });
});

test.describe('Two Device Flow', () => {
  test('timer should display seconds only (no minutes)', async ({ browser }) => {
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
    const roomCodeElement = mainPage.locator('.text-3xl.font-mono.gradient-text');
    const roomCode = await roomCodeElement.textContent();

    // Timer device: join room
    await timerPage.getByText('מכשיר טיימר').click();
    await timerPage.getByPlaceholder('0000').fill(roomCode!);
    await timerPage.getByText('הצטרף למשחק').click();

    // Wait for connection
    await expect(mainPage.getByText('טיימר מחובר ✓')).toBeVisible({ timeout: 10000 });

    // Setup teams
    const teamInputs = mainPage.locator('input[placeholder^="קבוצה"]');
    await teamInputs.nth(0).fill('קבוצה א');
    await teamInputs.nth(1).fill('קבוצה ב');

    // Start game
    await mainPage.getByText('התחל משחק!').click();

    // Wait for transition screen
    await expect(mainPage.getByText('מוכנים? יאללה!')).toBeVisible({ timeout: 10000 });

    // Start the turn
    await mainPage.getByText('מוכנים? יאללה!').click();

    // Wait for timer to appear on timer device
    await expect(timerPage.locator('.text-\\[30vw\\]')).toBeVisible({ timeout: 10000 });

    // Get the timer text
    const timerText = await timerPage.locator('.text-\\[30vw\\]').textContent();

    // Timer should be just a number (no colon for MM:SS format)
    expect(timerText).toMatch(/^\d{1,2}$/);
    expect(timerText).not.toContain(':');

    // Cleanup
    await mainContext.close();
    await timerContext.close();
  });

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
    const roomCodeElement = mainPage.locator('.text-3xl.font-mono.gradient-text');
    await expect(roomCodeElement).toBeVisible();
    const roomCode = await roomCodeElement.textContent();

    // Timer device: join room
    await timerPage.getByText('מכשיר טיימר').click();
    await timerPage.getByPlaceholder('0000').fill(roomCode!);
    await timerPage.getByText('הצטרף למשחק').click();

    // Timer device should show waiting screen
    await expect(timerPage.getByText('מחובר!')).toBeVisible({ timeout: 10000 });

    // Main device should show timer device connected
    await expect(mainPage.getByText('טיימר מחובר ✓')).toBeVisible({ timeout: 10000 });

    // Cleanup
    await mainContext.close();
    await timerContext.close();
  });
});
