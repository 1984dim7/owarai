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
    "AHDC": "予測不能なトリックスター",
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
    <link rel="canonical" href="https://dim7.jp/owarai/?type=${typeKey}">
    <title>${title} | お笑い１６タイプ（MBTI）診断</title>
    <meta name="description" content="お笑い１６タイプ診断の結果「${title}」。あなたの笑いのタイプを１６問で精密診断。理/乱・和/毒・静/動・衆/深の４軸で分析します。">
    <meta property="og:title" content="私のお笑いタイプは${title}でした！">
    <meta property="og:description" content="【お笑い１６タイプ診断】１６問の質問であなたの「笑いのタイプ」を精密診断します。">
    <meta property="og:url" content="https://dim7.jp/owarai/share/${typeKey}.html">
    <meta property="og:image" content="https://dim7.jp/owarai/ogp_images/${typeKey}.png">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="お笑い１６タイプ診断">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="私のお笑いタイプは${title}でした！">
    <meta name="twitter:description" content="お笑いMBTI診断で「${title}」と診断されました！あなたも診断してみよう。">
    <meta name="twitter:image" content="https://dim7.jp/owarai/ogp_images/${typeKey}.png">
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
