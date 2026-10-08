import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const html = readFileSync(resolve("index.html"), "utf8");
const views = [
  { id: "cursos", card: "Acessar meus cursos", title: "Acessar meus cursos" },
  { id: "assinatura", card: "Minha assinatura", title: "Minha assinatura" },
  { id: "problemas", card: "Problemas para entrar", title: "Problemas para entrar" },
  { id: "acesso", card: "Como funciona meu acesso", title: "Como funciona meu acesso" },
  { id: "ajuda", card: "Preciso de ajuda", title: "Preciso de ajuda" }
];

beforeEach(async () => {
  const parsedHtml = new DOMParser().parseFromString(html, "text/html");
  document.documentElement.innerHTML = parsedHtml.documentElement.innerHTML;
  const unavailableOption = document.createElement("button");
  unavailableOption.className = "option";
  unavailableOption.dataset.option = "Opção indisponível";
  document.querySelector("#view-home .options").append(unavailableOption);
  window.scrollTo = vi.fn();
  vi.resetModules();
  await import("../script.js");
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("navegação da Central do Assinante", () => {
  it.each(views)("abre a seção $title pelo cartão da página inicial", ({ id, card, title }) => {
    document.querySelector(`[data-option="${card}"]`).click();

    expect(document.querySelector("#view-home").hidden).toBe(true);
    expect(document.querySelector(`#view-${id}`).hidden).toBe(false);
    expect(document.querySelector(`#view-${id} h1`).textContent).toBe(title);
    expect(document.activeElement).toBe(document.querySelector(`#view-${id} h1`));
  });

  it.each(views)("retorna de $title à página inicial", ({ id, card }) => {
    document.querySelector(`[data-option="${card}"]`).click();
    document.querySelector(`#view-${id} [data-goto="home"]`).click();

    expect(document.querySelector("#view-home").hidden).toBe(false);
    expect(document.querySelectorAll(".view:not([hidden])")).toHaveLength(1);
    expect(document.activeElement).toBe(document.querySelector("#view-home h1"));
  });

  it("mantém todos os direcionamentos internos associados a telas existentes", () => {
    const viewNames = new Set(
      [...document.querySelectorAll(".view")].map((view) => view.dataset.view)
    );
    const destinations = [...document.querySelectorAll("[data-goto]")];

    expect(destinations.length).toBeGreaterThan(5);
    destinations.forEach((element) => {
      expect(viewNames.has(element.dataset.goto)).toBe(true);
    });
  });

  it("navega entre as orientações internas de cursos, acesso, assinatura e ajuda", () => {
    document.querySelector('[data-option="Acessar meus cursos"]').click();
    document.querySelector("#view-cursos [data-goto='problemas']").click();
    expect(document.querySelector("#view-problemas").hidden).toBe(false);

    document.querySelector("#view-problemas [data-goto='home']").click();
    document.querySelector('[data-option="Como funciona meu acesso"]').click();
    document.querySelector("#view-acesso [data-goto='problemas']").click();
    expect(document.querySelector("#view-problemas").hidden).toBe(false);

    document.querySelector("#view-problemas [data-goto='home']").click();
    document.querySelector('[data-option="Preciso de ajuda"]').click();
    document.querySelector("#view-ajuda [data-goto='assinatura']").click();
    expect(document.querySelector("#view-assinatura").hidden).toBe(false);
  });

  it("mantém a mensagem provisória para cartões ainda sem direcionamento", () => {
    document.querySelector('[data-option="Opção indisponível"]').click();

    expect(document.querySelector("#aviso").textContent).toContain(
      "Opção indisponível"
    );
  });
});

describe("conteúdo das seções", () => {
  it("apresenta as orientações para acessar cursos", () => {
    const view = document.querySelector("#view-cursos");

    expect(view.textContent).toContain("Área de cursos");
    expect(view.textContent).toContain("ambiente da Hotmart");
    expect(view.querySelector("#btn-area-cursos")).not.toBeNull();
    expect(view.textContent).toContain("Ver problemas de acesso");
  });

  it("apresenta as orientações de assinatura", () => {
    const view = document.querySelector("#view-assinatura");

    expect(view.textContent).toContain("Planos disponíveis");
    expect(view.textContent).toContain("assinaturas mensais e anuais");
    expect(view.textContent).toContain("Pagamentos, renovações, cancelamentos");
    expect(view.querySelector("#btn-gerenciar-assinatura")).not.toBeNull();
    expect(view.querySelector("#btn-ajuda-assinatura")).not.toBeNull();
  });

  it("apresenta as orientações de problemas para entrar", () => {
    const view = document.querySelector("#view-problemas");

    expect(view.textContent).toContain("Esqueci minha senha");
    expect(view.textContent).toContain("Dificuldades para fazer login");
    expect(view.textContent).toContain("e-mail utilizado no momento da compra");
    expect(view.textContent).toContain("Acesso aos cursos pela Hotmart");
    expect(view.textContent).toContain("não diretamente pela EBMU");
    expect(view.querySelector("#btn-recuperar-acesso")).not.toBeNull();
    expect(view.querySelector("#btn-ajuda-acesso")).not.toBeNull();
  });

  it("apresenta as orientações de como funciona o acesso", () => {
    const view = document.querySelector("#view-acesso");

    expect(view.textContent).toContain("Como contratar");
    expect(view.textContent).toContain("assinaturas mensais e anuais");
    expect(view.textContent).toContain("Como acessar os cursos");
    expect(view.textContent).toContain("Qual e-mail utilizar");
    expect(view.textContent).toContain("Onde gerenciar minha assinatura");
    expect(view.textContent).toContain("E se eu tiver dificuldades");
    expect(view.querySelector('[data-goto="problemas"]')).not.toBeNull();
  });

  it("apresenta as orientações para solicitar ajuda sem inventar canais", () => {
    const view = document.querySelector("#view-ajuda");

    expect(view.textContent).toContain("Dúvidas sobre acesso aos cursos");
    expect(view.textContent).toContain("Dúvidas sobre a assinatura");
    expect(view.textContent).toContain("Dificuldades de login");
    expect(view.textContent).toContain("Pagamentos e cancelamentos são administrados pela Hotmart");
    expect(view.textContent).toContain("canais de atendimento publicados nos materiais oficiais da EBMU");
    expect(view.textContent).toContain("Nenhum canal específico é indicado");
    expect(view.querySelector('[data-goto="home"]')).not.toBeNull();
  });
});

describe("mensagens provisórias", () => {
  it("mostra aviso provisório ao solicitar recuperação de acesso", () => {
    document.querySelector('[data-option="Problemas para entrar"]').click();
    document.querySelector("#btn-recuperar-acesso").click();

    expect(document.querySelector("#aviso-problemas").textContent).toContain(
      "endereço oficial para recuperação de acesso"
    );
  });

  it("mostra aviso ao acionar os botões demonstrativos sem navegação externa", () => {
    document.querySelector('[data-option="Acessar meus cursos"]').click();
    document.querySelector("#btn-area-cursos").click();
    expect(document.querySelector("#aviso-cursos").textContent).toContain(
      "ambiente de cursos da Hotmart"
    );

    document.querySelector('[data-option="Minha assinatura"]').click();
    document.querySelector("#btn-gerenciar-assinatura").click();

    expect(document.querySelector("#aviso-assinatura").textContent).toContain(
      "será configurado posteriormente"
    );
    document.querySelector("#btn-ajuda-assinatura").click();
    expect(document.querySelector("#aviso-assinatura").textContent).toContain(
      "canais de atendimento da EBMU"
    );

    document.querySelector('[data-option="Problemas para entrar"]').click();
    document.querySelector("#btn-ajuda-acesso").click();
    expect(document.querySelector("#aviso-problemas").textContent).toContain(
      "canais oficiais de atendimento"
    );
  });
});
