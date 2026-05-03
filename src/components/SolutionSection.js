import { renderChecklist, renderSectionIntro, renderTagRow } from "../lib/render.js";

export function renderSolutionSection(data) {
  return `
    <section class="nx3-section nx3-solution-section" id="${data.id}">
      <div class="nx3-shell nx3-solution-section__grid">
        <div class="nx3-solution-section__copy">
          ${renderSectionIntro({
            eyebrow: data.eyebrow,
            headline: data.headline,
            intro: data.intro,
          })}
          <p class="nx3-section-body">${data.body}</p>
          ${renderChecklist(data.bullets)}
        </div>
        <div class="nx3-card nx3-decision-flow">
          <div class="nx3-flow-column">
            <span class="nx3-card-label">Sources</span>
            ${renderTagRow(data.flowSources)}
          </div>
          <div class="nx3-flow-column">
            <span class="nx3-card-label">Document Analysis</span>
            ${renderTagRow(data.flowDocuments)}
          </div>
          <div class="nx3-flow-engine">
            <span class="nx3-card-label">NX3 Decision Engine</span>
            <p>Datenbasis, KI-Dokumentenanalyse, Fraud Detection und Plausibilitätslogik arbeiten in einem gemeinsamen Prüfprozess.</p>
          </div>
          <div class="nx3-flow-column">
            <span class="nx3-card-label">Outputs</span>
            ${renderTagRow(data.outputs)}
          </div>
        </div>
      </div>
    </section>
  `;
}
