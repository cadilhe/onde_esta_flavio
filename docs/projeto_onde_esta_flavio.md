Aqui está o documento de especificação técnica e de design (GDD - *Game Design Document*) completo, pronto para você salvar na pasta do seu projeto. Ele foi estruturado especificamente para ser interpretado por ferramentas de desenvolvimento e IAs geradoras de código (como o Antigravity IDE, Cursor ou GitHub Copilot) no desenvolvimento do jogo usando **Phaser 3** (HTML5/JavaScript).

Salve o texto abaixo como **`PROJETO_ONDE_ESTA_FLAVIO.md`** ou **`README.md`** na raiz do seu projeto.

---

```markdown
# DOCUMENTO DE ESPECIFICAÇÃO DE JOGO (GDD): ONDE ESTÁ FLÁVIO BOLSONARO?
**Estilo:** Investigação Point-and-Click / Visual Novel 16-bits retro (Simulação DOS/VGA)
**Tecnologia Recomendada:** Phaser 3 (HTML5 / JavaScript)
**Ambiente de Desenvolvimento:** Antigravity IDE / Web Browser

---

## 1. VISÃO GERAL E CONCEITO
"Onde está Flávio Bolsonaro?" é um jogo de investigação e paródia política no estilo do clássico "Where in the World is Carmen Sandiego?" (anos 90). O jogador atua como um Investigador da PF Especial com a missão de seguir rastros financeiros, de transações de dinheiro vivo e de chocolate para localizar o parlamentar fugitivo "Flávio B." antes que seus crimes prescrevam ou que o tempo (rodadas) acabe.

### Recursos Visuais e Estética:
- Resolução interna: 640x480 (escalonada com Pixel Art Perfect no Phaser).
- Paleta de cores limitada (EGA/VGA retro, tons escuros, azul e cinza de interfaces antigas).
- Scanlines opcionais e tipografia monoespaçada/pixelada (ex: `Courier New` ou fontes `.ttf` de 8-bit).
- Trilha sonora estilo Chiptune / MIDI retro.

---

## 2. ARQUITETURA DO PROJETO (ESTRUTURA DE ARQUIVOS)
```text
onde-esta-flavio/
├── index.html              # Entrada do jogo e container do Phaser
├── assets/                 # Imagens, sprites e áudios
│   ├── bg_investigacao.png # Layout geral baseado na imagem de referência
│   ├── flavio_suspeito.png # Retrato do suspeito com chapéu fedora
│   ├── queiroz_npc.png     # Retrato do intermediário (Queiroz)
│   ├── map_world.png       # Mini-mapa pixelado
│   └── sons/               # FXs e trilha sonora (.mp3 ou .wav retro)
└── src/
    ├── game.js             # Configuração do Phaser e inicialização
    ├── gameData.js         # Dados das fases, pistas, diálogos e inventário
    └── scenes/
        ├── BootScene.js       # Carregamento inicial e assets
        ├── MenuScene.js       # Tela de abertura com título animado
        ├── InvestigacaoScene.js # Tela principal de gameplay (clique e diálogo)
        ├── ViagemScene.js     # Interface de deslocamento entre cidades
        └── GameOverScene.js   # Julgamento (Vitória), Anulação (Plot Twist) ou Prescrição (Derrota)

```

---

## 3. BANCO DE DADOS E ROTEIRO DO JOGO (`src/gameData.js`)

```javascript
const GAME_DATA = {
  tempoMaximo: 8, // Medido em "Dias" ou "Rodadas"
  localAtual: "rio",
  inventario: [],
  historicoViagens: ["rio"],
  evidenciasColetadas: [],

  fases: {
    rio: {
      nome: "Rio de Janeiro (ALERJ & Kopenhagen)",
      descricaoPadrao: "Último paradeiro conhecido: Cruzou a fronteira de influência. Investigadores relatam movimentações em dinheiro vivo na capital fluminense.",
      retrato: "flavio_suspeito",
      nomeRetrato: "SUSPEITO: FLÁVIO B.",
      investigacoes: [
        {
          nome: "Conversar com Ex-Assessor na ALERJ",
          dialogo: "Eu só vinha no dia do pagamento... mas tinha que entregar um 'envelope' de volta para o chefe de gabinete. Disseram que o dinheiro ia para o 'Zero Um'.",
          revelaEvidencia: "Extrato com Movimentações Atípicas",
          revelaDestino: "atibaia"
        },
        {
          nome: "Investigar Loja de Chocolates",
          dialogo: "Nossa franquia vende muito! Especialmente na Páscoa... Curiosamente recebemos muito dinheiro vivo, sempre em notas de 50 e 100. Um senhor chamado 'Queiroz' vinha sempre ajudar com os depósitos.",
          revelaEvidencia: "Recibo de Depósito de Chocolate"
        }
      ],
      destinosPossiveis: ["atibaia", "brasilia"]
    },
    atibaia: {
      nome: "Atibaia (Chácara do Advogado)",
      descricaoPadrao: "Rastro aponta para o interior de São Paulo. Movimentações suspeitas em uma chácara de um conhecido defensor do clã.",
      retrato: "queiroz_npc",
      nomeRetrato: "PARCEIRO: F. QUEIROZ",
      investigacoes: [
        {
          nome: "Abordar Fabrício Queiroz nos fundos",
          dialogo: "Eu? Só sou um trabalhador cuidando da saúde! Não sei nada de 'rachadinha'. Mas o chefe... o chefe agora está interessado em grandes empreendimentos imobiliários de luxo. Ouvi dizer que ele comprou um casarão no Planalto Central para ficar perto do pai.",
          revelaEvidencia: "Cheque Assinado e Mensagens",
          revelaDestino: "brasilia"
        }
      ],
      destinosPossiveis: ["rio", "brasilia", "miami"]
    },
    brasilia: {
      nome: "Brasília (A Mansão de R$ 6 Milhões)",
      descricaoPadrao: "O suspeito tentou se estabelecer no Planalto Central com novos recursos e forte aparato jurídico.",
      retrato: "corretor_npc",
      nomeRetrato: "CORRETOR DE IMÓVEIS",
      investigacoes: [
        {
          nome: "Investigar Cartório e Vizinhança no Lago Sul",
          dialogo: "A compra da mansão foi muito rápida! Um misto de financiamento de banco público com 'recursos próprios' que surgiram do nada. Ele pegou um voo de última hora, com pressa. Parecia estar indo para os EUA visitar aliados ou para a Argentina.",
          revelaEvidencia: "Escritura de Mansão Subfaturada",
          revelaDestino: "miami"
        }
      ],
      destinosPossiveis: ["atibaia", "miami"]
    },
    miami: {
      nome: "Miami (O Esconderijo Final)",
      descricaoPadrao: "Bairro nobre, refúgio de aliados. O suspeito foi avistado disfarçado tentando evitar extradição.",
      retrato: "flavio_disfarçado",
      nomeRetrato: "INVESTIGADO: FLÁVIO B.",
      investigacoes: [
        {
          nome: "Confrontar o suspeito no Resort",
          dialogo: "Calma lá, agente! Isso é perseguição política! Meus advogados já estão entrando com um recurso! Você não tem provas!",
          revelaEvidencia: "Flagrante de Fuga"
        }
      ],
      destinosPossiveis: ["brasilia"]
    }
  }
};

```

---

## 4. CÓDIGO DA TELA PRINCIPAL (`src/scenes/InvestigacaoScene.js`)

Esta é a lógica central da interface. Envie este script para o seu agente de código como a base visual e de jogabilidade:

```javascript
class InvestigacaoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InvestigacaoScene' });
  }

  create() {
    // 1. Elementos de Background e Painéis (Estilo Interface DOS/VGA)
    this.add.graphics()
      .fillStyle(0x1e1e24, 1) // Cinza escuro
      .fillRect(0, 0, 640, 480);

    // Borda superior (Título do Jogo)
    this.add.graphics()
      .fillStyle(0x0f0f12, 1)
      .fillRect(10, 10, 620, 40);
    this.add.text(20, 20, "ONDE ESTÁ FLÁVIO BOLSONARO?", { font: '18px Courier', fill: '#ffffff', weight: 'bold' });

    // Painel Esquerdo (Retrato do Suspeito / NPC)
    this.add.graphics()
      .lineStyle(2, 0x4a4a5a, 1)
      .strokeRect(15, 60, 200, 230);
    this.retratoSprite = this.add.sprite(115, 160, 'flavio_suspeito').setScale(1.2); // Redimensionado conforme pixelart
    this.txtNomeRetrato = this.add.text(20, 265, "SUSPEITO: FLÁVIO B.", { font: '11px Courier', fill: '#00ff00' });

    // Painel Direito (Caixa de Texto / Dossiê)
    this.add.graphics()
      .fillStyle(0x2e2e3a, 1)
      .fillRect(230, 60, 390, 230);
    this.txtDialogo = this.add.text(240, 75, "", { font: '12px Courier', fill: '#ffffff', wordWrap: { width: 370 } });

    // Painel Inferior (Mapa e Botões)
    this.add.graphics()
      .lineStyle(2, 0x4a4a5a, 1)
      .strokeRect(15, 300, 610, 170);

    // Mini Mapa
    this.add.sprite(90, 385, 'map_world').setScale(0.85);

    // Status de Rodadas / Tempo Restante
    this.txtTempo = this.add.text(180, 310, `DIAS RESTANTES ANTES DA PRESCRIÇÃO: ${GAME_DATA.tempoMaximo}`, { font: '11px Courier', fill: '#ff3333' });

    // 2. Estado de Carregamento da Fase
    this.carregarLocal(GAME_DATA.localAtual);
  }

  carregarLocal(localKey) {
    const local = GAME_DATA.fases[localKey];
    this.txtNomeRetrato.setText(local.nomeRetrato);
    this.retratoSprite.setTexture(local.retrato);
    this.txtDialogo.setText(`${local.nome.toUpperCase()}\n\n${local.descricaoPadrao}\n\nEscolha uma opção de investigação abaixo.`);

    // Remove botões de ação antigos para evitar duplicação
    if (this.botoesAcao) this.botoesAcao.forEach(b => b.destroy());
    this.botoesAcao = [];

    // Gerar Botões de Investigação Dinamicamente
    local.investigacoes.forEach((op, index) => {
      let btnY = 340 + (index * 30);
      let btn = this.add.text(180, btnY, `[>] ${op.nome}`, { font: '11px Courier', fill: '#ffff00', backgroundColor: '#2a2a35' })
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => btn.setStyle({ fill: '#00ff00' }))
        .on('pointerout', () => btn.setStyle({ fill: '#ffff00' }))
        .on('pointerdown', () => this.realizarInvestigacao(op));

      this.botoesAcao.push(btn);
    });

    // Botão de Viagem
    let btnViagem = this.add.text(180, 430, `[ VIAJAR PARA OUTRA REGIÃO ]`, { font: '12px Courier', fill: '#00ffff', backgroundColor: '#113333' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.abrirMenuViagem(local));
    this.botoesAcao.push(btnViagem);
  }

  realizarInvestigacao(opcao) {
    this.txtDialogo.setText(`DIZ:\n\n"${opcao.dialogo}"`);
    
    // Coletar Evidência se houver
    if (opcao.revelaEvidencia && !GAME_DATA.evidenciasColetadas.includes(opcao.revelaEvidencia)) {
      GAME_DATA.evidenciasColetadas.push(opcao.revelaEvidencia);
      this.exibirNotificacao(`Nova evidência obtida: ${opcao.revelaEvidencia}`);
    }

    // Se estiver em Miami (Clímax) e tiver as evidências, libera o desfecho
    if (GAME_DATA.localAtual === 'miami' && GAME_DATA.evidenciasColetadas.length >= 3) {
      this.time.delayedCall(3000, () => {
        this.scene.start('GameOverScene', { resultado: 'vitoria' });
      });
    }
  }

  exibirNotificacao(texto) {
    let notif = this.add.text(240, 240, texto, { font: '11px Courier', fill: '#00ff00', backgroundColor: '#000000', padding: 5 });
    this.time.delayedCall(2500, () => notif.destroy());
  }

  abrirMenuViagem(local) {
    // Reduz tempo
    GAME_DATA.tempoMaximo -= 1;
    this.txtTempo.setText(`DIAS RESTANTES ANTES DA PRESCRIÇÃO: ${GAME_DATA.tempoMaximo}`);

    if (GAME_DATA.tempoMaximo <= 0) {
      this.scene.start('GameOverScene', { resultado: 'derrota_tempo' });
      return;
    }

    this.scene.start('ViagemScene', { destinos: local.destinosPossiveis });
  }
}

```

---

## 5. REGRAS DE VITÓRIA, DERROTA E PLOT TWIST (`GameOverScene.js`)

Lógica para as telas de finalização do jogo:

* **Derrota por Tempo:** "GAME OVER - O tempo expirou, o caso prescreveu e os crimes caíram no esquecimento!"
* **Vitória Parcial (Prisão):** "Parabéns, Investigador! Com as provas da Rachadinha, da Mansão e das transações, você localizou e enquadrou o investigado!"
* **O Grande Plot Twist (2 segundos depois da Vitória):**
Uma tela imitando uma liminar ou petição judicial surge sobre a tela de vitória, com efeito sonoro de carimbo:
> **"ALERTA JUDICIAL! Por decisão de foro privilegiado e anulação de provas, a investigação foi desconsiderada. O suspeito está liberado! FIM DE JOGO(?)"**



---

## 6. INSTRUÇÃO PARA O AGENTE DE CÓDIGO (COMO COMEÇAR)

Submeta o seguinte prompt ao seu assistente/IDE:

> "Implemente as cenas do Phaser 3 baseadas no roteiro e lógica de `PROJETO_ONDE_ESTA_FLAVIO.md`. Crie a navegação entre Rio, Atibaia, Brasília e Miami na `ViagemScene.js` de modo que o jogador só avance se coletar as evidências corretas do estágio anterior. Use HTML5/CSS na interface para emular o estilo retrô de computadores DOS. Caso o jogador selecione um destino errado, penalize-o com -1 dia."

```

Esse documento reúne a lógica de dados, o design da UI inspirada na imagem e o roteiro satírico, perfeitamente preparados para o interpretador de código do Antigravity ou qualquer outra IDE assistida por inteligência artificial!

```