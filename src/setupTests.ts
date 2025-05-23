
// Mock für localStorage in der Test-Umgebung
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(() => null),
  },
  writable: true,
});

// Mock für sessionStorage in der Test-Umgebung (falls benötigt)
Object.defineProperty(global, 'sessionStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(() => null),
  },
  writable: true,
});

// Mock für window in der Test-Umgebung (falls benötigt)
Object.defineProperty(global, 'window', {
  value: {
    localStorage: global.localStorage,
    sessionStorage: global.sessionStorage,
  },
  writable: true,
});
