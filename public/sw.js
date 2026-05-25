// キャッシュバージョン：デプロイのたびに自動更新
const CACHE_VERSION = "20260524-v3";
const CACHE_NAME = `michiene-ss-service-master-${CACHE_VERSION}`;
const BASE_URL = new URL(self.registration.scope).pathname;

const APP_SHELL = [
  "",
  "index.html",
  "web-app.html",
  "manifest.webmanifest",
  "pwa-icon.svg",
  "staff.png",
  "station-background-new.png",
  "car-top-view.png",
  "insurance.png",
  "EV.png",
  "tire.png",
  "tanker-lorry.png",
  "car-wash.png",
  "inspection.png"
].map((path) => `${BASE_URL}${path}`);

// インストール：新しいキャッシュを作成
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  // 即座に新しいServiceWorkerを有効化
  self.skipWaiting();
});

// アクティベート：古いキャッシュを全部削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log("古いキャッシュを削除:", key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      // 全クライアントを即座に新しいSWで制御
      return self.clients.claim();
    })
  );
});

// フェッチ：ネットワーク優先（Network First）に変更
// → 常に最新データを取得し、失敗時だけキャッシュを使う
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // JSとCSSは常にネットワークから取得（キャッシュを使わない）
  const url = new URL(event.request.url);
  const isAsset = url.pathname.includes("/assets/");

  if (isAsset) {
    // assets（JS/CSS）はキャッシュファースト（ハッシュ付きなので安全）
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        });
      })
    );
  } else {
    // HTML・SVG・PNG等はネットワーク優先
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 成功したらキャッシュも更新
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          // オフライン時だけキャッシュを使う
          return caches.match(event.request);
        })
    );
  }
});

// メッセージ受信：クライアントからの強制更新指示
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
