import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ErrorPage from './pages/NotFound'
import Pairs from './pages/Pairs'
import Calendar from './pages/Calendar'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Calendar />,
      },
      {
        path: "pairs",
        element: <Pairs />,
      },
    ],
  },
], {
  basename: import.meta.env.VITE_APP_BASENAME,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
