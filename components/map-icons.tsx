import { divIcon } from "leaflet";
import { MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// Leaflet's default marker loads PNGs by relative URL, which the bundler does not serve,
// so every marker in the app uses this inline SVG icon instead.
export function createPinIcon(fill: string, opacity = 1) {
  return divIcon({
    html: renderToStaticMarkup(
      <MapPin size={36} fill={fill} color="white" strokeWidth={2} opacity={opacity} />
    ),
    className:
      "offer-marker focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}
