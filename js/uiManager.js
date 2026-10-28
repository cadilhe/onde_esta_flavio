// uiManager.js - Gerenciador de Interface, Modais, Efeito Typewriter e Diálogos

class UIManager {
  constructor() {
    this.typewriterInterval = null;
    this.isTyping = false;

    // Elementos principais do DOM
    this.elPortraitImg = document.getElementById('portrait-img');
    this.elPortraitLabel = document.getElementById('portrait-label');
    this.elDossierText = document.getElementById('dossier-text');
    this.elDaysCounter = document.getElementById('days-counter');
    this.elLocationIndicator = document.getElementById('location-indicator');
    this.elWindowSubtitle = document.getElementById('window-subtitle');

    // Modais
    this.modalOverlay = document.getElementById('modal-overlay');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.modalActions = document.getElementById('modal-actions');
    this.modalCloseBtn = document.getElementById('modal-close-btn');

    // Scrollbar retrô
    this.btnScrollUp = document.getElementById('scroll-up');
    this.btnScrollDown = document.getElementById('scroll-down');
    this.setupScrollbar();

    // Toggle scanlines e áudio
    this.btnToggleScanlines = document.getElementById('btn-toggle-scanlines');
    this.btnToggleAudio = document.getElementById('btn-toggle-audio');
    this.setupTopControls();
  }

  setupScrollbar() {
    if (this.btnScrollUp && this.btnScrollDown) {
      this.btnScrollUp.addEventListener('click', () => {
        if (this.elDossierText) this.elDossierText.scrollTop -= 60;
        window.audioSynth.playButtonClick();
      });
      this.btnScrollDown.addEventListener('click', () => {
        if (this.elDossierText) this.elDossierText.scrollTop += 60;
        window.audioSynth.playButtonClick();
      });
    }
  }

  setupTopControls() {
    if (this.btnToggleScanlines) {
      this.btnToggleScanlines.addEventListener('click', () => {
        const overlay = document.getElementById('scanlines-overlay');
        if (overlay) {
          overlay.classList.toggle('hidden');
          window.audioSynth.playButtonClick();
        }
      });
    }

    if (this.btnToggleAudio) {
      this.btnToggleAudio.addEventListener('click', () => {
        const muted = window.audioSynth.toggleMute();
        this.btnToggleAudio.textContent = muted ? '🔇 SOM: OFF' : '🔊 SOM: ON';
      });
    }

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
  }

  // Efeito de Digitação Teletype Clássico
  typeText(text, onComplete = null, speed = 12) {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }

    this.isTyping = true;
    this.elDossierText.innerHTML = '';
    let index = 0;

    this.typewriterInterval = setInterval(() => {
      if (index < text.length) {
        const char = text.charAt(index);
        this.elDossierText.innerHTML += char === '\n' ? '<br>' : char;
        this.elDossierText.scrollTop = this.elDossierText.scrollHeight;

        // Som de tecla sutil a cada 2 caracteres
        if (index % 2 === 0 && char !== ' ' && char !== '\n') {
          window.audioSynth.playKeyClick();
        }

        index++;
      } else {
        clearInterval(this.typewriterInterval);
        this.isTyping = false;
        if (onComplete) onComplete();
      }
    }, speed);
  }

  // Atualiza cena principal para a cidade atual
  renderCurrentLocation() {
    const state = window.GAME_DATA.state;
    const city = window.GAME_DATA.cities[state.localAtual];
    if (!city) return;

    // Atualiza retrato e rótulo
    this.elPortraitImg.src = city.retrato;
    this.elPortraitLabel.textContent = city.nomeRetrato;

    // Atualiza indicadores de status
    this.elDaysCounter.textContent = `DIAS ANTES DA PRESCRIÇÃO: ${state.tempoMaximo}`;
    this.elLocationIndicator.textContent = `LOCAL: ${city.regiao.toUpperCase()}`;
    this.elWindowSubtitle.textContent = `DOSSIÊ - ${city.regiao.toUpperCase()}`;

    // Digita descrição padrão do paradeiro
    this.typeText(city.descricaoPadrao);

    // Se estiver em Miami e o jogador tiver 3+ provas, prepara clímax
    if (state.localAtual === 'miami' && state.evidenciasColetadas.length >= 3) {
      setTimeout(() => {
        this.triggerClimaxArrest();
      }, 4000);
    }
  }

  // Modal genérico
  openModal(title, contentHtml, actionsHtml = '') {
    this.modalTitle.textContent = title;
    this.modalBody.innerHTML = contentHtml;
    this.modalActions.innerHTML = actionsHtml || '<button class="retro-btn" onclick="uiManager.closeModal()">[ FECHAR ]</button>';
    this.modalOverlay.classList.remove('hidden');
    window.audioSynth.playButtonClick();
  }

  closeModal() {
    this.modalOverlay.classList.add('hidden');
    window.audioSynth.playButtonClick();
  }

  // 1. Menu de Investigação [INVESTIGAR]
  openInvestigateMenu() {
    const state = window.GAME_DATA.state;
    const city = window.GAME_DATA.cities[state.localAtual];

    let html = `
      <p style="margin-bottom: 14px; color: #aaa;">Selecione um local ou testemunha para interrogar no <b>${city.nome}</b>:</p>
      <div class="choice-list">
    `;

    city.investigacoes.forEach(inv => {
      const feita = state.investigacoesFeitas.includes(inv.id);
      html += `
        <div class="choice-item" onclick="uiManager.executeInvestigation('${inv.id}')">
          <div class="choice-icon">${inv.icone}</div>
          <div class="choice-info">
            <div class="choice-title">${inv.nome} ${feita ? '✔️ (REVISITAR)' : '🔎'}</div>
            <div class="choice-desc">${feita ? 'Depoimento já coletado no dossiê.' : 'Ouvir testemunha e colher provas.'}</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.openModal(`INVESTIGAR - ${city.nome.toUpperCase()}`, html);
  }

  executeInvestigation(invId) {
    const state = window.GAME_DATA.state;
    const city = window.GAME_DATA.cities[state.localAtual];
    const inv = city.investigacoes.find(i => i.id === invId);
    if (!inv) return;

    this.closeModal();

    // Registra investigação feita
    if (!state.investigacoesFeitas.includes(invId)) {
      state.investigacoesFeitas.push(invId);
    }

    // Coleta evidência se houver e ainda não tiver sido obtida
    let novaEvidencia = false;
    if (inv.revelaEvidencia) {
      const jaPossui = state.evidenciasColetadas.some(e => e.id === inv.revelaEvidencia.id);
      if (!jaPossui) {
        state.evidenciasColetadas.push(inv.revelaEvidencia);
        novaEvidencia = true;
      }
    }

    // Exibe diálogo na janela principal
    let textoExibicao = `${inv.dialogo}`;
    if (novaEvidencia) {
      textoExibicao += `\n\n🚨 [NOVA EVIDÊNCIA ANEXADA AO DOSSIÊ DA PF]:\n▶ "${inv.revelaEvidencia.titulo.toUpperCase()}"`;
    }

    this.typeText(textoExibicao, () => {
      if (novaEvidencia) {
        window.audioSynth.playClueFound();
      }
    });
  }

  // 2. Mapa Tático Mundial [VER MAPA]
  openTacticalMap() {
    const html = `
      <div style="text-align: center; margin-bottom: 10px;">
        <p style="color: #00ffaa; font-size: 16px;">SISTEMA DE RASTREAMENTO GLOBAL DA POLÍCIA FEDERAL / INTERPOL</p>
      </div>
      <div style="width: 100%; display: flex; justify-content: center; background: #000; padding: 6px; border: 2px solid #555c70;">
        <canvas id="tactical-canvas" width="600" height="300" style="width: 100%; max-width: 600px; height: auto; image-rendering: pixelated;"></canvas>
      </div>
      <div style="margin-top: 12px; font-size: 17px; color: #ccc;">
        <p>• <b>Linhas Vermelhas Pontilhadas:</b> Trajetórias e voos rastreados do investigado.</p>
        <p>• <b>Marcador Amarelo:</b> Posição atual da equipe policial.</p>
        <p>• <b>Pontos Verdes:</b> Bases e cidades já vistoriadas.</p>
      </div>
    `;

    this.openModal("MAPA TÁTICO MUNDIAL - INTERPOL", html);

    setTimeout(() => {
      if (window.gameMap) {
        window.gameMap.drawTacticalMap('tactical-canvas');
      }
    }, 100);
  }

  // 3. Dossiê Policial da Interpol / PF [INTERPOL / PF]
  openInterpolDossier() {
    const state = window.GAME_DATA.state;

    let html = `
      <div style="margin-bottom: 14px; border-bottom: 2px solid #555c70; padding-bottom: 10px;">
        <p style="color: var(--text-yellow); font-size: 18px; margin-bottom: 4px;">OPERAÇÃO "CHOCOLATE AMARGO" - INQUÉRITO PF Nº 2026/01</p>
        <p style="font-size: 16px; color: #aaa;">Investigado Principal: <b>Senador Flávio Nantes Bolsonaro</b> (Vulgo "Zero Um")</p>
        <p style="font-size: 16px; color: #aaa;">Status Judicial: <b>MANDADO DE PRISÃO PREVENTIVA EXPEDIDO</b> (Necessita de 3+ provas para homologação em Miami)</p>
      </div>

      <p style="font-family: var(--font-retro); font-size: 11px; color: #fff; margin-bottom: 10px;">EVIDÊNCIAS COLETADAS (${state.evidenciasColetadas.length}/4):</p>
      <div class="evidence-grid">
    `;

    // As 4 evidências chave
    const todasEvidencias = [
      { id: "extrato_rachadinha", icone: "📄", nome: "Extrato da Rachadinha", desc: "Depósitos fracionados de 48 assessores na ALERJ somando R$ 2,7 milhões." },
      { id: "recibo_chocolate", icone: "🍫", nome: "Depósitos em Dinheiro Vivo", desc: "Comprovantes de dezenas de depósitos de R$ 100 em espécie na loja de chocolates." },
      { id: "cheque_queiroz", icone: "📑", nome: "Cheques do Intermediário", desc: "Cheques de Fabrício Queiroz pagando despesas pessoais e mensagens de WhatsApp." },
      { id: "escritura_mansao", icone: "🏠", nome: "Escritura da Mansão de R$ 6M", desc: "Compra de mansão de luxo no Lago Sul com financiamento suspeito do BRB." }
    ];

    todasEvidencias.forEach(ev => {
      const coletada = state.evidenciasColetadas.find(e => e.id === ev.id);
      if (coletada) {
        html += `
          <div class="evidence-card collected">
            <div class="evidence-icon">${ev.icone}</div>
            <div class="evidence-title">✔️ ${ev.nome.toUpperCase()}</div>
            <div class="evidence-desc">${coletada.descricao || ev.desc}</div>
          </div>
        `;
      } else {
        html += `
          <div class="evidence-card">
            <div class="evidence-icon">❓</div>
            <div class="evidence-title">EM BUSCA: ${ev.nome.toUpperCase()}</div>
            <div class="evidence-desc">Evidência ainda não localizada. Investigue as testemunhas e locais das cidades.</div>
          </div>
        `;
      }
    });

    html += `</div>`;
    this.openModal("DOSSIÊ DE INVESTIGAÇÃO POLICIAL - PF", html);
  }

  // 4. Companhias Aéreas e Inteligência de Voo [COMPANHIAS AÉREAS]
  openAirlines() {
    const state = window.GAME_DATA.state;
    const city = window.GAME_DATA.cities[state.localAtual];

    let html = `
      <p style="margin-bottom: 14px; color: #aaa;">Terminal de Radar Aéreo - Aeroporto de <b>${city.nome}</b>:</p>
      <div class="choice-list">
    `;

    city.voosDisponiveis.forEach(voo => {
      html += `
        <div class="choice-item">
          <div class="choice-icon">✈️</div>
          <div class="choice-info">
            <div class="choice-title">${voo.cia} | VOO ${voo.voo} ➔ ${voo.nomeDestino.toUpperCase()}</div>
            <div class="choice-desc" style="color: ${voo.status === 'CONFIRMADO' ? '#00ffaa' : '#ffffaa'}">
              <b>STATUS:</b> ${voo.status} | <b>RELATÓRIO:</b> ${voo.pista}
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.openModal(`INTELIGÊNCIA DE VOOS - ${city.nome.toUpperCase()}`, html);
  }

  // 5. Menu de Viagem [VIAJAR]
  openTravelMenu() {
    const state = window.GAME_DATA.state;
    const city = window.GAME_DATA.cities[state.localAtual];

    let html = `
      <p style="margin-bottom: 14px; color: #aaa;">Selecione o destino do seu próximo voo. <b>Atenção:</b> Cada viagem consome 1 dia de investigação!</p>
      <div class="choice-list">
    `;

    city.destinosPossiveis.forEach(destId => {
      const destCity = window.GAME_DATA.cities[destId];
      if (destCity) {
        html += `
          <div class="choice-item" onclick="uiManager.executeTravel('${destId}')">
            <div class="choice-icon">🛫</div>
            <div class="choice-info">
              <div class="choice-title">EMBARCAR PARA: ${destCity.nome.toUpperCase()}</div>
              <div class="choice-desc">Custo: 1 Dia de Prazo Penal | Região: ${destCity.regiao}</div>
            </div>
          </div>
        `;
      }
    });

    html += `</div>`;
    this.openModal("TERMINAL DE EMBARQUE AÉREO", html);
  }

  // Executa Viagem
  executeTravel(destId) {
    const state = window.GAME_DATA.state;
    this.closeModal();

    // Reduz tempo
    state.tempoMaximo -= 1;
    state.diasConsumidos += 1;
    state.historicoViagens.push(destId);
    state.localAtual = destId;

    // Animação de Voo
    this.showFlightAnimation(destId, () => {
      // Verifica derrota por tempo
      if (state.tempoMaximo <= 0) {
        this.showGameOverPrescription();
        return;
      }

      this.renderCurrentLocation();
    });
  }

  // Tela de Animação de Decolagem
  showFlightAnimation(destId, onComplete) {
    const destCity = window.GAME_DATA.cities[destId];
    window.audioSynth.playFlightSwoosh();

    const html = `
      <div class="flight-anim-container">
        <div class="flight-plane-icon">✈️</div>
        <p style="font-family: var(--font-retro); font-size: 13px; color: var(--text-yellow); text-align: center;">
          EM VOO RUMO A: ${destCity.nome.toUpperCase()}...
        </p>
        <p style="font-size: 18px; color: #aaa;">Cruzando espaço aéreo. Investigadores consultando registros.</p>
      </div>
    `;

    this.openModal("DECOLAGEM EM ANDAMENTO", html, ' ');

    setTimeout(() => {
      this.closeModal();
      if (onComplete) onComplete();
    }, 1800);
  }

  // DERROTA: Prescrição Penal (Dias = 0)
  showGameOverPrescription() {
    window.audioSynth.playDefeatPrescription();

    const html = `
      <div style="text-align: center; padding: 10px;">
        <h2 style="font-family: var(--font-retro); color: var(--text-red); font-size: 16px; margin-bottom: 16px;">
          ⚖️ GAME OVER: PRESCRIÇÃO PENAL CONSUMADA!
        </h2>
        <div style="background: #111; border: 2px solid #555; padding: 14px; margin-bottom: 16px; text-align: justify; font-size: 19px;">
          O tempo estipulado pela lei expirou antes da conclusão do inquérito policial.<br><br>
          Por decurso de prazo e manobras protelatórias dos advogados, o processo foi arquivado no STF e todos os crimes prescreveram!<br><br>
          <b>O parlamentar comemora em uma lancha em Angra dos Reis comendo panetone de chocolate e tomando champanhe.</b>
        </div>
      </div>
    `;

    const actions = `
      <button class="retro-btn" onclick="game.restart()">[ TENTAR NOVAMENTE ]</button>
    `;

    this.openModal("PRESCRIÇÃO PENAL - DERROTA", html, actions);
  }

  // VITÓRIA PARCIAL: Prisão em Miami
  triggerClimaxArrest() {
    window.audioSynth.playPoliceSiren(5);
    window.audioSynth.playVictory();

    const state = window.GAME_DATA.state;

    const html = `
      <div style="text-align: center; padding: 10px;">
        <h2 style="font-family: var(--font-retro); color: #00ffaa; font-size: 16px; margin-bottom: 16px;">
          🚨 OPERAÇÃO CONCLUÍDA: PRISÃO EM MIAMI!
        </h2>
        <div style="background: #10241b; border: 2px solid #00ffaa; padding: 14px; margin-bottom: 16px; text-align: justify; font-size: 19px; color: #e0f2fe;">
          <b>PARABÉNS, AGENTE ESPECIAL!</b><br><br>
          Com as <b>${state.evidenciasColetadas.length} provas cruciais</b> reunidas (Rachadinhas na ALERJ, depósitos de chocolate em dinheiro vivo, cheques de Queiroz e a mansão no Lago Sul), a PF e a Interpol enquadraram Flávio Bolsonaro no resort em Miami Beach!<br><br>
          O mandado de extradição foi homologado e as algemas foram colocadas sob aplausos dos banhistas!
        </div>
        <p style="font-family: var(--font-retro); font-size: 10px; color: var(--text-yellow); animation: pulse-alert 1s infinite;">
          AGUARDANDO CONFIRMAÇÃO DO TRIBUNAL...
        </p>
      </div>
    `;

    this.openModal("VITÓRIA DA INVESTIGAÇÃO", html, ' ');

    // 4 segundos depois: O GRANDE PLOT TWIST JUDICIAL!
    setTimeout(() => {
      this.triggerTwistSupremeCourt();
    }, 4500);
  }

  // O GRANDE PLOT TWIST: Anulação Judicial e Habeas Corpus
  triggerTwistSupremeCourt() {
    window.audioSynth.playStampThud();

    const html = `
      <div class="twist-document">
        <div class="twist-header">
          <h2>SUPREMO TRIBUNAL FEDERAL</h2>
          <p>Gabinete do Ministro Relator • Habeas Corpus Coletivo com Efeito Suspensivo</p>
        </div>

        <div class="twist-body">
          <b>DECISÃO MONOCRÁTICA:</b><br><br>
          "Vistos etc. Acolho a preliminar arguida pela ilustre defesa técnica do Senador da República Flávio Nantes Bolsonaro.<br><br>
          Declaro a <b>INCOMPETÊNCIA ABSOLUTA</b> do juízo de primeira instância e a <b>ILICITUDE DE TODAS AS PROVAS</b> compartilhadas pelo COAF e pelo Ministério Público sem autorização judicial expressa.<br><br>
          Reconhece-se a extensão retroativa do <i>foro por prerrogativa de função</i> para fatos pretéritos do mandato de deputado estadual. <b>DETERMINO O TRANCAMENTO IMEDIATO DO INQUÉRITO</b> e o recolhimento incontinenti de todo e qualquer mandado prisional!"
        </div>

        <div class="stamp-badge">
          ANULADO<br>STF / HC CONCEDIDO
        </div>
      </div>

      <div style="margin-top: 16px; text-align: center;">
        <p style="font-family: var(--font-retro); font-size: 11px; color: var(--text-yellow);">
          FIM DE JOGO(?) • BEM-VINDO AO BRASIL!
        </p>
      </div>
    `;

    const actions = `
      <button class="retro-btn" onclick="game.restart()">[ RECORRER AO PLENÁRIO (JOGAR NOVAMENTE) ]</button>
      <button class="retro-btn" onclick="alert('Você se aposentou com integralidade de proventos e foi morar em Portugal!')">[ PEDIR APOSENTADORIA ESPECIAL ]</button>
    `;

    this.openModal("DECISÃO JUDICIAL EXTRAORDINÁRIA", html, actions);
  }
}

window.UIManager = UIManager;
