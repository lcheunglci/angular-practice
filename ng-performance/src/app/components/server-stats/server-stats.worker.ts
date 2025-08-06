/// <reference lib="webworker" />

import type { Server } from "../../interfaces/server";

const fakeNetworkLatency = (delay: number) => new Promise(resolve => setTimeout(() => resolve(null), delay));

addEventListener('message', async (event: MessageEvent<{ url: string; }>) => {
  const { data } = event;

  const cache = await caches.open('FooterWorkerCache');
  const cachedResponse = await cache.match(data.url);
  const matched = await cachedResponse?.json() as Server | undefined;

  if (matched) postMessage(matched);

  await fakeNetworkLatency(1_900);

  const networkResponse = await fetch(data.url);
  cache.put(data.url, networkResponse.clone());
  const fetched = await networkResponse.json() as Server;

  postMessage(fetched);
});
