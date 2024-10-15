# 🌟 React - ThreeJS - EaselJS Drawing App 🎨

Welcome to the **React-ThreeJS EaselJS Drawing App** – a powerful tool for creating 2D and 3D visualizations! This app covers you whether you're looking to draw, manipulate shapes, or view objects in a 3D scene. Let's unleash your creativity! 🌐✨ This is the perfect boilerplate to kickstart your drawing projects with React, ThreeJS, and EaselJS! 🚀

### 🎥 Demo Video

https://github.com/user-attachments/assets/27ea7167-7dec-4ab3-911e-9e0686a1a496

### 🌍 Live Demo

https://react-threejs-easeljs.web.app/

## 🎯 Key Features

- 🎨 **Draw Shapes:** Draw rectangles, circles, lines, and custom paths effortlessly with a click-and-drag interface.
- ✋ **Shape Manipulation:** Move, drag, and delete shapes as needed. Shapes adjust in real time for a smooth experience!
- 🌐 **3D Viewer:** Toggle between 2D and view-only 3D mode to see your drawings come to life in a new dimension.
- 🎨 **Random Colors:** Each shape you create is assigned a random stroke and fill color.
- ⚡ **Real-Time Updates:** Watch your canvas update instantly as you interact with shapes.
- ⌨️ **Keyboard Support:** Delete selected shapes using the Delete or Backspace keys for quick editing.

## 🛠️ Tech Stack

This project is built using modern technologies:

- **React** ⚛️
- **Three.js** 🌐
- **EaselJS** 🎨
- **Vite** ⚡
- **Lodash** 🛠️
- **TypeScript** 🔧
- **Firebase** 🔥
- **SonarCloud** 🧪

### 📦 Dependencies

The project relies on several key libraries:

**React:** A library for building user interfaces.
**Three.js:** A powerful 3D engine for rendering the 3D view mode.
**EaselJS:** A library for drawing and manipulating 2D shapes.
**Vite:** A fast build tool for modern web development.
**Lodash:** A utility library for working with arrays, objects, and more.

### 🚀 Getting Started

To start the project locally, fork the repo and follow these steps:

```
1. 🍴 Fork the repository
2. 📥 Clone your forked repository
3. 🛠️ Run `yarn install` to install dependencies
4. 🚀 Run `yarn dev` to start the local development server
```

The app will run on http://localhost:5173.

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

### 👾 How can I contribute?

- ⭐ Star the repository
- 🛠️ Submit pull requests, report bugs, or suggest features

### 📬 Get in Touch

Feel free to reach out if you have any questions or need help:

- **GitHub:** https://github.com/mustafacagri
- **Linkedin:** [@MustafaCagri](https://www.linkedin.com/in/mustafacagri/)

Made with ❤️ in 📍 Istanbul, using React ⚛️, Three.js 🌐, EaselJS 🎨, TypeScript 🔧, Vite ⚡, and Lodash 🛠️!
