import { Analytics } from '@vercel/analytics/react';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function AnalyticsWrapper({ children }: Props) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

// Custom events tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof (window as any).va === 'function') {
    try {
      // call va in the common shape used by the library: e.g. va('event', { name, ...props })
      ;(window as any).va('event', { name: eventName, ...(properties ?? {}) });
    } catch (e) {
      // swallow any analytics errors to avoid crashing the app
      // eslint-disable-next-line no-console
      console.warn('Analytics tracking failed', e);
    }
  }
};

// Performance monitoring
export const trackPerformance = (metric: string, value: number) => {
  if (typeof window !== 'undefined' && window.performance) {
    const measure = {
      name: metric,
      startTime: performance.now(),
      duration: value,
      entryType: 'measure',
    };
    
    performance.mark(metric);
    window.performance.measure(metric);
    
    // Report to analytics
    trackEvent('performance_metric', {
      metric,
      value,
      ...measure,
    });
  }
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
};