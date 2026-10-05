export default {
  id: 'socrates',
  route: 'socrates',
  name: 'Sócrates',
  greek: 'ΣΩΚΡΑΤΗΣ',
  dates: 'c. 470 – 399 a.C.',
  theme: 'socrates',
  model: { src: 'models/socrates.glb', scale: 1, yaw: 0 },
  readMore: { label: 'Ler mais', href: 'https://plato.stanford.edu/entries/socrates/' },

  hero: {
    eyebrow: 'O moscardo de Atenas',
    sideLeft: {
      title: 'A arte de perguntar',
      text: 'Andava pela ágora interrogando generais, poetas e artesãos sobre o que é a coragem, a justiça, a virtude. E descobria que ninguém sabia.',
    },
    sideRight: {
      title: 'O julgamento',
      text: 'Em 399 a.C. foi acusado de impiedade e de corromper a juventude. Condenado, recusou a fuga e bebeu a cicuta.',
    },
    credits: ['Atenas', 'Ágora', 'Maiêutica', 'Cicuta'],
    // Paisagem em camadas atrás do pôster (do fundo para a frente). speed: quanto a camada sobe
    // enquanto a seção seguinte cobre o hero; quanto mais perto, mais rápido.
    scene: [
      { src: 'img/socrates-bg-0.webp', speed: '2vh' },
      { src: 'img/socrates-bg-1.webp', speed: '6vh' },
      { src: 'img/socrates-bg-2.webp', speed: '11vh' },
      { src: 'img/socrates-bg-3.webp', speed: '18vh' },
    ],
  },

  thesis: {
    lines: [
      [['rm', 'Uma'], ['it', 'vida']],
      [['caps', 'sem exame']],
      [['it', 'não vale'], ['rm', 'a pena']],
      [['rm', 'ser'], ['caps', 'vivida*']],
    ],
    note: '*Apologia de Sócrates, 38a: palavras de Sócrates ao júri que o condenaria.',
    text: 'Sócrates não deixou livros, escola nem sistema. Deixou um método: perguntar até que a opinião mostre suas rachaduras. Para ele, filosofar não era acumular saber, mas cuidar da alma, examinando a si mesmo e aos outros, todos os dias, na praça pública.',
    bigWord: 'ΓΝΩΘΙ ΣΕΑΥΤΟΝ',
    bigWordLabel: '“Conhece-te a ti mesmo”, inscrição do templo de Apolo em Delfos',
  },

  ideas: [
    {
      title: 'Só sei que nada sei',
      tag: 'A ignorância sábia',
      body: [
        'Quando seu amigo Querefonte perguntou ao Oráculo de Delfos se havia alguém mais sábio que Sócrates, a sacerdotisa respondeu que não. Intrigado, Sócrates passou a interrogar os que tinham fama de sábios (políticos, poetas, artesãos) e descobriu que todos acreditavam saber o que não sabiam.',
        'Sua vantagem era uma só: ele sabia que não sabia. A consciência da própria ignorância não é o fim do conhecimento, mas o seu ponto de partida.',
      ],
      source: 'Platão, Apologia, 21a–23b. A fórmula “só sei que nada sei” é uma síntese posterior; o texto diz “não sei, nem penso saber” (21d).',
    },
    {
      title: 'O élenchos',
      tag: 'A refutação',
      body: [
        'O método socrático começa com uma pergunta simples (“o que é a coragem?”) e uma resposta confiante do interlocutor. Sócrates faz novas perguntas, obtém concordância em pontos que parecem óbvios e mostra que eles contradizem a definição inicial.',
        'O objetivo não é humilhar, mas purificar: livrar a alma de falsas certezas para que a busca verdadeira possa começar. Muitos diálogos terminam em aporia, um impasse honesto.',
      ],
      source: 'Platão, Laques; Eutífron; Mênon',
    },
    {
      title: 'Maiêutica',
      tag: 'O parto das ideias',
      body: [
        'Filho da parteira Fenarete, Sócrates dizia praticar o mesmo ofício da mãe, mas com almas em vez de corpos. Ele próprio não dava à luz sabedoria alguma: ajudava os outros a parir as ideias que já traziam dentro de si e a examinar se eram verdadeiras ou apenas “ovos de vento”.',
      ],
      source: 'Platão, Teeteto, 148e–151d',
    },
    {
      title: 'Virtude é conhecimento',
      tag: 'Intelectualismo moral',
      body: [
        'Para Sócrates, ninguém faz o mal voluntariamente. Quem age mal o faz por ignorância: confunde o que parece bom com o que é realmente bom.',
        'Se a virtude é uma forma de conhecimento, então ela pode ser buscada, examinada e, em certo sentido, aprendida.',
      ],
      source: 'Platão, Protágoras, 345d–e; 352b–358d',
    },
    {
      title: 'O cuidado da alma',
      tag: 'Epiméleia tês psykhês',
      body: [
        'Diante do júri, Sócrates se apresenta como alguém que passou a vida exortando os atenienses a não se preocuparem com dinheiro, fama ou honra antes de cuidarem da alma, para que ela seja a melhor possível.',
        'A riqueza não produz a virtude; é da virtude que vêm os verdadeiros bens.',
      ],
      source: 'Platão, Apologia, 29d–30b',
    },
    {
      title: 'A pergunta “o que é?”',
      tag: 'A busca da definição',
      body: [
        'Não bastava a Sócrates ouvir exemplos de atos piedosos ou corajosos: ele queria a essência que todos eles têm em comum. Essa busca pela definição universal, o “tí esti?”, abriu caminho para a teoria das Formas de Platão e para a lógica de Aristóteles.',
      ],
      source: 'Platão, Eutífron, 5c–6e; Aristóteles, Metafísica, XIII, 4, 1078b',
    },
    {
      title: 'Melhor sofrer a injustiça',
      tag: 'A ética do justo',
      body: [
        'Contra Polo e Cálicles, Sócrates sustenta uma tese que choca seus ouvintes: cometer uma injustiça é pior do que sofrê-la, porque quem a comete corrompe a própria alma.',
        'Coerente até o fim, recusou-se a fugir da prisão: desobedecer às leis seria retribuir uma injustiça com outra.',
      ],
      source: 'Platão, Górgias, 469c; Críton, 49a–e',
    },
    {
      title: 'O daimónion',
      tag: 'A voz interior',
      body: [
        'Sócrates afirmava ouvir, desde a infância, um sinal divino que nunca o mandava fazer algo, apenas o detinha quando estava prestes a errar.',
        'No dia do julgamento, observou que a voz não se manifestou nenhuma vez: sinal de que o que lhe acontecia não era um mal.',
      ],
      source: 'Platão, Apologia, 31c–d; 40a–c',
    },
  ],

  featured: {
    type: 'steps',
    variant: 'method',
    kicker: 'Em destaque',
    title: 'O método em quatro tempos',
    intro: 'Como uma conversa na ágora se tornava filosofia.',
    steps: [
      {
        title: 'Ironia',
        greek: 'εἰρωνεία',
        text: 'Sócrates finge não saber e pede ao interlocutor que o ensine. A falsa modéstia abre a conversa e baixa as defesas.',
      },
      {
        title: 'Pergunta',
        greek: 'ἐρώτησις',
        text: '“O que é a justiça?” O interlocutor responde com segurança. Sócrates aceita a resposta e pede apenas alguns esclarecimentos.',
      },
      {
        title: 'Refutação',
        greek: 'ἔλεγχος',
        text: 'Pergunta após pergunta, as concordâncias se acumulam até revelar uma contradição. A definição inicial desmorona.',
      },
      {
        title: 'Aporia',
        greek: 'ἀπορία',
        text: 'Sem saída, o interlocutor reconhece que não sabe. Desse impasse nasce a verdadeira investigação e, às vezes, uma nova ideia vem à luz.',
      },
    ],
  },

  quotes: [
    { text: 'Uma vida sem exame não vale a pena ser vivida.', source: 'Apologia, 38a' },
    { text: 'Não sei, nem penso saber.', source: 'Apologia, 21d' },
    { text: 'Não é o viver que se deve ter na mais alta conta, mas o viver bem.', source: 'Críton, 48b' },
    { text: 'Cometer uma injustiça é pior do que sofrê-la.', source: 'Górgias, 469c' },
    { text: 'Ninguém comete o mal voluntariamente.', source: 'Protágoras, 345e' },
    { text: 'Sou como um moscardo que o deus colocou sobre a cidade.', source: 'Apologia, 30e' },
    { text: 'Críton, devemos um galo a Asclépio. Paguem essa dívida, não se esqueçam.', source: 'Fédon, 118a' },
    { text: 'Chegou a hora de partir: eu para morrer, vós para viver. Quem vai para o melhor, só o deus sabe.', source: 'Apologia, 42a' },
  ],

  glossary: [
    { greek: 'ἔλεγχος', latin: 'élenchos', pt: 'Refutação', text: 'O exame por perguntas que expõe as contradições de uma crença.' },
    { greek: 'εἰρωνεία', latin: 'eirōneía', pt: 'Ironia', text: 'A dissimulação de quem finge saber menos do que sabe para iniciar o diálogo.' },
    { greek: 'μαιευτική', latin: 'maieutikḗ', pt: 'Maiêutica', text: 'A arte da parteira: ajudar o outro a dar à luz as próprias ideias.' },
    { greek: 'ἀρετή', latin: 'aretḗ', pt: 'Virtude', text: 'Excelência: o melhor que algo ou alguém pode ser.' },
    { greek: 'ψυχή', latin: 'psykhḗ', pt: 'Alma', text: 'O centro da vida moral, aquilo que mais precisa de cuidado.' },
    { greek: 'ἀπορία', latin: 'aporía', pt: 'Impasse', text: 'A perplexidade de quem descobre que não sabe e começa, enfim, a pensar.' },
    { greek: 'δαιμόνιον', latin: 'daimónion', pt: 'Sinal divino', text: 'A voz interior que detinha Sócrates à beira do erro.' },
  ],

  life: {
    title: 'A vida de Sócrates',
    image: 'img/socrates.jpg',
    imageAlt: 'A Morte de Sócrates, pintura de Jacques-Louis David: Sócrates, sentado na cama, ergue a mão enquanto recebe a taça de cicuta, cercado por discípulos em lamento.',
    imageCredit: 'Jacques-Louis David, A Morte de Sócrates, 1787 · The Met, domínio público',
    focus: '50% 40%',
    events: [
      { year: 'c. 470 a.C.', title: 'Nasce em Atenas', text: 'No demo de Alópece, filho de Sofronisco, escultor, e de Fenarete, parteira.' },
      { year: '432 a.C.', title: 'Soldado em Potideia', text: 'Serve como hoplita e salva a vida do jovem Alcibíades. Lutaria também em Délio e Anfípolis.' },
      { year: '423 a.C.', title: 'Alvo do teatro', text: 'Aristófanes o retrata em As Nuvens como um sofista excêntrico que vive com a cabeça nas nuvens.' },
      { year: '406 a.C.', title: 'Diz não à assembleia', text: 'Como membro do conselho, é o único a se opor ao julgamento coletivo e ilegal dos generais das Arginusas.' },
      { year: '404 a.C.', title: 'Desafia os Trinta', text: 'Recebe dos Trinta Tiranos a ordem de prender Leão de Salamina e simplesmente volta para casa.' },
      { year: '399 a.C.', title: 'Julgamento e morte', text: 'Acusado de impiedade e de corromper os jovens, é condenado por um júri de 501 cidadãos e bebe a cicuta.' },
    ],
    quote: {
      text: 'Este foi o fim do nosso amigo, o homem que, podemos dizer, foi o melhor de todos os que conhecemos em seu tempo, e também o mais sábio e o mais justo.',
      source: 'Platão, Fédon, 118a',
      by: 'Fédon de Élis',
      role: 'Testemunha das últimas horas de Sócrates',
    },
  },

  next: { id: 'plato', line: 'Sócrates ensinou Platão' },
};
