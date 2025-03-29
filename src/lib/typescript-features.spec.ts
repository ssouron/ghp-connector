/**
 * Test pour vérifier la prise en charge des fonctionnalités TypeScript avancées
 */

// Tester les types
interface TestInterface {
  id: number;
  name: string;
  optional?: boolean;
}

type TestTypeExample = {
  value: string;
  nested: {
    prop: number;
  };
};

describe('TypeScript Features', () => {
  it('devrait prendre en charge les interfaces TypeScript', () => {
    const data: TestInterface = {
      id: 1,
      name: 'test'
    };
    
    expect(data.id).toBe(1);
    expect(data.name).toBe('test');
    expect(data.optional).toBeUndefined();
  });

  it('devrait prendre en charge les types complexes', () => {
    const data: TestTypeExample = {
      value: 'hello',
      nested: {
        prop: 42
      }
    };
    
    expect(data.value).toBe('hello');
    expect(data.nested.prop).toBe(42);
  });

  it('devrait prendre en charge les fonctions génériques', () => {
    function identity<T>(arg: T): T {
      return arg;
    }
    
    const stringResult = identity('hello');
    const numberResult = identity(123);
    
    expect(typeof stringResult).toBe('string');
    expect(typeof numberResult).toBe('number');
  });
}); 