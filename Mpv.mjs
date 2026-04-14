export function commandInit(commandName, ...params) {
    const input = { command: [commandName, ...params] }
    return {
        running: true,
        command: [
            "bash",
            "-c",
            `echo '${JSON.stringify(input)}' | socat - ${SOCKET_PATH}`
        ]
    }
}

export const SOCKET_PATH = "/tmp/noctalia-subsonic-mpv.sock"