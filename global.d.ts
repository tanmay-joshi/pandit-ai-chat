declare module 'mixpanel-browser' {
  interface Mixpanel {
    init: (token: string, options?: any) => void;
    track: (event_name: string, properties?: any) => void;
    identify: (distinct_id: string) => void;
    alias: (alias: string, original: string) => void;
    reset: () => void;
    people: {
      set: (properties: any) => void;
    };
    __initialized?: boolean;
  }
  const mixpanel: Mixpanel;
  export default mixpanel;
}

interface Window {
  mixpanelReady?: boolean;
} 