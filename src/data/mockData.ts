import { Campaign, Metric, FaqItem } from "@/types";

export const DEMO_NOTICE = {
  isDemoEnvironment: true,
  badgeText: "Ambiente de Demonstração — Patas do Bem",
  disclaimer:
    "Todos os dados, nomes, valores e campanhas exibidos nesta página são fictícios e destinados exclusivamente à validação de interface e experiência de usuário no Patas do Bem.",
  paymentsDisabledMessage:
    "O módulo de pagamentos está desativado nesta etapa. Nenhuma transação financeira real pode ser realizada.",
};

export const MOCK_METRICS: Metric[] = [
  {
    label: "Vidas amparadas",
    value: "142+",
    description: "Cães e gatos atendidos em simulação",
    isFictional: true,
  },
  {
    label: "Campanhas ativas",
    value: "28",
    description: "Casos simulados em tratamento",
    isFictional: true,
  },
  {
    label: "Protetores parceiros",
    value: "35",
    description: "ONGs e voluntários independentes cadastrados",
    isFictional: true,
  },
  {
    label: "Prestação de contas",
    value: "100%",
    description: "Transparência total com notas e recibos",
    isFictional: true,
  },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-01",
    title: "Cirurgia ortopédica para o Pipoca voltar a correr",
    animalName: "Pipoca",
    species: "dog",
    age: "Aprox. 2 anos",
    breed: "Sem Raça Definida (SRD)",
    location: "Curitiba, PR",
    rescuerName: "Dona Clara Resgates",
    rescuerType: "independent",
    category: "surgery",
    categoryLabel: "Cirurgia Ortopédica",
    imageUrl: "/images/animals/cao-pipoca.jpg",
    summary:
      "Pipoca foi resgatado após ser atropelado em uma rodovia. Precisa com urgência de cirurgia para fixação do fêmur e fisioterapia.",
    story:
      "O Pipoca é um cãozinho alegre e muito dócil que teve a pata traseira fraturada após um atropelamento. Uma protetora independente o acolheu e custeou os primeiros socorros de emergência. Agora, a cirurgia com ortopedista veterinário é essencial para evitar a amputação e devolver a mobilidade desse guerreiro.",
    targetAmount: 3200,
    raisedAmount: 2450,
    supportersCount: 42,
    urgency: "high",
    createdAt: "2026-10-10",
    updates: [
      {
        date: "14/10/2026",
        description:
          "Consulta pré-operatória realizada. Exames de sangue mostraram que Pipoca está apto para cirurgia assim que a meta for atingida.",
      },
      {
        date: "11/10/2026",
        description:
          "Medicação para dor e tala provisória colocadas na clínica parceira.",
      },
    ],
  },
  {
    id: "camp-02",
    title: "Tratamento veterinário intensivo para o pequeno Mingau",
    animalName: "Mingau",
    species: "cat",
    age: "3 meses",
    breed: "Felino Doméstico",
    location: "São Paulo, SP",
    rescuerName: "Coletivo Mia Amigo",
    rescuerType: "ong",
    category: "treatment",
    categoryLabel: "Tratamento Clínico",
    imageUrl: "/images/animals/gato-mingau.jpg",
    summary:
      "Filhote resgatado com rinotraqueíte severa e desnutrição. Necessita de internação, colírios especiais e alimentação hipercalórica.",
    story:
      "Mingau foi encontrado miando sozinho debaixo de chuva em um terreno baldio. Com os olhinhos comprometidos pela infecção e pesando menos de 600 gramas, ele luta diariamente pela vida com auxílio da equipe de veterinários voluntários.",
    targetAmount: 1850,
    raisedAmount: 1420,
    supportersCount: 31,
    urgency: "high",
    createdAt: "2026-10-12",
    updates: [
      {
        date: "15/10/2026",
        description:
          "Mingau começou a comer pastinha sozinho e um dos olhos já desinchou com o antibiótico.",
      },
    ],
  },
  {
    id: "camp-03",
    title: "Tratamento contínuo e ração especial para o vovô Thor",
    animalName: "Thor",
    species: "dog",
    age: "9 anos",
    breed: "Mestiço de Labrador / SRD",
    location: "Belo Horizonte, MG",
    rescuerName: "Abrigo Esperança Peluda",
    rescuerType: "ong",
    category: "treatment",
    categoryLabel: "Cuidados Especiais",
    imageUrl: "/images/animals/cao-thor.jpg",
    summary:
      "Thor é um cão idoso em tratamento de artrose e leishmaniose estável. Precisamos garantir 6 meses de medicação contínua e ração sênior.",
    story:
      "Abandonado por ser velho e doente, Thor encontrou carinho e acolhimento. Seus exames estão estabilizados, mas os medicamentos de suporte articular e imunitário são de alto custo para a ONG.",
    targetAmount: 2600,
    raisedAmount: 1100,
    supportersCount: 19,
    urgency: "medium",
    createdAt: "2026-10-08",
    updates: [
      {
        date: "12/10/2026",
        description:
          "Thor completou mais uma sessão de acupuntura e está caminhando com menos dor.",
      },
    ],
  },
  {
    id: "camp-04",
    title: "Castração, vacinação e ração para a mãezinha Luna e 4 filhotes",
    animalName: "Luna & Filhotes",
    species: "cat",
    age: "1 ano e meio",
    breed: "Sem Raça Definida",
    location: "Florianópolis, SC",
    rescuerName: "Gatinhos da Ilha",
    rescuerType: "independent",
    category: "food",
    categoryLabel: "Ração & Vacinas",
    imageUrl: "/images/animals/gata-luna.jpg",
    summary:
      "Luna deu à luz em uma garagem abandonada. A família foi resgatada e agora precisa de vacinação completa, castração da mãe e ração filhote.",
    story:
      "A protetora acolheu temporariamente a família toda em um quarto adaptado. Os filhotes já completaram 45 dias e agora entram na fase de vermifugação, desmame e primeira dose da vacina polivalente antes da futura adoção responsável.",
    targetAmount: 1500,
    raisedAmount: 980,
    supportersCount: 24,
    urgency: "medium",
    createdAt: "2026-10-09",
    updates: [
      {
        date: "13/10/2026",
        description:
          "Primeira dose de vermífugo administrada com sucesso em todos os 4 filhotinhos.",
      },
    ],
  },
  {
    id: "camp-05",
    title: "Recuperação de trauma e fisioterapia para o Caramelo",
    animalName: "Caramelo",
    species: "dog",
    age: "Aprox. 3 anos",
    breed: "Vira-lata Caramelo",
    location: "Salvador, BA",
    rescuerName: "Anjos de Quatro Patas",
    rescuerType: "independent",
    category: "treatment",
    categoryLabel: "Fisioterapia",
    imageUrl: "/images/animals/cao-caramelo.jpg",
    summary:
      "Resgatado em área de risco após fortes chuvas, Caramelo teve fratura na bacia e precisa de 12 sessões de reabilitação motora.",
    story:
      "Caramelo é o típico vira-lata carismático que conquista todo mundo com seu olhar amoroso. Ele já passou pela fase mais crítica da internação e agora os exercícios fisioterápicos garantirão que volte a andar sem mancar.",
    targetAmount: 2100,
    raisedAmount: 1750,
    supportersCount: 37,
    urgency: "medium",
    createdAt: "2026-10-11",
    updates: [
      {
        date: "14/10/2026",
        description:
          "Segunda sessão de hidroesteira realizada com grande evolução motora.",
      },
    ],
  },
  {
    id: "camp-06",
    title: "Tratamento de esporotricose e medicação diária para o Chico",
    animalName: "Chico",
    species: "cat",
    age: "4 anos",
    breed: "Sem Raça Definida (SRD)",
    location: "Rio de Janeiro, RJ",
    rescuerName: "Gatos do Bem RJ",
    rescuerType: "ong",
    category: "emergency",
    categoryLabel: "Tratamento Contínuo",
    imageUrl: "/images/animals/gato-chico.jpg",
    summary:
      "Chico foi resgatado com lesões severas de esporotricose. O antifúngico diário e os curativos custam caro e o tratamento dura no mínimo 4 meses.",
    story:
      "A esporotricose tem cura quando tratada com rigor e carinho. O Chico está isolado em um gatil seguro, recebendo itraconazol e suporte hepático para vencer a doença e poder ganhar uma família amorosa.",
    targetAmount: 1950,
    raisedAmount: 640,
    supportersCount: 15,
    urgency: "high",
    createdAt: "2026-10-13",
    updates: [
      {
        date: "15/10/2026",
        description:
          "As feridas no focinho já começaram a fechar e o apetite está 100% recuperado.",
      },
    ],
  },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    question: "Como funciona a doação e para onde vai o recurso?",
    answer:
      "Cada campanha na plataforma é aberta diretamente para suprir uma necessidade específica e auditada (como uma cirurgia, tratamento ou compra de ração). O valor doado é direcionado para a conta do protetor ou da clínica veterinária parceira, acompanhado de exigência de prestação de contas com notas fiscais.",
    category: "doador",
  },
  {
    question: "Posso doar qualquer valor ou há um mínimo estipulado?",
    answer:
      "Qualquer quantia faz uma diferença imensa! Quando o sistema de pagamentos estiver ativado, será possível contribuir com valores a partir de R$ 5,00 via PIX instantâneo e seguro.",
    category: "doador",
  },
  {
    question: "Como os protetores e ONGs prestam contas?",
    answer:
      "Após a utilização dos valores, o responsável pela campanha deve anexar fotografias do animal em recuperação, relatórios médicos veterinários e os comprovantes de pagamento/notas fiscais diretamente no painel da campanha para consulta pública.",
    category: "plataforma",
  },
  {
    question: "Como sou avisado sobre a recuperação do animal que ajudei?",
    answer:
      "Ao apoiar uma campanha, você pode optar por receber atualizações por e-mail ou WhatsApp sempre que o protetor publicar um novo diário de recuperação ou foto do animal.",
    category: "doador",
  },
  {
    question: "Sou protetor independente ou represento uma ONG. Como posso me cadastrar?",
    answer:
      "Basta clicar no botão 'Cadastrar Protetor / ONG' e preencher o formulário de manifestação de interesse. Nossa equipe analisa a documentação e histórico de resgates para manter uma rede segura e de confiança.",
    category: "protetor",
  },
  {
    question: "A plataforma cobra comissão sobre o dinheiro doado?",
    answer:
      "Nosso compromisso ético é priorizar ao máximo a vida animal. Na versão definitiva, 100% da doação líquida vai para a causa, com repasse transparente das taxas mínimas estritas cobradas pelo gateway de pagamentos.",
    category: "plataforma",
  },
  {
    question: "Por que todos os dados atuais estão indicados como fictícios?",
    answer:
      "Estamos na fase de validação de interface e arquitetura de software da plataforma Patas do Bem. Por responsabilidade legal e ética, nenhum dado real de animal, protetor ou chave financeira é publicado antes da homologação completa dos termos e dos sistemas de segurança.",
    category: "plataforma",
  },
];
