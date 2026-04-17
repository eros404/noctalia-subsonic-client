export function songItem(song, launcherProvider) {
    return {
        name: song.title,
        description: `${song.artist ?? ""} — ${song.album ?? ""}`,

        icon: "music",
        isTablerIcon: true,

        onActivate: () => {
            if (!launcherProvider.settings.playlistActions) {
                launcherProvider.playSong(song)
                return
            }
            launcherProvider.updateResults([
                playItem(() => {
                    launcherProvider.playSong(song)
                }),
                playNextItem(() => {
                    launcherProvider.playSong(song, "insert-next-play")
                }),
                appendPlaylistItem(() => {
                    launcherProvider.playSong(song, "append-play")
                })
            ])
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
            launcherProvider.client.getAlbum(album.id).then(album => {
                if (!album.song) {
                    launcherProvider.updateResults([])
                    return;
                }

                const actions = [playItem(() => {
                    album.song.forEach((song, i) => {
                        launcherProvider.playSong(song, i === 0 ? "replace" : "append")
                    })
                })];
                if (launcherProvider.settings.playlistActions) {
                    actions.push(
                        playNextItem(() => {
                            album.song.forEach((song) => {
                                launcherProvider.playSong(song, "insert-next-play")
                            })
                        }),
                        appendPlaylistItem(() => {
                            album.song.forEach((song) => {
                                launcherProvider.playSong(song, "append-play")
                            })
                        }))
                }

                launcherProvider.updateResults([
                    ...actions,
                    ...album.song.map(song => songItem(song, launcherProvider))
                ])
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

        onActivate: () => {
            launcherProvider.client.getArtist(artist.id).then(artist => {
                if (!artist.album) {
                    launcherProvider.updateResults([])
                    return;
                }

                launcherProvider.updateResults([
                    ...artist.album.map(album => albumItem(album, launcherProvider))
                ])
            })
        }
    }
}

function playItem(onActivate) {
    return {
        name: "Play",
        icon: "player-play",
        isTablerIcon: true,
        onActivate: onActivate
    }
}
function playNextItem(onActivate) {
    return {
        name: "Play next",
        icon: "arrow-forward-up",
        isTablerIcon: true,
        onActivate: onActivate
    }
}
function appendPlaylistItem(onActivate) {
    return {
        name: "Append to playlist",
        icon: "arrow-forward",
        isTablerIcon: true,
        onActivate: onActivate
    }
}