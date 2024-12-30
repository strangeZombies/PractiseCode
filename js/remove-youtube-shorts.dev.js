  // ==UserScript==
  // @name               [DEV] Remove YouTube Shorts
  // @name:zh-CN         [DEV] 移除 YouTube Shorts
  // @name:zh-TW         [DEV] 移除 YouTube Shorts
  // @name:ja            [DEV] YouTube の Shorts を削除
  // @name:ko            [DEV] YouTube Shorts 제거
  // @name:es            [DEV] Eliminar YouTube Shorts
  // @name:pt-BR         [DEV] Remover YouTube Shorts
  // @name:ru            [DEV] Удалить YouTube Shorts
  // @name:id            [DEV] Hapus YouTube Shorts
  // @name:hi            [DEV] YouTube Shorts हटाएँ
  // @namespace          https://github.com/strangeZombies
  // @version            2024-12-31.1
  // @description         [DEV] Remove YouTube Shorts tags, dismissible elements, Shorts links, and Reel Shelf
  // @description:zh-CN   [DEV] 移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
  // @description:zh-TW   [DEV] 移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
  // @description:ja      [DEV] YouTube 上の Shorts タグ、ディスミッシブル要素、Shorts リンク、および Reel Shelf を削除
  // @description:ko      [DEV] YouTube의 Shorts 태그, 해제 가능한 요소, Shorts 링크 및 Reel 선반 제거
  // @description:es      [DEV] Eliminar etiquetas de Shorts de YouTube, elementos desechables, enlaces de Shorts y estante de carretes
  // @description:pt-BR   [DEV] Remover tags de Shorts do YouTube, elementos descartáveis, links de Shorts e prateleira de rolos
  // @description:ru      [DEV] Удалите теги YouTube Shorts, элементы, которые можно отклонить, ссылки на Shorts и полку с катушками
  // @description:id      [DEV] Hapus tag Shorts YouTube, elemen yang dapat dihapus, tautan Shorts, dan Rak Reel
  // @description:hi      [DEV] YouTube Shorts टैग, खारिज करने योग्य तत्व, Shorts लिंक और Reel Shelf निकालें
  // @author             StrangeZombies
  // @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
  // @match              https://www.youtube.com/*
  // @grant              none
  // @run-at             document-start
  // ==/UserScript==
  
  (function () {
    'use strict';
    const selectors = [
        'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
        'div#dismissible.style-scope.ytd-rich-shelf-renderer',
        'a#endpoint[title="Shorts"]',
        'ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer',
        'div[slot="extra-content"].style-scope.ytd-watch-metadata' 
      ];
   // const selectors = [
   //   '[is-shorts]', // YT Homepage - Hide the Shorts section
   //   '#guide [title="Shorts"]', // YT Menu - Hide the Shorts button
   //   '.ytd-mini-guide-entry-renderer[title="Shorts"]', // YT Menu - Hide the Shorts button
   //   'ytd-search ytd-video-renderer [overlay-style="SHORTS"]:upward(ytd-video-renderer)', // YT Search - Hide Shorts
   //   'ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer',
   //   'ytd-reel-shelf-renderer.style-scope.ytd-structured-description-content-renderer',
   //   'ytd-browse[page-subtype="channels"] [role="tab"]:nth-of-type(3):has-text(Shorts)', // YT Channels - Hide the Shorts tab
   //   'ytd-browse[page-subtype="subscriptions"] ytd-grid-video-renderer [overlay-style="SHORTS"]:upward(ytd-grid-video-renderer)', // YT Subscriptions - Hide Shorts - Grid View
   //   'ytd-browse[page-subtype="subscriptions"] ytd-video-renderer [overlay-style="SHORTS"]:upward(ytd-item-section-renderer)', // YT Subscriptions - Hide Shorts - List View
   //   'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer [overlay-style="SHORTS"]:upward(ytd-rich-item-renderer)', // YT Subscriptions - New Layout - Hide Shorts
   //   '#related ytd-compact-video-renderer [overlay-style="SHORTS"]:upward(ytd-compact-video-renderer)', // YT Sidebar - Hide Shorts
   //   '.pivot-shorts:upward(ytm-pivot-bar-item-renderer)', // YT Mobile - Hide the Shorts Menu button
   //   'ytm-reel-shelf-renderer', // YT Mobile - Hide Shorts sections
   //   'ytm-search ytm-video-with-context-renderer [data-style="SHORTS"]', // YT Mobile - Hide Shorts in search results
   // ];
  
    function removeElements() {
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.remove();
        });
      });
    }
  
    let debounceTimeout;
    function debouncedRemoveElements() {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(removeElements, 200);
    }
  
    window.addEventListener('load', removeElements);
    document.addEventListener('yt-navigate-finish', removeElements);
  
    const observer = new MutationObserver(debouncedRemoveElements);
    observer.observe(document.body, { childList: true, subtree: true });
  })();
  