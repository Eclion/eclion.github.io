const { test, expect } = require('@playwright/test');

// Fail any test during which a JS error is thrown on the page.
test.beforeEach(({ page }) => {
    page.on('pageerror', (error) => {
        throw new Error('Page error: ' + error.message);
    });
});

test.describe('home page', () => {
    test('renders name, subtext and links', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1.title')).toHaveText('William Deveaux');
        await expect(page.locator('.home-page .subtext')).toContainText('DevOps/Site reliability engineer');
        await expect(page.locator('.links a[href="#cv"]')).toBeVisible();
    });

    test('footer credits Claude', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.global-footer')).toContainText('Partly vibed with Claude');
        const icon = page.locator('.footer-icon');
        await expect(icon).toBeVisible();
        expect(await icon.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
    });

    test('Resume link opens the CV experiences section', async ({ page }) => {
        await page.goto('/');
        await page.click('.links a[href="#cv"]');
        await expect(page).toHaveURL(/#cv\/experiences$/);
        await expect(page.locator('#section-experiences')).toBeVisible();
    });
});

test.describe('routing', () => {
    test('deep links open the right section', async ({ page }) => {
        for (const section of ['skills', 'education', 'languages']) {
            await page.goto('/#cv/' + section);
            await expect(page.locator('#section-' + section)).toBeVisible();
            await expect(page.locator('.nav-btn[data-section="' + section + '"]')).toHaveClass(/active/);
        }
    });

    test('#cv normalizes to #cv/experiences', async ({ page }) => {
        await page.goto('/#cv');
        await expect(page).toHaveURL(/#cv\/experiences$/);
        await expect(page.locator('#section-experiences')).toBeVisible();
    });

    test('unknown hash falls back to home', async ({ page }) => {
        await page.goto('/#nonsense');
        await expect(page.locator('#page-home')).toBeVisible();
        await expect(page.locator('#page-cv')).toBeHidden();
    });

    test('unknown experience id falls back to home', async ({ page }) => {
        await page.goto('/#cv/experience/doesNotExist');
        await expect(page.locator('#page-home')).toBeVisible();
    });

    test('browser back returns to the previous section', async ({ page }) => {
        await page.goto('/#cv/experiences');
        await page.click('.experience-item');
        await expect(page.locator('#section-experience-detail')).toBeVisible();
        await page.goBack();
        await expect(page.locator('#section-experiences')).toBeVisible();
    });

    test('back link returns home', async ({ page }) => {
        await page.goto('/#cv/experiences');
        await page.click('.back-link');
        await expect(page.locator('#page-home')).toBeVisible();
    });
});

test.describe('cv content', () => {
    test('experiences list shows every experience', async ({ page }) => {
        await page.goto('/#cv/experiences');
        const items = page.locator('.experience-item');
        await expect(items).toHaveCount(4);
        await expect(items.first()).toContainText('DevOps/Site Reliability Engineer');
    });

    test('experience detail renders body and company link', async ({ page }) => {
        await page.goto('/#cv/experiences');
        await page.click('.experience-item:first-child');
        await expect(page).toHaveURL(/#cv\/experience\/sreBatch$/);
        await expect(page.locator('.experience-body')).toContainText('SRE team');
        const companyLink = page.locator('#section-experience-detail .role-subtitle a');
        await expect(companyLink).toHaveAttribute('target', '_blank');
    });

    test('mariadb graph loads in the experience detail', async ({ page }) => {
        await page.goto('/#cv/experience/sreBatch');
        await page.click('.experience-body details:first-of-type summary');
        const img = page.locator('.img-in-grid img');
        await expect(img).toBeVisible();
        expect(await img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
    });

    test('skills, education and languages are populated', async ({ page }) => {
        await page.goto('/#cv/skills');
        await expect(page.locator('.skill-item')).toHaveCount(5);
        await page.goto('/#cv/education');
        await expect(page.locator('.education-item')).toHaveCount(2);
        await page.goto('/#cv/languages');
        await expect(page.locator('.language-item')).toHaveCount(3);
    });
});

test.describe('theme', () => {
    test('toggle switches theme and persists across reloads', async ({ page }) => {
        await page.goto('/');
        const initial = await page.evaluate(() => document.documentElement.dataset.theme);
        await page.click('#theme-toggle');
        const flipped = initial === 'dark' ? 'light' : 'dark';
        await expect(page.locator('html')).toHaveAttribute('data-theme', flipped);
        await page.reload();
        await expect(page.locator('html')).toHaveAttribute('data-theme', flipped);
    });

    test('defaults to the system preference', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.goto('/');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
});
