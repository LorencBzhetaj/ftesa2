import raw from "./config/wedding.json";

export type TimelineItem = { time: string; label: string; icon?: string };

const MONTHS = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
const DAYS = ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"];

/** Real values from config win; demo values are used only as clearly labelled preview data. */
export function getWedding() {
  const c = raw;
  // "bride-first" shows Meli & Adi; default shows groom first
  const brideFirst = (c as { nameOrder?: string }).nameOrder === "bride-first";
  const first = brideFirst ? c.bride : c.groom;
  const second = brideFirst ? c.groom : c.bride;
  const dateIsDemo = !c.date;
  const timelineIsDemo = c.timeline.length === 0;
  const iso = (c.date ?? c.demo.date) as string;
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return {
    names: c.displayNames ?? `${first} & ${second}`,
    first,
    second,
    time: c.time,
    iso,
    year: y,
    month: m,
    day: d,
    monthName: MONTHS[m - 1],
    date: `${d} ${MONTHS[m - 1]} ${y}`,
    weekday: DAYS[wd],
    /** event start as an absolute timestamp string, e.g. 2026-12-27T13:00:00+01:00 */
    startsAt: `${iso}T${c.time}:00${c.utcOffset ?? "+01:00"}`,
    dateIsDemo,
    timeline: (timelineIsDemo ? c.demo.timeline : c.timeline) as TimelineItem[],
    timelineIsDemo,
    invitationText: (c.invitationText ?? c.demo.invitationText) as string,
    closingText: (c.closingText ?? c.demo.closingText) as string,
    textIsDemo: !c.invitationText,
    venue: c.venue as { name: string; address: string | null; mapsUrl: string | null; image: string | null },
    photo: (c.photo ?? null) as string | null,
    photos: ((c as { photos?: string[] }).photos ?? []) as string[],
    signature: ((c as { signature?: { lead: string; name: string } }).signature ?? null) as { lead: string; name: string } | null,
    quotes: ((c as { quotes?: string[] }).quotes ?? []) as string[],
    confirmed: c.confirmed,
  };
}
export type Wedding = ReturnType<typeof getWedding>;
