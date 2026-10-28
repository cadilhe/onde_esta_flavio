// gameData.js - Banco de Dados de Investigação, Cidades, Evidências e Diálogos
// Baseado no GDD do PROJETO_ONDE_ESTA_FLAVIO.md e roteiro-de-jogo.md

const INITIAL_GAME_STATE = {
  tempoMaximo: 8, // Dias restantes antes da prescrição penal
  localAtual: "rio",
  evidenciasColetadas: [],
  historicoViagens: ["rio"],
  investigacoesFeitas: [],
  diasConsumidos: 0
};

const GAME_CITIES = {
  rio: {
    id: "rio",
    nome: "Rio de Janeiro (ALERJ & Kopenhagen)",
    regiao: "Rio de Janeiro (RJ)",
    coordenadasMapa: { x: 92, y: 88 }, // Posição relativa no mini-mapa
    descricaoPadrao: "ÚLTIMO PARADEIRO CONHECIDO:\nCruzou a fronteira de influência. Não há registro formal de saída do país.\nCarregando documentos e sem passaporte.\nInvestigadores relatam movimentações atípicas em dinheiro vivo na capital fluminense e pistas que apontam para Atibaia ou Miami.",
    retrato: "assets/images/flavio_suspeito.png",
    nomeRetrato: "SUSPEITO: FLÁVIO B.",
    statusPF: "ALERTA DA PF: INVESTIGAÇÃO EM ANDAMENTO",
    investigacoes: [
      {
        id: "rio_alerj",
        nome: "Conversar com Ex-Assessor na ALERJ",
        icone: "🏛️",
        dialogo: "Ex-Assessor da ALERJ (sussurrando atrás das colunas do Palácio Tiradentes):\n\n'Eu só vinha aqui no dia do pagamento... O esquema era bem coordenado: 80% do salário voltava em espécie, dentro de um envelope pardo fechado entregue diretamente na sala da chefia.\n\nDisseram que o dinheiro ia para o \"Zero Um\". Quem recolhia os malotes e fazia os depósitos fracionados era um ex-policial de confiança, compadre da família. Ele foi se esconder no interior de São Paulo, em Atibaia, na chácara do advogado!'",
        revelaEvidencia: {
          id: "extrato_rachadinha",
          titulo: "Extrato com Repasses Atípicos (Rachadinha)",
          icone: "📄",
          origem: "ALERJ - Rio de Janeiro",
          descricao: "Relatório de inteligência financeira detalhando depósitos fracionados de 48 assessores na boca do caixa, totalizando centenas de milhares de reais sem justificativa de renda."
        },
        revelaDestino: "atibaia"
      },
      {
        id: "rio_chocolate",
        nome: "Investigar Franquia de Chocolates Kopenhagen",
        icone: "🍫",
        dialogo: "Gerente da Loja de Chocolates (nervoso, conferindo um maço de notas na gaveta):\n\n'Nossa franquia fatura muito! Especialmente na época de panetones... Mas você não imagina: 90% dos pagamentos eram feitos em maços de notas vivas de 50 e 100 reais, sempre contadas em espécie!\n\nUm senhor chamado \"Queiroz\" vinha quase todo dia com sacolas plásticas ajudar nos depósitos na boca do caixa. Ouvi dizer que ele comprou uma chácara em Atibaia (SP) para tratar da saúde.'",
        revelaEvidencia: {
          id: "recibo_chocolate",
          titulo: "Recibo de Depósitos de Chocolate em Dinheiro Vivo",
          icone: "🍫",
          origem: "Shopping Mall - Rio de Janeiro",
          descricao: "Comprovantes de dezenas de depósitos astronômicos em dinheiro vivo na conta da loja de chocolates, incompatíveis com o fluxo de consumidores no balcão."
        },
        revelaDestino: "atibaia"
      },
      {
        id: "rio_condominio",
        nome: "Abordar Porteiro no Vivendas da Barra",
        icone: "🏘️",
        dialogo: "Porteiro do Condomínio (olhando disfarçado):\n\n'O Seu Flávio não dorme aqui há dias. Só vimos uma movimentação estranha de carros pretos de madrugada e sacos de lixo cheios de papéis picotados.\n\nUm motorista comentou que o patrão estava indo para uma chácara em Atibaia ou pegando voo para a Argentina. Cuidado com voos para Buenos Aires, pode ser pista falsa pra despistar a imprensa!'"
      }
    ],
    destinosPossiveis: ["atibaia", "buenos_aires", "brasilia"],
    voosDisponiveis: [
      {
        destinoId: "atibaia",
        nomeDestino: "Atibaia (SP)",
        cia: "AEROCLUBE SP",
        voo: "AC-1902",
        status: "CONFIRMADO",
        pista: "Passageiro despachou malas suspeitas com destino ao aeródromo do interior paulista."
      },
      {
        destinoId: "buenos_aires",
        nomeDestino: "Buenos Aires (Argentina)",
        cia: "AEROLÍNEAS",
        voo: "AR-1240",
        status: "PISTA SUSPEITA",
        pista: "Voo com destino ao exterior. Não há registros biométricos conclusivos."
      },
      {
        destinoId: "brasilia",
        nomeDestino: "Brasília (DF)",
        cia: "GOL LINHAS",
        voo: "G3-1402",
        status: "SEM REGISTROS DIRETOS",
        pista: "Sem registro de bilhete emitido para esta escala imediata."
      }
    ]
  },

  atibaia: {
    id: "atibaia",
    nome: "Atibaia (Chácara do Advogado Wassef)",
    regiao: "Interior de São Paulo",
    coordenadasMapa: { x: 89, y: 89 },
    descricaoPadrao: "CHÁCARA EM ATIBAIA:\nRastro aponta para refúgio no interior de SP. A propriedade pertence a um conhecido advogado do clã. Relatos de churrascos discretos, bonecos de heróis e mensagens de rádio interceptadas.",
    retrato: "assets/images/queiroz_npc.png",
    nomeRetrato: "PARCEIRO: F. QUEIROZ",
    statusPF: "CÚMPLICE LOCALIZADO - INTERROGATÓRIO AUTORIZADO",
    investigacoes: [
      {
        id: "atibaia_queiroz",
        nome: "Abordar Fabrício Queiroz nos Fundos da Chácara",
        icone: "🧢",
        dialogo: "Fabrício Queiroz (jogando truco sozinho na varanda, assustado):\n\n'Opa, agente da Federal! Calma lá, eu sou apenas um homem de negócios, vendo carros usados e cuidando da minha bursite! Rachadinha? Que isso, eu só fazia a redistribuição voluntária dos vencimentos pra ajudar a bancar as despesas!\n\nMas ó... o chefe já subiu de patamar. Ele agora é Senador! Comprou uma mansão nababesca de R$ 6 milhões no Lago Sul em Brasília! Ele está lá agora assinando contratos com o BRB e cartórios!'",
        revelaEvidencia: {
          id: "cheque_queiroz",
          titulo: "Cheques Assinados e Mensagens de WhatsApp",
          icone: "📑",
          origem: "Chácara de Atibaia - SP",
          descricao: "Cópias de cheques nominais, comprovantes de depósitos e mensagens interceptadas comprovando pagamentos de despesas pessoais da família com dinheiro das rachadinhas."
        },
        revelaDestino: "brasilia"
      },
      {
        id: "atibaia_churrasqueira",
        nome: "Revistar Churrasqueira e Quarto de Hóspedes",
        icone: "🏊",
        dialogo: "Perito da Polícia Federal:\n\n'Encontramos caixas de panetone vazias da Kopenhagen queimadas na churrasqueira e um boneco do Capitão América. No quarto principal, havia uma pasta com plantas arquitetônicas de uma mansão cinematográfica no Setor de Mansões do Lago Sul em Brasília, além de bilhetes aéreos para a capital federal.'"
      }
    ],
    destinosPossiveis: ["rio", "brasilia", "punta_del_este"],
    voosDisponiveis: [
      {
        destinoId: "brasilia",
        nomeDestino: "Brasília (DF)",
        cia: "LATAM BR",
        voo: "LA-3301",
        status: "CONFIRMADO",
        pista: "Jatinho executivo decolou com pressa rumo ao Aeroporto Internacional JK em Brasília."
      },
      {
        destinoId: "rio",
        nomeDestino: "Rio de Janeiro (RJ)",
        cia: "GOL LINHAS",
        voo: "G3-2104",
        status: "RETORNO",
        pista: "Voo de retorno ao ponto de origem fluminense."
      },
      {
        destinoId: "punta_del_este",
        nomeDestino: "Punta del Este (Uruguai)",
        cia: "PLUNA CHARTER",
        voo: "PU-8821",
        status: "PISTA SUSPEITA",
        pista: "Boato sobre iate de luxo no Uruguai. Sem confirmação da guarda costeira."
      }
    ]
  },

  brasilia: {
    id: "brasilia",
    nome: "Brasília (Mansão de R$ 6 Milhões no Lago Sul)",
    regiao: "Distrito Federal",
    coordenadasMapa: { x: 91, y: 84 },
    descricaoPadrao: "LAGO SUL - BRASÍLIA:\nSetor nobre da capital federal. O suspeito adquiriu mansão cinematográfica de quase 2.500m² com entrada milionária em dinheiro não declarado e financiamento relâmpago em banco público.",
    retrato: "assets/images/corretor_npc.png",
    nomeRetrato: "CORRETOR DE IMÓVEIS NOBRE",
    statusPF: "MANDADO DE BUSCA E APREENSÃO EM ANDAMENTO",
    investigacoes: [
      {
        id: "brasilia_corretor",
        nome: "Interrogar Corretor de Imóveis no Lago Sul",
        icone: "👔",
        dialogo: "Corretor de Imóveis (ajustando a gravata de grife com as mãos trêmulas):\n\n'Doutor, a transação foi digna de Hollywood! Uma mansão de R$ 6 milhões... Ele deu quase R$ 3 milhões em \"recursos próprios\" que brotaram em espécie e o restante foi financiado a juros de pai para filho pelo BRB!\n\nMas ele já não está em Brasília! Quando soube que o Coaf e a PF fecharam o cerco, ele fez as malas e pegou um voo privado fretado direto para os Estados Unidos, com destino a Miami na Flórida! Ele foi se refugiar com aliados em Sunny Isles!'",
        revelaEvidencia: {
          id: "escritura_mansao",
          titulo: "Escritura Subfaturada da Mansão de R$ 6 Milhões",
          icone: "🏠",
          origem: "Cartório do Lago Sul - Brasília",
          descricao: "Escritura pública registrando a compra da mansão de luxo com entrada astronômica sem origem comprovada e crédito imobiliário sob suspeita de favorecimento político."
        },
        revelaDestino: "miami"
      },
      {
        id: "brasilia_senado",
        nome: "Inspecionar Gabinete no Senado Federal",
        icone: "🏛️",
        dialogo: "Assessor Parlamentar Comissionado:\n\n'O Senador não pisa aqui tem duas semanas. O gabinete está às moscas! Só encontramos uma caixa de bombons e um recibo de agência de turismo com passagens para a Flórida e reserva em resort 5 estrelas em Miami Beach!'"
      }
    ],
    destinosPossiveis: ["atibaia", "miami", "zurique"],
    voosDisponiveis: [
      {
        destinoId: "miami",
        nomeDestino: "Miami (EUA - Flórida)",
        cia: "AMERICAN AIRWAYS",
        voo: "AA-904",
        status: "CONFIRMADO",
        pista: "Jato particular Learjet decolou de madrugada direto para o sul da Flórida."
      },
      {
        destinoId: "atibaia",
        nomeDestino: "Atibaia (SP)",
        cia: "AZUL",
        voo: "AD-4412",
        status: "RETORNO",
        pista: "Sem movimentação de retorno para o interior paulista."
      },
      {
        destinoId: "zurique",
        nomeDestino: "Zurique (Suíça)",
        cia: "SWISS AIR",
        voo: "LX-093",
        status: "PISTA SUSPEITA",
        pista: "Rastro bancário nas contas helvéticas não gerou alertas da Interpol."
      }
    ]
  },

  miami: {
    id: "miami",
    nome: "Miami (Sunny Isles Beach - Resort de Luxo)",
    regiao: "Flórida, Estados Unidos",
    coordenadasMapa: { x: 74, y: 55 },
    descricaoPadrao: "SUNNY ISLES - MIAMI:\nBairro nobre conhecido como reduto de parlamentares e aliados foragidos. O suspeito foi avistado disfarçado em uma espreguiçadeira de resort à beira-mar, bebendo água de coco e tentando evitar a Interpol.",
    retrato: "assets/images/flavio_miami.png",
    nomeRetrato: "INVESTIGADO: FLÁVIO B. (DISFARÇADO)",
    statusPF: "CERCO FECHADO: CONFRONTO IMINENTE PELA PF E INTERPOL",
    investigacoes: [
      {
        id: "miami_confronto",
        nome: "Confrontar o Suspeito e Dar Voz de Prisão",
        icone: "🚨",
        dialogo: "Flávio B. (nervoso, abaixando os óculos escuros de grife e suando frio sob o sol da Flórida):\n\n'O quê?! Agentes da PF aqui em Miami?! Isso é um absurdo! Perseguição política da extrema-imprensa!\n\nCadê as provas?! Vocês não têm nada contra mim! Meus advogados já entraram com embargos infringentes no STF! Vocês não podem me tocar, eu tenho foro privilegiado!'",
        revelaEvidencia: {
          id: "flagrante_fuga",
          titulo: "Flagrante de Tentativa de Fuga Internacional",
          icone: "🚨",
          origem: "Sunny Isles Resort - Miami (EUA)",
          descricao: "Apreensão de passaporte diplomático, fardos de dólares e ordem de extradição cumprida em cooperação com a Interpol."
        }
      },
      {
        id: "miami_garcom",
        nome: "Interrogar Garçom do Resort",
        icone: "🍹",
        dialogo: "Barman do Resort à Beira-Mar:\n\n'Yes, Sir! O senhor de óculos escuros pediu uma caipirinha e tentou pagar com uma nota de R$ 100 carimbada com a marca da Kopenhagen do Rio! Ele parecia muito assustado toda vez que ouvia sirene de viatura na Collins Avenue!'"
      }
    ],
    destinosPossiveis: ["brasilia"],
    voosDisponiveis: [
      {
        destinoId: "brasilia",
        nomeDestino: "Brasília (Voo de Custódia da PF)",
        cia: "POLÍCIA FEDERAL",
        voo: "PF-CUSTODIA",
        status: "AGUARDANDO PROVAS",
        pista: "Aeronave oficial pronta para transportar o investigado de volta ao Brasil."
      }
    ]
  },

  // CIDADES DE PISTA FRIA (DISTRAÇÕES)
  buenos_aires: {
    id: "buenos_aires",
    nome: "Buenos Aires (Pista Fria!)",
    regiao: "Argentina",
    coordenadasMapa: { x: 86, y: 96 },
    descricaoPadrao: "BUENOS AIRES - PISTA FRIA:\nVocê seguiu um boato falso de alfajor! O suspeito nunca pisou na Casa Rosada. A polícia portenha informa que não há qualquer registro do investigado por aqui.\n\nVocê perdeu 1 dia precioso de investigação!",
    retrato: "assets/images/flavio_suspeito.png",
    nomeRetrato: "PISTA FALSA: NENHUM SUSPEITO",
    statusPF: "ALERTA: PISTA FRIA (-1 DIA DE PRAZO)",
    investigacoes: [
      {
        id: "ba_cafe",
        nome: "Perguntar no Tradicional Café Tortoni",
        icone: "☕",
        dialogo: "Garçom portenho:\n\n'¡No, che! Acá solo servimos café con leche y medialunas. Nadie conoce a ese tal Flávio. ¡Vuelva a Brasil antes que prescriban todos sus crímenes!'"
      }
    ],
    destinosPossiveis: ["rio", "atibaia"],
    voosDisponiveis: [
      {
        destinoId: "rio",
        nomeDestino: "Rio de Janeiro (RJ)",
        cia: "AEROLÍNEAS",
        voo: "AR-1241",
        status: "RETORNO",
        pista: "Retornar ao rastro original dos fatos no Rio de Janeiro."
      },
      {
        destinoId: "atibaia",
        nomeDestino: "Atibaia (SP)",
        cia: "GOL",
        voo: "G3-7440",
        status: "RECONEXÃO",
        pista: "Voo com conexão rumo a São Paulo."
      }
    ]
  },

  punta_del_este: {
    id: "punta_del_este",
    nome: "Punta del Este (Pista Fria!)",
    regiao: "Uruguai",
    coordenadasMapa: { x: 88, y: 94 },
    descricaoPadrao: "CASINO CONRAD - PISTA FRIA:\nVocê seguiu um rastro falso de lavagem em cassinos uruguaios. As mesas de roleta estão cheias de turistas, mas nenhum sinal do clã!\n\nVocê perdeu mais 1 dia de prazo!",
    retrato: "assets/images/flavio_suspeito.png",
    nomeRetrato: "PISTA FALSA: NENHUM SUSPEITO",
    statusPF: "ALERTA: PISTA FRIA (-1 DIA DE PRAZO)",
    investigacoes: [
      {
        id: "pde_casino",
        nome: "Interrogar Crupiê do Cassino",
        icone: "🎲",
        dialogo: "Crupiê do Cassino Conrad:\n\n'Senhor, aqui só apostam fichas de dólares. Ninguém compra fichas com caixas de chocolate nem com depósitos fracionados de assessores. O senhor está na cidade errada!'"
      }
    ],
    destinosPossiveis: ["atibaia", "brasilia"],
    voosDisponiveis: [
      {
        destinoId: "atibaia",
        nomeDestino: "Atibaia (SP)",
        cia: "AZUL",
        voo: "AD-8812",
        status: "RECONEXÃO",
        pista: "Retornar para o rastro do operador em Atibaia."
      },
      {
        destinoId: "brasilia",
        nomeDestino: "Brasília (DF)",
        cia: "LATAM",
        voo: "LA-4022",
        status: "RECONEXÃO",
        pista: "Seguir direto para a capital federal."
      }
    ]
  },

  zurique: {
    id: "zurique",
    nome: "Zurique (Pista Fria!)",
    regiao: "Suíça",
    coordenadasMapa: { x: 128, y: 44 },
    descricaoPadrao: "BAHNHOFSTRASSE - ZURIQUE:\nVocê viajou até a Europa seguindo boatos de contas secretas na Suíça. O sigilo bancário helvético é estrito e os operadores operavam no Brasil com dinheiro vivo e notas trocadas, não no exterior!\n\nMais 1 dia perdido!",
    retrato: "assets/images/flavio_suspeito.png",
    nomeRetrato: "PISTA FALSA: NENHUM SUSPEITO",
    statusPF: "ALERTA: PISTA FRIA (-1 DIA DE PRAZO)",
    investigacoes: [
      {
        id: "zrh_banco",
        nome: "Consultar Gerente de Private Banking",
        icone: "🏦",
        dialogo: "Banquero Suíço (frio e educado):\n\n'Herr Kommissar, aqui na Suíça exigimos compliance rigoroso. Seus investigados movimentavam fardos de dinheiro vivo em lojas de chocolate cariocas. Sugiro voltar para o continente americano imediatamente!'"
      }
    ],
    destinosPossiveis: ["brasilia", "miami"],
    voosDisponiveis: [
      {
        destinoId: "brasilia",
        nomeDestino: "Brasília (DF)",
        cia: "SWISS",
        voo: "LX-094",
        status: "RETORNO",
        pista: "Retornar ao rastro da mansão no Planalto Central."
      },
      {
        destinoId: "miami",
        nomeDestino: "Miami (EUA)",
        cia: "LUFTHANSA",
        voo: "LH-460",
        status: "RECONEXÃO",
        pista: "Voo transatlântico direto para a Flórida."
      }
    ]
  }
};

window.GAME_DATA = {
  state: { ...INITIAL_GAME_STATE },
  cities: GAME_CITIES,

  reset() {
    this.state = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
  }
};
