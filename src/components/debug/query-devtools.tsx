'use client';

import { QueryDevtools as ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';

export function QueryDevtools() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
}