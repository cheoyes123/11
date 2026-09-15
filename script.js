document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 제품 데이터 (온연 ONYEON 리브랜딩 라인업) ---
  const products = [
    {
      id: 'p1',
      category: 'incense',
      name: '온연 녹턴 딥 슬립 인센스 스틱 & 브라스 버너 세트',
      categoryName: 'BOTANICAL INCENSE',
      price: 42000,
      image: 'images/incense_real.jpg',
      badge: 'BESTSELLER',
      scent: 'Top: 프렌치 라벤더 | Heart: 팔로산토 | Base: 샌달우드 & 천연 침향',
      desc: '과열된 뇌파를 알파파로 유도하는 100% 천연 수제 인센스. 맑은 훈향으로 침실의 탁한 공기를 비우고 따뜻한 이완을 선물합니다.',
      topNote: 'French Lavender, Bergamot',
      heartNote: 'Palo Santo, Clary Sage',
      baseNote: 'Sandalwood, Agarwood, Cedar'
    },
    {
      id: 'p2',
      category: 'mist',
      name: '온연 루나 아우라 슬립 필로우 미스트 (100ml)',
      categoryName: 'PILLOW & BEDDING MIST',
      price: 38000,
      image: 'images/pillow_mist_real.jpg',
      badge: 'NIGHT ESSENTIAL',
      scent: 'Top: 로만 캐모마일 | Heart: 네롤리 | Base: 스위트 앰버',
      desc: '잠들기 전 베개와 침구에 2~3회 분사하여 온화한 온기의 수면 아우라를 형성하는 무알콜 식물성 미스트.',
      topNote: 'Roman Chamomile, Sweet Orange',
      heartNote: 'Neroli, Lavender Bloom',
      baseNote: 'Warm Amber, White Musk'
    },
    {
      id: 'p3',
      category: 'oil',
      name: '온연 보태니컬 카밍 나이트 에센스 오일 (50ml)',
      categoryName: 'THERAPY BEAUTY OIL',
      price: 56000,
      image: 'images/calming_oil_real.jpg',
      badge: 'RESTORATIVE',
      scent: 'Top: 블루탠지 | Heart: 베티버 | Base: 유기농 호호바',
      desc: '수면 중 피부 재생 사이클을 극대화하고 관자놀이와 목선의 긴장을 부드럽게 풀어주는 고농축 페이셜 & 바디 힐링 오일.',
      topNote: 'Blue Tansy, Marjoram',
      heartNote: 'Haitian Vetiver, Geranium',
      baseNote: 'Cold-pressed Jojoba, Rosehip'
    },
    {
      id: 'p4',
      category: 'incense',
      name: '온연 문스톤 세라믹 디퓨저 & 나이트 드롭 세트',
      categoryName: 'CERAMIC STONE DIFFUSER',
      price: 65000,
      image: 'images/stone_diffuser_real.jpg',
      badge: 'LUXURY GIFT',
      scent: 'Top: 화이트 시더 | Heart: 히노끼 | Base: 프랑킨센스',
      desc: '불꽃 없이 안전하게 밤새 맑은 피톤치드와 인센스 온기를 머금는 핸드메이드 문스톤 화산석 디퓨저.',
      topNote: 'Hinoki Cypress, Pine Needle',
      heartNote: 'White Cedar, Frankincense',
      baseNote: 'Oakmoss, Patchouli'
    }
  ];

  // --- 2. 제품 그리드 렌더링 ---
  const productGrid = document.getElementById('productGrid');
  const filterTabs = document.querySelectorAll('.tab-btn');

  function renderProducts(filter = 'all') {
    productGrid.innerHTML = '';
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card glass-panel';
      card.innerHTML = `
        <div class="product-image-box">
          <span class="badge-tag">${p.badge}</span>
          <img src="${p.image}" alt="${p.name}" class="product-photo-img" loading="lazy" />
          <div class="photo-overlay-glow"></div>
          <div class="scent-notes-pill">${p.scent}</div>
        </div>
        <div class="product-info">
          <span class="product-category">${p.categoryName}</span>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-price-row">
            <span class="price-text">₩${p.price.toLocaleString()}</span>
            <div class="card-actions">
              <button class="btn-quickview" data-id="${p.id}">노트 상세</button>
              <button class="btn-add-cart" data-id="${p.id}">담기 ✦</button>
            </div>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
    });

    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
    document.querySelectorAll('.btn-quickview').forEach(btn => {
      btn.addEventListener('click', () => openQuickView(btn.dataset.id));
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProducts(tab.dataset.filter);
    });
  });

  renderProducts();

  // --- 3. 브랜드 가이드북 컬러 스와치 클릭 시 HEX 복사 ---
  const colorSwatches = document.querySelectorAll('.color-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', async () => {
      const hex = swatch.dataset.hex;
      try {
        await navigator.clipboard.writeText(hex);
        showToast(`🎨 컬러 코드 [${hex}]가 복사되었습니다!`);
      } catch (e) {
        showToast(`컬러: ${hex}`);
      }
    });
  });

  // --- 4. 장바구니 로직 ---
  let cart = [];
  const cartCount = document.getElementById('cartCount');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const toast = document.getElementById('toast');

  function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    if (!item) return;

    cart.push(item);
    updateCartUI();
    showToast(`'${item.name}' 제품이 장바구니에 담겼습니다 ✦`);
  }

  function updateCartUI() {
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-cart-msg">카트에 담긴 제품이 없습니다.<br>오늘 밤을 위한 온기 테라피 제품을 담아보세요.</div>';
      cartTotalPrice.textContent = '₩0';
      return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
      total += item.price;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${item.image}" alt="${item.name}" style="width:40px; height:40px; border-radius:8px; object-fit:cover; border:1px solid rgba(255,255,255,0.1);" />
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">₩${item.price.toLocaleString()}</div>
          </div>
        </div>
        <button class="cart-item-remove" data-index="${index}">삭제</button>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartTotalPrice.textContent = `₩${total.toLocaleString()}`;

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        cart.splice(idx, 1);
        updateCartUI();
      });
    });
  }

  cartTriggerBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
  cartCloseBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) cartOverlay.classList.remove('active');
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('카트에 담긴 제품이 없습니다.');
      return;
    }
    alert(`총 ${cart.length}개 제품(₩${cart.reduce((a,b)=>a+b.price,0).toLocaleString()}) 주문이 접수되었습니다.\n온연(溫然)의 따스한 온기와 함께 오늘 밤 깊은 쉼을 누리세요.`);
    cart = [];
    updateCartUI();
    cartOverlay.classList.remove('active');
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // --- 5. 퀵뷰 상세 모달 ---
  const quickViewOverlay = document.getElementById('quickViewOverlay');
  const quickViewContent = document.getElementById('quickViewContent');

  function openQuickView(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    quickViewContent.innerHTML = `
      <button class="cart-close-btn" id="qvClose" style="position: absolute; top: 16px; right: 20px;">&times;</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 100%; height: 220px; border-radius: 16px; overflow: hidden; margin-bottom: 14px; position: relative;">
          <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 60%, rgba(16,11,23,0.85) 100%);"></div>
        </div>
        <span class="product-category" style="display: block; margin-top: 4px;">${p.categoryName}</span>
        <h2 style="font-family: 'Noto Serif KR', serif; font-size: 1.35rem; margin: 6px 0;">${p.name}</h2>
        <p style="color: #e0a96d; font-weight: 700; font-size: 1.2rem;">₩${p.price.toLocaleString()}</p>
      </div>

      <div style="background: rgba(255,255,255,0.04); padding: 18px; border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(224,169,109,0.2);">
        <h4 style="font-size: 0.82rem; color: #f7f3eb; margin-bottom: 10px; letter-spacing: 1px;">✦ SCENT PYRAMID (향기 피라미드)</h4>
        <div style="font-size: 0.88rem; line-height: 1.8;">
          <div><strong style="color: #e0a96d;">TOP:</strong> ${p.topNote}</div>
          <div><strong style="color: #c084fc;">HEART:</strong> ${p.heartNote}</div>
          <div><strong style="color: #cbd5e1;">BASE:</strong> ${p.baseNote}</div>
        </div>
      </div>

      <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">${p.desc}</p>

      <button class="btn btn-luxury" id="qvAddToCart" style="width: 100%;">이 제품 장바구니에 담기 (₩${p.price.toLocaleString()})</button>
    `;

    quickViewOverlay.classList.add('active');

    document.getElementById('qvClose').addEventListener('click', () => quickViewOverlay.classList.remove('active'));
    document.getElementById('qvAddToCart').addEventListener('click', () => {
      addToCart(p.id);
      quickViewOverlay.classList.remove('active');
    });
  }

  quickViewOverlay.addEventListener('click', (e) => {
    if (e.target === quickViewOverlay) quickViewOverlay.classList.remove('active');
  });

  // --- 6. 수면 진단 퀴즈 ---
  const quizIntro = document.getElementById('quizIntro');
  const quizBody = document.getElementById('quizBody');
  const quizResult = document.getElementById('quizResult');
  const startQuizBtn = document.getElementById('startQuizBtn');
  const retryQuizBtn = document.getElementById('retryQuizBtn');
  const progressFill = document.getElementById('progressFill');
  const stepIndicator = document.getElementById('stepIndicator');
  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('optionsContainer');
  const resultType = document.getElementById('resultType');
  const resultDesc = document.getElementById('resultDesc');
  const recProductBox = document.getElementById('recProductBox');

  const quizQuestions = [
    {
      q: '어떤 수면 문제를 가장 자주 겪고 계신가요?',
      options: [
        { text: '잠들기까지 1시간 이상 뒤척이며 잡생각이 많음', type: 'overthinking' },
        { text: '자다가 작은 소리에도 자주 깨고 아침에 피곤함', type: 'shallow' },
        { text: '스트레스와 근육 긴장으로 온몸이 뻐근함', type: 'tension' }
      ]
    },
    {
      q: '선호하는 밤의 향기 계열은 무엇인가요?',
      options: [
        { text: '따뜻하고 그윽한 나무와 흙내음 (우디 & 샌달우드)', type: 'woody' },
        { text: '은은하고 편안한 허브 꽃향 (라벤더 & 캐모마일)', type: 'floral' },
        { text: '맑고 고요한 숲속의 피톤치드 (히노끼 & 시더)', type: 'forest' }
      ]
    },
    {
      q: '침실에서 가장 선호하는 힐링 방식은?',
      options: [
        { text: '피어오르는 훈향을 바라보며 마음 비우기 (인센스)', type: 'incense' },
        { text: '베개와 침구에 간편하게 뿌리고 바로 눕기 (필로우 미스트)', type: 'mist' },
        { text: '손과 목을 부드럽게 마사지하며 호흡하기 (오일)', type: 'oil' }
      ]
    }
  ];

  let currentStep = 0;
  let userAnswers = [];

  startQuizBtn.addEventListener('click', () => {
    quizIntro.classList.add('hidden');
    quizBody.classList.remove('hidden');
    currentStep = 0;
    userAnswers = [];
    showQuestion(0);
  });

  function showQuestion(step) {
    progressFill.style.width = `${((step + 1) / quizQuestions.length) * 100}%`;
    stepIndicator.textContent = `QUESTION ${step + 1} / ${quizQuestions.length}`;
    const cur = quizQuestions[step];
    questionText.textContent = cur.q;
    optionsContainer.innerHTML = '';

    cur.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span>${opt.text}</span><span>✦</span>`;
      btn.addEventListener('click', () => {
        userAnswers.push(opt.type);
        if (currentStep < quizQuestions.length - 1) {
          currentStep++;
          showQuestion(currentStep);
        } else {
          showResult();
        }
      });
      optionsContainer.appendChild(btn);
    });
  }

  function showResult() {
    quizBody.classList.add('hidden');
    quizResult.classList.remove('hidden');

    let recProduct = products[0];
    if (userAnswers.includes('shallow') || userAnswers.includes('mist')) {
      recProduct = products[1];
      resultType.textContent = '수면 유지가 어려운 얕은 수면형';
      resultDesc.textContent = '깊은 렘수면 단계로 진입하지 못하는 당신에게는 호흡할 때마다 뇌를 진정시키는 [온연 루나 아우라 필로우 미스트]가 가장 효과적입니다.';
    } else if (userAnswers.includes('tension') || userAnswers.includes('oil')) {
      recProduct = products[2];
      resultType.textContent = '스트레스 긴장형 & 바디 피로 누적형';
      resultDesc.textContent = '몸의 뭉친 긴장을 풀고 피부 장벽을 회복시켜주는 블루탠지 & 베티버 처방의 [온연 보태니컬 카밍 나이트 오일]을 추천합니다.';
    } else {
      recProduct = products[0];
      resultType.textContent = '만성 각성형 & 잡생각 이완 필요형';
      resultDesc.textContent = '밤마다 과열된 뇌파를 잠재우는 샌달우드와 침향의 맑은 훈향, [온연 녹턴 딥 슬립 인센스 스틱]이 당신에게 깊은 평온을 선사합니다.';
    }

    recProductBox.innerHTML = `
      <img src="${recProduct.image}" alt="${recProduct.name}" style="width: 75px; height: 75px; border-radius: 12px; object-fit: cover; border: 1px solid rgba(224,169,109,0.3);" />
      <div style="flex:1;">
        <div class="rec-title">${recProduct.name}</div>
        <div class="rec-price">₩${recProduct.price.toLocaleString()}</div>
      </div>
      <button class="btn btn-luxury" id="recAddToCartBtn">처방 제품 담기</button>
    `;

    document.getElementById('recAddToCartBtn').addEventListener('click', () => {
      addToCart(recProduct.id);
    });
  }

  retryQuizBtn.addEventListener('click', () => {
    quizResult.classList.add('hidden');
    quizIntro.classList.remove('hidden');
  });

  // --- 7. Web Audio API 수면 온기 ASMR 사운드 ---
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');
  let audioCtx = null;
  let isPlaying = false;
  let noiseNode = null;
  let gainNode = null;

  function toggleSound() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!isPlaying) {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04;
        b6 = white * 0.115926;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, audioCtx.currentTime);

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 2);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start();
      isPlaying = true;
      soundToggleBtn.classList.add('playing');
      soundLabel.textContent = 'Sleep ASMR : ON';
      showToast('🌙 온연 수면 유도 앰비언트 온기 사운드가 재생됩니다.');
    } else {
      if (gainNode) {
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        setTimeout(() => {
          if (noiseNode) noiseNode.stop();
          isPlaying = false;
          soundToggleBtn.classList.remove('playing');
          soundLabel.textContent = 'Sleep ASMR : OFF';
        }, 1000);
      }
    }
  }

  soundToggleBtn.addEventListener('click', toggleSound);

  // --- 8. 별빛 캔버스 애니메이션 ---
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  for (let i = 0; i < 70; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.015 + 0.005
    });
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 0.8 || star.alpha < 0.2) star.speed = -star.speed;

      ctx.save();
      ctx.globalAlpha = Math.max(0, star.alpha);
      ctx.fillStyle = '#f7f3eb';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#e0a96d';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
});
