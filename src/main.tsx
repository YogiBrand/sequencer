import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Start MSW for mock backend (runs in both dev and production)
async function enableMocking() {
  const { startMocking } = await import('./mocks/browser');
  return startMocking();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
