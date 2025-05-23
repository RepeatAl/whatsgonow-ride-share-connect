// src/setupTests.ts

// Minimaler Mock für localStorage
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  },
  writable: true,
});

// Optional: Minimaler Mock für sessionStorage (nur wenn du das wirklich brauchst)
Object.defineProperty(globalThis, 'sessionStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  },
  writable: true,
});
