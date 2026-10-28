# 🕵️ Onde Está Flávio Bolsonaro?
> *Um jogo retrô de investigação e sátira política no estilo clássico de "Where in the World is Carmen Sandiego?" (VGA/DOS dos anos 90).*

![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Pixel Art](https://img.shields.io/badge/Estilo-16--bits%20VGA-9945FF)

---

## 🕹️ Sobre o Jogo

**"Onde Está Flávio Bolsonaro?"** é um jogo point-and-click de investigação jornalística e paródia política. 

No papel de um **Agente Especial da Polícia Federal / Interpol**, sua missão é seguir os rastros de movimentações financeiras atípicas em dinheiro vivo, notas de R$ 100 em lojas de chocolates, cheques nominais de assessores e mansões cinematográficas para capturar o parlamentar investigado antes que os crimes prescrevam!

O jogo recria com fidelidade a experiência dos clássicos de computador dos anos 90, com resolução emulada de 16-bits VGA, molduras chanfradas 3D, tipografia pixelada, efeito teletype de máquina de escrever, sintetizador de som Chiptune nativo e um mini-mapa com radar em tempo real.

---

## 📸 Demonstração Visual

A interface reproduz com precisão cirúrgica a estética retrô dos computadores DOS:

```text
+-------------------------------------------------------------------------+
|                  ONDE ESTÁ FLÁVIO BOLSONARO?                            |
+-------------------------------------------------------------------------+
|  +--------------------+  +-------------------------------------------+  |
|  |                    |  | [=] DOSSIÊ - RIO DE JANEIRO (RJ)      [X] |  |
|  | [RETRATO PIXEL ART]|  |-------------------------------------------|  |
|  | (Flávio com fedora |  | ÚLTIMO PARADEIRO CONHECIDO:               |  |
|  |  ou Queiroz/NPCs)  |  | Cruzou a fronteira de influência...       |  |
|  |                    |  | Relatos de dinheiro vivo e chocolate...   |  |
|  +--------------------+  |                                         |#|  |
|  | SUSPEITO: FLÁVIO B.|  +-------------------------------------------+  |
+-------------------------------------------------------------------------+
|  +--------------------+  +---------------+  +---------------+           |
|  |   [ MINI-MAPA ]    |  |  INVESTIGAR   |  |   VER MAPA    |           |
|  | Continentes verdes |  +---------------+  +---------------+           |
|  | Radar e rotas      |  | INTERPOL / PF |  | CIA. AÉREAS   |  [VIAJAR] |
|  +--------------------+  +---------------+  +---------------+           |
|  LOCAL: RIO DE JANEIRO (RJ)         DIAS ANTES DA PRESCRIÇÃO: 8         |
+-------------------------------------------------------------------------+
```

---

## 🚀 Como Jogar

O jogo é 100% web e não necessita de nenhuma instalação ou dependência pesada.

### Opção 1: Abrir Diretamente no Navegador
Basta dar dois cliques no arquivo `index.html` ou arrastá-lo para dentro de qualquer navegador moderno (Chrome, Firefox, Edge, Safari, Brave).

### Opção 2: Rodar com Servidor Local Leve (Recomendado)
Se tiver Python ou Node instalado:

**Com Python:**
```bash
python -m http.server 5173
```
Acesse: [http://localhost:5173](http://localhost:5173)

**Com Node.js / npx:**
```bash
npx serve .
```

---

## 🎮 Mecânicas e Controles

O painel inferior oferece 5 botões de comando estilo DOS:

1. **`[INVESTIGAR]`**: Interroga testemunhas, funcionários e assessores da cidade atual. Revela pistas cruciais sobre o próximo paradeiro e anexa documentos probatórios ao dossiê.
2. **`[VER MAPA]`**: Abre o mapa tático global da Interpol em tela cheia, exibindo a trajetória pontilhada de voos, coordenadas e radares.
3. **`[INTERPOL / PF]`**: Abre o dossiê da Operação *Chocolate Amargo*. Exibe o status da investigação e o inventário das 4 evidências-chave:
   - 📄 *Extrato com Repasses Atípicos (Rachadinhas da ALERJ)*
   - 🍫 *Recibo de Depósitos de Chocolate em Dinheiro Vivo*
   - 📑 *Cheques Assinados do Operador Queiroz*
   - 🏠 *Escritura Subfaturada da Mansão de R$ 6 Milhões no Lago Sul*
4. **`[COMPANHIAS AÉREAS]`**: Radar de passagens e voos suspeitos despachados com malas volumosas.
5. **`[VIAJAR]`**: Abre o terminal de embarque para seguir para a próxima cidade. **Atenção:** Cada viagem consome 1 dia de prazo! Pistas frias penalizam com perda de tempo precioso.

---

## 🗺️ Cidades e Progressão

- 🏛️ **Rio de Janeiro (RJ):** ALERJ, Franquia Kopenhagen e Condomínio Vivendas da Barra.
- 🏊 **Atibaia (SP):** Chácara do Advogado e churrasqueira nos fundos com Fabrício Queiroz.
- 🏠 **Brasília (DF):** Mansão cinematográfica de R$ 6 milhões no Lago Sul e cartório.
- 🏖️ **Miami (EUA):** Resort de luxo em Sunny Isles Beach.
- ⚠️ **Pistas Frias (Distrações):** Buenos Aires (Argentina), Punta del Este (Uruguai) e Zurique (Suíça).

---

## ⚖️ Os Finais do Jogo

- **⌛ Derrota por Prescrição Penal:** Se os dias chegarem a zero, o inquérito é arquivado por decurso de prazo no tribunal e o suspeito comemora em uma lancha em Angra dos Reis.
- **🚨 Prisão em Flagrante:** Ao enquadrar o suspeito em Miami com pelo menos 3 evidências probatórias no dossiê, a sirene da PF toca e as algemas são colocadas.
- **📜 O Grande Plot Twist Judicial (STF):** 4 segundos após a vitória policial, um estrondo de carimbo ecoa e surge uma decisão monocrática com carimbo **ANULADO / HABEAS CORPUS CONCEDIDO**, acolhendo preliminar de foro privilegiado retroativo e trancando todo o inquérito!

---

## 🔊 Sintetizador Chiptune Nativo (Web Audio API)

O jogo possui um sintetizador sonoro retrô 100% nativo em JavaScript, sem dependência de MP3s externos:
- Som mecânico de teletype ao renderizar diálogos
- Bipes clássicos de terminal
- Arpeggio de 8-bits ao descobrir evidências
- Efeito de voo aéreo
- Sirene de viatura policial
- Impacto grave de carimbo judicial

Controles no canto superior:
- `📺 CRT`: Ativa / desativa o efeito de scanlines de monitor antigo.
- `🔊 SOM`: Liga / desliga o áudio do jogo.

---

## 📁 Estrutura de Arquivos

```text
onde-esta-flavio/
├── index.html                   # Página principal do jogo
├── README.md                    # Documentação do projeto
├── css/
│   └── retro.css                # Estilização 16-bits VGA, chanfros 3D e scanlines
├── docs/
│   ├── O que foi desenvolvido.md # Relatório técnico detalhado
│   ├── plano_de_implementacao.md # Especificação das fases de desenvolvimento
│   ├── projeto_onde_esta_flavio.md # Documento de Game Design (GDD)
│   └── roteiro-de-jogo.md       # Roteiro narrativo e diálogos
├── assets/
│   └── images/
│       ├── flavio_suspeito.png  # Retrato original do suspeito
│       ├── queiroz_npc.png      # Retrato de Queiroz
│       ├── corretor_npc.png     # Retrato do corretor
│       ├── flavio_miami.png     # Retrato em Miami
│       └── map_world.png        # Mini-mapa mundial de rotas
└── js/
    ├── audioSynth.js            # Sintetizador Chiptune nativo (Web Audio API)
    ├── gameData.js              # Base de dados de fases, diálogos e evidências
    ├── mapCanvas.js             # Renderizador Canvas do mapa e radares
    ├── uiManager.js             # Gerenciador de interface, diálogos e modais
    └── game.js                  # Inicialização e fluxo de eventos
```

---

## 📜 Licença

Projeto desenvolvido para fins educacionais, artísticos e de sátira política, sob a licença [MIT](LICENSE).
