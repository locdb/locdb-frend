import { LocdbFrontendPage } from './app.po';

describe('locdb-frontend App', () => {
  let page: LocdbFrontendPage;

  beforeEach(() => {
    page = new LocdbFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
