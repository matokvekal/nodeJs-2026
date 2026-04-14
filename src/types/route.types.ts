export type RouteView = 'home' | 'day' | 'lecturer' | 'presentation';

export interface RouteState {
   view: RouteView;
   dayKey?: string;
   presIndex?: number;
}
