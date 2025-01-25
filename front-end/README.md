# Front-End

This is the **front-end** for the Skill Hearth application. It is built with **React**, uses **Vite** as the build tool, and is styled with **TailwindCSS**.

---

## **Features**
- Built with **React** and **TypeScript** for a modern, type-safe development experience.
- **Vite** for fast builds and live reload during development.
- **React Router** for client-side routing.
- Styled with **TailwindCSS** for rapid UI development.
- **Axios** for API requests.

---

## **Requirements**
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

---

## **Setup Instructions**

### 1. Install Dependencies
Navigate to the `front-end/` directory and install dependencies:
```bash
npm install
```

---

### 2. Run in Development Mode
Start the front-end development server:
```bash
npm run dev
```
The front-end will be available at `http://localhost:5173`.

---

### 3. Build for Production
Create a production-ready build:
```bash
npm run build
```

---

### 4. Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

---

### 5. Lint Code
Check for linting issues using **ESLint**:
```bash
npm run lint
```

---

## **Project Structure**

The front-end project follows a modular structure:

```
front-end/
├── src/
│   ├── components/   # Reusable React components
│   ├── pages/        # Page components for routing
│   ├── hooks/        # Custom React hooks
│   ├── styles/       # TailwindCSS styles and configurations
│   ├── assets/       # Static assets (images, fonts, etc.)
│   ├── main.tsx      # Application entry point
│   └── App.tsx       # Main application component
├── public/           # Static public assets
├── package.json      # Project dependencies and scripts
├── vite.config.ts    # Vite configuration file
└── tailwind.config.js# TailwindCSS configuration file
```

---

## **Available Scripts**

| Script         | Description                                                   |
|----------------|---------------------------------------------------------------|
| `dev`          | Starts the development server with live reload.               |
| `build`        | Builds the application for production.                        |
| `preview`      | Previews the production build locally.                        |
| `lint`         | Checks for linting issues using ESLint.                       |

---

## **Styling with TailwindCSS**

This project uses **TailwindCSS** for styling. The `tailwind.config.js` file is already set up for customization.

To add new styles:
1. Update the `tailwind.config.js` file for custom colors, fonts, or spacing.
2. Use utility classes in your components. Example:
   ```jsx
   <button className="bg-blue-500 text-white px-4 py-2 rounded">
     Click Me
   </button>
   ```

---

## **Routing with React Router**

React Router is used for client-side routing. The main routes are defined in `App.tsx`:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## **Axios for API Requests**

This project uses **Axios** for making API requests. Example usage:
```tsx
import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/data");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();
```

---

## **Conventional Commits**

This project follows the **Conventional Commits** standard for consistent and meaningful commit messages.

### **Format**
```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### **Examples**
- **Feature Addition:** `feat(ui): add login page`
- **Bug Fix:** `fix(router): correct navigation issue`

---

## **Contributing**

We welcome contributions! To get started:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes using Conventional Commits:
   ```bash
   git commit -m "feat(ui): add profile page"
   ```
4. Push your branch:
   ```bash
   git push origin feature/my-feature
   ```
5. Open a pull request.

---

To simplify your imports and avoid repeating paths like `./pages/Landing`, `./pages/Login`, etc., you can use an **`index.ts`** file inside the **`pages`** directory to centralize and re-export all components. This way, you can import multiple components from a single module.

Here’s how you can achieve this:

---

### **1. Set Up the `index.ts` File**

In your `pages/` directory, create an `index.ts` file:

**Directory Structure:**
```
src/
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── PageNotFound.tsx
│   ├── Logout.tsx
│   ├── Settings.tsx
│   ├── Profile.tsx
│   └── index.ts
```

**`pages/index.ts`:**
```typescript
export { default as Landing } from './Landing';
export { default as Login } from './Login';
export { default as Signup } from './Signup';
export { default as Dashboard } from './Dashboard';
export { default as PageNotFound } from './PageNotFound';
export { default as Logout } from './Logout';
export { default as Settings } from './Settings';
export { default as Profile } from './Profile';
```

This file re-exports all the components as named exports, allowing you to import them from the `pages` module directly.

---

### **2. Import Components Using the Centralized Module**

Now, instead of importing each component individually, you can import them all from the `pages` directory:

**Before:**
```typescript
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';
import Logout from './pages/Logout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
```

**After:**
```typescript
import {
  Landing,
  Login,
  Signup,
  Dashboard,
  PageNotFound,
  Logout,
  Settings,
  Profile
} from './pages';
```

---

### **3. Benefits of Using `index.ts`**

1. **Cleaner Imports:**
   - Centralizes all exports in one place, avoiding long and repetitive import statements.
   - Reduces the need for multiple `import` lines.

2. **Easier Maintenance:**
   - If you add, rename, or remove components, you only need to update the `index.ts` file.
   - No need to update every file that imports those components.

3. **Scalability:**
   - Works seamlessly as the project grows and you add more components or directories.

---

### **4. Optional: Enable Path Aliases for Cleaner Imports**
You can further simplify imports using **TypeScript path aliases** to avoid `./pages` and instead write shorter paths like `@pages`.

#### **Step 1: Update `tsconfig.json`**
Add a `paths` entry under `compilerOptions`:
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@pages/*": ["src/pages/*"]
    }
  }
}
```

#### **Step 2: Import Using Aliases**
Now, you can import components using the alias:
```typescript
import {
  Landing,
  Login,
  Signup,
  Dashboard,
  PageNotFound,
  Logout,
  Settings,
  Profile
} from '@pages';
```

This makes your imports even cleaner and avoids relative path issues.

---

### **5. Additional Tip: Automate `index.ts` File Creation**
To avoid manually managing the `index.ts` file, you can use tools like **Barrel Generator**:
- **VSCode Extension:** [Auto Barrel](https://marketplace.visualstudio.com/items?itemName=teamchilla.barrel)
- **CLI Tool:** Use a script or Node.js package like `barrelsby` to generate barrels (`index.ts`) automatically.

Example using **Barrelsby**:
1. Install the package:
   ```bash
   npm install -g barrelsby
   ```
2. Run the command in your `src/pages` directory:
   ```bash
   barrelsby --directory ./src/pages
   ```

This will create or update the `index.ts` file automatically.

---

By centralizing exports with an `index.ts` file and optionally using path aliases, you ensure your imports are clean, maintainable, and scalable for future growth. 😊

---

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](../LICENSE) file for details.

---

## **Questions or Feedback?**

Feel free to open an issue or contact [your-email@example.com].
