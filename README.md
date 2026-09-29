# VueCore

Created by Will Crowther

- Source: https://github.com/wcrowther/VueCore
- Live demo: https://www.vuecore.dev

## Overview

**VueCore** is an educational open source project to promote using **Vue.js** with a **.NET** backend to create a simple yet powerful application environment. It integrates a **Vue.js** SPA project (`.esproj`) built with **Vite** and a separate backend **ASP.NET Core Minimal API** project so both can be built into a single deployment with a Visual Studio **Publish** or a `dotnet publish` from the CLI.

The project includes real-world examples of client-side **Pinia** stores using cookie/JWT-based authentication for secure API access to the .NET backend. The client project features page-based routing and automatic component/import registration.

Rather than relying on third-party UI libraries, VueCore focuses on clean, simple components that reflect your code intent and are easy to adapt. It isn't meant to be the definitive way to build an app — just a solid starting point, with a number of techniques worth exploring throughout both the Vue.js and .NET projects.

### Vue / ASP.NET Combined Solution

The solution keeps a clear separation of concerns by isolating the frontend (Vue) and backend (ASP.NET Minimal API) into distinct projects, while integrating the build and publish processes so both layers compile and deploy as a single web application.

- **`.slnx` solution format** — the newer, human-readable Xml solution format, roughly 1/3 the size of a classic `.sln`.
- **`.esproj` JavaScript project format** — lets the Vue project be nested inside the Visual Studio solution as a discrete project instead of just a folder of content.
- **One-click start** — both projects can be run together from Visual Studio using a normal *Start* command that serves them as a single site.
- **Multiple starts** — alternately, edit/debug the C# project in Visual Studio and use VS Code for the Vue project, launching them separately for development but combined into a single site for production.
- **EZ publish** — publishing the ASP.NET project from Visual Studio also builds the Vue project in Release mode and deploys it alongside the API.
- **API documentation** — a Swagger page documents all endpoints (can be disabled in Production).

### Vue.js App (Vite + Pinia)

The Vue.js 3.5 project uses the Composition API with Vite and Pinia for state management, plus Unplugin for page-based routing and auto-imports of Vue and custom components. Instead of a third-party UI library, it ships simple reusable components (pagers, toasts, modals, form inputs, etc.).

- Vite build with fast HMR feedback while editing pages/components.
- Page-based routing via `unplugin-vue-router`, driven by the `src/pages` folder hierarchy.
- SPA navigation with two levels of tabbed navigation and no full page reloads.
- Boilerplate-free imports via `unplugin-vue-components` and `unplugin-auto-import`.
- Custom components for form inputs (with validation), modals/confirmation controls, layout, and icons.
- List pager with an integrated debugger and advanced multi-term search, plus list/detail views for mobile.
- Styled with TailwindCSS, using CSS variables so themes/designs can be swapped out.
- Adaptive mobile/web layout with a collapsible left navigation area.
- Contextual keyboard shortcuts (e.g. Ctrl+S to save, Esc to hide navigation, arrow keys to move between records).
- Pinia stores for global state and cross-cutting services/data access.
- Custom API composable managing JWT/cookie auth and centralized error toasts.
- `VueUse` for local storage, clipboard, screen size, and other utilities.
- Model validation with `Vuelidate` before submitting to the server.
- A global, progressive help system (`None` / `Info` / `Help`) toggled from the nav bar.

### .NET Minimal API Backend

The C# ASP.NET Core Minimal API project demonstrates simple but powerful patterns to help you get started building your own backend.

- **SQLite** via Entity Framework Core (straightforward to swap for SQL Server, MySQL, etc.).
- **Cookie-based JWT authentication** — `login` issues the access/refresh tokens as `HttpOnly`, `Secure` cookies; the token is never returned in the response body or stored by the client app. Role-based authorization is backed by an editable user table. (A separate `token` endpoint is also available for clients that need the raw JWT in the response.)
- **PagedList** examples using LinqKit's `PredicateBuilder` for composable, multi-condition search.
- **Attribute-based model validation** for Minimal API models.
- **Debug middleware** to help troubleshoot incoming requests, including masked logging of JSON POST bodies.
- **File-based event logging** using `ILogger` with Serilog.
- **Convention-based endpoint registration** to keep `Program.cs` clean.
- **DI registration** moved to an external file to simplify `Program.cs`.
- **Swagger API documentation**, with authorization and look-and-feel customization.

## Project Structure

| Project | Description |
| --- | --- |
| `vueapp` | Vue.js 3 SPA (Vite, Pinia, Vue Router) — the client application. |
| `coreApi` | ASP.NET Core Minimal API host — endpoints, authentication, SignalR hubs, and app configuration/startup. |
| `coreLogic` | Business logic layer — managers, adapters, and interfaces consumed by `coreApi`. |
| `coreData` | EF Core data access layer — `DataContext`, migrations, and repositories. |
| `coreLibrary` | Shared helpers and models used across the other .NET projects. |

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS)
- [Visual Studio 2026](https://visualstudio.microsoft.com/) with the **ASP.NET and web development** workload (for the `.NET` projects)
- [VS Code](https://code.visualstudio.com/) with the [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (for the `vueapp` project)

VueCore uses a local HTTPS dev certificate for both the API and the Vite dev server. If you haven't already trusted one, run:

```sh
dotnet dev-certs https --trust
```

### Option 1: VS Code for `vueapp` + Visual Studio 2026 for the rest (preferred)

1. Clone the repository.
2. **Backend** — Open `VueCore.slnx` in Visual Studio 2026.
   - NuGet packages restore automatically on load.
   - Confirm `coreApi` is set as the startup project.
   - A SQLite database (`coreApi/coreApiData.db`) is included, so no migration step is required to get started. If you need to (re)apply migrations after model changes, use the Package Manager Console: `Update-Database -Project coreData -StartupProject coreApi`.
   - Press **F5** (or **Start**) to launch the API — it opens the Swagger docs page at `https://localhost:9999/docs`.
3. **Frontend** — Open the `vueapp` folder in VS Code.
   - Run `npm install`.
   - Run `npm run dev` to start the Vite dev server at `https://localhost:7200` (this also generates the local HTTPS dev certificate used by the Vue app on first run).
4. Browse to `https://localhost:7200` — the Vue app calls the running `coreApi` backend directly.
5. **Deploying** — Right-click the `coreApi` project in Visual Studio and choose **Publish**. Since `coreApi` has a project reference to `vueapp.esproj`, publishing also runs the Vue app's `ProductionBuildCommand` (`npm run build`) and includes its `BuildOutputFolder` (`dist`) output in the publish package, so the compiled Vue app and the .NET API are deployed together as a single web site (served via `app.MapFallbackToFile("/index.html")` in `Program.cs`).

### Option 2: Visual Studio 2026 for all projects

1. Clone the repository.
2. Open `VueCore.slnx` in Visual Studio 2026 — this loads the `.NET` projects and the `vueapp` project (`.esproj`) together.
   - NuGet packages restore automatically. Visual Studio also restores npm packages for `vueapp`; if you're prompted or want to be sure, run `npm install` from the **Terminal** in the `vueapp` project.
3. Right-click the **Solution** and select **Configure Startup Projects**.
   - Choose **Multiple startup projects**.
   - Set the **Action** to **Start** for both `coreApi` and `vueapp`.
   - (Optional) For `vueapp`, set **Debug Target** to **localhost (Chrome)**.
4. Press **F5** (or **Start**) to launch both projects.
5. Visual Studio opens the Vue.js app and the C# Minimal API in separate windows. By default, the Vue app runs at `https://localhost:7200` and calls the API at `https://localhost:9999` (Swagger docs at `https://localhost:9999/docs`).
6. **Deploying** — Right-click `coreApi` and choose **Publish**, the same as in Option 1, step 5.

### Option 3: VS Code for all projects

1. Clone the repository.
2. Open `vuecore.code-workspace` in VS Code — this is a multi-root workspace with the `vueapp`, `coreApi`, `coreData`, `coreLogic`, and `coreLibrary` folders. VS Code prompts to install the extensions recommended for `vueapp` (Vue - Official, ESLint); also install the **C# Dev Kit** extension for working with the `.NET` projects.
3. **Backend** — from a terminal at the repository root, restore and run the API:
   ```sh
   dotnet restore
   dotnet run --project coreApi
   ```
   This serves the API at `https://localhost:9999` (Swagger docs at `/docs`).
4. **Frontend** — in a separate terminal:
   ```sh
   cd vueapp
   npm install
   npm run dev
   ```
   This serves the Vue app at `https://localhost:7200`, calling the running `coreApi` backend directly.
5. Browse to `https://localhost:7200`.
6. **Debugging** — use the C# Dev Kit extension's Run/Debug CodeLens on `coreApi/Program.cs` (or add your own `.vscode/launch.json`) to attach the debugger to the API process.
7. **Deploying** — from a terminal, `dotnet publish coreApi -c Release` builds `coreApi`, and because of its project reference to `vueapp.esproj`, also runs the Vue app's production build and includes its output, producing the same single deployable web site described in Option 1, step 5.

## License

Licensed under the [Apache License 2.0](LICENSE.txt).
