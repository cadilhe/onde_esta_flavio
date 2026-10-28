// game.js - Controlador Principal do Jogo e Inicialização

class GameController {
  constructor() {
    this.initialized = false;
  }

  init() {
    console.log("Inicializando 'Onde Está Flávio Bolsonaro?'...");

    // Inicializa gerenciador de UI
    window.uiManager = new UIManager();

    // Inicializa renderizador de mapa
    window.gameMap = new GameMapRenderer('mini-map-canvas');

    // Conecta botões de controle
    this.bindButtons();

    // Carrega o estado inicial do Rio de Janeiro
    window.uiManager.renderCurrentLocation();

    this.initialized = true;
  }

  bindButtons() {
    const btnInvestigar = document.getElementById('btn-investigar');
    const btnVerMapa = document.getElementById('btn-ver-mapa');
    const btnInterpol = document.getElementById('btn-interpol');
    const btnCias = document.getElementById('btn-cias');
    const btnViajar = document.getElementById('btn-viajar');

    if (btnInvestigar) {
      btnInvestigar.addEventListener('click', () => {
        window.audioSynth.init();
        window.uiManager.openInvestigateMenu();
      });
    }

    if (btnVerMapa) {
      btnVerMapa.addEventListener('click', () => {
        window.audioSynth.init();
        window.uiManager.openTacticalMap();
      });
    }

    if (btnInterpol) {
      btnInterpol.addEventListener('click', () => {
        window.audioSynth.init();
        window.uiManager.openInterpolDossier();
      });
    }

    if (btnCias) {
      btnCias.addEventListener('click', () => {
        window.audioSynth.init();
        window.uiManager.openAirlines();
      });
    }

    if (btnViajar) {
      btnViajar.addEventListener('click', () => {
        window.audioSynth.init();
        window.uiManager.openTravelMenu();
      });
    }
  }

  restart() {
    window.GAME_DATA.reset();
    window.uiManager.closeModal();
    window.uiManager.renderCurrentLocation();
    window.audioSynth.playButtonClick();
  }
}

// Instancia e inicializa ao carregar a página
window.game = new GameController();
window.addEventListener('DOMContentLoaded', () => {
  window.game.init();
});
