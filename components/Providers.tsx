"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { initMixpanel } from "@/lib/mixpanel";
import mixpanel from "@/lib/mixpanel";
import { useEffect } from "react";

function MixpanelIdentify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Get a valid identifier for the user
      const userId = session.user.id || session.user.email;
      if (userId) {
        // Identify the user in Mixpanel
        mixpanel.identify(userId);
        mixpanel.people.set({
          $name: session.user.name || 'Anonymous User',
          $email: session.user.email || 'unknown@example.com',
        });
      }
    } else if (status === "unauthenticated") {
      // Reset Mixpanel identity on logout
      mixpanel.reset();
    }
  }, [session, status]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initMixpanel();
  }, []);
  return (
    <SessionProvider>
      <MixpanelIdentify />
      {children}
    </SessionProvider>
  );
} 