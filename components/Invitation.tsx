"use client";
import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Wedding } from "@/lib";
import EnvelopeIntro from "./EnvelopeIntro";
import { Corner, Divider, Icon } from "./Ornaments";
import GoldFrame from "./GoldFrame";
import DateCalendar from "./DateCalendar";

function Demo({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="demo-tag">shembull · për t&rsquo;u konfirmuar</span>;
}

function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((l, i) => (
        <span key={i} className="line">
          {l}
        </span>
      ))}
    </>
  );
}

/** Arched gold frame used for the couple's photos (the venue keeps its own rectangular frame). */
function PhotoFrame({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <figure className={"featured-frame " + className}>
      <svg className="featured-orn" viewBox="0 0 120 40" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8c6428" />
            <stop offset=".45" stopColor="#f3dda3" />
            <stop offset="1" stopColor="#a87b38" />
          </linearGradient>
        </defs>
        <path d="M30 18 C20 10 8 12 2 20 M90 18 C100 10 112 12 118 20" fill="none" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M60 4 C66 14 76 18 88 18 C78 22 68 26 60 36 C52 26 42 22 32 18 C44 18 54 14 60 4Z" fill={`url(#${id})`} />
        <circle cx="60" cy="20" r="4" fill="#fff6dc" stroke="#b58a49" strokeWidth="1" />
      </svg>
      <span className="featured-inner">
        <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
      </span>
    </figure>
  );
}

export default function Invitation({ w }: { w: Wedding }) {
  const [stage, setStage] = useState<"intro" | "open">("intro");
  const [reduced, setReduced] = useState(false);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("locked", stage === "intro");
    if (stage !== "open") return;
    window.scrollTo(0, 0);
    if (reduced) {
      document.querySelectorAll<HTMLElement>(".intro-in").forEach((el) => (el.style.opacity = "1"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    if (process.env.NODE_ENV !== "production") (window as unknown as { gsap: typeof gsap }).gsap = gsap;
    const ctx = gsap.context(() => {
      // Seamless hand-off from the envelope card: the page "develops" line by line.
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".gold-frame", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, ease: "power1.out" }, 0)
        .set(".lead", { opacity: 1 }, 0.15)
        .fromTo(".lead .line", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15 }, 0.15)
        .fromTo(".names .name-line", { autoAlpha: 0, y: 22, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.22 }, 0.5)
        .fromTo(".intro-copy .divider", { autoAlpha: 0, scaleX: 0.3 }, { autoAlpha: 1, scaleX: 1, duration: 1 }, 1.2)
        .fromTo(".intro-copy ~ .featured:not(.featured-more) .featured-frame", { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4 }, 1.4);
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    }, main);
    return () => ctx.revert();
  }, [stage, reduced]);

  const v = w.venue;

  return (
    <>
      {stage === "intro" && <EnvelopeIntro w={w} reducedMotion={reduced} onDone={() => setStage("open")} />}

      <main ref={main} className={`scroll ${stage === "open" ? "is-open" : ""}`} aria-hidden={stage === "intro"}>
        <div className="paper">
          <GoldFrame />
          <section className="block intro-copy" aria-labelledby="names">
            <p className="lead intro-in">
              <Lines text={w.invitationText} />
            </p>
            <Demo show={w.textIsDemo} />
            <h1 id="names" className="names">
              <span className="name-line intro-in">{w.first}</span>
              <span className="amp name-line intro-in">&amp;</span>
              <span className="name-line intro-in">{w.second}</span>
            </h1>
            <Divider className="intro-in" />
          </section>

          {w.photo && (
            <section className="block featured" aria-label="Foto e çiftit">
              <PhotoFrame src={w.photo} alt={`${w.first} dhe ${w.second}`} className="intro-in" eager />
            </section>
          )}

          {w.quotes.length > 0 && (
            <section className="block quotes" aria-label="Fjalët tona">
              <span className="quote-mark reveal" aria-hidden="true">
                “
              </span>
              {w.quotes.map((q, i) => (
                <div key={i} className="quote reveal">
                  {i > 0 && <span className="quote-sep" aria-hidden="true" />}
                  <p>{q}</p>
                </div>
              ))}
              <Divider className="reveal" />
            </section>
          )}

          {w.photos[0] && (
            <section className="block featured featured-more" aria-label="Foto e çiftit">
              <PhotoFrame src={w.photos[0]} alt={`${w.first} dhe ${w.second}`} className="reveal" />
            </section>
          )}

          <DateCalendar w={w} />

          <section className="block program" aria-labelledby="prog">
            <h2 id="prog" className="script-h reveal">Programi i Fejesës</h2>
            <Icon name="toast" className="reveal program-icon" />
            <p className="program-line reveal">
              Mikpritja fillon në orën <b>{w.time}</b>
            </p>
          </section>

          <section className="block venue" aria-labelledby="loc">
            <Corner side="left" />
            <Corner side="right" />
            <Icon name="pin" className="reveal" />
            <h2 id="loc" className="script-h reveal">Lokacioni</h2>
            {v.image && (
              <figure className="venue-frame reveal">
                <img src={v.image} alt={`Lokali ${v.name}`} loading="lazy" />
              </figure>
            )}
            <p className="venue-name reveal">{v.name}</p>
            {v.address && <p className="venue-addr reveal">{v.address}</p>}
            {!v.address && !v.mapsUrl && <p className="venue-addr reveal">Adresa do të konfirmohet</p>}
            {v.mapsUrl && (
              <a className="map-btn reveal" href={v.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" /> Shiko në Hartë
              </a>
            )}
            <Divider className="reveal" />
          </section>

          {w.photos[1] && (
            <section className="block featured featured-more" aria-label="Foto e çiftit">
              <PhotoFrame src={w.photos[1]} alt={`${w.first} dhe ${w.second}`} className="reveal" />
            </section>
          )}

          <section className="block closing" aria-label="Mesazhi përmbyllës">
            <Corner side="left" />
            <Corner side="right" />
            <p className="closing-text reveal">
              <Lines text={w.closingText} />
            </p>
            {w.signature && (
              <p className="signature reveal">
                <span className="signature-pre">{w.signature.lead}</span>
                <span className="signature-name">{w.signature.name}</span>
              </p>
            )}
            <Icon name="heart" className="reveal heart" />
            <p className="rsvp-note reveal">Ju lutem konfirmoni pjesëmarrjen tuaj</p>
          </section>
        </div>

        {!w.confirmed && (
          <p className="preview-note">Parapamje lokale — programi dhe tekstet janë shembull deri në konfirmim.</p>
        )}
      </main>
    </>
  );
}
