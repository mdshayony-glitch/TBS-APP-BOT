(function() {
    const containerId = 'candle-glitch-prank-bot';
    let existing = document.getElementById(containerId);
    if (existing) {
        existing.style.display = (existing.style.display === 'none' ? 'block' : 'none');
        return;
    }

    const container = document.createElement('div');
    container.id = containerId;
    container.innerHTML = `
        <div id="glitch-main-panel" style="
            position: fixed;
            top: 80px;
            left: 30px;
            z-index: 999999;
            background: #0b161c;
            color: #00ffcc;
            border: 2px solid #00ffcc;
            border-radius: 14px;
            width: 320px;
            font-family: sans-serif;
            box-shadow: 0 15px 40px rgba(0,0,0,0.9);
            user-select: none;
            touch-action: none;
            overflow: hidden;
        ">
            <!-- Header (Draggable) -->
            <div id="glitch-drag-header" style="
                background: rgba(0,255,204,0.1);
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: grab;
                border-bottom: 1px solid rgba(0,255,204,0.2);
                font-weight: bold;
                font-size: 13px;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #fff;">CANDLE GLITCH</span>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <span style="font-size: 9px; background: #00ffcc; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold;">v1.1</span>
                    <button id="glitch-close-btn" style="background:none; border:none; color:#ff4444; font-weight:bold; cursor:pointer; font-size:14px;">×</button>
                </div>
            </div>

            <!-- Body Content -->
            <div style="padding: 15px; display: flex; flex-direction: column; gap: 12px;">
                <div style="font-size: 11px; color: #8ab4f8; display: flex; justify-content: space-between; align-items: center;">
                    <span>TARGET PAIR</span>
                    <span style="background: #00ffcc; color: #000; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">● LIVE</span>
                </div>
                
                <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(0,255,204,0.3); padding: 9px 12px; border-radius: 6px; font-size: 13px; color: #fff; font-weight: bold;">
                    USD/BDT (OTC)
                </div>

                <div>
                    <div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">ROUND LEVEL / TARGET PRICE</div>
                    <input type="text" id="glitch-target-input" value="128.350" style="
                        width: 100%;
                        background: rgba(0,0,0,0.7);
                        border: 1px solid rgba(0,255,204,0.4);
                        border-radius: 6px;
                        color: #00ffcc;
                        padding: 9px 10px;
                        font-size: 14px;
                        box-sizing: border-box;
                        outline: none;
                        font-weight: bold;
                    ">
                </div>

                <div>
                    <div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">GLITCH DELAY (SEC)</div>
                    <input type="text" id="glitch-time-input" value="10" style="
                        width: 100%;
                        background: rgba(0,0,0,0.7);
                        border: 1px solid rgba(0,255,204,0.4);
                        border-radius: 6px;
                        color: #fff;
                        padding: 9px 10px;
                        font-size: 14px;
                        box-sizing: border-box;
                        outline: none;
                    ">
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 10px; margin-top: 2px;">
                    <button id="glitch-start-btn" style="
                        flex: 1;
                        background: linear-gradient(135deg, #0088cc, #00ffcc);
                        border: none;
                        border-radius: 6px;
                        color: #000;
                        font-weight: bold;
                        padding: 10px;
                        cursor: pointer;
                        font-size: 12px;
                        box-shadow: 0 0 10px rgba(0,255,204,0.3);
                    ">INJECT GLITCH</button>
                    
                    <button id="glitch-stop-btn" style="
                        flex: 1;
                        background: linear-gradient(135deg, #cc0000, #ff3333);
                        border: none;
                        border-radius: 6px;
                        color: #fff;
                        font-weight: bold;
                        padding: 10px;
                        cursor: pointer;
                        font-size: 12px;
                    ">STOP BOT</button>
                </div>

                <!-- Status Box -->
                <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,204,0.2); border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px;">
                        <span id="glitch-status-text" style="color: #00ffcc; font-weight: bold;">● STANDBY</span>
                        <span style="color: #aaa;">PUSHES: <span id="glitch-push-count" style="color: #fff;">0</span></span>
                    </div>
                    <div id="glitch-sub-status" style="font-size: 10px; color: #8ab4f8;">SYSTEM READY - TARGET LEVEL PENDING</div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // --- Dragging Logic (Smooth) ---
    const header = document.getElementById('glitch-drag-header');
    const panel = document.getElementById('glitch-main-panel');
    let isDragging = false, startX, startY, initialX, initialY;

    header.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = panel.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        header.setPointerCapture(e.pointerId);
    });

    header.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panel.style.left = (initialX + dx) + 'px';
        panel.style.top = (initialY + dy) + 'px';
    });

    header.addEventListener('pointerup', (e) => {
        isDragging = false;
        try { header.releasePointerCapture(e.pointerId); } catch(err) {}
    });

    document.getElementById('glitch-close-btn').addEventListener('click', () => {
        container.remove();
    });

    // --- Advanced Candle Glitch Engine ---
    const startBtn = document.getElementById('glitch-start-btn');
    const stopBtn = document.getElementById('glitch-stop-btn');
    const targetInput = document.getElementById('glitch-target-input');
    const statusText = document.getElementById('glitch-status-text');
    const subStatus = document.getElementById('glitch-sub-status');
    const pushCountEl = document.getElementById('glitch-push-count');
    let glitchInterval = null;
    let pushCounter = 0;

    startBtn.addEventListener('click', () => {
        const targetVal = targetInput.value;
        if (!targetVal) return;

        startBtn.style.background = "#00ff66";
        startBtn.innerText = "INJECTING...";
        statusText.innerText = "● ACTIVE";
        statusText.style.color = "#00ff66";
        subStatus.innerText = "INJECTING GLITCH - PUSHING CANDLE...";

        // ১. স্ক্রিনের সমস্ত প্রাইস টেক্সট হুবহু টার্গেট ভ্যালুতে রূপান্তর করা
        const priceElements = document.querySelectorAll('.price-display, .chart-value, span[class*="price"], .strike-price, .deal-value, text, .current-rate');
        priceElements.forEach(el => {
            if(!el.dataset.orig) el.dataset.orig = el.innerText || el.textContent;
            if(el.tagName.toLowerCase() === 'text') {
                el.textContent = targetVal;
            } else {
                el.innerText = targetVal;
            }
        });

        // ২. মেইন ক্যান্ডেল ও চার্ট গ্রাফকে ওপরের দিকে টানার জন্য সুনির্দিষ্ট সিএসএস ও স্কেলিং ইফেক্ট
        const activeCharts = document.querySelectorAll('canvas, svg, .candles-container, .chart-markup-layer');
        activeCharts.forEach(el => {
            el.style.transformOrigin = "bottom center";
            el.style.transform = "translateY(-180px) scaleY(1.8)";
            el.style.transition = "transform 0.6s cubic-bezier(0.1, 0.9, 0.2, 1)";
        });

        // ৩. টিকটকের মতো লাইভ কাউন্টার শুরু করা
        glitchInterval = setInterval(() => {
            pushCounter++;
            pushCountEl.innerText = pushCounter;
        }, 1000);
    });

    stopBtn.addEventListener('click', () => {
        if (glitchInterval) clearInterval(glitchInterval);
        pushCounter = 0;
        pushCountEl.innerText = "0";

        startBtn.style.background = "linear-gradient(135deg, #0088cc, #00ffcc)";
        startBtn.innerText = "INJECT GLITCH";
        statusText.innerText = "● STANDBY";
        statusText.style.color = "#00ffcc";
        subStatus.innerText = "SYSTEM READY - TARGET LEVEL PENDING";

        const priceElements = document.querySelectorAll('.price-display, .chart-value, span[class*="price"], .strike-price, .deal-value, text, .current-rate');
        priceElements.forEach(el => {
            if(el.dataset.orig) {
                if(el.tagName.toLowerCase() === 'text') {
                    el.textContent = el.dataset.orig;
                } else {
                    el.innerText = el.dataset.orig;
                }
            }
        });

        const activeCharts = document.querySelectorAll('canvas, svg, .candles-container, .chart-markup-layer');
        activeCharts.forEach(el => {
            el.style.transform = "none";
        });
    });
})();
