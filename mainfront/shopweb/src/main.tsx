import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import TemplatePage from './components/TemplatePage.tsx';
import App from './App.tsx';
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/:useName', element: <TemplatePage /> },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
