import { Bookmark, HomeIcon, MapIcon, WandSparklesIcon } from "lucide-react";

export const APP_NAV_ITEMS = [
  { id: 1, title: "Inicio", url: "/", icon: HomeIcon },
  { id: 2, title: "Mapa", url: "/mapa", icon: MapIcon },
  { id: 3, title: "Guardados", url: "/guardados", icon: Bookmark },
  { id: 4, title: "Ofertas sugeridas", url: "/analisis-cv", icon: WandSparklesIcon },
] as const;
