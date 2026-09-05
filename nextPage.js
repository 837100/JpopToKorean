//　サイドバートグル関数
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// URLから選ばれた曲名を取得する
const urlParams = new URLSearchParams(window.location.search);
const selectedThemes = urlParams.get('song');

//　選ばれた歌のデータを持ち込む
const matchedSongReady = songsReady.then(() => songs[selectedThemes]);
matchedSongReady.then(matchedSong => {
    if (matchedSong) {
        document.getElementById('song-title').textContent = matchedSong.title;

        titleNavigater();
        fetch(matchedSong.lyricsFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`가사 파일을 불러오지 못했습니다: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('song-lyrics').textContent = data;
            })
            .catch(error => console.error('Error loading lyrics:', error));

        // YouTube プレイヤーAPI スクリプトロード
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // YouTube プレイヤーの変数
        let player;

        // YouTube APIがロードされた時実行される関数
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: matchedSong.videoId,
                events: {
                    'onReady': onPlayerReady
                }
            });
        }

        //　プレイヤーが準備できた時実行される関数
        function onPlayerReady(event) {
            event.target.playVideo(); // 自動的にビデオ再生
        }
    } else {
        document.getElementById('song-title').textContent = "선택된 노래를 찾을 수 없습니다. 관리자에게 문의해주세요.";
    }
});
// 画面のサイズによってプレイヤーのサイズとmainのmargin-topをアップデート
function adjustMainMargin() {
    const player = document.getElementById('player');
    const main = document.getElementById('main');

    // プレイヤーの高さを読み込んでmargin-topを調整
    const playerHeight = player.offsetHeight;

    // mainのmargin-topをプレイヤーの高さに合うように設定
    main.style.marginTop = (playerHeight + 5) + 'px';
}

//　ページロード時や画面のサイズ変更時実行
window.addEventListener('resize', adjustMainMargin); // 画面サイズ調整時呼び出し
window.addEventListener('load', adjustMainMargin); // ページロード時呼び出し
