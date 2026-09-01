# Startup Innovation Hackathon - Synchronized Timer

A pro-level, fully synchronized real-time countdown timer built with Node.js, Express, and Socket.io. Features a pure minimalist black and white aesthetic, flawless responsive scaling, and a secure backend admin panel.

## 🚀 One-Click Deployments

> [!WARNING]  
> **Important Architecture Note:** This application requires a **running Node.js server** to power the real-time Socket.io synchronization. 
> - **GitHub Pages:** Only hosts static files. The timer UI will load, but the synchronization and backend controls will **NOT** work.
> - **Vercel / Netlify:** These use serverless functions which drop persistent WebSocket connections. The timer may frequently disconnect or fail to sync.
> - **Render / Railway / Heroku (RECOMMENDED):** These platforms host persistent Node.js servers and will run this application flawlessly.

### Recommended Node.js Hosts (Flawless Sync)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

---

### Requested Deploy Buttons

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
*Note: GitHub Pages does not have a direct deploy button, but you can deploy static assets by going to your repository **Settings > Pages** and selecting the `public` folder.*

---

## 🛠️ Local Development

To run the application locally on your machine:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Server:**
   ```bash
   npm start
   ```
   *(or run `node server.js`)*

3. **Access the App:**
   - Public Timer: [http://localhost:3001/](http://localhost:3001/)
   - Admin Controls: [http://localhost:3001/backend.html](http://localhost:3001/backend.html)
     - Username: `hack`
     - Password: `hack`

## 🎨 Features
- **Centralized Master Brain**: One admin panel dictates the timer state to all viewers instantly.
- **Flawless Responsiveness**: UI uses dynamic `vh/vw` constraints and full transparent images to scale gracefully on massive projectors and tiny mobile screens.
- **Security**: The `/backend.html` route handles administration safely via JWT (JSON Web Tokens), hiding credentials from the frontend code.
