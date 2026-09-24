(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Terminal: replay of a session resuming
  const lines = [...document.querySelectorAll("#term .t-line")];
  if (reduced) {
    lines.forEach((l) => l.classList.add("on"));
  } else {
    const question = lines[2];
    const text = question.lastChild.textContent.trim();
    question.lastChild.textContent = " ";
    const delays = [300, 1100, 2000, 3600, 4400];
    lines.forEach((line, i) => setTimeout(() => line.classList.add("on"), delays[i]));
    setTimeout(() => {
      question.classList.add("caret");
      let n = 0;
      const t = setInterval(() => {
        question.lastChild.textContent = " " + text.slice(0, ++n);
        if (n >= text.length) { clearInterval(t); setTimeout(() => question.classList.remove("caret"), 500); }
      }, 70);
    }, 2100);
  }

  // Reveal on scroll
  const targets = document.querySelectorAll(".section-head, .split, .cycle, .vault, .features, .measured, .estimate, .install, .commands, .os-inner, .qa");
  targets.forEach((el) => el.classList.add("reveal"));
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("in"));
  }

  // Savings calculator (per resumed session: ~506k input tokens, ~8 file reads, ~1.5 min)
  const range = document.getElementById("retomadas");
  const out = document.getElementById("retomadas-out");
  const fmt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
  const tokens = (n) => {
    const t = n * 506000;
    return t >= 1e6 ? "~" + fmt.format(t / 1e6) + " milhões" : "~" + fmt.format(Math.round(t / 1000)) + " mil";
  };
  const time = (n) => {
    const m = Math.round(n * 1.5);
    return m >= 60 ? "~" + fmt.format(m / 60) + " h" : "~" + m + " min";
  };
  const update = () => {
    const n = Number(range.value);
    out.textContent = n;
    document.getElementById("out-tokens").textContent = tokens(n);
    document.getElementById("out-tools").textContent = "~" + n * 8;
    document.getElementById("out-time").textContent = time(n);
  };
  range.addEventListener("input", update);
  update();

  // Copy buttons
  document.querySelectorAll(".copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copiado";
        btn.classList.add("done");
      } catch {
        btn.textContent = "Selecione e copie";
      }
      setTimeout(() => { btn.textContent = "Copiar"; btn.classList.remove("done"); }, 1800);
    });
  });
})();
