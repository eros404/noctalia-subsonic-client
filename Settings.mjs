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
        this._pluginApi.saveSettings()
    }

    get serverUrl() {
        return this._get('serverUrl')
    }
    set serverUrl(value) {
        this._set('serverUrl', value)
    }

    get userName() {
        return this._get('userName')
    }
    set userName(value) {
        this._set('userName', value)
    }

    get password() {
        return this._get('password')
    }
    set password(value) {
        this._set('password', value)
    }

    get searchArtists() {
        return this._get('searchArtists')
    }
    set searchArtists(value) {
        this._set('searchArtists', value)
    }

    get searchAlbums() {
        return this._get('searchAlbums')
    }
    set searchAlbums(value) {
        this._set('searchAlbums', value)
    }

    get searchSongs() {
        return this._get('searchSongs')
    }
    set searchSongs(value) {
        this._set('searchSongs', value)
    }
}