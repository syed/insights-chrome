import React, { createContext, MutableRefObject, useContext, useEffect, useRef } from 'react';
import { AnalyticsBrowser } from '@segment/analytics-next';

// TODO: Use real API keys and scope them by module
function getAPIKey(env: string, bundle: string, activeModule: string) {
  return `<YOUR_WRITE_KEY>/${env}/${bundle}/${activeModule}`;
}

const registerUrlObserver = (analytics: MutableRefObject<AnalyticsBrowser>) => {
  /**
   * We ignore hash changes
   * Hashes only have frontend effect
   */
  let oldHref = document.location.href.replace(/#.*$/, '');

  window.onload = function () {
    const bodyList = document.body;
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function () {
        const newLocation = document.location.href.replace(/#.*$/, '');
        if (oldHref !== newLocation && analytics?.current?.page) {
          oldHref = newLocation;
          console.log(analytics);
          analytics.current.page();
        }
      });
    });
    const config = {
      childList: true,
      subtree: true,
    };
    observer.observe(bodyList, config);
  };
};

export const SegmentContext = createContext<{ ready: boolean; analytics?: AnalyticsBrowser }>({
  ready: false,
  analytics: undefined,
});

export type SegmentProviderProps = {
  env: string;
  bundle: string;
  activeModule: string;
};

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ env, bundle, activeModule, children }) => {
  const analytics = useRef<AnalyticsBrowser>();
  const obseverRegistered = useRef(false);
  useEffect(() => {
    if (analytics.current && !obseverRegistered.current) {
      obseverRegistered.current = true;
      registerUrlObserver(analytics as MutableRefObject<AnalyticsBrowser>);
    }
  });

  useEffect(() => {
    if (env && bundle && activeModule) {
      analytics.current = AnalyticsBrowser.load({ writeKey: getAPIKey(env, bundle, activeModule) });
      analytics.current.page();
    }
  }, [env, bundle, activeModule]);
  return (
    <SegmentContext.Provider
      value={{
        ready: true,
        analytics: analytics.current,
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
};

export function useSegment() {
  const ctx = useContext(SegmentContext);
  if (!ctx) {
    throw new Error('Context used outside of its Provider!');
  }
  return ctx;
}
