import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/files/0c6c8db3-cd34-4ece-bb1c-ec68d82f1ad5.png";
const PRODUCT_IMG = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/ce1500eb-8103-4023-aac8-a16295400d5d.jpg";
const INTERIOR_IMG = "https://cdn.poehali.dev/projects/3bfa20a6-8a11-4065-ae49-bb1b42cdfbc7/files/2cd29847-0729-4aae-948a-24809c338fb4.jpg";

const features = [
  { icon: "Eye", label: "Невидимые", desc: "Идеально сливаются со стеной — никаких зазоров, никаких швов" },
  { icon: "Shield", label: "Надёжные", desc: "Стальной каркас, нагрузка до 300 кг/м²" },
  { icon: "Paintbrush", label: "Под любой материал", desc: "Штукатурка, плитка, дерево, камень, обои" },
  { icon: "Ruler", label: "Под заказ", desc: "Любые размеры и конфигурации по вашему проекту" },
];

const stats = [
  { value: "1200+", label: "объектов сдано" },
  { value: "14", label: "лет на рынке" },
  { value: "100%", label: "невидимость" },
  { value: "30 дн", label: "срок производства" },
];

export default function Index() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.15 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="grain-overlay min-h-screen" style={{ background: "var(--dark-900)", color: "#f0ece6" }}>

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
            className="text-sm px-5 py-2 rounded-sm font-medium tracking-wide transition-all duration-300"
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8 md:hidden"
          style={{ background: "rgba(26,22,20,0.97)" }}>
          {["Продукты", "Применение", "Проекты", "Контакты"].map((item) => (
            <a key={item} href="#" className="text-2xl tracking-wider" onClick={() => setMenuOpen(false)}
              style={{ color: "#f0ece6" }}>{item}</a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        >
          <img
            src={HERO_IMG}
            alt="Интерьер с невидимым люком"
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.15)", transformOrigin: "center center" }}
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(26,22,20,0.75) 0%, rgba(26,22,20,0.2) 50%, rgba(26,22,20,0.5) 100%)"
          }} />
        </div>

        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px gold-line" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-8 md:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="animate-fade-in flex items-center gap-3 mb-6">
              <div className="h-px w-12" style={{ background: "var(--accent-gold)" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent-gold)" }}>
                Скрытые решения
              </span>
            </div>
            <h1
              className="animate-fade-in-up delay-200 font-light leading-none mb-6"
              style={{ fontSize: "clamp(3rem,8vw,6.5rem)", letterSpacing: "-0.02em", color: "#f0ece6" }}
            >
              Люки,<br />
              <span style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>которых</span><br />
              не видно
            </h1>
            <p className="animate-fade-in-up delay-400 text-lg font-light max-w-lg mb-10"
              style={{ color: "rgba(240,236,230,0.65)", lineHeight: 1.7 }}>
              Ревизионные и сантехнические люки без видимых границ — для дизайнерских интерьеров, которые не идут на компромисс.
            </p>
            <div className="animate-fade-in-up delay-600 flex flex-wrap gap-4">
              <a
                href="#"
                className="flex items-center gap-3 px-8 py-4 font-medium tracking-wide transition-all duration-300 hover:gap-4"
                style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
              >
                Смотреть каталог
                <Icon name="ArrowRight" size={18} />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-8 py-4 font-medium tracking-wide transition-all duration-300"
                style={{ border: "1px solid rgba(240,236,230,0.3)", color: "#f0ece6" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(240,236,230,0.3)")}
              >
                Наши проекты
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-1000">
          <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.4)" }}>scroll</span>
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)" }} />
        </div>
      </section>

      {/* STATS BAR */}
      <section ref={addReveal} className="reveal py-16 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x"
          style={{ borderTop: "1px solid rgba(201,168,76,0.2)", borderBottom: "1px solid rgba(201,168,76,0.2)", divideColor: "rgba(201,168,76,0.2)" }}>
          {stats.map(({ value, label }) => (
            <div key={label} className="py-10 md:px-12 text-center md:text-left">
              <div className="font-light mb-1" style={{ fontSize: "2.8rem", color: "var(--accent-gold)", letterSpacing: "-0.02em" }}>
                {value}
              </div>
              <div className="text-sm tracking-wide uppercase" style={{ color: "rgba(240,236,230,0.45)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT FEATURE */}
      <section className="py-24 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div ref={addReveal} className="reveal">
            <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4/5" }}>
              <img src={PRODUCT_IMG} alt="Невидимый люк в интерьере" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, rgba(26,22,20,0.6) 0%, transparent 60%)"
              }} />
              {/* Corner accent */}
              <div className="absolute top-6 right-6 w-12 h-12" style={{
                borderTop: "2px solid var(--accent-gold)",
                borderRight: "2px solid var(--accent-gold)"
              }} />
              <div className="absolute bottom-6 left-6 w-12 h-12" style={{
                borderBottom: "2px solid var(--accent-gold)",
                borderLeft: "2px solid var(--accent-gold)"
              }} />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-xs tracking-widest uppercase" style={{ color: "var(--accent-gold)" }}>
                  Серия Flush Pro
                </span>
                <p className="text-lg font-light mt-1" style={{ color: "#f0ece6" }}>
                  Зазор 0 мм. Видимость 0%.
                </p>
              </div>
            </div>
          </div>
          <div ref={addReveal} className="reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent-gold)" }}>
                Почему выбирают нас
              </span>
            </div>
            <h2 className="font-light mb-8" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Дизайн без<br />
              <span style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>компромиссов</span>
            </h2>
            <p className="mb-12 font-light leading-relaxed" style={{ color: "rgba(240,236,230,0.6)", fontSize: "1.05rem" }}>
              Мы производим люки, которые становятся частью архитектуры — а не нарушают её. Каждое изделие создаётся под конкретный проект.
            </p>
            <div className="space-y-8">
              {features.map(({ icon, label, desc }) => (
                <div key={label} className="flex items-start gap-5 group">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-sm transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <Icon name={icon} size={20} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <div className="font-medium mb-1" style={{ color: "#f0ece6" }}>{label}</div>
                    <div className="text-sm font-light leading-relaxed" style={{ color: "rgba(240,236,230,0.5)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH BANNER */}
      <section ref={addReveal} className="reveal relative overflow-hidden" style={{ height: "60vh" }}>
        <img src={INTERIOR_IMG} alt="Интерьер" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          style={{ background: "rgba(26,22,20,0.55)" }}>
          <div className="h-px w-20 mb-8" style={{ background: "var(--accent-gold)" }} />
          <h2 className="font-light mb-4" style={{ fontSize: "clamp(2rem,5vw,4rem)", color: "#f0ece6", letterSpacing: "-0.02em" }}>
            Ваш интерьер заслуживает<br />
            <span style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>идеального решения</span>
          </h2>
          <p className="max-w-xl font-light mb-10" style={{ color: "rgba(240,236,230,0.6)", lineHeight: 1.7 }}>
            Работаем с архитекторами, дизайнерами и застройщиками по всей России
          </p>
          <a
            href="#"
            className="flex items-center gap-3 px-10 py-4 font-medium tracking-wide transition-all duration-300"
            style={{ background: "var(--accent-gold)", color: "var(--dark-900)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b55a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-gold)")}
          >
            Обсудить проект
            <Icon name="ArrowRight" size={18} />
          </a>
        </div>
      </section>

      {/* MATERIALS GRID */}
      <section className="py-24 px-8 md:px-20 max-w-7xl mx-auto">
        <div ref={addReveal} className="reveal text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent-gold)" }}>
              Отделка
            </span>
            <div className="h-px w-8" style={{ background: "var(--accent-gold)" }} />
          </div>
          <h2 className="font-light" style={{ fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em" }}>
            Под любое покрытие
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Плитка", color: "#2a2520" },
            { label: "Штукатурка", color: "#231e1b" },
            { label: "Дерево", color: "#241c16" },
            { label: "Камень", color: "#1e1d1c" },
          ].map(({ label, color }, i) => (
            <div
              key={label}
              ref={addReveal}
              className="reveal product-card cursor-pointer relative overflow-hidden rounded-sm"
              style={{ aspectRatio: "3/4", background: color, animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-6"
                style={{ background: "linear-gradient(to top, rgba(26,22,20,0.9) 0%, transparent 60%)" }}>
                <div className="h-px mb-4 transition-all duration-500"
                  style={{ background: "var(--accent-gold)", width: "32px" }} />
                <span className="text-lg font-light tracking-wide" style={{ color: "#f0ece6" }}>{label}</span>
              </div>
              {/* Hover border */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 product-card-border"
                style={{ border: "1px solid rgba(201,168,76,0.5)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8 md:px-20 max-w-7xl mx-auto"
        style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: "var(--accent-gold)" }}>
              <Icon name="Square" size={12} color="var(--dark-900)" />
            </div>
            <span className="text-sm tracking-widest uppercase" style={{ color: "rgba(240,236,230,0.5)" }}>
              Люки Invisible
            </span>
          </div>
          <div className="text-xs tracking-wide" style={{ color: "rgba(240,236,230,0.3)" }}>
            © 2025 · Производство скрытых люков
          </div>
          <div className="flex gap-6">
            {["TG", "WA", "IN"].map((s) => (
              <a key={s} href="#" className="text-xs tracking-widest transition-colors duration-200 hover:opacity-100"
                style={{ color: "rgba(240,236,230,0.4)", letterSpacing: "0.15em" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,236,230,0.4)")}
              >{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}