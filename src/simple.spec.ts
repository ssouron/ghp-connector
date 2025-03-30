/**
 * Test simple pour vérifier la configuration de Jest
 */

describe('Configuration Jest', () => {
  it('devrait fonctionner correctement', () => {
    expect(1 + 1).toBe(2);
  });

  it('devrait traiter correctement les promesses', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
