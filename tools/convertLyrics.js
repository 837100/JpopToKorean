const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];

if (!inputPath) {
    console.error('사용법: node tools/convertLyrics.js <가사.txt>');
    process.exit(1);
}

if (!fs.existsSync(inputPath)) {
    console.error(`파일을 찾을 수 없습니다: ${inputPath}`);
    process.exit(1);
}

const extension = path.extname(inputPath);
const baseName = path.basename(inputPath, extension);
const outputPath = path.join(path.dirname(inputPath), `${baseName}ToJson.txt`);
const lyrics = fs.readFileSync(inputPath, 'utf8').replace(/\r\n/g, '\n');
const lyricsLines = lyrics.split('\n');

if (lyricsLines.at(-1) === '') {
    lyricsLines.pop();
}

fs.writeFileSync(outputPath, JSON.stringify(lyricsLines, null, 2) + '\n', 'utf8');
console.log(`변환 완료: ${outputPath}`);
