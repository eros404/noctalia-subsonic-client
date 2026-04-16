// Generate a random alphanumeric salt of a given length (min 6)
function makeSalt(len = 8) {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    var result = ""
    for (var i = 0; i < len; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    return result
}

export class SubsonicClient {
    constructor(settingsManager) {
        this._settings = settingsManager
        this._baseUrl = settingsManager.serverUrl()
        this._user = settingsManager.userName()
        this._password = settingsManager.password()
        this.invalid = !this._baseUrl || !this._user || !this._password
    }

    search3(query) {
        return this._get("search3", {
            query,
            artistCount: this._settings.searchArtists(),
            albumCount: this._settings.searchAlbums(),
            songCount: this._settings.searchSongs(),
        }).then(resp => {
            const sr = resp.searchResult3 ?? {}
            return {
                artists: sr.artist ?? [],
                albums: sr.album ?? [],
                songs: sr.song ?? [],
            }
        })
    }

    getAlbum(id) {
        return this._get("getAlbum", { id: id }).then(resp => resp.album)
    }

    streamUrl(songId) {
        return this._apiUrl("stream", { id: songId })
    }

    _get(endpoint, extra = {}) {
        const url = this._apiUrl(endpoint, extra)
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== XMLHttpRequest.DONE) return
                if (xhr.status !== 200) {
                    reject(new Error(`HTTP ${xhr.status}`))
                    return
                }
                try {
                    const body = JSON.parse(xhr.responseText)
                    const resp = body["subsonic-response"]
                    if (resp?.status !== "ok") {
                        reject(new Error(`Subsonic error ${resp?.error?.code}: ${resp?.error?.message}`))
                    } else {
                        resolve(resp)
                    }
                } catch (e) {
                    reject(e)
                }
            }
            xhr.open("GET", url)
            xhr.send()
        })
    }

    _apiUrl(endpoint, extraParams = {}) {
        const params = this._authParams()
        Object.entries(extraParams).forEach(([k, v]) => params.set(k, v))
        return `${this._baseUrl}/rest/${endpoint}?${params}`
    }

    _authParams() {
        var salt = makeSalt(8)
        var token = Qt.md5(this._password + salt)
        return new URLSearchParams({
            u: encodeURIComponent(this._user),
            t: token,
            s: salt,
            v: "1.16.1",
            c: "Noctalia Plugin",
            f: "json"
        })
    }
}