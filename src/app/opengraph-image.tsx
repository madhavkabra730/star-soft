import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoData = await readFile(join(process.cwd(), "public/icons/starsoft_logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        background: "#232323",
      }}
    >
      <img src={logoSrc} width={380} height={143} alt="" />
      <div
        style={{
          display: "flex",
          color: "#cccccc",
          fontSize: 32,
          letterSpacing: 6,
        }}
      >
        NFT MARKETPLACE
      </div>
    </div>,
    { ...size },
  );
}
