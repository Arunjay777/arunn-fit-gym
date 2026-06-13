const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('SIMATS FitX Login E2E Tests', function() {
  this.timeout(30000); // 30 seconds timeout
  let driver;

  before(async function() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('should successfully log in with preset athlete credentials', async function() {
    const testUrl = process.env.TEST_URL || 'https://arunjay777.github.io/arunn-fit-gym/#/login';
    console.log(`Navigating to: ${testUrl}`);
    await driver.get(testUrl);

    // Wait for the username input to be loaded
    console.log('Waiting for username input field...');
    const usernameInput = await driver.wait(until.elementLocated(By.id('username')), 15000);
    assert.ok(usernameInput, 'Username input not found');

    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.id('login-button'));

    console.log('Entering preset athlete credentials...');
    await usernameInput.clear();
    await usernameInput.sendKeys('operator_aj');
    
    await passwordInput.clear();
    await passwordInput.sendKeys('fitness2026');

    console.log('Clicking login button...');
    await loginButton.click();

    console.log('Waiting for dashboard redirect/authentication...');
    await driver.wait(async function() {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl.includes('dashboard') || currentUrl.includes('/#');
    }, 15000);

    const finalUrl = await driver.getCurrentUrl();
    console.log(`Successfully logged in. Final URL: ${finalUrl}`);
    assert.ok(finalUrl.includes('dashboard') || finalUrl.includes('/#'), 'Failed to redirect to dashboard');
  });
});
