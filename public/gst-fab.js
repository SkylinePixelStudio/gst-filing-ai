(function () {
  if (document.getElementById("g-fab")) return;

  /* ── styles ── */
  var s = document.createElement("style");
  s.textContent =
    "#g-fab{position:fixed;bottom:28px;right:28px;z-index:9999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}" +
    "#g-btn{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(16,185,129,.5);transition:transform .18s,box-shadow .18s}" +
    "#g-btn:hover{transform:scale(1.08);box-shadow:0 6px 26px rgba(16,185,129,.65)}" +
    "#g-lbl{font-size:9px;font-weight:800;color:#fff;letter-spacing:.6px;margin-top:3px}" +
    "#g-panel{position:fixed;bottom:100px;right:28px;z-index:9998;width:292px;background:#fff;border-radius:16px;box-shadow:0 8px 36px rgba(0,0,0,.16);overflow:hidden;display:none;flex-direction:column}" +
    "#g-panel.on{display:flex}" +
    ".gph{background:linear-gradient(135deg,#10b981,#059669);padding:14px 16px;color:#fff}" +
    ".gph h4{margin:0;font-size:15px;font-weight:700}" +
    ".gph small{font-size:11px;opacity:.85}" +
    ".gpb{padding:14px 16px}" +
    ".gr{display:flex;justify-content:space-between;font-size:12px;margin-bottom:7px;color:#374151}" +
    ".gr b{color:#111}" +
    ".ga{display:block;padding:10px 12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;text-align:center;border-radius:9px;font-size:13px;font-weight:600;text-decoration:none;margin-bottom:8px}" +
    ".gg{display:grid;grid-template-columns:1fr 1fr;gap:6px}" +
    ".gi{padding:8px 5px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:11px;font-weight:600;color:#065f46;text-align:center;text-decoration:none}" +
    ".gi:hover{background:#dcfce7}";
  document.head.appendChild(s);

  /* ── context reader ── */
  function ctx() {
    var c = { source: "rizipt" };
    try {
      if (window.__rizipt_context) return Object.assign(c, window.__rizipt_context);
    } catch (e) {}
    try {
      var el = document.querySelector("[data-gstin]");
      if (el) c.gstin = el.getAttribute("data-gstin");
    } catch (e) {}
    try {
      var raw =
        localStorage.getItem("rizipt_company") ||
        localStorage.getItem("company");
      if (raw) {
        var j = JSON.parse(raw);
        c.gstin = c.gstin || j.gstin || j.gst_number;
        c.company = j.name || j.company_name;
        c.pan = j.pan;
      }
    } catch (e) {}
    return c;
  }

  function makeUrl(mod) {
    var c = ctx();
    var p = new URLSearchParams();
    if (c.gstin) p.set("gstin", c.gstin);
    if (c.company) p.set("company", c.company);
    if (c.pan) p.set("pan", c.pan);
    p.set("source", "rizipt");
    if (mod) p.set("module", mod);
    return "https://gst.rizipt.in?" + p.toString();
  }

  function lnk(cls, mod, label) {
    return (
      '<a class="' + cls + '" href="' + makeUrl(mod) + '" target="_blank" rel="noopener">' + label + "</a>"
    );
  }

  /* ── panel ── */
  var pnl = document.createElement("div");
  pnl.id = "g-panel";

  function draw() {
    var c = ctx();
    var rows = "";
    if (c.company)
      rows +=
        '<div class="gr"><span>Company</span><b>' + c.company + "</b></div>";
    if (c.gstin)
      rows += '<div class="gr"><span>GSTIN</span><b>' + c.gstin + "</b></div>";
    pnl.innerHTML =
      '<div class="gph"><h4>🧾 GST Filing AI</h4><small>gst.rizipt.in</small></div>' +
      '<div class="gpb">' +
      rows +
      lnk("ga", null, "Open GST Dashboard ↗") +
      '<div class="gg">' +
      lnk("gi", "gst-returns", "📋 Returns") +
      lnk("gi", "invoices", "🧾 Invoices") +
      lnk("gi", "reconciliation", "⚖️ Reconcile") +
      lnk("gi", "notices", "⚠️ Notices") +
      lnk("gi", "compliance", "✅ Compliance") +
      lnk("gi", "ai-assistant", "🤖 AI CFO") +
      "</div></div>";
  }

  /* ── button ── */
  var btn = document.createElement("button");
  btn.id = "g-btn";
  btn.setAttribute("aria-label", "GST Filing AI");
  btn.innerHTML =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/>' +
    '<path d="M13 3v5h5"/>' +
    "</svg>" +
    '<span id="g-lbl">GST</span>';

  var open = false;

  btn.onclick = function (e) {
    e.stopPropagation();
    open = !open;
    if (open) {
      draw();
      pnl.classList.add("on");
    } else {
      pnl.classList.remove("on");
    }
  };

  document.addEventListener("click", function (e) {
    if (open && !pnl.contains(e.target) && e.target !== btn) {
      open = false;
      pnl.classList.remove("on");
    }
  });

  /* ── mount ── */
  var fab = document.createElement("div");
  fab.id = "g-fab";
  fab.appendChild(btn);
  document.body.appendChild(fab);
  document.body.appendChild(pnl);
})();
