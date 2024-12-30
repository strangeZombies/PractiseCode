// ==UserScript==
// @name               Remove YouTube Shorts
// @name:zh-CN         移除 YouTube Shorts
// @name:zh-TW         移除 YouTube Shorts
// @name:ja            YouTube の Shorts を削除
// @name:ko            YouTube Shorts 제거
// @name:es            Eliminar YouTube Shorts
// @name:pt-BR         Remover YouTube Shorts
// @name:ru            Удалить YouTube Shorts
// @name:id            Hapus YouTube Shorts
// @name:hi            YouTube Shorts हटाएँ
// @namespace          https://github.com/strangeZombies
// @version            2024-12-30.4
// @description        Remove YouTube Shorts tags, dismissible elements, Shorts links, and Reel Shelf
// @description:zh-CN  移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
// @description:zh-TW  移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
// @description:ja     YouTube 上の Shorts タグ、ディスミッシブル要素、Shorts リンク、および Reel Shelf を削除
// @description:ko     YouTube의 Shorts 태그, 해제 가능한 요소, Shorts 링크 및 Reel 선반 제거
// @description:es     Eliminar etiquetas de Shorts de YouTube, elementos desechables, enlaces de Shorts y estante de carretes
// @description:pt-BR  Remover tags de Shorts do YouTube, elementos descartáveis, links de Shorts e prateleira de rolos
// @description:ru     Удалите теги YouTube Shorts, элементы, которые можно отклонить, ссылки на Shorts и полку с катушками
// @description:id     Hapus tag Shorts YouTube, elemen yang dapat dihapus, tautan Shorts, dan Rak Reel
// @description:hi     YouTube Shorts टैग, खारिज करने योग्य तत्व, Shorts लिंक और Reel Shelf निकालें
// @author             StrangeZombies
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match              https://www.youtube.com/*
// @grant              none
// @downloadURL        https://update.greasyfork.org/scripts/522057/Remove%20Youtube%20Shorts.user.js
// @updateURL          https://update.greasyfork.org/scripts/522057/Remove%20Youtube%20Shorts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const selectors = [
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'div#dismissible.style-scope.ytd-rich-shelf-renderer',
    'a#endpoint[title="Shorts"]',
    'ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer',
  ];

  function removeElements() {
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => element.remove());
    });
  }

  let debounceTimeout;
  function debouncedRemoveElements() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(removeElements, 200);
  }

  window.addEventListener('load', removeElements);

  const observer = new MutationObserver(debouncedRemoveElements);
  observer.observe(document.body, { childList: true, subtree: true });
})();
