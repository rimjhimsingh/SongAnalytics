/*
  App Layout Component (The "Shell")
  ----------------------------------
  This component implements the "Layout Pattern" common in Single Page Applications (SPAs).
  
  Key Responsibilities:
  1. Structure: It defines the base HTML structure (backgrounds, fonts, min-height).
  2. Persistence: It renders UI elements that must remain visible across route changes (like the Header).
  3. Composition: It uses the <Outlet /> component to dynamically inject the content of the current page.
  
  This approach adheres to the DRY (Don't Repeat Yourself) principle, ensuring we don't 
  have to re-import the Header on every single page.
*/

import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-vivpro-bg text-vivpro-navy font-sans">

            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Persistent Header: Remains mounted while navigating between pages */}
                <AppHeader />

                {/* Router Outlet
                  -------------
                  This is a special placeholder provided by React Router.
                  If the URL is "/", this component renders <Dashboard />.
                  If the URL was "/about", it would render <About /> here.
                */}
                <Outlet />
            </div>
        </div>
    );
};

export default AppLayout;