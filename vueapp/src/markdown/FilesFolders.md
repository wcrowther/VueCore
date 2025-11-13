### Top-Level Folders

#### .vscode
Lorem ipsum...

---

#### dist
Lorem ipsum...

---

#### node_modules
Lorem ipsum...


---

#### obj/
Lorem ipsum...

---

#### public/
Contains static assets (images, favicon, etc.) that are served directly by the web server. Files here are not processed by the build tool.


### Src Folder

---

#### obj/
Holds build output and intermediate files for .NET projects. This folder is auto-generated and not meant for manual editing.

#### public/
Contains static assets (images, favicon, etc.) that are served directly by the web server. Files here are not processed by the build tool.

#### src/
The **src** directory contains the main source code for the Vue application, including components, pages, stores, utilities, and styles. Below is a breakdown of its top-level elements, with details for key subfolders and files.

### components/
Reusable Vue components that encapsulate UI elements and logic. Organized by feature or layout.

- **Boxes/**
  - Contains components for displaying boxed content.
    - **InfoBox.vue**: Shows its slot content only when the application's **infoLevel** is greater than 1. Used for contextual information based on user settings.

- **Layout/**
  - Components related to the application's layout and structure.
    - **MainSidebar.vue**: Responsive sidebar component. Uses the app store and window size to automatically show or hide itself based on a breakpoint (501px). The sidebar transitions smoothly and adapts to different screen sizes.

- *(Other folders may exist for additional component groups, such as forms, navigation, etc.)*

---

### views/
Vue components representing full pages or major application views. Each file typically maps to a route in the application.

- Example: **HomeView.vue**, **DashboardView.vue**, etc.  
  *(Actual files may vary depending on your project structure.)*

---

### store/
Pinia or Vuex store modules for managing global application state.

- Example: **appStore.js** or **appStore.ts**  
  *(Defines state such as **infoLevel**, **sideBarHidden**, etc.)*

---

### router/
Defines application routes and navigation logic.

- Example: **index.js** or **index.ts**  
  *(Configures paths, route guards, and lazy loading of views.)*

---

### assets/
Static assets such as images, fonts, and icons used within the application.

---

### styles/
Global and shared style files, such as CSS, SCSS, or Tailwind configuration overrides.


### Config Files

---

#### .env, .env.production, .env.qa
Environment variable files for different deployment environments. They store configuration values such as API endpoints, feature flags, and secrets.

#### .eslintrc-auto-import.json, .eslintrc.cjs
Configuration files for ESLint, which is used to enforce code quality and style rules. The **auto-import** file supports automatic import management.

#### .gitignore
Specifies files and directories that should be ignored by Git version control, such as build outputs and local configuration files.

#### aspnetcore-https.js
Script for managing ASP.NET Core HTTPS development certificates, typically used when integrating with a .NET backend.

#### auto-imports.d.ts, components.d.ts, typed-router.d.ts
TypeScript declaration files generated for auto-imported modules, global components, and typed routing. These improve type safety and editor support.

#### index.html
The main HTML entry point for the Vue application. It loads the JavaScript bundle and mounts the app.

#### nuget.config
Configuration file for NuGet, the .NET package manager. It specifies package sources and settings for .NET dependencies.

#### package.json
This file serves as the configuration file for npm. It contains essential metadata about the project, including the project name, version, scripts for building and running the application, and a list of dependencies required for the project to function properly.

#### postcss.config.js
Configuration for PostCSS, a tool for transforming CSS with plugins (e.g., autoprefixer, Tailwind CSS).

#### tailwind.config.js
Configuration for Tailwind CSS, specifying custom themes, plugins, and design tokens.

#### tsconfig.json
This file is the configuration file for TypeScript. It specifies compiler options such as the target ECMAScript version, module resolution strategy, and includes/excludes for files to be compiled. It ensures that TypeScript compiles the project correctly according to the specified settings.

#### README.md
This file contains documentation for the project. It typically includes an overview of the project, installation instructions, usage examples, and any other relevant information that helps users understand and work with the project.

#### vite.config.mjs
Configuration file for Vite, the frontend build tool. It defines plugins, server options, and build settings.

#### vueapp.esproj
Project files for the Vue frontend, used by certain IDEs for project management and user-specific settings.

#### vueapp.esproj.user
Project files for the Vue frontend, used by certain IDEs for project management and user-specific settings.

#### jsconfig.json
For VSCode IntelliSense (so auto-imports, jump-to-definition, etc. work), you also need this file at the root of your project.

---

### Example Component

#### src/components/Boxes/InfoBox.vue
This Vue component file utilizes the **`<script setup>`** syntax for the Composition API. It imports the **useAppStore** function to access the application store and employs **storeToRefs** to create reactive references to the **infoLevel** property from the store. The template conditionally renders a **`<div>`** element containing a slot for content, which is displayed only if **infoLevel** is greater than 1. This component is specifically designed to wrap around content that should only be visible when the **infoLevel** is set to either Info (2) or Help (3).