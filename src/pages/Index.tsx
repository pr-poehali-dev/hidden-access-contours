import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG   = "https://cdn.poehali.dev/files/0c6c8db3-cd34-4ece-bb1c-ec68d82f1ad5.png";

const TILE_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/76e9eecd-9807-46df-a330-0593875fe81c.jpg";
const TILE_OPEN   = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/dd4af6a7-57b0-4205-ac11-b7be62ac61ac.jpg";
const WALL_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/c6fb3dc1-dc40-4aee-af2a-29c0ec9fc63d.jpg";
const WALL_OPEN   = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/a9b5009e-3728-4eb6-9bd4-bfc6b8e11283.jpg";
const FIRE_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/62e1b0fd-c009-46fd-a56b-4a863cbdbcba.jpg";
const FIRE_OPEN   = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/37fe4ff1-02fa-4861-88d2-8f15709e872d.jpg";

// hatchX/Y — координаты центра люка на HERO_IMG (%)
// Люк 1 (ванная): верхний левый угол, второй прямоугольник от потолка
// Люк 2 (прихожая): центральный выделенный прямоугольник
// Люк 3 (кухня): над духовым шкафом справа
interface HatchZone {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  hatchX: number;
  hatchY: number;
  closedImg: string;
  openImg: string;
  parts: { label: string; desc: string; side: "left" | "right"; topPct: number }[];
  advantages: { icon: string; text: string }[];
}

const HATCHES: HatchZone[] = [
  {
    id: "bathroom",
    title: "Люк в ванной",
    subtitle: "Под плитку · Серия TILE PRO",
    tag: "TILE PRO",
    color: "#6eb5c0",
    hatchX: 14,
    hatchY: 22,
    closedImg: TILE_CLOSED,
    openImg: TILE_OPEN,
    parts: [
      { label: "Алюминиевая рама", desc: "Анодированный сплав, не ржавеет", side: "right", topPct: 18 },
      { label: "Регулируемая глубина", desc: "±15 мм под любой формат плитки", side: "right", topPct: 36 },
      { label: "Push-to-open", desc: "Без ручки, открытие нажатием", side: "left", topPct: 54 },
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
    subtitle: "Под штукатурку · Серия FLUSH",
    tag: "FLUSH",
    color: "#c9a84c",
    hatchX: 50,
    hatchY: 40,
    closedImg: WALL_CLOSED,
    openImg: WALL_OPEN,
    parts: [
      { label: "Стальной каркас 3 мм", desc: "Сварная рама, не гнётся", side: "right", topPct: 18 },
      { label: "Скрытые петли", desc: "Ход 180°, без видимых элементов", side: "right", topPct: 36 },
      { label: "Магнитный замок", desc: "Открытие нажатием, без ручки", side: "left", topPct: 54 },
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
    subtitle: "EI 60 · Кухня",
    tag: "EI 60",
    color: "#e05a2b",
    hatchX: 82,
    hatchY: 35,
    closedImg: FIRE_CLOSED,
    openImg: FIRE_OPEN,
    parts: [
      { label: "Огнестойкое полотно EI 60", desc: "Держит огонь 60 минут", side: "right", topPct: 18 },
      { label: "Интумесцентный уплотнитель", desc: "Расширяется при нагреве", side: "right", topPct: 36 },
      { label: "Стальная коробка 2 мм", desc: "Не деформируется при пожаре", side: "left", topPct: 54 },
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

// ─── helpers ─────────────────────────────────────────────────────────────────
function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }
function remap(p: number, a: number, b: number) { return clamp((p - a) / (b - a)); }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOut(t: number) { return 1 - (1 - t) * (1 - t); }

export default function Index() {
  const wrapRef  = useRef<HTMLDivElement>(null);
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
      setGlobalP(clamp(-rect.top / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const N       = HATCHES.length;
  const zoneIdx = Math.min(N - 1, Math.floor(globalP * N));
  const zoneP   = clamp((globalP * N) - zoneIdx);

  const hatch = HATCHES[zoneIdx];

  // ── Фазы внутри зоны (zoneP 0..1) ──────────────────────────────────────
  // 0.00–0.20  текст «втягивается» в точку люка и исчезает
  // 0.10–0.32  фон зумируется к точке люка
  // 0.28–0.46  люк-блок появляется в центре экрана
  // 0.44–0.60  дверца открывается
  // 0.55–0.75  инфографика
  // 0.72–0.84  инфографика + люк уходят
  // 0.82–0.96  zoom out фона

  const textSuck    = easeInOut(remap(zoneP, 0.00, 0.20));
  const bgZoom      = easeOut(remap(zoneP, 0.10, 0.32)) * (1 - easeOut(remap(zoneP, 0.82, 0.96)));
  const hatchAppear = easeOut(remap(zoneP, 0.28, 0.46)) * (1 - easeOut(remap(zoneP, 0.74, 0.86)));
  const doorAngle   = easeInOut(remap(zoneP, 0.44, 0.62)) * 88 * (1 - easeInOut(remap(zoneP, 0.72, 0.82)));
  const infoShow    = easeOut(remap(zoneP, 0.56, 0.68)) * (1 - easeInOut(remap(zoneP, 0.70, 0.80)));
  const tagShow     = easeOut(remap(zoneP, 0.30, 0.44)) * (1 - easeInOut(remap(zoneP, 0.78, 0.87)));

  const bgScale   = 1 + bgZoom * 2.4;
  const textScale = 1 - textSuck * 0.6;
  const textOpacity = 1 - textSuck;
  // текст смещается к точке люка
  const textTX = (hatch.hatchX - 50) * 0.55 * textSuck;
  const textTY = (hatch.hatchY - 50) * 0.55 * textSuck;

  const navScrolled = scrollY > 40;

  const tagBg: Record<string, string> = {
    "#6eb5c0": "rgba(110,181,192,0.13)",
    "#c9a84c": "rgba(201,168,76,0.13)",
    "#e05a2b": "rgba(224,90,43,0.13)",
  };

  return (
    <div style={{ background: "var(--dark-900)", color: "#f0ece6" }}>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500"
        style={{
          background: navScrolled ? "rgba(22,18,16,0.93)" : "transparent",
          backdropFilter: navScrolled ? "blur(18px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(201,168,76,0.13)" : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "var(--accent-gold)" }}>
            <Icon name="Square" size={15} color="var(--dark-900)" />
          </div>
          <span className="font-semibold tracking-widest text-sm uppercase" style={{ color: "#f0ece6" }}>
            Люки <span style={{ color: "var(--accent-gold)" }}>Invisible</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {["Продукты","Применение","Проекты","Контакты"].map(item => (
            <a key={item} href="#" className="text-sm tracking-wide transition-colors duration-200"
              style={{ color: "rgba(240,236,230,0.6)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0ece6")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,236,230,0.6)")}
            >{item}</a>
          ))}
          <a href="#" className="text-sm px-5 py-2 rounded-sm font-medium tracking-wide transition-all duration-200"
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
          style={{ background: "rgba(22,18,16,0.97)" }}>
          {["Продукты","Применение","Проекты","Контакты"].map(item => (
            <a key={item} href="#" className="text-2xl tracking-wider" style={{ color: "#f0ece6" }}
              onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          STICKY SCROLL — весь экшен на одном экране
      ══════════════════════════════════════════════════ */}
      <div ref={wrapRef} className="relative" style={{ height: `${N * 500}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* 1. ФОН зумируется к точке люка */}
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${bgScale})`,
              transformOrigin: `${hatch.hatchX}% ${hatch.hatchY}%`,
              willChange: "transform",
            }}
          >
            <img src={HERO_IMG} alt="Интерьер" className="w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0" style={{
              background: `rgba(12,10,9,${0.22 + hatchAppear * 0.42})`,
            }} />
          </div>

          {/* Мигающий маркер люка — виден в начале, до зума */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: `${hatch.hatchX}%`,
              top: `${hatch.hatchY}%`,
              transform: "translate(-50%,-50%)",
              opacity: clamp(1 - bgZoom * 4),
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute rounded-sm animate-ping"
                style={{ width: 40, height: 56, border: `1.5px solid ${hatch.color}70`, background: `${hatch.color}18` }} />
              <div className="rounded-sm border-2"
                style={{ width: 24, height: 34, borderColor: hatch.color, background: `${hatch.color}18` }} />
            </div>
          </div>

          {/* 2. ТЕКСТ HERO — уходит в точку люка при скролле */}
          <div
            className="absolute inset-0 flex flex-col justify-end pb-28 px-8 md:px-20 z-10"
            style={{
              opacity: textOpacity,
              transform: `translate(${textTX}vw, ${textTY}vh) scale(${textScale})`,
              transformOrigin: `${hatch.hatchX}% ${hatch.hatchY}%`,
              pointerEvents: textOpacity < 0.05 ? "none" : "auto",
            }}
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: "var(--accent-gold)" }} />
                <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent-gold)" }}>
                  Скрытые решения для интерьера
                </span>
              </div>
              <h1 className="font-light leading-none mb-6"
                style={{ fontSize: "clamp(3rem,7.5vw,6rem)", letterSpacing: "-0.02em" }}>
                Люки,<br />
                <em style={{ color: "var(--accent-gold)" }}>которых</em><br />
                не видно
              </h1>
              <p className="font-light mb-8 max-w-md"
                style={{ color: "rgba(240,236,230,0.5)", lineHeight: 1.8, fontSize: "1.05rem" }}>
                Три люка спрятаны на этом фото.<br />
                Пролистайте вниз — посмотрите как они устроены.
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                {HATCHES.map(h => (
                  <div key={h.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-sm" style={{ background: h.color }} />
                    <span className="text-xs tracking-wide" style={{ color: "rgba(240,236,230,0.4)" }}>{h.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50">
              <Icon name="ChevronsDown" size={22} color="var(--accent-gold)" />
            </div>
          </div>

          {/* 3. ЛЮКОВЫЙ БЛОК — появляется в центре после зума */}
          <div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            style={{
              opacity: clamp(hatchAppear * 2.5),
              transform: `scale(${0.25 + hatchAppear * 0.75})`,
            }}
          >
            <div style={{ width: 300, height: 400, position: "relative", perspective: 1100 }}>

              {/* Рама люка */}
              <div className="absolute inset-0" style={{
                border: `3px solid ${hatch.color}`,
                boxShadow: `0 0 0 1px rgba(0,0,0,0.95), 0 0 70px ${hatch.color}30`,
                zIndex: 4,
              }} />

              {/* Вид за люком (openImg) */}
              <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
                <img src={hatch.openImg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "rgba(10,8,7,0.52)" }} />
                <div className="absolute inset-0" style={{
                  background: `radial-gradient(ellipse at 35% 50%, ${hatch.color}28 0%, transparent 65%)`,
                  opacity: doorAngle > 10 ? 1 : 0,
                  transition: "opacity 0.4s",
                }} />
              </div>

              {/* Дверца — откидывается влево */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  transformOrigin: "left center",
                  transform: `perspective(1100px) rotateY(${-doorAngle}deg)`,
                  backfaceVisibility: "hidden",
                  zIndex: 3,
                }}
              >
                <img src={hatch.closedImg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(to right, transparent 50%, rgba(0,0,0,${0.7 * (doorAngle / 88)}) 100%)`,
                }} />
                {/* Петля */}
                <div className="absolute left-0 top-0 bottom-0" style={{
                  width: 5,
                  background: `linear-gradient(to bottom, ${hatch.color}80, ${hatch.color}, ${hatch.color}80)`,
                }} />
              </div>

              {/* Тень от открытой дверцы */}
              {doorAngle > 3 && (
                <div className="absolute top-0 bottom-0 left-0 pointer-events-none" style={{
                  zIndex: 5,
                  width: `${Math.min(72, doorAngle * 0.82)}%`,
                  background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 100%)",
                }} />
              )}
            </div>
          </div>

          {/* 4. ТЕГ + НАЗВАНИЕ */}
          <div
            className="absolute top-[11%] left-0 right-0 flex flex-col items-center text-center z-20 px-8 pointer-events-none"
            style={{
              opacity: tagShow,
              transform: `translateY(${(1 - tagShow) * 14}px)`,
            }}
          >
            <span className="inline-block text-xs tracking-[0.35em] uppercase px-4 py-1.5 rounded-full mb-3 font-medium"
              style={{
                background: tagBg[hatch.color] ?? "rgba(255,255,255,0.08)",
                color: hatch.color,
                border: `1px solid ${hatch.color}45`,
                backdropFilter: "blur(8px)",
              }}
            >{hatch.tag}</span>
            <h2 className="font-light" style={{ fontSize: "clamp(1.8rem,3.8vw,3rem)", letterSpacing: "-0.02em" }}>
              {hatch.title}
            </h2>
            <p className="mt-1 text-sm font-light" style={{ color: "rgba(240,236,230,0.42)" }}>
              {hatch.subtitle}
            </p>
          </div>

          {/* 5. ИНФОГРАФИКА — аннотации слева/справа от люка */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ opacity: infoShow }}
          >
            {hatch.parts.map((part, i) => {
              const isRight = part.side === "right";
              return (
                <div
                  key={i}
                  className="absolute flex items-center"
                  style={{
                    top: `${part.topPct}%`,
                    ...(isRight
                      ? { left: "calc(50% + 160px)" }
                      : { right: "calc(50% + 160px)" }
                    ),
                    flexDirection: isRight ? "row" : "row-reverse",
                    transform: `translateX(${infoShow < 1 ? (isRight ? 16 : -16) * (1 - infoShow) : 0}px)`,
                  }}
                >
                  <div style={{ width: 30, height: 1, background: `${hatch.color}55`, flexShrink: 0 }} />
                  <div className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: hatch.color }} />
                  <div
                    className={`rounded-sm px-3 py-2 ${isRight ? "ml-2" : "mr-2"}`}
                    style={{
                      background: "rgba(12,10,9,0.93)",
                      border: `1px solid ${hatch.color}22`,
                      backdropFilter: "blur(14px)",
                      minWidth: 148,
                      maxWidth: 205,
                    }}
                  >
                    <div className="text-xs font-semibold leading-tight mb-0.5" style={{ color: hatch.color }}>
                      {part.label}
                    </div>
                    <div className="font-light leading-snug" style={{ color: "rgba(240,236,230,0.50)", fontSize: "0.67rem" }}>
                      {part.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 6. ПРЕИМУЩЕСТВА снизу */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-7 pointer-events-none"
            style={{
              opacity: infoShow,
              transform: `translateY(${(1 - infoShow) * 22}px)`,
            }}
          >
            <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
              {hatch.advantages.map(({ icon, text }, i) => (
                <div key={i} className="flex items-start gap-2 rounded-sm px-3 py-2.5"
                  style={{
                    background: "rgba(12,10,9,0.91)",
                    border: `1px solid ${hatch.color}18`,
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-sm"
                    style={{ background: `${hatch.color}18` }}>
                    <Icon name={icon} size={15} color={hatch.color} />
                  </div>
                  <span className="text-xs font-light leading-snug" style={{ color: "rgba(240,236,230,0.70)" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Прогресс */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5">
            {HATCHES.map((h, i) => (
              <div key={i} className="rounded-full transition-all duration-500" style={{
                width: i === zoneIdx ? 5 : 3,
                height: i === zoneIdx ? 20 : 3,
                background: i === zoneIdx ? h.color : "rgba(240,236,230,0.16)",
              }} />
            ))}
          </div>

          {/* Счётчик */}
          <div className="absolute bottom-8 right-7 z-30 text-right" style={{ opacity: clamp(globalP * 8) }}>
            <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: hatch.color }}>
              {zoneIdx + 1} / {N}
            </div>
            <div className="text-xs font-light" style={{ color: "rgba(240,236,230,0.30)" }}>
              {hatch.title}
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA ── */}
      <section className="relative py-36 px-8 md:px-20 flex flex-col items-center text-center overflow-hidden"
        style={{ background: "var(--dark-800)" }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.35),transparent)" }} />

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
          <span className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--accent-gold)" }}>Готовы к проекту?</span>
          <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
        </div>
        <h2 className="font-light mb-6 max-w-2xl"
          style={{ fontSize: "clamp(2.2rem,5vw,4rem)", letterSpacing: "-0.02em" }}>
          Подберём люк<br />
          <em style={{ color: "var(--accent-gold)" }}>под ваш интерьер</em>
        </h2>
        <p className="max-w-md font-light mb-12" style={{ color: "rgba(240,236,230,0.44)", lineHeight: 1.8 }}>
          Отправьте план помещения или фото — рассчитаем стоимость и пришлём образцы
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#" className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-200"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-gold)")}
          >Обсудить проект <Icon name="ArrowRight" size={18} /></a>
          <a href="#" className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-200"
            style={{ border: "1px solid rgba(240,236,230,0.18)", color: "#f0ece6" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent-gold)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(240,236,230,0.18)")}
          >Скачать каталог</a>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl"
          style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: "3rem" }}>
          {[{v:"1200+",l:"объектов"},{v:"14 лет",l:"на рынке"},{v:"3 серии",l:"люков"},{v:"30 дн",l:"производство"}].map(({v,l}) => (
            <div key={l} className="text-center">
              <div className="font-light mb-1" style={{ fontSize: "2.2rem", color: "var(--accent-gold)", letterSpacing: "-0.02em" }}>{v}</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.22)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto"
        style={{ borderTop: "1px solid rgba(201,168,76,0.09)" }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: "var(--accent-gold)" }}>
            <Icon name="Square" size={12} color="var(--dark-900)" />
          </div>
          <span className="text-sm tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.28)" }}>Люки Invisible</span>
        </div>
        <div className="text-xs" style={{ color: "rgba(240,236,230,0.16)" }}>© 2025 · Производство скрытых люков</div>
        <div className="flex gap-6">
          {["TG","WA","IN"].map(s => (
            <a key={s} href="#" className="text-xs tracking-widest transition-colors duration-200"
              style={{ color: "rgba(240,236,230,0.26)", letterSpacing: "0.15em" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,236,230,0.26)")}
            >{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
