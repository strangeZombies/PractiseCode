// ==UserScript==
// @name               Remove YouTube Shorts and Restore Dislikes
// @name:zh-CN         移除 YouTube Shorts 并恢复不喜欢
// @name:zh-TW         移除 YouTube Shorts 並恢復不喜歡
// @name:ja            YouTube の Shorts を削除して嫌いを復元
// @name:ko            YouTube Shorts 제거 및 싫어요 복원
// @name:es            Eliminar YouTube Shorts y restaurar los No me gusta
// @name:pt-BR         Remover YouTube Shorts e restaurar as descurtidas
// @name:ru            Удалить YouTube Shorts и восстановить дизлайки
// @name:id            Hapus YouTube Shorts dan pulihkan Dislike
// @name:hi            YouTube Shorts हटाएँ और नापसंद को पुनर्स्थापित करें
// @namespace          https://github.com/strangeZombies
// @version            2024-12-30.2
// @description        Remove YouTube Shorts tags, dismissible elements, Shorts links, Reel Shelf, and restore dislikes
// @description:zh-CN  移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf，并恢复不喜欢
// @description:zh-TW  移除 YouTube 上的 Shorts 标签、Dismissible 元素、Shorts 链接和 Reel Shelf，並恢復不喜歡
// @description:ja     YouTube 上の Shorts タグ、ディスミッシブル要素、Shorts リンク、および Reel Shelf を削除して嫌いを復元します
// @description:ko     YouTube의 Shorts 태그, 해제 가능한 요소, Shorts 링크 및 Reel 선반을 제거하고 싫어요를 복원합니다
// @description:es     Eliminar etiquetas de Shorts de YouTube, elementos desechables, enlaces de Shorts y estante de carretes, y restaurar los No me gusta
// @description:pt-BR  Remover tags de Shorts do YouTube, elementos descartáveis, links de Shorts e prateleira de rolos, e restaurar as descurtidas
// @description:ru     Удалите теги YouTube Shorts, элементы, которые можно отклонить, ссылки на Shorts и полку с катушками, и восстановите дизлайки
// @description:id     Hapus tag Shorts YouTube, elemen yang dapat dihapus, tautan Shorts, dan Rak Reel, dan pulihkan Dislike
// @description:hi     YouTube Shorts टैग, खारिज करने योग्य तत्व, Shorts लिंक और Reel Shelf निकालें और नापसंद को पुनर्स्थापित करें
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

  window.addEventListener('load', () => {
    removeElements();
    restoreDislikes();
  });

  const observer = new MutationObserver(debouncedRemoveElements);
  observer.observe(document.body, { childList: true, subtree: true });

  // 恢复不喜欢功能
  async function restoreDislikes() {
    const videoId = getVideoId();
    if (!videoId) return;

    try {
      const response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`);
      const data = await response.json();
      const dislikes = data.dislikes;
      if (dislikes !== undefined) {
        displayDislikes(dislikes);
      }
    } catch (error) {
      console.error('Error fetching dislike data:', error);
    }
  }

  function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
  }

  function displayDislikes(dislikes) {
    const likeButton = document.querySelector('ytd-toggle-button-renderer.style-scope.ytd-menu-renderer:nth-of-type(2)');
    if (likeButton && !likeButton.querySelector('.dislike-count')) {
      const dislikeCount = document.createElement('span');
      dislikeCount.className = 'dislike-count';
      dislikeCount.style.fontSize = '14px';
      dislikeCount.style.marginLeft = '8px';
      dislikeCount.textContent = `👎 ${dislikes.toLocaleString()}`;
      likeButton.appendChild(dislikeCount);
    }
  }

  const observerDislikes = new MutationObserver(restoreDislikes);
  observerDislikes.observe(document.body, { childList: true, subtree: true });
})();
