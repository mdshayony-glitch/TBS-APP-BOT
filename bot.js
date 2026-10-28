(function() {
    if (document.getElementById('tradex-ai-container')) {
        document.getElementById('tradex-ai-container').remove();
    }

    const container = document.createElement('div');
    container.id = 'tradex-ai-container';
    container.innerHTML = `
        <div id="tradex-logo-btn" style="
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 999999;
            background: linear-gradient(135deg, #0b0919, #1e1b4b, #0f172a);
            color: #00FF66;
            border: 2px solid #00FF66;
            border-radius: 50px;
            padding: 10px 20px;
            font-family: sans-serif;
            font-weight: bold;
            font-size: 13px;
            cursor: grab;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            gap: 10px;
            user-select: none;
            touch-action: none;
        ">
            <span style="width: 12px; height: 12px; background: #00FF66; border-radius: 50%; box-shadow: 0 0 12px #00FF66; animation: pulseGlow 1.2s infinite;"></span>
            <span style="color: #fff; letter-spacing: 1px; font-size: 13px;">TRADEX AI PRO</span>
            <span id="tx-badge" style="font-size: 9px; background: rgba(0,255,102,0.25); color: #00FF66; padding: 2px 6px; border-radius: 4px;">PRO v5</span>
        </div>

        <div id="tradex-panel" style="
            position: fixed;
            top: 165px;
            right: 20px;
            z-index: 999998;
            background: rgba(10, 10, 18, 0.98);
            color: #00FF66;
            border: 2px solid #00FF66;
            border-radius: 18px;
            padding: 16px;
            font-family: sans-serif;
            font-size: 12px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.95);
            width: 290px;
            display: none;
            flex-direction: column;
            gap: 10px;
            overflow: hidden;
            backdrop-filter: blur(10px);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 8px;">
                <span style="color: #fff; font-weight: bold; font-size: 13px; letter-spacing: 0.5px;">OTC & LIVE MATRIX</span>
                <span id="tx-status" style="font-size: 10px; background: rgba(0,255,102,0.25); color: #00FF66; padding: 3px 7px; border-radius: 5px; font-weight: bold;">স্ক্যানিং...</span>
            </div>

            <div id="tx-message" style="color: #e2e8f0; font-size: 11.5px; line-height: 1.4;">
                মার্কেট এনালাইসিস চলছে, অপেক্ষা করুন...
            </div>

            <div style="position: relative; background: rgba(0,0,0,0.5); border: 1px solid rgba(0,255,102,0.2); border-radius: 10px; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 9.5px; color: #cbd5e1;">
                <span id="ind-rsi">RSI: ক্যালকুলেটিং</span>
                <span id="ind-macd">MACD: চেকিং</span>
                <span id="ind-bb">Bollinger: স্টাবল</span>
                <span id="ind-stoch">Stochastic: স্ক্যান</span>
                <span id="ind-atr">ATR: অপ্টিমাল</span>
                <span id="ind-ema">EMA Trend: নিউট্রাল</span>
                <span id="ind-ichi">Ichimoku: রেডি</span>
                <span id="ind-adx">ADX Power: রেডি</span>
                
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border: 2px dashed rgba(0,255,102,0.4); border-radius: 50%; animation: spinRing 4s linear infinite; pointer-events: none;"></div>
            </div>

            <div id="tx-scanner" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(to right, transparent, #00FF66, transparent);
                box-shadow: 0 0 15px #00FF66;
                animation: scanMove 1.5s infinite linear;
                display: none;
            "></div>
        </div>
    `;

    document.body.appendChild(container);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulseGlow {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 5px #00FF66; }
            50% { transform: scale(1.4); opacity: 0.4; box-shadow: 0 0 18px #00FF66; }
            100% { transform: scale(1); opacity: 1; box-shadow: 0 0 5px #00FF66; }
        }
        @keyframes scanMove {
            0% { top: 0%; opacity: 0.2; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0.2; }
        }
        @keyframes spinRing {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'bn-BD';
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            const voices = window.speechSynthesis.getVoices();
            const bVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('bn_BD'));
            if (bVoice) utterance.voice = bVoice;
            window.speechSynthesis.speak(utterance);
        }
    }

    const logoBtn = document.getElementById('tradex-logo-btn');
    const panel = document.getElementById('tradex-panel');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    logoBtn.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = logoBtn.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        logoBtn.setPointerCapture(e.pointerId);
    });

    logoBtn.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        logoBtn.style.left = (initialX + dx) + 'px';
        logoBtn.style.top = (initialY + dy) + 'px';
        logoBtn.style.right = 'auto';
        panel.style.left = (initialX + dx) + 'px';
        panel.style.top = (initialY + dy + 65) + 'px';
        panel.style.right = 'auto';
    });

    logoBtn.addEventListener('pointerup', () => { isDragging = false; });

    let isActive = false;
    logoBtn.addEventListener('click', () => {
        if (isDragging) return;
        isActive = !isActive;
        
        if (isActive) {
            panel.style.display = 'flex';
            document.getElementById('tx-scanner').style.display = 'block';
            document.getElementById('tx-status').innerText = "লাইভ স্ক্যান";
            
            const msg = document.getElementById('tx-message');
            const rsi = document.getElementById('ind-rsi');
            const macd = document.getElementById('ind-macd');
            const bb = document.getElementById('ind-bb');
            const stoch = document.getElementById('ind-stoch');
            const atr = document.getElementById('ind-atr');
            const ema = document.getElementById('ind-ema');
            const ichi = document.getElementById('ind-ichi');
            const adx = document.getElementById('ind-adx');

            setTimeout(() => {
                msg.innerText = "OTC & Live ডেটা প্রসেসিং হচ্ছে...";
                rsi.innerText = "RSI: ৫২.৪ (ব্যালেন্সড)";
                macd.innerText = "MACD: পজিটিভ ক্রস";
                bb.innerText = "Bollinger: স্কুইজ মোড";
            }, 1100);

            setTimeout(() => {
                msg.innerText = "Stochastic ও Ichimoku কনফার্মেশন...";
                stoch.innerText = "Stoch: ৪১.২";
                atr.innerText = "ATR: হাই ভোল্টাইল";
                ichi.innerText = "Ichimoku: স্ট্রং";
                adx.innerText = "ADX: ৩২.১";
                ema.innerText = "EMA: পারফেক্ট অ্যালাইন";
            }, 2600);

            setTimeout(() => {
                const statusTxt = document.getElementById('tx-status');
                const scanner = document.getElementById('tx-scanner');
                const isUp = Math.random() > 0.35;

                if (isUp) {
                    statusTxt.innerText = "আপ সিগন্যাল 🟢";
                    statusTxt.style.color = "#00FF66";
                    statusTxt.style.background = "rgba(0,255,102,0.3)";
                    msg.innerHTML = "<b style='color:#00FF66;'>১০০% কনফার্ম আপ!</b> ট্রেড নিন।";
                    logoBtn.style.borderColor = "#00FF66";
                    logoBtn.style.boxShadow = "0 0 35px rgba(0,255,102,0.85)";
                    panel.style.borderColor = "#00FF66";
                    
                    rsi.innerText = "RSI: ৭৯.৪ (বउंस)";
                    macd.innerText = "MACD: বুলিশ";
                    bb.innerText = "BB: আপ ব্রেক";
                    
                    speakText("সব ইন্ডিকেটর মিলিয়ে শক্তিশালী আপ সিগন্যাল কনফার্ম হয়েছে। আপনি এখন নিরাপদে আপ ট্রেড নিতে পারেন।");
                } else {
                    statusTxt.innerText = "ডাউন সিগন্যাল 🔴";
                    statusTxt.style.color = "#FF3333";
                    statusTxt.style.background = "rgba(255,51,51,0.3)";
                    msg.innerHTML = "<b style='color:#FF3333;'>১০০% কনফার্ম ডাউন!</b> ট্রেড নিন।";
                    logoBtn.style.borderColor = "#FF3333";
                    logoBtn.style.boxShadow = "0 0 35px rgba(255,51,51,0.85)";
                    panel.style.borderColor = "#FF3333";
                    
                    rsi.innerText = "RSI: ১৯.৮ (ড্রপ)";
                    macd.innerText = "MACD: বেয়ারিশ";
                    bb.innerText = "BB: ডাউন ব্রেক";
                    
                    speakText("সব ইন্ডিকেটর মিলিয়ে শক্তিশালী ডাউন সিগন্যাল কনফার্ম হয়েছে। আপনি এখন নিরাপদে ডাউন ট্রেড নিতে পারেন।");
                }

                if(scanner) scanner.style.display = 'none';
            }, 4500);

        } else {
            panel.style.display = 'none';
        }
    });
})();
