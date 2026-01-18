# Brave Browser Setup

The plugin now supports using Brave browser for scraping! Brave is Chromium-based and provides enhanced privacy features.

## Configuration

1. Open plugin settings
2. Select "Brave" from the Browser dropdown
3. Enter the path to your Brave browser executable

## Brave Browser Paths

### macOS
```
/Applications/Brave Browser.app/Contents/MacOS/Brave Browser
```

### Linux
```
/usr/bin/brave-browser
```
or
```
/usr/bin/brave
```

### Windows
```
C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe
```
or
```
C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe
```

## Finding Your Brave Path

### macOS/Linux
Open Terminal and run:
```bash
which brave-browser
```
or
```bash
which brave
```

For macOS app bundle:
```bash
ls -la /Applications/Brave\ Browser.app/Contents/MacOS/
```

### Windows
Open Command Prompt and run:
```cmd
where brave.exe
```

Or check these common locations:
- `C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe`
- `C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe`
- `%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe`

## Why Use Brave?

- **Privacy**: Built-in ad blocking and tracker protection
- **Chromium-based**: Compatible with all Chromium extensions and features
- **Performance**: Faster page loads with built-in optimizations
- **Existing Profile**: Can use your existing Brave profile with saved logins

## Troubleshooting

### "Browser not found" error
- Verify the path is correct
- Make sure Brave is installed
- Try using the full absolute path

### Brave opens but doesn't navigate
- Check your cookies are set correctly
- Try running in non-headless mode first to see what's happening
- Ensure you have the latest version of Brave installed

### Using Existing Profile
By default, Playwright launches Brave with a fresh profile. If you want to use your existing Brave profile with saved logins, you'll need to specify the user data directory in the script (advanced users only).
