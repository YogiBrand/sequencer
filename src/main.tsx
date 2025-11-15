import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Start MSW in development mode
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { startMocking } = await import('./mocks/browser');
    return startMocking();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
