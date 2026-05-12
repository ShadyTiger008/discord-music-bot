# 🎶 Shady Boi Music Bot

A production-grade, scalable Discord music bot built with **Discord.js v14** and **@discordjs/voice**.

## 🚀 Features

- **Recursive Command Loading:** Easily scale by adding new command categories in `src/commands`.
- **Unified Handlers:** Support for both **Slash Commands** and **Prefix Commands** (@shady).
- **High-Quality Audio:** Powered by `@distube/ytdl-core` with robust error handling.
- **Structured Architecture:** Clean separation of concerns (Commands, Events, Player, Utils).
- **Advanced Logging:** Detailed, colored console logs for easier debugging.

## 🛠️ Prerequisites

- **Node.js:** v18.0.0 or higher.
- **FFmpeg:** Required for audio processing. [Download FFmpeg here](https://ffmpeg.org/download.html).

## 📥 Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file with your `LOGIN_TOKEN`, `CLIENT_ID`, and `GUILD_ID`.

## 📡 Deployment

Before running the bot for the first time (or after adding new commands), sync the Slash commands:
```bash
npm run build:command
```

## ▶️ Running

- **Development:** `npm run dev` (uses nodemon)
- **Production:** `npm start`

## 📜 Commands

| Command | Description |
| :--- | :--- |
| `/bajao <url>` | Plays a YouTube song or playlist |
| `/ruko` | Pauses the current song |
| `/chalu` | Resumes the paused song |
| `/skip` | Skips to the next song |
| `/chup` | Stops the music and clears the queue |
| `/volume <1-100>` | Adjusts the player volume |
| `/queue` | Shows the current music queue |
| `/goto <index>` | Jumps to a specific song in the queue |
| `/search <query>` | Searches YouTube and plays the top result |
| `/ping` | Check the bot's latency |
| `/help` | View usage information |

## 🛡️ License

This project is licensed under the ISC License.
