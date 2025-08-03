import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

describe('User List App', () => {

  beforeEach(async () => {
    browser.get('/dashboard');
  })

  it('should have a header', async () => {
    const header = by.css('h2');
    const text = await element(header).getText();

    expect(text).toBe('Active Users');
  })
  //const page = new AppPage();

  // beforeEach(async () => {
  //   await page.getDashboard();
  // });

  // it('should have a header', async () => {
  //   const text = await page.getHeaderText();
  //   expect(text).toBe('Active Users');
  // });

  // it('should have 16 users on page load', async () => {
  //   const users = page.getListItems();
  //   expect(await users.count()).toBe(16);
  // });
});