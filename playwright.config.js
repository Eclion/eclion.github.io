const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: 'tests',
    use: {
        baseURL: 'http://127.0.0.1:8934',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    webServer: {
        command: 'python3 -m http.server 8934 --bind 127.0.0.1',
        url: 'http://127.0.0.1:8934',
        reuseExistingServer: !process.env.CI,
    },
});
