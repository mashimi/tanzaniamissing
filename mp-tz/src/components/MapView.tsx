"use client";
import { Fragment } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Person } from "@/lib/types";

export default function MapView({ persons }: { persons: Person[] }) {
  return (
    <MapContainer
      center={[-6.37, 34.89]}
      zoom={6}
      scrollWheelZoom
      style={{ height: 480, width: "100%", borderRadius: "0.75rem" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {persons.map(p => (
        <Fragment key={p.id}>
          {/* Coordinates were already fuzzed to ~1.1km at build time by build-data.mjs */}
          <Circle
            center={[p.location.latitude, p.location.longitude]}
            radius={2200}
            pathOptions={{ color: "#ef4444", fillOpacity: 0.07, weight: 1 }}
          />
          <CircleMarker
            center={[p.location.latitude, p.location.longitude]}
            radius={7}
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <strong className="text-gray-900 text-sm">{p.full_name}</strong>
                <br />
                <span className="text-gray-600 text-xs">{p.location.region} · {p.last_seen_date}</span>
                <br />
                <a href={`/persons/${p.id}/`} className="text-red-600 text-xs font-medium hover:underline">
                  View profile →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        </Fragment>
      ))}
    </MapContainer>
  );
}
