export default {
  id: 'aristotle',
  route: 'aristoteles',
  name: 'Aristóteles',
  greek: 'ΑΡΙΣΤΟΤΕΛΗΣ',
  dates: '384 – 322 a.C.',
  theme: 'aristotle',
  model: { src: 'models/aristotle.glb', scale: 1, yaw: 0 },
  readMore: { label: 'Ler mais', href: 'https://plato.stanford.edu/entries/aristotle/' },

  hero: {
    eyebrow: 'O mestre dos que sabem',
    sideLeft: {
      title: 'Da observação ao saber',
      text: 'Para Aristóteles, todo conhecimento começa pelos sentidos. A forma não está num céu separado: está nas próprias coisas.',
    },
    sideRight: {
      title: 'O Liceu',
      text: 'Em 335 a.C. fundou sua escola no Liceu, onde ensinava caminhando pelo passeio coberto. Daí o nome “peripatéticos”.',
    },
    credits: ['Estagira', 'Liceu', 'Lógica', 'Política'],
  },

  thesis: {
    lines: [
      [['rm', 'Todos os'], ['it', 'homens']],
      [['caps', 'por natureza']],
      [['it', 'desejam'], ['rm', 'saber*']],
    ],
    note: '*Metafísica, I, 980a: a primeira frase da obra.',
    text: 'Aluno de Platão por duas décadas, Aristóteles discordou do mestre num ponto decisivo: as formas não existem num mundo à parte, mas nas próprias coisas. Observou, classificou e explicou quase tudo, dos animais marinhos às constituições das cidades, e criou a lógica como ferramenta de todo saber.',
    bigWord: 'ΕΥΔΑΙΜΟΝΙΑ',
    bigWordLabel: '“Eudaimonía”: felicidade, florescimento, uma vida bem vivida',
  },

  ideas: [
    {
      title: 'Matéria e forma',
      tag: 'A substância',
      body: [
        'Contra Platão, Aristóteles afirma que a realidade primeira são as coisas individuais: este homem, este cavalo. Cada uma é um composto de matéria, aquilo de que é feita, e forma, aquilo que a faz ser o que é.',
        'A forma não vive separada num outro mundo: está na própria coisa.',
      ],
      source: 'Aristóteles, Categorias, 5; Metafísica, VII',
    },
    {
      title: 'As quatro causas',
      tag: 'Por que as coisas são',
      body: [
        'Explicar algo é dar as suas quatro causas. Numa estátua de bronze, a causa material é o bronze; a formal, a figura; a eficiente, o escultor; e a final, o propósito para o qual ela foi feita.',
        'Para Aristóteles, a natureza também age em vista de um fim.',
      ],
      source: 'Aristóteles, Física, II, 3; Metafísica, V, 2',
    },
    {
      title: 'Ato e potência',
      tag: 'O movimento',
      body: [
        'A semente é árvore em potência; a árvore é a semente em ato. Com esse par de conceitos, Aristóteles explica a mudança sem negá-la, como fizera Parmênides.',
        'No topo do cosmos está o Motor Imóvel: ato puro, que move todas as coisas como objeto de desejo.',
      ],
      source: 'Aristóteles, Física, III, 1; Metafísica, IX e XII',
    },
    {
      title: 'A lógica',
      tag: 'O instrumento do saber',
      body: [
        'Aristóteles foi o primeiro a estudar o raciocínio em si mesmo. O silogismo mostra como, de duas premissas, segue-se necessariamente uma conclusão: se todo homem é mortal e Sócrates é homem, Sócrates é mortal.',
        'E nada pode, ao mesmo tempo e sob o mesmo aspecto, ser e não ser: é o princípio de não contradição.',
      ],
      source: 'Aristóteles, Primeiros Analíticos, I; Metafísica, IV, 3, 1005b',
    },
    {
      title: 'Eudaimonia',
      tag: 'A felicidade',
      body: [
        'Tudo o que fazemos visa a algum bem, e o bem supremo é a felicidade. Mas ela não é prazer nem riqueza: é a atividade da alma de acordo com a virtude, ao longo de uma vida inteira.',
        '“Uma andorinha só não faz verão.”',
      ],
      source: 'Aristóteles, Ética a Nicômaco, I, 7, 1097b–1098a',
    },
    {
      title: 'A virtude é hábito',
      tag: 'O caráter',
      body: [
        'Ninguém nasce virtuoso. Tornamo-nos justos praticando atos justos, moderados praticando atos moderados, corajosos praticando atos corajosos.',
        'O caráter se forma pela repetição, até que agir bem se torne uma segunda natureza.',
      ],
      source: 'Aristóteles, Ética a Nicômaco, II, 1, 1103a–b',
    },
    {
      title: 'O animal político',
      tag: 'A pólis',
      body: [
        'O ser humano é por natureza um animal político: só na cidade ele realiza plenamente a sua natureza, porque só ele tem a palavra (lógos) para discutir o justo e o injusto.',
        'Quem vive fora da cidade é uma fera ou um deus.',
      ],
      source: 'Aristóteles, Política, I, 2, 1253a',
    },
    {
      title: 'As constituições',
      tag: 'Seis formas de governo',
      body: [
        'Aristóteles classificou três formas retas de governo (monarquia, aristocracia e politeia) e seus três desvios (tirania, oligarquia e democracia, no sentido de governo em proveito apenas dos pobres).',
        'O critério é um só: governa-se pelo bem comum ou pelo interesse de quem governa?',
      ],
      source: 'Aristóteles, Política, III, 7, 1279a–b',
    },
  ],

  featured: {
    type: 'mean',
    kicker: 'Em destaque',
    title: 'O justo meio',
    intro: 'A virtude é uma disposição de escolher o meio-termo relativo a nós, entre dois vícios: um por falta e outro por excesso.',
    source: 'Ética a Nicômaco, II, 6, 1106b–1107a',
    virtues: [
      { name: 'Coragem', domain: 'diante do medo e da confiança', lack: 'Covardia', excess: 'Temeridade' },
      { name: 'Temperança', domain: 'diante dos prazeres', lack: 'Insensibilidade', excess: 'Intemperança' },
      { name: 'Generosidade', domain: 'ao dar e receber dinheiro', lack: 'Avareza', excess: 'Prodigalidade' },
      { name: 'Magnanimidade', domain: 'diante das grandes honras', lack: 'Pusilanimidade', excess: 'Vaidade' },
      { name: 'Mansidão', domain: 'diante da raiva', lack: 'Indolência', excess: 'Irascibilidade' },
      { name: 'Veracidade', domain: 'ao falar de si mesmo', lack: 'Falsa modéstia', excess: 'Jactância' },
      { name: 'Espirituosidade', domain: 'na diversão e no humor', lack: 'Rusticidade', excess: 'Bufonaria' },
      { name: 'Amabilidade', domain: 'no convívio diário', lack: 'Grosseria', excess: 'Bajulação' },
    ],
  },

  quotes: [
    { text: 'Todos os homens, por natureza, desejam saber.', source: 'Metafísica, I, 980a' },
    { text: 'O homem é por natureza um animal político.', source: 'Política, I, 1253a' },
    { text: 'Uma andorinha só não faz verão, nem um só dia; assim, um dia ou um breve tempo não fazem ninguém feliz.', source: 'Ética a Nicômaco, I, 1098a' },
    { text: 'Tornamo-nos justos praticando atos justos.', source: 'Ética a Nicômaco, II, 1103b' },
    { text: 'Sendo ambos amigos, é dever sagrado honrar a verdade acima dos amigos.', source: 'Ética a Nicômaco, I, 1096a' },
    { text: 'A natureza não faz nada em vão.', source: 'Política, I, 1253a' },
    { text: 'É próprio do homem instruído buscar a precisão em cada assunto apenas até onde a natureza do assunto permite.', source: 'Ética a Nicômaco, I, 1094b' },
    { text: 'O amigo é uma só alma habitando dois corpos.', source: 'Diógenes Laércio, Vidas, V, 20' },
  ],

  glossary: [
    { greek: 'εὐδαιμονία', latin: 'eudaimonía', pt: 'Felicidade', text: 'O florescimento de uma vida inteira vivida segundo a virtude.' },
    { greek: 'μεσότης', latin: 'mesótēs', pt: 'Meio-termo', text: 'O ponto justo entre o excesso e a falta.' },
    { greek: 'ἐνέργεια', latin: 'enérgeia', pt: 'Ato', text: 'A realização do que antes era só possibilidade.' },
    { greek: 'δύναμις', latin: 'dýnamis', pt: 'Potência', text: 'A capacidade de vir a ser algo.' },
    { greek: 'οὐσία', latin: 'ousía', pt: 'Substância', text: 'Aquilo que existe por si: este homem, este cavalo.' },
    { greek: 'τέλος', latin: 'télos', pt: 'Finalidade', text: 'O fim em vista do qual algo existe ou se faz.' },
    { greek: 'φρόνησις', latin: 'phrónēsis', pt: 'Prudência', text: 'A sabedoria prática de agir bem em cada caso concreto.' },
  ],

  life: {
    title: 'A vida de Aristóteles',
    image: 'img/aristotle.jpg',
    imageAlt: 'Aristóteles com um busto de Homero, de Rembrandt: um homem de chapéu negro e manto dourado pousa a mão sobre um busto de mármore.',
    imageCredit: 'Rembrandt, Aristóteles com um busto de Homero, 1653 · The Met, domínio público',
    focus: '45% 35%',
    events: [
      { year: '384 a.C.', title: 'Nasce em Estagira', text: 'Na Calcídica, norte da Grécia. Seu pai, Nicômaco, era médico do rei Amintas III da Macedônia.' },
      { year: '367 a.C.', title: 'Entra na Academia', text: 'Aos dezessete anos chega a Atenas e estuda com Platão por cerca de vinte anos.' },
      { year: '347 a.C.', title: 'Anos de viagem', text: 'Com a morte de Platão, parte para Assos e depois para Lesbos, onde pesquisa a vida marinha com Teofrasto.' },
      { year: '343 a.C.', title: 'Preceptor de Alexandre', text: 'Convidado por Filipe II, educa o jovem Alexandre em Mieza, na Macedônia.' },
      { year: '335 a.C.', title: 'Funda o Liceu', text: 'De volta a Atenas, cria sua escola e uma grande biblioteca. Ensina caminhando: são os peripatéticos.' },
      { year: '322 a.C.', title: 'Morre em Cálcis', text: 'Após a morte de Alexandre, deixa Atenas para que a cidade “não pecasse duas vezes contra a filosofia”.' },
    ],
    quote: {
      text: 'Vi o mestre dos que sabem, sentado entre a família filosófica.',
      source: 'Dante Alighieri, Divina Comédia, Inferno, IV, 131–132',
      by: 'Dante Alighieri',
      role: 'Poeta, 1265–1321',
    },
  },

  next: { id: 'socrates', line: 'Aristóteles ensinou Alexandre. Recomece a linhagem' },
};
