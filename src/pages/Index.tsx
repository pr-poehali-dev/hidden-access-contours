import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/files/0c6c8db3-cd34-4ece-bb1c-ec68d82f1ad5.png";

// Три люка — три зоны на ОДНОМ фото
// Координаты origin-point (transform-origin) в % от размера фото
// Ванная: над унитазом — левая часть фото, примерно 18% x, 58% y
// Прихожая: центральный прямоугольник — 52% x, 42% y
// Кухня: над духовым шкафом — правая часть, 85% x, 38% y
interface ZoneData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  // точка зума на фото (transform-origin)
  originX: number; // %
  originY: number; // %
  // позиция инфографики на экране
  infoSide: "left" | "right";
  parts: { label: string; desc: string; top: number; left: number }[];
  advantages: { icon: string; text: string }[];
  // SVG-маркер позиция (% от экрана) — точка где находится люк
  markerX: number;
  markerY: number;
}

const zones: ZoneData[] = [
  {
    id: "bathroom",
    title: "Люк в ванной",
    subtitle: "Над унитазом — под плитку",
    tag: "Серия TILE PRO",
    tagColor: "#6eb5c0",
    originX: 18,
    originY: 60,
    infoSide: "right",
    markerX: 28,
    markerY: 52,
    parts: [
      { label: "Алюминиевая рама", desc: "Анодированный сплав, не ржавеет", top: 22, left: 58 },
      { label: "Регулируемая глубина", desc: "±15 мм под любой формат плитки", top: 38, left: 62 },
      { label: "Push-to-open", desc: "Без ручки, открытие нажатием", top: 55, left: 58 },
      { label: "Выравнивающие лапки", desc: "Точное совпадение швов ±0.5 мм", top: 70, left: 62 },
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
    subtitle: "Центральная ниша — под штукатурку",
    tag: "Серия FLUSH",
    tagColor: "#c9a84c",
    originX: 52,
    originY: 42,
    infoSide: "left",
    markerX: 50,
    markerY: 42,
    parts: [
      { label: "Стальной каркас", desc: "3 мм сталь, сварная рама", top: 20, left: 18 },
      { label: "Скрытые петли", desc: "Ход 180°, без видимых элементов", top: 36, left: 14 },
      { label: "Магнитный замок", desc: "Открытие нажатием, без ручки", top: 54, left: 18 },
      { label: "Шпаклёвочная сетка", desc: "Для идеального нанесения отделки", top: 70, left: 14 },
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
    subtitle: "Над духовым шкафом — EI 60",
    tag: "EI 60 · Кухня",
    tagColor: "#e05a2b",
    originX: 85,
    originY: 38,
    infoSide: "left",
    markerX: 80,
    markerY: 35,
    parts: [
      { label: "Огнестойкое полотно", desc: "EI 60 — держит огонь 60 минут", top: 20, left: 16 },
      { label: "Интумесцентный уплотнитель", desc: "Расширяется при нагреве, блокирует дым", top: 36, left: 12 },
      { label: "Стальная коробка 2 мм", desc: "Не деформируется при пожаре", top: 54, left: 16 },
      { label: "Самозакрывающий доводчик", desc: "Автоматически закрывается при пожаре", top: 70, left: 12 },
    ],
    advantages: [
      { icon: "Flame", text: "Сертификат EI 60 по ГОСТ 30247" },
      { icon: "ShieldCheck", text: "Обязателен у газа и плиты" },
      { icon: "Wind", text: "Дымонепроницаемость Sa" },
      { icon: "Award", text: "Пожарный сертификат РФ" },
    ],
  },
];

// Phases (p = 0..1 для каждой зоны):
// 0.00–0.18 → зум к точке (scale 1 → 2.8)
// 0.18–0.40 → люк «открывается» (overlay расходится)
// 0.40–0.72 → инфографика видна, зум держится
// 0.72–0.90 → инфографика уходит, зум сбрасывается
// 0.90–1.00 → переход к следующей зоне
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}
function remap(p: number, from: number, to: number) {
  return Math.max(0, Math.min(1, (p - from) / (to - from)));
}

function getZonePhase(p: number) {
  const scale = lerp(1, 2.8, remap(p, 0, 0.22)) * (1 - 0.8 * remap(p, 0.78, 0.94));
  const opening = remap(p, 0.18, 0.42) * (1 - remap(p, 0.72, 0.88));
  const info = remap(p, 0.36, 0.52) * (1 - remap(p, 0.70, 0.84));
  const titleVisible = remap(p, 0.04, 0.18) * (1 - remap(p, 0.80, 0.92));
  return { scale, opening, info, titleVisible };
}

// Один общий sticky-контейнер для всех зон
export default function Index() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [globalP, setGlobalP] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setGlobalP(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Делим globalP на 3 зоны: 0–0.33, 0.33–0.66, 0.66–1.0
  const ZONES = zones.length;
  const zoneSize = 1 / ZONES;
  const activeZoneIndex = Math.min(ZONES - 1, Math.floor(globalP / zoneSize));
  const zoneP = (globalP - activeZoneIndex * zoneSize) / zoneSize;

  const zone = zones[activeZoneIndex];
  const { scale, opening, info, titleVisible } = getZonePhase(zoneP);

  // transform-origin на основе точки люка
  const originX = zone.originX;
  const originY = zone.originY;

  // overlay «открытие» — имитируем разворот двери: левая половина уходит влево
  const doorAngle = opening * 85; // deg

  const tagBg: Record<string, string> = {
    "#6eb5c0": "rgba(110,181,192,0.12)",
    "#c9a84c": "rgba(201,168,76,0.12)",
    "#e05a2b": "rgba(224,90,43,0.12)",
  };

  const navScrolled = scrollY > 60;

  return (
    <div className="grain-overlay" style={{ background: "var(--dark-900)", color: "#f0ece6" }}>

      {/* NAV */}
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
            <a key={item} href="#" className="nav-link text-sm tracking-wide" style={{ color: "rgba(240,236,230,0.7)" }}>{item}</a>
          ))}
          <a
            href="#"
            className="text-sm px-5 py-2 rounded-sm font-medium tracking-wide transition-all duration-200"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-gold)")}
          >Получить КП</a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} color="#f0ece6" />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8 md:hidden"
          style={{ background: "rgba(26,22,20,0.97)" }}>
          {["Продукты", "Применение", "Проекты", "Контакты"].map((item) => (
            <a key={item} href="#" className="text-2xl tracking-wider" onClick={() => setMenuOpen(false)}
              style={{ color: "#f0ece6" }}>{item}</a>
          ))}
        </div>
      )}

      {/* ── HERO INTRO (первый экран, без зума) ── */}
      <section className="relative h-screen overflow-hidden">
        <img src={HERO_IMG} alt="Интерьер" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,22,20,0.70) 0%, rgba(26,22,20,0.15) 55%, rgba(26,22,20,0.50) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px gold-line" />

        {/* Маркеры люков на исходном фото */}
        {zones.map((z) => (
          <div
            key={z.id}
            className="absolute"
            style={{ left: `${z.markerX}%`, top: `${z.markerY}%`, transform: "translate(-50%,-50%)" }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute rounded-full animate-ping" style={{ width: 28, height: 28, background: `${z.tagColor}30` }} />
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: z.tagColor, background: `${z.tagColor}25` }} />
            </div>
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col justify-end pb-28 px-8 md:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="animate-fade-in flex items-center gap-3 mb-6">
              <div className="h-px w-12" style={{ background: "var(--accent-gold)" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent-gold)" }}>
                Скрытые решения для интерьера
              </span>
            </div>
            <h1 className="animate-fade-in-up delay-200 font-light leading-none mb-6"
              style={{ fontSize: "clamp(3.2rem,8vw,6.5rem)", letterSpacing: "-0.02em", color: "#f0ece6" }}>
              Люки,<br />
              <em style={{ color: "var(--accent-gold)" }}>которых</em><br />
              не видно
            </h1>
            <p className="animate-fade-in-up delay-400 font-light mb-8 max-w-md"
              style={{ color: "rgba(240,236,230,0.55)", lineHeight: 1.8, fontSize: "1.05rem" }}>
              На фото — три люка. Пролистайте вниз, чтобы увидеть как они устроены изнутри.
            </p>
            <div className="animate-fade-in-up delay-600 flex items-center gap-4">
              {zones.map((z) => (
                <div key={z.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: z.tagColor }} />
                  <span className="text-xs tracking-wide" style={{ color: "rgba(240,236,230,0.5)" }}>{z.title.split(" ")[2] || z.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-1000">
          <Icon name="ChevronsDown" size={20} color="rgba(201,168,76,0.6)" />
        </div>
      </section>

      {/* ── SCROLL ZONE — единое sticky фото с зумом ── */}
      {/* 500vh × 3 зоны = 1500vh прокрутки */}
      <div ref={wrapRef} className="relative" style={{ height: `${ZONES * 500}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* ФОТО — одно, зум + смещение origin */}
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${originX}% ${originY}%`,
              willChange: "transform",
            }}
          >
            <img
              src={HERO_IMG}
              alt="Интерьер"
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />
            {/* Базовый затемняющий оверлей */}
            <div className="absolute inset-0" style={{ background: "rgba(26,22,20,0.35)" }} />
          </div>

          {/* ЭФФЕКТ ОТКРЫТИЯ ЛЮКА — две «створки» расходятся */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: opening > 0 ? 1 : 0 }}
          >
            {/* Левая створка */}
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: "50%",
                background: "rgba(26,22,20,0.0)",
                transformOrigin: "left center",
                transform: `perspective(1200px) rotateY(${-doorAngle}deg)`,
                boxShadow: opening > 0.05 ? `inset -4px 0 30px rgba(0,0,0,0.5)` : "none",
                borderRight: opening > 0.05 ? `1px solid ${zone.tagColor}40` : "none",
                transition: "none",
              }}
            />
            {/* Правая створка */}
            <div
              className="absolute top-0 right-0 h-full"
              style={{
                width: "50%",
                background: "rgba(26,22,20,0.0)",
                transformOrigin: "right center",
                transform: `perspective(1200px) rotateY(${doorAngle}deg)`,
                boxShadow: opening > 0.05 ? `inset 4px 0 30px rgba(0,0,0,0.5)` : "none",
                borderLeft: opening > 0.05 ? `1px solid ${zone.tagColor}40` : "none",
                transition: "none",
              }}
            />
            {/* Свечение изнутри */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: opening * 0.6 }}
            >
              <div style={{
                width: "40vw",
                height: "40vw",
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${zone.tagColor}25 0%, transparent 70%)`,
                filter: "blur(40px)",
              }} />
            </div>
          </div>

          {/* НАЗВАНИЕ ЗОНЫ — появляется при зуме */}
          <div
            className="absolute top-24 left-0 right-0 flex flex-col items-center text-center z-20 px-8"
            style={{
              opacity: titleVisible,
              transform: `translateY(${(1 - titleVisible) * 16}px)`,
            }}
          >
            <span
              className="inline-block text-xs tracking-[0.35em] uppercase px-4 py-1.5 rounded-full mb-4 font-medium"
              style={{
                background: tagBg[zone.tagColor] ?? "rgba(255,255,255,0.08)",
                color: zone.tagColor,
                border: `1px solid ${zone.tagColor}50`,
                backdropFilter: "blur(6px)",
              }}
            >{zone.tag}</span>
            <h2
              className="font-light"
              style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)", letterSpacing: "-0.02em", color: "#f0ece6" }}
            >{zone.title}</h2>
            <p className="mt-2 font-light" style={{ color: "rgba(240,236,230,0.5)", fontSize: "1rem" }}>{zone.subtitle}</p>
          </div>

          {/* ИНФОГРАФИКА — аннотации */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ opacity: info }}
          >
            {zone.parts.map((part, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${part.top}%`,
                  left: `${part.left}%`,
                  opacity: info,
                  transform: `translateX(${info < 1 ? (zone.infoSide === "left" ? -12 : 12) * (1 - info) : 0}px)`,
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ flexDirection: zone.infoSide === "right" ? "row" : "row-reverse" }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: zone.tagColor }} />
                    <div className="w-px flex-1" style={{ height: 24, background: `${zone.tagColor}60` }} />
                  </div>
                  <div
                    className="rounded-sm px-3 py-2"
                    style={{
                      background: "rgba(20,17,16,0.88)",
                      border: `1px solid ${zone.tagColor}30`,
                      backdropFilter: "blur(10px)",
                      minWidth: 140,
                      maxWidth: 200,
                    }}
                  >
                    <div className="text-xs font-semibold mb-0.5 leading-tight" style={{ color: zone.tagColor }}>{part.label}</div>
                    <div className="font-light leading-snug" style={{ color: "rgba(240,236,230,0.6)", fontSize: "0.68rem" }}>{part.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ПРЕИМУЩЕСТВА — снизу */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8"
            style={{
              opacity: info,
              transform: `translateY(${(1 - info) * 24}px)`,
            }}
          >
            <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
              {zone.advantages.map(({ icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-sm px-3 py-2.5"
                  style={{
                    background: "rgba(20,17,16,0.85)",
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

          {/* Прогресс-индикатор зон */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
            {zones.map((z, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === activeZoneIndex ? 6 : 4,
                    height: i === activeZoneIndex ? 20 : 4,
                    background: i === activeZoneIndex ? z.tagColor : "rgba(240,236,230,0.2)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Подпись текущей зоны снизу-справа */}
          <div
            className="absolute bottom-10 right-8 z-30 text-right"
            style={{ opacity: Math.min(1, globalP * 5) }}
          >
            <div className="text-xs tracking-widest uppercase mb-1" style={{ color: zone.tagColor }}>
              {activeZoneIndex + 1} / {ZONES}
            </div>
            <div className="text-xs font-light" style={{ color: "rgba(240,236,230,0.4)" }}>
              {zone.title}
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA ── */}
      <section
        className="relative py-36 px-8 md:px-20 flex flex-col items-center text-center overflow-hidden"
        style={{ background: "var(--dark-800)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px gold-line" />

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
          <span className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--accent-gold)" }}>Готовы к проекту?</span>
          <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
        </div>
        <h2
          className="font-light mb-6 max-w-2xl"
          style={{ fontSize: "clamp(2.2rem,5vw,4rem)", letterSpacing: "-0.02em", color: "#f0ece6" }}
        >
          Подберём люк<br />
          <em style={{ color: "var(--accent-gold)" }}>под ваш интерьер</em>
        </h2>
        <p className="max-w-md font-light mb-12" style={{ color: "rgba(240,236,230,0.5)", lineHeight: 1.8 }}>
          Отправьте план помещения или фото — рассчитаем стоимость и пришлём образцы
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#"
            className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-200"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-gold)")}
          >
            Обсудить проект <Icon name="ArrowRight" size={18} />
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-200"
            style={{ border: "1px solid rgba(240,236,230,0.2)", color: "#f0ece6" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(240,236,230,0.2)")}
          >
            Скачать каталог
          </a>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl"
          style={{ borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "3rem" }}>
          {[{ v: "1200+", l: "объектов" }, { v: "14 лет", l: "на рынке" }, { v: "3 серии", l: "люков" }, { v: "30 дн", l: "производство" }].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="font-light mb-1" style={{ fontSize: "2.2rem", color: "var(--accent-gold)", letterSpacing: "-0.02em" }}>{v}</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.3)" }}>{l}</div>
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
          <span className="text-sm tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.35)" }}>Люки Invisible</span>
        </div>
        <div className="text-xs" style={{ color: "rgba(240,236,230,0.2)" }}>© 2025 · Производство скрытых люков</div>
        <div className="flex gap-6">
          {["TG", "WA", "IN"].map((s) => (
            <a key={s} href="#" className="text-xs tracking-widest transition-colors duration-200"
              style={{ color: "rgba(240,236,230,0.3)", letterSpacing: "0.15em" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,236,230,0.3)")}
            >{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
