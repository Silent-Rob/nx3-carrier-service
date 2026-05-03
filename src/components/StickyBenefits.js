import { renderButton, renderChecklist, renderSectionIntro } from "../lib/render.js";

export function renderStickyBenefits(data) {
  return `
    <section class="nx3-section nx3-sticky-benefits" data-nx3-sticky-root>
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
        })}
        <div class="nx3-sticky-benefits__grid">
          <div class="nx3-sticky-benefits__stage">
            <div class="nx3-stage-panel">
              <div class="nx3-stage-panel__progress" aria-hidden="true">
                ${data.items
                  .map(
                    (item, index) => `
                      <span
                        class="nx3-stage-panel__dot ${index === 0 ? "is-active" : ""}"
                        data-nx3-stage-dot="${item.id}"
                      ></span>
                    `,
                  )
                  .join("")}
              </div>
              <div class="nx3-stage-panel__copies">
                ${data.items
                  .map(
                    (item, index) => `
                      <article class="nx3-stage-copy ${index === 0 ? "is-active" : ""}" data-nx3-stage-copy="${item.id}">
                        <p class="nx3-stage-copy__headline">${item.headline}</p>
                        <p class="nx3-stage-copy__support">${item.supportText}</p>
                      </article>
                    `,
                  )
                  .join("")}
              </div>
              <div class="nx3-stage-panel__cta">
                ${renderButton(data.cta)}
              </div>
            </div>
          </div>
          <div class="nx3-sticky-benefits__steps">
            ${data.items
              .map(
                (item) => `
                  <article class="nx3-benefit-step" data-nx3-benefit-step="${item.id}">
                    <div class="nx3-benefit-step__mobile-copy">
                      <p class="nx3-stage-copy__headline">${item.headline}</p>
                      <p class="nx3-stage-copy__support">${item.supportText}</p>
                    </div>
                    <div class="nx3-card nx3-proof-card">
                      <span class="nx3-card-label">${item.proofTitle}</span>
                      ${renderChecklist(item.proofPoints, "dark")}
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initStickyBenefits(root) {
  const stickyRoot = root.querySelector("[data-nx3-sticky-root]");

  if (!stickyRoot || !("IntersectionObserver" in window)) {
    return;
  }

  const copies = stickyRoot.querySelectorAll("[data-nx3-stage-copy]");
  const dots = stickyRoot.querySelectorAll("[data-nx3-stage-dot]");
  const steps = stickyRoot.querySelectorAll("[data-nx3-benefit-step]");

  const activate = (id) => {
    copies.forEach((copy) => {
      copy.classList.toggle("is-active", copy.dataset.nx3StageCopy === id);
    });
    dots.forEach((dot) => {
      dot.classList.toggle("is-active", dot.dataset.nx3StageDot === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activate(entry.target.dataset.nx3BenefitStep);
        }
      });
    },
    {
      threshold: 0.55,
      rootMargin: "-10% 0px -10% 0px",
    },
  );

  steps.forEach((step) => observer.observe(step));
}
