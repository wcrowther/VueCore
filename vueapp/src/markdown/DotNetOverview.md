### Solution-Level Files
---

#### VueCore.slnx
The Visual Studio solution file, in the newer human-readable `.slnx` XML format, that ties the `vueapp`, `coreApi`, `coreData`, `coreLogic`, and `coreLibrary` projects together into one solution.

#### .editorconfig
Defines consistent coding styles (indentation, line endings, naming rules) enforced by editors and analyzers across every project in the repo.

#### .gitattributes / .gitignore
Git configuration controlling line-ending normalization and which build artifacts (`bin/`, `obj/`, `node_modules/`, etc.) are excluded from source control.

#### README.md
Top-level documentation describing the project, its architecture, and the three supported ways to run it locally (VS Code + Visual Studio, all Visual Studio, or all VS Code).

#### vuecore.code-workspace
A multi-root VS Code workspace file that opens `vueapp`, `coreApi`, `coreData`, `coreLogic`, and `coreLibrary` together as one workspace for the "VS Code for all projects" workflow.

#### /.github
Holds `copilot-instructions.md` (repo-specific guidance for AI coding assistants) and a `workflows` folder for GitHub Actions CI/CD pipeline definitions.

---

### coreApi &mdash; ASP.NET Core Minimal API Host
---
#### This is the executable web project: it owns `Program.cs`, application configuration, authentication, and every HTTP endpoint. It references `coreData`, `coreLogic`, and `coreLibrary`, plus `vueapp.esproj` so publishing the API also builds and bundles the SPA.

#### /Endpoints
One static partial class per feature area &mdash; `AccountEndpoints.cs`, `AuthenticateEndpoints.cs`, `ContentEndpoints.cs`, `MessageEndpoints.cs`, `UsersEndpoints.cs` &mdash; each registering a `MapGroup(...)` of routes (e.g. `/v1/accounts`) with Swagger tags/summaries. This convention-based registration keeps `Program.cs` from becoming a giant list of `app.MapGet(...)` calls.

#### /Helpers
Startup and cross-cutting utilities: `ServicesHelper.cs` and `EndpointsHelper.cs` (extension methods called from `Program.cs` to register services/endpoints), `SignalRHubsHelper.cs` (SignalR hub mapping), `SwaggerHelper.cs`/`SwaggerExamplesHelper.cs` (Swagger UI configuration and example payloads), `ValidateDataAnnotations.cs` (the custom attribute-based model validation used since Minimal API models don't get automatic validation), and `Extensions.cs`.

#### /Hubs
`ChatHub.cs` &mdash; the SignalR hub backing the real-time chat feature used by the Vue `UseChatHub`/`UseSignalR` composables and the `realtime` components.

#### /Properties
`launchSettings.json` configures the local launch profiles (ports, environment variables) used by `dotnet run`/Visual Studio/VS Code, plus a `PublishProfiles` folder for saved publish targets.

#### /wwwroot
Static content served directly by the API: `docs` holds the favicon/logo assets for the Swagger documentation page, and `swagger-ui` holds the customized look-and-feel assets for the `/docs` Swagger endpoint.

#### appsettings.json / appsettings.Development.json / appsettings.Production.json
Layered ASP.NET Core configuration &mdash; connection strings, JWT signing settings, CORS origins, and Serilog sinks &mdash; with the environment-specific file overriding `appsettings.json` at runtime.

#### coreApiData.db
The SQLite database file used by Entity Framework Core in local development, checked in so the app runs immediately without a migration step.

#### DebugMiddleware.cs
Custom ASP.NET Core middleware that logs incoming `HttpContext` requests (with sensitive values masked) to help diagnose model-binding and API issues, especially for POST requests with a JSON body.

#### coreApi.http
A `.http` request file (usable by the VS Code REST Client / Visual Studio's HTTP editor) with example requests for exercising the API's endpoints outside of the Vue app.

#### DatabaseDocumentation.html / web.config
`DatabaseDocumentation.html` is a static reference page describing the database schema; `web.config` configures IIS/ASP.NET Core Module hosting when the published site is deployed under IIS.

#### Program.cs
The single application entry point: configures JSON options, DI (`AppSettingsVm`, `FolderManager`, `FileManager`), SignalR, CORS, Serilog, the EF Core `DbContext`, JWT bearer authentication (reading the token from an `HttpOnly` cookie), Swagger, and the endpoint/middleware pipeline.

---

### coreLogic &mdash; Business Logic Layer
---
#### The layer between the API endpoints and the database. Endpoints depend only on the interfaces here, never on `coreData` directly, keeping persistence details out of the HTTP layer. References `coreData` and `coreLibrary`.

#### /Interfaces
One interface per manager &mdash; `IAccountManager`, `IAuthManager`, `IContentManager`, `ICookieManager`, `IMessageManager`, `ITokenManager`, `IUserClaimsManager`, `IUserManager` &mdash; registered for dependency injection so endpoints and other managers depend on abstractions rather than concrete classes.

#### /Managers
The concrete implementations: `AccountManager`, `AuthManager`, `ContentManager`, `MessageManager`, and `UserManager` hold the core CRUD/business logic for each entity; `CookieManager` and `TokenManager` handle issuing/reading the JWT access and refresh cookies; `UserClaimsManager` builds claims principals for authenticated users; `FileManager`/`FolderManager` implement the file/folder browsing and upload features used by the `files-folders` Vue components.

#### /Adapters
`AccountAdapter`, `MessageAdapter`, and `UserAdapter` map between `coreData` EF Core entities and the `coreLogic` view models, so the shape of data returned to the Vue client can evolve independently of the database schema.

#### /Models
View models (`Vm` suffix) and request DTOs sent to/from the Vue client &mdash; `AccountVm`, `UserVm`, `MessageVm`, `AppSettingsVm`, `AuthRequestVm`, `AuthRefreshRequest`, `AuthUser`, plus the file/folder browsing types `FileItem`, `FileRequest`, `FolderNode`, `FolderRequest`.

#### GlobalSuppressions.cs
Assembly-level `[assembly: SuppressMessage(...)]` attributes suppressing specific code-analysis warnings project-wide.

---

### coreData &mdash; EF Core Data Access Layer
---
#### The only project that talks to the database. It references just `coreLibrary`, keeping Entity Framework Core out of the business-logic and API layers entirely.

#### DataContext.cs
The single `DbContext` for the app, exposing `DbSet<Account>`, `DbSet<User>`, and `DbSet<Message>`. Overrides `SaveChanges`/`SaveChangesAsync` to automatically stamp created/modified audit fields on any entity implementing `IAuditable`.

#### /Interfaces
Repository contracts (`IAccountRepo`, `IContentRepo`, `IMessageRepo`, `IUserRepo`), plus `IAuditable` (the audit-stamping contract used by `DataContext`) and `ICurrentUserProvider` (resolves the current user id from the HTTP context for auditing).

#### /Repos
The EF Core repository implementations &mdash; `AccountRepo`, `ContentRepo`, `MessageRepo`, `UserRepo` &mdash; each built on LinqKit's `PredicateBuilder` for composable, multi-condition search used by the `PagedList` examples.

#### /Models
The EF Core entity classes mapped to database tables: `Account`, `User`, `Message`, `Image`, plus the search filter types `SearchForAccount`/`SearchForUser` and the `UserToCreate` DTO used by the user registration flow. `/Generic` is reserved for shared entity base types and is currently empty.

#### /Migrations
The EF Core migration history for the SQLite database, one timestamped pair of files per schema change (e.g. `AddAccountNotesTextArea`, `AddRefreshTokenRevocationFields`), plus `DataContextModelSnapshot.cs`, which EF Core uses to compute the next migration's diff. Applied locally via `Update-Database -Project coreData -StartupProject coreApi`.

#### /Helpers
Currently empty &mdash; reserved for data-layer utility classes as the project grows.

---

### coreLibrary &mdash; Shared Helpers and Models
---
#### The lowest-level project, with no dependency on ASP.NET Core or Entity Framework, so it can be referenced from any of the other three projects without pulling in web or database concerns.

#### /Models
Small, generic types shared across layers: `PagedList` and `Pager` (the paging request/response shapes used by every list endpoint), `Search` (base search/filter type), `Returns` (a standard success/failure result wrapper), and `Error` (a structured error payload).

#### /Helpers
`Extensions.cs` holds general-purpose C# extension methods, and `JsonHelpers.cs` holds shared `System.Text.Json`/`Newtonsoft.Json` serialization helpers used across the backend.

---
