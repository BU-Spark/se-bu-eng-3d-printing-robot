import '@testing-library/jest-dom';

// This will run before any test executes
beforeAll(() => {
  // Hard override console.error globally
  global.console.error = jest.fn();
});
