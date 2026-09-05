const pageParams = new URLSearchParams(window.location.search);
const artistKey = pageParams.get('artist');
const selectedThemes = pageParams.get('song');
let songs = {};
let songsReady;

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function requireJson(response, file) {
    if (!response.ok) {
        throw new Error(`${file}을(를) 불러오지 못했습니다: ${response.status}`);
    }
    return response.json();
}

function titleNavigater(artist) {
    const titles = Object.keys(songs);
    const currentIndex = titles.indexOf(selectedThemes);
    const nextSong = titles[(currentIndex + 1) % titles.length];
    const prevSong = titles[(currentIndex - 1 + titles.length) % titles.length];
    const buildSongUrl = song => `song.html?artist=${encodeURIComponent(artistKey)}&song=${encodeURIComponent(song)}`;

    document.getElementById('next-song').href = buildSongUrl(nextSong);
    document.getElementById('prev-song').href = buildSongUrl(prevSong);
    document.getElementById('artist-page-link').href = `artist.html?artist=${encodeURIComponent(artistKey)}`;
}

songsReady = fetch('artists.txt?v=20260905-song-page')
    .then(response => requireJson(response, 'artists.txt'))
    .then(artists => {
        const artist = artists[artistKey];
        if (!artist) {
            throw new Error('존재하지 않는 가수입니다.');
        }

        document.title = `${artist.name} | J-Pop to Korean`;
        document.body.classList.add(artistKey);

        const artistColorStyle = document.createElement('style');
        artistColorStyle.id = 'artist-color-style';
        artistColorStyle.textContent = `
            .sidebar,
            .menu-btn {
                background-color: ${artist.accent} !important;
            }
            .sidebar a:hover {
                background-color: ${artist.hoverAccent} !important;
            }
        `;
        document.head.appendChild(artistColorStyle);

        document.body.style.setProperty('--artist-pastel', artist.backgroundColor);

        const backgroundStylesheet = document.createElement('link');
        backgroundStylesheet.rel = 'stylesheet';
        backgroundStylesheet.href = 'img/songBackground.css?v=20260905-pastel';
        document.head.appendChild(backgroundStylesheet);

        return loadArtistSongs(artist.directory).then(data => ({ artist, data }));
    })
    .then(({ artist, data }) => {
        songs = data;
        titleNavigater(artist);

        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';
        sidebar.id = 'sidebar';
        sidebar.innerHTML = `
            <br>
            <br>
            <a href="artist.html?artist=${encodeURIComponent(artistKey)}" style="font-weight: bold; text-decoration: underline;">${artist.name}</a>
        `;
        Object.entries(songs).forEach(([songKey, song]) => {
            const link = document.createElement('a');
            link.href = `song.html?artist=${encodeURIComponent(artistKey)}&song=${encodeURIComponent(songKey)}`;
            link.textContent = song.title;
            sidebar.appendChild(link);
        });
        document.getElementById('sidebar-container').appendChild(sidebar);
        document.getElementById('menu-button').onclick = toggleSidebar;
    })
    .catch(error => {
        console.error('곡 페이지 로드 중 오류 발생:', error);
        document.getElementById('song-title').textContent = '노래 정보를 불러오지 못했습니다.';
    });
