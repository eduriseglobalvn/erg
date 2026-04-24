'use client';

import * as React from 'react';

const ReactQueryDevtools = process.env.NODE_ENV === 'development'
  ? React.lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      }))
    )
  : null;

export function QueryDevtoolsWrapper() {
  if (!ReactQueryDevtools) {
    return null;
  }

  return (
    <React.Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} />
    </React.Suspense>
  );
}
