import QtQuick
import Quickshell.Io
import qs.Services.UI
import qs.Commons
import "Mpv.mjs" as Mpv

Item {
  property var pluginApi: null

  Process {
      id: mpvProcess
      stderr: StdioCollector {}
      command: [
          "mpv",
          "--idle",
          "--no-video",
          "--no-terminal",
          "--force-window=no",
          "--audio-display=no",
          `--input-ipc-server=${Mpv.SOCKET_PATH}`,
          "--title=Noctalia subsonic-client",
      ]
      running: true   // start immediately when Main.qml loads

      // If mpv crashes or is killed, restart it after a short delay
      onRunningChanged: {
          if (!running) {
            Logger.w("SubsonicClient", "Restarting mpv process");
            restartTimer.restart()
          }
      }

      onExited: function (exitCode) {
        Logger.w("SubsonicClient", "mpv process exited with code " + exitCode);
        var stderrText = String(mpvProcess.stderr.text || "").trim();
        if (stderrText.length > 0 && exitCode !== 0) {
          Logger.e("SubsonicClient", stderrText);
        }
      }
  }

  Timer {
      id: restartTimer
      interval: 2000
      repeat: false
      onTriggered: mpvProcess.running = true
  }

  Process {
    id: mpvCommand
    stderr: StdioCollector {}
    onExited: function (exitCode) {
      var stderrText = String(mpvCommand.stderr.text || "").trim();
      if (stderrText.length > 0 && exitCode !== 0) {
        Logger.e("SubsonicClient", stderrText);
      }
    }
  }

  function playSong(url) {
    mpvCommand.exec(Mpv.commandInit("loadfile", url, "replace"))
  }
}