(function () {
  const COOKIE_STATE = "nx3_consent_state";
  const COOKIE_LEVELS = "nx3_consent_levels";
  const SESSION_DISMISS_KEY = "nx3.consentDismissed";
  const COOKIE_DAYS = 365;
  const CONSENT_VERSION = "1";
  const CATEGORY_KEYS = ["preferences", "statistics", "marketing"];
  const DEFAULT_CONSENT = {
    status: "unset",
    functional: true,
    preferences: false,
    statistics: false,
    marketing: false,
    version: CONSENT_VERSION,
  };

  const state = {
    consent: readConsent(),
    banner: null,
    backdrop: null,
    manageButton: null,
    isOpen: false,
    lastFocusedElement: null,
  };

  window.NX3Consent = {
    canUse: canUse,
    getConsent: getConsent,
    hasChoice: hasChoice,
    openPreferences: function () {
      openBanner(true);
    },
    openBanner: openBanner,
    reset: resetConsent,
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    if (!document.body) {
      return;
    }

    injectMarkup();
    bindEvents();
    syncUi();

    if (shouldShowOnLoad()) {
      openBanner(false);
    } else {
      showManageButton();
    }

    dispatchConsentEvent("nx3:consent-ready");
  }

  function injectMarkup() {
    if (document.querySelector("#cmplz-cookiebanner-container")) {
      state.banner = document.querySelector(".cmplz-cookiebanner");
      state.backdrop = document.querySelector(".cmplz-backdrop");
      state.manageButton = document.querySelector(".cmplz-manage-consent");
      return;
    }

    const container = document.createElement("div");
    container.id = "cmplz-cookiebanner-container";
    container.innerHTML = buildMarkup();
    document.body.appendChild(container);

    state.banner = container.querySelector(".cmplz-cookiebanner");
    state.backdrop = container.querySelector(".cmplz-backdrop");
    state.manageButton = document.querySelector(".cmplz-manage-consent");
  }

  function bindEvents() {
    if (!state.banner) {
      return;
    }

    const acceptButton = state.banner.querySelector(".cmplz-accept");
    const denyButton = state.banner.querySelector(".cmplz-deny");
    const viewPreferencesButton = state.banner.querySelector(".cmplz-view-preferences");
    const savePreferencesButton = state.banner.querySelector(".cmplz-save-preferences");
    const closeButton = state.banner.querySelector(".cmplz-close");
    const categoryInputs = Array.from(state.banner.querySelectorAll(".cmplz-consent-checkbox"));

    if (state.manageButton) {
      state.manageButton.addEventListener("click", function () {
        openBanner(true);
      });
    }

    if (state.backdrop) {
      state.backdrop.addEventListener("click", function () {
        dismissBanner();
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        dismissBanner();
      });
    }

    if (acceptButton) {
      acceptButton.addEventListener("click", function () {
        applyConsent("accept", {
          preferences: true,
          statistics: true,
          marketing: true,
        });
      });
    }

    if (denyButton) {
      denyButton.addEventListener("click", function () {
        applyConsent("deny", {
          preferences: false,
          statistics: false,
          marketing: false,
        });
      });
    }

    if (viewPreferencesButton) {
      viewPreferencesButton.addEventListener("click", function () {
        state.banner.classList.add("is-preferences-view");
        focusPrimaryAction();
      });
    }

    if (savePreferencesButton) {
      savePreferencesButton.addEventListener("click", function () {
        applyConsent("custom", {
          preferences: readCheckboxValue("preferences"),
          statistics: readCheckboxValue("statistics"),
          marketing: readCheckboxValue("marketing"),
        });
      });
    }

    categoryInputs.forEach(function (input) {
      if (input.name === "functional") {
        input.checked = true;
        input.disabled = true;
      }
    });

    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("pageshow", syncUi);
  }

  function handleKeydown(event) {
    if (!state.isOpen || !state.banner) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      dismissBanner();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableElements(state.banner);
    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openBanner(showPreferences) {
    if (!state.banner || !state.backdrop) {
      return;
    }

    state.lastFocusedElement = document.activeElement;
    state.banner.classList.toggle("is-preferences-view", Boolean(showPreferences));
    state.banner.classList.add("cmplz-show");
    state.backdrop.classList.add("cmplz-show");
    state.isOpen = true;
    document.body.classList.add("cmplz-banner-active");
    showManageButton();
    focusPrimaryAction();
  }

  function dismissBanner() {
    if (!state.banner || !state.backdrop) {
      return;
    }

    state.banner.classList.remove("cmplz-show");
    state.backdrop.classList.remove("cmplz-show");
    state.isOpen = false;
    document.body.classList.remove("cmplz-banner-active");

    if (!hasChoice()) {
      try {
        window.sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
      } catch (error) {
        // Ignore storage limitations and just close the banner.
      }
    }

    showManageButton();
    returnFocus();
  }

  function returnFocus() {
    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
      state.lastFocusedElement.focus();
      return;
    }

    if (state.manageButton) {
      state.manageButton.focus();
    }
  }

  function focusPrimaryAction() {
    if (!state.banner) {
      return;
    }

    const selector = state.banner.classList.contains("is-preferences-view")
      ? ".cmplz-save-preferences"
      : ".cmplz-accept";
    const target = state.banner.querySelector(selector) || state.banner.querySelector(".cmplz-close");
    if (target) {
      window.setTimeout(function () {
        target.focus();
      }, 30);
    }
  }

  function showManageButton() {
    if (!state.manageButton) {
      return;
    }

    const shouldHide = !hasChoice() && !isSessionDismissed();
    state.manageButton.classList.toggle("cmplz-hidden", shouldHide);
  }

  function applyConsent(status, categories) {
    state.consent = {
      status: status,
      functional: true,
      preferences: Boolean(categories.preferences),
      statistics: Boolean(categories.statistics),
      marketing: Boolean(categories.marketing),
      version: CONSENT_VERSION,
    };

    setCookie(COOKIE_STATE, state.consent.status, COOKIE_DAYS);
    setCookie(COOKIE_LEVELS, serializeLevels(state.consent), COOKIE_DAYS);
    clearSessionDismiss();
    applyStorageSideEffects(state.consent);
    syncUi();
    dismissBanner();
    dispatchConsentEvent("nx3:consent-updated");
  }

  function resetConsent() {
    deleteCookie(COOKIE_STATE);
    deleteCookie(COOKIE_LEVELS);
    clearSessionDismiss();
    state.consent = cloneConsent(DEFAULT_CONSENT);
    syncUi();
    openBanner(true);
    dispatchConsentEvent("nx3:consent-updated");
  }

  function syncUi() {
    if (!state.banner) {
      return;
    }

    CATEGORY_KEYS.concat(["functional"]).forEach(function (category) {
      const input = state.banner.querySelector('[name="' + category + '"]');
      if (!input) {
        return;
      }

      input.checked = Boolean(state.consent[category]);
      if (category === "functional") {
        input.checked = true;
      }
    });

    state.banner.classList.remove("is-preferences-view");
    showManageButton();
  }

  function shouldShowOnLoad() {
    return !hasChoice() && !isSessionDismissed();
  }

  function hasChoice() {
    return state.consent.status !== "unset";
  }

  function canUse(category) {
    if (category === "functional") {
      return true;
    }

    return Boolean(state.consent[category]);
  }

  function getConsent() {
    return cloneConsent(state.consent);
  }

  function readConsent() {
    const status = getCookie(COOKIE_STATE);
    const levels = parseLevels(getCookie(COOKIE_LEVELS));

    if (!status) {
      return cloneConsent(DEFAULT_CONSENT);
    }

    if (status === "accept") {
      return {
        status: status,
        functional: true,
        preferences: true,
        statistics: true,
        marketing: true,
        version: CONSENT_VERSION,
      };
    }

    if (status === "deny") {
      return {
        status: status,
        functional: true,
        preferences: false,
        statistics: false,
        marketing: false,
        version: CONSENT_VERSION,
      };
    }

    return {
      status: "custom",
      functional: true,
      preferences: levels.preferences,
      statistics: levels.statistics,
      marketing: levels.marketing,
      version: levels.version || CONSENT_VERSION,
    };
  }

  function parseLevels(rawValue) {
    const fallback = {
      preferences: false,
      statistics: false,
      marketing: false,
      version: CONSENT_VERSION,
    };

    if (!rawValue) {
      return fallback;
    }

    return rawValue.split(",").reduce(function (result, token) {
      const parts = token.split(":");
      if (parts.length !== 2) {
        return result;
      }

      const key = parts[0];
      const value = parts[1];

      if (key === "v") {
        result.version = value || CONSENT_VERSION;
        return result;
      }

      if (key === "p") {
        result.preferences = value === "1";
        return result;
      }

      if (key === "s") {
        result.statistics = value === "1";
        return result;
      }

      if (key === "m") {
        result.marketing = value === "1";
      }

      return result;
    }, fallback);
  }

  function serializeLevels(consent) {
    return [
      "p:" + (consent.preferences ? "1" : "0"),
      "s:" + (consent.statistics ? "1" : "0"),
      "m:" + (consent.marketing ? "1" : "0"),
      "v:" + CONSENT_VERSION,
    ].join(",");
  }

  function applyStorageSideEffects(consent) {
    try {
      if (!consent.preferences) {
        window.localStorage.removeItem("nx3.heroVariant");
      }

      if (!consent.statistics) {
        window.localStorage.removeItem("nx3.sessionId");
        window.localStorage.removeItem("nx3.eventLog");
      }
    } catch (error) {
      return;
    }
  }

  function readCheckboxValue(category) {
    if (!state.banner) {
      return false;
    }

    const input = state.banner.querySelector('[name="' + category + '"]');
    return input ? input.checked : false;
  }

  function buildMarkup() {
    return (
      '<div class="cmplz-backdrop" aria-hidden="true"></div>' +
      '<div class="cmplz-cookiebanner" aria-modal="true" role="dialog" aria-labelledby="cmplz-header-title" aria-describedby="cmplz-message">' +
      '  <div class="cmplz-header">' +
      '    <a class="cmplz-logo" href="index.html" aria-label="Zur NX3 Startseite">' +
      '      <img src="assets/nx3-logo.png" alt="NX3 Logo" loading="lazy" />' +
      "    </a>" +
      '    <p class="cmplz-title" id="cmplz-header-title">Einwilligung verwalten</p>' +
      '    <button class="cmplz-close" type="button" aria-label="Dialog schließen">' +
      '      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z"></path></svg>' +
      "    </button>" +
      "  </div>" +
      '  <div class="cmplz-divider"></div>' +
      '  <div class="cmplz-body">' +
      '    <p class="cmplz-message" id="cmplz-message">Wir verwenden Cookies und ähnliche Technologien, um diese Website stabil bereitzustellen, Nutzungsdaten auszuwerten und optionale Inhalte nur mit Ihrer Zustimmung zu aktivieren. Ihre Auswahl können Sie jederzeit wieder ändern.</p>' +
      '    <div class="cmplz-categories">' +
      buildCategory("functional", "Funktional", true, "Erforderlich für Navigation, Formulare und die sichere technische Bereitstellung dieser Website.") +
      buildCategory("preferences", "Präferenzen", false, "Speichert Entscheidungen und Darstellungsoptionen, damit die Seite bei späteren Besuchen konsistent reagiert.") +
      buildCategory("statistics", "Statistiken", false, "Hilft uns zu verstehen, welche Inhalte genutzt werden und wo wir die Seite gezielt verbessern sollten.") +
      buildCategory("marketing", "Marketing", false, "Wird nur benötigt, wenn später Marketing- oder externe Kampagnenfunktionen ergänzt werden.") +
      "    </div>" +
      "  </div>" +
      '  <div class="cmplz-divider"></div>' +
      '  <div class="cmplz-buttons">' +
      '    <button class="cmplz-btn cmplz-accept" type="button">Akzeptieren</button>' +
      '    <button class="cmplz-btn cmplz-deny" type="button">Ablehnen</button>' +
      '    <button class="cmplz-btn cmplz-view-preferences" type="button">Einstellungen ansehen</button>' +
      '    <button class="cmplz-btn cmplz-save-preferences" type="button">Einstellungen speichern</button>' +
      "  </div>" +
      '  <div class="cmplz-documents cmplz-links">' +
      '    <a class="cmplz-link" href="datenschutz.html">Datenschutz</a>' +
      '    <a class="cmplz-link" href="impressum.html">Impressum</a>' +
      "  </div>" +
      "</div>" +
      '<div id="cmplz-manage-consent"><button class="cmplz-btn cmplz-manage-consent cmplz-hidden" type="button">Einwilligung verwalten</button></div>'
    );
  }

  function buildCategory(key, label, alwaysActive, description) {
    const controlMarkup = alwaysActive
      ? "Immer aktiv"
      : '<span class="cmplz-banner-checkbox"><input class="cmplz-consent-checkbox" type="checkbox" name="' +
        key +
        '" id="cmplz-' +
        key +
        '-toggle" /><label class="cmplz-label" for="cmplz-' +
        key +
        '-toggle"><span class="cmplz-screen-reader">' +
        label +
        "</span></label></span>";

    return (
      '<details class="cmplz-category cmplz-' +
      key +
      '"' +
      (alwaysActive ? " open" : "") +
      ">" +
      "  <summary>" +
      '    <span class="cmplz-category-header">' +
      '      <span class="cmplz-category-title">' +
      label +
      "</span>" +
      '      <span class="' +
      (alwaysActive ? "cmplz-always-active" : "cmplz-toggle-slot") +
      '">' +
      controlMarkup +
      "</span>" +
      '      <span class="cmplz-icon" aria-hidden="true">' +
      '        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 15.5 5 8.5l1.4-1.4 5.6 5.6 5.6-5.6L19 8.5l-7 7Z"></path></svg>' +
      "      </span>" +
      "    </span>" +
      "  </summary>" +
      '  <div class="cmplz-description">' +
      description +
      "  </div>" +
      "</details>"
    );
  }

  function dispatchConsentEvent(name) {
    window.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          consent: getConsent(),
        },
      })
    );
  }

  function getFocusableElements(scope) {
    return Array.from(
      scope.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (element) {
      return !element.hasAttribute("hidden");
    });
  }

  function getCookie(name) {
    const pattern = "(?:^|; )" + escapeCookieName(name) + "=([^;]*)";
    const match = document.cookie.match(new RegExp(pattern));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      "; expires=" +
      expires +
      "; path=/; SameSite=Lax";
  }

  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
  }

  function escapeCookieName(name) {
    return name.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
  }

  function isSessionDismissed() {
    try {
      return window.sessionStorage.getItem(SESSION_DISMISS_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function clearSessionDismiss() {
    try {
      window.sessionStorage.removeItem(SESSION_DISMISS_KEY);
    } catch (error) {
      return;
    }
  }

  function cloneConsent(consent) {
    return {
      status: consent.status,
      functional: Boolean(consent.functional),
      preferences: Boolean(consent.preferences),
      statistics: Boolean(consent.statistics),
      marketing: Boolean(consent.marketing),
      version: consent.version || CONSENT_VERSION,
    };
  }
})();
