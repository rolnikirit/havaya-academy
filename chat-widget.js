(function () {
  var STYLE = document.createElement('style');
  STYLE.textContent = `
    .hv-chat-btn{position:fixed; bottom:22px; right:22px; z-index:150; width:58px; height:58px; border-radius:50%;
      background:linear-gradient(135deg,#015c78,#0093ab); box-shadow:0 8px 24px rgba(1,92,120,0.35); border:0; cursor:pointer;
      display:flex; align-items:center; justify-content:center; transition:transform 180ms ease}
    .hv-chat-btn:hover{transform:translateY(-2px) scale(1.04)}
    .hv-chat-btn svg{width:26px; height:26px}
    .hv-chat-panel{position:fixed; bottom:92px; right:22px; z-index:150; width:340px; max-width:calc(100vw - 32px);
      height:480px; max-height:calc(100vh - 130px); background:#fff; border-radius:20px; box-shadow:0 20px 50px rgba(1,92,120,0.28);
      display:none; flex-direction:column; overflow:hidden; font-family:'Rubik',sans-serif; direction:rtl}
    .hv-chat-panel.open{display:flex}
    .hv-chat-head{background:linear-gradient(135deg,#015c78,#0093ab); color:#fff; padding:14px 18px; display:flex; align-items:center; justify-content:space-between}
    .hv-chat-head-title{font-weight:800; font-size:0.95rem}
    .hv-chat-head-sub{font-size:0.72rem; opacity:0.85; margin-top:2px}
    .hv-chat-close{background:none; border:0; color:#fff; cursor:pointer; font-size:1.3rem; line-height:1; padding:4px}
    .hv-chat-body{flex:1; overflow-y:auto; padding:14px; background:#faf3e0; display:flex; flex-direction:column; gap:10px}
    .hv-msg{max-width:82%; padding:10px 14px; border-radius:14px; font-size:0.88rem; line-height:1.6; white-space:pre-wrap}
    .hv-msg.bot{align-self:flex-start; background:#fff; color:#3c5058; border:1px solid rgba(1,108,145,0.1); border-bottom-right-radius:4px}
    .hv-msg.user{align-self:flex-end; background:#015c78; color:#fff; border-bottom-left-radius:4px}
    .hv-msg.typing{align-self:flex-start; background:#fff; color:#6b7d80; font-style:italic}
    .hv-chat-foot{display:flex; gap:8px; padding:10px; border-top:1px solid rgba(1,108,145,0.08); background:#fff}
    .hv-chat-input{flex:1; border:1px solid rgba(1,108,145,0.2); border-radius:20px; padding:9px 14px; font-size:0.88rem; font-family:inherit; resize:none; outline:none}
    .hv-chat-input:focus{border-color:#0093ab}
    .hv-chat-send{background:#015c78; color:#fff; border:0; border-radius:50%; width:38px; height:38px; flex-shrink:0; cursor:pointer; display:flex; align-items:center; justify-content:center}
    .hv-chat-send:disabled{opacity:0.5; cursor:default}
    @media(max-width:480px){
      .hv-chat-panel{width:calc(100vw - 24px); right:12px; bottom:82px; height:calc(100vh - 160px)}
      .hv-chat-btn{right:14px; bottom:14px}
    }
  `;
  document.head.appendChild(STYLE);

  var btn = document.createElement('button');
  btn.className = 'hv-chat-btn';
  btn.setAttribute('aria-label', 'שאלי אותי על הקורסים');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v12H7l-3 3V4z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'hv-chat-panel';
  panel.innerHTML = `
    <div class="hv-chat-head">
      <div>
        <div class="hv-chat-head-title">שאלי אותי על הקורסים</div>
        <div class="hv-chat-head-sub">עוזר דיגיטלי של הוויה</div>
      </div>
      <button class="hv-chat-close" aria-label="סגירה">&times;</button>
    </div>
    <div class="hv-chat-body" id="hvChatBody"></div>
    <div class="hv-chat-foot">
      <textarea class="hv-chat-input" id="hvChatInput" rows="1" placeholder="כתבי שאלה..." aria-label="הקלידי שאלה"></textarea>
      <button class="hv-chat-send" id="hvChatSend" aria-label="שליחה">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M20 4 3 11l6 2.5M20 4l-7 16-4-7.5M20 4 9 13.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var body = panel.querySelector('#hvChatBody');
  var input = panel.querySelector('#hvChatInput');
  var sendBtn = panel.querySelector('#hvChatSend');
  var closeBtn = panel.querySelector('.hv-chat-close');
  var history = [];
  var opened = false;

  function addMsg(role, text) {
    var el = document.createElement('div');
    el.className = 'hv-msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function openPanel() {
    panel.classList.add('open');
    if (!opened) {
      opened = true;
      addMsg('bot', 'היי! אפשר לשאול אותי על קורסים ועל הטיפולים האישיים, מחירים ולוחות זמנים. במה אפשר לעזור?');
    }
    input.focus();
  }

  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? panel.classList.remove('open') : openPanel();
  });
  closeBtn.addEventListener('click', function () { panel.classList.remove('open'); });

  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', send);

  function send() {
    var text = input.value.trim();
    if (!text || sendBtn.disabled) return;
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    var typing = document.createElement('div');
    typing.className = 'hv-msg typing';
    typing.textContent = 'כותבת תשובה...';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-10) }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing.remove();
        var reply = data.reply || 'מצטערת, לא הצלחתי לענות כרגע. אפשר לפנות ישירות לאירית בוואטסאפ: 050-4084159.';
        addMsg('bot', reply);
        history.push({ role: 'assistant', content: reply });
      })
      .catch(function () {
        typing.remove();
        addMsg('bot', 'מצטערת, הייתה תקלה. אפשר לפנות ישירות לאירית בוואטסאפ: 050-4084159.');
      })
      .finally(function () { sendBtn.disabled = false; });
  }
})();
