# LAKHSONN OS — Desktop App (macOS + Windows)

Native desktop app for **LAKHSONN OS** (Movezle Technologies Pvt Ltd). It opens the live
platform (https://lakhsonn.movezle.com) in a branded window — users log in or **Request Access**
exactly as on the web. Because it loads the live site, every web deploy updates the desktop app too.

## How releases work (installers are built in the cloud — no Windows machine needed)

Pushing a version tag triggers GitHub Actions to build:
- **macOS** → `LAKHSONN-OS.dmg` (universal: Apple Silicon + Intel)
- **Windows** → `LAKHSONN-OS-Setup.exe` (installer with Desktop + Start Menu shortcuts)

…and publish them to a GitHub Release. The download buttons on movezle.com point at the
stable "latest" links, so they never need changing:

```
https://github.com/shreeman2022/lakhsonn-desktop/releases/latest/download/LAKHSONN-OS.dmg
https://github.com/shreeman2022/lakhsonn-desktop/releases/latest/download/LAKHSONN-OS-Setup.exe
```

## First-time setup (once)

```bash
cd lakhsonn-desktop
git init && git add -A && git commit -m "LAKHSONN OS desktop app"
gh repo create lakhsonn-desktop --public --source=. --remote=origin --push
```
(The repo must be **public** for the download links to work without login. The app just
opens your website — no secrets live in this repo.)

## Ship a version

```bash
git tag v1.0.0
git push origin v1.0.0
```
Watch it build under the repo's **Actions** tab (~5–8 min). When it's green, the two installer
files are live at the links above and the movezle.com Download buttons work.

Next version: bump `"version"` in package.json, commit, then `git tag v1.0.1 && git push origin v1.0.1`.

## Mac signing (recommended before wide client rollout)

Unsigned Mac apps make macOS show a warning; users must **right-click → Open** the first time.
To remove that entirely you need an **Apple Developer account** ($99/yr). Then add these GitHub
repo secrets (Settings → Secrets and variables → Actions) and re-tag a release:

| Secret | Value |
|---|---|
| `MAC_CERT_P12_BASE64` | your "Developer ID Application" certificate exported as .p12, base64-encoded |
| `MAC_CERT_PASSWORD` | the .p12 password |
| `APPLE_ID` | your Apple ID email |
| `APPLE_APP_SPECIFIC_PASSWORD` | an app-specific password from appleid.apple.com |
| `APPLE_TEAM_ID` | your 10-character Team ID |

The workflow signs + notarizes automatically once these exist. Windows works unsigned
(a one-time "unknown publisher → Run anyway" prompt); a code-signing certificate removes that too.

## Run locally (for testing)
```bash
npm install
npm start
```
