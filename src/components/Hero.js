import { renderButton, renderChecklist, renderInlineMeta, renderTagRow } from "../lib/render.js";

export function renderHero(data) {
  return `
    <section class="nx3-section nx3-hero" id="top">
      <div class="nx3-shell nx3-hero__grid">
        <div class="nx3-hero__copy">
          <p class="nx3-eyebrow">${data.eyebrow}</p>
          <h1 class="nx3-hero__title">${data.headline}</h1>
          <p class="nx3-hero__lead">${data.subheadline}</p>
          <p class="nx3-hero__body">${data.body}</p>
          <div class="nx3-hero__actions">
            ${renderButton(data.primaryCta)}
            ${renderButton(data.secondaryCta)}
          </div>
          <p class="nx3-hero__trust">${data.trustCopy}</p>
          ${renderChecklist(data.bullets)}
        </div>
        <div class="nx3-hero__visual" aria-label="Visualisierung des NX3 Carrier Service">
          <div class="nx3-hero-panel nx3-hero-panel--main">
            <div class="nx3-hero-panel__bar">
              <span>${data.visual.eyebrow}</span>
              <strong>${data.visual.status}</strong>
            </div>
            <div class="nx3-hero-panel__body">
              <div class="nx3-hero-record">
                <span class="nx3-card-label">Carrier Record</span>
                ${renderInlineMeta(data.visual.profile.map((item) => `${item.label}: ${item.value}`))}
              </div>
              <div class="nx3-hero-sources">
                <span class="nx3-card-label">Source Sync</span>
                ${renderTagRow(data.visual.sources)}
              </div>
              <div class="nx3-hero-documents">
                <span class="nx3-card-label">Document Analysis</span>
                <ul class="nx3-document-list">
                  ${data.visual.documentStates
                    .map(
                      (item) => `
                        <li>
                          <span>${item.label}</span>
                          <strong>${item.state}</strong>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
          <div class="nx3-hero-panel nx3-hero-panel--floating">
            <span class="nx3-card-label">Risk Signals</span>
            ${renderChecklist(data.visual.riskSignals, "inverse")}
          </div>
        </div>
      </div>
    </section>
  `;
}
