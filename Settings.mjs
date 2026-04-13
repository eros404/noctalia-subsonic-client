export class Manager {
    constructor(pluginApi) {
        this._pluginApi = pluginApi
    }

    _get(key) {
        return this._pluginApi?.pluginSettings?.[key] ||
            this._pluginApi?.manifest?.metadata?.defaultSettings?.[key]
    }
    _set(key, value) {
        if (this._pluginApi?.pluginSettings) {
            this._pluginApi.pluginSettings[key] = value
        }
        return value
    }

    save() {
        return this._pluginApi.saveSettings()
    }

    serverUrl(value) {
        return value
            ? this._set('serverUrl', value)
            : this._get('serverUrl')
    }
    userName(value) {
        return value
            ? this._set('userName', value)
            : this._get('userName')
    }
    password(value) {
        return value
            ? this._set('password', value)
            : this._get('password')
    }

    searchArtists(value) {
        return value
            ? this._set('searchArtists', value)
            : this._get('searchArtists')
    }
    searchAlbums(value) {
        return value
            ? this._set('searchAlbums', value)
            : this._get('searchAlbums')
    }
    searchSongs(value) {
        return value
            ? this._set('searchSongs', value)
            : this._get('searchSongs')
    }
}