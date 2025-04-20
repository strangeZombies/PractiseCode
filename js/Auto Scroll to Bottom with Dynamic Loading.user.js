// ==UserScript==
// @name         Auto Scroll to Bottom with Dynamic Loading
// @name:zh-CN   自动滚动到底部（支持动态加载）
// @name:en      Auto Scroll to Bottom with Dynamic Loading
// @name:es      Desplazamiento Automático al Final con Carga Dinámica
// @name:ja      自動スクロール（動的読み込み対応）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically scroll to the bottom of the page, continue scrolling to trigger dynamic content loading, and stop after a configurable timeout if no new content is loaded. Supports multiple languages for better usability and searchability.
// @description:zh-CN  自动滚动到页面底部，持续滚动以触发动态内容加载，若无新内容则在可配置的超时时间后停止。支持多语言，提升使用和检索便捷性。
// @description:en     Automatically scroll to the bottom of the page, continue scrolling to trigger dynamic content loading, and stop after a configurable timeout if no new content is loaded. Supports multiple languages for better usability and searchability.
// @description:es     Desplaza automáticamente hasta el final de la página, continúa desplazándose para activar la carga de contenido dinámico y se detiene tras un tiempo configurable si no se carga nuevo contenido. Soporta múltiples idiomas para mejor usabilidad y búsqueda.
// @description:ja     ページの最下部まで自動でスクロールし、動的コンテンツの読み込みをトリガーするためにスクロールを継続し、新しいコンテンツが読み込まれない場合は設定可能なタイムアウト後に停止します。多言語対応で使いやすさと検索性を向上。
// @author       Grok
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @keyword      auto scroll, infinite scroll, dynamic loading, 自动滚动, 无限滚动, 动态加载, desplazamiento automático, carga dinámica, 自動スクロール, 動的読み込み
// ==/UserScript==

(function() {
    'use strict';

    // Language translations
    const translations = {
        'zh-CN': {
            startScroll: '开始滚动',
            stopScroll: '停止滚动',
            openConfig: '打开设置',
            closeConfig: '关闭',
            saveConfig: '保存',
            configTitle: '滚动设置',
            scrollStep: '滚动步长（像素）',
            scrollInterval: '滚动间隔（毫秒）',
            scrollBehavior: '滚动行为',
            scrollBehaviorSmooth: '平滑',
            scrollBehaviorAuto: '即时',
            panelPosition: '面板位置',
            panelPositionTopRight: '右上',
            panelPositionTopLeft: '左上',
            panelPositionBottomRight: '右下',
            panelPositionBottomLeft: '左下',
            maxScrollTimes: '最大滚动次数（0 为无限制）',
            timeoutSeconds: '底部超时（秒）',
            language: '语言',
            languageZhCN: '中文（简体）',
            languageEn: 'English',
            languageEs: 'Español',
            languageJa: '日本語',
            saveSuccess: '配置保存成功！',
            invalidScrollStep: '滚动步长至少为 1。',
            invalidScrollInterval: '滚动间隔至少为 10 毫秒。',
            invalidScrollBehavior: '无效的滚动行为。',
            invalidPanelPosition: '无效的面板位置。',
            invalidMaxScrollTimes: '最大滚动次数必须为 0 或更大。',
            invalidTimeoutSeconds: '超时时间至少为 1 秒。'
        },
        'en': {
            startScroll: 'Start Scroll',
            stopScroll: 'Stop Scroll',
            openConfig: 'Open Config',
            closeConfig: 'Close',
            saveConfig: 'Save',
            configTitle: 'Scroll Settings',
            scrollStep: 'Scroll Step (px)',
            scrollInterval: 'Scroll Interval (ms)',
            scrollBehavior: 'Scroll Behavior',
            scrollBehaviorSmooth: 'Smooth',
            scrollBehaviorAuto: 'Auto',
            panelPosition: 'Panel Position',
            panelPositionTopRight: 'Top Right',
            panelPositionTopLeft: 'Top Left',
            panelPositionBottomRight: 'Bottom Right',
            panelPositionBottomLeft: 'Bottom Left',
            maxScrollTimes: 'Max Scroll Times (0 for unlimited)',
            timeoutSeconds: 'Timeout at Bottom (seconds)',
            language: 'Language',
            languageZhCN: 'Chinese (Simplified)',
            languageEn: 'English',
            languageEs: 'Spanish',
            languageJa: 'Japanese',
            saveSuccess: 'Configuration saved successfully!',
            invalidScrollStep: 'Scroll Step must be at least 1.',
            invalidScrollInterval: 'Scroll Interval must be at least 10ms.',
            invalidScrollBehavior: 'Invalid Scroll Behavior.',
            invalidPanelPosition: 'Invalid Panel Position.',
            invalidMaxScrollTimes: 'Max Scroll Times must be 0 or greater.',
            invalidTimeoutSeconds: 'Timeout must be at least 1 second.'
        },
        'es': {
            startScroll: 'Iniciar Desplazamiento',
            stopScroll: 'Detener Desplazamiento',
            openConfig: 'Abrir Configuración',
            closeConfig: 'Cerrar',
            saveConfig: 'Guardar',
            configTitle: 'Configuración de Desplazamiento',
            scrollStep: 'Paso de Desplazamiento (px)',
            scrollInterval: 'Intervalo de Desplazamiento (ms)',
            scrollBehavior: 'Comportamiento de Desplazamiento',
            scrollBehaviorSmooth: 'Suave',
            scrollBehaviorAuto: 'Instantáneo',
            panelPosition: 'Posición del Panel',
            panelPositionTopRight: 'Arriba Derecha',
            panelPositionTopLeft: 'Arriba Izquierda',
            panelPositionBottomRight: 'Abajo Derecha',
            panelPositionBottomLeft: 'Abajo Izquierda',
            maxScrollTimes: 'Máximo de Desplazamientos (0 para ilimitado)',
            timeoutSeconds: 'Tiempo de Espera en el Fondo (segundos)',
            language: 'Idioma',
            languageZhCN: 'Chino (Simplificado)',
            languageEn: 'Inglés',
            languageEs: 'Español',
            languageJa: 'Japonés',
            saveSuccess: '¡Configuración guardada con éxito!',
            invalidScrollStep: 'El paso de desplazamiento debe ser al menos 1.',
            invalidScrollInterval: 'El intervalo de desplazamiento debe ser al menos 10 ms.',
            invalidScrollBehavior: 'Comportamiento de desplazamiento inválido.',
            invalidPanelPosition: 'Posición del panel inválida.',
            invalidMaxScrollTimes: 'El máximo de desplazamientos debe ser 0 o mayor.',
            invalidTimeoutSeconds: 'El tiempo de espera debe ser al menos 1 segundo.'
        },
        'ja': {
            startScroll: 'スクロール開始',
            stopScroll: 'スクロール停止',
            openConfig: '設定を開く',
            closeConfig: '閉じる',
            saveConfig: '保存',
            configTitle: 'スクロール設定',
            scrollStep: 'スクロールステップ（ピクセル）',
            scrollInterval: 'スクロール間隔（ミリ秒）',
            scrollBehavior: 'スクロール動作',
            scrollBehaviorSmooth: 'スムーズ',
            scrollBehaviorAuto: '即時',
            panelPosition: 'パネル位置',
            panelPositionTopRight: '右上',
            panelPositionTopLeft: '左上',
            panelPositionBottomRight: '右下',
            panelPositionBottomLeft: '左下',
            maxScrollTimes: '最大スクロール回数（0で無制限）',
            timeoutSeconds: '底部でのタイムアウト（秒）',
            language: '言語',
            languageZhCN: '中国語（簡体）',
            languageEn: '英語',
            languageEs: 'スペイン語',
            languageJa: '日本語',
            saveSuccess: '設定が正常に保存されました！',
            invalidScrollStep: 'スクロールステップは1以上でなければなりません。',
            invalidScrollInterval: 'スクロール間隔は10ミリ秒以上でなければなりません。',
            invalidScrollBehavior: '無効なスクロール動作です。',
            invalidPanelPosition: '無効なパネル位置です。',
            invalidMaxScrollTimes: '最大スクロール回数は0以上でなければなりません。',
            invalidTimeoutSeconds: 'タイムアウトは1秒以上でなければなりません。'
        }
    };

    // Default configuration
    const defaultConfig = {
        scrollStep: 100, // Pixels per scroll
        scrollInterval: 50, // Interval between scrolls (ms)
        scrollBehavior: 'smooth', // Scroll behavior: smooth or auto
        panelPosition: 'top-right', // Panel position
        maxScrollTimes: 0, // Max scroll actions, 0 for unlimited
        timeoutSeconds: 10, // Timeout in seconds before stopping at bottom
        language: 'zh-CN' // Default language
    };

    // Load saved configuration or use defaults
    let config = {
        scrollStep: GM_getValue('scrollStep', defaultConfig.scrollStep),
        scrollInterval: GM_getValue('scrollInterval', defaultConfig.scrollInterval),
        scrollBehavior: GM_getValue('scrollBehavior', defaultConfig.scrollBehavior),
        panelPosition: GM_getValue('panelPosition', defaultConfig.panelPosition),
        maxScrollTimes: GM_getValue('maxScrollTimes', defaultConfig.maxScrollTimes),
        timeoutSeconds: GM_getValue('timeoutSeconds', defaultConfig.timeoutSeconds),
        language: GM_getValue('language', defaultConfig.language)
    };

    let isScrolling = false;
    let scrollTimer = null;
    let scrollCount = 0;
    let lastScrollTime = 0;
    let atBottomSince = null;
    let lastScrollHeight = 0;

    // Inject styles
    GM_addStyle(`
        #scrollControlPanel {
            position: fixed;
            ${getPanelPositionStyles(config.panelPosition)}
            background: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border-radius: 5px;
        }
        #scrollConfigPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border: 1px solid #ccc;
            padding: 20px;
            z-index: 10001;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border-radius: 5px;
            display: none;
            width: 300px;
            color: #333;
            font-family: Arial, sans-serif;
        }
        #scrollControlPanel button, #scrollConfigPanel button {
            margin: 5px;
            padding: 5px 10px;
            cursor: pointer;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 3px;
            font-size: 14px;
        }
        #scrollControlPanel button:hover, #scrollConfigPanel button:hover {
            background: #0056b3;
        }
        #scrollControlPanel .toggle-btn {
            background: #28a745;
        }
        #scrollControlPanel .toggle-btn.stop {
            background: #dc3545;
        }
        #scrollConfigPanel .close-btn {
            background: #6c757d;
        }
        #scrollConfigPanel label {
            display: block;
            margin: 10px 0;
            font-size: 14px;
            color: #333;
        }
        #scrollConfigPanel input, #scrollConfigPanel select {
            width: 100px;
            padding: 3px;
            margin-left: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            color: #333;
            background: #f9f9f9;
        }
        #scrollConfigPanel input:hover, #scrollConfigPanel select:hover {
            background: #e0e0e0;
        }
        #scrollConfigPanel h3 {
            margin: 0 0 10px;
            font-size: 16px;
            color: #333;
        }
    `);

    // Get styles for panel position
    function getPanelPositionStyles(position) {
        switch (position) {
            case 'top-left':
                return 'top: 20px; left: 20px;';
            case 'top-right':
                return 'top: 20px; right: 20px;';
            case 'bottom-left':
                return 'bottom: 20px; left: 20px;';
            case 'bottom-right':
                return 'bottom: 20px; right: 20px;';
            default:
                return 'top: 20px; right: 20px;';
        }
    }

    // Get translation for current language
    function t(key) {
        return translations[config.language][key] || translations['en'][key];
    }

    // Create control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'scrollControlPanel';
        panel.innerHTML = `
            <button id="toggleScrollBtn" class="toggle-btn">${t('startScroll')}</button>
            <button id="openConfigBtn">${t('openConfig')}</button>
        `;
        document.body.appendChild(panel);

        // Bind events
        document.getElementById('toggleScrollBtn').addEventListener('click', toggleScroll);
        document.getElementById('openConfigBtn').addEventListener('click', openConfigPanel);
    }

    // Create configuration panel
    function createConfigPanel() {
        const configPanel = document.createElement('div');
        configPanel.id = 'scrollConfigPanel';
        configPanel.innerHTML = `
            <h3>${t('configTitle')}</h3>
            <label>${t('scrollStep')}: <input type="number" id="scrollStepInput" value="${config.scrollStep}" min="1"></label>
            <label>${t('scrollInterval')}: <input type="number" id="scrollIntervalInput" value="${config.scrollInterval}" min="10"></label>
            <label>${t('scrollBehavior')}: 
                <select id="scrollBehaviorSelect">
                    <option value="smooth" ${config.scrollBehavior === 'smooth' ? 'selected' : ''}>${t('scrollBehaviorSmooth')}</option>
                    <option value="auto" ${config.scrollBehavior === 'auto' ? 'selected' : ''}>${t('scrollBehaviorAuto')}</option>
                </select>
            </label>
            <label>${t('panelPosition')}: 
                <select id="panelPositionSelect">
                    <option value="top-right" ${config.panelPosition === 'top-right' ? 'selected' : ''}>${t('panelPositionTopRight')}</option>
                    <option value="top-left" ${config.panelPosition === 'top-left' ? 'selected' : ''}>${t('panelPositionTopLeft')}</option>
                    <option value="bottom-right" ${config.panelPosition === 'bottom-right' ? 'selected' : ''}>${t('panelPositionBottomRight')}</option>
                    <option value="bottom-left" ${config.panelPosition === 'bottom-left' ? 'selected' : ''}>${t('panelPositionBottomLeft')}</option>
                </select>
            </label>
            <label>${t('maxScrollTimes')}: <input type="number" id="maxScrollTimesInput" value="${config.maxScrollTimes}" min="0"></label>
            <label>${t('timeoutSeconds')}: <input type="number" id="timeoutSecondsInput" value="${config.timeoutSeconds}" min="1"></label>
            <label>${t('language')}: 
                <select id="languageSelect">
                    <option value="zh-CN" ${config.language === 'zh-CN' ? 'selected' : ''}>${t('languageZhCN')}</option>
                    <option value="en" ${config.language === 'en' ? 'selected' : ''}>${t('languageEn')}</option>
                    <option value="es" ${config.language === 'es' ? 'selected' : ''}>${t('languageEs')}</option>
                    <option value="ja" ${config.language === 'ja' ? 'selected' : ''}>${t('languageJa')}</option>
                </select>
            </label>
            <button id="saveConfigBtn">${t('saveConfig')}</button>
            <button id="closeConfigBtn" class="close-btn">${t('closeConfig')}</button>
        `;
        document.body.appendChild(configPanel);

        // Bind events
        document.getElementById('saveConfigBtn').addEventListener('click', saveConfig);
        document.getElementById('closeConfigBtn').addEventListener('click', closeConfigPanel);
    }

    // Open configuration panel
    function openConfigPanel() {
        const configPanel = document.getElementById('scrollConfigPanel');
        configPanel.style.display = 'block';
    }

    // Close configuration panel
    function closeConfigPanel() {
        const configPanel = document.getElementById('scrollConfigPanel');
        configPanel.style.display = 'none';
    }

    // Toggle scrolling
    function toggleScroll() {
        const toggleBtn = document.getElementById('toggleScrollBtn');
        if (isScrolling) {
            clearInterval(scrollTimer);
            isScrolling = false;
            atBottomSince = null;
            toggleBtn.textContent = t('startScroll');
            toggleBtn.classList.remove('stop');
        } else {
            scrollCount = 0;
            lastScrollHeight = document.documentElement.scrollHeight;
            atBottomSince = null;
            startScroll();
            isScrolling = true;
            toggleBtn.textContent = t('stopScroll');
            toggleBtn.classList.add('stop');
        }
    }

    // Start scrolling
    function startScroll() {
        if (scrollTimer) clearInterval(scrollTimer);

        scrollTimer = setInterval(() => {
            const now = Date.now();
            if (now - lastScrollTime < config.scrollInterval) return;

            lastScrollTime = now;
            window.scrollBy({ top: config.scrollStep, behavior: config.scrollBehavior });
            scrollCount++;

            // Check if max scroll times reached
            if (config.maxScrollTimes > 0 && scrollCount >= config.maxScrollTimes) {
                clearInterval(scrollTimer);
                isScrolling = false;
                atBottomSince = null;
                document.getElementById('toggleScrollBtn').textContent = t('startScroll');
                document.getElementById('toggleScrollBtn').classList.remove('stop');
                console.log('Reached max scroll times');
                return;
            }

            // Check if at page bottom
            const isAtBottom = window.innerHeight + Math.ceil(window.scrollY) >= document.documentElement.scrollHeight;
            if (isAtBottom) {
                const currentScrollHeight = document.documentElement.scrollHeight;
                if (currentScrollHeight > lastScrollHeight) {
                    // New content loaded, reset timeout
                    lastScrollHeight = currentScrollHeight;
                    atBottomSince = null;
                    console.log('New content loaded, continuing scroll');
                } else {
                    // No new content, start or continue timeout
                    if (!atBottomSince) {
                        atBottomSince = now;
                    }
                    if (now - atBottomSince >= config.timeoutSeconds * 1000) {
                        // Timeout reached, stop scrolling
                        clearInterval(scrollTimer);
                        isScrolling = false;
                        atBottomSince = null;
                        document.getElementById('toggleScrollBtn').textContent = t('startScroll');
                        document.getElementById('toggleScrollBtn').classList.remove('stop');
                        console.log('Timeout reached, no new content, stopping scroll');
                        return;
                    }
                    // Continue trying to scroll to trigger loading
                    console.log('At bottom, attempting to trigger more content');
                }
            } else {
                // Not at bottom, reset timeout
                atBottomSince = null;
            }
        }, config.scrollInterval / 2);
    }

    // Detect manual scrolling to pause auto-scroll
    let manualScrollTimeout = null;
    window.addEventListener('scroll', () => {
        if (isScrolling && Date.now() - lastScrollTime > config.scrollInterval * 2) {
            clearInterval(scrollTimer);
            clearTimeout(manualScrollTimeout);
            manualScrollTimeout = setTimeout(() => {
                if (isScrolling) startScroll();
            }, 1000);
        }
    });

    // Save configuration
    function saveConfig() {
        const scrollStep = parseInt(document.getElementById('scrollStepInput').value);
        const scrollInterval = parseInt(document.getElementById('scrollIntervalInput').value);
        const scrollBehavior = document.getElementById('scrollBehaviorSelect').value;
        const panelPosition = document.getElementById('panelPositionSelect').value;
        const maxScrollTimes = parseInt(document.getElementById('maxScrollTimesInput').value);
        const timeoutSeconds = parseInt(document.getElementById('timeoutSecondsInput').value);
        const language = document.getElementById('languageSelect').value;

        // Validate inputs
        if (isNaN(scrollStep) || scrollStep < 1) {
            alert(t('invalidScrollStep'));
            return;
        }
        if (isNaN(scrollInterval) || scrollInterval < 10) {
            alert(t('invalidScrollInterval'));
            return;
        }
        if (!['smooth', 'auto'].includes(scrollBehavior)) {
            alert(t('invalidScrollBehavior'));
            return;
        }
        if (!['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(panelPosition)) {
            alert(t('invalidPanelPosition'));
            return;
        }
        if (isNaN(maxScrollTimes) || maxScrollTimes < 0) {
            alert(t('invalidMaxScrollTimes'));
            return;
        }
        if (isNaN(timeoutSeconds) || timeoutSeconds < 1) {
            alert(t('invalidTimeoutSeconds'));
            return;
        }
        if (!['zh-CN', 'en', 'es', 'ja'].includes(language)) {
            alert('Invalid language.');
            return;
        }

        // Update config
        config.scrollStep = scrollStep;
        config.scrollInterval = scrollInterval;
        config.scrollBehavior = scrollBehavior;
        config.panelPosition = panelPosition;
        config.maxScrollTimes = maxScrollTimes;
        config.timeoutSeconds = timeoutSeconds;
        config.language = language;

        // Save to storage
        GM_setValue('scrollStep', config.scrollStep);
        GM_setValue('scrollInterval', config.scrollInterval);
        GM_setValue('scrollBehavior', config.scrollBehavior);
        GM_setValue('panelPosition', config.panelPosition);
        GM_setValue('maxScrollTimes', config.maxScrollTimes);
        GM_setValue('timeoutSeconds', config.timeoutSeconds);
        GM_setValue('language', config.language);

        // Update panel position
        const controlPanel = document.getElementById('scrollControlPanel');
        controlPanel.style.cssText = `
            position: fixed;
            ${getPanelPositionStyles(config.panelPosition)}
            background: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border-radius: 5px;
        `;

        // Close config panel
        closeConfigPanel();

        // Recreate panels to update language
        document.getElementById('scrollControlPanel').remove();
        document.getElementById('scrollConfigPanel').remove();
        createControlPanel();
        createConfigPanel();

        // Notify user
        alert(t('saveSuccess'));

        // Restart scrolling if active
        if (isScrolling) {
            clearInterval(scrollTimer);
            scrollCount = 0;
            lastScrollHeight = document.documentElement.scrollHeight;
            atBottomSince = null;
            startScroll();
        }
    }

    // Initialize
    createControlPanel();
    createConfigPanel();
})();
