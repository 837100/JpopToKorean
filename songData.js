function loadArtistSongs(artistDirectory) {
    const directory = `kashi/${artistDirectory}`;

    return fetch(`${directory}/index.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${directory}/index.json을(를) 불러오지 못했습니다: ${response.status}`);
            }
            return response.json();
        })
        .then(fileNames => Promise.all(fileNames.map(fileName => {
            return fetch(`${directory}/${encodeURIComponent(fileName)}`)
                .then(response => {
                    if (!response.ok) {
                        console.warn(`${directory}/${fileName}을(를) 불러오지 못했습니다: ${response.status}`);
                        return null;
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error(`${directory}/${fileName} 로드 중 네트워크 오류:`, error);
                    return null;
                });
        })))
        .then(songList => {
            const validSongs = songList.filter(song => song !== null);
            return Object.fromEntries(validSongs.map(song => {
                if (Array.isArray(song.lyricsLines)) {
                    song.lyrics = song.lyricsLines.join('\n');
                }

                return [song.fileName.replace(/\.json$/, ''), song];
            }));
        });
}