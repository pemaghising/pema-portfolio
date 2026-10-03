import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0d0c",
          color: "#eeebe5",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 1 }}>
          <span>{site.role.toUpperCase()}</span>
          <span style={{ opacity: 0.6 }}>{site.tagline.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 200, fontWeight: 800, lineHeight: 0.82, letterSpacing: -10 }}>
          <span>PEMA</span>
          <span>GHISING</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 4, height: 40, background: "#a855f7", marginRight: 24 }} />
          <div style={{ flex: 1, height: 2, background: "rgba(238,235,229,.3)" }} />
        </div>
      </div>
    ),
    size,
  );
}
