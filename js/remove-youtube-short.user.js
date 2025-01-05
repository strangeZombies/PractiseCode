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
// @version            2025.1.5.1
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

    const hideHistoryShorts = false;

    const commonSelectors = [
        '.ytd-mini-guide-entry-renderer[title="Shorts"]',
        '.ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
        '[is-shorts]',
        '#guide [title="Shorts"]',
        'ytd-reel-shelf-renderer',
        'ytd-search ytd-video-renderer [overlay-style="SHORTS"]',
        '#related ytd-compact-video-renderer [overlay-style="SHORTS"]',
    ];

    const mobileSelectors = [
        '.pivot-shorts',
        'ytm-reel-shelf-renderer',
        'ytm-search ytm-video-with-context-renderer [data-style="SHORTS"]',
    ];

    const feedSelectors = [
        'ytd-browse[page-subtype="subscriptions"] ytd-grid-video-renderer [overlay-style="SHORTS"]',
        'ytd-browse[page-subtype="subscriptions"] ytd-video-renderer [overlay-style="SHORTS"]',
        'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer [overlay-style="SHORTS"]',
    ];

    const channelSelectors = [
        'yt-tab-shape[tab-title="Shorts"]',
    ];

    const historySelectors = [
        'ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer',
    ];

    // 通用方法：根据选择器移除元素
    function removeElementsBySelectors(selectors) {
        selectors.forEach((selector) => {
            try {
                // 优先尝试直接查询元素
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    elements.forEach((element) => {
                        let parent = element.closest(
                            'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer, ytm-video-with-context-renderer'
                        );
                        if (!parent) {
                            parent = element; // 如果没有父节点，直接移除当前节点
                        }
                        parent.remove();
                    });
                }
            } catch (error) {
                //console.warn(`Selector failed: ${selector}`, error);

                // 使用备用方案：手动遍历父节点
                const elements = manualQuerySelector(selector);
                elements.forEach((element) => {
                    let parent = element.closest(
                        'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer, ytm-video-with-context-renderer'
                    );
                    if (!parent) {
                        parent = element; // 如果没有父节点，直接移除当前节点
                    }
                    parent.remove();
                });
            }
        });
    }

    // 手动实现的选择器解析函数（仅适用于简单选择器）
    function manualQuerySelector(selector) {
        const results = [];
        const parts = selector.split(':');
        const baseSelector = parts[0];
        const upwardSelector = parts[1]?.includes('upward') ? parts[1] : null;

        // 查找所有基础选择器匹配的元素
        const elements = document.querySelectorAll(baseSelector);
        elements.forEach((element) => {
            if (upwardSelector) {
                // 手动向上遍历，查找符合条件的父节点
                let parent = element.parentElement;
                while (parent) {
                    if (parent.matches(upwardSelector)) {
                        results.push(parent);
                        break;
                    }
                    parent = parent.parentElement;
                }
            } else {
                results.push(element);
            }
        });

        return results;
    }

    // 删除 Shorts 元素
    function removeElements() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('m.youtube.com')) {
            removeElementsBySelectors(mobileSelectors);
        }
        // 已知存在无用或未生效的选择器
        if (currentUrl.includes('/feed/subscriptions')) {
            removeElementsBySelectors(feedSelectors);
        }
        if (currentUrl.includes('/channel') || currentUrl.includes('/@')) {
            removeElementsBySelectors(channelSelectors);
        }
        if (hideHistoryShorts && currentUrl.includes('/feed/history')) {
            removeElementsBySelectors(historySelectors);
        }

        // 通用选择器
        removeElementsBySelectors(commonSelectors);
    }

    // 防抖函数
    let debounceTimeout;
    function debouncedRemoveElements() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(removeElements, 200);
    }

    // 初始化事件监听
    window.addEventListener('load', removeElements);
    document.addEventListener('yt-navigate-finish', removeElements);

    // 观察 DOM 变化
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
