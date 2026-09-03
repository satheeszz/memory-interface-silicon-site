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
