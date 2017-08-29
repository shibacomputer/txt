![Txt Logo](icon.png)
# Txt.app

Txt is a cute little private journalling app that keeps your work safe with
[well-documented encryption](https://en.wikipedia.org/wiki/Pretty_Good_Privacy).

https://txtapp.io

![Txt Screenshot](screenshot.png)

## Getting Started

```
git clone git@github.com:shibacomputer/txt.git txt
cd txt
npm run setup
npm start

✨ 📝 🚀!
```
## Disclaimer

Right now, on this branch, you can build and run Txt and use it. But:

🚫 **DO NOT USE THIS FOR ANYTHING SERIOUS** 🚫  
🚫 **THIS IS A HUGE WORK IN PROGRESS AND IS UNTESTED** 🚫

I can't stress this enough. This needs a lot of work.

## Why?
It's pretty simple – I don't like the majority of text editors that exist today.
I either don't trust them enough to sync between devices, they lack features
I really want, or they're trustworthy and feature-rich but difficult to use.

Txt is designed to be really useful on a day to day basis. This MVP focuses on
text entry, but 1.0 will include image embeds and management. We'll see where
this goes from there.

Choosing PGP and the filesystem as the app's foundation is deliberate. Rather
than build a database, it relies on the filesystem. Anything you make with Txt
can be read and reviewed somewhere else. There is no import/export tool, because
you don't need one. Everything used is off the shelf.


## Threat model
I'll write more on this later, but basically Txt is designed to allow you to
store data in untrusted locations, such as a cloud service or on a USB stick.

The app assumes your currently running device isn't compromised. In the MVP,
your passphrase is managed by your OS's keychain. The MVP will also not stop you
from creating a terrible passphrase and using that. This will change.

The idea is that you should be able to leave an unencrypted USB key somewhere
full of text documents and not have them nabbed. Ultimately, the MVP deals with
bad opsec rather than device security.

## Features
So far:  
✅ Simple PGP-managed filesystem-based notekeeping  
✅ Text editor  
✅ Keychain support  
✅ Dark UI  
⬜️ Markdown support  
⬜️ Markdown support  
⬜️ Light UI  
⬜️ Export to [Are.na](https://are.na)  
⬜️ Export to [Medium](https://medium.com)  
⬜️ Export to PDF  
⬜️ Automatic image management  
⬜️ Secure syncing (with multiple options!)  
⬜️ Linux support  
⬜️ Windows support (sorry!)  

## Big todos
⬜️ Migrate from Electron to [Muon](https://github.com/brave/muon)  
⬜️ Move PGP from renderer to main process (lmao)  
⬜️ Way smarter window management  
⬜️ Add file management  
⬜️ Add support for keys instead of passwords  
⬜️ Better support for file permission edge cases  

Have a feature request? [Submit one](https://github.com/shibacomputer/txt/issues/new)
