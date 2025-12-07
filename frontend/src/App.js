/*
  Application Entry Point & Router Configuration
  ----------------------------------------------
  This module serves as the root configuration for the React application.
  
  Key Responsibilities:
  1. Routing Strategy: It defines the URL structure using 'createBrowserRouter', 
     the modern Data Router API recommended for React Router v6.4+.
  2. Performance Optimization: It implements 'Code Splitting' using React.lazy() 
     to ensure the main bundle remains lightweight.
  3. Layout Composition: It establishes the 'AppLayout' as the persistent shell 
     that wraps all child pages.
*/

import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Standard Import: The Layout Shell
// This component is loaded immediately because it contains the persistent 
// UI elements (Header/Navigation) visible on all pages.
import AppLayout from "./components/AppLayout";

/*
  Lazy Loading (Code Splitting)
  -----------------------------
  Instead of importing 'Dashboard' directly, we use dynamic imports.
  
  Benefit: The browser only downloads the 'Dashboard' JavaScript chunk when 
  the user actually visits the "/" route.
*/
const Dashboard = lazy(() => import("./components/Dashboard"));

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: (
                    /* Suspense Boundary
                      -----------------
                      Because 'Dashboard' is lazy-loaded asynchronously over the network, 
                      React needs a placeholder to display while the browser fetches the file.
                      
                      'fallback': The UI to show during the loading phase (e.g., a spinner).
                      Preventing 'White Screen of Death' improves perceived performance.
                    */
                    <Suspense fallback={<div className="p-10 text-center">Loading Application...</div>}>
                        <Dashboard />
                    </Suspense>
                ),
            },
        ],
    },
]);

function App() {
    /*
      Router Provider
      ---------------
      This component injects the routing context into the React tree, 
      enabling Link, useNavigate, and other routing hooks to function.
    */
    return <RouterProvider router={appRouter} />;
}

export default App;