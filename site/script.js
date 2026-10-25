/* ==========================================================================
   Bolex Power Solutions — shared JavaScript
   Vanilla JS only. Handles: mobile menu, sticky header, project gallery
   (filters + lightbox), solar load calculator, and the quote form that
   opens WhatsApp with the customer's details.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Sticky header shadow + mobile navigation
     ------------------------------------------------------------------------ */
  var header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    });
  }

  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    // close the menu after tapping a link (mobile)
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && window.innerWidth < 1060) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. Project gallery: category filters + lightbox
     ------------------------------------------------------------------------ */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var gItems = document.querySelectorAll(".g-item");
  if (filterBtns.length && gItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        gItems.forEach(function (item) {
          var show = cat === "all" || item.getAttribute("data-cat") === cat;
          item.classList.toggle("hidden", !show);
        });
      });
    });
  }

  var lightbox = document.getElementById("lightbox");
  if (lightbox && gItems.length) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lb-caption");
    var visible = [];
    var current = 0;

    function collectVisible() {
      visible = Array.prototype.filter.call(gItems, function (i) {
        return !i.classList.contains("hidden");
      });
    }
    function showAt(idx) {
      if (!visible.length) return;
      current = (idx + visible.length) % visible.length;
      var item = visible[current];
      lbImg.src = item.querySelector("img").src;
      lbImg.alt = item.querySelector("img").alt || "";
      lbCap.textContent = item.getAttribute("data-caption") || "";
    }
    gItems.forEach(function (item) {
      item.addEventListener("click", function () {
        collectVisible();
        showAt(visible.indexOf(item));
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { showAt(current - 1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function () { showAt(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showAt(current - 1);
      if (e.key === "ArrowRight") showAt(current + 1);
    });
  }

  /* ------------------------------------------------------------------------
     3. Solar load calculator (client-side estimate only)
     ------------------------------------------------------------------------ */
  var calcForm = document.getElementById("load-calculator");
  if (calcForm) {
    // Standard inverter sizes (kVA / kW) used to round up the recommendation
    var INVERTER_SIZES = [1, 1.5, 2, 2.4, 3, 3.5, 5, 7.5, 10, 15, 20, 30, 50, 100];
    // Peak sun hours per day in southern Nigeria (rough planning figure)
    var SUN_HOURS = 4.5;
    // Lithium usable depth of discharge
    var USABLE_DOD = 0.85;

    function roundInverter(kw) {
      for (var i = 0; i < INVERTER_SIZES.length; i++) {
        if (INVERTER_SIZES[i] >= kw) return INVERTER_SIZES[i];
      }
      return INVERTER_SIZES[INVERTER_SIZES.length - 1];
    }

    calcForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var rows = calcForm.querySelectorAll("tbody tr");
      var dailyWh = 0;
      var totalWatts = 0;
      var parts = [];

      rows.forEach(function (row) {
        var name = row.getAttribute("data-name");
        var watts = parseFloat(row.querySelector("input.watts").value) || 0;
        var qty = parseInt(row.querySelector("input.qty").value, 10) || 0;
        var hours = parseFloat(row.querySelector("input.hours").value) || 0;
        if (qty > 0 && watts > 0) {
          var itemWh = watts * qty * hours;
          dailyWh += itemWh;
          totalWatts += watts * qty;
          parts.push(qty + " x " + name + " (" + watts + "W, " + hours + "h/day)");
        }
      });

      if (dailyWh <= 0) {
        alert("Please enter at least one appliance with a quantity and hours per day.");
        return;
      }

      // Peak load estimate: assume about 70% of everything runs at once
      var peakW = totalWatts * 0.7;
      var inverterKw = roundInverter((peakW * 1.25) / 1000); // surge margin
      // Battery: one day of backup, sized on daily energy at 48V system voltage
      var batteryKwh = Math.round((dailyWh / 1000 / USABLE_DOD) * 10) / 10;
      var batteryAh48 = Math.round(batteryKwh * 1000 / 48);
      // Solar array to recharge the daily usage
      var solarKw = Math.round((dailyWh / (SUN_HOURS * 1000 * 0.8)) * 10) / 10;

      document.getElementById("res-daily").textContent =
        (Math.round(dailyWh / 100) / 10).toLocaleString() + " kWh/day";
      document.getElementById("res-peak").textContent =
        Math.round(peakW).toLocaleString() + " W";
      document.getElementById("res-inverter").textContent =
        inverterKw >= 1 ? inverterKw + " kVA / kW" : (inverterKw * 1000) + " W";
      document.getElementById("res-battery").textContent =
        batteryKwh + " kWh (about " + batteryAh48 + "Ah @ 48V)";
      document.getElementById("res-solar").textContent = solarKw + " kW";

      var msg =
        "Hello Bolex Power Solutions! I used the solar load calculator on your website and I would like an exact quote. " +
        "My appliances: " + parts.join("; ") + ". " +
        "Estimate shown: " + (Math.round(dailyWh / 100) / 10) + " kWh/day, recommended inverter about " +
        inverterKw + " kVA, battery about " + batteryKwh + " kWh, solar array about " + solarKw +
        " kW. Please advise. My location is: ";
      var link = document.getElementById("calc-wa");
      link.href = "https://wa.me/2348070669625?text=" + encodeURIComponent(msg);
      document.getElementById("calc-result-card").style.display = "block";
      document.getElementById("calc-result-card").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // "Reset" button
    var resetBtn = document.getElementById("calc-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        calcForm.reset();
        var card = document.getElementById("calc-result-card");
        if (card) card.style.display = "none";
      });
    }
  }

  /* ------------------------------------------------------------------------
     4. Quote form -> WhatsApp (with mailto fallback link)
     ------------------------------------------------------------------------ */
  var quoteForm = document.getElementById("quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("q-name").value.trim();
      var phone = document.getElementById("q-phone").value.trim();
      var service = document.getElementById("q-service").value;
      var location = document.getElementById("q-location").value.trim();
      var message = document.getElementById("q-message").value.trim();

      if (!name || !phone) {
        alert("Please fill in your name and phone number so we can reach you.");
        return;
      }

      var text =
        "Hello Bolex Power Solutions! I would like a quote.%0A" +
        "Name: " + name + "%0A" +
        "Phone: " + phone + "%0A" +
        "Service needed: " + service + "%0A" +
        "Location: " + location + "%0A" +
        "Details: " + message;
      window.open("https://wa.me/2348070669625?text=" + text, "_blank");

      // mailto fallback (also shown as a visible link under the form)
      var mail = document.getElementById("q-mailto");
      if (mail) {
        mail.href =
          "mailto:bolexpowersolution1@gmail.com?subject=" +
          encodeURIComponent("Quote request — " + service + " — " + name) +
          "&body=" +
          encodeURIComponent(
            "Name: " + name + "\nPhone: " + phone + "\nService needed: " + service +
            "\nLocation: " + location + "\nDetails: " + message
          );
      }
      document.getElementById("q-sent").style.display = "block";
    });
  }

  /* ------------------------------------------------------------------------
     5. Footer copyright year (keeps working after New Year)
     ------------------------------------------------------------------------ */
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
