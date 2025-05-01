"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { initMixpanel } from "@/lib/mixpanel";
import mixpanel from "@/lib/mixpanel";
import { useEffect } from "react";

function MixpanelIdentify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Identify the user in Mixpanel
      mixpanel.identify(session.user.id || session.user.email);
      mixpanel.people.set({
        $name: session.user.name,
        $email: session.user.email,
      });
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