var strings = {
  "applicationBar": {
    "file": {
      "newFile": "New",
      "newFolder": "New Folder",
      "newWindow": "New Window",
      "lock": "Lock",
      "deleteFromLibrary": "Delete from Library",
      "save": "Save",
      "revertChanges": "Revert Changes",
      "rename": "Rename",
      "close": "Close",
      "export": "Export",
      "exportItems": {
        "exportToPlainText": "to Plain Text…",
        "exportToEncryptedFile": "to Encrypted File…",
        "exportToPDF": "to PDF…",
        "exportToArena": "to Are.na…"
      },
      "print": "Print…"
    },
    "view": {
      "showLibrary": "Show Library",
      "preview": "Preview…"
    },
    "help": {
      "reportAnIssue": "Report an Issue…",
      "getNews": "Get %{app_name} News"
    },
    "debug": {
      "title": "Debug",
      "showConsole": "Show Debug Console"
    },
    "others": {
      "checkForUpdate": "Check for Update…",
      "donate": "Donate…",
      "preferences": "Preferences…"
    }
  },
  "contextMenu": {
    "open": "Open",
    "openInNewWindow": "Open in New Window",
    "new": "New…",
    "newItems": {
      "newFile": "New File",
      "newFolder": "New Folder"
    },
    "reveal": "Reveal…",
    "rename": "Rename",
    "moveToTrash": "Move to Trash",
    "exportItems": {
      "exportToPlainText": "to Plain Text…",
      "exportToEncryptedFile": "to Encrypted File…",
      "exportToPDF": "to PDF…",
      "exportToArena": "to Are.na…"
    },
  },
  "verbs": {
    "ok": "OK",
    "open": "Open",
    "save": "Save",
    "cancel": "Cancel",
    "revert": "Revert",
    "discard": "Discard Changes",
    "trash": "Move to Trash",
    "report": "Report",
    "continue": "Continue",
    "back": "Back",
    "help": "Get Help",
    "retry": "Retry",
    "export": "Export"
  },
  "setup": {
    "ui": {
      "title": "Get Started with %{app_name}",
      "librarySelection": {
        "label": "Set library location",
        "placeholder": "Set a directory...",
        "tip": "Choose a location for your %{app_name} library. If you choose an existing library, %{app_name} will ask for your passphrase.",
      },
      "passphraseInput": {
        "label": {
          "newPassphrase": "Set your passphrase.",
          "existingPassphrase": "Enter library passphrase."
        },
        "tip": {
          "newPassphrase": "Set a long passphrase to secure your library.",
          "existingPassphrase": "Enter your library passphrase."
        }
      }
    },
    "buttons": {
      "completeSetup": "Complete Setup"
    },
  },
  "dialogs": {
    "securePassphrase": {
      "title": "Please take a moment to save your passphrase somewhere secure.",
      "detail": "%{app_name} has no \'forgot passphrase\' functionality and your library will be lost if you forget it!"
    },
    "revertFile": {
      "title": "Are you sure you want to revert %{name}?",
      "detail": "Your changes will be permanently lost if you choose to revert them."
    },
    "modifiedFile": {
      "title": "%{name} has been modified. Save changes?",
      "detail": "Your changes will be lost if you choose to discard them."
    },
    "trashItem": {
      "title": "Trash %{name}?",
      "detail": "The item will be moved to your computer\'s trash."
    },
    "exportPlainText": {
      "title": "Export %{name} as Plain Text"
    }
  },
  "errors": {
    "keyWrongPassphrase": {
      "title": "Wrong passphrase",
      "detail": "That passphrase didn\'t work – please try again."
    }
  }
}

module.exports = strings
