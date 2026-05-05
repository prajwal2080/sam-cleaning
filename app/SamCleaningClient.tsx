"use client";

import { useEffect } from "react";

type FlatpickrInstance = {
  set: (key: string, value: unknown) => void;
  redraw: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    flatpickr?: (el: Element, opts: Record<string, unknown>) => FlatpickrInstance;
    ICAL?: any;
  }
}

export default function SamCleaningClient() {
  useEffect(() => {
    const slides = Array.from(document.querySelectorAll<HTMLElement>(".slide"));
    const nextBtn = document.querySelector<HTMLButtonElement>(
      ".slider-btn.next"
    );
    const prevBtn = document.querySelector<HTMLButtonElement>(
      ".slider-btn.prev"
    );
    const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
    const mainNav = document.querySelector<HTMLElement>(".main-nav");
    const revealSections = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".about-showcase, .services-section, .estimate-cta, .request-estimate, .pricing-section, .specialists-section, .testimonials-section, .site-footer"
      )
    );

    let activeIndex = 0;
    let autoTimer: number | undefined;
    let sectionObserver: IntersectionObserver | null = null;
    const cleanupFns: Array<() => void> = [];

    function showSlide(index: number) {
      if (slides.length === 0) return;
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === activeIndex);
      });
    }

    function startAutoSlide() {
      if (autoTimer) window.clearInterval(autoTimer);
      autoTimer = window.setInterval(() => {
        showSlide(activeIndex + 1);
      }, 6000);
    }

    function startCounterAnimation(section: HTMLElement | null) {
      if (!section || section.dataset.counted === "true") {
        return;
      }

      const counters = Array.from(
        section.querySelectorAll<HTMLElement>(".counter-value")
      );
      if (counters.length === 0) {
        return;
      }

      section.dataset.counted = "true";
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      counters.forEach((counter) => {
        const target = Number.parseInt(counter.dataset.target || "0", 10);
        const duration = Number.parseInt(counter.dataset.duration || "1800", 10);

        if (!Number.isFinite(target) || target < 0) {
          return;
        }

        if (reduceMotion) {
          counter.textContent = String(target);
          return;
        }

        const startTime = performance.now();
        counter.textContent = "0";

        function updateCounter(now: number) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(target * eased);
          counter.textContent = String(current);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = String(target);
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }

    // Slider
    if (nextBtn && prevBtn && slides.length > 1) {
      const onNext = () => {
        showSlide(activeIndex + 1);
        startAutoSlide();
      };
      const onPrev = () => {
        showSlide(activeIndex - 1);
        startAutoSlide();
      };

      nextBtn.addEventListener("click", onNext);
      prevBtn.addEventListener("click", onPrev);
      cleanupFns.push(() => {
        nextBtn.removeEventListener("click", onNext);
        prevBtn.removeEventListener("click", onPrev);
      });

      startAutoSlide();
      cleanupFns.push(() => {
        if (autoTimer) window.clearInterval(autoTimer);
      });
    }

    // Mobile menu
    if (menuToggle && mainNav) {
      const onToggle = () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        mainNav.classList.toggle("open");
      };

      menuToggle.addEventListener("click", onToggle);
      cleanupFns.push(() => menuToggle.removeEventListener("click", onToggle));

      const links = Array.from(mainNav.querySelectorAll<HTMLAnchorElement>("a"));
      const onLinkClick = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("open");
      };
      links.forEach((link) => link.addEventListener("click", onLinkClick));
      cleanupFns.push(() => links.forEach((link) => link.removeEventListener("click", onLinkClick)));
    }

    // Reveal sections + counter
    if (revealSections.length > 0) {
      if ("IntersectionObserver" in window) {
        sectionObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              const target = entry.target as HTMLElement;
              target.classList.add("is-visible");
              if (target.classList.contains("specialists-section")) {
                startCounterAnimation(target);
              }
              observer.unobserve(target);
            });
          },
          {
            threshold: 0.2,
            rootMargin: "0px 0px -40px 0px",
          }
        );

        revealSections.forEach((section) => sectionObserver?.observe(section));
        cleanupFns.push(() => sectionObserver?.disconnect());
      } else {
        revealSections.forEach((section) => {
          section.classList.add("is-visible");
          if (section.classList.contains("specialists-section")) {
            startCounterAnimation(section);
          }
        });
      }
    }

    // --- Public Google Calendar (ICS) -> disable busy dates in Flatpickr ---
    let busyDatesSet: Set<string> | null = null;

    function initBusyDatePicker(): FlatpickrInstance | null {
      const dateInput =
        document.querySelector<HTMLInputElement>(".js-service-date") ||
        document.querySelector<HTMLInputElement>('input[name="serviceDate"]');

      if (!dateInput || typeof window.flatpickr !== "function") {
        return null;
      }

      const GOOGLE_ICS_URL =
        dateInput.dataset.icsUrl ||
        "https://calendar.google.com/calendar/ical/ef33cd75da97d7be2c22fe2f7d389cf158c9ad94436a6fc4a4ed59a375ff8a1e%40group.calendar.google.com/public/basic.ics";
      const TIME_ZONE = "Asia/Kathmandu";

      const ymdFormatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      function ymdInTimeZone(date: Date) {
        return ymdFormatter.format(date);
      }

      const busyDates = new Set<string>();
      busyDatesSet = busyDates;

      function addBusyRange(
        busySet: Set<string>,
        startDate: Date | undefined,
        endDateExclusive: Date | undefined
      ) {
        if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
          return;
        }

        if (
          !(endDateExclusive instanceof Date) ||
          Number.isNaN(endDateExclusive.getTime()) ||
          endDateExclusive <= startDate
        ) {
          busySet.add(ymdInTimeZone(startDate));
          return;
        }

        const endInclusive = new Date(endDateExclusive.getTime() - 1);
        let cursor = new Date(startDate.getTime());

        while (cursor <= endInclusive) {
          busySet.add(ymdInTimeZone(cursor));
          cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
        }
      }

      async function fetchIcsText(url: string) {
        const proxies: Array<null | ((u: string) => string)> = [
          null,
          (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        ];

        let lastError: unknown;
        for (const proxy of proxies) {
          const targetUrl = proxy ? proxy(url) : url;
          try {
            const res = await fetch(targetUrl, {
              method: "GET",
              cache: "no-store",
            });
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }
            return await res.text();
          } catch (err) {
            lastError = err;
          }
        }

        throw lastError || new Error("Failed to fetch ICS");
      }

      function extractBusyDatesFromIcs(icsText: string, { rangeDays = 730 } = {}) {
        if (!window.ICAL) {
          throw new Error("ICAL is not available (ical.js failed to load)");
        }

        const busyDates = new Set<string>();
        const jcalData = window.ICAL.parse(icsText);
        const vcalendar = new window.ICAL.Component(jcalData);
        const vevents = vcalendar.getAllSubcomponents("vevent");

        const rangeEndJs = new Date(Date.now() + rangeDays * 24 * 60 * 60 * 1000);

        for (const vevent of vevents) {
          const event = new window.ICAL.Event(vevent);

          if (event.isRecurring()) {
            const rangeStart = window.ICAL.Time.fromJSDate(new Date(), true);
            const iterator = event.iterator(rangeStart);

            while (true) {
              const next = iterator.next();
              if (!next) {
                break;
              }

              const startJs = next.toJSDate();
              if (startJs > rangeEndJs) {
                break;
              }

              const details = event.getOccurrenceDetails(next);
              const occStart = details.startDate?.toJSDate?.() || startJs;
              const occEnd =
                details.endDate?.toJSDate?.() || new Date(occStart.getTime());
              addBusyRange(busyDates, occStart, occEnd);
            }
          } else {
            const startJs = event.startDate?.toJSDate?.();
            const endJs = event.endDate?.toJSDate?.();
            addBusyRange(busyDates, startJs, endJs);
          }
        }

        return busyDates;
      }

      const picker = window.flatpickr(dateInput, {
        dateFormat: "d/m/Y",
        disableMobile: true,
      });

      // Set disable function once; it will reflect updates as busyDates changes.
      picker.set("disable", [(date: Date) => busyDates.has(ymdInTimeZone(date))]);

      async function fetchBookedDatesFromDb() {
        try {
          const res = await fetch("/api/bookings", {
            method: "GET",
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const data = (await res.json()) as unknown;
          const dates =
            data && typeof data === "object" && Array.isArray((data as any).dates)
              ? ((data as any).dates as unknown[])
              : [];

          for (const d of dates) {
            if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
              busyDates.add(d);
            }
          }

          // eslint-disable-next-line no-console
          console.info(`DB bookings loaded: ${dates.length}`);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("Could not load busy dates from DB:", err);
        }
      }

      (async () => {
        await Promise.allSettled([
          (async () => {
            try {
              const icsText = await fetchIcsText(GOOGLE_ICS_URL);
              const calendarBusy = extractBusyDatesFromIcs(icsText);
              calendarBusy.forEach((d) => busyDates.add(d));

              // eslint-disable-next-line no-console
              console.info(`Calendar busy dates loaded: ${calendarBusy.size}`);
              if (calendarBusy.size === 0) {
                // eslint-disable-next-line no-console
                console.warn(
                  "Calendar loaded but no busy dates were found. Check the calendar feed and event visibility."
                );
              }
            } catch (err) {
              // If calendar fetch/parse fails, keep the picker usable.
              // eslint-disable-next-line no-console
              console.warn("Could not load busy dates from calendar:", err);
            }
          })(),
          fetchBookedDatesFromDb(),
        ]);

        picker.redraw();
      })();

      return picker;
    }

    // --- Time picker (Flatpickr) ---
    function initServiceTimePicker(): FlatpickrInstance | null {
      const timeInput =
        document.querySelector<HTMLInputElement>(".js-service-time") ||
        document.querySelector<HTMLInputElement>('input[name="serviceTime"]');

      if (!timeInput || typeof window.flatpickr !== "function") {
        return null;
      }

      return window.flatpickr(timeInput, {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: "H:i",
        disableMobile: true,
      });
    }

    // --- Frontend-only form submit (no backend) ---
    function wireEstimateFormSubmit() {
      const form = document.querySelector<HTMLFormElement>(".estimate-form");
      if (!form) {
        return () => {};
      }

      function buildGoogleCalendarTemplateUrl(formData: FormData) {
        const serviceDate = String(formData.get("serviceDate") || "").trim();
        // Flatpickr dateFormat is d/m/Y (e.g. 03/05/2026)
        const parts = serviceDate.split("/").map((p) => p.trim());
        if (parts.length !== 3) {
          return null;
        }
        const [dd, mm, yyyy] = parts;
        if (!dd || !mm || !yyyy) {
          return null;
        }

        const yyyymmdd = `${yyyy}${mm.padStart(2, "0")}${dd.padStart(2, "0")}`;

        const titleBits = [String(formData.get("serviceType") || "").trim(), "Cleaning"];
        const fullName = String(formData.get("fullName") || "").trim();
        if (fullName) {
          titleBits.push("-", fullName);
        }
        const text = titleBits.filter(Boolean).join(" ");

        const detailsLines: string[] = [];
        const fields: Array<[string, string]> = [
          ["Name", "fullName"],
          ["Phone", "phone"],
          ["Email", "email"],
          ["Service type", "serviceType"],
          ["Frequency", "frequency"],
          ["Rooms", "rooms"],
          ["Bedrooms", "bedrooms"],
          ["Bathrooms", "bathrooms"],
          ["Property type", "propertyType"],
          ["Approx SF", "approxSf"],
          ["ZIP", "zipCode"],
          ["Time", "serviceTime"],
          ["Address", "address"],
        ];

        for (const [label, key] of fields) {
          const value = String(formData.get(key) || "").trim();
          if (value) {
            detailsLines.push(`${label}: ${value}`);
          }
        }

        const url = new URL("https://calendar.google.com/calendar/render");
        url.searchParams.set("action", "TEMPLATE");
        url.searchParams.set("text", text || "Cleaning booking");
        // All-day event on the selected date.
        // Google expects end date to be exclusive, so use +1 day.
        const endDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
        if (!Number.isNaN(endDate.getTime())) {
          endDate.setDate(endDate.getDate() + 1);
          const endY = String(endDate.getFullYear());
          const endM = String(endDate.getMonth() + 1).padStart(2, "0");
          const endD = String(endDate.getDate()).padStart(2, "0");
          url.searchParams.set("dates", `${yyyymmdd}/${endY}${endM}${endD}`);
        } else {
          url.searchParams.set("dates", `${yyyymmdd}/${yyyymmdd}`);
        }
        url.searchParams.set("ctz", "Asia/Kathmandu");
        if (detailsLines.length) {
          url.searchParams.set("details", detailsLines.join("\n"));
        }
        return url.toString();
      }

      const onSubmit = (event: Event) => {
        // Use Formspree (or any external handler) via AJAX to avoid page navigation.
        event.preventDefault();

        const endpoint = form.getAttribute("action");
        if (!endpoint) {
          // eslint-disable-next-line no-console
          console.warn("Form submission skipped: missing form action URL.");
          return;
        }

        const submitBtn = form.querySelector<HTMLButtonElement>(
          'button[type="submit"]'
        );
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

        const outgoingData = new FormData(form);
        const calendarUrl = buildGoogleCalendarTemplateUrl(outgoingData);
        // Open a blank window immediately (user gesture) to avoid popup blockers.
        // We’ll navigate it after the async submit succeeds.
        const calendarWindow = calendarUrl ? window.open("", "_blank") : null;
        if (calendarWindow && calendarWindow.document) {
          calendarWindow.document.title = "Creating calendar event…";
          calendarWindow.document.body.innerText = "Preparing calendar event…";
        }

        const ensureStatusEl = () => {
          let el = form.querySelector<HTMLParagraphElement>(".js-form-status");
          if (!el) {
            el = document.createElement("p");
            el.className = "js-form-status";
            el.setAttribute("aria-live", "polite");
            el.style.margin = "0.85rem 0 0";
            el.style.fontSize = "0.95rem";
            form.appendChild(el);
          }
          return el;
        };

        const statusEl = ensureStatusEl();
        statusEl.textContent = "Sending...";

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = "Sending...";
        }

        (async () => {
          try {
            const res = await fetch(endpoint, {
              method: "POST",
              body: outgoingData,
              headers: {
                Accept: "application/json",
              },
            });

            if (res.ok) {
              statusEl.textContent = "Thanks! Your booking was saved.";

              try {
                const data = (await res.json()) as any;
                if (data && typeof data.serviceDateYmd === "string") {
                  busyDatesSet?.add(data.serviceDateYmd);
                  busyPicker?.redraw();
                }
              } catch {
                // ignore JSON parse errors
              }

              if (calendarUrl) {
                if (calendarWindow && !calendarWindow.closed) {
                  calendarWindow.location.href = calendarUrl;
                } else {
                  // Popup blocked; provide a clickable link.
                  statusEl.textContent = "";
                  statusEl.append("Thanks! Your booking was saved. ");
                  const link = document.createElement("a");
                  link.href = calendarUrl;
                  link.target = "_blank";
                  link.rel = "noopener noreferrer";
                  link.textContent = "Add to Google Calendar";
                  statusEl.append(link);
                  statusEl.append(".");
                }
              }
              form.reset();
              return;
            }

            if (calendarWindow && !calendarWindow.closed) {
              calendarWindow.close();
            }

            let message = `Could not save booking (HTTP ${res.status}).`;
            try {
              const data = await res.json();
              if (data && typeof data.error === "string") {
                message = data.error;
              }
            } catch {
              // ignore JSON parse errors
            }

            statusEl.textContent = message;
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("Form submission failed:", err);
            statusEl.textContent = "Network error. Please try again.";

            if (calendarWindow && !calendarWindow.closed) {
              calendarWindow.close();
            }
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
          }
        })();
      };

      form.addEventListener("submit", onSubmit);
      return () => form.removeEventListener("submit", onSubmit);
    }

    // Flatpickr + ICAL might load after this effect.
    // We try now, and also retry for a short time in case the scripts load late.
    let busyPicker: FlatpickrInstance | null = null;
    let timePicker: FlatpickrInstance | null = null;

    const tryInitPickers = () => {
      if (!busyPicker) busyPicker = initBusyDatePicker();
      if (!timePicker) timePicker = initServiceTimePicker();
    };

    tryInitPickers();

    let initAttempts = 0;
    const initTimer = window.setInterval(() => {
      initAttempts += 1;
      tryInitPickers();

      const allReady = Boolean(busyPicker) && Boolean(timePicker);
      if (allReady || initAttempts >= 50) {
        window.clearInterval(initTimer);
      }
    }, 200);
    cleanupFns.push(() => window.clearInterval(initTimer));

    const unbindForm = wireEstimateFormSubmit();
    cleanupFns.push(unbindForm);

    cleanupFns.push(() => busyPicker?.destroy());
    cleanupFns.push(() => timePicker?.destroy());

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}
