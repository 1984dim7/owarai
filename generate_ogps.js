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
        const activeColorLeft = '#2563eb';
        const activeColorRight = '#dc2626';
        const passiveColor = '#94a3b8';

        return `
        <div class="row">
            <div class="labels">
                <span style="color: ${isLeft ? activeColorLeft : passiveColor}; font-weight: 900; font-size: 20px;">${lblLeft}</span>
                <span style="color: ${!isLeft ? activeColorRight : passiveColor}; font-weight: 900; font-size: 20px;">${lblRight}</span>
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
            @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700;900&display=swap');
            body {
                width: 1200px;
                height: 630px;
                margin: 0;
                background: #bae6fd;
                background-image: 
                    linear-gradient(rgba(56, 189, 248, 0.22) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(56, 189, 248, 0.22) 1px, transparent 1px);
                background-size: 24px 24px;
                font-family: 'Zen Maru Gothic', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #1e1b4b;
            }
            .card {
                background: #ffffff;
                width: 1080px;
                height: 560px;
                border-radius: 40px;
                box-shadow: 12px 12px 0px #1e1b4b;
                display: flex;
                flex-direction: row;
                padding: 45px 50px;
                box-sizing: border-box;
                border: 4px solid #1e1b4b;
                gap: 45px;
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
                margin-bottom: 16px;
            }
            .site-title {
                font-size: 18px;
                color: #64748b;
                font-weight: 900;
                letter-spacing: 2px;
                margin-bottom: 5px;
            }
            .type-code {
                font-size: 26px;
                letter-spacing: 8px;
                color: #94a3b8;
                font-weight: 900;
                margin-bottom: 0px;
            }
            .type-title {
                font-size: 44px;
                font-weight: 900;
                color: #1e1b4b;
                line-height: 1.2;
            }
            .charts {
                display: flex;
                flex-direction: column;
                gap: 12px;
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
                height: 18px;
                background: #e2e8f0;
                border: 3px solid #1e1b4b;
                border-radius: 9999px;
                position: relative;
                overflow: hidden;
            }
            .center-line {
                position: absolute;
                left: 50%;
                top: 0;
                bottom: 0;
                width: 3px;
                background: #1e1b4b;
                transform: translateX(-50%);
                z-index: 2;
            }
            .fill-left {
                position: absolute;
                right: 50%;
                top: 0;
                bottom: 0;
                width: 35%;
                background: #3b82f6;
                z-index: 1;
            }
            .fill-right {
                position: absolute;
                left: 50%;
                top: 0;
                bottom: 0;
                width: 35%;
                background: #ef4444;
                z-index: 1;
            }
            .illustration {
                width: 340px;
                height: 340px;
                object-fit: cover;
                border-radius: 28px;
                box-shadow: 6px 6px 0px #1e1b4b;
                border: 4px solid #1e1b4b;
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

function generateTopHTML() {
    // 代表的なイラストを Base64 で読み込んで配置する
    const illustKeys = ["LHDM", "LHSC", "LPSM", "AHDM", "AHSC", "AHSM"];
    const imgUrls = illustKeys.map(key => {
        const file = illustrationMap[key];
        const absPath = path.resolve(__dirname, 'images', 'illustrations', file);
        const base64 = fs.readFileSync(absPath, { encoding: 'base64' });
        return `data:image/png;base64,${base64}`;
    });

    return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&family=Zen+Maru+Gothic:wght@700;900&display=swap');
            body {
                width: 1200px;
                height: 630px;
                margin: 0;
                background: #bae6fd;
                background-image: 
                    linear-gradient(rgba(56, 189, 248, 0.22) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(56, 189, 248, 0.22) 1px, transparent 1px);
                background-size: 24px 24px;
                font-family: 'Zen Maru Gothic', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #1e1b4b;
                overflow: hidden;
                position: relative;
            }
            .title-box {
                background: #ffffff;
                padding: 40px 60px;
                border-radius: 40px;
                border: 5px solid #1e1b4b;
                box-shadow: 12px 12px 0px #1e1b4b;
                text-align: center;
                z-index: 10;
            }
            .site-subtitle {
                font-size: 24px;
                font-weight: 900;
                color: #64748b;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            .site-title {
                font-family: 'Outfit', 'Zen Maru Gothic', sans-serif;
                font-size: 64px;
                font-weight: 900;
                color: #0284c7;
                line-height: 1.1;
                margin: 0;
                text-shadow: 2px 2px 0px #ffffff, -2px -2px 0px #ffffff, 2px -2px 0px #ffffff, -2px 2px 0px #ffffff, 4px 4px 0px #1e1b4b;
            }
            .site-title span {
                color: #ef4444;
            }
            .sub-desc {
                font-size: 20px;
                font-weight: 900;
                color: #1e1b4b;
                margin-top: 15px;
            }
            /* Floating Illustrations */
            .sticker {
                position: absolute;
                border: 4px solid #1e1b4b;
                border-radius: 28px;
                box-shadow: 6px 6px 0px #1e1b4b;
                background: #ffffff;
                overflow: hidden;
                width: 170px;
                height: 170px;
                z-index: 5;
            }
            .sticker img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .s1 { top: 60px; left: 80px; transform: rotate(-12deg); }
            .s2 { bottom: 60px; left: 100px; transform: rotate(8deg); }
            .s3 { top: 70px; right: 90px; transform: rotate(15deg); }
            .s4 { bottom: 70px; right: 110px; transform: rotate(-8deg); }
            .s5 { top: 220px; left: 240px; transform: rotate(5deg); width: 140px; height: 140px; }
            .s6 { top: 210px; right: 260px; transform: rotate(-10deg); width: 140px; height: 140px; }
            
            /* Floating Deco */
            .floating-deco {
                position: absolute;
                font-size: 3rem;
                user-select: none;
                pointer-events: none;
                z-index: 2;
            }
            .deco-flower { top: 8%; left: 45%; color: #38bdf8; }
            .deco-heart { bottom: 8%; left: 35%; color: #f43f5e; }
            .deco-star { bottom: 12%; right: 40%; color: #eab308; }
        </style>
    </head>
    <body>
        <!-- 浮遊デコレーション -->
        <div class="floating-deco deco-flower">✿</div>
        <div class="floating-deco deco-heart">♥</div>
        <div class="floating-deco deco-star">★</div>

        <!-- イラストステッカー群 -->
        <div class="sticker s1"><img src="${imgUrls[0]}" alt=""></div>
        <div class="sticker s2"><img src="${imgUrls[1]}" alt=""></div>
        <div class="sticker s3"><img src="${imgUrls[2]}" alt=""></div>
        <div class="sticker s4"><img src="${imgUrls[3]}" alt=""></div>
        <div class="sticker s5"><img src="${imgUrls[4]}" alt=""></div>
        <div class="sticker s6"><img src="${imgUrls[5]}" alt=""></div>

        <div class="title-box">
            <div class="site-subtitle">お笑いMBTIで笑いのツボを精密分析！</div>
            <h1 class="site-title">お笑い16タイプ<span>診断</span></h1>
            <div class="sub-desc">老若男女だれでも・分かれば面白い！あなたのタイプは？</div>
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

    console.log("Generating Top Page OGP (ogp_image.png)...");
    const topHtml = generateTopHTML();
    await page.setContent(topHtml, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 800)); // コラージュ読み込みのため少し長めに待つ
    
    const topOutPath = path.join(__dirname, 'ogp_image.png');
    await page.screenshot({ path: topOutPath });
    console.log("Generated Top OGP image: ogp_image.png");

    await browser.close();
    console.log("All OGP images (including Top OGP) generated successfully!");
}

main().catch(console.error);
