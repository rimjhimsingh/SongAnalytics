/*
  AppHeader Component
  -------------------
  A "Presentation" (Stateless) component that renders the application's top navigation bar.
  
  Responsibilities:
  1. Branding: Displays the application title and company logo/badge.
  2. Context: Provides a brief description to orient the user.
  3. Layout: Uses Flexbox to ensure consistent alignment across different screen sizes.
*/
import React from "react";

export default function AppHeader() {
    return (
        <header className="bg-vivpro-navy rounded-xl px-6 py-4 flex items-center justify-between shadow-lg">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Vivpro Song Analytics
                </h1>
                <p className="text-sm md:text-base text-gray-300 mt-1">
                    Explore normalized playlist data and song attributes.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-vivpro-teal flex items-center justify-center font-bold shadow-md">
                    V
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide text-vivpro-teal">
                    Vivpro
                </span>
            </div>
        </header>
    );
}
