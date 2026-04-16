export function songItem(song, launcherProvider) {
    return {
        name: song.title,
        description: `${song.artist ?? ""} — ${song.album ?? ""}`,

        icon: "music",
        isTablerIcon: true,

        onActivate: () => {
            launcherProvider.updateResults([{
                name: "Play",
                icon: "player-play",
                isTablerIcon: true,
                onActivate: () => {
                    launcherProvider.playSong(song)
                }
            }, {
                name: "Play next",
                icon: "arrow-forward-up",
                isTablerIcon: true,
                onActivate: () => {
                    launcherProvider.playSong(song, "insert-next-play")
                }
            }, {
                name: "Append to playlist",
                icon: "arrow-forward",
                isTablerIcon: true,
                onActivate: () => {
                    launcherProvider.playSong(song, "append-play")
                }
            }])
        }
    }
}

export function albumItem(album, launcherProvider) {
    return {
        name: album.name,
        description: album.artist ?? "",

        icon: "vinyl",
        isTablerIcon: true,

        onActivate: () => {
            launcherProvider._client.getAlbum(album.id).then(album => {
                if (!album.song) {
                    launcherProvider.updateResults([])
                    return;
                }

                launcherProvider.updateResults([{
                    name: "Play",
                    icon: "player-play",
                    isTablerIcon: true,
                    onActivate: () => {
                        album.song.forEach((song, i) => {
                            launcherProvider.playSong(song, i === 0 ? "replace" : "append")
                        })
                    }
                },
                ...album.song.map(song => songItem(song, launcherProvider))])
            })
        }
    }
}

export function artistItem(artist, launcherProvider) {
    return {
        name: artist.name,
        description: `${artist.albumCount ?? 0} albums`,

        icon: "microphone-2",
        isTablerIcon: true,
    }
}