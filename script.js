(function () {
  const config = window.NX3_CONFIG || {};
  const variants = {
    v1: {
      label: "Hero v1",
      headline:
        '<span class="hero-line hero-line-primary">Prüfung automatisieren</span><span class="hero-line hero-accent">Risiken früher erkennen</span>',
      subheadline:
        "NX3 unterstützt Logistikunternehmen und Verlader dabei, Carrier, Transportunternehmen und Transportdienstleister datenbasiert zu prüfen und fundierter freizugeben.",
      body: "",
      bullets: [
        "80.000+ Carrier-Datensätze als Startpunkt",
        "North Data, VIES, BALM, Register und Versicherungsquellen",
        "Dokumentenanalyse, Risk Flags und Freigabeunterstützung",
      ],
      primaryCta: "Demo anfragen",
      secondaryCta: "Kontakt aufnehmen",
    },
    v2: {
      label: "Hero v2",
      headline: "Transportunternehmen schneller prüfen und fundierter freigeben.",
      subheadline:
        "Arbeiten Sie nicht bei null: mit über 80.000 Carrier-Datensätzen, angebundenen Prüfquellen und KI-gestützter Analyse für zentrale Nachweise.",
      body:
        "NX3 verdichtet Datenbasis, Registerinformationen und Dokumentenprüfung zu einer Entscheidungsgrundlage für operative Geschwindigkeit und Risikokontrolle.",
      bullets: [
        "Bestehende Datenbasis statt immer wieder neue Einzelrecherche",
        "Abgestimmt auf Carrier Management, Procurement und Operations",
        "Screens für Dokumente, Qualifikationen und Carrier-Profile direkt im Prozess",
      ],
      primaryCta: "Erstgespräch vereinbaren",
      secondaryCta: "So funktioniert NX3",
    },
    v3: {
      label: "Hero v3",
      headline: "Ein Prüfprozess für Transportdienstleister, der mit Ihrem Netzwerk mitwächst.",
      subheadline:
        "NX3 verbindet Carrier-Daten, Registerabfragen, Dokumentenprüfung und Freigabeunterstützung in einem durchgängigen Workflow.",
      body:
        "Wenn neue Dienstleister schnell bewertet werden müssen und Bestandscarrier nicht aus dem Blick geraten dürfen, bringt NX3 Struktur und Tempo in denselben Prozess.",
      bullets: [
        "Ein Freigabeprozess für Neu- und Bestandsdienstleister",
        "Dokumente, Quellen und Freigabelogik in einem Datenfluss",
        "Fundiertere Entscheidungen ohne Medienbruch zwischen Listen, Mails und Dokumenten",
      ],
      primaryCta: "Jetzt anfragen",
      secondaryCta: "Prüfung automatisieren",
    },
  };

  const variantKeys = Object.keys(variants);
  const params = new URLSearchParams(window.location.search);
  const previewMode = params.get("preview") === "1" || config.previewMode === true;
  const storageKeys = {
    session: "nx3.sessionId",
    heroVariant: "nx3.heroVariant",
    events: "nx3.eventLog",
  };
  const state = {
    heroVariant: null,
    formStarted: false,
    seenSections: new Set(),
    scrollMilestones: new Set(),
    eventFeed: loadStoredEvents(),
    ephemeralSessionId: null,
    pageViewTracked: false,
  };

  function hasConsent(category) {
    const consentApi = window.NX3Consent;

    if (category === "functional") {
      return true;
    }

    if (!consentApi || typeof consentApi.canUse !== "function") {
      return false;
    }

    return consentApi.canUse(category);
  }

  function canStorePreferences() {
    return hasConsent("preferences");
  }

  function canTrackStatistics() {
    return hasConsent("statistics");
  }

  const tracker = {
    log(eventName, payload) {
      if (!canTrackStatistics()) {
        return;
      }

      const event = {
        event: eventName,
        ts: new Date().toISOString(),
        page: window.location.pathname,
        sessionId: getSessionId(),
        heroVariant: state.heroVariant,
        ...payload,
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(event);
      state.eventFeed.unshift(event);
      state.eventFeed = state.eventFeed.slice(0, 20);
      persistEvents(state.eventFeed);
      renderEventFeed();

      if (config.analyticsEndpoint) {
        const body = JSON.stringify(event);
        if (navigator.sendBeacon) {
          navigator.sendBeacon(config.analyticsEndpoint, body);
        } else {
          fetch(config.analyticsEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          }).catch(function () {
            return null;
          });
        }
      } else {
        console.info("[NX3 track]", event);
      }

      if (eventName === "page_view") {
        state.pageViewTracked = true;
      }
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    initHeroBackground();
    initVariant();
    initMenu();
    initTrackedClicks();
    initSectionObservers();
    initScrollDepth();
    initWorkflowStory();
    initBenefitStory();
    initFaq();
    initForm();
    initPaymentButton();
    initRevealEffects();
    initVariantLab();
    initConsentSync();
    logPageView();
  });

  function initVariant() {
    if (!previewMode && !params.get("variant")) {
      applyVariant("v1", "default");
      return;
    }

    const fromQuery = params.get("variant");
    const stored = canStorePreferences() ? window.localStorage.getItem(storageKeys.heroVariant) : null;
    const fallback = assignVariantFromSession(getSessionId());
    const selected = variants[fromQuery] ? fromQuery : variants[stored] ? stored : fallback;
    applyVariant(selected, fromQuery ? "query" : stored ? "stored" : "session");
  }

  function initHeroBackground() {
    const shell = document.querySelector(".nx3-shell");
    if (!shell) {
      return;
    }

    const heroCandidates = [
      "assets/HeroNX3.png",
      "assets/HeroNx3.png",
      "assets/Heronx3.png",
      "assets/heronx3.png",
      "assets/nx3-hero-image.png",
    ];

    tryNextHeroImage(0);

    function tryNextHeroImage(index) {
      if (index >= heroCandidates.length) {
        return;
      }

      const src = heroCandidates[index];
      const image = new Image();
      image.onload = function () {
        shell.style.setProperty("--hero-background-image", 'url("' + src + '")');
      };
      image.onerror = function () {
        tryNextHeroImage(index + 1);
      };
      image.src = src;
    }
  }

  function applyVariant(key, source) {
    const variant = variants[key];
    if (!variant) {
      return;
    }

    state.heroVariant = key;
    if (canStorePreferences()) {
      window.localStorage.setItem(storageKeys.heroVariant, key);
    }

    setHTML("#hero-headline", variant.headline);
    setText("#hero-subheadline", variant.subheadline);
    setText("#hero-body", variant.body);
    setText("#hero-primary-cta", variant.primaryCta);
    setText("#hero-secondary-cta", variant.secondaryCta);

    const list = document.querySelector("#hero-bullets");
    if (list) {
      list.innerHTML = "";
      variant.bullets.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    }

    document.body.setAttribute("data-hero-variant", key);
    const label = document.querySelector("#active-variant-label");
    if (label) {
      label.textContent = variant.label;
    }

    document.querySelectorAll("[data-set-variant]").forEach(function (button) {
      const isActive = button.getAttribute("data-set-variant") === key;
      button.classList.toggle("active", isActive);
    });

    tracker.log("experiment_exposure", {
      experimentId: "hero_message",
      variantId: key,
      source,
    });
  }

  function initMenu() {
    const toggle = document.querySelector("#menu-toggle");
    const nav = document.querySelector("#site-nav");
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("menu-open", !expanded);
      tracker.log("menu_toggle", { open: !expanded });
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  function initTrackedClicks() {
    document.querySelectorAll("[data-track]").forEach(function (element) {
      element.addEventListener("click", function () {
        tracker.log("interaction_click", {
          target: element.getAttribute("data-track"),
          text: element.textContent.trim(),
        });
      });
    });
  }

  function initSectionObservers() {
    const sections = document.querySelectorAll("[data-section]");
    if (!sections.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          const sectionId = entry.target.getAttribute("data-section");
          if (state.seenSections.has(sectionId)) {
            return;
          }
          state.seenSections.add(sectionId);
          tracker.log("section_view", { sectionId: sectionId });
        });
      },
      {
        threshold: 0.35,
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initScrollDepth() {
    window.addEventListener(
      "scroll",
      throttle(function () {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable <= 0) {
          return;
        }

        const percent = Math.round((window.scrollY / scrollable) * 100);
        [25, 50, 75, 100].forEach(function (milestone) {
          if (percent >= milestone && !state.scrollMilestones.has(milestone)) {
            state.scrollMilestones.add(milestone);
            tracker.log("scroll_depth", { percent: milestone });
          }
        });
      }, 200),
      { passive: true }
    );
  }

  function initBenefitStory() {
    const steps = document.querySelectorAll("[data-benefit-step]");
    const visuals = document.querySelectorAll("[data-visual]");
    if (!steps.length || !visuals.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          const activeStep = entry.target.getAttribute("data-benefit-step");
          steps.forEach(function (step) {
            step.classList.toggle("active", step.getAttribute("data-benefit-step") === activeStep);
          });
          visuals.forEach(function (visual) {
            visual.classList.toggle("active", visual.getAttribute("data-visual") === activeStep);
          });
          tracker.log("benefit_focus", { state: activeStep });
        });
      },
      {
        threshold: 0.55,
      }
    );

    steps.forEach(function (step) {
      observer.observe(step);
    });
  }

  function initWorkflowStory() {
    const sceneMeta = {
      1: {
        title: "Unternehmen identifiziert",
        status: "Schritt 1 von 6",
      },
      2: {
        title: "Datenquellen abgeglichen",
        status: "Schritt 2 von 6",
      },
      3: {
        title: "Dokumente analysiert",
        status: "Schritt 3 von 6",
      },
      4: {
        title: "Risiken bewertet",
        status: "Schritt 4 von 6",
      },
      5: {
        title: "Freigabe empfohlen",
        status: "Schritt 5 von 6",
      },
      6: {
        title: "Prüfprozess skaliert",
        status: "Schritt 6 von 6",
      },
    };

    const storyLayout = document.querySelector(".workflow-story-layout");
    const panelColumn = document.querySelector(".workflow-panel-column");
    const simShell = document.querySelector("#workflow-sim-shell");
    const simStage = document.querySelector(".workflow-sim-stage");
    const title = document.querySelector("#workflow-scene-title");
    const status = document.querySelector("#workflow-scene-status");
    const liveRegion = document.querySelector("#workflow-live-region");
    const steps = Array.from(document.querySelectorAll(".workflow-step[data-scene]"));
    const progressButtons = Array.from(document.querySelectorAll(".workflow-progress-step[data-progress]"));
    const milestones = Array.from(document.querySelectorAll(".workflow-milestone[data-milestone]"));
    const scenePanels = Array.from(document.querySelectorAll(".workflow-scene-panel"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactStory = window.matchMedia("(max-width: 1040px)");
    let activeScene = 0;
    let rafId = 0;

    if (!storyLayout || !panelColumn || !simShell || !simStage || !steps.length) {
      return;
    }

    function setScene(scene, announce, source) {
      const sceneNumber = Number(scene);
      const meta = sceneMeta[sceneNumber];

      if (!meta || sceneNumber === activeScene) {
        return;
      }

      activeScene = sceneNumber;
      simShell.setAttribute("data-active-scene", String(sceneNumber));

      if (title) {
        title.textContent = meta.title;
      }

      if (status) {
        status.textContent = meta.status;
      }

      steps.forEach(function (step) {
        step.classList.toggle("is-active", Number(step.dataset.scene) === sceneNumber);
      });

      progressButtons.forEach(function (button) {
        const buttonScene = Number(button.dataset.progress);
        button.classList.toggle("is-active", buttonScene === sceneNumber);
        button.classList.toggle("is-complete", buttonScene < sceneNumber);
      });

      milestones.forEach(function (item) {
        const milestoneScene = Number(item.dataset.milestone);
        item.classList.toggle("is-active", milestoneScene === sceneNumber);
        item.classList.toggle("is-complete", milestoneScene < sceneNumber);
      });

      if (announce && liveRegion) {
        liveRegion.textContent = meta.title + ". " + meta.status + ".";
      }

      tracker.log("workflow_scene_focus", {
        scene: sceneNumber,
        label: meta.title,
        source: source || "scroll",
      });
    }

    function findBestStep() {
      const focusLine = compactStory.matches ? window.innerHeight * 0.72 : window.innerHeight * 0.42;
      let bestStep = steps[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      steps.forEach(function (step) {
        const rect = step.getBoundingClientRect();
        const stepCenter = rect.top + rect.height / 2;
        const distance = Math.abs(stepCenter - focusLine);

        if (rect.top <= focusLine && rect.bottom >= focusLine) {
          bestStep = step;
          bestDistance = -1;
          return;
        }

        if (distance < bestDistance) {
          bestDistance = distance;
          bestStep = step;
        }
      });

      return bestStep;
    }

    function syncBestVisibleStep() {
      const bestStep = findBestStep();
      if (bestStep) {
        setScene(bestStep.dataset.scene, true, "scroll");
      }
    }

    function syncStageHeight() {
      let maxHeight = 0;

      scenePanels.forEach(function (panel) {
        maxHeight = Math.max(maxHeight, panel.scrollHeight);
      });

      if (maxHeight > 0) {
        simStage.style.height = maxHeight + "px";
      }
    }

    function resetPinnedPanel() {
      simShell.classList.remove("is-fixed", "is-anchored");
      simShell.style.left = "";
      simShell.style.right = "";
      simShell.style.width = "";
      simShell.style.top = "";
    }

    function syncPinnedPanel() {
      resetPinnedPanel();
    }

    function requestSync() {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(function () {
        rafId = 0;
        syncStageHeight();
        syncPinnedPanel();
        syncBestVisibleStep();
      });
    }

    setScene(1, false, "init");

    progressButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const scene = Number(button.dataset.progress);
        const target = steps.find(function (step) {
          return Number(step.dataset.scene) === scene;
        });

        setScene(scene, true, "progress");

        if (target) {
          target.scrollIntoView({
            behavior: reduceMotion.matches ? "auto" : "smooth",
            block: compactStory.matches ? "start" : "center",
          });
        }
      });
    });

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    window.addEventListener("load", requestSync);
    requestSync();

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(function () {
      requestSync();
    });

    steps.forEach(function (step) {
      observer.observe(step);
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item, index) {
      const trigger = item.querySelector(".faq-trigger");
      if (!trigger) {
        return;
      }

      trigger.addEventListener("click", function () {
        const willOpen = !item.classList.contains("is-open");
        document.querySelectorAll(".faq-item").forEach(function (faq) {
          faq.classList.remove("is-open");
          const faqTrigger = faq.querySelector(".faq-trigger");
          if (faqTrigger) {
            faqTrigger.setAttribute("aria-expanded", "false");
          }
        });

        if (willOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }

        tracker.log("faq_toggle", {
          index: index + 1,
          open: willOpen,
          question: trigger.textContent.trim(),
        });
      });
    });
  }

  function initForm() {
    const form = document.querySelector("#demo-form");
    const feedback = document.querySelector("#form-feedback");
    if (!form || !feedback) {
      return;
    }

    form.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        if (state.formStarted) {
          return;
        }
        state.formStarted = true;
        tracker.log("form_start", { formId: "demo-form" });
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      tracker.log("form_submit", {
        formId: "demo-form",
        company: payload.company || "",
        role: payload.role || "",
        hasMessage: Boolean(payload.message),
      });

      if (config.leadEndpoint) {
        feedback.textContent = "Anfrage wird gesendet...";
        fetch(config.leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            sessionId: getSessionId(),
            heroVariant: state.heroVariant,
          }),
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error("Lead endpoint rejected request");
            }
            feedback.textContent = "Danke. Die Anfrage wurde übermittelt.";
            form.reset();
            state.formStarted = false;
          })
          .catch(function () {
            feedback.textContent = "Die Demo-Anfrage ist lokal vorbereitet, aber noch nicht an ein Lead-Backend angeschlossen.";
          });
        return;
      }

      feedback.textContent = "Die Demo-Anfrage ist lokal vorbereitet. Für den Live-Betrieb fehlt nur noch das Lead-Backend.";
      form.reset();
      state.formStarted = false;
    });
  }

  function initPaymentButton() {
    const button = document.querySelector("#payment-button");
    if (!button) {
      return;
    }

    if (config.paymentLabel) {
      button.textContent = config.paymentLabel;
    }

    button.addEventListener("click", function (event) {
      tracker.log("payment_path_click", {
        configured: Boolean(config.paymentUrl),
      });

      if (!config.paymentUrl) {
        return;
      }

      event.preventDefault();
      window.location.href = config.paymentUrl;
    });
  }

  function initRevealEffects() {
    const targets = document.querySelectorAll(
      ".pain-card, .benefit-card, .feature-card, .process-card, .audience-panel, .compare-card, .trust-item"
    );
    if (!targets.length || !("IntersectionObserver" in window)) {
      return;
    }

    targets.forEach(function (element) {
      element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    targets.forEach(function (element) {
      observer.observe(element);
    });
  }

  function initVariantLab() {
    const panel = document.querySelector("#variant-lab");
    if (!panel || !previewMode) {
      return;
    }

    panel.hidden = false;
    panel.querySelectorAll("[data-set-variant]").forEach(function (button) {
      button.addEventListener("click", function () {
        const variantId = button.getAttribute("data-set-variant");
        applyVariant(variantId, "preview_lab");
      });
    });

    renderEventFeed();
  }

  function renderEventFeed() {
    const feed = document.querySelector("#event-feed");
    if (!feed || !previewMode) {
      return;
    }

    feed.innerHTML = "";
    state.eventFeed.slice(0, 12).forEach(function (event) {
      const item = document.createElement("li");
      item.textContent = event.event + " - " + summariseEvent(event);
      feed.appendChild(item);
    });
  }

  function summariseEvent(event) {
    if (event.variantId) {
      return event.variantId;
    }
    if (event.sectionId) {
      return event.sectionId;
    }
    if (event.target) {
      return event.target;
    }
    if (event.percent) {
      return event.percent + "%";
    }
    if (event.state) {
      return event.state;
    }
    if (event.question) {
      return event.question;
    }
    return new Date(event.ts).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function initConsentSync() {
    window.addEventListener("nx3:consent-updated", function (event) {
      const consent = event.detail && event.detail.consent ? event.detail.consent : null;

      if (!consent) {
        return;
      }

      if (!consent.preferences) {
        try {
          window.localStorage.removeItem(storageKeys.heroVariant);
        } catch (error) {
          // Ignore storage limitations.
        }
      } else if (state.heroVariant) {
        try {
          window.localStorage.setItem(storageKeys.heroVariant, state.heroVariant);
        } catch (error) {
          // Ignore storage limitations.
        }
      }

      if (!consent.statistics) {
        state.eventFeed = [];
        state.pageViewTracked = false;

        try {
          window.localStorage.removeItem(storageKeys.session);
          window.localStorage.removeItem(storageKeys.events);
        } catch (error) {
          // Ignore storage limitations.
        }

        renderEventFeed();
        return;
      }

      state.eventFeed = loadStoredEvents();
      renderEventFeed();

      if (!state.pageViewTracked) {
        logPageView();
      }
    });
  }

  function logPageView() {
    tracker.log("page_view", {
      title: document.title,
      previewMode,
    });
  }

  function getSessionId() {
    if (!canTrackStatistics()) {
      if (!state.ephemeralSessionId) {
        state.ephemeralSessionId =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : "nx3-" + Math.random().toString(16).slice(2) + Date.now().toString(16);
      }
      return state.ephemeralSessionId;
    }

    let sessionId = window.localStorage.getItem(storageKeys.session);
    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "nx3-" + Math.random().toString(16).slice(2) + Date.now().toString(16);
      window.localStorage.setItem(storageKeys.session, sessionId);
    }
    return sessionId;
  }

  function assignVariantFromSession(sessionId) {
    const hash = sessionId.split("").reduce(function (total, char) {
      return (total * 31 + char.charCodeAt(0)) >>> 0;
    }, 7);
    return variantKeys[hash % variantKeys.length];
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  }

  function setHTML(selector, value) {
    const node = document.querySelector(selector);
    if (node) {
      node.innerHTML = value;
    }
  }

  function loadStoredEvents() {
    if (!canTrackStatistics()) {
      return [];
    }

    try {
      return JSON.parse(window.localStorage.getItem(storageKeys.events) || "[]");
    } catch (error) {
      return [];
    }
  }

  function persistEvents(events) {
    if (!canTrackStatistics()) {
      return;
    }

    try {
      window.localStorage.setItem(storageKeys.events, JSON.stringify(events));
    } catch (error) {
      return;
    }
  }

  function throttle(callback, delay) {
    let lastRun = 0;
    let timeoutId = null;

    return function throttled() {
      const now = Date.now();
      const remaining = delay - (now - lastRun);
      const context = this;
      const args = arguments;

      if (remaining <= 0) {
        lastRun = now;
        callback.apply(context, args);
        return;
      }

      if (timeoutId) {
        return;
      }

      timeoutId = window.setTimeout(function () {
        lastRun = Date.now();
        timeoutId = null;
        callback.apply(context, args);
      }, remaining);
    };
  }
})();
