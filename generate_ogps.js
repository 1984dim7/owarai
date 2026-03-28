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
                <span style="color: ${isLeft ? activeColorLeft : passiveColor}; font-weight: ${isLeft ? '800' : '400'}; font-size: 24px;">${lblLeft}</span>
                <span style="color: ${!isLeft ? activeColorRight : passiveColor}; font-weight: ${!isLeft ? '800' : '400'}; font-size: 24px;">${lblRight}</span>
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
                width: 1000px;
                height: 540px;
                border-radius: 40px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.08);
                display: flex;
                flex-direction: column;
                padding: 40px 60px;
                box-sizing: border-box;
                border: 2px solid #fff;
            }
            .header {
                text-align: center;
                margin-bottom: 25px;
            }
            .site-title {
                font-size: 20px;
                color: #64748b;
                font-weight: 700;
                letter-spacing: 2px;
                margin-bottom: 5px;
            }
            .type-code {
                font-size: 32px;
                letter-spacing: 8px;
                color: #94a3b8;
                font-weight: 900;
                margin-bottom: 0px;
            }
            .type-title {
                font-size: 56px;
                font-weight: 900;
                color: #1e293b;
                line-height: 1.2;
            }
            .charts {
                display: flex;
                flex-direction: column;
                gap: 18px;
            }
            .row {
                width: 100%;
            }
            .labels {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                align-items: flex-end;
            }
            .bar-bg {
                width: 100%;
                height: 20px;
                background: #e2e8f0;
                border-radius: 10px;
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
                border-radius: 10px 0 0 10px;
                z-index: 1;
            }
            .fill-right {
                position: absolute;
                left: 50%;
                top: 0;
                bottom: 0;
                width: 35%;
                background: linear-gradient(90deg, #ef4444, #f87171);
                border-radius: 0 10px 10px 0;
                z-index: 1;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <div class="site-title">お笑い16タイプ診断</div>
                <div class="type-code">${typeCode}</div>
                <div class="type-title">「${typeName}」</div>
            </div>
            <div class="charts">
                ${barsHTML}
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
