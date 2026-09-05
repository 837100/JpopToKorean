//　選ばれた歌のデータを持ち込む
const matchedSongReady = songsReady.then(() => songs[selectedThemes]);
matchedSongReady.then(matchedSong => {
    if (matchedSong) {
        document.getElementById('song-title').textContent = matchedSong.title;

        titleNavigater();
        document.getElementById('song-lyrics').textContent = matchedSong.lyrics;

        const player = document.getElementById('player');
        const video = document.createElement('iframe');
        video.src = `https://www.youtube.com/embed/${encodeURIComponent(matchedSong.videoId)}`;
        video.title = `${matchedSong.title} YouTube 영상`;
        video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        video.allowFullscreen = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.border = '0';
        player.replaceChildren(video);

        const youtubeLink = document.createElement('a');
        youtubeLink.href = matchedSong.videoUrl;
        youtubeLink.target = '_blank';
        youtubeLink.rel = 'noopener noreferrer';
        youtubeLink.textContent = 'YouTube에서 영상 열기';
        youtubeLink.className = 'youtube-fallback-link';
        player.insertAdjacentElement('afterend', youtubeLink);
    } else {
        document.getElementById('song-title').textContent = "선택된 노래를 찾을 수 없습니다. 관리자에게 문의해주세요.";
    }
});
// 画面のサイズによってプレイヤーのサイズとmainのmargin-topをアップデート
function adjustMainMargin() {
    const player = document.getElementById('player');
    const main = document.getElementById('main');

    if (window.matchMedia('(orientation: landscape) and (min-aspect-ratio: 6 / 5)').matches) {
        main.style.marginTop = '0';
        return;
    }

    // プレイヤーの高さを読み込んでmargin-topを調整
    const playerHeight = player.offsetHeight;

    // mainのmargin-topをプレイヤーの高さに合うように設定
    main.style.marginTop = (playerHeight + 5) + 'px';
}

//　ページロード時や画面のサイズ変更時実行
window.addEventListener('resize', adjustMainMargin); // 画面サイズ調整時呼び出し
window.addEventListener('load', adjustMainMargin); // ページロード時呼び出し
