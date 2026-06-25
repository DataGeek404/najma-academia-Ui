'use client';

import createCache from '@emotion/cache';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';

type Registry = {
  cache: EmotionCache;
  flush: () => string[];
};

function createEmotionRegistry(): Registry {
  const cache = createCache({ key: 'mui' });
  cache.compat = true;

  const inserted: string[] = [];
  const prevInsert = cache.insert;

  cache.insert = (...args) => {
    const serialized = args[1];
    if (cache.inserted[serialized.name] === undefined) {
      inserted.push(serialized.name);
    }
    return prevInsert(...args);
  };

  return {
    cache,
    flush: () => inserted.splice(0, inserted.length),
  };
}

export function EmotionCacheProvider({ children }: PropsWithChildren) {
  const [{ cache, flush }] = useState(createEmotionRegistry);

  useServerInsertedHTML(() => {
    const names = flush();

    if (names.length === 0) {
      return null;
    }

    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name] as string;
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
