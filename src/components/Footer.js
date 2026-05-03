export function renderFooter(data) {
  return `
    <footer class="nx3-footer">
      <div class="nx3-shell">
        <div class="nx3-footer__top">
          <div class="nx3-footer__brand">
            <strong>${data.brand}</strong>
            <p>${data.claim}</p>
          </div>
          <div class="nx3-footer__columns">
            ${data.columns
              .map(
                (column) => `
                  <div class="nx3-footer__column">
                    <span class="nx3-card-label">${column.title}</span>
                    <ul>
                      ${column.links.map((link) => `<li>${link}</li>`).join("")}
                    </ul>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="nx3-footer__bottom">
          <p>${data.note}</p>
        </div>
      </div>
    </footer>
  `;
}
