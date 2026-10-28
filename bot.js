(function() {
    const containerId = 'sitb-tradex-bot-container';
    let existing = document.getElementById(containerId);
    if (existing) {
        existing.style.display = (existing.style.display === 'none' ? 'block' : 'none');
        return;
    }

    const container = document.createElement('div');
    container.id = containerId;
    container.innerHTML = `
        <div id="sitb-panel" style="
            position: fixed;
            top: 100px;
            right: 30px;
            z-index: 999999;
            background: linear-gradient(135deg, #091921, #0f2c39, #05131b);
            color: #00ffcc;
            border: 2px solid #00ffcc;
            border-radius: 12px;
            width: 320px;
            font-family: sans-serif;
            box-shadow: 0 15px 40px rgba(0,0,0,0.85);
            user-select: none;
            overflow: hidden;
        ">
            <!-- Header (Draggable) -->
            <div id="sitb-drag-handle" style="
                background: rgba(0,255,204,0.15);
                padding: 10px 14px;
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
                    <span style="color: #fff; font-size: 12px;">TRADEX AI PRO</span>
                </div>
                <span style="font-size: 9px; background: #00ffcc; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold;">SITB PRO</span>
            </div>

            <!-- Body Content -->
            <div style="padding: 15px; display: flex; flex-direction: column; gap: 12px;">
                <div style="font-size: 11px; color: #8ab4f8; display: flex; justify-content: space-between;">
                    <span>MARKET ASSET (AUTO)</span>
                    <span id="sitb-status" style="color: #00ffcc;">● STANDBY</span>
                </div>
                
                <!-- এখানে লাইভ কারেন্সি অটো শো করবে -->
                <div id="sitb-detected-asset" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,255,204,0.3); padding: 8px 12px; border-radius: 6px; font-size: 14px; color: #fff; font-weight: bold;">
                    स्क্যান হচ্ছে...
                </div>

                <div>
                    <div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">ROUND NUMBER / TARGET</div>
                    <input type="text" id="sitb-input-val" value="0.61500" style="
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
                    <input type="text" id="sitb-time-val" value="6" style="
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
                    [ AUTO MARKET SYNC ACTIVE ]
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // --- Quotex থেকে রিয়েল-টাইম কারেন্সি বা মার্কেট নাম অটো ডিটেক্ট করার ফাংশন ---
    const assetBox = document.getElementById('sitb-detected-asset');
    function detectLiveAsset() {
        // Quotex এর পেজে থাকা কারেন্সি এলিমেন্টগুলো খোঁজার ট্রাই করবে
        const selectors = ['.asset-name', '.current-asset', '[class*="asset"]', '.chart-title', 'div[class*="symbol"]'];
        let foundName = "";
        
        for (let sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText && el.innerText.length < 15 && el.innerText.includes('/')) {
                foundName = el.innerText.trim();
                break;
            }
        }
        
        // যদি সরাসরি না পায়, পেজের টাইটেল বা অন্য জায়গা থেকে রিড করার চেষ্টা করবে
        if (!foundName) {
            const titleMatch = document.title.match(/[A-Z]{3}\/[A-Z]{3}(\([^)]+\))?/);
            if (titleMatch) foundName = titleMatch[0];
        }

        assetBox.innerText = foundName ? foundName : "AUD/USD (OTC)";
    }

    // প্রতি ১ সেকেন্ড পর পর মার্কেট চেক করে আপডেট করবে
    detectLiveAsset();
    const assetInterval = setInterval(detectLiveAsset, 1000);

    // --- Dragging Logic ---
    const header = document.getElementById('sitb-drag-handle');
    const panel = document.getElementById('sitb-panel');
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
        panel.style.right = 'auto';
    });

    header.addEventListener('pointerup', () => { isDragging = false; });

    // --- Glitch Price Override & Simulation Logic ---
    const startBtn = document.getElementById('sitb-start-btn');
    const stopBtn = document.getElementById('sitb-stop-btn');
    const inputVal = document.getElementById('sitb-input-val');
    const statusText = document.getElementById('sitb-status');
    let glitchInterval = null;

    startBtn.addEventListener('click', () => {
        const targetVal = parseFloat(inputVal.value);
        if (isNaN(targetVal)) {
            alert('সঠিক কোনো নাম্বার দিন!');
            return;
        }

        startBtn.style.background = "#00ff66";
        startBtn.innerText = "RUNNING...";
        statusText.innerText = "● GLITCH ACTIVE";
        statusText.style.color = "#00ff66";

        // Quotex এর চার্ট এবং প্রাইস এলিমেন্টগুলোতে গ্লিচ ফোর্স করে টার্গেট ভ্যালুতে নিয়ে যাওয়া
        glitchInterval = setInterval(() => {
            const priceElements = document.querySelectorAll('.price-display, .chart-value, span[class*="price"], .strike-price');
            priceElements.forEach(el => {
                if(!el.dataset.original) el.dataset.original = el.innerText;
                el.innerText = targetVal.toFixed(5);
            });
        }, 100);

        console.log("Glitch Started for target: " + targetVal);
    });

    stopBtn.addEventListener('click', () => {
        if (glitchInterval) clearInterval(glitchInterval);
        if (assetInterval) clearInterval(assetInterval);
        
        startBtn.style.background = "linear-gradient(135deg, #0088cc, #00ffcc)";
        startBtn.innerText = "START";
        statusText.innerText = "● STANDBY";
        statusText.style.color = "#00ffcc";

        // আগের আসল প্রাইস ফিরিয়ে আনা
        const priceElements = document.querySelectorAll('.price-display, .chart-value, span[class*="price"], .strike-price');
        priceElements.forEach(el => {
            if(el.dataset.original) el.innerText = el.dataset.original;
        });

        console.log("Glitch Stopped.");
    });
})();
