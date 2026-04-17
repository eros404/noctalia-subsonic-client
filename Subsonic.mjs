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
        this.refreshSettings()
    }

    search3(query) {
        return this._get("search3", {
            query,
            artistCount: this._settings.searchArtists,
            albumCount: this._settings.searchAlbums,
            songCount: this._settings.searchSongs,
        }).then(resp => {
            const sr = resp.searchResult3 ?? {}
            return {
                artists: (sr.artist ?? []).filter(a => a.albumCount > 0),
                albums: sr.album ?? [],
                songs: sr.song ?? [],
            }
        })
    }

    getAlbum(id) {
        return this._get("getAlbum", { id: id }).then(resp => resp.album)
    }

    getArtist(id) {
        return this._get("getArtist", { id: id }).then(resp => resp.artist)
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
        const params = new URLSearchParams({
            v: "1.12.0",
            c: "Noctalia Plugin",
            f: "json"
        });

        if (this._user) {
            params.append('u', this._user)
        }

        if (this._apiKey) {
            params.append('apiKey', this._apiKey)
        } else if (this._password) {
            var salt = makeSalt(8)
            params.append('s', salt)
            params.append('t', Qt.md5(this._password + salt))
        }

        return params
    }

    refreshSettings() {
        this._baseUrl = this._settings.serverUrl
        this._user = this._settings.userName
        this._password = this._settings.password
        this._apiKey = this._settings.apiKey
        this.invalid = !this._baseUrl || (!this._apiKey && (!this._user || !this._password))
    }
}