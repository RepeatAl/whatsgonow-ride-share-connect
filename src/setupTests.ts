
import '@testing-library/jest-dom';

// Mock für localStorage und sessionStorage in der Testumgebung
// Dies ermöglicht es uns, die Supabase-Authentifizierung in Tests zu verwenden

Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
    key: () => null,
    length: 0
  },
  writable: true
});

Object.defineProperty(global, 'sessionStorage', {
  value: {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
    key: () => null,
    length: 0
  },
  writable: true
});

// Mocking window.URL.createObjectURL für File-Tests
Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: () => 'mock-url',
    revokeObjectURL: () => undefined
  },
  writable: true
});
