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
// @version            2024-12-31.0
// @description         Remove YouTube Shorts tags, dismissible elements, Shorts links, and Reel Shelf
// @description:zh-CN   移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
// @description:zh-TW   移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
// @description:ja      YouTube 上の Shorts タグ、ディスミッシブル要素、Shorts リンク、および Reel Shelf を削除
// @description:ko      YouTube의 Shorts 태그, 해제 가능한 요소, Shorts 링크 및 Reel 선반 제거
// @description:es      Eliminar etiquetas de Shorts de YouTube, elementos desechables, enlaces de Shorts y estante de carretes
// @description:pt-BR   Remover tags de Shorts do YouTube, elementos descartáveis, links de Shorts e prateleira de rolos
// @description:ru      Удалите теги YouTube Shorts, элементы, которые можно отклонить, ссылки на Shorts и полку с катушками
// @description:id      Hapus tag Shorts YouTube, elemen yang dapat dihapus, tautan Shorts, dan Rak Reel
// @description:hi      YouTube Shorts टैग, खारिज करने योग्य तत्व, Shorts लिंक और Reel Shelf निकालें
// @author             StrangeZombies
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match              https://www.youtube.com/*
// @match              https://m.youtube.com/*
// @grant              none
// @downloadURL        https://update.greasyfork.org/scripts/522057/Remove%20Youtube%20Shorts.user.js
// @updateURL          https://update.greasyfork.org/scripts/522057/Remove%20Youtube%20Shorts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const commonSelectors = [
      '.ytd-mini-guide-entry-renderer[title="Shorts"]',
      '[is-shorts]',
      '#guide [title="Shorts"]',
      'ytd-reel-shelf-renderer',
      'ytd-search ytd-video-renderer [overlay-style="SHORTS"]',
      '#related ytd-compact-video-renderer [overlay-style="SHORTS"]',
  ];

  const mobileSelectors = [
      '.pivot-shorts:upward(ytm-pivot-bar-item-renderer)',
      'ytm-reel-shelf-renderer',
      'ytm-search ytm-video-with-context-renderer [data-style="SHORTS"]',
  ];

  const feedSelectors = [
      'ytd-browse[page-subtype="subscriptions"] ytd-grid-video-renderer [overlay-style="SHORTS"]:upward(ytd-grid-video-renderer)',
      'ytd-browse[page-subtype="subscriptions"] ytd-video-renderer [overlay-style="SHORTS"]:upward(ytd-item-section-renderer)',
      'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer [overlay-style="SHORTS"]:upward(ytd-rich-item-renderer)',
  ];

  const channelSelectors = [
      'yt-tab-shape[tab-title="Shorts"]',
  ];

  function removeElements() {
      const currentUrl = window.location.href;

      if (currentUrl.includes('m.youtube.com')) {
          removeElementsBySelectors(mobileSelectors);
      } else {
          if (currentUrl.includes('/feed')) {
              removeElementsBySelectors(feedSelectors);
          }
          if (currentUrl.includes('/channel') || currentUrl.includes('/@')) {
              removeElementsBySelectors(channelSelectors);
          }
      }

      // 针对所有页面执行的选择器
      removeElementsBySelectors(commonSelectors);
  }

  function removeElementsBySelectors(selectors) {
      selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
              elements.forEach((element) => {
                  if (selector.includes('[overlay-style="SHORTS"]')) {
                      let parent = element.closest('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer, ytm-video-with-context-renderer');
                      if (parent) {
                          parent.remove();
                      }
                  } else {
                      element.remove();
                  }
              });
          }
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

//const selectors = [
//    https://gist.github.com/sumonst21/1779307b807509488d1a915d2bd370bd
//    '[is-shorts]', // YT Homepage - Hide the Shorts section
//    '#guide [title="Shorts"]', // YT Menu - Hide the Shorts button
//    '.ytd-mini-guide-entry-renderer[title="Shorts"]', // YT Menu - Hide the Shorts button
//    'ytd-search ytd-video-renderer [overlay-style="SHORTS"]:upward(ytd-video-renderer)', // YT Search - Hide Shorts
//    'ytd-reel-shelf-renderer',
//    'ytd-browse[page-subtype="channels"] [role="tab"]:nth-of-type(3):has-text(Shorts)', // YT Channels - Hide the Shorts tab
//    'ytd-browse[page-subtype="subscriptions"] ytd-grid-video-renderer [overlay-style="SHORTS"]:upward(ytd-grid-video-renderer)', // YT Subscriptions - Hide Shorts - Grid View
//    'ytd-browse[page-subtype="subscriptions"] ytd-video-renderer [overlay-style="SHORTS"]:upward(ytd-item-section-renderer)', // YT Subscriptions - Hide Shorts - List View
//    'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer [overlay-style="SHORTS"]:upward(ytd-rich-item-renderer)', // YT Subscriptions - New Layout - Hide Shorts
//    '#related ytd-compact-video-renderer [overlay-style="SHORTS"]:upward(ytd-compact-video-renderer)', // YT Sidebar - Hide Shorts
//    '.pivot-shorts:upward(ytm-pivot-bar-item-renderer)', // YT Mobile - Hide the Shorts Menu button
//    'ytm-reel-shelf-renderer', // YT Mobile - Hide Shorts sections
//    'ytm-search ytm-video-with-context-renderer [data-style="SHORTS"]', // YT Mobile - Hide Shorts in search results
//];
