export interface UserInfo {
  id: number;
  username: string;
  is_superuser: boolean;
  role: string | null;
}

export interface PluginMeta {
  name: string;
  display_name: string;
  description: string;
  route_path: string;
  frontend_component: string;
  icon?: string | null;
}
