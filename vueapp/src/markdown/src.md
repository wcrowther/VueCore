# `src` Directory Structure and Descriptions

The `src` directory contains the main source code for the Vue application, including components, pages, stores, utilities, and styles. Below is a breakdown of its top-level elements, with details for key subfolders and files.

---

## Folders

### `components/`
Reusable Vue components that encapsulate UI elements and logic. Organized by feature or layout.

- **`boxes/`**
  - Contains components for displaying boxed content.
    - `InfoBox.vue`: Shows its slot content only when the application's `infoLevel` is greater than 1. Used for contextual information based on user settings.

- **`Layout/`**
  - Components related to the application's layout and structure.
    - `MainSidebar.vue`: Responsive sidebar component. Uses the app store and window size to automatically show or hide itself based on a breakpoint (501px). The sidebar transitions smoothly and adapts to different screen sizes.

- *(Other folders may exist for additional component groups, such as forms, navigation, etc.)*

---

### `views/`
Vue components representing full pages or major application views. Each file typically maps to a route in the application.

- Example: `HomeView.vue`, `DashboardView.vue`, etc.  
  *(Actual files may vary depending on your project structure.)*

---

### `store/`
Pinia or Vuex store modules for managing global application state.

- Example: `appStore.js` or `appStore.ts`  
  *(Defines state such as `infoLevel`, `sideBarHidden`, etc.)*

---

### `router/`
Defines application routes and navigation logic.

- Example: `index.js` or `index.ts`  
  *(Configures paths, route guards, and lazy loading of views.)*

---

### `assets/`
Static assets such as images, fonts, and icons used within the application.

---

### `styles/`
Global and shared style files, such as CSS, SCSS, or Tailwind configuration overrides.

---

## Files

- **`main.js` / `main.ts`**  
  Entry point for the Vue application. Sets up the app, mounts it to the DOM, and configures plugins.

- **`App.vue`**  
  Root Vue component. Serves as the main layout wrapper for the application.

---

## Example: Component Details

- **`components/boxes/InfoBox.vue`**  
  Displays its slot content only when `infoLevel` (from the app store) is greater than 1. Used for showing contextual help or information.

- **`components/layout/MainSidebar.vue`**  
  Responsive sidebar that hides or shows itself based on window width and a breakpoint. Uses transitions for smooth appearance/disappearance and adapts to mobile/desktop layouts.

---

*Note: The actual contents of each folder may vary depending on your project's structure and features.*