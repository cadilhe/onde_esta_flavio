Para tirar esse jogo do papel com a estética retro, humor afiado e mecânica direta, a escolha da **stack de tecnologia** deve focar na velocidade de desenvolvimento e na fidelidade ao estilo 16-bits (2D Pixel Art).

Abaixo, apresento a melhor stack para o projeto e, em seguida, o passo a passo de como estruturar isso para um **agente de código** (como GitHub Copilot, Cursor, ou APIs de LLM) gerar o jogo para você.

---

### 🛠️ 1. A Melhor Stack para Desenvolver o Jogo

Como o objetivo é um jogo 2D simples de investigação (estilo point-and-click / romance visual retro), a melhor abordagem é focar em **Web (HTML5)** ou em uma **Engine 2D leve**. Isso garante que qualquer pessoa possa jogar direto no navegador ou no celular, sem precisar instalar nada pesado.

#### Opção A: A Stack Web Moderna (Recomendada para rapidez e portabilidade)

É a melhor opção para rodar direto no navegador e para agentes de código criarem rapidamente, já que eles dominam JavaScript/TypeScript.

* **Engine/Framework:** **Phaser 3** (JavaScript/TypeScript). É a biblioteca mais famosa do mundo para jogos 2D em HTML5. Ela lida perfeitamente com pixel art, áudio retro, transições de tela, inventários e texto.
* **Interface (UI) e Texto:** HTML5/CSS3 integrado (para caixas de diálogo e menus rápidos) ou o próprio sistema de renderização do Phaser.
* **Empacotamento (se quiser colocar no celular ou PC):** Electron (para PC) ou Capacitor (para Android/iOS).
* **Hospedagem:** GitHub Pages, Itch.io ou Vercel (totalmente grátis).

#### Opção B: A Engine Dedicada (Para quem quer algo mais robusto)

Se você quer um executável clássico ou prefere uma ferramenta de jogo tradicional.

* **Engine:** **Godot Engine 4** (usando GDScript, que é muito parecido com Python). É extremamente leve, excelente para jogos 2D Pixel Art e muito fácil de programar com a ajuda de IA.
* **Estilo de Jogo:** Você pode usar o template "Point and Click" ou "Visual Novel" na Godot.

---

### 🤖 2. Como levar este jogo ao Agente de Código?

Agentes de código (como as IAs) funcionam melhor quando você divide o projeto em **pequenas tarefas lógicas, organizadas e com regras bem definidas**. Se você apenas colar o roteiro, a IA pode se perder ou gerar um código confuso.

Aqui está o "passo a passo" para você conversar com o seu agente de código:

#### Passo 1: Definir o Escopo Técnico (O Prompt de Setup)

Antes de pedir o jogo, defina as regras do ambiente. Peça para o agente iniciar o projeto.

> *"Quero criar um jogo 2D point-and-click retro para web usando **Phaser 3** e JavaScript, inspirado no clássico 'Onde está Carmen Sandiego?'. O estilo visual deve simular pixel art de 16-bits com resolução interna baixa (ex: 640x480, escalada para preencher a tela) e paleta de cores limitada. O jogo será baseado em texto, escolhas de diálogo, viagens por um mapa e gerenciamento de inventário simples. Por favor, configure a estrutura básica do projeto Phaser 3 com os seguintes estados (Scenes): Boot, Preloader, Menu, Mapa, Investigacao, e GameOver."*

#### Passo 2: Estruturar os Dados (O "Cérebro" do Jogo)

Peça ao agente para criar a estrutura que armazena o progresso, os locais e as pistas do roteiro.

> *"Crie um arquivo de dados (`gameData.js`) para gerenciar os destinos, pistas e suspeitos. O jogo se passa em 3 fases: Rio de Janeiro (ALERJ e Kopenhagen), Atibaia (Chácara) e Brasília (Mansão). Cada local deve ter:
> 1. Nome e Descrição.
> 2. Lista de NPCs/Investigações disponíveis.
> 3. Pistas/Evidências que o jogador pode coletar (como 'Extrato Bancário', 'Chocolate de Ouro', 'Recibo de Queiroz').
> 4. Destinos de viagem possíveis.
> Crie também um sistema de inventário para o jogador carregar até 5 evidências coletadas e um contador de 'Tempo/Rodadas' (se o tempo acabar, o jogador perde)."*
> 
> 

#### Passo 3: Criar a Tela Principal (Investigação e Diálogos)

Peça para o agente programar a tela onde o jogador passará a maior parte do tempo, baseando-se no layout da imagem que geramos.

> *"Com base na estrutura de 'Onde está Flávio Bolsonaro?', crie a cena de Investigação (`InvestigacaoScene`). A tela deve ser dividida em:
> * Um painel esquerdo para o retrato pixelado do suspeito/NPC e o nome ('SUSPEITO: FLÁVIO B.' ou 'NPC: QUEIROZ').
> * Um painel direito para a caixa de texto que exibe diálogos, pistas e descrições do paradeiro histórico (como 'Último paradeiro conhecido: Cruzou a fronteira...').
> * Um painel inferior com botões clicáveis: 'INVESTIGAR', 'VER MAPA', 'INTERPOL / PF', 'COMPANHIAS AÉREAS', 'VIAJAR'.
> * Um pequeno mapa-múndi interativo no canto inferior esquerdo.
> Implemente o fluxo onde clicar em 'INVESTIGAR' abre as opções de locais no Rio de Janeiro (ALERJ e Kopenhagen) e clicar neles exibe os diálogos do roteiro e adiciona as evidências ao inventário."*
> 
> 

#### Passo 4: Implementar a Lógica de Viagem e Progressão

Diga ao agente como o jogador se move entre as fases.

> *"Crie a lógica da cena de Viagem (`TravelScene`). Quando o jogador clica em 'VIAJAR' e escolhe um destino, o jogo deve verificar se ele coletou as evidências necessárias para liberar a próxima fase (ex: precisa do extrato e do recibo do Rio para ir a Atibaia). Se ele viajar para o lugar errado, exiba uma mensagem de 'pista fria' e desconte tempo/rodadas do jogador. Se viajar para o lugar certo, atualize a cena com o novo cenário (Atibaia) e novos personagens (como o Queiroz)."*

#### Passo 5: O Clímax e as Telas de Fim de Jogo (O Plot Twist)

Por fim, peça para o agente programar o encerramento do roteiro.

> *"Crie a cena final de julgamento (`GameOverScene`). Ao chegar em Brasília/Miami e confrontar o suspeito, o jogador deve ser capaz de 'Apresentar Provas' do seu inventário.
> * Se apresentar as provas certas (extratos, cheques, contratos), mostre a tela de VITÓRIA em pixel art retro.
> * Adicione o plot twist: após 5 segundos da vitória, exiba uma notificação judicial de 'ALERTA: Provas anuladas por vício de competência! Suspeito liberado!'.
> * Se o tempo do jogador acabar, exiba a tela de derrota clássica: 'O suspeito escapou e os crimes prescreveram!' com um botão para Tentar Novamente."*
> 
> 

### 🎨 Dica para os Assets (Imagens e Sons)

Como os agentes de código geram principalmente lógica e texto, você precisará de imagens e sons.

1. Use a imagem que geramos no início como o layout de base.
2. Você pode pedir para a IA recortar essa imagem em pedaços ou usar ferramentas como o **Tilemap** ou geradores de pixel art por IA para criar os cenários e rostos de outros personagens (como o "Queiroz" e o "Wassef").
3. Para as músicas e efeitos sonoros retro gratuitos (8-bit/16-bit), use sites como o **OpenGameArt.org** ou o **Sfxr** para efeitos de cliques e transições de áudio.