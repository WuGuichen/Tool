# Create Toolbox Plugin

This skill automates the creation of a new plugin for the Web Toolbox project.

### When to use
Use this skill when the user asks to "create a new plugin", "add a new tool", "做一个插件", or "make a [feature] plugin".

### Instructions
1. First, ask the user for the following details if they are not provided in the initial prompt:
   - The system name of the plugin (e.g., `calculator`, `weather`). Must be in snake_case.
   - A short display name (e.g., `计算器`, `天气预报`).
   - A description of what the plugin does.
   - An icon (emoji or a lucide-react icon name).

2. **Create the backend FastAPI router file** in `backend/app/plugins/<plugin_name>.py`.
   - Ensure it exports an `APIRouter` instance named `router`.
   - Ensure it defines `PLUGIN_META` correctly, matching the schema:
     ```python
     PLUGIN_META = {
         "name": "<plugin_name>",
         "display_name": "<display_name>",
         "description": "<description>",
         "route_path": "/<plugin_name_in_kebab_case>",
         "frontend_component": "<PluginNameInPascalCase>",
         "icon": "<icon>"
     }
     ```
   - Add initial API routes using `@router.get(...)` or `@router.post(...)`.

3. **Create the frontend React component file** in `frontend/src/plugins/<PluginNameInPascalCase>.tsx`.
   - It MUST export a default function component: `export default function <PluginNameInPascalCase>() { ... }`.
   - Ensure it uses Tailwind CSS and matches the existing design system (using `border-slate-200`, `shadow-sm`, `rounded-xl`, etc.).
   - Use the pre-configured `api` client from `@/lib/api` to make requests to `/plugins/<plugin_name_in_kebab_case>/...`.

4. Inform the user that the plugin has been dynamically registered. The backend will automatically load the new router, and the frontend will dynamically lazy-load the component via `React.lazy` without needing to restart the server (though a page refresh might be needed if Vite HMR doesn't auto-pick up the new file in the glob immediately).
