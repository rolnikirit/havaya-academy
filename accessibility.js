/* ווידג'ט נגישות אתר "הוויה" — קובץ משותף לכל דפי האתר.
   נטען מוקדם ב-<head> (בלי defer/async) כדי להחיל העדפות שמורות
   לפני הציור הראשון של העמוד (מונע הבזק של מצב לא-נגיש רגעי). */
(function () {
  'use strict';

  var PREF_KEY = 'havayaA11yPrefs';
  var root = document.documentElement;
  var prefs = {};
  try {
    prefs = JSON.parse(localStorage.getItem(PREF_KEY)) || {};
  } catch (e) {
    prefs = {};
  }

  function applyPrefs() {
    root.classList.toggle('a11y-fs-2', prefs.fontStep === 1);
    root.classList.toggle('a11y-fs-3', prefs.fontStep === 2);
    root.classList.toggle('a11y-fs-4', prefs.fontStep === 3);
    root.classList.toggle('a11y-contrast', !!prefs.contrast);
    root.classList.toggle('a11y-grayscale', !!prefs.grayscale);
    root.classList.toggle('a11y-underline-links', !!prefs.underline);
    root.classList.toggle('a11y-no-motion', !!prefs.noMotion);
    root.classList.toggle('a11y-readable-font', !!prefs.readableFont);
  }

  function save() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) {}
    applyPrefs();
    updatePressedStates();
  }

  applyPrefs();

  var panelEls = {};

  function updatePressedStates() {
    if (!panelEls.contrast) return;
    panelEls.contrast.setAttribute('aria-pressed', String(!!prefs.contrast));
    panelEls.grayscale.setAttribute('aria-pressed', String(!!prefs.grayscale));
    panelEls.underline.setAttribute('aria-pressed', String(!!prefs.underline));
    panelEls.noMotion.setAttribute('aria-pressed', String(!!prefs.noMotion));
    panelEls.readableFont.setAttribute('aria-pressed', String(!!prefs.readableFont));
    panelEls.fsLabel.textContent = 'גודל טקסט: ' + (['רגיל', 'גדול', 'גדול מאוד', 'ענק'][prefs.fontStep || 0]);
  }

  function buildWidget() {
    var style = document.createElement('style');
    style.textContent = [
      /* ── כפתור צף ── */
      '.a11y-btn{position:fixed; bottom:22px; left:22px; width:52px; height:52px; border-radius:50%; background:#015c78; border:2px solid #fff; box-shadow:0 6px 20px rgba(0,0,0,0.28); cursor:pointer; z-index:99999; display:flex; align-items:center; justify-content:center; padding:0; transition:transform 200ms ease}',
      '.a11y-btn:hover, .a11y-btn:focus-visible{transform:scale(1.08)}',
      '.a11y-btn svg{width:28px; height:28px; fill:#fff}',
      /* ── פאנל ── */
      '.a11y-panel{position:fixed; bottom:84px; left:22px; width:300px; max-width:calc(100vw - 32px); max-height:min(560px, calc(100vh - 110px)); overflow-y:auto; background:#fff; border-radius:16px; box-shadow:0 16px 44px rgba(0,0,0,0.28); z-index:99999; padding:18px; direction:rtl; font-family:Rubik,Arial,sans-serif; display:none}',
      '.a11y-panel.open{display:block}',
      '.a11y-panel h2{font-size:1.05rem; color:#015c78; font-weight:800; margin:0 0 4px}',
      '.a11y-panel .a11y-sub{font-size:0.78rem; color:#6b7d80; margin:0 0 14px}',
      '.a11y-row{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0; border-top:1px solid #eee}',
      '.a11y-row:first-of-type{border-top:none}',
      '.a11y-row-label{font-size:0.9rem; color:#015c78; font-weight:600}',
      '.a11y-fs-controls{display:flex; align-items:center; gap:6px}',
      '.a11y-fs-controls button{width:32px; height:32px; border-radius:8px; border:1px solid #015c78; background:#fff; color:#015c78; font-weight:800; cursor:pointer; font-size:1rem; line-height:1}',
      '.a11y-fs-controls button:hover{background:#f4ead9}',
      '.a11y-toggle{width:44px; height:24px; border-radius:14px; background:#e2e2e2; border:none; cursor:pointer; position:relative; transition:background 150ms ease; padding:0; flex-shrink:0}',
      '.a11y-toggle::after{content:""; position:absolute; top:2px; right:2px; width:20px; height:20px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.3); transition:right 150ms ease}',
      '.a11y-toggle[aria-pressed="true"]{background:#015c78}',
      '.a11y-toggle[aria-pressed="true"]::after{right:22px}',
      '.a11y-reset{width:100%; margin-top:14px; padding:10px; border-radius:10px; border:1px solid #b3854a; background:#fff; color:#b3854a; font-weight:700; font-size:0.85rem; cursor:pointer}',
      '.a11y-reset:hover{background:#faf3e0}',
      '.a11y-statement-link{display:block; text-align:center; margin-top:12px; font-size:0.8rem; color:#0093ab; text-decoration:underline}',
      '.a11y-close{position:absolute; top:12px; left:12px; background:none; border:0; cursor:pointer; font-size:1.2rem; color:#6b7d80; line-height:1; padding:4px}',
      /* ── מצבים גלובליים שהווידג'ט מפעיל ── */
      'html.a11y-fs-2{font-size:112.5%}',
      'html.a11y-fs-3{font-size:125%}',
      'html.a11y-fs-4{font-size:137.5%}',
      'html.a11y-grayscale{filter:grayscale(1)}',
      'html.a11y-underline-links a{text-decoration:underline !important}',
      'html.a11y-no-motion *{animation:none !important; transition:none !important; scroll-behavior:auto !important}',
      'html.a11y-readable-font, html.a11y-readable-font *{font-family:Arial,Helvetica,sans-serif !important; letter-spacing:0.02em !important}',
      'html.a11y-contrast body{background:#000 !important; color:#fff !important}',
      'html.a11y-contrast a{color:#ffe066 !important}',
      'html.a11y-contrast header{background:#000 !important; border-bottom:2px solid #ffe066 !important}',
      'html.a11y-contrast nav a{color:#fff !important}',
      'html.a11y-contrast nav a.active, html.a11y-contrast nav a:hover{color:#ffe066 !important}',
      'html.a11y-contrast section{background:#000 !important}',
      'html.a11y-contrast footer{background:#000 !important; border-color:#ffe066 !important}',
      'html.a11y-contrast .header-cta, html.a11y-contrast .btn-primary, html.a11y-contrast .btn-secondary, html.a11y-contrast .btn-submit{background:#ffe066 !important; color:#000 !important; border-color:#ffe066 !important}',
      'html.a11y-contrast .c-card, html.a11y-contrast .a11y-panel{background:#111 !important; color:#fff !important; border-color:#ffe066 !important}',
      '@media(max-width:480px){.a11y-panel{left:16px; right:16px; width:auto}}'
    ].join('\n');
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.className = 'a11y-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'פתיחת תפריט נגישות');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'a11yPanel');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a2.2 2.2 0 1 1 0 4.4A2.2 2.2 0 0 1 12 2zm9 7.4-6-1.2v3.4l3.6 1.2-1 3-3-1v7.2h-2v-5.6h-1.2V22H9.4v-7.2l-3 1-1-3L9 11.6V8.2L3 9.4l-.4-2L9 6.1c.6-.9 1.7-1.5 3-1.5s2.4.6 3 1.5l6.4 1.3-.4 2z"/></svg>';

    var panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.id = 'a11yPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'הגדרות נגישות');
    panel.innerHTML =
      '<button type="button" class="a11y-close" aria-label="סגירת תפריט נגישות">✕</button>' +
      '<h2>הגדרות נגישות</h2>' +
      '<p class="a11y-sub">ההעדפות נשמרות אוטומטית ונשארות בכל דפי האתר</p>' +
      '<div class="a11y-row"><span class="a11y-row-label" id="a11yFsLabel">גודל טקסט: רגיל</span>' +
        '<div class="a11y-fs-controls">' +
          '<button type="button" id="a11yFsMinus" aria-label="הקטנת טקסט">A-</button>' +
          '<button type="button" id="a11yFsPlus" aria-label="הגדלת טקסט">A+</button>' +
        '</div></div>' +
      '<div class="a11y-row"><span class="a11y-row-label">ניגודיות גבוהה</span><button type="button" class="a11y-toggle" id="a11yContrast" aria-pressed="false" aria-label="הפעלת ניגודיות גבוהה"></button></div>' +
      '<div class="a11y-row"><span class="a11y-row-label">גווני אפור</span><button type="button" class="a11y-toggle" id="a11yGrayscale" aria-pressed="false" aria-label="הפעלת גווני אפור"></button></div>' +
      '<div class="a11y-row"><span class="a11y-row-label">הדגשת קישורים</span><button type="button" class="a11y-toggle" id="a11yUnderline" aria-pressed="false" aria-label="הדגשת כל הקישורים בקו תחתון"></button></div>' +
      '<div class="a11y-row"><span class="a11y-row-label">עצירת אנימציות</span><button type="button" class="a11y-toggle" id="a11yNoMotion" aria-pressed="false" aria-label="עצירת כל האנימציות באתר"></button></div>' +
      '<div class="a11y-row"><span class="a11y-row-label">גופן קריא</span><button type="button" class="a11y-toggle" id="a11yReadableFont" aria-pressed="false" aria-label="מעבר לגופן קריא במיוחד"></button></div>' +
      '<button type="button" class="a11y-reset" id="a11yReset">איפוס כל ההגדרות</button>' +
      '<a class="a11y-statement-link" href="accessibility-statement.html">הצהרת נגישות מלאה ←</a>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    panelEls = {
      contrast: panel.querySelector('#a11yContrast'),
      grayscale: panel.querySelector('#a11yGrayscale'),
      underline: panel.querySelector('#a11yUnderline'),
      noMotion: panel.querySelector('#a11yNoMotion'),
      readableFont: panel.querySelector('#a11yReadableFont'),
      fsLabel: panel.querySelector('#a11yFsLabel')
    };
    updatePressedStates();

    function openPanel() {
      panel.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      if (panel.classList.contains('open')) closePanel(); else openPanel();
    });
    panel.querySelector('.a11y-close').addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        closePanel();
      }
    });

    panel.querySelector('#a11yFsPlus').addEventListener('click', function () {
      prefs.fontStep = Math.min(3, (prefs.fontStep || 0) + 1);
      save();
    });
    panel.querySelector('#a11yFsMinus').addEventListener('click', function () {
      prefs.fontStep = Math.max(0, (prefs.fontStep || 0) - 1);
      save();
    });
    panelEls.contrast.addEventListener('click', function () { prefs.contrast = !prefs.contrast; save(); });
    panelEls.grayscale.addEventListener('click', function () { prefs.grayscale = !prefs.grayscale; save(); });
    panelEls.underline.addEventListener('click', function () { prefs.underline = !prefs.underline; save(); });
    panelEls.noMotion.addEventListener('click', function () { prefs.noMotion = !prefs.noMotion; save(); });
    panelEls.readableFont.addEventListener('click', function () { prefs.readableFont = !prefs.readableFont; save(); });
    panel.querySelector('#a11yReset').addEventListener('click', function () {
      prefs = {};
      save();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
