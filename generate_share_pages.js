const fs = require('fs');
const path = require('path');

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

const shareDir = path.join(__dirname, 'share');
if (!fs.existsSync(shareDir)) {
    fs.mkdirSync(shareDir);
}

const ogpDir = path.join(__dirname, 'ogp_images');
if (!fs.existsSync(ogpDir)) {
    fs.mkdirSync(ogpDir);
}

Object.keys(typesDB).forEach(typeKey => {
    const title = typesDB[typeKey];
    const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>${title} | お笑い16タイプ診断</title>
    <meta property="og:title" content="私のお笑いタイプは${title}でした！">
    <meta property="og:description" content="16問の質問であなたの「笑いのタイプ」を精密診断します。">
    <meta property="og:url" content="https://dim7.jp/owarai/share/${typeKey}.html">
    <meta property="og:image" content="https://dim7.jp/owarai/ogp_images/${typeKey}.png">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <!-- Redirect back to the actual result page on the main app -->
    <meta http-equiv="refresh" content="0; url=https://dim7.jp/owarai/?type=${typeKey}">
</head>
<body>
    <p>診断結果へリダイレクトしています... <a href="https://dim7.jp/owarai/?type=${typeKey}">ページが変わらない場合はこちらをクリック</a></p>
</body>
</html>`;

    fs.writeFileSync(path.join(shareDir, `${typeKey}.html`), htmlContent);
});

console.log('Static share pages generated successfully into /share.');
