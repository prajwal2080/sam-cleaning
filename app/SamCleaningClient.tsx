"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type FlatpickrInstance = {
  set: (key: string, value: unknown) => void;
  redraw: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    flatpickr?: (el: Element, opts: Record<string, unknown>) => FlatpickrInstance;
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

    // --- Disable busy dates in Flatpickr based on DB bookings ---
    type BusyRange = { startMin: number; endMin: number };

    const WORK_START_MIN = 8 * 60;
    const WORK_END_MIN = 20 * 60;
    const SERVICE_DURATION_MIN = 120;

    const busyRangesByDate = new Map<string, BusyRange[]>();
    let selectedServiceDateYmd: string | null = null;

    function hhmmToMinutes(value: string) {
      if (!/^\d{2}:\d{2}$/.test(value)) return null;
      const [hhRaw, mmRaw] = value.split(":");
      const hh = Number.parseInt(hhRaw, 10);
      const mm = Number.parseInt(mmRaw, 10);
      if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
      if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
      return hh * 60 + mm;
    }


    function clampRange(range: BusyRange) {
      const startMin = Math.max(0, Math.min(24 * 60, range.startMin));
      const endMin = Math.max(0, Math.min(24 * 60, range.endMin));
      if (endMin <= startMin) return null;
      return { startMin, endMin };
    }

    function addBusyRangeForDate(ymd: string, range: BusyRange) {
      const normalized = clampRange(range);
      if (!normalized) return;
      const list = busyRangesByDate.get(ymd) ?? [];
      list.push(normalized);
      busyRangesByDate.set(ymd, list);
    }

    function mergedRangesForDate(ymd: string) {
      const ranges = (busyRangesByDate.get(ymd) ?? [])
        .map(clampRange)
        .filter((r): r is BusyRange => Boolean(r))
        .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

      const merged: BusyRange[] = [];
      for (const r of ranges) {
        const last = merged[merged.length - 1];
        if (!last || r.startMin > last.endMin) {
          merged.push({ ...r });
        } else {
          last.endMin = Math.max(last.endMin, r.endMin);
        }
      }
      return merged;
    }

    function hasAvailabilityForDate(ymd: string) {
      const merged = mergedRangesForDate(ymd);
      let cursor = WORK_START_MIN;

      for (const r of merged) {
        const start = Math.max(r.startMin, WORK_START_MIN);
        const end = Math.min(r.endMin, WORK_END_MIN);
        if (end <= WORK_START_MIN || start >= WORK_END_MIN) {
          continue;
        }

        if (start - cursor >= SERVICE_DURATION_MIN) {
          return true;
        }

        cursor = Math.max(cursor, end);
        if (cursor >= WORK_END_MIN) {
          return false;
        }
      }

      return WORK_END_MIN - cursor >= SERVICE_DURATION_MIN;
    }

    function isSlotAvailable(ymd: string, startMin: number) {
      const endMin = startMin + SERVICE_DURATION_MIN;

      if (startMin < WORK_START_MIN || endMin > WORK_END_MIN) {
        return { ok: false, reason: "Outside working hours." } as const;
      }

      const ranges = mergedRangesForDate(ymd);
      for (const r of ranges) {
        if (startMin < r.endMin && endMin > r.startMin) {
          return { ok: false, reason: "This time is already booked." } as const;
        }
      }

      return { ok: true, reason: "Available" } as const;
    }


    function initBusyDatePicker(): FlatpickrInstance | null {
      const dateInput =
        document.querySelector<HTMLInputElement>(".js-service-date") ||
        document.querySelector<HTMLInputElement>('input[name="serviceDate"]');

      if (!dateInput || typeof window.flatpickr !== "function") {
        return null;
      }

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

      const picker = window.flatpickr(dateInput, {
        dateFormat: "d/m/Y",
        disableMobile: true,
        disable: [
          (date: Date) => {
            const ymd = ymdInTimeZone(date);
            return !hasAvailabilityForDate(ymd);
          },
        ],
        onDayCreate: (_dObj: unknown, _dStr: string, _fp: unknown, dayElem: HTMLElement) => {
          const dateObj = (dayElem as any)?.dateObj as Date | undefined;
          if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
            return;
          }

          const ymd = ymdInTimeZone(dateObj);
          const merged = mergedRangesForDate(ymd);

          if (!hasAvailabilityForDate(ymd)) {
            dayElem.classList.add("is-busy-day");
            dayElem.setAttribute("aria-label", `${ymd} (Fully booked)`);
            dayElem.setAttribute("title", "Fully booked");
          } else if (merged.length > 0) {
            dayElem.classList.add("is-partial-busy-day");
            dayElem.setAttribute("aria-label", `${ymd} (Some slots booked)`);
            dayElem.setAttribute("title", "Some slots booked");
          }
        },
        onChange: (selectedDates: Date[]) => {
          const d = selectedDates?.[0];
          selectedServiceDateYmd = d ? ymdInTimeZone(d) : null;
          timePicker?.redraw();
        },
      });

      async function fetchBookedDatesFromDb() {
        try {
          const res = await fetch("/api/bookings", {
            method: "GET",
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const data = (await res.json()) as any;
          const bookings =
            data && typeof data === "object" && Array.isArray(data.bookings)
              ? (data.bookings as unknown[])
              : [];

          let count = 0;
          for (const b of bookings) {
            const ymd = (b as any)?.serviceDateYmd;
            const startMin = (b as any)?.startMin;
            const endMin = (b as any)?.endMin;
            if (
              typeof ymd === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(ymd) &&
              typeof startMin === "number" &&
              typeof endMin === "number"
            ) {
              addBusyRangeForDate(ymd, { startMin, endMin });
              count += 1;
            }
          }

          // eslint-disable-next-line no-console
          console.info(`DB bookings loaded: ${count}`);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("Could not load busy dates from DB:", err);
        }
      }

      (async () => {
        await fetchBookedDatesFromDb();
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

      const lastStartMin = WORK_END_MIN - SERVICE_DURATION_MIN;
      const maxStartHh = Math.floor(lastStartMin / 60);
      const maxStartMm = lastStartMin % 60;
      const maxTime = `${String(maxStartHh).padStart(2, "0")}:${String(maxStartMm).padStart(2, "0")}`;

      const picker = window.flatpickr(timeInput, {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: "H:i",
        minuteIncrement: 30,
        minTime: "08:00",
        maxTime,
        disableMobile: true,
        disable: [
          (date: Date) => {
            if (!selectedServiceDateYmd) {
              return false;
            }

            // flatpickr time-only uses a Date; interpret its local HH:mm.
            const timeMin = date.getHours() * 60 + date.getMinutes();
            const timeEndMin = timeMin + SERVICE_DURATION_MIN;

            if (timeMin < WORK_START_MIN || timeEndMin > WORK_END_MIN) {
              return true;
            }

            const ranges = mergedRangesForDate(selectedServiceDateYmd);
            for (const r of ranges) {
              // Overlap check: [timeMin, timeEndMin) intersects [r.startMin, r.endMin)
              if (timeMin < r.endMin && timeEndMin > r.startMin) {
                return true;
              }
            }
            return false;
          },
        ],
        onChange: (_selectedDates: Date[], dateStr: string) => {
          const startMin = hhmmToMinutes(dateStr.trim());
          if (selectedServiceDateYmd && startMin !== null) {
            const availability = isSlotAvailable(selectedServiceDateYmd, startMin);
            if (!availability.ok) {
              toast.error(availability.reason);
            }
          }
        },
      });

      return picker;
    }

    // --- Frontend-only form submit (no backend) ---
    function wireEstimateFormSubmit() {
      const form = document.querySelector<HTMLFormElement>(".estimate-form");
      if (!form) {
        return () => {};
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

        const ensureStatusEl = () => {
          let el = form.querySelector<HTMLParagraphElement>(".js-form-status");
          if (!el) {
            el = document.createElement("p");
            el.className = "js-form-status";
            form.appendChild(el);
          }

          el.setAttribute("aria-live", "polite");
          // Keep it accessible but never visible (prevents layout shifts).
          el.style.position = "absolute";
          el.style.width = "1px";
          el.style.height = "1px";
          el.style.padding = "0";
          el.style.margin = "-1px";
          el.style.overflow = "hidden";
          el.style.clip = "rect(0, 0, 0, 0)";
          el.style.whiteSpace = "nowrap";
          el.style.border = "0";

          return el;
        };

        const statusEl = ensureStatusEl();
        statusEl.textContent = "";

        // Client-side availability guard (server also enforces this).
        const dateInput = form.querySelector<HTMLInputElement>(".js-service-date");
        const timeInput = form.querySelector<HTMLInputElement>(".js-service-time");
        const hasDate = Boolean(String(dateInput?.value || "").trim());
        const timeValue = String(timeInput?.value || "").trim();
        const startMin = hhmmToMinutes(timeValue);
        if (hasDate && selectedServiceDateYmd && startMin !== null) {
          const availability = isSlotAvailable(selectedServiceDateYmd, startMin);
          if (!availability.ok) {
            toast.error(availability.reason);
            return;
          }
        }

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
              statusEl.textContent = "";
              toast.success("Booking saved.");

              try {
                const data = (await res.json()) as any;
                if (
                  data &&
                  typeof data.serviceDateYmd === "string" &&
                  typeof data.startMin === "number" &&
                  typeof data.endMin === "number"
                ) {
                  addBusyRangeForDate(data.serviceDateYmd, {
                    startMin: data.startMin,
                    endMin: data.endMin,
                  });
                  busyPicker?.redraw();
                  timePicker?.redraw();
                }
              } catch {
                // ignore JSON parse errors
              }

              form.reset();
              return;
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
            toast.error(message);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn("Form submission failed:", err);
            statusEl.textContent = "Network error. Please try again.";
            toast.error("Network error. Please try again.");
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

    // Flatpickr might load after this effect.
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
