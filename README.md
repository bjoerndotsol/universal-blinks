# Universal Blinks

Universal Blinks is a wrapper solution that makes Solana Blinks work seamlessly across all platforms, especially on mobile devices and social media.

## The Problem

When sharing Solana Blinks on social media, you encounter several issues:

1. **No Open Graph (OG) data**: Blinks don't display proper previews on social platforms
2. **Mobile compatibility**: Blinks don't work properly on mobile devices unless opened in an in-app browser from your wallet
3. **Poor user experience**: Users often can't interact with Blinks as intended

## The Solution

Universal Blinks acts as an intelligent wrapper that:

- **On Mobile**: Opens a user-friendly interface where users can select their preferred wallet (Solflare or Phantom) and opens the Blink via deeplink/universal link
- **On Desktop**: Redirects to the dial.to interstitial page for optimal experience
- **Everywhere**: Provides consistent functionality across all platforms and devices

## Supported Wallets

- 🟣 **Phantom Wallet**
- 🟡 **Solflare Wallet**

## How to Use

Simply wrap any Blink URL with Universal Blinks:

```
https://universal-blinks.vercel.app/?url=[YOUR_BLINK_URL]
```

### Example URLs

Try these examples on both mobile and desktop:

**Solana Transfer Blink:**
```
https://universal-blinks.vercel.app/?url=https%3A%2F%2Fsolana.dial.to%2Fapi%2Factions%2Ftransfer
```

**BONK Lock Blink:**
```
https://universal-blinks.vercel.app/?url=https%3A%2F%2Fbonkblinks.com%2Fapi%2Factions%2Flock
```

## Features

- ✅ **Cross-platform compatibility**: Works on mobile and desktop
- ✅ **Wallet selection**: Choose between supported wallets on mobile
- ✅ **Deeplink integration**: Seamless wallet opening via universal links
- ✅ **Social media friendly**: Better sharing experience
- ✅ **Zero configuration**: Just wrap your Blink URL and share

## Tech Stack

- **Framework**: Next.js
- **Deployment**: Vercel
- **Styling**: Modern CSS/Tailwind 
- **Mobile Detection**: User-agent based routing

## Contributing

Contributions are welcome! Feel free to:

- Add support for more wallets
- Improve mobile UX
- Enhance desktop experience
- Fix bugs and issues

## More Links

- [Live Demo](https://universal-blinks.vercel.app)
- [Solana Blinks Documentation](https://docs.dialect.to/blinks)
- [Dial.to](https://dial.to)
