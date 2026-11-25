// Generates the link-preview image (Open Graph) shown when the invitation link is shared.
// Usage: npm run og   ->  app/opengraph-image.jpg (+ twitter-image.jpg), 1200x630 (needs ffmpeg for JPEG)
import { readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root));
const cfg = JSON.parse(read("config/wedding.json"));

const MONTHS = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
const [y, m, d] = cfg.date.split("-").map(Number);
const [n1, n2] = cfg.nameOrder === "bride-first" ? [cfg.bride, cfg.groom] : [cfg.groom, cfg.bride];
const dateLine = `${d} ${MONTHS[m - 1]} ${y}  ·  Ora ${cfg.time}`;

const envelope = `data:image/jpeg;base64,${read("public/img/envelope.jpg").toString("base64")}`;
const fonts = [
  { name: "Cormorant", data: read("node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff"), weight: 500, style: "normal" },
  { name: "Cormorant", data: read("node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff"), weight: 600, style: "normal" },
  { name: "Pinyon", data: read("node_modules/@fontsource/pinyon-script/files/pinyon-script-latin-400-normal.woff"), weight: 400, style: "normal" },
];

const h = (type, style, children) => ({ type, props: { style, children } });
const img = (src, style) => ({ type: "img", props: { src, style } });

const W = 1200, H = 630;
// envelope artwork is 1024x1536; show the envelope itself on the left
const envH = 590, scale = envH / 1264, envW = Math.round(964 * scale);

const tree = h("div", { width: W, height: H, display: "flex", position: "relative", background: "#e6d6bd", overflow: "hidden" }, [
  // soft satin backdrop from the same artwork
  img(envelope, { position: "absolute", left: -100, top: -700, width: 1400, height: 2100, filter: "blur(22px)", opacity: 0.95 }),
  h("div", { position: "absolute", left: 0, top: 0, width: W, height: H, background: "linear-gradient(90deg, rgba(90,62,30,.10), rgba(253,248,238,.0) 45%, rgba(253,248,238,.35))" }, []),
  // the envelope (cropped window into the approved artwork)
  h("div", { position: "absolute", left: 96, top: 20, width: envW, height: envH, display: "flex", overflow: "hidden", boxShadow: "0 18px 40px rgba(60,40,20,.35)" }, [
    img(envelope, { position: "absolute", left: -30 * scale, top: -188 * scale, width: 1024 * scale, height: 1536 * scale }),
  ]),
  // invitation copy, as on the opening screen
  h("div", {
    position: "absolute", left: 600, top: 86, width: 500, height: 458,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    background: "rgba(253,248,238,.9)", border: "1.5px solid rgba(181,138,73,.75)", borderRadius: 6,
    boxShadow: "0 12px 30px rgba(73,51,33,.18)",
  }, [
    h("div", { position: "absolute", left: 10, top: 10, right: 10, bottom: 10, border: "1px solid rgba(181,138,73,.45)", borderRadius: 3, display: "flex" }, []),
    h("div", { fontFamily: "Cormorant", fontWeight: 600, fontSize: 54, letterSpacing: 6, color: "#493321", lineHeight: 1.1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }, [
      h("span", {}, "FTESË PËR"),
      h("span", {}, "FEJESËN TONË"),
    ]),
    h("div", { display: "flex", alignItems: "center", margin: "22px 0 10px" }, [
      h("div", { width: 90, height: 1.5, background: "#b58a49" }, []),
      h("div", { width: 10, height: 10, background: "#b58a49", transform: "rotate(45deg)", margin: "0 12px" }, []),
      h("div", { width: 90, height: 1.5, background: "#b58a49" }, []),
    ]),
    h("div", { fontFamily: "Pinyon", fontSize: 66, color: "#6b4a2c", lineHeight: 1.25, display: "flex" }, `${n1} & ${n2}`),
    h("div", { fontFamily: "Cormorant", fontWeight: 500, fontSize: 30, color: "#79654f", marginTop: 8, display: "flex" }, dateLine),
  ]),
]);

const svg = await satori(tree, { width: W, height: H, fonts });
const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
const tmp = fileURLToPath(new URL("scripts/og-tmp.png", root));
const out = new URL("app/opengraph-image.jpg", root);
writeFileSync(tmp, png);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", tmp, "-q:v", "3", fileURLToPath(out)]);
rmSync(tmp);
copyFileSync(out, new URL("app/twitter-image.jpg", root));
writeFileSync(new URL("app/opengraph-image.alt.txt", root), `Ftesë për fejesën tonë — ${n1} & ${n2}, ${dateLine}`);
writeFileSync(new URL("app/twitter-image.alt.txt", root), `Ftesë për fejesën tonë — ${n1} & ${n2}, ${dateLine}`);
console.log("OG image written:", readFileSync(out).length, "bytes");
