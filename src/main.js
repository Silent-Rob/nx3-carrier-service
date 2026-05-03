import { landingPageData } from "./data/landingPageData.js";
import { renderHeader, initHeader } from "./components/Header.js";
import { renderHero } from "./components/Hero.js";
import { renderTrustBar } from "./components/TrustBar.js";
import { renderPainCards } from "./components/PainCards.js";
import { renderStickyBenefits, initStickyBenefits } from "./components/StickyBenefits.js";
import { renderSolutionSection } from "./components/SolutionSection.js";
import { renderBenefitsGrid } from "./components/BenefitsGrid.js";
import { renderFeatureCards } from "./components/FeatureCards.js";
import { renderHowItWorks } from "./components/HowItWorks.js";
import { renderAudienceSplit } from "./components/AudienceSplit.js";
import { renderWhyNx3 } from "./components/WhyNx3.js";
import { renderFAQAccordion, initFaqAccordion } from "./components/FAQAccordion.js";
import { renderCTASection, initCtaSection } from "./components/CTASection.js";
import { renderFooter } from "./components/Footer.js";

function renderLandingPage(data) {
  return `
    <a class="nx3-skip-link" href="#nx3-main">Zum Inhalt springen</a>
    ${renderHeader(data.header)}
    <main id="nx3-main" class="nx3-page">
      ${renderHero(data.hero)}
      ${renderTrustBar(data.trustBar)}
      ${renderPainCards(data.painPoints)}
      ${renderStickyBenefits(data.stickyBenefits)}
      ${renderSolutionSection(data.solution)}
      ${renderBenefitsGrid(data.benefits)}
      ${renderFeatureCards(data.features)}
      ${renderHowItWorks(data.howItWorks)}
      ${renderAudienceSplit(data.audiences)}
      ${renderWhyNx3(data.whyNx3)}
      ${renderFAQAccordion(data.faq)}
      ${renderCTASection(data.ctaSection)}
    </main>
    ${renderFooter(data.footer)}
  `;
}

const root = document.querySelector("[data-nx3-page]");

if (root) {
  root.innerHTML = renderLandingPage(landingPageData);
  initHeader(root);
  initStickyBenefits(root);
  initFaqAccordion(root);
  initCtaSection(root);
}
