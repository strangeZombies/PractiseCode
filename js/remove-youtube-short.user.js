// ==UserScript==
// @name        Remove Youtube Shorts
// @namespace   https://github.com/strangeZombies/aweb2mdtool
// @version     2024-12-11
// @description  移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf
// @author      StrangeZombies
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  // 需要移除的元素选择器
  const selectors = [
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'div#dismissible.style-scope.ytd-rich-shelf-renderer',
    'a#endpoint[title="Shorts"]',
    'ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer',
  ];

  // 移除指定选择器的元素
  function removeElements() {
    selectors.forEach((selector) => {
      /* eslint-disable-next-line no-undef */
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => element.remove());
    });
  }

  // 页面加载完成后运行
  /* eslint-disable-next-line no-undef */
  window.addEventListener('load', removeElements);

  // 监视 DOM 变化以移除可能后续添加的元素
  /* eslint-disable-next-line no-undef */
  const observer = new MutationObserver(removeElements);
  /* eslint-disable-next-line no-undef */
  observer.observe(document.body, { childList: true, subtree: true });
})();
