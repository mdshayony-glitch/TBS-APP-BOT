(function() {
    // টগল করার জন্য আইডি চেক করা
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
            <!-- Header with Logo and Title (Draggable) -->
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
                letter-spacing: 0.5px;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <!-- লোগো আইকন (অনলাইন থেকে সরাসরি বা এসভিজি দিয়ে তৈরি) -->
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
                    <span>MARKET ASSET</span>
                    <span style="color: #00ffcc;">● STANDBY</span>
                </div>
                
                <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,255,204,0.3); padding: 8px 12px; border-radius: 6px; font-size: 14px; color: #fff; font-weight: bold;">
                    AUD/USD (OTC)
                </div>

                <div>
                    <div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">ROUND NUMBER / TARGET</div>
                    <input type="text" id="sitb-input-val" value="0.75000" style="
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
                    <input type="text" value="6" style="
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
                    [ CLICK HEADER TO HIDE / DRAG TO MOVE ]
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // --- Dragging Logic (মাউস বা আঙুল দিয়ে প্যানেল যেকোনো জায়গায় সরানোর জন্য) ---
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

    // --- Start / Stop Logic ---
    const startBtn = document.getElementById('sitb-start-btn');
    const stopBtn = document.getElementById('sitb-stop-btn');
    const inputVal = document.getElementById('sitb-input-val');

    startBtn.addEventListener('click', () => {
        const targetNumber = inputVal.value;
        startBtn.style.background = "#00ff66";
        startBtn.innerText = "RUNNING...";
        alert("বট স্টার্ট হয়েছে! টার্গেট প্রাইস: " + targetNumber);
    });

    stopBtn.addEventListener('click', () => {
        startBtn.style.background = "linear-gradient(135deg, #0088cc, #00ffcc)";
        startBtn.innerText = "START";
        alert("বট স্টপ করা হয়েছে!");
    });
})();
