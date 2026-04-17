import QtQuick
import qs.Commons
import "Launcher.mjs" as Launcher

Item {
  id: root

  // Required properties
  property var pluginApi: null
  property var launcher: null
  property string name: "Subsonic Provider"

  readonly property string command: ">sonic" 

  readonly property var _client: pluginApi.mainInstance.client

  property var    _results:   []
  property bool   _loading:   false
  property string _lastQuery: ""

  // ── Debounce timer ────────────────────────────────────────────────
  Timer {
    id: _debounce
    interval: 350
    repeat:   false
    onTriggered: _runSearch(root._lastQuery)
  }

  // Check if this provider handles the command
  function handleCommand(searchText) {
    return searchText.startsWith(command)
  }

  // Return available commands when user types ">"
  function commands() {
    return [{
      "name": command,
      "description": "Search my subsonic server",
      "icon": "music",
      "isTablerIcon": true,
      "onActivate": function() {
        launcher.setSearchText(command + " ")
      }
    }]
  }


  function _runSearch(query) {
    _loading = true
    _client.search3(query).then(function(data) {
      _results = [
        ...data.artists.map(a  => Launcher.artistItem(a, root)),
        ...data.albums.map(al => Launcher.albumItem(al, root)),
        ...data.songs.map(s  => Launcher.songItem(s, root))
      ]
      _loading = false
      if (launcher) launcher.updateResults()
    }).catch(function(err) {
      Logger.w("Subsonic search failed:", err)
      _results = []
      _loading = false
      if (launcher) launcher.updateResults()
    })
  }

  // Get search results
  function getResults(searchText) {
    if (!searchText.startsWith(command)) {
      return []
    }

    if (_client.invalid) {
      return [{
        name: "Invalid configuration",
        description: "Please fill the required informations in the settings",
        icon: "exclamation-circle",
        isTablerIcon: true,
        onActivate: function() {}
      }]
    }

    var query = searchText.slice(command.length).trim()

    if (!query || query.length < 2) return [{
      name: "Type to search…",
      description: "Artists · Albums · Tracks",
      icon: "search",
      isTablerIcon: true,
      onActivate: function() {}
    }]

    if (query !== _lastQuery) {
      _lastQuery = query
      _debounce.restart()
    }

    if (_loading) return [{
      name: "Searching…",
      description: "",
      icon: "loader-2",
      isTablerIcon: true,
      onActivate: function() {}
    }]

    return _results
  }

  function updateResults(results) {
    _results = results
    launcher?.updateResults()
  }

  function playSong(song, mode) {
    launcher?.close()
    pluginApi?.mainInstance?.playSong(
        _client.streamUrl(song.id),
        mode)
  }
}