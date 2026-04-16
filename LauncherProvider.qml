import QtQuick
import qs.Commons
import "Subsonic.mjs" as Subsonic
import "Settings.mjs" as Settings
import "Launcher.mjs" as Launcher

Item {
  id: root

  // Required properties
  property var pluginApi: null
  property var launcher: null
  property string name: "Subsonic Provider"

  readonly property string command: ">sonic" 

  readonly property var _settings: new Settings.Manager(pluginApi)
  readonly property var _client: new Subsonic.SubsonicClient(_settings)

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
      "icon": "search",
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
        ...data.artists.map(a  => ({
          name:         a.name,
          description:  `${a.albumCount ?? 0} albums`,
          icon:         "microphone-2",
          isTablerIcon: true,
          onActivate:   function() { Logger.i("browse artist", a.id) }
        })),
        ...data.albums.map(al => ({
          name:         al.name,
          description:  al.artist ?? "",
          icon:         "vinyl",
          isTablerIcon: true,
          onActivate:   function() { Logger.i("browse album", al.id) }
        })),
        ...data.songs.map(s  => new Launcher.trackItem(s, root))
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

    if (!query) return [{
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
}