/**
 * Mock Service Worker setup for browser
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Browser worker for intercepting requests in development
 */
export const worker = setupWorker(...handlers);

/**
 * Start the mock service worker
 */
export async function startMocking() {
  if (typeof window === 'undefined') {
    throw new Error('Browser mocking can only be used in browser environment');
  }

  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  });
}
