# 🌦️ Weather WebApp - Vite + Tailwind

A sleek, mobile-friendly weather forecast app built with **Vite**, **Tailwind CSS**, and the **OpenWeatherMap API**.

---

## 🚀 Features

- 🔍 Search by city or use current location
- 📅 5-day forecast display
- 🎨 Animated gradient UI
- 📦 Vite-powered build setup
- 🔐 API key hidden using environment variables

---

## 🛠 Project Setup

```bash
npm install
npm run dev
```

Then open your browser at:  
📍 `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```
VITE_WEATHER_API_KEY=your_openweather_api_key_here
```

You can get a free API key from [https://openweathermap.org/](https://openweathermap.org/)

---

## 🧾 Deployment on Netlify

1. Push this folder to GitHub
2. On Netlify:
   - Set **Build Command**: `vite build`
   - Set **Publish directory**: `dist`
   - Add Environment Variable:
     ```
     VITE_WEATHER_API_KEY = your_key_here
     ```

3. Deploy and enjoy your live weather app!

---

## 📁 Folder Structure

```
weather-vite-app/
├── public/
│   └── index.html
├── src/
│   └── main.js
├── .env.example
├── vite.config.js
```

---

Made with ❤️ for learning, scalability, and Netlify-friendly hosting.
