(function () {
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

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initFaq();
    initScrolly();
  });

  function initMenu() {
    const toggle = document.querySelector("#menu-toggle");
    const nav = document.querySelector("#site-nav");

    if (!toggle || !nav) {
      return;
    }

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }

    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("menu-open", !expanded);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  function initFaq() {
    const items = Array.from(document.querySelectorAll(".faq-item"));

    items.forEach(function (item, index) {
      const button = item.querySelector(".faq-trigger");
      const answer = item.querySelector(".faq-answer");

      if (!button || !answer) {
        return;
      }

      if (!answer.id) {
        answer.id = "faq-answer-" + (index + 1);
      }

      button.setAttribute("aria-controls", answer.id);
      button.setAttribute("aria-expanded", String(item.classList.contains("is-open")));

      button.addEventListener("click", function () {
        const shouldOpen = !item.classList.contains("is-open");

        items.forEach(function (otherItem) {
          const otherButton = otherItem.querySelector(".faq-trigger");
          otherItem.classList.remove("is-open");
          if (otherButton) {
            otherButton.setAttribute("aria-expanded", "false");
          }
        });

        if (shouldOpen) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initScrolly() {
    const scrollyLayout = document.querySelector(".scrolly-layout");
    const panelColumn = document.querySelector(".panel-column");
    const simShell = document.querySelector("#sim-shell");
    const simStage = document.querySelector(".sim-stage");
    const title = document.querySelector("#sim-scene-title");
    const status = document.querySelector("#sim-scene-status");
    const liveRegion = document.querySelector("#sim-live-region");
    const steps = Array.from(document.querySelectorAll(".story-step[data-scene]"));
    const progressButtons = Array.from(document.querySelectorAll(".sim-progress-step[data-progress]"));
    const milestones = Array.from(document.querySelectorAll(".milestone[data-milestone]"));
    const scenePanels = Array.from(document.querySelectorAll(".scene-panel"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeScene = 0;
    let rafId = 0;

    if (!scrollyLayout || !panelColumn || !simShell || !simStage || !steps.length) {
      return;
    }

    function setScene(scene, announce) {
      const sceneNumber = Number(scene);
      const meta = sceneMeta[sceneNumber];

      if (!meta) {
        return;
      }

      if (sceneNumber === activeScene) {
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
    }

    setScene(1, false);

    progressButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const scene = Number(button.dataset.progress);
        const target = steps.find(function (step) {
          return Number(step.dataset.scene) === scene;
        });

        setScene(scene, true);

        if (target) {
          target.scrollIntoView({
            behavior: reduceMotion.matches ? "auto" : "smooth",
            block: "center",
          });
        }
      });
    });

    function findBestStep() {
      const focusLine = window.innerHeight * 0.42;
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
        setScene(bestStep.dataset.scene, true);
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
      if (window.innerWidth <= 980 || window.getComputedStyle(panelColumn).display === "none") {
        resetPinnedPanel();
        return;
      }

      const topOffset = 118;
      const layoutRect = scrollyLayout.getBoundingClientRect();
      const columnRect = panelColumn.getBoundingClientRect();
      const panelHeight = simShell.offsetHeight;
      const shouldPin = layoutRect.top <= topOffset;
      const shouldAnchor = layoutRect.bottom <= topOffset + panelHeight;

      if (!shouldPin) {
        resetPinnedPanel();
        return;
      }

      if (shouldAnchor) {
        simShell.classList.remove("is-fixed");
        simShell.classList.add("is-anchored");
        simShell.style.left = "";
        simShell.style.right = "";
        simShell.style.width = "";
        simShell.style.top = "";
        return;
      }

      simShell.classList.remove("is-anchored");
      simShell.classList.add("is-fixed");
      simShell.style.top = topOffset + "px";
      simShell.style.left = columnRect.left + "px";
      simShell.style.width = columnRect.width + "px";
      simShell.style.right = "auto";
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
})();
