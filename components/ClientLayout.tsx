"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Check local storage for sidebar state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState) {
      setIsSidebarExpanded(JSON.parse(savedState) === true);
    }

    // Set up an event listener for changes to local storage
    const handleStorageChange = () => {
      const currentState = localStorage.getItem('sidebar-expanded');
      if (currentState) {
        setIsSidebarExpanded(JSON.parse(currentState) === true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Set up a custom event for changes within the same window
    window.addEventListener('sidebar-state-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebar-state-changed', handleStorageChange);
    };
  }, []);

  return (
    <>
      <Sidebar />
      {isSidebarExpanded ? (
        <main className="flex min-h-screen flex-col p-6 transition-all duration-300 md:pl-72">
          {children}
        </main>
      ) : (
        <main className="flex min-h-screen flex-col p-6 transition-all duration-300 md:pl-24">
          {children}
        </main>
      )}
    </>
  );
} 