// urbverde-ui/src/mocks/browser.js
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

const worker = setupWorker(...handlers);

// Single start configuration
if (import.meta.env.MODE === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  }).catch(console.error);
}

export { worker };
