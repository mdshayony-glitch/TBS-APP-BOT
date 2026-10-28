(function() {
    const containerId = 'sitb-tradex-ultimate-bot';
    let existing = document.getElementById(containerId);
    if (existing) {
        existing.style.display = (existing.style.display === 'none' ? 'block' : 'none');
        return;
    }

    const container = document.createElement('div');
    container.id = containerId;
    container.innerHTML = `
        <div id="sitb-main-panel" style="
            position: fixed;
            top: 100px;
            left: 50px;
            z-index: 999999;
            background: linear-gradient(135deg, #091921, #0f2c39, #05131b);
            color: #00ffcc;
            border: 2px solid #00ffcc;
            border-radius: 12px;
            width: 320px;
            font-family: sans-serif;
            box-shadow: 0 15px 40px rgba(0,0,0,0.85);
            user-select: none;
            touch-action: none;
            overflow: hidden;
        ">
            <!-- Header (Super Smooth Draggable) -->
            <div id="sitb-drag-header" style="
                background: rgba(0,255,204,0.15);
                padding: 12px 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: grab;
                border-bottom: 1px solid rgba(0,255,204,0.3);
                font-weight: bold;
                font-size: 12px;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 22px; height: 22px; background: #00ffcc; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #00ffcc;">
                        <span style="color: #000; font-size: 11px; font-weight: bold;">⚡</span>
                    </div>
                    <span style="color: #fff; font-size: 12px;">SITB OFFICIAL</span>
                </div>
                <span style="font-size: 9px; background: #00ffcc; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold;">CRACKED</span>
            </div>

            <!-- Body Content -->
            <div style="padding: 15px; display: flex; flex-direction: column; gap: 12px;">
                <div style="font-size: 11px; color: #8ab4f8; display: flex; justify-content: space-between;">
                    <span>MARKET ASSET</span>
                    <span id="sitb-status" style="color: #00ffcc;">● STANDBY</span>
                </div>
                
                <div id="sitb-live-asset" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,255,204,0.3); padding: 8px 12px; border-radius: 6px; font-size: 14px; color: #fff; font-weight: bold;">
                    অটো ডিটেক্ট...
                </div>

                <div>
                    <div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">ROUND NUMBER / TARGET</div>
                    <input type="text" id="sitb-target-input" value="0.61400" style="
                        width: 100%;
                        background: rgba(0,0,0,0.6);
                        border: 1px solid rgba(0,255,204,0.4);
                        border-radius: 6px;
                        color: #00ffcc;
                        padding: 8px 10px;
                        font-size: 14px;
                        box-sizing: border-box;
                        outline: none;
                    ">
                </div>

                <div>
                    <div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">TIME (SECOND)</div>
                    <input type="text" id="sitb-time-input" value="5" style="
                        width: 100%;
                        background: rgba(0,0,0,0.6);
                        border: 1px solid rgba(0,255,204,0.4);
                        border-radius: 6px;
                        color: #fff;
                        padding: 8px 10px;
                        font-size: 14px;
                        box-sizing: border-box;
                        outline: none;
                    ">
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    <button id="sitb-start-btn" style="
                        flex: 1;
                        background: linear-gradient(135deg, #0088cc, #00ffcc);
                        border: none;
                        border-radius: 6px;
                        color: #000;
                        font-weight: bold;
                        padding: 10px;
                        cursor: pointer;
                        font-size: 13px;
                        box-shadow: 0 0 10px rgba(0,255,204,0.4);
                    ">START</button>
                    
                    <button id="sitb-stop-btn" style="
                        flex: 1;
                        background: linear-gradient(135deg, #cc0000, #ff3333);
                        border: none;
                        border-radius: 6px;
                        color: #fff;
                        font-weight: bold;
                        padding: 10px;
                        cursor: pointer;
                        font-size: 13px;
                    ">STOP</button>
                </div>

                <div style="text-align: center; font-size: 9px; color: #666; margin-top: 5px;">
                    [ ULTIMATE SMOOTH GLITCH v3.0 ]
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // --- Auto Detect Market ---
    const assetBox = document.getElementById('sitb-live-asset');
    function updateAsset() {
        const titleMatch = document.title.match(/[A-Z]{3}\/[A-Z]{3}(\([^)]+\))?/);
        if (titleMatch) {
            assetBox.innerText = titleMatch[0];
        } else {
            const el = document.querySelector('.asset-name, .current-asset, [class*="asset"]');
            if (el && el.innerText) assetBox.innerText = el.innerText.trim();
            else assetBox.innerText = "CAD/CHF (OTC)";
        }
    }
    updateAsset();
    const assetTimer = setInterval(updateAsset, 1000);

    // --- Super Smooth Dragging Logic (Mobile & PC Friendly) ---
    const header = document.getElementById('sitb-drag-header');
    const panel = document.getElementById('sitb-main-panel');
    let isDragging = false, startX, startY, initialX, initialY;

    header.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = panel.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        header.setPointerCapture(e.pointerId);
        header.style.cursor = 'grabbing';
    });

    header.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panel.style.left = (initialX + dx) + 'px';
        panel.style.top = (initialY + dy) + 'px';
        panel.style.right = 'auto';
    });

    header.addEventListener('pointerup', (e) => {
        isDragging = false;
        header.style.cursor = 'grab';
        try { header.releasePointerCapture(e.pointerId); } catch(err) {}
    });

    // --- Glitch Engine ---
    const startBtn = document.getElementById('sitb-start-btn');
    const stopBtn = document.getElementById('sitb-stop-btn');
    const targetInput = document.getElementById('sitb-target-input');
    const statusText = document.getElementById('sitb-status');
    let glitchLoop = null;

    startBtn.addEventListener('click', () => {
        const val = targetInput.value;
        if (!val) return;

        startBtn.style.background = "#00ff66";
        startBtn.innerText = "RUNNING...";
        statusText.innerText = "● GLITCH ACTIVE";
        statusText.style.color = "#00ff66";

        glitchLoop = setInterval(() => {
            const priceEls = document.querySelectorAll('.price-display, .chart-value, span[class*="price"], .strike-price, .deal-value, text');
            priceEls.forEach(el => {
                if(!el.dataset.orig) el.dataset.orig = el.innerText;
                if(el.tagName.toLowerCase() === 'text') {
                    el.textContent = val;
                } else {
                    el.innerText = val;
                }
            });

            const chartSvg = document.querySelectorAll('svg path, canvas');
            chartSvg.forEach(svg => {
                svg.style.transform = "translateY(-50px)";
                svg.style.transition = "transform 0.15s ease-in-out";
            });
        }, 25);
    });

    stopBtn.addEventListener('click', () => {
        if (glitchLoop) clearInterval(glitchLoop);
        if (assetTimer) clearInterval(assetTimer);

        startBtn.style.background = "linear-gradient(135deg, #0088cc, #00ffcc)";
        startBtn.innerText = "START";
        statusText.innerText = "● STANDBY";
        statusText.style.color = "#00ffcc";

        const priceEls = document.querySelectorAll('.price-display, .chart-value, span[class*="price"], .strike-price, .deal-value, text');
        priceEls.forEach(el => {
            if(el.dataset.orig) {
                if(el.tagName.toLowerCase() === 'text') {
                    el.textContent = el.dataset.orig;
                } else {
                    el.innerText = el.dataset.orig;
                }
            }
        });

        const chartSvg = document.querySelectorAll('svg path, canvas');
        chartSvg.forEach(svg => {
            svg.style.transform = "none";
        });
    });
})();
