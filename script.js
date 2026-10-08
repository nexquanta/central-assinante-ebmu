"use strict";

// Protótipo visual: navegação interna entre telas, sem links externos.
document.addEventListener("DOMContentLoaded", () => {
  const views = document.querySelectorAll(".view");
  const aviso = document.getElementById("aviso");
  const avisoCursos = document.getElementById("aviso-cursos");
  const avisoAssinatura = document.getElementById("aviso-assinatura");
  const avisoProblemas = document.getElementById("aviso-problemas");

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
    avisoAssinatura.textContent = "";
    avisoProblemas.textContent = "";
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

  document.getElementById("btn-gerenciar-assinatura").addEventListener("click", () => {
    avisoAssinatura.textContent = "O direcionamento para a Hotmart será configurado posteriormente.";
  });

  document.getElementById("btn-ajuda-assinatura").addEventListener("click", () => {
    avisoAssinatura.textContent =
      "Os canais de atendimento da EBMU serão informados nesta Central em uma próxima etapa. Para pagamentos, renovações e cancelamentos, consulte a Hotmart.";
  });

  document.getElementById("btn-recuperar-acesso").addEventListener("click", () => {
    avisoProblemas.textContent =
      "O endereço oficial para recuperação de acesso na Hotmart será informado nesta Central quando estiver validado.";
  });

  document.getElementById("btn-ajuda-acesso").addEventListener("click", () => {
    avisoProblemas.textContent =
      "As orientações e os canais oficiais de atendimento da EBMU serão informados nesta Central em uma próxima etapa.";
  });
});
