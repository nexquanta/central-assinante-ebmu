"use strict";

// Protótipo visual: navegação interna entre telas, sem links externos.
document.addEventListener("DOMContentLoaded", () => {
  const views = document.querySelectorAll(".view");
  const aviso = document.getElementById("aviso");
  const avisoCursos = document.getElementById("aviso-cursos");

  function showView(name) {
    let target = null;
    views.forEach((view) => {
      const active = view.dataset.view === name;
      view.hidden = !active;
      if (active) target = view;
    });
    if (!target) return;
    aviso.textContent = "";
    avisoCursos.textContent = "";
    window.scrollTo(0, 0);
    const heading = target.querySelector("h1");
    if (heading) heading.focus();
  }

  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", () => showView(el.dataset.goto));
  });

  document.querySelectorAll(".option:not([data-goto])").forEach((option) => {
    option.addEventListener("click", () => {
      aviso.textContent = `“${option.dataset.option}” estará disponível nas próximas etapas.`;
    });
  });

  document.getElementById("btn-area-cursos").addEventListener("click", () => {
    avisoCursos.textContent = "No MVP, este botão direcionará o assinante ao ambiente de cursos da Hotmart.";
  });
});
