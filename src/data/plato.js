export default {
  id: 'plato',
  route: 'platao',
  name: 'Platão',
  greek: 'ΠΛΑΤΩΝ',
  dates: 'c. 428 – 348 a.C.',
  theme: 'plato',
  model: { src: 'models/plato.glb', scale: 0.9, yaw: 0 },
  readMore: { label: 'Ler mais', href: 'https://plato.stanford.edu/entries/plato/' },

  hero: {
    eyebrow: 'O fundador da Academia',
    topLeft: {
      title: 'Platão de Atenas',
      text: 'Aristocrata, lutador, poeta que, segundo a tradição, queimou os próprios versos depois de ouvir Sócrates.',
    },
    topRight: {
      title: 'c. 428 – 348 a.C.',
      text: 'Autor de cerca de trinta e cinco diálogos, todos preservados até hoje.',
    },
    sideLeft: {
      title: 'O mundo das Formas',
      text: 'Por trás de tudo o que muda, Platão viu realidades eternas e perfeitas, as Formas, que só a razão pode contemplar.',
    },
    sideRight: {
      title: 'A Academia',
      text: 'Por volta de 387 a.C. fundou, nos jardins de Academo, a escola que daria nome a todas as academias.',
    },
    bottom: 'Tudo o que vemos é sombra de algo mais real. Platão convidou a filosofia a sair da caverna e olhar para o sol.',
    credits: ['Atenas', 'Academia', 'Caverna', 'República'],
  },

  thesis: {
    lines: [
      [['rm', 'A'], ['it', 'filosofia']],
      [['caps', 'começa']],
      [['rm', 'com o'], ['it', 'espanto*']],
    ],
    note: '*Teeteto, 155d: “o espanto é a experiência própria do filósofo; a filosofia não tem outro começo”.',
    text: 'Discípulo de Sócrates, Platão transformou as perguntas do mestre num sistema grandioso. O mundo que tocamos é mutável e imperfeito; acima dele está o mundo inteligível das Formas, eterno e verdadeiro. Conhecer é elevar a alma das sombras à luz, e quem chega lá tem o dever de voltar para governar a cidade.',
    bigWord: 'ΙΔΕΑ',
    bigWordLabel: '“Idéa”: forma, aspecto, aquilo que se vê com o olho da mente',
  },

  ideas: [
    {
      title: 'A teoria das Formas',
      tag: 'Dois mundos',
      body: [
        'As coisas belas nascem, envelhecem e morrem; o Belo em si, não. Platão distingue o mundo sensível, das coisas que mudam, e o mundo inteligível, das Formas (ou Ideias): modelos eternos, imutáveis e perfeitos dos quais as coisas participam.',
        'Um ato é justo porque participa da Justiça; algo é belo porque participa do Belo. Só a razão, e não os sentidos, alcança as Formas.',
      ],
      source: 'Platão, Fédon, 74a–75d; República, livros V–VII',
    },
    {
      title: 'O Bem como sol',
      tag: 'A Forma suprema',
      body: [
        'Assim como o sol torna as coisas visíveis e as faz crescer, a Forma do Bem torna as Formas cognoscíveis e lhes dá o ser. Ela está “além da essência” em dignidade e poder: é o princípio último de toda a realidade e de todo conhecimento.',
      ],
      source: 'Platão, República, VI, 507b–509b',
    },
    {
      title: 'Anamnese',
      tag: 'Conhecer é recordar',
      body: [
        'No Mênon, Sócrates guia um escravo sem instrução até a solução de um problema de geometria apenas com perguntas.',
        'Para Platão, isso mostra que a alma já conhecia a verdade: imortal, ela contemplou as Formas antes de nascer, e aprender é relembrar o que esqueceu.',
      ],
      source: 'Platão, Mênon, 81b–86b; Fédon, 72e–77a',
    },
    {
      title: 'A alma tripartite',
      tag: 'Razão, ânimo e desejo',
      body: [
        'A alma tem três partes: a razão, que calcula; o ânimo (thymós), que se indigna e busca honra; e o apetite, que deseja prazeres.',
        'No Fedro, ela é um cocheiro conduzindo dois cavalos alados, um nobre e outro rebelde. A justiça interior é a harmonia em que a razão governa.',
      ],
      source: 'Platão, República, IV, 435b–441c; Fedro, 246a–254e',
    },
    {
      title: 'A cidade justa',
      tag: 'A República',
      body: [
        'A cidade ideal tem três classes que espelham a alma: governantes, guardiões e produtores. Ela é justa quando cada parte faz o que lhe cabe.',
        'Como só quem conhece o Bem sabe governar, os males das cidades só cessarão quando os filósofos forem reis ou os reis se tornarem filósofos.',
      ],
      source: 'Platão, República, IV, 433a–434c; V, 473c–d',
    },
    {
      title: 'A escada do amor',
      tag: 'Eros e o Belo',
      body: [
        'No Banquete, a sacerdotisa Diotima ensina que o amor é desejo do Belo e sobe por degraus: do corpo belo a todos os corpos, depois às almas, às leis, aos saberes, até a contemplação do Belo em si, eterno e puro.',
      ],
      source: 'Platão, Banquete, 201d–212a',
    },
    {
      title: 'A dialética',
      tag: 'O caminho para o alto',
      body: [
        'A dialética é a arte de perguntar e responder que permite à razão subir de hipótese em hipótese até um princípio que não depende de nenhum outro.',
        'Na imagem da linha dividida, ela ocupa o degrau mais alto: o conhecimento puro das Formas.',
      ],
      source: 'Platão, República, VI, 509d–511e; VII, 531d–535a',
    },
    {
      title: 'O mito de Er',
      tag: 'A imortalidade da alma',
      body: [
        'A República termina com o relato de Er, soldado que voltou da morte para contar o destino das almas: julgadas por sua vida, elas escolhem a existência seguinte.',
        'A filosofia é a preparação para escolher bem.',
      ],
      source: 'Platão, República, X, 614b–621d',
    },
  ],

  featured: {
    type: 'steps',
    variant: 'cave',
    kicker: 'Em destaque',
    title: 'A Alegoria da Caverna',
    intro: 'República, livro VII, 514a–520a.',
    steps: [
      {
        title: 'As sombras',
        greek: 'σκιαί',
        text: 'Prisioneiros acorrentados desde a infância veem apenas sombras projetadas na parede do fundo. Para eles, as sombras são toda a realidade.',
      },
      {
        title: 'O fogo',
        greek: 'πῦρ',
        text: 'Um deles é libertado e se volta: vê o fogo e os objetos que projetavam as sombras. A luz fere seus olhos, e ele duvida do que vê.',
      },
      {
        title: 'A subida',
        greek: 'ἀνάβασις',
        text: 'Arrastado pela encosta até a saída, ele é ofuscado pelo dia. Primeiro distingue sombras e reflexos na água, depois as próprias coisas.',
      },
      {
        title: 'O sol',
        greek: 'ἥλιος',
        text: 'Por fim, contempla o sol, imagem do Bem, causa de tudo o que é visível e verdadeiro. Agora ele compreende.',
      },
      {
        title: 'O retorno',
        greek: 'κατάβασις',
        text: 'Ele desce para libertar os outros. Cego pela escuridão, é ridicularizado e, se tentasse soltá-los, eles o matariam.',
      },
    ],
  },

  quotes: [
    { text: 'A filosofia começa com o espanto.', source: 'Teeteto, 155d' },
    { text: 'O tempo é a imagem móvel da eternidade.', source: 'Timeu, 37d' },
    { text: 'Os males das cidades não terão fim enquanto os filósofos não forem reis, ou os reis, filósofos.', source: 'República, V, 473c–d' },
    { text: 'O começo é a parte mais importante de toda obra.', source: 'República, II, 377a' },
    { text: 'A pior pena para quem se recusa a governar é ser governado por alguém pior.', source: 'República, I, 347c' },
    { text: 'Nenhum conhecimento adquirido à força permanece na alma.', source: 'República, VII, 536e' },
    { text: 'Pensar é o diálogo silencioso da alma consigo mesma.', source: 'Sofista, 263e' },
    { text: 'Aprender não é outra coisa senão recordar.', source: 'Fédon, 72e' },
  ],

  glossary: [
    { greek: 'ἰδέα', latin: 'idéa', pt: 'Forma', text: 'O modelo eterno e perfeito de que as coisas sensíveis participam.' },
    { greek: 'ἀνάμνησις', latin: 'anámnēsis', pt: 'Reminiscência', text: 'Aprender é recordar o que a alma contemplou antes de nascer.' },
    { greek: 'διαλεκτική', latin: 'dialektikḗ', pt: 'Dialética', text: 'A arte de perguntar e responder que conduz a razão até as Formas.' },
    { greek: 'ἀγαθόν', latin: 'agathón', pt: 'O Bem', text: 'A Forma suprema, o sol do mundo inteligível.' },
    { greek: 'δικαιοσύνη', latin: 'dikaiosýnē', pt: 'Justiça', text: 'A harmonia em que cada parte cumpre a sua função.' },
    { greek: 'θυμός', latin: 'thymós', pt: 'Ânimo', text: 'A parte ardente da alma, aliada natural da razão.' },
    { greek: 'ἔρως', latin: 'érōs', pt: 'Amor', text: 'O desejo do Belo, que eleva a alma degrau a degrau.' },
  ],

  life: {
    title: 'A vida de Platão',
    image: 'img/plato.jpg',
    imageAlt: 'Detalhe de A Escola de Atenas, de Rafael: Platão aponta para o céu e Aristóteles estende a mão para a terra, no centro de uma grande arcada.',
    imageCredit: 'Rafael, A Escola de Atenas (detalhe), 1509–1511 · Museus Vaticanos, domínio público',
    focus: '45% 62%',
    events: [
      { year: 'c. 428 a.C.', title: 'Nasce em Atenas', text: 'De família aristocrática, teria recebido o nome de Arístocles; “Platão” seria um apelido ligado a “largo”, talvez pelos ombros de lutador.' },
      { year: 'c. 407 a.C.', title: 'Encontra Sócrates', text: 'Segundo a tradição, queima as tragédias que escrevia e torna-se discípulo do mestre.' },
      { year: '399 a.C.', title: 'A morte do mestre', text: 'A condenação de Sócrates o afasta da política ateniense. Parte para Mégara e, depois, viaja pelo Mediterrâneo.' },
      { year: 'c. 387 a.C.', title: 'Funda a Academia', text: 'De volta da Sicília, cria sua escola nos jardins de Academo, nos arredores de Atenas.' },
      { year: '367 e 361 a.C.', title: 'O sonho de Siracusa', text: 'Tenta fazer do tirano Dionísio II um rei-filósofo. As duas viagens fracassam.' },
      { year: 'c. 348 a.C.', title: 'Morre em Atenas', text: 'Deixa cerca de trinta e cinco diálogos e uma escola que funcionaria, sob várias formas, por séculos.' },
    ],
    quote: {
      text: 'Talvez exista no céu um modelo dessa cidade, para quem quiser contemplá-lo e, contemplando-o, fundá-la dentro de si mesmo.',
      source: 'Platão, República, IX, 592b',
      by: 'Sócrates',
      role: 'Personagem dos diálogos de Platão',
    },
  },

  next: { id: 'aristotle', line: 'Platão ensinou Aristóteles' },
};
