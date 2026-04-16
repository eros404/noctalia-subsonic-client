export function trackItem(track, launcherProvider) {
    return {
        name: track.title,
        description: `${track.artist ?? ""} — ${track.album ?? ""}`,

        icon: "music",
        isTablerIcon: true,

        onActivate: () => {
            launcherProvider._results = [{
                name: "Play",
                icon: "player-play",
                isTablerIcon: true,
                onActivate: () => {
                    launcherProvider.launcher?.close()
                    launcherProvider.pluginApi?.mainInstance?.playSong(
                        launcherProvider._client.streamUrl(track.id))
                }
            }, {
                name: "Play next",
                icon: "arrow-forward-up",
                isTablerIcon: true,
                onActivate: () => {
                    launcherProvider.launcher?.close()
                    launcherProvider.pluginApi?.mainInstance?.playSong(
                        launcherProvider._client.streamUrl(track.id),
                        "insert-next-play")
                }
            }, {
                name: "Append to playlist",
                icon: "arrow-forward",
                isTablerIcon: true,
                onActivate: () => {
                    launcherProvider.launcher?.close()
                    launcherProvider.pluginApi?.mainInstance?.playSong(
                        launcherProvider._client.streamUrl(track.id),
                        "append-play")
                }
            }]
            launcherProvider.launcher?.updateResults()
        }
    }
}