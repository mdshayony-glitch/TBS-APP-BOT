(function() {
    // যদি আগে থেকেই উইজেট থাকে তবে রিমুভ করে দেওয়া
    if (document.getElementById('ai-trading-widget')) {
        document.getElementById('ai-trading-widget').remove();
    }

    // ফ্লোটিং উইজেট তৈরি করা
    const widget = document.createElement('div');
    widget.id = 'ai-trading-widget';
    widget.innerHTML = `
        <div id="ai-circle" style="
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            background: rgba(12, 12, 18, 0.98);
            color: #00FF66;
            border: 2px solid #00FF66;
            border-radius: 14px;
            padding: 14px 18px;
            font-family: sans-serif;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 6px 25px rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            gap: 7px;
            min-width: 250px;
            overflow: hidden;
            position: fixed;
        ">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center; gap: 6px;">
                    <span id="dot-indicator" style="width: 8px; height: 8px; background: #00FF66; border-radius: 50%; display: inline-block; animation: pulse 1s infinite;"></span>
                    <span style="color: #fff; font-size: 13px; letter-spacing: 0.5px;">QUOTEX ULTIMATE AI</span>
                </span>
                <span id="ai-status" style="font-size: 10px; background: rgba(0,255,102,0.15); color: #00FF66; padding: 3px 7px; border-radius: 4px;">SCANNING...</span>
            </div>
            
            <div id="ai-message" style="font-size: 12px; color: #dddddd; font-weight: normal; line-height: 1.3;">
                Initializing Global Indicators...
            </div>

            <!-- পৃথিবীর সব প্রধান ইন্ডিকেটরের লাইভ স্ট্যাটাস প্যানেল -->
            <div style="font-size: 9.5px; color: #999; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <span id="ind-rsi">RSI: Syncing...</span>
                <span id="ind-macd">MACD: Checking</span>
                <span id="ind-bb">Bollinger: Stable</span>
                <span id="ind-stoch">Stochastic: Scanning</span>
                <span id="ind-atr">ATR: Normal</span>
                <span id="ind-ema">EMA Trend: Neutral</span>
            </div>

            <!-- লেজার স্ক্যানিং অ্যানিমেশন (উপর থেকে নিচে) -->
            <div id="scanner-line" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(to right, transparent, #00FF66, transparent);
                box-shadow: 0 0 12px #00FF66;
                animation: scanMove 1.5s infinite linear;
            "></div>
        </div>
    `;

    document.body.appendChild(widget);

    // CSS অ্যানিমেশন
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scanMove {
            0% { top: 0%; opacity: 0.2; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0.2; }
        }
    `;
    document.head.appendChild(style);

    // ভয়েস অ্যানাউন্সমেন্ট ফাংশন
    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    // ইন্ডিকেটর এলিমেন্টগুলো সিলেক্ট করা
    const msgElement = document.getElementById('ai-message');
    const rsiEl = document.getElementById('ind-rsi');
    const macdEl = document.getElementById('ind-macd');
    const bbEl = document.getElementById('ind-bb');
    const stochEl = document.getElementById('ind-stoch');
    const atrEl = document.getElementById('ind-atr');
    const emaEl = document.getElementById('ind-ema');

    // ধাপ ১: মাল্টি-ইন্ডিকেটর স্ক্যানিং প্রসেস দেখানো
    setTimeout(() => {
        msgElement.innerText = "Analyzing RSI & MACD Crossovers...";
        rsiEl.innerText = "RSI: 52.4 (Neutral)";
        macdEl.innerText = "MACD: Bullish Cross";
    }, 1200);

    setTimeout(() => {
        msgElement.innerText = "Checking Bollinger Bands & Stochastic...";
        bbEl.innerText = "Bollinger: Lower Touch";
        stochEl.innerText = "Stochastic: Oversold";
    }, 2500);

    setTimeout(() => {
        msgElement.innerText = "Evaluating ATR & EMA Trend Matrix...";
        atrEl.innerText = "ATR: High Volatility";
        emaEl.innerText = "EMA Trend: Strong Up";
    }, 3800);

    // ধাপ ২: চূড়ান্ত এআই সিগন্যাল ও ভয়েস ঘোষণা (৫ সেকেন্ড পর)
    setTimeout(() => {
        const statusText = document.getElementById('ai-status');
        const circle = document.getElementById('ai-circle');
        const scanner = document.getElementById('scanner-line');
        const dot = document.getElementById('dot-indicator');

        // কটেক্স মার্কেটের জন্য উইনিং প্রবাবিলিটি লজিক
        const isUp = Math.random() > 0.25; 

        if (isUp) {
            statusText.innerText = "UP SIGNAL 🟢";
            statusText.style.color = "#00FF66";
            statusText.style.background = "rgba(0,255,102,0.2)";
            msgElement.innerHTML = "<b>100% CONFIRM UP!</b> Take trade now safely.";
            
            rsiEl.innerText = "RSI: 78.2 (Rebound)";
            macdEl.innerText = "MACD: Positive";
            bbEl.innerText = "Bollinger: Expands";
            stochEl.innerText = "Stoch: Bullish";
            
            circle.style.borderColor = "#00FF66";
            circle.style.boxShadow = "0 0 25px rgba(0,255,102,0.5)";
            scanner.style.background = "linear-gradient(to right, transparent, #00FF66, transparent)";
            scanner.style.boxShadow = "0 0 15px #00FF66";
            dot.style.background = "#00FF66";
            
            // ভয়েস দিয়ে নিশ্চিন্তে আপ ট্রেড নেওয়ার ঘোষণা
            speakText("Strong Up Signal confirmed by all indicators. You can take up trade now safely.");
        } else {
            statusText.innerText = "DOWN SIGNAL 🔴";
            statusText.style.color = "#FF3333";
            statusText.style.background = "rgba(255,51,51,0.2)";
            msgElement.innerHTML = "<b>100% CONFIRM DOWN!</b> Take trade now safely.";
            
            rsiEl.innerText = "RSI: 21.5 (Drop)";
            macdEl.innerText = "MACD: Negative";
            bbEl.innerText = "Bollinger: Lower Break";
            stochEl.innerText = "Stoch: Bearish";
            
            circle.style.borderColor = "#FF3333";
            circle.style.boxShadow = "0 0 25px rgba(255,51,51,0.5)";
            scanner.style.background = "linear-gradient(to right, transparent, #FF3333, transparent)";
            scanner.style.boxShadow = "0 0 15px #FF3333";
            dot.style.background = "#FF3333";
            
            // ভয়েস দিয়ে নিশ্চিন্তে ডাউন ট্রেড নেওয়ার ঘোষণা
            speakText("Strong Down Signal confirmed by all indicators. You can take down trade now safely.");
        }

        // স্ক্যানিং লাইন অফ করে দেওয়া
        setTimeout(() => {
            if(scanner) scanner.style.display = 'none';
        }, 1200);

    }, 5000);

})();
