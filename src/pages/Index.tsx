import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/files/0c6c8db3-cd34-4ece-bb1c-ec68d82f1ad5.png";

// Люк 1 — бетонная стена
const WALL_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/c6fb3dc1-dc40-4aee-af2a-29c0ec9fc63d.jpg";
const WALL_OPEN = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/a9b5009e-3728-4eb6-9bd4-bfc6b8e11283.jpg";

// Люк 2 — плитка
const TILE_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/76e9eecd-9807-46df-a330-0593875fe81c.jpg";
const TILE_OPEN = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/dd4af6a7-57b0-4205-ac11-b7be62ac61ac.jpg";

// Люк 3 — кухня / противопожарный
const FIRE_CLOSED = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/62e1b0fd-c009-46fd-a56b-4a863cbdbcba.jpg";
const FIRE_OPEN = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/37fe4ff1-02fa-4861-88d2-8f15709e872d.jpg";

interface HatchData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  closedImg: string;
  openImg: string;
  parts: { label: string; desc: string; angle: number; radius: number }[];
  advantages: { icon: string; text: string }[];
}

const hatches: HatchData[] = [
  {
    id: "wall",
    title: "Люк под штукатурку",
    subtitle: "Исчезает в стене — навсегда",
    tag: "Серия FLUSH",
    tagColor: "#c9a84c",
    closedImg: WALL_CLOSED,
    openImg: WALL_OPEN,
    parts: [
      { label: "Стальной каркас", desc: "3 мм сталь, сварная рама", angle: -40, radius: 42 },
      { label: "Скрытые петли", desc: "Ход 180°, без видимых элементов", angle: 30, radius: 44 },
      { label: "Магнитный замок", desc: "Открытие нажатием, без ручки", angle: 130, radius: 42 },
      { label: "Шпаклёвочная сетка", desc: "Для идеального нанесения отделки", angle: 200, radius: 43 },
    ],
    advantages: [
      { icon: "Eye", text: "Зазор 0 мм — невидим после отделки" },
      { icon: "Weight", text: "Нагрузка до 300 кг/м²" },
      { icon: "Paintbrush", text: "Под штукатурку, краску, обои" },
      { icon: "Ruler", text: "Типоразмеры 200×300 — 1200×2100 мм" },
    ],
  },
  {
    id: "tile",
    title: "Люк под плитку",
    subtitle: "Идеальное выравнивание швов",
    tag: "Серия TILE PRO",
    tagColor: "#6eb5c0",
    closedImg: TILE_CLOSED,
    openImg: TILE_OPEN,
    parts: [
      { label: "Алюминиевая рама", desc: "Анодированный сплав, не ржавеет", angle: -50, radius: 43 },
      { label: "Регулируемая глубина", desc: "±15 мм под любой формат плитки", angle: 40, radius: 44 },
      { icon: "anchor", label: "Push-to-open", desc: "Без ручки, открытие нажатием", angle: 140, radius: 42 },
      { label: "Выравнивающие лапки", desc: "Точное позиционирование плиток", angle: 210, radius: 43 },
    ],
    advantages: [
      { icon: "Grid2x2", text: "Совпадение швов ±0.5 мм" },
      { icon: "Droplets", text: "Влагостойкость IP67" },
      { icon: "Wrench", text: "Регулировка без демонтажа" },
      { icon: "Layers", text: "Формат плитки до 1200×2400 мм" },
    ],
  },
  {
    id: "fire",
    title: "Противопожарный люк",
    subtitle: "Защита там, где это важнее всего",
    tag: "EI 60 · Кухня",
    tagColor: "#e05a2b",
    closedImg: FIRE_CLOSED,
    openImg: FIRE_OPEN,
    parts: [
      { label: "Огнестойкое полотно", desc: "EI 60 — держит огонь 60 минут", angle: -45, radius: 43 },
      { label: "Интумесцентный уплотнитель", desc: "Расширяется при нагреве, блокирует дым", angle: 35, radius: 44 },
      { label: "Стальная коробка 2 мм", desc: "Не деформируется при пожаре", angle: 135, radius: 42 },
      { label: "Доводчик с фиксатором", desc: "Самозакрывающийся механизм", angle: 215, radius: 43 },
    ],
    advantages: [
      { icon: "Flame", text: "Сертификат EI 60 по ГОСТ 30247" },
      { icon: "ShieldCheck", text: "Обязателен в зонах возле газа и плиты" },
      { icon: "Wind", text: "Дымонепроницаемость класса Sa" },
      { icon: "Award", text: "Пожарный сертификат РФ" },
    ],
  },
];

// Фазы scroll для каждого люка (0–1):
// 0.00–0.20 → зум на люк (scale растёт)
// 0.20–0.45 → люк открывается (opacity open img)
// 0.45–0.75 → инфографика видна
// 0.75–0.95 → люк закрывается, zoom out
// 0.95–1.00 → переход
function getPhase(p: number) {
  const zoom = Math.min(1, p / 0.2); // 0→1
  const opening = p < 0.2 ? 0 : p < 0.45 ? (p - 0.2) / 0.25 : p < 0.75 ? 1 : p < 0.95 ? 1 - (p - 0.75) / 0.2 : 0;
  const info = p < 0.4 ? 0 : p < 0.55 ? (p - 0.4) / 0.15 : p < 0.72 ? 1 : p < 0.85 ? 1 - (p - 0.72) / 0.13 : 0;
  const closing = p > 0.75 ? Math.min(1, (p - 0.75) / 0.2) : 0;
  const scale = 1 + zoom * 0.35 - closing * 0.35;
  return { scale, opening, info };
}

function HatchSection({ hatch, index }: { hatch: HatchData; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { scale, opening, info } = getPhase(progress);

  const tagColors: Record<string, string> = {
    "#c9a84c": "rgba(201,168,76,0.15)",
    "#6eb5c0": "rgba(110,181,192,0.15)",
    "#e05a2b": "rgba(224,90,43,0.15)",
  };

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* BG overlay tint per hatch */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at center, ${tagColors[hatch.tagColor] ?? "transparent"} 0%, rgba(26,22,20,0) 70%)`,
            opacity: info,
          }}
        />

        {/* CLOSED IMAGE */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.05s linear",
            transformOrigin: "center center",
          }}
        >
          <img
            src={hatch.closedImg}
            alt={hatch.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(26,22,20,0.3) 0%, rgba(26,22,20,0.55) 100%)",
            }}
          />
        </div>

        {/* OPEN IMAGE — crossfade */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.05s linear",
            transformOrigin: "center center",
            opacity: opening,
          }}
        >
          <img
            src={hatch.openImg}
            alt={`${hatch.title} открыт`}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(26,22,20,0.25) 0%, rgba(26,22,20,0.6) 100%)",
            }}
          />
        </div>

        {/* TAG + TITLE — появляется при зуме */}
        <div
          className="absolute top-24 left-0 right-0 flex flex-col items-center text-center z-10 px-8"
          style={{
            opacity: Math.min(1, progress / 0.12),
            transform: `translateY(${(1 - Math.min(1, progress / 0.12)) * 20}px)`,
            transition: "opacity 0.1s, transform 0.1s",
          }}
        >
          <span
            className="inline-block text-xs tracking-[0.35em] uppercase px-4 py-1.5 rounded-full mb-4 font-medium"
            style={{
              background: tagColors[hatch.tagColor],
              color: hatch.tagColor,
              border: `1px solid ${hatch.tagColor}40`,
            }}
          >
            {hatch.tag}
          </span>
          <h2
            className="font-light"
            style={{
              fontSize: "clamp(2.2rem,5vw,4.5rem)",
              letterSpacing: "-0.02em",
              color: "#f0ece6",
            }}
          >
            {hatch.title}
          </h2>
          <p
            className="mt-2 font-light"
            style={{ color: "rgba(240,236,230,0.55)", fontSize: "1.1rem" }}
          >
            {hatch.subtitle}
          </p>
        </div>

        {/* ИНФОГРАФИКА — составные части */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: info, pointerEvents: info > 0.1 ? "auto" : "none" }}
        >
          {/* Central circle marker */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: "min(420px, 80vw)", height: "min(420px, 80vw)" }}
          >
            {/* Pulsing ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: "30%",
                border: `1px solid ${hatch.tagColor}60`,
                animation: "pulse-ring 2s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: "37%",
                border: `2px solid ${hatch.tagColor}`,
                opacity: 0.7,
              }}
            />

            {/* Parts labels */}
            {hatch.parts.map((part, i) => {
              const rad = (part.angle * Math.PI) / 180;
              const r = part.radius; // % from center
              const x = 50 + r * Math.cos(rad);
              const y = 50 + r * Math.sin(rad);
              const isRight = x > 50;

              return (
                <div
                  key={i}
                  className="absolute flex items-center gap-2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: info,
                    transition: `opacity 0.4s ease ${i * 0.08}s`,
                  }}
                >
                  {/* Dot + line */}
                  <div className="relative flex items-center">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: hatch.tagColor }}
                    />
                    <div
                      className="h-px flex-shrink-0"
                      style={{
                        width: "32px",
                        background: `${hatch.tagColor}80`,
                        marginLeft: isRight ? "0" : "-32px",
                        order: isRight ? 1 : -1,
                      }}
                    />
                  </div>
                  {/* Text card */}
                  <div
                    className="rounded-sm px-3 py-2"
                    style={{
                      background: "rgba(26,22,20,0.85)",
                      border: `1px solid ${hatch.tagColor}30`,
                      backdropFilter: "blur(8px)",
                      minWidth: "130px",
                      textAlign: isRight ? "left" : "right",
                    }}
                  >
                    <div
                      className="text-xs font-medium mb-0.5"
                      style={{ color: hatch.tagColor }}
                    >
                      {part.label}
                    </div>
                    <div
                      className="text-xs font-light leading-snug"
                      style={{ color: "rgba(240,236,230,0.6)", fontSize: "0.7rem" }}
                    >
                      {part.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ПРЕИМУЩЕСТВА — снизу */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-10"
          style={{ opacity: info, transform: `translateY(${(1 - info) * 30}px)`, transition: "transform 0.1s" }}
        >
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {hatch.advantages.map(({ icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-sm px-4 py-3"
                style={{
                  background: "rgba(26,22,20,0.8)",
                  border: `1px solid ${hatch.tagColor}25`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-sm mt-0.5"
                  style={{ background: `${hatch.tagColor}20` }}
                >
                  <Icon name={icon} size={16} color={hatch.tagColor} />
                </div>
                <span
                  className="text-xs font-light leading-snug"
                  style={{ color: "rgba(240,236,230,0.75)" }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Index dot */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30"
          style={{ opacity: Math.min(1, progress / 0.1) }}
        >
          {hatches.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? "6px" : "4px",
                height: i === index ? "18px" : "4px",
                background: i === index ? hatch.tagColor : "rgba(240,236,230,0.25)",
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        {progress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 animate-fade-in">
            <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.35)" }}>scroll</span>
            <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="grain-overlay" style={{ background: "var(--dark-900)", color: "#f0ece6" }}>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500"
        style={{
          background: scrollY > 60 ? "rgba(26,22,20,0.92)" : "transparent",
          backdropFilter: scrollY > 60 ? "blur(16px)" : "none",
          borderBottom: scrollY > 60 ? "1px solid rgba(201,168,76,0.15)" : "none",
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
            <a key={item} href="#" className="nav-link text-sm tracking-wide" style={{ color: "rgba(240,236,230,0.7)" }}>
              {item}
            </a>
          ))}
          <a
            href="#"
            className="text-sm px-5 py-2 rounded-sm font-medium tracking-wide transition-all duration-200"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-gold)")}
          >
            Получить КП
          </a>
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

      {/* ── HERO ── */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <img src={HERO_IMG} alt="Интерьер" className="w-full h-full object-cover" style={{ transform: "scale(1.15)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,22,20,0.72) 0%, rgba(26,22,20,0.2) 55%, rgba(26,22,20,0.55) 100%)" }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px gold-line" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-28 px-8 md:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="animate-fade-in flex items-center gap-3 mb-6">
              <div className="h-px w-12" style={{ background: "var(--accent-gold)" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent-gold)" }}>
                Скрытые решения для интерьера
              </span>
            </div>
            <h1
              className="animate-fade-in-up delay-200 font-light leading-none mb-6"
              style={{ fontSize: "clamp(3.2rem,8vw,6.5rem)", letterSpacing: "-0.02em", color: "#f0ece6" }}
            >
              Люки,<br />
              <em style={{ color: "var(--accent-gold)" }}>которых</em><br />
              не видно
            </h1>
            <p className="animate-fade-in-up delay-400 text-lg font-light max-w-lg mb-10"
              style={{ color: "rgba(240,236,230,0.6)", lineHeight: 1.7 }}>
              Пролистайте вниз — мы покажем, как устроен каждый люк изнутри
            </p>
            <div className="animate-fade-in-up delay-600 flex items-center gap-3">
              <div className="h-px w-8" style={{ background: "rgba(240,236,230,0.3)" }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.4)" }}>
                3 серии · Scroll to explore
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-1000">
          <Icon name="ChevronsDown" size={20} color="rgba(201,168,76,0.6)" />
        </div>
      </section>

      {/* ── 3 HATCH SECTIONS ── */}
      {hatches.map((hatch, index) => (
        <HatchSection key={hatch.id} hatch={hatch} index={index} />
      ))}

      {/* ── ФИНАЛЬНЫЙ CTA ── */}
      <section
        className="relative py-36 px-8 md:px-20 flex flex-col items-center text-center overflow-hidden"
        style={{ background: "var(--dark-800)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px gold-line" />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(201,168,76,0.15)" }} />

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
          Отправьте план помещения или фото — рассчитаем стоимость и пришлём образцы материалов
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#"
            className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-200"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-gold)")}
          >
            Обсудить проект
            <Icon name="ArrowRight" size={18} />
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

        {/* Stats */}
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl"
          style={{ borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "3rem" }}
        >
          {[
            { v: "1200+", l: "объектов" },
            { v: "14 лет", l: "на рынке" },
            { v: "3 серии", l: "люков" },
            { v: "30 дн", l: "производство" },
          ].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="font-light mb-1" style={{ fontSize: "2.2rem", color: "var(--accent-gold)", letterSpacing: "-0.02em" }}>{v}</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.35)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 md:px-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: "var(--accent-gold)" }}>
            <Icon name="Square" size={12} color="var(--dark-900)" />
          </div>
          <span className="text-sm tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.4)" }}>Люки Invisible</span>
        </div>
        <div className="text-xs" style={{ color: "rgba(240,236,230,0.25)" }}>© 2025 · Производство скрытых люков</div>
        <div className="flex gap-6">
          {["TG", "WA", "IN"].map((s) => (
            <a key={s} href="#" className="text-xs tracking-widest transition-colors duration-200"
              style={{ color: "rgba(240,236,230,0.35)", letterSpacing: "0.15em" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,236,230,0.35)")}
            >{s}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
