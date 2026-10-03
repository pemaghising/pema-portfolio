import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same mark as icon.svg: a dot leaving a motion trail toward a playhead. */
export default function AppleIcon() {
  const dot = (d: number, o: number) => (
    <div style={{ width: d, height: d, borderRadius: d, background: "#eeebe5", opacity: o, marginRight: 10 }} />
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0c" }}>
        {dot(30, 0.25)}
        {dot(38, 0.5)}
        {dot(56, 1)}
        <div style={{ width: 8, height: 100, background: "#a855f7", marginLeft: 8 }} />
      </div>
    ),
    size,
  );
}
