# Farmer Expense Tracker

A minimal, modern, mobile-friendly web app for tracking farming expenses by category. Designed for Indian farmers, with a focus on extensibility and ease of use.

## Features
- **Welcome screen** with farm-themed image and smooth animation
- **Bottom navigation** with clear active indicator
- **Add Expense** with custom dropdown for categories
- **Dashboard** with donut chart and monthly bar chart
- **Reports & Expenses** with real-time updates
- **Toast notifications** for feedback
- **Smooth transitions** throughout the app
- **Future-proof category system**: Easily add new expense categories in one place

## How to Run
1. Clone or download this repository.
2. Open `index.html` in your browser (no build step required).
3. Make sure your images (e.g., `assets/wheat-field.jpg`) are in the correct folder.

## How to Add a New Category
1. Open `script.js`.
2. At the top, find the `categories` array:
   ```js
   const categories = [
       { name: 'Seeds', color: '#23511e', legend: 'bg-green-900', icon: '🌱' },
       { name: 'Fertilizer', color: '#e6d7b0', legend: 'bg-[#e6d7b0]', icon: '🧪' },
       { name: 'Other', color: '#d6b95c', legend: 'bg-[#d6b95c]', icon: '🔔' }
       // Add more categories here as needed!
   ];
   ```
3. Add a new object for your category. Example:
   ```js
   { name: 'Pesticides', color: '#4b5563', legend: 'bg-gray-600', icon: '🧴' }
   ```
4. Save the file and refresh your browser. The new category will appear everywhere automatically.

## Project Structure
- `index.html` — Main HTML file
- `script.js` — All JavaScript logic (category system, UI, transitions)
- `assets/` — Folder for images (e.g., `wheat-field.jpg`)

## Customization
- Change the welcome image by replacing `assets/wheat-field.jpg`.
- Edit the welcome title/subtitle in `index.html`.
- Adjust colors/icons in the `categories` array in `script.js`.

## License
This project is for personal/educational use. Images are from royalty-free sources (Unsplash, Pixabay, or your own assets).

---

**Made with ❤️ for farmers and minimal web design.** 