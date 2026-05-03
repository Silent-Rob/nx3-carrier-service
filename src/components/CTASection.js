import { renderButton, renderChecklist, renderSectionIntro } from "../lib/render.js";

function renderField(field) {
  if (field.type === "textarea") {
    return `
      <label class="nx3-form-field nx3-form-field--full">
        <span>${field.label}</span>
        <textarea name="${field.name}" rows="4" placeholder="${field.placeholder}"></textarea>
      </label>
    `;
  }

  return `
    <label class="nx3-form-field">
      <span>${field.label}</span>
      <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}">
    </label>
  `;
}

export function renderCTASection(data) {
  return `
    <section class="nx3-section nx3-cta-section">
      <div class="nx3-shell nx3-cta-section__grid">
        <div class="nx3-cta-section__copy">
          ${renderSectionIntro({
            eyebrow: data.eyebrow,
            headline: data.headline,
            intro: data.intro,
          })}
          <p class="nx3-section-body">${data.body}</p>
          ${renderChecklist(data.trustPoints)}
          <div class="nx3-cta-section__secondary">
            ${renderButton(data.secondaryCta)}
          </div>
        </div>
        <div class="nx3-card nx3-demo-card">
          <div class="nx3-demo-card__header">
            <span class="nx3-card-label">${data.formTitle}</span>
            <p>${data.formCaption}</p>
          </div>
          <form class="nx3-demo-form" id="demo-form" data-nx3-demo-form>
            <div class="nx3-form-grid">
              ${data.fields.map((field) => renderField(field)).join("")}
            </div>
            <div class="nx3-demo-form__actions">
              <button class="nx3-button nx3-button--primary" type="submit">
                <span>${data.submitLabel}</span>
              </button>
              <p class="nx3-demo-form__helper">Unverbindlich. Fokus auf Ihren Freigabeprozess.</p>
            </div>
            <p class="nx3-demo-form__message" data-nx3-demo-message hidden>${data.successMessage}</p>
          </form>
        </div>
      </div>
    </section>
  `;
}

export function initCtaSection(root) {
  const form = root.querySelector("[data-nx3-demo-form]");
  const message = root.querySelector("[data-nx3-demo-message]");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.hidden = false;
  });
}
