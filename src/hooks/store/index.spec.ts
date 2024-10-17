import * as components from './index';

describe('index', () => {
  it('debe exportar useProductStore', () => {
    expect(components.useProductStore).toBeDefined();
  });
});
