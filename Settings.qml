import QtQuick
import QtQuick.Layouts
import qs.Commons
import qs.Widgets
import "Settings.mjs" as Settings

ColumnLayout {
  id: root

  property var pluginApi: null
  readonly property var _settings: new Settings.Manager(pluginApi)

  // Local state
  property string serverUrl: _settings.serverUrl()
  property string userName: _settings.userName()
  property string password: _settings.password()

  property string searchArtists: _settings.searchArtists()
  property string searchAlbums: _settings.searchAlbums()
  property string searchSongs: _settings.searchSongs()

  spacing: Style.marginM

  Component.onCompleted: { }

  NTextInput {
    Layout.fillWidth: true
    label: "Server URL"
    placeholderText: "https://my-music.com"
    text: root.serverUrl
    onTextChanged: root.serverUrl = text
  }

  NTextInput {
    Layout.fillWidth: true
    label: "User name"
    placeholderText: "john"
    text: root.userName
    onTextChanged: root.userName = text
  }

  NTextInput {
    Layout.fillWidth: true
    label: "Password"
    text: root.password
    inputMethodHints: Qt.ImhHiddenText
    onTextChanged: root.password = text
  }

  NDivider {
    Layout.fillWidth: true
    Layout.topMargin: Style.marginS
    Layout.bottomMargin: Style.marginS
  }

  ColumnLayout {
    Layout.fillWidth: true
    spacing: Style.marginS

    NLabel {
      label: "Artist count"
      description: "Number of artists to return from search"
    }

    NSpinBox {
      from: 0
      to: 100
      value: root.searchArtists
      onValueChanged: root.searchArtists = value
    }
  }

  ColumnLayout {
    Layout.fillWidth: true
    spacing: Style.marginS

    NLabel {
      label: "Album count"
      description: "Number of albums to return from search"
    }

    NSpinBox {
      from: 0
      to: 100
      value: root.searchAlbums
      onValueChanged: root.searchAlbums = value
    }
  }

  ColumnLayout {
    Layout.fillWidth: true
    spacing: Style.marginS

    NLabel {
      label: "Song count"
      description: "Number of songs to return from search"
    }

    NSpinBox {
      from: 0
      to: 100
      value: root.searchSongs
      onValueChanged: root.searchSongs = value
    }
  }

  // Save function - called by the dialog
  function saveSettings() {
    _settings.serverUrl(root.serverUrl)
    _settings.userName(root.userName)
    _settings.password(root.password)

    _settings.searchArtists(root.searchArtists)
    _settings.searchAlbums(root.searchAlbums)
    _settings.searchSongs(root.searchSongs)

    _settings.save()

    Logger.i("SubsonicClient", "Settings saved successfully")
  }
}