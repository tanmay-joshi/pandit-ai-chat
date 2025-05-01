/// <reference path="./mixpanel.d.ts" />
// @ts-ignore
import mixpanel from 'mixpanel-browser';

export const initMixpanel = () => {
  if (typeof window !== 'undefined' && !mixpanel.__initialized) {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'DUMMY_TOKEN', {
      autocapture: true,
    });
    mixpanel.__initialized = true;
    window.mixpanelReady = true;
  }
};

export default mixpanel; 