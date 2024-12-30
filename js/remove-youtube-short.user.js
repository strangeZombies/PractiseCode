// ==UserScript==
// @name        Remove Youtube Shorts
// @namespace   https://github.com/strangeZombies/aweb2mdtool
// @version     2024-12-30
// @description Remove YouTube Shorts tags, dismissible elements, Shorts links, and Reel Shelf
// @author      StrangeZombies
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/522057/Remove%20Youtube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/522057/Remove%20Youtube%20Shorts.meta.js
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
