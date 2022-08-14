import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { initFb } from './fbinit';

import App from './App';
import { ApiProvider, StoreProvider } from './hooks';
import { FullScreenSpinner } from './components';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const { db } = initFb();

root.render(
  <StrictMode>
    <Suspense fallback={<FullScreenSpinner />}>
      <BrowserRouter>
        <ApiProvider db={db}>
          <StoreProvider>
            <App />
          </StoreProvider>
        </ApiProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
);
