import { renderSectionIntro } from "../lib/render.js";

export function renderFAQAccordion(data) {
  return `
    <section class="nx3-section nx3-faq-section" id="${data.id}">
      <div class="nx3-shell nx3-shell--narrow">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
          align: "center",
        })}
        <div class="nx3-faq-list" data-nx3-faq-list>
          ${data.items
            .map(
              (item, index) => `
                <article class="nx3-faq-item ${index === 0 ? "is-open" : ""}">
                  <button
                    class="nx3-faq-item__trigger"
                    type="button"
                    aria-expanded="${index === 0 ? "true" : "false"}"
                  >
                    <span>${item.question}</span>
                    <span class="nx3-faq-item__symbol" aria-hidden="true">+</span>
                  </button>
                  <div class="nx3-faq-item__answer">
                    <p>${item.answer}</p>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function initFaqAccordion(root) {
  const triggers = root.querySelectorAll(".nx3-faq-item__trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".nx3-faq-item");
      const isOpen = item.classList.contains("is-open");

      root.querySelectorAll(".nx3-faq-item").forEach((faqItem) => {
        faqItem.classList.remove("is-open");
        faqItem.querySelector(".nx3-faq-item__trigger")?.setAttribute("aria-expanded", "false");
      });

      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}
