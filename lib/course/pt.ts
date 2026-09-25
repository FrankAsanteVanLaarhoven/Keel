import type { Pack } from "./types";

export const pt: Pack = {
  sections: {
    tools: {
      title: "A bancada",
      promise: "Saber para que serve cada ferramenta e em qual ambiente o trabalho vive de verdade.",
      objectives: [
        "Nomear o editor, o navegador, o terminal e o histórico.",
        "Distinguir um notebook pessoal de um ambiente compartilhado.",
        "Fazer quatro perguntas simples antes de confiar numa ferramenta nova.",
      ],
      start: [
        "Uma ferramenta ajuda você a fazer uma mudança e depois ver o que aconteceu. O editor é onde o trabalho é escrito. O navegador é onde uma pessoa experimenta. O terminal é uma janela simples em que você pede à máquina que rode uma verificação. Cada janela tem um trabalho. Quando esses trabalhos estão separados, o trabalho se compartilha com mais clareza.",
        "Um ambiente é o lugar onde essas ferramentas rodam. O seu notebook é um ambiente. A recepção de uma clínica é outro. Uma máquina compartilhada num centro de dados é um terceiro. O trabalho pode mudar de lugar. A promessa para a pessoa que usa o sistema, não.",
      ],
      how: [
        "O histórico de versões lembra cada mudança salva, quem a fez e uma frase sobre o porquê. Duas pessoas podem trabalhar sem apagar uma à outra. Uma lista de pacotes anota as peças de fora exatas que você usou, para a montagem de amanhã bater com a de hoje. Um registro ou um depurador deixa você acompanhar uma ação em vez de adivinhar.",
        "Quando você encontra uma ferramenta nova, ignore a cor da janela e pergunte: duas pessoas conseguem usar sem gravar por cima uma da outra? Ela roda igual numa segunda máquina? Dá para desfazer? Uma falha aparece em palavras que uma pessoa consegue ler? Se a resposta for não, é um rascunho, não uma bancada.",
      ],
      expert: [
        "As equipes padronizam a bancada. Uma pessoa nova deve abrir o projeto e rodar as verificações na primeira manhã. Isso quer dizer que a preparação está escrita, que segredos não ficam guardados no projeto e que as verificações não dependem de uma tela particular.",
        "A falha cara é um sistema que só roda na máquina de quem foi embora. A moda dos editores muda. O trabalho, não: repetir o trabalho, recuperar o de ontem e explicar uma falha.",
      ],
      example: [
        "Harbor Market guarda o painel público e o livro das barracas num projeto compartilhado. O feirante nunca abre o editor. A equipe abre. O projeto roda num ambiente administrado, não num notebook que vai para casa à noite.",
        "Se esse notebook fosse a única cópia, um copo derramado fecharia os registros do mercado. O histórico, não a marca do editor, é o que deixa a terça-feira recuperável.",
      ],
      narration:
        "Uma ferramenta ajuda você a fazer uma mudança e ver o que aconteceu. O editor é onde o trabalho é escrito. O navegador é onde uma pessoa experimenta. O terminal é onde você pede à máquina que rode uma verificação. O histórico lembra cada mudança salva, então duas pessoas não conseguem se apagar. Harbor Market guarda esse histórico numa bancada compartilhada, não num notebook que vai para casa à noite.",
      checkPrompt: "Qual recurso deixa duas pessoas mudar o trabalho sem apagar uma à outra em silêncio?",
      checkOptions: ["Um tema de cores mais vivo", "Um histórico de cada mudança salva", "Um monitor maior", "Um mouse mais rápido"],
      benchTitle: "Colocar a manhã em ordem",
      benchPrompt: "Uma pessoa nova da equipe vai mudar o horário de funcionamento. Coloque os passos na ordem em que você confiaria.",
      benchItems: [
        "Dizer o trabalho numa frase.",
        "Abrir a bancada compartilhada, não uma cópia particular.",
        "Fazer uma mudança pequena.",
        "Salvar no histórico, com uma frase sobre o porquê.",
        "Mostrar a um colega antes de seguir adiante.",
      ],
      benchSlots: [],
      caseOrg: "Clínica Riverside",
      caseFile: "RC-01",
      caseTitle: "A recepção e o único notebook",
      caseSituation: [
        "A Clínica Riverside deixa os pacientes marcarem um atendimento de enfermagem por telefone ou na recepção. A mudança do agendamento vive num notebook que só a recepcionista sabe abrir. Quando essa pessoa está de folga, a recepção anota os horários no papel e digita depois.",
        "A clínica não é uma empresa de software. Quem trabalha na recepção não é desenvolvedor. Mesmo assim, precisa de uma bancada que outra pessoa treinada consiga abrir numa segunda-feira.",
      ],
      caseTask: "Escolha onde esse trabalho deve viver e o que precisa acontecer quando uma verificação falha.",
      caseSteps: [
        "Leia os dois ambientes: um notebook particular, ou uma bancada compartilhada da clínica, com histórico.",
        "Imagine uma segunda-feira em que a recepcionista não está e um paciente precisa mudar um horário.",
        "Responda as três decisões em palavras do dia a dia.",
        "Na nota, diga o que a pessoa da recepção faz primeiro e o que nunca faz com a única cópia.",
      ],
      decisions: [
        {
          prompt: "Onde o trabalho de agendamento deve viver?",
          options: ["No notebook pessoal da recepcionista", "Numa bancada compartilhada da clínica, que qualquer pessoa treinada consegue abrir", "Só no papel"],
        },
        {
          prompt: "O que lembra as mudanças?",
          options: ["Quem estava na recepção naquele dia", "Um histórico de cada mudança salva", "Nada, se as pessoas tiverem cuidado"],
        },
        {
          prompt: "Uma verificação falha antes de a mudança chegar à recepção. O que você faz?",
          options: ["Coloca na recepção mesmo assim", "Para, e não coloca na recepção", "Esconde a falha para a manhã continuar calma"],
        },
      ],
      noteLabel: "Sua nota para a gerência da clínica",
      noteHint: "Escreva o que a recepção deve abrir e o que nunca pode ser a única cópia.",
    },
    platforms: {
      title: "Plataformas",
      promise: "Ver o que muda entre um celular, uma mesa e um quiosque, e o que precisa continuar igual.",
      objectives: [
        "Dizer o que é uma plataforma numa frase.",
        "Separar a tela do registro.",
        "Comparar duas plataformas sem se deixar enganar pela moda.",
      ],
      start: [
        "Uma plataforma é o lugar onde a pessoa encontra o sistema: um celular, um computador de mesa, um quiosque, um tablet num corredor. A tela muda. O trabalho, muitas vezes, não. Um passageiro quer saber se o ônibus está chegando. Um fiscal quer saber se um passe vale. O balcão da noite quer a mesma verdade, numa tela maior, com teclado.",
        "Quem não é desenvolvedor ainda precisa terminar uma tarefa. Se a plataforma dificulta a tarefa, a plataforma está errada, mesmo quando parece nova.",
      ],
      how: [
        "O que costuma continuar igual: quem é a pessoa, o que ela pode fazer, o registro do que aconteceu e a promessa de que o registro é verdadeiro. O que costuma mudar: o tamanho da tela, se existe teclado, se a rede cai e a rapidez com que a pessoa precisa agir.",
        "Uma comparação útil é uma tabela com três linhas. O trabalho. O que precisa ser verdade. O que a plataforma facilita ou dificulta. Se duas plataformas não conseguem compartilhar um registro, você não tem duas portas. Tem dois sistemas que vão discordar.",
      ],
      expert: [
        "As equipes se metem em apuros quando cada plataforma cria a própria cópia das regras. O celular diz que o passe vale. O aparelho do fiscal diz que não. O balcão da noite não consegue saber em qual acreditar. O conserto é um registro só e um lugar só onde a decisão é tomada, com portas finas na frente.",
        "Ficar sem rede importa. Um quiosque numa estação pode perder a rede. Decida, antes de construir, quais ações precisam esperar e quais podem ser guardadas e enviadas depois. Escreva isso. Faz parte da escolha da plataforma, não é uma surpresa.",
      ],
      example: [
        "Harbor Market tem três portas para um só livro das barracas. Quem compra usa uma página no celular para ver o que está aberto. O feirante usa uma página simples no celular para se marcar aberto ou fechado. O escritório usa uma tela de mesa, com teclado, para o dia inteiro.",
        "As páginas parecem diferentes. O registro é a mesma barraca, o mesmo horário e a mesma pessoa autorizada a mudar. Uma segunda planilha particular faria o painel mentir.",
      ],
      narration:
        "Uma plataforma é onde a pessoa encontra o sistema. A tela pode mudar. O registro, não. No Harbor Market, quem compra, o feirante e o escritório ganham portas diferentes. Todos leem e escrevem um livro das barracas. Se cada porta guardasse a própria cópia, o painel mentiria.",
      checkPrompt: "O que deve continuar igual quando um trabalho sai do celular e vai para a mesa?",
      checkOptions: ["A cor dos botões", "O registro e as regras", "As animações", "A frase de efeito"],
      benchTitle: "Três trabalhos, três portas",
      benchPrompt: "A City Hopper opera um passe de transporte. Combine cada trabalho com a porta que serve. O registro do passe continua sendo um só.",
      benchItems: ["Um celular na mão do passageiro", "Um aparelho pequeno de mão para o fiscal no veículo", "Uma tela de mesa para a equipe de operação da noite"],
      benchSlots: ["O passageiro, conferindo um passe", "O fiscal, num ônibus em movimento", "A equipe da noite, com teclado e um turno longo"],
      caseOrg: "City Hopper",
      caseFile: "CH-02",
      caseTitle: "Um passe, três portas",
      caseSituation: [
        "A City Hopper quer que passageiros, fiscais e o balcão da noite confiem no mesmo passe. Um fornecedor ofereceu três aplicativos separados, cada um com o próprio banco de dados, porque assim a demonstração fica mais rápida.",
        "Quem usa esses aplicativos não é desenvolvedor. O passageiro está com pressa. O fiscal está em pé no corredor. O balcão da noite tem tempo, teclado e o trabalho de corrigir erros.",
      ],
      caseTask: "Escolha as portas e recuse um desenho que deixe os três aplicativos discordarem.",
      caseSteps: [
        "Liste os três trabalhos e onde cada pessoa está.",
        "Marque o que precisa ser idêntico: o passe, se ele vale e quem pode mudá-lo.",
        "Responda as decisões.",
        "Na nota, diga qual porta é fina e por que uma segunda cópia do passe seria uma falha.",
      ],
      decisions: [
        {
          prompt: "Onde o passageiro deve encontrar o passe?",
          options: ["Só num cartão de papel", "Numa página de celular", "A pessoa precisa ir ao escritório"],
        },
        {
          prompt: "O que continua igual de uma porta para outra?",
          options: ["A cor de cada aplicativo", "O registro do passe e as regras", "A frase de efeito na tela de abertura"],
        },
        {
          prompt: "O fornecedor oferece três aplicativos com três bancos de dados. O que você faz?",
          options: ["Aceita, para a demonstração ser rápida", "Insiste num registro só por trás das portas", "Não constrói nada até o ano que vem"],
        },
      ],
      noteLabel: "Sua nota para a liderança do transporte",
      noteHint: "Nomeie as três portas e o único registro que elas precisam compartilhar.",
    },
    design: {
      title: "Desenho para as pessoas",
      promise: "Começar pela tarefa que uma pessoa cansada tenta terminar, não pela tela que você quer desenhar.",
      objectives: [
        "Descrever uma tarefa antes de descrever uma tela.",
        "Escrever um erro que diga à pessoa o que fazer em seguida.",
        "Perceber quando um desenho só funciona para quem está descansado e é especialista.",
      ],
      start: [
        "Desenho, aqui, quer dizer a forma da tarefa, não uma camada de tinta. Uma pessoa chega com um trabalho: renovar um benefício, marcar um atendimento de enfermagem, ver se uma barraca está aberta. Pode ser nova no assunto, estar cansada, com pressa ou usando só o teclado. O sistema deve ajudar essa pessoa a terminar.",
        "Se você começa pelas cores, pelos logotipos ou pela forma do banco de dados, vai construir algo que faz sentido para quem fez e não para a pessoa. Pergunte o que ela tenta fazer, com as palavras dela, antes de perguntar qual é a cara da tela.",
      ],
      how: [
        "Escreva a tarefa em passos que uma pessoa consegue dizer em voz alta. Cada passo pede uma coisa só. Cada passo tem um jeito de voltar. Uma tela vazia diz o que fazer, não só que não há nada ali. Um erro diz o que deu errado e qual é a próxima ação, em palavras simples, sem um número de código como única pista.",
        "Depois, faça os passos como se fosse três pessoas: alguém novo, alguém cansado no fim do turno e alguém que não usa mouse. Se uma delas empaca, o desenho não está pronto. Leia as palavras em voz alta. Se você não diria isso a uma pessoa no balcão, não coloque na tela.",
      ],
      expert: [
        "Requisitos são as promessas: o que precisa ser verdade quando a pessoa termina, o que nunca pode acontecer e o que pode esperar. Uma página para o público e a página da equipe, por trás, podem parecer diferentes e ainda servir a uma promessa só. A equipe precisa de rapidez e de informação completa. A página pública precisa de calma e de um caminho curto.",
        "Um bom desenho deixa rastro. Quando uma tarefa falha no meio do caminho, a pessoa não deve perder o trabalho, e um colega deve conseguir ver onde parou. Isso é desenho para a operação, não decoração.",
      ],
      example: [
        "A pergunta pública do Harbor Market é pequena: o que está aberto hoje à noite? A primeira tela responde isso, com o nome da barraca e o horário. Não começa com uma conta, um mapa do banco de dados nem doze filtros.",
        "O feirante que se marca fechado recebe uma pergunta e uma linha clara de que foi salvo. Se a rede cai, a página diz que a mudança ainda não foi salva e o que fazer. Não mostra um código de erro sem explicação.",
      ],
      narration:
        "Comece pela tarefa, não pela tela. Pergunte o que a pessoa tenta terminar, com as palavras dela. Um passo deve pedir uma coisa só. Um erro deve dizer o que fazer em seguida. No Harbor Market, a pergunta pública é simples: o que está aberto hoje à noite? A primeira tela responde isso, antes de pedir qualquer outra coisa.",
      checkPrompt: "O que você desenha primeiro?",
      checkOptions: ["A paleta de cores", "A tarefa que a pessoa tenta terminar", "O logotipo", "A forma do banco de dados"],
      benchTitle: "Um formulário para quem está cansado",
      benchPrompt: "A renovação dos Benefícios Cívicos hoje pede doze perguntas numa tela só. Escolha a versão que uma pessoa cansada consegue terminar.",
      benchItems: [
        "Manter os doze campos numa tela só, para parecer completo.",
        "Perguntar uma coisa de cada vez, com um jeito de voltar, e salvar no caminho.",
        "Trocar as palavras por figuras e tirar as perguntas.",
      ],
      benchSlots: [],
      caseOrg: "Benefícios Cívicos",
      caseFile: "CB-03",
      caseTitle: "A renovação de doze campos",
      caseSituation: [
        "As pessoas renovam um benefício uma vez por ano. O formulário atual tem doze campos. Dois deles são códigos que o escritório entende e o morador não. Se a pessoa erra um, a página diz 'Erro 422' e apaga o formulário.",
        "Os moradores não são desenvolvedores. Muitos estão no celular. Alguns usam só o teclado. O escritório quer menos renovações pela metade, não um logotipo mais bonito.",
      ],
      caseTask: "Reescreva o caminho para a pessoa conseguir terminar, inclusive quando erra.",
      caseSteps: [
        "Diga a tarefa do morador numa frase, com as palavras dele.",
        "Divida o caminho em passos que pedem uma coisa só.",
        "Decida como um erro fala e como alguém sem mouse ainda termina.",
        "Na nota, escreva os três primeiros passos como o morador veria.",
      ],
      decisions: [
        {
          prompt: "O que você resolve antes da tela?",
          options: ["A cor do cabeçalho", "A tarefa nas palavras do morador", "O conjunto do logotipo"],
        },
        {
          prompt: "A renovação falha numa verificação. O que a página diz?",
          options: ["Erro 422, e o formulário é apagado", "O que deu errado e o que fazer em seguida, com as respostas guardadas", "Uma página em branco"],
        },
        {
          prompt: "Quem precisa conseguir terminar?",
          options: ["Só quem usa mouse", "Uma pessoa só com teclado, inclusive alguém novo ou cansado", "Só quem imprime o formulário"],
        },
      ],
      noteLabel: "Os três primeiros passos, nas palavras do morador",
      noteHint: "Escreva os passos que a pessoa veria de verdade, inclusive o que um erro diz.",
    },
    tiers: {
      title: "Três salas",
      promise: "Separar o que a pessoa vê, o que decide e o que lembra.",
      objectives: [
        "Nomear o navegador, a aplicação e o banco de dados em palavras simples.",
        "Seguir um pedido desde o toque até um registro salvo.",
        "Dizer o que 'tem que continuar funcionando numa terça à noite' exige de cada sala.",
      ],
      start: [
        "A maioria dos sistemas que ficam de frente para uma pessoa, e também guardam registros, se organiza em salas. A primeira sala é o que a pessoa vê, muitas vezes um navegador. A segunda sala decide: confere quem a pessoa é e aplica as regras. A terceira sala lembra: o banco de dados e, às vezes, um cache de respostas que dá para repetir.",
        "Dá para desenhar isso para uma clínica, um mercado ou um jogo. Os nomes continuam úteis. Misturar as salas é o jeito de o sistema virar algo que só quem criou consegue guardar na cabeça.",
      ],
      how: [
        "Um pedido viaja. A pessoa toca em 'fechado hoje à noite'. O navegador manda esse desejo para a aplicação. A aplicação confere se essa pessoa pode mudar essa barraca e então pede ao banco de dados que lembre. O banco de dados grava a linha. A aplicação avisa o navegador, que mostra um 'salvo' tranquilo.",
        "Operacional quer dizer que isso continua acontecendo numa terça à noite, quando quem criou está dormindo. Cada sala precisa de um trabalho que dê para vigiar. O navegador não deve ser o único lugar onde uma regra mora, porque uma pessoa pode mudar o próprio navegador. O banco de dados não deve inventar regra. Deve guardar, em segurança, o que a aplicação pediu.",
      ],
      expert: [
        "Cache e fila são salas extras que você acrescenta quando sabe o porquê. Um cache lembra uma resposta que pode estar alguns segundos atrasada, como uma lista pública de barracas abertas. Ele não pode ser a única memória de um pagamento. Uma fila segura um trabalho que pode esperar um instante, para um pico não derrubar a sala que decide.",
        "Desenhe as salas antes de dar nome aos produtos. Produtos mudam. A pergunta, não: onde essa decisão é tomada, onde ela fica lembrada e o que acontece quando uma sala cai? Se você não consegue apontar a sala, não consegue operar o sistema.",
      ],
      example: [
        "No Harbor Market, o painel público é a sala do navegador. A sala da aplicação decide se este feirante pode editar esta barraca. A sala do banco de dados lembra o horário. Um cache pode guardar a lista pública por alguns segundos. Ele não guarda a única cópia de uma mudança.",
        "Se a aplicação está fora do ar, o painel deve dizer isso, não inventar horários. Se o banco de dados está fora do ar, a aplicação deve recusar a gravação e dizer que não foi salva. Silêncio pareceria sucesso.",
      ],
      narration:
        "Imagine três salas. O navegador é o que a pessoa vê. A aplicação decide, inclusive quem pode agir. O banco de dados lembra. Um toque viaja da primeira sala até a segunda, e depois até a terceira. No Harbor Market, o painel público não pode inventar horários se a sala que decide está fora do ar. Uma mudança salva tem que chegar à sala que lembra.",
      checkPrompt: "Onde deve viver a decisão 'esta pessoa pode mudar esta barraca?'",
      checkOptions: ["Só no navegador", "Na aplicação, onde as regras rodam", "Só no banco de dados", "Num cartaz de papel"],
      benchTitle: "Etiquetar as salas",
      benchPrompt: "Combine cada frase com a sala que deve ser dona dela.",
      benchItems: ["O navegador, o que a pessoa vê", "A aplicação, que aplica as regras", "O banco de dados, que lembra"],
      benchSlots: ["Mostrar a lista de barracas abertas", "Decidir se esta pessoa pode editar esta barraca", "Lembrar o horário depois que a pessoa foi embora"],
      caseOrg: "Harbor Market",
      caseFile: "HM-04",
      caseTitle: "O livro das barracas e o painel público",
      caseSituation: [
        "Harbor Market quer um painel público de quem está aberto e um jeito de os feirantes atualizarem o próprio horário pelo celular. O escritório do mercado é pequeno. Ninguém ali escreve software. Mesmo assim, o painel precisa ser verdadeiro num sábado à noite.",
        "Um amigo do mercado se oferece para 'colocar tudo na página', regras incluídas, porque assim são menos peças para manter no ar.",
      ],
      caseTask: "Nomeie as três salas e recuse um desenho que esconda as regras só no navegador.",
      caseSteps: [
        "Desenhe três caixas: o que as pessoas veem, o que decide, o que lembra.",
        "Coloque o painel público, a regra de 'pode editar' e os horários nessas caixas.",
        "Diga o que o painel deve fazer se a sala que decide está fora do ar.",
        "Na nota, explique o caminho de uma mudança, do polegar no celular até uma linha que ainda está lá de manhã.",
      ],
      decisions: [
        {
          prompt: "Onde vive 'este feirante pode editar esta barraca?'",
          options: ["Só na página do celular", "Na aplicação, junto com as outras regras", "Num cartaz no escritório"],
        },
        {
          prompt: "Onde os horários ficam lembrados?",
          options: ["Só no navegador, até ele ser fechado", "Na aplicação, na memória, até reiniciar", "No banco de dados"],
        },
        {
          prompt: "O que o painel público faz enquanto a sala que decide está fora do ar?",
          options: ["Diz que o painel ao vivo não está disponível", "Inventa horários para a página não ficar vazia", "Pede a quem compra que edite as barracas"],
        },
      ],
      noteLabel: "O caminho de uma mudança",
      noteHint: "Siga um feirante que fecha para a noite, do celular até o registro que ainda está lá de manhã.",
    },
    integration: {
      title: "A lista de verificação que roda",
      promise: "Deixar uma máquina repetir as verificações toda vez e parar quando elas falham.",
      objectives: [
        "Explicar o que a integração contínua faz, com palavras que um colega possa reutilizar.",
        "Nomear o que um pipeline verifica antes de as pessoas poderem compartilhar uma mudança.",
        "Dizer o que um resultado vermelho significa numa noite que importa.",
      ],
      start: [
        "Integração contínua quer dizer que a equipe junta as mudanças com frequência e que uma lista de verificação roda sozinha a cada vez. A lista repete as mesmas verificações toda vez, para que uma noite cheia e uma manhã quieta deem o mesmo resultado. Ela monta o trabalho, roda os testes e, às vezes, procura segredos que não deveriam estar nos arquivos. As pessoas ainda leem o resultado. A máquina faz a repetição.",
        "Sem isso, a primeira vez em que você descobre uma mudança quebrada é na frente de uma pessoa que precisava do sistema. Com isso, você descobre a quebra enquanto a mudança ainda é pequena.",
      ],
      how: [
        "Um pipeline é essa lista escrita para uma máquina conseguir rodar. Uma ordem típica: alguém faz uma mudança, a lista roda, uma segunda pessoa olha, e só então a mudança entra na linha compartilhada. Se a lista falha, a mudança não entra. A tela fica vermelha. Vermelho quer dizer ainda não: a mudança fica fora da linha compartilhada até a lista passar.",
        "O que entra na lista depende da promessa. Um portal de resultados se importa que as notas somem certo e que um estudante não veja as notas de outro. Um mercado se importa que um estranho não consiga editar uma barraca. Escreva as promessas como verificações. Uma lista que só confere a cor de um botão é teatro.",
      ],
      expert: [
        "O pipeline deve ser o mesmo na manhã de quem desenvolve e na noite anterior a um dia de público. Se as pessoas podem pular quando estão com pressa, é na pressa que ele faz falta. Proteja o pulo. Faça com que seja raro, tenha nome e fique escrito.",
        "Os registros da lista não são um diário para segredos. Senhas, chaves e registros pessoais não pertencem à saída. Uma montagem verde que imprimiu um segredo é uma falha, mesmo estando verde.",
      ],
      example: [
        "A lista do Harbor Market roda quando alguém da equipe oferece uma mudança. Ela confere se o projeto ainda monta, se um estranho não consegue editar uma barraca e se o painel público ainda responde 'o que está aberto?'. Depois, uma segunda pessoa olha.",
        "Na manhã de um festival, uma lista vermelha segura a mudança. O mercado abre na versão de ontem, já conhecida como boa. Esse é o sentido da máquina: ela topa ser impopular.",
      ],
      narration:
        "Integração contínua quer dizer que uma lista de verificação roda toda vez que o trabalho muda. A máquina monta, verifica e para se algo com que a promessa se importa falhou. Vermelho quer dizer ainda não. No Harbor Market, uma lista vermelha na manhã de um festival mantém a versão de ontem, que funcionava, na frente de quem compra.",
      checkPrompt: "O resultado de uma lista está vermelho. O que isso quer dizer?",
      checkOptions: [
        "Publica assim mesmo. A cor é só um enfeite de aviso",
        "Não continue. Algo com que a lista se importa falhou",
        "Ignore se a mudança for pequena",
        "Comemore. Vermelho quer dizer pronto",
      ],
      benchTitle: "Ordenar o pipeline",
      benchPrompt: "Coloque estes passos na ordem que mantém uma mudança ruim fora da linha compartilhada.",
      benchItems: [
        "Alguém faz uma mudança.",
        "A lista de verificação roda sozinha.",
        "Uma segunda pessoa olha.",
        "A mudança entra na linha compartilhada.",
      ],
      benchSlots: [],
      caseOrg: "Escola do Norte",
      caseFile: "NS-05",
      caseTitle: "A noite anterior ao dia dos resultados",
      caseSituation: [
        "A Escola do Norte publica os resultados de manhã. O portal mostra a cada estudante as próprias notas. Uma mudança bem-intencionada no arranjo da página é oferecida às 21:00 da noite anterior. Quem fez tem certeza de que é minúscula.",
        "Pais e estudantes não são desenvolvedores. Um total errado, ou um estudante vendo as notas de outro, não é um detalhe pequeno de aparência.",
      ],
      caseTask: "Desenhe a lista dessa noite, inclusive quem pode deixar uma mudança passar.",
      caseSteps: [
        "Escreva as promessas que a lista precisa proteger: os totais e a privacidade.",
        "Coloque os passos em ordem, incluindo uma segunda pessoa.",
        "Decida o que acontece quando a lista está vermelha às 21:00.",
        "Na nota, diga o que a manhã usa se a mudança não estiver pronta.",
      ],
      decisions: [
        {
          prompt: "A lista está vermelha às 21:00. O que acontece com a mudança?",
          options: ["Ela sai, porque a manhã dos resultados não pode esperar", "Ela fica bloqueada. A manhã usa a última versão que passou", "As verificações são puladas, só desta vez"],
        },
        {
          prompt: "Quem pode deixar uma mudança entrar na linha compartilhada?",
          options: ["Só quem fez a mudança", "Quem fez e uma segunda pessoa, depois que a lista fica verde", "Ninguém. As mudanças são copiadas à mão"],
        },
        {
          prompt: "Uma verificação imprime uma senha de banco de dados no registro. O que é isso?",
          options: ["Útil, para a próxima pessoa conseguir entrar", "Uma falha. Segredos não pertencem ao registro", "Algo para mandar por e-mail a toda a equipe"],
        },
      ],
      noteLabel: "O que a manhã dos resultados usa",
      noteHint: "Diga o que roda de manhã se a mudança da noite está vermelha e quais promessas a lista protege.",
    },
    deployment: {
      title: "Lançar com cuidado",
      promise: "Colocar uma mudança na frente das pessoas num passo pequeno, com um caminho de volta.",
      objectives: [
        "Distinguir um ensaio do sistema real.",
        "Planejar um lançamento que dê para desfazer.",
        "Dizer quem precisa ouvir o que mudou.",
      ],
      start: [
        "Implantação quer dizer levar uma mudança da bancada para um lugar que pessoas de verdade usam. Em geral há um lugar privado para experimentar, um lugar de ensaio parecido com o real e o sistema real. O sistema real é aquele em que uma pessoa confia numa terça à noite.",
        "Um lançamento é o momento em que a mudança atravessa para esse lugar real. Lançamentos grandes parecem corajosos e falham fazendo barulho. Lançamentos pequenos, com caminho de volta, parecem quietos e são o jeito de equipes cuidadosas trabalharem.",
      ],
      how: [
        "Um caminho de volta quer dizer que você consegue voltar à versão anterior sem reconstruí-la de memória. Você ensaiou. Sabe quanto tempo leva. Sabe o que acontece com o trabalho que as pessoas fizeram na versão nova, se houve algum.",
        "Avise as pessoas que vão encontrar a mudança. A enfermagem, a equipe do balcão, os feirantes. Não precisam de um diário técnico. Precisam disto: o que mudou, o que fazer se parecer errado e quem chamar. Um lançamento em silêncio é o jeito de um plantão da noite perder a confiança.",
      ],
      expert: [
        "Chaves de função deixam você ligar uma mudança primeiro para poucas pessoas. São úteis e também são uma sala que você precisa arrumar. Uma chave deixada ligada por um ano é um segundo sistema escondido dentro do primeiro. Nomeie um responsável e uma data para tirá-la.",
        "Nunca lance só porque o calendário disse que era dia. Sexta à tarde, a noite antes dos resultados, a hora em que o mercado abre: é aí que um caminho de volta mais importa. Se você não consegue voltar atrás, não está pronto, por mais verde que a lista tenha ficado.",
      ],
      example: [
        "Harbor Market liga primeiro, numa fileira de barracas, uma linha nova de 'fecha em breve'. O escritório observa o painel por uma hora. O caminho de volta é um interruptor para o painel de ontem, já ensaiado.",
        "Os feirantes ficam sabendo pela nota da manhã: o que vão ver e que os horários não mudaram. O lançamento não é uma surpresa largada na hora de abrir.",
      ],
      narration:
        "Implantação é o momento em que uma mudança chega a pessoas que não a fizeram. Guarde um lugar privado, um lugar de ensaio e o sistema real. Lance num passo pequeno e mantenha um caminho de volta que você de fato ensaiou. Diga a quem está no turno o que mudou e quem chamar. Um lançamento em silêncio é o jeito de a confiança se perder.",
      checkPrompt: "O que você precisa ter antes de uma mudança chegar ao sistema real?",
      checkOptions: ["Uma sexta à tarde, para sobrar o fim de semana", "Um caminho de volta para a versão anterior", "A maior mudança possível, para fazer isso só uma vez", "Silêncio, para ninguém se preocupar"],
      benchTitle: "Escolher o lançamento",
      benchPrompt: "O Hospital Santa Brígida quer um jeito novo de a enfermagem trocar de plantão. Em qual lançamento você confia?",
      benchItems: [
        "Trocar a escala inteira na segunda-feira, no começo do plantão, sem caminho de volta.",
        "Ligar a troca nova numa ala só e manter um retorno ensaiado à escala antiga.",
        "Ligar para todo mundo à meia-noite e não contar a ninguém.",
      ],
      benchSlots: [],
      caseOrg: "Hospital Santa Brígida",
      caseFile: "SB-06",
      caseTitle: "A escala da ala",
      caseSituation: [
        "No Hospital Santa Brígida, a enfermagem troca plantões por uma escala. Um botão novo de troca passou nas verificações. A ala está cheia. Quem usa a escala está cansado e não é desenvolvedor.",
        "Se o botão novo deixa um plantão sem enfermagem, o caminho de volta importa mais do que o botão.",
      ],
      caseTask: "Planeje o lançamento: o tamanho, como você volta e quem você avisa.",
      caseSteps: [
        "Nomeie o sistema real e quem está na frente dele.",
        "Escolha um primeiro passo pequeno, não o hospital inteiro de uma vez.",
        "Escreva o caminho de volta numa frase que a coordenação da noite consiga seguir.",
        "Na nota, rascunhe a mensagem que a ala vai ler de verdade.",
      ],
      decisions: [
        {
          prompt: "Qual é o tamanho do primeiro lançamento?",
          options: ["Todas as alas, segunda de manhã", "Uma ala, com o resto sem mudança", "Um lançamento secreto, para não fazer barulho"],
        },
        {
          prompt: "Existe um caminho de volta?",
          options: ["Não. Voltar levaria uma semana de reconstrução", "Sim. Está ensaiado, e uma pessoa da noite consegue começar", "Vamos torcer para não precisar de um"],
        },
        {
          prompt: "Quem fica sabendo o que mudou?",
          options: ["Ninguém, para evitar perguntas", "A enfermagem e a coordenação, em palavras simples, com um nome para chamar", "Só um cartaz no estacionamento"],
        },
      ],
      noteLabel: "A nota que a ala vai ler",
      noteHint: "Diga o que mudou, o que fazer se parecer errado e quem chamar.",
    },
    maintain: {
      title: "A próxima pessoa",
      promise: "Deixar o sistema de um jeito que alguém que chega em seis meses consiga mudar uma coisa com segurança.",
      objectives: [
        "Explicar o que é fácil de manter como cuidado com a próxima pessoa.",
        "Separar uma mudança pequena do núcleo perigoso.",
        "Nomear um responsável pela parte que chama alguém de noite.",
      ],
      start: [
        "Fácil de manter quer dizer que uma pessoa que não construiu o sistema ainda consegue mudá-lo sem quebrar a promessa. Essa pessoa pode ser você, daqui a seis meses, depois de esquecer a parte esperta. Pode ser um colega novo. Pode ser um voluntário numa instituição beneficente.",
        "Se toda mudança exige quem criou no começo, o sistema já está falhando, mesmo enquanto parece bem hoje.",
      ],
      how: [
        "Os nomes devem dizer para que uma coisa serve. As peças devem ser pequenas o bastante para caber na cabeça. Um mapa, escrito, diz aonde uma mudança vai: a carta de agradecimento fica aqui, o pagamento fica ali, e os dois se encontram numa porta só. A próxima pessoa muda a carta sem abrir o pagamento.",
        "A responsabilidade faz parte do mapa. Quando o pagamento falha de noite, um papel com nome recebe a ligação, não 'quem estiver por perto'. O mapa inclui como rodar as verificações, onde está o histórico e o que nunca pode ser improvisado.",
      ],
      expert: [
        "Esperteza que só quem criou consegue ler é um custo, não um presente. Prefira uma estrutura sem graça, que uma pessoa nova consiga acompanhar. Comentários explicam o porquê, não o que a linha de baixo já diz. Chaves abandonadas, portas sem uso e cópias da mesma regra em três lugares são dívida de manutenção.",
        "Um sistema para quem não é desenvolvedor precisa de quem mantém e sabe recusar um emaranhado. 'Uma pessoa nova consegue mudar a carta com segurança?' é uma pergunta de lançamento, não um luxo.",
      ],
      example: [
        "Harbor Market escreve um mapa de uma página. O horário de funcionamento é uma peça. Quem pode editar uma barraca é outra. Pagamentos de luz e água, se entrarem depois, ficam separados das palavras públicas do painel.",
        "Uma pessoa nova na equipe de sábado consegue mudar um fechamento de feriado a partir do mapa, rodar a lista e perguntar ao responsável nomeado se a regra de quem pode editar entra no caso. Não fica caçando numa pilha só, sem separação.",
      ],
      narration:
        "Fácil de manter quer dizer que a próxima pessoa consegue mudar uma coisa com segurança. Essa pessoa pode ser você, daqui a seis meses. Deixe um mapa. Mantenha a carta de agradecimento separada do pagamento. Nomeie quem recebe a ligação de noite. No Harbor Market, uma pessoa nova na equipe de sábado consegue mudar um fechamento de feriado sem mexer na regra de quem pode editar uma barraca.",
      checkPrompt: "Qual frase descreve melhor um sistema fácil de manter?",
      checkOptions: [
        "Ele é esperto, e só quem criou consegue mudar",
        "Uma pessoa nova encontra a peça e muda sem quebrar o resto",
        "Ele sempre usa a moda mais nova",
        "É o arquivo mais longo, então tudo fica num lugar só",
      ],
      benchTitle: "A carta de agradecimento",
      benchPrompt: "Kindling é uma instituição beneficente pequena. A página de doação e a carta de agradecimento vivem num emaranhado só. Um voluntário precisa mudar a carta. O que você escolhe?",
      benchItems: [
        "Deixar a carta dentro do código do pagamento, para nada sair de sincronia.",
        "Separar a carta do pagamento, com uma porta entre os dois, e um mapa curto.",
        "Reescrever o site inteiro da instituição antes de a carta poder mudar.",
      ],
      benchSlots: [],
      caseOrg: "Kindling",
      caseFile: "KL-07",
      caseTitle: "A página de doação emaranhada",
      caseSituation: [
        "O site da Kindling recebe doações e manda uma carta de agradecimento. Os dois cresceram numa pilha só de arquivos. Um voluntário que não é desenvolvedor quer mudar a carta para o inverno. Da última vez que alguém tentou, o pagamento com cartão falhou durante uma tarde.",
        "A instituição não pode contratar uma equipe grande. Pode deixar um mapa e uma fronteira.",
      ],
      caseTask: "Proponha uma separação para a carta mudar sem arriscar o pagamento.",
      caseSteps: [
        "Nomeie os dois trabalhos: palavras calorosas e receber dinheiro com segurança.",
        "Coloque uma fronteira entre eles.",
        "Nomeie quem recebe a ligação se os pagamentos falharem.",
        "Na nota, escreva o mapa em poucas linhas que um voluntário consiga seguir.",
      ],
      decisions: [
        {
          prompt: "Onde a carta de agradecimento deve viver?",
          options: ["Dentro do código do pagamento", "Separada do pagamento, encontrando-o numa porta só", "Congelada, para ninguém poder mudar as palavras"],
        },
        {
          prompt: "Quem é chamado se os pagamentos falham de noite?",
          options: ["Quem acontecer de ver", "Um papel com nome, escrito no mapa", "O chat inteiro dos voluntários, tudo ao mesmo tempo"],
        },
        {
          prompt: "Onde o mapa vive?",
          options: ["Na memória de quem criou", "Escrito, ao lado de como rodar as verificações", "Num chat particular que some"],
        },
      ],
      noteLabel: "O mapa para um voluntário novo",
      noteHint: "Mostre onde fica a carta, onde fica o pagamento e quem chamar.",
    },
    scale: {
      title: "Quando a fila fica longa",
      promise: "Crescer o número de pessoas sem quebrar o que precisa continuar exato.",
      objectives: [
        "Distinguir um momento de movimento de um desenho que é só desperdício.",
        "Explicar uma fila e um cache sem esconder o que se troca.",
        "Proteger o que está certo e o que é justo enquanto se cresce.",
      ],
      start: [
        "Escala é o que acontece quando chega mais gente do que a forma atual consegue segurar. Dez pessoas numa clínica não são um milhão de pessoas comprando um ingresso no mesmo segundo. Os dois casos são reais. O primeiro não precisa da maquinaria do segundo. O segundo cai se você fingir que ele é o primeiro.",
        "O que precisa continuar verdadeiro não pode ficar no mais ou menos. Uma pessoa é cobrada uma vez. Um lugar é vendido uma vez. Um passe vale ou não vale. Páginas bonitas podem esperar. O registro exato, não.",
      ],
      how: [
        "Quando uma multidão chega, as pessoas formam uma fila. Uma fila, no sistema, é essa linha para o trabalho. Ela parece mais lenta para cada pessoa e impede que a sala que decide seja derrubada. Um cache repete uma resposta pública que pode estar alguns segundos atrasada, para o banco de dados não ouvir a mesma pergunta um milhão de vezes. Uma cópia de um serviço pode dividir o trabalho que é só de leitura. Cópias não perdoam uma regra que só era verdadeira numa máquina.",
        "Ser justo faz parte da escala. Uma pessoa com conexão mais rápida não deve conseguir furar uma fila que você prometeu justa. Escreva o que 'justo' quer dizer antes de a multidão chegar, não no meio dela.",
      ],
      expert: [
        "A ordem é esta: medir a dor de verdade, proteger o registro exato e só então acrescentar uma fila ou um cache na parte que pode ceder. Não coloque um pagamento em cache. Não deixe a página pública martelar a linha que precisa ser exata. Não compre uma máquina maior como única ideia, ou você compra outra no ano que vem.",
        "Milhões de pessoas ao mesmo tempo é uma promessa específica. Ela precisa de um número, de um ensaio e de um plano para o minuto em que esse número é passado. 'Vai dar certo' não é uma arquitetura.",
      ],
      example: [
        "O sábado comum do Harbor Market não precisa da maquinaria de festival. A noite de festival precisa. O painel público pode estar alguns segundos atrasado. Marcar uma barraca como fechada, e qualquer pagamento, continua exato e passa por uma fila se a multidão for grande.",
        "Quem compra pode ver 'aberto' por um instante depois que uma barraca fecha. Nunca pode ser cobrado duas vezes, e duas pessoas nunca podem ouvir que ficaram com a mesma última porção, se o mercado vende ingressos numerados.",
      ],
      narration:
        "Escala quer dizer mais pessoas do que a forma atual consegue segurar. Dez pessoas e um milhão de pessoas são problemas diferentes. O que precisa continuar exato, continua exato: uma pessoa é cobrada uma vez, um lugar é vendido uma vez. Uma fila é uma linha que protege a sala que decide. Um cache pode repetir uma resposta pública por alguns segundos. Não pode lembrar um pagamento. No Harbor Market, o painel pode ficar atrasado por um instante. O dinheiro, não.",
      checkPrompt: "Enquanto um sistema cresce, o que precisa continuar verdadeiro?",
      checkOptions: ["As páginas ficam mais bonitas", "As promessas exatas, como cobrar uma pessoa uma vez só", "A marca fala mais alto", "As ferramentas são as mais novas"],
      benchTitle: "Noite de festival",
      benchPrompt: "Um milhão de pessoas vai tentar comprar um ingresso do Festival das Lanternas às 10:00. O que você protege primeiro?",
      benchItems: [
        "Um logotipo maior e uma animação mais rápida.",
        "O registro exato: um ingresso, uma venda, nenhuma cobrança em dobro. Deixe a página pública esperar numa fila.",
        "Uma galeria mais bonita das lanternas do ano passado.",
      ],
      benchSlots: [],
      caseOrg: "Festival das Lanternas",
      caseFile: "LF-08",
      caseTitle: "Ingressos às 10:00",
      caseSituation: [
        "O Festival das Lanternas vende um número limitado de ingressos. No ano passado, a página travou às 10:00 e algumas pessoas foram cobradas duas vezes. Quem compra é o público, não uma equipe técnica. As pessoas vão tocar de novo se a página parecer travada.",
        "Você tem os dias comuns e tem este minuto. Eles não devem ser desenhados como se fossem o mesmo minuto.",
      ],
      caseTask: "Diga o que você protege primeiro, o que pode esperar numa fila e o que você não vai colocar em cache.",
      caseSteps: [
        "Nomeie a promessa exata: um ingresso, uma cobrança.",
        "Diga o que a pessoa vê enquanto espera, para não tocar duas vezes de pânico.",
        "Decida o que pode ir para o cache e o que não pode.",
        "Na nota, escreva a ordem das ações desse minuto.",
      ],
      decisions: [
        {
          prompt: "O que você protege primeiro?",
          options: ["Uma página mais bonita", "Um ingresso e uma cobrança, com exatidão", "Um filme novo da marca"],
        },
        {
          prompt: "Como a multidão chega à sala que vende?",
          options: ["Cada toque bate na linha do pagamento na hora, com toda a força", "Uma fila, com um estado de espera bem claro", "Fechar o site e vender só pelo correio"],
        },
        {
          prompt: "O que pode ir para o cache?",
          options: ["O próprio pagamento", "Uma dica pública, como se ainda há ingressos, com alguns segundos de atraso", "Nada, nem as imagens paradas"],
        },
      ],
      noteLabel: "O minuto das 10:00",
      noteHint: "Escreva a ordem: o que continua exato, o que espera e o que a pessoa vê.",
    },
    observe: {
      title: "Enxergar o sistema",
      promise: "Saber quais perguntas fazer quando algo parece errado e em quais alertas uma pessoa consegue agir.",
      objectives: [
        "Separar um registro, uma métrica e um rastro em palavras simples.",
        "Seguir um pedido da porta até o registro.",
        "Escrever um alerta que diga a uma pessoa o que fazer.",
      ],
      start: [
        "Observabilidade quer dizer que você consegue dizer o que o sistema está fazendo sem adivinhar. Quando uma pessoa diz 'o painel está errado', você precisa de um jeito de olhar que não dependa de quem criou estar acordado.",
        "Três perguntas cobrem a maioria das noites. O que este pedido fez? Quantos estão falhando? O que o sistema anotou na hora?",
      ],
      how: [
        "Um registro é uma linha de diário: nesta hora, esta barraca foi marcada fechada, por este tipo de quem agiu. Ele não deve conter segredos nem o registro particular de uma pessoa além do que a noite exige. Uma métrica é um número ao longo do tempo: quantas vezes abrir o painel falhou em cinco minutos. Um rastro é o caminho de um pedido pelas salas, para você ver onde ele parou.",
        "Um alerta é uma métrica com uma promessa junto: se este número passa de uma linha, uma pessoa nomeada deve fazer uma ação nomeada. Um alerta em que ninguém consegue agir é ruído, e ruído ensina as pessoas a ignorar o alerta de verdade.",
      ],
      expert: [
        "Decida as perguntas antes da queda. Numa tarde calma, escreva: se as entregas param de aparecer como saiu para entrega, qual rastro eu abro, em qual número eu confio, qual registro eu leio? Se você inventa as perguntas às 02:14, vai deixar passar a sala que de fato falhou.",
        "Saúde é uma frase, não um ponto verde. 'Saudável' quer dizer que o painel público combina com o banco de dados em poucos segundos e que os salvamentos que falharam estão à vista. Um ponto verde que esconde uma fila emperrada é o jeito de uma noite se perder com educação.",
      ],
      example: [
        "Harbor Market observa três coisas. A contagem de salvamentos que falharam. A idade do cache público. E, quando um feirante diz 'não salvou', o caminho daquele pedido.",
        "O alerta é este: se os salvamentos que falham sobem, acorde o responsável nomeado e pare os próximos lançamentos. Não chame essa pessoa porque uma imagem carregou devagar.",
      ],
      narration:
        "Você não conserta o que não consegue ver. Um registro é uma linha de diário. Uma métrica é um número ao longo do tempo. Um rastro é o caminho de um pedido. Um alerta deve nomear a ação que uma pessoa faz. No Harbor Market, se os salvamentos começam a falhar, um responsável nomeado é acordado e os lançamentos param. Uma imagem lenta não chama ninguém.",
      checkPrompt: "Um feirante diz que a mudança não salvou. O que você quer primeiro?",
      checkOptions: ["Esperar que tenha sido só desta vez", "O caminho daquele pedido", "Uma cor nova no ponto de situação", "Reiniciar, antes de olhar"],
      benchTitle: "Combinar a pergunta",
      benchPrompt: "Parcel & Pine, 02:14. As entregas pararam de aparecer como saiu para entrega. Combine cada necessidade com a ferramenta.",
      benchItems: ["Um rastro, o caminho de um pedido", "Uma métrica, um número ao longo do tempo", "Um registro, o diário do que foi escrito"],
      benchSlots: [
        "Seguir a atualização de uma encomenda pelas salas",
        "Ver quantas atualizações estão falhando",
        "Ler o que o sistema escreveu quando um motorista marcou uma encomenda",
      ],
      caseOrg: "Parcel & Pine",
      caseFile: "PP-09",
      caseTitle: "02:14, a situação fica em silêncio",
      caseSituation: [
        "Parcel & Pine mostra aos clientes uma situação: embalado, saiu para entrega, entregue. Às 02:14, as atualizações de 'saiu para entrega' param. Os motoristas continuam trabalhando. Os clientes atualizam a página e não veem nada de novo. Quem opera à noite não é desenvolvedor.",
        "Você está escrevendo as perguntas que essa pessoa deve conseguir fazer e o alerta que deveria ter acordado alguém.",
      ],
      caseTask: "Diga o que você olha, o que o alerta diz e o que não vale uma chamada para uma pessoa.",
      caseSteps: [
        "Escreva as três perguntas: uma encomenda, quantas, o que foi escrito.",
        "Nomeie o primeiro olhar: o caminho de uma atualização.",
        "Escreva o alerta como uma ação, não como um estado de espírito.",
        "Na nota, defina 'saudável' numa frase que quem opera consiga conferir.",
      ],
      decisions: [
        {
          prompt: "Qual é o primeiro olhar?",
          options: ["Reiniciar tudo", "O caminho de uma atualização que deveria ter aparecido", "Esperar até de manhã, caso se resolva sozinho"],
        },
        {
          prompt: "O que um bom alerta diz?",
          options: ["Algo parece estranho", "Atualizações que falharam passaram da linha. Faça isto e chame este papel", "Mande e-mail para a empresa inteira"],
        },
        {
          prompt: "Uma única foto de produto carrega devagar. Você chama quem opera à noite?",
          options: ["Sim, chame por cada imagem lenta", "Não. Chame pelas atualizações de situação que falharam, não por uma imagem lenta", "Chame a noite inteira, para a pessoa continuar alerta"],
        },
      ],
      noteLabel: "O que saudável quer dizer esta noite",
      noteHint: "Escreva a frase que quem opera consegue conferir e a primeira pergunta que essa pessoa faz.",
    },
    security: {
      title: "Quem, e o que pode fazer",
      promise: "Separar a identidade da permissão e impedir que fatos particulares vazem.",
      objectives: [
        "Distinguir autenticação de autorização em palavras simples.",
        "Nomear três jeitos comuns de um fato particular escapar.",
        "Escolher a permissão menor, de propósito.",
      ],
      start: [
        "Autenticação responde: quem é você? Autorização responde: o que você pode fazer? Um login prova a primeira. Não concede a segunda. Um estudante que consegue entrar não deve, por causa disso, ver as notas de todo mundo. Um feirante que consegue entrar não deve ver as vendas da barraca ao lado.",
        "Segurança, num sistema usado por quem não é desenvolvedor, é sobretudo essa disciplina, mais o cuidado com segredos. As pessoas vão fazer o que é fácil. O que é fácil também precisa ser o que é seguro.",
      ],
      how: [
        "O caminho entre o navegador e a aplicação vai criptografado, para um estranho na rede não conseguir ler a página. Segredos, como senhas e chaves, vivem fora do projeto e fora dos registros. Cada pessoa tem o próprio login. Uma senha compartilhada parece amigável e faz cada ação impossível de atribuir a alguém, e impossível de tirar quando essa pessoa sai.",
        "Fatos particulares vazam por erros comuns. Vão parar na barra de endereço, onde são copiados e anotados. Ficam numa cópia de segurança num notebook. São mostrados a um papel que não precisava deles. São escritos no registro de uma lista de verificação. Privilégio mínimo quer dizer que cada papel vê só o que o trabalho precisa.",
      ],
      expert: [
        "Ameaças são concretas. Escreva: quem poderia querer este registro, o que essa pessoa já consegue fazer e o que contaria como vazamento. Um livro de notas vaza se um estudante vê as notas de outro, se um notebook perdido guarda a cópia de segurança ou se um endereço com o número do estudante pode ser adivinhado. Não precisa de enredo de filme.",
        "Sessões são cookies que o navegador guarda. Devem ser impossíveis de um programa de outro site roubar, curtas o bastante para expirar e inúteis se alguém copiar para um registro. Um limite de tentativas impede um programa de testar um milhão de senhas. Nada disso substitui a divisão de base: quem você é e o que você pode fazer.",
      ],
      example: [
        "Harbor Market dá a cada feirante o próprio login. O feirante pode editar a própria barraca. Não pode abrir as vendas da barraca ao lado. O papel do escritório pode. O público pode ver o horário de funcionamento e nada mais.",
        "Uma cópia de segurança do livro das barracas vai criptografada e fica com o responsável nomeado, não num notebook pessoal dentro de uma bolsa. O endereço de uma página nunca traz um total particular.",
      ],
      narration:
        "Autenticação pergunta quem você é. Autorização pergunta o que você pode fazer. Um login não é permissão para ver tudo. Dê a cada pessoa o próprio login. Mantenha os segredos fora do projeto e fora dos registros. Fatos particulares vazam pela barra de endereço, por cópias de segurança em notebooks e por papéis que enxergam demais. No Harbor Market, um feirante vê a própria barraca, não as vendas da porta ao lado.",
      checkPrompt: "Qual frase está certa?",
      checkOptions: [
        "Autenticação e autorização são duas palavras para a mesma coisa",
        "Autenticação diz quem você é. Autorização diz o que você pode fazer",
        "Uma senha longa é a segurança inteira",
        "Esconder a página vale o mesmo que uma permissão",
      ],
      benchTitle: "Quais desenhos vazam?",
      benchPrompt: "O livro de notas do Colégio Westfield. Escolha os três desenhos que vazam. Deixe os três mais seguros quietos.",
      benchItems: [
        "Uma senha compartilhada para todos os professores, escrita no quadro da sala dos professores",
        "As notas de um estudante colocadas na barra de endereço",
        "A cópia de segurança da noite copiada para o notebook pessoal de um professor",
        "Cada professor e cada estudante tem o próprio login",
        "A cópia de segurança está trancada, e só um papel com nome consegue abrir",
        "Um estudante vê as próprias notas, e um professor vê a própria turma",
      ],
      benchSlots: [],
      caseOrg: "Colégio Westfield",
      caseFile: "WC-10",
      caseTitle: "O livro de notas",
      caseSituation: [
        "O Colégio Westfield guarda as notas de cada estudante. Os professores lançam as notas. Os estudantes consultam as próprias. Uma demonstração de fornecedor usa uma senha só para toda a equipe, e o número do estudante aparece no endereço da web, para ficar fácil compartilhar um link.",
        "Os estudantes são jovens. A equipe está ocupada. O caminho fácil vai ser o caminho que eles pegam. O caminho fácil tem que ser aquele que não vaza.",
      ],
      caseTask: "Diga quem pode ver o quê e feche três vazamentos.",
      caseSteps: [
        "Liste os papéis: estudante, professor, escritório.",
        "Escreva o que cada papel pode ver e o que não pode.",
        "Marque a senha compartilhada, a barra de endereço e a cópia de segurança no notebook como os vazamentos a fechar.",
        "Na nota, descreva o desenho mais seguro em palavras que a coordenação de série aprovaria.",
      ],
      decisions: [
        {
          prompt: "Como as pessoas entram?",
          options: ["Uma senha compartilhada no quadro da sala dos professores", "Cada pessoa tem o próprio login", "Sem login. A página fica escondida"],
        },
        {
          prompt: "Quem vê as notas de um estudante?",
          options: [
            "Qualquer pessoa que consiga entrar",
            "O estudante vê as próprias. Um professor vê a própria turma. O escritório vê o que o trabalho pede",
            "As notas são públicas, para poupar ligações de suporte",
          ],
        },
        {
          prompt: "Onde a cópia de segurança vive?",
          options: ["No notebook pessoal de um professor", "Trancada, aberta só por um papel com nome", "No chat da equipe"],
        },
      ],
      noteLabel: "O livro de notas mais seguro",
      noteHint: "Diga quem vê o quê e como os três vazamentos se fecham.",
    },
    futures: {
      title: "O que muda, o que fica",
      promise: "Notar mudanças de verdade em como os sistemas são feitos e recusar apostar a promessa.",
      objectives: [
        "Nomear mudanças que estão chegando de verdade, sem as palavras de venda.",
        "Nomear o que não fica velho: a tarefa, o registro, a falha, o cuidado.",
        "Preferir um futuro do qual você consegue sair.",
      ],
      start: [
        "Ferramentas, plataformas e modas mudam. As pessoas ainda precisam terminar uma tarefa, confiar num registro e conseguir ajuda quando falha. Uma tendência do futuro merece atenção quando muda onde o trabalho roda, quem guarda os dados ou como uma pessoa pede alguma coisa. Não merece atenção só por ser nova.",
        "Sistemas para quem não é desenvolvedor vão continuar precisando de uma porta para o público e de um sistema de apoio atrás dela. Esse apoio pode, um dia, ficar mais perto da pessoa, num aparelho, ou mais longe, num serviço compartilhado. A promessa tem que sobreviver às duas mudanças.",
      ],
      how: [
        "Fique de olho em três mudanças. O trabalho pode rodar mais perto da pessoa, e então um quiosque ou um celular consegue cumprir uma promessa pequena mesmo quando a rede cai, e mandar o registro depois. A organização que guarda os dados pode não ser aquela em que a pessoa pensa, então contratos e a saída importam. As pessoas podem pedir com fala comum, e isso quer dizer que o sistema ainda precisa de uma tarefa clara por baixo da conversa.",
        "O que fica: desenhar a partir da tarefa, uma decisão que vive numa sala conhecida, uma lista de verificação, um caminho de volta, um mapa para a próxima pessoa, um registro exato, um jeito de ver uma falha e a divisão entre quem alguém é e o que essa pessoa pode fazer. Isso não perde a validade quando um fornecedor sai de cena.",
      ],
      expert: [
        "Uma escolha à prova de futuro é uma escolha da qual você consegue sair. Dá para exportar o registro? Outra equipe consegue rodar as verificações? Dá para desligar a porta nova? Se a resposta for não, você não comprou um futuro. Alugou uma armadilha. Escreva a saída no dia em que entrar.",
        "Não aposte uma escola, uma clínica, um mercado ou um festival num serviço só da moda, que você não consegue olhar por dentro e não consegue deixar. Use a novidade na borda, onde uma falha ainda dá para aguentar. Guarde o registro num lugar em que você ainda consiga ler daqui a dez anos.",
      ],
      example: [
        "Harbor Market pode, um dia, deixar um feirante falar o horário em vez de tocar na tela. A tarefa não muda: este horário, esta barraca, esta pessoa autorizada a dizer. O registro não muda. A porta por fala é uma plataforma nova na frente das mesmas salas.",
        "Se o serviço de fala fechasse, a página do celular continuaria. Esse é o teste. O mercado não guarda a única cópia dos horários dentro de um serviço do qual não consegue exportar.",
      ],
      narration:
        "As ferramentas vão mudar. A promessa, não. As pessoas ainda precisam terminar uma tarefa, confiar num registro e conseguir ajuda quando falha. Você pode aproximar o trabalho da pessoa, ou deixar que ela peça com fala comum. Guarde um jeito de sair. No Harbor Market, uma porta por fala poderia ficar na frente do mesmo livro das barracas. Se essa porta fechasse, o registro ainda seria do mercado.",
      checkPrompt: "O que não fica velho?",
      checkOptions: [
        "A moda atual do fornecedor",
        "A promessa para a pessoa: a tarefa, o registro, o cuidado quando falha",
        "A moda visual deste ano",
        "Uma frase de efeito sobre o futuro",
      ],
      benchTitle: "O que você guarda",
      benchPrompt: "A Sala Nacional de Leitura precisa planejar cinco anos à frente. Qual posição você toma?",
      benchItems: [
        "Adotar uma frase de efeito e um fornecedor só, e colocar lá a única cópia do catálogo.",
        "Preparar a troca de ferramentas e recusar qualquer escolha da qual você não consiga sair. O catálogo continua exportável.",
        "Congelar toda ferramenta para sempre, para nada de novo poder ser experimentado na borda.",
      ],
      benchSlots: [],
      caseOrg: "Sala Nacional de Leitura",
      caseFile: "NR-11",
      caseTitle: "Cinco anos do catálogo",
      caseSituation: [
        "A Sala Nacional de Leitura empresta ao público e guarda um catálogo de que a equipe depende. Um fornecedor oferece uma porta da frente nova e bonita, com a condição de o catálogo viver só dentro do serviço dele. Sair depois significaria perder o histórico dos empréstimos.",
        "Quem lê e a equipe do balcão não são desenvolvedores. Vão gostar de uma porta mais simples. Não vão gostar de um catálogo que não conseguem recuperar.",
      ],
      caseTask: "Escreva o que você guarda, o que se prepara para mudar e o que recusa apostar.",
      caseSteps: [
        "Diga a promessa que ainda precisa ser verdadeira daqui a cinco anos.",
        "Nomeie uma porta nova que você toparia experimentar na borda.",
        "Nomeie a saída: como o catálogo sai com você.",
        "Na nota, escreva o relato que você daria de verdade à diretoria.",
      ],
      decisions: [
        {
          prompt: "O que você guarda, façam as ferramentas o que fizerem?",
          options: ["A relação com o fornecedor", "O catálogo e o registro dos empréstimos, legíveis sem o fornecedor", "A frase de efeito"],
        },
        {
          prompt: "O que você prepara?",
          options: ["Ficar, mesmo sem conseguir exportar", "Um jeito de sair, já testado, antes de depender da porta nova", "Nada. Cinco anos é longe demais para planejar"],
        },
        {
          prompt: "O que você recusa?",
          options: ["Um desenho em que a única cópia fica num serviço do qual você não consegue sair", "Qualquer porta nova, até um ensaio pequeno", "Um relato escrito para a diretoria"],
        },
      ],
      noteLabel: "O relato para a diretoria",
      noteHint: "Diga o que você guarda, o que experimentaria e o que não vai apostar.",
    },
  },
  brief: {
    title: "Harbor Market, de ponta a ponta",
    dek: "Um mercado. Onze promessas. Um relato que a direção consegue ler.",
    situation: [
      "Você praticou as mesmas ideias numa clínica, numa empresa de ônibus, numa escola, num hospital, numa instituição beneficente, num festival, numa rede de encomendas, num colégio e numa biblioteca. Harbor Market é onde elas se encontram.",
      "Feirantes não são desenvolvedores. Quem compra está com pressa. O escritório é pequeno. O painel precisa ser verdadeiro num sábado à noite e ainda ser seu daqui a cinco anos.",
    ],
    task: "Escreva o relato de operação: uma escolha para cada promessa e uma nota final com as suas palavras.",
    steps: [
      "Leia as notas dos casos anteriores no dossiê. Elas são o treino. Esta página é a transferência.",
      "Responda cada promessa para o Harbor Market, não para as outras organizações.",
      "Mantenha o painel público, o livro das barracas e as pessoas à vista ao mesmo tempo.",
      "Na nota final, diga a uma direção nova o que nunca pode ser apostado.",
    ],
    decisions: [
      {
        prompt: "Onde vive a bancada da equipe?",
        options: ["Num notebook só, que vai para casa", "Numa bancada compartilhada, com histórico", "No papel"],
      },
      {
        prompt: "Como quem compra, o feirante e o escritório encontram o livro das barracas?",
        options: ["Três sistemas separados", "Três portas, um registro", "Só um aplicativo de celular, sem mesa"],
      },
      {
        prompt: "O que você desenha primeiro?",
        options: ["As telas", "A tarefa: o que está aberto e quem pode dizer", "O logotipo"],
      },
      {
        prompt: "Onde vive 'esta pessoa pode editar esta barraca?'",
        options: ["Só no navegador", "Na aplicação", "Só no banco de dados"],
      },
      {
        prompt: "Uma lista de verificação está vermelha na manhã de um festival. O que acontece?",
        options: ["Publica a mudança mais tarde no mesmo dia, mesmo assim", "Bloqueia. Abre na última versão verde", "Pula as verificações"],
      },
      {
        prompt: "Como você lança uma mudança no painel público?",
        options: ["Tudo, na hora de abrir", "Um passo pequeno, com um caminho de volta ensaiado", "Em silêncio"],
      },
      {
        prompt: "Uma pessoa nova da equipe precisa mudar um fechamento de feriado. Como o sistema está formado?",
        options: ["Uma pilha só, inclusive pagamentos se houver", "As palavras separadas de tudo o que precisa continuar exato, com um mapa", "Congelado, para nada poder mudar"],
      },
      {
        prompt: "Numa noite cheia, o que continua exato?",
        options: ["A animação", "O registro de uma mudança e qualquer pagamento", "Nada. Feche o mercado"],
      },
      {
        prompt: "Um feirante diz que uma mudança não salvou. O que você quer?",
        options: ["Esperança", "O caminho daquele pedido e um alerta em que uma pessoa consegue agir", "Um reinício na hora, como única ferramenta"],
      },
      {
        prompt: "Quem vê as anotações particulares de uma barraca?",
        options: ["Qualquer pessoa com a senha compartilhada do escritório", "O feirante e o papel do escritório que precisa delas", "O público"],
      },
      {
        prompt: "Oferecem uma porta por fala nova. O que você exige?",
        options: ["A única cópia dos horários vai para dentro desse serviço", "Dá para sair. O registro continua exportável", "Nenhuma porta nova pode ser experimentada, nunca"],
      },
    ],
    noteLabel: "A nota para a direção",
    noteHint: "Diga o que o Harbor Market nunca deve apostar: o registro, as pessoas e o caminho de volta.",
    narration:
      "Este é o mercado inteiro, num relato só. Feirantes não são desenvolvedores. O painel tem que ser verdadeiro num sábado à noite, e o registro ainda tem que ser do mercado daqui a cinco anos. Escolha a bancada compartilhada, um registro atrás das portas, uma lista de verificação que sabe dizer não, um lançamento pequeno com caminho de volta, um mapa para a próxima pessoa, um registro exato quando a multidão chega, um jeito de ver uma falha, permissões que combinam com o trabalho e um futuro do qual dá para sair.",
  },
};
