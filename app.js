(function() {
  function showToast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { el.hidden = true; }, 1600);
  }

  function containsCJK(str) {
    return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3000-\u303f]/.test(str);
  }

  function sanitizePastedText(text) {
    return text.replace(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3000-\u303f]+/g, '');
  }

  let PINYIN_DICT = {
    ni: ['你','呢','泥','妮','拟','逆'],
    wo: ['我','握','窝','沃','卧'],
    ta: ['他','她','它','塔','拓'],
    men: ['们','门','闷'],
    zhong: ['中','钟','忠','种','众'],
    guo: ['国','过','郭','果','锅'],
    hao: ['好','号','浩','豪','毫'],
    shi: ['是','时','市','事','十','使','史'],
    de: ['的','得','德'],
    ai: ['爱','矮','挨','哎'],
    xue: ['学','雪','穴','靴'],
    sheng: ['生','声','升','圣','胜']
  };

  const input = document.getElementById('ime-input');
  const candidatesEl = document.getElementById('candidates');
  const composingEl = document.getElementById('composing');
  const outputEl = document.getElementById('committed-output');

  let composing = '';
  let candidateList = [];
  let pageIndex = 0; // 0-based page
  const pageSize = 9;

  fetch('./pinyin_dict.json').then(r => r.ok ? r.json() : null).then(json => {
    if (json && typeof json === 'object') PINYIN_DICT = json;
  }).catch(() => {});

  function renderComposing() {
    if (candidateList.length) {
      const start = pageIndex * pageSize + 1;
      const end = Math.min(candidateList.length, (pageIndex + 1) * pageSize);
      composingEl.textContent = `Hanzi 汉字: ${start}-${end} / ${candidateList.length}  (←/→ page, 1-9 select)`;
    } else {
      composingEl.textContent = '';
    }
  }

  function renderCandidates() {
    candidatesEl.innerHTML = '';
    if (!candidateList.length) return;
    const start = pageIndex * pageSize;
    const pageItems = candidateList.slice(start, start + pageSize);
    pageItems.forEach((hanzi, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'candidate';
      btn.textContent = `${idx + 1}. ${hanzi}`;
      btn.setAttribute('role', 'option');
      btn.addEventListener('click', () => selectCandidate(start + idx));
      candidatesEl.appendChild(btn);
    });
  }

  function updateComposingFromTextarea() {
    const value = input.value;
    const m = value.match(/([a-zA-Z]+)$/);
    composing = m ? m[1].toLowerCase() : '';
    candidateList = composing ? (PINYIN_DICT[composing] || []) : [];
    pageIndex = 0;
    renderComposing();
    renderCandidates();
  }

  function appendCommittedChip(char) {
    const chip = document.createElement('span');
    chip.className = 'hanzi-chip';
    const span = document.createElement('span');
    span.className = 'hanzi-char';
    span.textContent = char;
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'hanzi-remove';
    x.setAttribute('aria-label', 'remove');
    x.textContent = '×';
    x.addEventListener('click', () => {
      outputEl.removeChild(chip);
    });
    chip.appendChild(span);
    chip.appendChild(x);
    outputEl.appendChild(chip);
  }

  function selectCandidate(globalIdx) {
    if (!candidateList.length) return;
    const chosen = candidateList[globalIdx];
    if (!chosen) return;
    appendCommittedChip(chosen);
    const value = input.value;
    if (composing) {
      input.value = value.slice(0, value.length - composing.length);
    }
    composing = '';
    candidateList = [];
    pageIndex = 0;
    renderComposing();
    renderCandidates();
    input.focus();
  }

  input.addEventListener('keydown', (e) => {
    if (candidateList.length) {
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const idx = parseInt(e.key, 10) - 1;
        const globalIdx = pageIndex * pageSize + idx;
        if (globalIdx < candidateList.length) selectCandidate(globalIdx);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const maxPage = Math.max(0, Math.ceil(candidateList.length / pageSize) - 1);
        if (pageIndex < maxPage) pageIndex += 1; else pageIndex = 0;
        renderComposing();
        renderCandidates();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const maxPage = Math.max(0, Math.ceil(candidateList.length / pageSize) - 1);
        if (pageIndex > 0) pageIndex -= 1; else pageIndex = maxPage;
        renderComposing();
        renderCandidates();
        return;
      }
      if (e.key === 'Escape') {
        composing = '';
        candidateList = [];
        pageIndex = 0;
        renderComposing();
        renderCandidates();
        return;
      }
    }
    if (containsCJK(e.key)) {
      e.preventDefault();
      showToast('Type pinyin and select candidates.');
    }
  });

  input.addEventListener('input', updateComposingFromTextarea);

  renderComposing();
  renderCandidates();
})(); 