const artistKey = new URLSearchParams(window.location.search).get('artist');

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function requireJson(response, file) {
    if (!response.ok) {
        throw new Error(`${file}을(를) 불러오지 못했습니다: ${response.status}`);
    }
    return response.json();
}

Promise.all([
    fetch('artists.txt').then(response => requireJson(response, 'artists.txt')),
]).then(([artists]) => {
    const artist = artists[artistKey];
    if (!artist) {
        throw new Error('존재하지 않는 가수입니다.');
    }

    return fetch(artist.metadataFile)
        .then(response => requireJson(response, artist.metadataFile))
        .then(songs => ({ artist, songs }));
}).then(({ artist, songs }) => {
    document.title = `${artist.name} | J-Pop to Korean`;
    document.getElementById('artist-name').textContent = artist.name;

    const artistHomeLink = document.getElementById('artist-home-link');
    artistHomeLink.textContent = artist.name;
    artistHomeLink.href = `artist.html?artist=${encodeURIComponent(artistKey)}`;

    document.getElementById('artist-card').style.backgroundImage = `url('${artist.image}')`;
    document.getElementById('artist-style').textContent = `
        body {
            background-image: url('${artist.background}');
            --artist-accent: ${artist.accent};
            --artist-hover-accent: ${artist.hoverAccent};
        }
        body::before {
            background-image: url('${artist.background}');
        }
        .card {
            background-image: url('${artist.image}');
        }
        .sidebar, .menu-btn {
            background-color: var(--artist-accent);
        }
        .sidebar a:hover {
            background-color: var(--artist-hover-accent);
        }
    `;

    const songList = document.getElementById('song-list');
    Object.entries(songs).forEach(([songKey, song]) => {
        const link = document.createElement('a');
        link.className = 'list-group-item list-group-item-action';
        link.href = `${artist.songPage}?song=${encodeURIComponent(songKey)}`;
        link.textContent = song.title;
        songList.appendChild(link);
    });

    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';
    sidebar.innerHTML = `
        <br>
        <br>
        <a href="index.html">Home</a>
        <a href="artist.html?artist=${encodeURIComponent(artistKey)}" style="font-weight: bold; text-decoration: underline;">${artist.name}</a>
    `;
    Object.entries(songs).forEach(([songKey, song]) => {
        const link = document.createElement('a');
        link.href = `${artist.songPage}?song=${encodeURIComponent(songKey)}`;
        link.textContent = song.title;
        sidebar.appendChild(link);
    });
    document.getElementById('sidebar-container').appendChild(sidebar);
    document.getElementById('menu-button').onclick = toggleSidebar;
}).catch(error => {
    console.error('가수 페이지 로드 중 오류 발생:', error);
    document.getElementById('artist-name').textContent = '가수 정보를 불러오지 못했습니다.';
});
