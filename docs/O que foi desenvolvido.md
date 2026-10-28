# 🕵️ Relatório Técnico: O Que Foi Desenvolvido
## Jogo "Onde Está Flávio Bolsonaro?"
*Estilo Investigação Retro 16-bits VGA (Simulação DOS / Carmen Sandiego anos 90)*

---

## 📌 1. Visão Geral da Implementação

Este documento consolida o histórico completo do desenvolvimento técnico do jogo **"Onde Está Flávio Bolsonaro?"**, concebido com fidelidade visual absoluta ao clássico *Where in the World is Carmen Sandiego?* (era DOS/VGA dos anos 90) e baseado nas diretrizes de [`projeto_onde_esta_flavio.md`](file:///d:/projects/cadilhe/onde_esta_flavio/docs/projeto_onde_esta_flavio.md) e [`roteiro-de-jogo.md`](file:///d:/projects/cadilhe/onde_esta_flavio/docs/roteiro-de-jogo.md).

O jogador atua como um **Agente Especial da Polícia Federal / Interpol**, seguindo rastros de dinheiro vivo, depósitos fracionados de franquias de chocolate, cheques de operadores e mansões nababescas para capturar o parlamentar antes da prescrição dos crimes.

---

## 🎨 2. Engenharia Visual e Tratamento de Assets

### 2.1 Extração Fiel da Imagem de Referência
A imagem de referência fornecida pelo usuário possuía proporção VGA retrô (800x597). Através de scripts automatizados em Python (`PIL / Pillow`), foram inspecionadas as coordenadas de pixels para isolar com precisão 1:1:
- **Retrato do Suspeito:** Área `[79, 97, 321, 372]` (242x275 px), salvo em [`assets/images/flavio_suspeito.png`](file:///d:/projects/cadilhe/onde_esta_flavio/assets/images/flavio_suspeito.png).
- **Mini-Mapa Mundi:** Área `[26, 457, 278, 584]` (252x127 px), salvo em [`assets/images/map_world.png`](file:///d:/projects/cadilhe/onde_esta_flavio/assets/images/map_world.png).

### 2.2 Geração de Retratos Complementares em Pixel Art
Para manter a coerência estética dos anos 90 nas outras etapas da investigação, foram gerados retratos adicionais com a mesma resolução e paleta:
1. **Fabrício Queiroz (`queiroz_npc.png`):** Retrato do operador do esquema, vestindo camisa polo e boné na chácara de Atibaia.
2. **Corretor Nobre de Imóveis (`corretor_npc.png`):** Retrato do corretor de terno e gravata vermelha no Lago Sul em Brasília.
3. **Flávio B. Disfarçado em Miami (`flavio_miami.png`):** O suspeito usando óculos escuros retrô e camisa de linho sob o sol da Flórida.

---

## 💻 3. Arquitetura do Software

A estrutura foi organizada de forma modular, permitindo execução instantânea e compatibilidade universal em qualquer navegador:

```text
onde-esta-flavio/
├── index.html                   # Estrutura HTML da janela retro VGA e modais
├── README.md                    # Apresentação do projeto e instruções de execução
├── css/
│   └── retro.css                # Estilização DOS/VGA, chanfros 3D, scanlines CRT e tipografia pixel
├── docs/
│   ├── O que foi desenvolvido.md # Este documento de registro técnico
│   ├── plano_de_implementacao.md # Plano de arquitetura e fases
│   ├── projeto_onde_esta_flavio.md # Especificação inicial (GDD)
│   └── roteiro-de-jogo.md       # Roteiro narrativo e mecânicas
├── assets/
│   └── images/
│       ├── flavio_suspeito.png  # Retrato inicial (Rio de Janeiro)
│       ├── queiroz_npc.png      # Retrato de Atibaia
│       ├── corretor_npc.png     # Retrato de Brasília
│       ├── flavio_miami.png     # Retrato de Miami
│       ├── map_world.png        # Mini-mapa mundial de rotas
│       └── reference_layout.png # Arte de referência original
└── js/
    ├── audioSynth.js            # Sintetizador Chiptune nativo (Web Audio API)
    ├── gameData.js              # Cidades, diálogos, pistas, voos e inventário
    ├── mapCanvas.js             # Canvas do mini-mapa e do mapa tático ampliado
    ├── uiManager.js             # Efeito typewriter, modais e transições
    └── game.js                  # Inicialização e fluxo de controle de eventos
```

---

## 🔊 4. Sintetizador Chiptune Autônomo (`js/audioSynth.js`)

Para eliminar o risco de links externos quebrados ou falhas de carregamento de áudio, todo o sistema sonoro do jogo foi construído via **Web Audio API**:
- **Teletype Keyclicks:** Microestalos de alta frequência oscilando entre 1200Hz e 1600Hz para simular a digitação de terminal clássico.
- **Button Clicks:** Bipe quadrado duplo com transição de 640Hz para 880Hz.
- **Clue Jingle:** Arpeggio de 4 notas agudas em onda quadrada (A4, C#5, E5, A5) ao coletar provas.
- **Flight Swoosh:** Modulação exponencial de onda dente de serra deslizando entre 220Hz e 880Hz.
- **Police Siren:** Sirene de viatura policial oscilando entre 960Hz e 720Hz.
- **Stamp Slam:** Impacto sub-bass em onda triangular decaindo de 130Hz para 35Hz para o carimbo da anulação jurídica.
- **Controles no Header:** Botão para ligar/desligar som em tempo real (`🔊 SOM: ON / OFF`).

---

## 🗺️ 5. Roteiro Investigativo e Progressão do Jogo (`js/gameData.js`)

### 1ª Parada: Rio de Janeiro (ALERJ & Loja de Chocolate)
- **Localização:** Palácio Tiradentes e Shopping do Rio.
- **Investigações:**
  - *Ex-Assessor da ALERJ:* Revela o esquema de devolução de 80% dos vencimentos em envelopes pardos.
  - *Gerente da Kopenhagen:* Descreve depósitos massivos de notas de 50 e 100 reais em dinheiro vivo feitos por "Queiroz".
- **Evidências Coletadas:** Extrato com repasses atípicos (Rachadinha) e Recibos da loja de chocolate.
- **Próximo Destino:** Atibaia (SP).

### 2ª Parada: Atibaia (Chácara do Advogado Wassef)
- **Localização:** Refúgio no interior paulista.
- **Investigações:**
  - *Fabrício Queiroz nos fundos:* Alega ser apenas vendedor de carros e cuidar da saúde, mas revela que o chefe comprou uma mansão nababesca no Lago Sul em Brasília.
  - *Perícia na Churrasqueira:* Localiza embalagens de panetone queimadas e plantas arquitetônicas da mansão de Brasília.
- **Evidências Coletadas:** Cheques assinados e mensagens de WhatsApp.
- **Próximo Destino:** Brasília (DF).

### 3ª Parada: Brasília (A Mansão de R$ 6 Milhões)
- **Localização:** Cartório e Setor de Mansões do Lago Sul.
- **Investigações:**
  - *Corretor de Imóveis:* Detalha entrada milionária em recursos próprios não declarados e financiamento relâmpago no BRB; informa que o investigado decolou em jatinho rumo à Flórida.
  - *Gabinete no Senado:* Vazio, com comprovantes de câmbio de dólares e passagens para os EUA.
- **Evidências Coletadas:** Escritura pública subfaturada da mansão.
- **Próximo Destino:** Miami (EUA).

### 4ª Parada: Miami (Sunny Isles Beach - Clímax)
- **Localização:** Resort de luxo à beira-mar na Flórida.
- **Investigações:**
  - *Confronto à Beira-Mar:* O suspeito tenta alegar perseguição política sob o sol da Flórida.
- **Desfecho:** Ao possuir 3 ou mais evidências, a equipe da PF e da Interpol deflagra a prisão.

### Pistas Frias (Distrações com Penalidade de Tempo)
- **Buenos Aires (Argentina):** Boato de alfajor; consome 1 dia sem pistas.
- **Punta del Este (Uruguai):** Boato de cassino; consome 1 dia sem pistas.
- **Zurique (Suíça):** Boato de sigilo bancário helvético; consome 1 dia sem pistas.

---

## ⚖️ 6. Finais do Jogo e o Grande Plot Twist

1. **Derrota por Prescrição Penal:** Se os dias restantes chegarem a zero, o inquérito é arquivado por decurso de prazo e uma tela fúnebre/satírica exibe o investigado comemorando em Angra dos Reis.
2. **Vitória da Polícia Federal:** Comprovação da rota com apresentação do extrato, notas da loja de chocolate, cheques do intermediário e escritura da mansão. Sirene e voz de prisão em Miami.
3. **O Grande Plot Twist (3 segundos após a vitória):**
   - Som pesado de carimbo judicial ecoa.
   - Surge cobrindo a tela uma decisão monocrática timbrada do **Supremo Tribunal Federal**:
     > *"DECISÃO MONOCRÁTICA: Acolhida a preliminar de foro por prerrogativa de função retroativo e declarada a ilicitude das provas colhidas pelo COAF. Mandado de prisão revogado e investigação trancada!"*
   - O jogador pode clicar em **[RECORRER AO PLENÁRIO (JOGAR NOVAMENTE)]** ou **[PEDIR APOSENTADORIA ESPECIAL]**.

---

## 🧪 7. Validação e Testes em Navegador

O sistema foi testado de ponta a ponta com o agente navegador do Antigravity IDE:
- Validação de renderização de fontes pixeladas (`Press Start 2P` e `VT323`).
- Alinhamento de todos os textos em linha única sem quebras indevidas:
  - Título superior: `"ONDE ESTÁ FLÁVIO BOLSONARO?"`
  - Placa do suspeito: `"SUSPEITO: FLÁVIO B."`
  - Botoeira: `[INVESTIGAR]`, `[VER MAPA]`, `[INTERPOL / PF]`, `[COMPANHIAS AÉREAS]`, `[VIAJAR]`
  - Barra de status: `"LOCAL: RIO DE JANEIRO (RJ)"` e `"DIAS ANTES DA PRESCRIÇÃO: 8"`.
- Teste dinâmico de troca de retratos em cada cidade.
- Teste de animação e traçado de rotas no mini-mapa.
- Teste do fluxo completo até a prisão em Miami e apresentação do Habeas Corpus do STF.
