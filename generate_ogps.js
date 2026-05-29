const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const typesDB = {
    "LHDM": "王道エンターテイナー",
    "LHDC": "熱血オタク解説者",
    "LHSM": "癒やしの観察者",
    "LHSC": "書斎の賢者",
    "LPDM": "マシンガン毒舌",
    "LPDC": "反骨の扇動者",
    "LPSM": "冷徹なご意見番",
    "LPSC": "地下の批評家",
    "AHDM": "天真爛漫な天然",
    "AHDC": "カオスな配信者",
    "AHSM": "不思議な隣人",
    "AHSC": "前衛的な詩人",
    "APDM": "暴走リアクション",
    "APDC": "伝説のアングラ",
    "APSM": "不気味なコント師",
    "APSC": "深淵を覗く者"
};

const illustrationMap = {
    "LHDM": "lhdm.png", "LHDC": "lhdc.png", "LHSM": "lhsm.png", "LHSC": "lhsc.png",
    "LPDM": "lpdm.png", "LPDC": "lpdc.png", "LPSM": "lpsm.png", "LPSC": "lpsc.png",
    "AHDM": "ahdm.png", "AHDC": "ahdc.png", "AHSM": "ahsm.png", "AHSC": "ahsc.png",
    "APDM": "lpdm.png", "APDC": "lpsc.png", "APSM": "lpsm.png", "APSC": "ahsm.png"
};

const labels = {
    "LA": ["Logic (理)", "Absurd (乱)"],
    "HP": ["Harmony (和)", "Poison (毒)"],
    "SD": ["Static (静)", "Dynamic (動)"],
    "MC": ["Mass (衆)", "Core (深)"]
};

const ogpDir = path.join(__dirname, 'ogp_images');
if (!fs.existsSync(ogpDir)) {
    fs.mkdirSync(ogpDir);
}

function generateHTML(typeCode, typeName) {
    const illustrationFile = illustrationMap[typeCode];
    const absPath = path.resolve(__dirname, 'images', 'illustrations', illustrationFile);
    
    // Convert to Base64 to ensure Puppeteer can load the local image reliably
    const imgBase64 = fs.readFileSync(absPath, { encoding: 'base64' });
    const imgUrl = `data:image/png;base64,${imgBase64}`;

    const barsHTML = [
        { axis: "LA", val: typeCode[0] },
        { axis: "HP", val: typeCode[1] },
        { axis: "SD", val: typeCode[2] },
        { axis: "MC", val: typeCode[3] }
    ].map(item => {
        const isLeft = ["L", "H", "S", "M"].includes(item.val);
        const lblLeft = labels[item.axis][0];
        const lblRight = labels[item.axis][1];

        // Highlight colors
        const activeColorLeft = '#3b82f6';
        const activeColorRight = '#ef4444';
        const passiveColor = '#94a3b8';

        return `
        <div class="row">
            <div class="labels">
                <span style="color: ${isLeft ? activeColorLeft : passiveColor}; font-weight: ${isLeft ? '800' : '400'}; font-size: 20px;">${lblLeft}</span>
                <span style="color: ${!isLeft ? activeColorRight : passiveColor}; font-weight: ${!isLeft ? '800' : '400'}; font-size: 20px;">${lblRight}</span>
            </div>
            <div class="bar-bg">
                <div class="center-line"></div>
                ${isLeft ?
                `<div class="fill-left"></div>` :
                `<div class="fill-right"></div>`
            }
            </div>
        </div>
        `;
    }).join("");

    return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700;900&display=swap');
            body {
                width: 1200px;
                height: 630px;
                margin: 0;
                background: radial-gradient(circle at top left, #f8fafc, #e2e8f0);
                font-family: 'Zen Kaku Gothic New', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #1e293b;
            }
            .card {
                background: #ffffff;
                width: 1080px;
                height: 560px;
                border-radius: 40px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.08);
                display: flex;
                flex-direction: row;
                padding: 40px 50px;
                box-sizing: border-box;
                border: 2px solid #fff;
                gap: 40px;
                align-items: center;
            }
            .left-col {
                width: 360px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .right-col {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 540px;
            }
            .header {
                text-align: left;
                margin-bottom: 20px;
            }
            .site-title {
                font-size: 18px;
                color: #64748b;
                font-weight: 700;
                letter-spacing: 2px;
                margin-bottom: 5px;
            }
            .type-code {
                font-size: 28px;
                letter-spacing: 8px;
                color: #94a3b8;
                font-weight: 900;
                margin-bottom: 0px;
            }
            .type-title {
                font-size: 42px;
                font-weight: 900;
                color: #1e293b;
                line-height: 1.2;
            }
            .charts {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .row {
                width: 100%;
            }
            .labels {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                align-items: flex-end;
            }
            .bar-bg {
                width: 100%;
                height: 16px;
                background: #e2e8f0;
                border-radius: 8px;
                position: relative;
            }
            .center-line {
                position: absolute;
                left: 50%;
                top: 0;
                bottom: 0;
                width: 4px;
                background: #fff;
                transform: translateX(-50%);
                z-index: 2;
            }
            .fill-left {
                position: absolute;
                right: 50%;
                top: 0;
                bottom: 0;
                width: 35%;
                background: linear-gradient(90deg, #60a5fa, #3b82f6);
                border-radius: 8px 0 0 8px;
                z-index: 1;
            }
            .fill-right {
                position: absolute;
                left: 50%;
                top: 0;
                bottom: 0;
                width: 35%;
                background: linear-gradient(90deg, #ef4444, #f87171);
                border-radius: 0 8px 8px 0;
                z-index: 1;
            }
            .illustration {
                width: 340px;
                height: 340px;
                object-fit: cover;
                border-radius: 24px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                border: 6px solid #ffffff;
                background: #ffffff;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="left-col">
                <img class="illustration" src="${imgUrl}" alt="illustration">
            </div>
            <div class="right-col">
                <div class="header">
                    <div class="site-title">お笑い16タイプ診断</div>
                    <div class="type-code">${typeCode}</div>
                    <div class="type-title">「${typeName}」</div>
                </div>
                <div class="charts">
                    ${barsHTML}
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

async function main() {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });

    const types = Object.keys(typesDB);
    for (const typeCode of types) {
        const html = generateHTML(typeCode, typesDB[typeCode]);
        await page.setContent(html, { waitUntil: 'load' });
        await new Promise(r => setTimeout(r, 600));

        const outPath = path.join(ogpDir, `${typeCode}.png`);
        await page.screenshot({ path: outPath });
        console.log(`Generated: ${typeCode}.png`);
    }

    await browser.close();
    console.log("All 16 OGP images generated successfully!");
}

main().catch(console.error);
