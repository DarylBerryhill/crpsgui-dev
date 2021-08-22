module.exports =
[
    // FILE menu
    {
        "id": "1",
        "label": "&File",
        "submenu":
        [
            { "type": "separator" },
            { "role": "quit" }
        ]
    },

    // EDIT menu
    {
        "id": "2",
        "label": "&Edit",
        "submenu":
        [
          { "role": "undo" },
          { "role": "redo" },
          { "type": "separator" },
          { "role": "cut" },
          { "role": "copy" },
          { "role": "paste" },
          { "role": "delete" },
          { "type": "separator" },
          { "role": "selectAll" }
        ]
    },

    // VIEW menu
    {
        "id": "3",
        "label": "&View",
        "submenu":
        [
            { "role": "reload" },
            { "role": "forceReload" },
            { "role": "toggleDevTools" },
            { "type": "separator" },
            { "role": "resetZoom" },
            { "role": "zoomIn" },
            { "role": "zoomOut" },
            { "type": "separator" },
            { "role": "togglefullscreen" }
        ]
    },

    // WINDOW menu
    {
        "id": "4",
        "label": "&Window",
        "submenu":
        [
            { "role": "minimize" },
            { "role": "zoom" },
            { "role": "close" }
        ]
    },

    // HELP emnu
    {
        "id": 5,
        "role": "help",
        "submenu":
        [
            { "label": "Learn More",
              "click" : async () =>
                    {
                        const { shell } = require('electron');
                        await shell.openExternal('https://electronjs.org');
                    }
            }
        ]
    },

    // ABOUT menu
    {
        "id": "6",
        "role": "about",
        "submenu":
        [
            { "label": "Dependancy Versions",
              "click": () => { }
            },
            { "label": "Memory Usage",
              "click": () => { }
            },
            { "type": "separator" }
        ]
    }
];