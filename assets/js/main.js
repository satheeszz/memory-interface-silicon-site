document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.querySelector('.nav-mobile-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', function () {
    panel.classList.toggle('open');
  });

  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      panel.classList.remove('open');
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var search = document.getElementById('productFilterSearch');
  var status = document.getElementById('productFilterStatus');
  var rows = document.querySelectorAll('#productsTableBody tr');
  var count = document.getElementById('productFilterCount');
  if (!search || !status || !rows.length) return;

  function applyFilter() {
    var term = search.value.trim().toLowerCase();
    var st = status.value;
    var visible = 0;

    rows.forEach(function (row) {
      var matchesText = !term || row.textContent.toLowerCase().indexOf(term) !== -1;
      var matchesStatus = !st || row.getAttribute('data-status') === st;
      var show = matchesText && matchesStatus;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (count) count.textContent = visible + ' of ' + rows.length + ' products shown.';
  }

  search.addEventListener('input', applyFilter);
  status.addEventListener('change', applyFilter);
});

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('briefForm');
  var productSelect = document.getElementById('briefProduct');
  if (!form || !productSelect) return;

  var PDF_BY_PRODUCT = {
    spd5118: 'assets/docs/SPD5118-ProductBrief.pdf',
    ts5110: 'assets/docs/TS5110-ProductBrief.pdf'
  };

  // Pre-select the product based on ?product=spd5118 / ?product=ts5110 in the URL,
  // so the "Download" link on the Products table lands on the right option.
  var params = new URLSearchParams(window.location.search);
  var requestedProduct = params.get('product');
  if (requestedProduct && PDF_BY_PRODUCT[requestedProduct]) {
    productSelect.value = requestedProduct;
  }

  var successPanel = document.getElementById('briefSuccess');

  // The real Formspree endpoint isn't set up yet, so submitting would just fail
  // with a confusing "form not found" error. Show a plain work-in-progress
  // notice instead until a real backend (Azure) is wired up here.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.style.display = 'none';
    successPanel.style.display = 'block';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('resumeForm');
  if (!form) return;

  var successPanel = document.getElementById('resumeSuccess');

  // Same work-in-progress stand-in as the other forms — see comment above.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.style.display = 'none';
    successPanel.style.display = 'block';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var wipPanel = document.getElementById('contactWip');

  // Same work-in-progress stand-in as the other forms — see comment above.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.style.display = 'none';
    wipPanel.style.display = 'block';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  // Elements are visible by default (see .reveal in style.css). Only arm the
  // hide/reveal animation once we know JS is actually running — this way a
  // failed/stale/blocked script can never leave content permanently invisible.
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  targets.forEach(function (el) { el.classList.add('reveal-armed'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
});

document.addEventListener('DOMContentLoaded', function () {
  var numbers = document.querySelectorAll('.stat-number[data-count-to]');
  if (!numbers.length) return;

  // Each element already shows its final value in the HTML (fail-safe). We only
  // animate a count-up from 0 if IntersectionObserver is available and the user
  // hasn't asked for reduced motion — otherwise the static final value just stays.
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var prefix = el.getAttribute('data-count-prefix') || '';
    var suffix = el.getAttribute('data-count-suffix') || '';
    if (isNaN(target)) return;

    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  numbers.forEach(function (el) { observer.observe(el); });
});
