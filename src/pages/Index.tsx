import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/files/0c6c8db3-cd34-4ece-bb1c-ec68d82f1ad5.png";

// Люки closed/open
const WALL_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/c6fb3dc1-dc40-4aee-af2a-29c0ec9fc63d.jpg";
const WALL_OPEN   = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/a9b5009e-3728-4eb6-9bd4-bfc6b8e11283.jpg";
const TILE_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/76e9eecd-9807-46df-a330-0593875fe81c.jpg";
const TILE_OPEN   = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/dd4af6a7-57b0-4205-ac11-b7be62ac61ac.jpg";
const FIRE_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/62e1b0fd-c009-46fd-a56b-4a863cbdbcba.jpg";
const FIRE_OPEN   = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/37fe4ff1-02fa-4861-88d2-8f15709e872d.jpg";

interface ZoneData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  // точка зума на HERO_IMG (transform-origin %)
  originX: number;
  originY: number;
  // маркер на первом экране
  markerX: number;
  markerY: number;
  // фото люка крупным планом
  closedImg: string;
  openImg: string;
  // инфографика
  parts: { label: string; desc: string; side: "left" | "right"; topPct: number }[];
  advantages: { icon: string; text: string }[];
}

const zones: ZoneData[] = [
  {
    id: "bathroom",
    title: "Люк в ванной",
    subtitle: "Над унитазом · Серия TILE PRO",
    tag: "Серия TILE PRO",
    tagColor: "#6eb5c0",
    originX: 18,
    originY: 60,
    markerX: 22,
    markerY: 55,
    closedImg: TILE_CLOSED,
    openImg: TILE_OPEN,
    parts: [
      { label: "Алюминиевая рама", desc: "Анодированный сплав, не ржавеет", side: "right", topPct: 20 },
      { label: "Регулируемая глубина", desc: "±15 мм под любой формат плитки", side: "right", topPct: 38 },
      { label: "Push-to-open", desc: "Без ручки, открытие нажатием", side: "left", topPct: 55 },
      { label: "Совпадение швов ±0.5 мм", desc: "Выравнивающие лапки в раме", side: "left", topPct: 72 },
    ],
    advantages: [
      { icon: "Droplets", text: "Влагостойкость IP67" },
      { icon: "Grid2x2", text: "Совпадение швов ±0.5 мм" },
      { icon: "Wrench", text: "Регулировка без демонтажа" },
      { icon: "Layers", text: "Плитка до 1200×2400 мм" },
    ],
  },
  {
    id: "hallway",
    title: "Люк в прихожей",
    subtitle: "Центральная ниша · Серия FLUSH",
    tag: "Серия FLUSH",
    tagColor: "#c9a84c",
    originX: 52,
    originY: 42,
    markerX: 50,
    markerY: 42,
    closedImg: WALL_CLOSED,
    openImg: WALL_OPEN,
    parts: [
      { label: "Стальной каркас 3 мм", desc: "Сварная рама, не гнётся", side: "right", topPct: 20 },
      { label: "Скрытые петли", desc: "Ход 180°, без видимых элементов", side: "right", topPct: 38 },
      { label: "Магнитный замок", desc: "Открытие нажатием, без ручки", side: "left", topPct: 55 },
      { label: "Шпаклёвочная сетка", desc: "Идеальное нанесение отделки", side: "left", topPct: 72 },
    ],
    advantages: [
      { icon: "Eye", text: "Зазор 0 мм — невидим после отделки" },
      { icon: "Maximize2", text: "Нагрузка до 300 кг/м²" },
      { icon: "Paintbrush", text: "Под штукатурку, краску, обои" },
      { icon: "Ruler", text: "Размеры до 1200×2100 мм" },
    ],
  },
  {
    id: "kitchen",
    title: "Противопожарный люк",
    subtitle: "Над духовым шкафом · EI 60",
    tag: "EI 60 · Кухня",
    tagColor: "#e05a2b",
    originX: 85,
    originY: 38,
    markerX: 82,
    markerY: 36,
    closedImg: FIRE_CLOSED,
    openImg: FIRE_OPEN,
    parts: [
      { label: "Огнестойкое полотно EI 60", desc: "Держит огонь 60 минут", side: "right", topPct: 20 },
      { label: "Интумесцентный уплотнитель", desc: "Расширяется при нагреве", side: "right", topPct: 38 },
      { label: "Стальная коробка 2 мм", desc: "Не деформируется при пожаре", side: "left", topPct: 55 },
      { label: "Самозакрывающий доводчик", desc: "Срабатывает автоматически", side: "left", topPct: 72 },
    ],
    advantages: [
      { icon: "Flame", text: "Сертификат EI 60 по ГОСТ 30247" },
      { icon: "ShieldCheck", text: "Обязателен у газа и плиты" },
      { icon: "Wind", text: "Дымонепроницаемость Sa" },
      { icon: "Award", text: "Пожарный сертификат РФ" },
    ],
  },
];

// ─── helpers ────────────────────────────────────────────────
function remap(p: number, from: number, to: number) {
  return Math.max(0, Math.min(1, (p - from) / (to - from)));
}
function ease(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Фазы для одной зоны (p = 0..1):
// 0.00–0.20  зум к точке
// 0.20–0.38  люк появляется в центре (scale 0→1)
// 0.38–0.55  дверца открывается (rotateY 0→−85deg)
// 0.55–0.78  инфографика
// 0.78–0.90  всё уходит, zoom out
function getPhase(p: number) {
  const bgScale   = 1 + ease(remap(p, 0, 0.22)) * 1.6 * (1 - remap(p, 0.80, 0.94));
  const hatchIn   = ease(remap(p, 0.20, 0.36));      // люк появляется
  const doorAngle = ease(remap(p, 0.36, 0.56)) * 88; // дверца открывается °
  const infoShow  = ease(remap(p, 0.52, 0.66)) * (1 - ease(remap(p, 0.76, 0.87)));
  const titleShow = remap(p, 0.06, 0.20) * (1 - remap(p, 0.82, 0.92));
  return { bgScale, hatchIn, doorAngle, infoShow, titleShow };
}

// ─── Component ──────────────────────────────────────────────
export default function Index() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY]   = useState(0);
  const [globalP, setGlobalP]   = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const el = wrapRef.current;
      if (!el) return;
      const rect  = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p     = Math.max(0, Math.min(1, -rect.top / total));
      setGlobalP(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ZONES    = zones.length;
  const zoneSize = 1 / ZONES;
  const zoneIdx  = Math.min(ZONES - 1, Math.floor(globalP / zoneSize));
  const zoneP    = (globalP - zoneIdx * zoneSize) / zoneSize;

  const zone = zones[zoneIdx];
  const { bgScale, hatchIn, doorAngle, infoShow, titleShow } = getPhase(zoneP);

  const tagBg: Record<string, string> = {
    "#6eb5c0": "rgba(110,181,192,0.12)",
    "#c9a84c": "rgba(201,168,76,0.12)",
    "#e05a2b": "rgba(224,90,43,0.12)",
  };

  const navScrolled = scrollY > 60;

  // размер люка в центре экрана (px-based через vmin)
  const HATCH_W = 320; // px
  const HATCH_H = 420; // px

  return (
    <div style={{ background: "var(--dark-900)", color: "#f0ece6" }}>

      {/* ── NAV ──────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500"
        style={{
          background: navScrolled ? "rgba(26,22,20,0.92)" : "transparent",
          backdropFilter: navScrolled ? "blur(16px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(201,168,76,0.15)" : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "var(--accent-gold)" }}>
            <Icon name="Square" size={16} color="var(--dark-900)" />
          </div>
          <span className="font-semibold tracking-widest text-sm uppercase" style={{ color: "#f0ece6" }}>
            Люки&nbsp;<span style={{ color: "var(--accent-gold)" }}>Invisible</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {["Продукты", "Применение", "Проекты", "Контакты"].map((item) => (
            <a key={item} href="#" className="text-sm tracking-wide transition-colors duration-200"
              style={{ color: "rgba(240,236,230,0.65)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0ece6")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,236,230,0.65)")}
            >{item}</a>
          ))}
          <a href="#"
            className="text-sm px-5 py-2 rounded-sm font-medium tracking-wide transition-all duration-200"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-gold)")}
          >Получить КП</a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} color="#f0ece6" />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8 md:hidden"
          style={{ background: "rgba(26,22,20,0.97)" }}>
          {["Продукты", "Применение", "Проекты", "Контакты"].map(item => (
            <a key={item} href="#" className="text-2xl tracking-wider" style={{ color: "#f0ece6" }}
              onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <img src={HERO_IMG} alt="Интерьер" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(26,22,20,.72) 0%,rgba(26,22,20,.15) 55%,rgba(26,22,20,.55) 100%)" }} />

        {/* маркеры люков */}
        {zones.map(z => (
          <div key={z.id} className="absolute" style={{ left: `${z.markerX}%`, top: `${z.markerY}%`, transform: "translate(-50%,-50%)" }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute rounded-full animate-ping" style={{ width: 28, height: 28, background: `${z.tagColor}28` }} />
              <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: z.tagColor, background: `${z.tagColor}22` }} />
            </div>
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col justify-end pb-28 px-8 md:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12" style={{ background: "var(--accent-gold)" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent-gold)" }}>Скрытые решения для интерьера</span>
            </div>
            <h1 className="font-light leading-none mb-6" style={{ fontSize: "clamp(3.2rem,8vw,6.5rem)", letterSpacing: "-0.02em" }}>
              Люки,<br />
              <em style={{ color: "var(--accent-gold)" }}>которых</em><br />
              не видно
            </h1>
            <p className="font-light mb-8 max-w-md" style={{ color: "rgba(240,236,230,0.5)", lineHeight: 1.8, fontSize: "1.05rem" }}>
              На фото — три люка. Пролистайте вниз, чтобы увидеть как они устроены изнутри.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              {zones.map(z => (
                <div key={z.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: z.tagColor }} />
                  <span className="text-xs tracking-wide" style={{ color: "rgba(240,236,230,0.45)" }}>{z.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <Icon name="ChevronsDown" size={20} color="var(--accent-gold)" />
        </div>
      </section>

      {/* ── SCROLL SECTION ───────────────────────────── */}
      <div ref={wrapRef} className="relative" style={{ height: `${ZONES * 500}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* 1. ФОН — зумируется к точке люка */}
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${bgScale})`,
              transformOrigin: `${zone.originX}% ${zone.originY}%`,
              willChange: "transform",
            }}
          >
            <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "rgba(18,15,14,0.55)" }} />
          </div>

          {/* 2. ЛЮКОВЫЙ БЛОК — появляется по центру экрана */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ opacity: hatchIn, pointerEvents: "none" }}
          >
            {/* Контейнер люка — perspective для 3d-открытия */}
            <div
              style={{
                width: HATCH_W,
                height: HATCH_H,
                position: "relative",
                perspective: 1000,
                transform: `scale(${0.6 + hatchIn * 0.4})`,
              }}
            >
              {/* Рама люка (всегда видна) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: `3px solid ${zone.tagColor}`,
                  boxShadow: `0 0 0 1px rgba(0,0,0,0.8), 0 0 40px ${zone.tagColor}30, inset 0 0 20px rgba(0,0,0,0.6)`,
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />

              {/* ЗАКРЫТЫЙ люк — фото (уходит при повороте) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "left center",
                  transform: `perspective(1000px) rotateY(${-doorAngle}deg)`,
                  backfaceVisibility: "hidden",
                  zIndex: 3,
                  overflow: "hidden",
                }}
              >
                <img
                  src={zone.closedImg}
                  alt="люк закрыт"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Блик и тень при вращении */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to right, transparent 60%, rgba(0,0,0,${0.6 * (doorAngle / 88)}) 100%)`,
                  }}
                />
                {/* Линия петли (слева) */}
                <div style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: 6,
                  background: `linear-gradient(to bottom, ${zone.tagColor}80 0%, ${zone.tagColor} 50%, ${zone.tagColor}80 100%)`,
                }} />
              </div>

              {/* ОТКРЫТЫЙ вид — что за люком (видно когда дверца открылась) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  zIndex: 1,
                }}
              >
                <img
                  src={zone.openImg}
                  alt="люк открыт"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* затемнение внутри */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(12,10,9,0.55)" }} />
                {/* свечение из люка */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse at 30% 50%, ${zone.tagColor}25 0%, transparent 70%)`,
                  opacity: doorAngle > 10 ? 1 : 0,
                  transition: "opacity 0.3s",
                }} />
              </div>

              {/* Тень от открытой дверцы */}
              {doorAngle > 5 && (
                <div style={{
                  position: "absolute",
                  top: 0, bottom: 0,
                  left: 0,
                  width: `${Math.min(80, doorAngle * 0.9)}%`,
                  background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 100%)",
                  zIndex: 4,
                  pointerEvents: "none",
                }} />
              )}
            </div>
          </div>

          {/* 3. НАЗВАНИЕ — появляется при зуме */}
          <div
            className="absolute top-24 left-0 right-0 flex flex-col items-center text-center z-20 px-8"
            style={{
              opacity: titleShow,
              transform: `translateY(${(1 - titleShow) * 14}px)`,
            }}
          >
            <span
              className="inline-block text-xs tracking-[0.35em] uppercase px-4 py-1.5 rounded-full mb-4 font-medium"
              style={{
                background: tagBg[zone.tagColor] ?? "rgba(255,255,255,0.08)",
                color: zone.tagColor,
                border: `1px solid ${zone.tagColor}50`,
                backdropFilter: "blur(8px)",
              }}
            >{zone.tag}</span>
            <h2 className="font-light" style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", letterSpacing: "-0.02em" }}>
              {zone.title}
            </h2>
            <p className="mt-1.5 font-light text-sm" style={{ color: "rgba(240,236,230,0.45)" }}>{zone.subtitle}</p>
          </div>

          {/* 4. ИНФОГРАФИКА — аннотации слева и справа от люка */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ opacity: infoShow }}
          >
            {zone.parts.map((part, i) => {
              const isRight = part.side === "right";
              return (
                <div
                  key={i}
                  className="absolute flex items-center"
                  style={{
                    top: `${part.topPct}%`,
                    left: isRight ? "55%" : "auto",
                    right: isRight ? "auto" : "55%",
                    transform: `translateX(${infoShow < 1 ? (isRight ? 10 : -10) * (1 - infoShow) : 0}px)`,
                    flexDirection: isRight ? "row" : "row-reverse",
                  }}
                >
                  {/* линия к люку */}
                  <div style={{ width: 40, height: 1, background: `${zone.tagColor}60`, flexShrink: 0 }} />
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: zone.tagColor }} />
                  <div
                    className="rounded-sm px-3 py-2 ml-2 mr-2"
                    style={{
                      background: "rgba(16,13,12,0.90)",
                      border: `1px solid ${zone.tagColor}28`,
                      backdropFilter: "blur(12px)",
                      minWidth: 150,
                      maxWidth: 210,
                    }}
                  >
                    <div className="text-xs font-semibold leading-tight mb-0.5" style={{ color: zone.tagColor }}>{part.label}</div>
                    <div className="font-light leading-snug" style={{ color: "rgba(240,236,230,0.55)", fontSize: "0.68rem" }}>{part.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5. ПРЕИМУЩЕСТВА — снизу */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8"
            style={{
              opacity: infoShow,
              transform: `translateY(${(1 - infoShow) * 20}px)`,
            }}
          >
            <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
              {zone.advantages.map(({ icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-sm px-3 py-2.5"
                  style={{
                    background: "rgba(16,13,12,0.88)",
                    border: `1px solid ${zone.tagColor}20`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-sm" style={{ background: `${zone.tagColor}18` }}>
                    <Icon name={icon} size={15} color={zone.tagColor} />
                  </div>
                  <span className="text-xs font-light leading-snug" style={{ color: "rgba(240,236,230,0.72)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Прогресс-индикатор */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
            {zones.map((z, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === zoneIdx ? 6 : 4,
                  height: i === zoneIdx ? 22 : 4,
                  background: i === zoneIdx ? z.tagColor : "rgba(240,236,230,0.18)",
                }}
              />
            ))}
          </div>

          {/* Счётчик зоны */}
          <div
            className="absolute bottom-10 right-8 z-30 text-right"
            style={{ opacity: Math.min(1, globalP * 6) }}
          >
            <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: zone.tagColor }}>
              {zoneIdx + 1} / {ZONES}
            </div>
            <div className="text-xs font-light" style={{ color: "rgba(240,236,230,0.35)" }}>
              {zone.title}
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────── */}
      <section
        className="relative py-36 px-8 md:px-20 flex flex-col items-center text-center overflow-hidden"
        style={{ background: "var(--dark-800)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)" }} />

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
          <span className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--accent-gold)" }}>Готовы к проекту?</span>
          <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
        </div>
        <h2 className="font-light mb-6 max-w-2xl" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", letterSpacing: "-0.02em" }}>
          Подберём люк<br />
          <em style={{ color: "var(--accent-gold)" }}>под ваш интерьер</em>
        </h2>
        <p className="max-w-md font-light mb-12" style={{ color: "rgba(240,236,230,0.45)", lineHeight: 1.8 }}>
          Отправьте план помещения или фото — рассчитаем стоимость и пришлём образцы
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#"
            className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-200"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-gold)")}
          >Обсудить проект <Icon name="ArrowRight" size={18} /></a>
          <a href="#"
            className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-200"
            style={{ border: "1px solid rgba(240,236,230,0.2)", color: "#f0ece6" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent-gold)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(240,236,230,0.2)")}
          >Скачать каталог</a>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl"
          style={{ borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: "3rem" }}>
          {[{ v: "1200+", l: "объектов" }, { v: "14 лет", l: "на рынке" }, { v: "3 серии", l: "люков" }, { v: "30 дн", l: "производство" }].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="font-light mb-1" style={{ fontSize: "2.2rem", color: "var(--accent-gold)", letterSpacing: "-0.02em" }}>{v}</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.25)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto"
        style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: "var(--accent-gold)" }}>
            <Icon name="Square" size={12} color="var(--dark-900)" />
          </div>
          <span className="text-sm tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.3)" }}>Люки Invisible</span>
        </div>
        <div className="text-xs" style={{ color: "rgba(240,236,230,0.18)" }}>© 2025 · Производство скрытых люков</div>
        <div className="flex gap-6">
          {["TG", "WA", "IN"].map(s => (
            <a key={s} href="#" className="text-xs tracking-widest transition-colors duration-200"
              style={{ color: "rgba(240,236,230,0.28)", letterSpacing: "0.15em" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,236,230,0.28)")}
            >{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
