// Cookie consent for the Facebook (Meta) Pixel. The pixel is never loaded until
// the visitor agrees; before that, fbq() simply doesn't exist, so the existing
// "Lead" click-tracking script (which already checks `typeof fbq !== 'function'`)
// stays a silent no-op on its own -- no change needed there.
// Choice is remembered in localStorage so the banner shows once per browser.
(function () {
  var KEY = 'hv_consent'; // 'granted' | 'denied'
  var PIXEL_ID = '1531256248310049';

  function loadPixel() {
    if (window.fbq) return; // already loaded
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function remember(choice) {
    try { localStorage.setItem(KEY, choice); } catch (e) {}
  }
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function showBanner() {
    var STYLE = document.createElement('style');
    STYLE.textContent =
      '.hv-cookie-bar{position:fixed; inset-inline:0; bottom:0; z-index:200; ' +
      'background:#015c78; color:#fff; padding:14px 18px; display:flex; gap:14px; ' +
      'align-items:center; justify-content:center; flex-wrap:wrap; font-family:"Rubik",sans-serif; ' +
      'font-size:0.9rem; box-shadow:0 -4px 18px rgba(0,0,0,0.18)}' +
      '.hv-cookie-bar a{color:#fff; text-decoration:underline}' +
      '.hv-cookie-bar button{border:0; border-radius:999px; padding:9px 20px; font:inherit; ' +
      'font-weight:700; cursor:pointer}' +
      '.hv-cookie-accept{background:#fff; color:#015c78}' +
      '.hv-cookie-decline{background:rgba(255,255,255,0.14); color:#fff}';
    document.head.appendChild(STYLE);

    var bar = document.createElement('div');
    bar.className = 'hv-cookie-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'הודעת עוגיות');
    bar.innerHTML =
      '<span>האתר משתמש בעוגיות מעקב שיווקי (Facebook) לשיפור הפרסום. ' +
      'אפשר לקרוא ב<a href="privacy-policy.html">מדיניות הפרטיות</a>.</span>' +
      '<button type="button" class="hv-cookie-accept">מאשר/ת</button>' +
      '<button type="button" class="hv-cookie-decline">לא תודה</button>';
    document.body.appendChild(bar);

    bar.querySelector('.hv-cookie-accept').addEventListener('click', function () {
      remember('granted');
      loadPixel();
      bar.remove();
    });
    bar.querySelector('.hv-cookie-decline').addEventListener('click', function () {
      remember('denied');
      bar.remove();
    });
  }

  var choice = stored();
  if (choice === 'granted') {
    loadPixel();
  } else if (choice !== 'denied') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
