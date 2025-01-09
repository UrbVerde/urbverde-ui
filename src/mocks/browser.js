// urbverde-ui/src/mocks/browser.js
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

const worker = setupWorker(...handlers);

// Single start configuration
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass', // Silently bypass any unhandled requests
    serviceWorker: {
      url: '/mockServiceWorker.js' // Make sure this path is correct
    }
  }).catch(console.error);
}

export { worker };
