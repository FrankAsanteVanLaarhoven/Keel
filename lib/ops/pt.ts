import type { OpsPack } from "./types";

export const pt: OpsPack = {
  sections: {
    web: {
      title: "A web e a internet",
      promise: "Distinguir a rede dos documentos que ela carrega, e seguir um pedido até o servidor responder.",
      objectives: [
        "Separar a web da internet numa frase.",
        "Nomear IP, TCP e HTTP pelo trabalho de cada um.",
        "Percorrer um pedido da porta aberta até a resposta, e deixar os segredos fora.",
      ],
      start: [
        "A internet é a rede de computadores. A web são os documentos, o som e o vídeo que esses computadores trocam. Tim Berners-Lee traçou essa linha: na internet você encontra computadores; na web você encontra obras. Uma página pode falhar com os cabos em ordem, e os cabos podem falhar enquanto a página ainda é um arquivo num disco.",
        "Um pacote é um pedaço desse trabalho mais um cabeçalho, para a máquina distante saber para que serve o pedaço. A mensagem se parte em pacotes, os pacotes viajam como bits, e roteadores e switches os encaminham. Na outra ponta eles voltam à ordem. Se o cabeçalho e os dados não concordam, quem recebe não pode mostrar nada com segurança.",
      ],
      how: [
        "Três acordos fazem a maior parte do transporte. IP move pacotes de uma rede para outra. TCP confere se esses pacotes chegaram e os junta de novo numa conexão. HTTP é o acordo de um pedido web: um método, um caminho, cabeçalhos, e depois um estado, cabeçalhos e um corpo.",
        "Um cliente pede. Um servidor escuta numa porta. O servidor aceita a conexão TCP, lê o método, o caminho e os cabeçalhos, e confere se o método é permitido e se o caminho é um que ele conhece. Um arquivo é lido do disco. Uma página montada a partir de um registro é entregue à aplicação. Uma chamada de API roda o código que lê ou muda dados. A resposta leva um estado como 200, 404 ou 500, os cabeçalhos e o corpo. Antes de enviar, o servidor confere se não há um segredo nesse corpo, e se um redirecionamento é usado quando um é exigido. A resposta volta pela mesma conexão, em pacotes. O HTTP mais antigo, ou um cliente que pede, fecha a conexão. Caso contrário, ela pode ficar aberta, e o próximo pedido pula o aperto de mão.",
      ],
      expert: [
        "A máquina no rack é hardware: uma blade ou uma torre, pequena o bastante para caber num gabinete, com processador, memória, armazenamento e portas de rede. Uma fazenda de servidores é um prédio cheio dessas máquinas. O servidor que você configura é software que usa esse hardware. As pessoas dizem servidor para as duas coisas. Quando uma página de estado falha, você ainda precisa saber qual dos dois quer dizer.",
        "A Northline Payments mantém uma linha pública de estado, aberta ou retida, para a equipe que não é de engenharia. A linha é um arquivo. A chave do livro fica no ambiente da aplicação. Um 500 que imprime a chave não é uma queda da internet. É uma resposta que falhou na última verificação.",
      ],
      figure: "Um pedido viaja em pacotes pela internet e vira uma resposta HTTP no servidor.",
      links: [],
      narration:
        "A internet é a rede de computadores. A web são os documentos que esses computadores trocam. Um pacote carrega um pedaço do trabalho e um cabeçalho. IP move pacotes, TCP confere a conexão e HTTP carrega o pedido e a resposta. O servidor escuta, aceita, lê, valida, responde, e então fecha ou mantém a conexão. A chave do livro fica fora da página de estado.",
      checkPrompt: "Qual frase corresponde à diferença entre a web e a internet?",
      checkOptions: [
        "A web são os cabos entre os prédios",
        "A web são os documentos e a mídia; a internet é a rede que move os pacotes",
        "São dois nomes para a mesma coisa",
        "A web é só a janela do navegador",
      ],
      labTitle: "Rode um pedido de estado",
      labScene: [
        "O serviço de estado da Northline está escutando. O pedido no fio é GET /status HTTP/1.0, host status.northline.example, Connection: close. O arquivo /status contém a linha Northline payments: open. O ambiente guarda LEDGER_KEY. Essa chave não faz parte do arquivo.",
        "Coloque o trabalho do servidor na ordem em que de fato acontece. Depois escolha o estado, o corpo e o que acontece com a conexão. Rode antes de registrar. O painel mostra a resposta que as suas escolhas enviariam.",
      ],
      labWarn: "Essa resposta carrega LEDGER_KEY, ou é um 500. O arquivo de estado existe. A chave fica no ambiente.",
      fields: {
        path: {
          prompt: "Coloque o trabalho do servidor em ordem.",
          options: [
            "Escutar na porta",
            "Aceitar a conexão TCP",
            "Ler o método, o caminho e os cabeçalhos",
            "Conferir o método e o caminho",
            "Montar o estado, os cabeçalhos e o corpo",
            "Enviar a resposta e, em seguida, fechar esta conexão",
          ],
        },
        status: { prompt: "Qual estado cabe neste pedido?", options: ["200 OK", "404 Not Found", "500 Internal Server Error"] },
        body: { prompt: "Qual corpo é enviado?", options: ["O arquivo de estado", "LEDGER_KEY do ambiente", "Um corpo vazio"] },
        connection: {
          prompt: "O cliente pediu Connection: close em HTTP/1.0. O que o servidor faz depois da resposta?",
          options: ["Fecha a conexão", "Mantém aberta para mais pedidos"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-01",
      caseTitle: "A página de estado e a chave",
      caseSituation: [
        "Às 08:10 a página de estado mostrou um 500 e o texto de LEDGER_KEY. A engenharia da noite disse que a internet estava fora. Os gráficos de rede estavam quietos. O arquivo /status ainda era a linha Northline payments: open.",
        "As pessoas do balcão de pagamentos atualizam essa página antes de abrir as caixas. Não são da engenharia. Precisam de uma linha verdadeira, e nunca podem ver uma chave.",
      ],
      caseTask: "Decida o que de fato falhou, o que a próxima resposta precisa conter e o que acontece com a conexão.",
      caseSteps: [
        "Separe a rede quieta da resposta que o servidor escolheu enviar.",
        "Leia o pedido de novo: GET /status, HTTP/1.0, Connection: close, e o arquivo existe.",
        "Responda as três decisões.",
        "Na nota, diga o que o balcão deve ver, e o que nunca pode aparecer ali.",
      ],
      decisions: [
        {
          prompt: "O que falhou às 08:10?",
          options: ["A internet, quer dizer os cabos", "O servidor respondeu mal para um arquivo que existe", "A cor do navegador"],
        },
        {
          prompt: "O que a próxima resposta contém?",
          options: ["O mesmo corpo, para a engenharia ver a chave", "A linha de estado, e a chave fica no servidor", "A chave num cabeçalho, o que é mais seguro"],
        },
        {
          prompt: "O cliente enviou HTTP/1.0 e Connection: close. Depois de uma resposta válida, o que acontece?",
          options: ["O socket fica aberto para sempre", "O servidor fecha a conexão", "Uma segunda conexão é aberta para a mesma resposta"],
        },
      ],
      noteLabel: "Sua nota para o balcão de pagamentos",
      noteHint: "Escreva o que /status deve mostrar, e o que nunca pode aparecer nessa página.",
    },
    git: {
      title: "Git e o histórico compartilhado",
      promise: "Guardar um histórico que um estranho consiga seguir, e deixar os segredos fora.",
      objectives: [
        "Dizer o que o Git faz, e o que um host como o GitHub acrescenta.",
        "Fazer o commit de uma mudança pequena num ramo, com uma mensagem que diga o que mudou.",
        "Deixar o ramo main verde, e deixar as credenciais fora da árvore.",
      ],
      start: [
        "Git é o histórico na máquina: instantâneos, ramos e a diferença entre o que você tem e o que registrou por último. Um host como o GitHub guarda esse histórico onde outras pessoas podem receber acesso. O Git funciona sem o host. O host não é o histórico.",
        "Um repositório é legível quando o nome quer dizer alguma coisa e o README diz o que o projeto é, de que depende, como rodar e como testar. Faça commits em pedaços pequenos, cada um com uma só coisa: uma funcionalidade, uma correção ou uma refatoração. Um único commit no fim, chamado Versão final, é uma pilha, não um histórico.",
      ],
      how: [
        "Escreva a mensagem no imperativo e nomeie a mudança. Retornar 404 quando o caminho de estado é desconhecido é uma mensagem. Atualizar, Mudanças e Versão final não dizem à próxima pessoa o que mudou. Revise o diff antes do commit. Tire as saídas de depuração, as sobras e os arquivos que não pertencem.",
        "Faça o trabalho num ramo com o nome do trabalho, como feature/status-404. Junte esse ramo ao main só quando o projeto monta, os testes passam e as verificações estão verdes. O main é a linha que outra pessoa consegue rodar. Senhas, chaves, tokens, cadeias de conexão e dados pessoais ficam no ambiente, ou num arquivo que o gitignore exclui. Se uma chave ativa entra num commit, tire-a e gire a chave. Um repositório privado não é um cofre para uma chave ativa.",
      ],
      expert: [
        "A organização faz parte do histórico. O código, os testes, os documentos e a configuração ficam em lugares óbvios. Não faça commit da saída de build, de pastas de dependências nem de sobras do editor, a menos que o projeto tenha uma razão declarada. Quando muda o jeito de rodar o projeto, mude o README no mesmo trabalho.",
        "O serviço de estado da Northline é um repositório pequeno. A árvore à sua frente tem uma correção de verdade, uma linha do README, um .env com uma chave ativa, um arquivo de build e uma nota de rascunho. Só dois desses entram no próximo commit, e esse commit não cai no main sozinho.",
      ],
      figure: "A correção e o README vão para um ramo. O segredo, o build e a nota de rascunho ficam de fora. O main se move depois que as verificações ficam verdes.",
      links: [],
      narration:
        "Git é o histórico na máquina. Um host como o GitHub é onde esse histórico pode ser compartilhado. Faça commits de pedaços pequenos, com uma mensagem que nomeia a mudança, num ramo. O main fica verde. Os segredos ficam fora da árvore, e uma chave vazada é girada.",
      checkPrompt: "O que é o GitHub, ao lado do Git?",
      checkOptions: [
        "O controle de versão que roda na sua máquina",
        "Um host de repositórios Git, com acesso que você pode conceder",
        "O servidor que implanta a página de estado",
        "O monitor que chama você de noite",
      ],
      labTitle: "Escolha o commit",
      labScene: [
        "A árvore de trabalho tem cinco mudanças. README.md explica como rodar as verificações. src/status.ts retorna 404 quando o caminho é desconhecido. .env contém API_KEY=live-secret. dist/app.js é saída de build. notes.tmp é uma nota de rascunho.",
        "Escolha os arquivos que pertencem a um commit, a mensagem e o ramo. Rode e leia o commit que você está prestes a fazer. O main ainda deve ser a última linha verde.",
      ],
      labWarn: "Esse commit inclui um segredo, saída de build ou uma nota de rascunho, ou move o main. Deixe a chave de fora e deixe o main onde está.",
      fields: {
        files: {
          prompt: "Quais arquivos entram neste commit?",
          options: [
            "README.md, como rodar as verificações",
            "src/status.ts, caminhos desconhecidos retornam 404",
            ".env, API_KEY=live-secret",
            "dist/app.js, saída de build",
            "notes.tmp, uma nota de rascunho",
          ],
        },
        message: {
          prompt: "Qual mensagem cabe no commit?",
          options: ["Atualizar", "Retornar 404 quando o caminho de estado é desconhecido", "Versão final"],
        },
        branch: {
          prompt: "Onde este commit cai?",
          options: ["No main, agora", "Em feature/status-404, e o main fica como está"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-02",
      caseTitle: "A chave no main",
      caseSituation: [
        "Uma pessoa contratada enviou um commit ao main. A mensagem é Versão final. O diff acrescenta a correção do 404 e também acrescenta o .env com uma chave ativa. Não há ramo, e o README ainda diz que o projeto não pode ser rodado.",
        "O serviço de estado é o que o balcão de pagamentos confia de manhã. A próxima pessoa precisa conseguir rodar o main, e a chave ativa precisa deixar de funcionar.",
      ],
      caseTask: "Decida o que acontece com a chave, como a correção é descrita e onde cai o próximo trabalho.",
      caseSteps: [
        "Trate a chave como já exposta, mesmo que o repositório seja privado.",
        "Separe a correção útil dos arquivos que nunca deveriam ter entrado no commit.",
        "Responda as três decisões.",
        "Na nota, diga o que você gira e o que o main pode conter amanhã.",
      ],
      decisions: [
        {
          prompt: "A chave ativa está no commit. O que você faz?",
          options: ["Deixa, porque o repositório é privado", "Tira da árvore e gira a chave", "Envia a chave para a equipe para que ela tenha uma cópia"],
        },
        {
          prompt: "Qual mensagem cabe na correção?",
          options: ["Atualizar", "Retornar 404 quando o caminho de estado é desconhecido", "Versão final"],
        },
        {
          prompt: "Onde cai primeiro a próxima mudança?",
          options: ["Direto no main", "Num ramo, e depois no main quando as verificações estiverem verdes", "Num arquivo zip no chat"],
        },
      ],
      noteLabel: "Sua nota para a próxima pessoa no repositório",
      noteHint: "Escreva o que você faz com a chave vazada e o que o main precisa conter amanhã.",
    },
    devops: {
      title: "Desenvolvimento e operações",
      promise: "Construir, testar e lançar como uma prática contínua, e medir com quatro números.",
      objectives: [
        "Definir DevOps como desenvolvimento e operações num só caminho até o lançamento.",
        "Classificar uma tarefa em desenvolvimento, operações ou automação.",
        "Ler a frequência de implantação, o lead time, a taxa de falha e o tempo de restauração num registro.",
      ],
      start: [
        "DevOps junta desenvolvimento e operações para que o software seja construído, testado e lançado como uma só prática, e o serviço continue no ar depois. É contínuo. O objetivo é software apto a rodar, não um repasse por cima de um muro.",
        "Desenvolvimento escreve a mudança, acrescenta a funcionalidade, corrige o defeito, roda os testes de unidade, desenha a aplicação, guarda o histórico de versões e trabalha num ambiente de desenvolvimento. Operações roda o serviço, cuida da infraestrutura, mantém a disponibilidade, observa a produção, roda os servidores e a rede, implanta e responde pela produção. Você muitas vezes vai se especializar. Ainda assim, você precisa ver onde os dois lados se encontram.",
      ],
      how: [
        "A automação tira o trabalho manual que não precisa de uma pessoa: a rodada de testes, a implantação, o retorno. Uma pessoa ainda decide o que significa bom. A máquina repete os passos que não devem variar conforme quem está acordado.",
        "Você pode praticar isso num sistema que é só seu. O histórico, as verificações e o caminho de volta ainda precisam fazer sentido para a próxima pessoa, inclusive um você do futuro. Quatro números, do programa de pesquisa DORA, mantêm a prática honesta. A frequência de implantação é quantas vezes você implanta. O lead time é o tempo entre aceitar uma mudança e implantá-la. A taxa de falha de mudança diz quantas vezes uma implantação falha. O tempo de restauração é quanto tempo leva para recuperar o serviço.",
      ],
      expert: [
        "Um lançamento por mês, uma semana de lead time, falhas que esperam até segunda e nenhuma restauração escrita é uma prática que não consegue se ver. Os quatro números não substituem o julgamento. Impedem você de chamar de sucesso um lançamento raro e frágil só porque a demo parecia calma.",
        "A Northline implantou quatro vezes no registro do laboratório. Uma dessas implantações falhou. O serviço voltou na mesma noite. Classifique o trabalho e depois leia os quatro números no registro. Uma implantação que falhou ainda conta como implantação.",
      ],
      figure: "Desenvolvimento muda o software. Operações o roda. A automação repete os passos que não podem depender de quem está acordado. Quatro números dizem se o lançamento está saudável.",
      links: [{ href: "https://dora.dev/", label: "DORA" }],
      narration:
        "DevOps junta desenvolvimento e operações para que uma mudança seja construída, testada, lançada e mantida no ar. A automação toma os passos manuais que não deveriam precisar de uma pessoa. Quatro números da DORA mantêm isso honesto: quantas vezes você implanta, quanto tempo vai da aceitação à implantação, quantas vezes uma implantação falha e quanto tempo uma restauração leva.",
      checkPrompt: "Quantas métricas da DORA medem entrega e recuperação?",
      checkOptions: [
        "Uma: quantas vezes você implanta",
        "Quatro: frequência, lead time, taxa de falha e tempo de restauração",
        "Doze: uma para cada mês",
        "Nenhuma: DevOps é só um estado de espírito",
      ],
      labTitle: "Leia a semana",
      labScene: [
        "Registro da Northline, em hora local. Segunda 09:00 aceito, 11:00 implantado, sucesso. Terça 10:00 aceito, 18:00 implantado, falhou, 20:30 serviço restaurado. Quinta 09:00 aceito, 09:30 implantado, sucesso. Sexta 12:00 aceito, 13:00 implantado, sucesso.",
        "Classifique três trabalhos. Depois leia os quatro números desse registro. O lead time de terça vai das 10:00 às 18:00. A restauração vai da implantação que falhou até as 20:30. Conte a implantação que falhou na frequência.",
      ],
      labWarn: "O registro é a fonte. Confira cada número contra os horários antes de registrar.",
      fields: {
        code: {
          prompt: "Escrever o teste de unidade da linha de estado é qual tipo de trabalho?",
          options: ["Desenvolvimento", "Operações", "Automação"],
        },
        watch: {
          prompt: "Observar a taxa de erro de produção é qual tipo de trabalho?",
          options: ["Desenvolvimento", "Operações", "Automação"],
        },
        rollback: {
          prompt: "Um script que faz o retorno de uma implantação que falhou, sem alguém digitá-lo, é qual tipo de trabalho?",
          options: ["Desenvolvimento", "Operações", "Automação"],
        },
        frequency: {
          prompt: "Quantas implantações há neste registro?",
          options: ["Uma nesta semana", "Quatro nesta semana", "Vinte nesta semana"],
        },
        lead: {
          prompt: "Quanto dura o lead time da mudança de terça, da aceitação à implantação?",
          options: ["30 minutos", "8 horas", "Uma semana"],
        },
        fail: {
          prompt: "Quantas dessas implantações falharam?",
          options: ["Nenhuma", "Uma das quatro", "Todas"],
        },
        restore: {
          prompt: "Quanto tempo levou para restaurar o serviço depois da implantação que falhou na terça?",
          options: ["10 minutos", "2 horas e 30 minutos", "O fim de semana"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-03",
      caseTitle: "A restauração do fim de semana",
      caseSituation: [
        "No trimestre passado a Northline implantava uma vez por mês. Uma mudança aceita na primeira segunda muitas vezes saía três semanas depois. Cerca de uma implantação em três falhava, e o serviço às vezes seguia errado até a segunda seguinte. Não havia um script de retorno.",
        "Alguém no balcão disse que DevOps não se aplica, porque não há uma equipe separada de operações. O estado dos pagamentos continua sendo o serviço do balcão. O registro do laboratório é a semana mais nova, em que uma falha foi restaurada na mesma noite.",
      ],
      caseTask: "Decida o que uma pessoa ainda pode fazer, qual número é a restauração e o que deve rodar sem uma pessoa no teclado.",
      caseSteps: [
        "Use o registro do laboratório como evidência, não a memória do trimestre.",
        "Nomeie o intervalo de restauração separado do lead time.",
        "Responda as três decisões.",
        "Na nota, escreva os quatro números da semana do laboratório e nomeie o passo que deve ser automático.",
      ],
      decisions: [
        {
          prompt: "Não há uma equipe separada de operações. O que você faz na noite de uma falha?",
          options: ["Espera uma equipe que não existe", "Segue o rastro, restaura e escreve os quatro números", "Trata DevOps como algo que só um departamento pode fazer"],
        },
        {
          prompt: "No registro do laboratório, qual intervalo é o tempo de restauração?",
          options: ["Quinta, das 09:00 às 09:30", "Terça, da implantação que falhou às 18:00 até as 20:30", "A contagem de implantações da semana"],
        },
        {
          prompt: "O que deve ser automático?",
          options: ["Esconder uma implantação que falhou para o quadro continuar calmo", "O retorno, para ninguém ter que digitá-lo de noite", "Toda mudança de produção, sem registro"],
        },
      ],
      noteLabel: "Sua nota sobre a entrega da semana",
      noteHint: "Escreva os quatro números da semana do laboratório e nomeie o passo que deve rodar sem uma pessoa.",
    },
    finops: {
      title: "Custo, confiança e valor",
      promise: "Saber para que é o gasto, e recusar uma fatura que não compra resultado nenhum.",
      objectives: [
        "Tratar uma conta paga compartilhada como uma confiança, não como capacidade sobrando.",
        "Atribuir um custo de nuvem ao serviço que o causa, e limitar o que está ocioso.",
        "Julgar o gasto com modelo pelo resultado que uma pessoa de fato usa.",
      ],
      start: [
        "Quando um serviço é real, algumas ferramentas são pagas: runners, bancos de dados, assentos, modelos. Uma conta paga compartilhada é uma confiança. Trabalho pessoal, e cópias paradas de dados de produção, não pertencem a ela. A fatura faz parte do sistema.",
        "FinOps é a prática de ver esse custo, atribuí-lo ao serviço que o causa e decidir o que manter. Uma pessoa especialista pode ir mais fundo depois. A decisão à sua frente já é concreta: manter, limitar ou parar.",
      ],
      how: [
        "Runners de CI ociosos durante a noite não são velocidade de graça. Limite-os às montagens que você de fato roda, e deixe esses minutos no serviço que precisa deles. Um banco de dados de produção que guarda o livro é o serviço. Você não o para para a fatura ficar menor, e não o esconde num cartão pessoal.",
        "Os tokens de um modelo são um custo com uma pergunta junto: este uso produz um resultado que alguém usa? A economia de tokens acompanha a produção, o consumo e o custo desse uso ao longo da vida. Um resumo noturno que ninguém abre há um mês não é um resultado. Uma janela de contexto maior não conserta uma página que ninguém lê. Pare até uma pessoa usar o resultado numa decisão.",
      ],
      expert: [
        "Limitar não é parar. Limite a capacidade ociosa de algo que você ainda precisa. Pare o que não tem usuário, ou o que quebra a confiança da conta compartilhada. Mantenha o que o serviço não consegue rodar sem isso, e diga a qual serviço pertence.",
        "O mês da Northline tem quatro linhas numa só conta compartilhada: CI, a base do livro, um resumo de modelo sem leitores e uma transcodificação pessoal. O laboratório é essa fatura. O caso é a nota que você enviaria a quem a paga.",
      ],
      figure: "Mantenha o que o serviço não consegue rodar sem isso. Limite o que está ocioso. Pare o que ninguém usa, e tire o trabalho pessoal da conta compartilhada.",
      links: [
        { href: "https://www.finops.org/", label: "FinOps Foundation" },
        { href: "https://www.tokeneconomics.com/state-of-tokenomics/", label: "State of Tokenomics" },
      ],
      narration:
        "Uma conta paga compartilhada é uma confiança. FinOps atribui cada custo ao serviço que o causa. Limite os runners ociosos. Mantenha a base do livro. Pare o gasto com modelo que ninguém usa. Tire o trabalho pessoal da conta compartilhada.",
      checkPrompt: "Quando o gasto com um modelo se justifica?",
      checkOptions: [
        "Quando a fatura é grande o bastante para parecer séria",
        "Quando os tokens mudam um resultado que uma pessoa de fato usa",
        "Quando o fornecedor diz que o modelo é avançado",
        "Quando a chave é compartilhada para todo mundo poder experimentar",
      ],
      labTitle: "Marque a fatura",
      labScene: [
        "Uma conta compartilhada da Northline, neste mês. Runners de CI, 400 dólares, em grande parte ociosos durante a noite, e as montagens de verdade precisam de uma fração disso. A base do livro, 220 dólares, guarda o registro de pagamentos. Resumos do modelo, 900 dólares, e a página de resumos não tem leitores há um mês. Transcodificação pessoal de vídeo, 300 dólares, feita por uma pessoa na conta compartilhada.",
        "Marque cada linha: manter, limitar ou parar. Rode e leia a fatura que você está prestes a defender. Limitar não tira uma carga pessoal. Manter os resumos sem leitura deixa os 900 dólares no lugar.",
      ],
      labWarn: "Uma carga pessoal ainda está na conta compartilhada, ou os resumos sem leitura ainda estão sendo pagos. A confiança e o resultado são o teste.",
      fields: {
        ci: { prompt: "Runners de CI, 400 dólares, em grande parte ociosos durante a noite.", options: ["Manter", "Limitar", "Parar"] },
        db: { prompt: "Base do livro, 220 dólares, o registro de pagamentos.", options: ["Manter", "Limitar", "Parar"] },
        tokens: { prompt: "Resumos do modelo, 900 dólares, sem leitores há um mês.", options: ["Manter", "Limitar", "Parar"] },
        shared: { prompt: "Transcodificação pessoal de vídeo, 300 dólares, na conta compartilhada.", options: ["Manter", "Limitar", "Parar"] },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-04",
      caseTitle: "A fatura e a confiança",
      caseSituation: [
        "A conta compartilhada dobrou. Metade do novo total é o resumo do modelo que ninguém lê. Outra linha é a transcodificação de vídeo de uma pessoa. Os runners de CI ainda estão no tamanho de um dia cheio que eles não têm. A base do livro não mudou, e é o registro de que o balcão depende.",
        "Quem paga a conta pediu uma nota: o que fica, o que se limita e o que sai. Não está pedindo um modelo novo.",
      ],
      caseTask: "Atribua o custo, julgue o modelo pelo resultado e tire o trabalho pessoal da conta compartilhada.",
      caseSteps: [
        "Nomeie o serviço que causa cada linha antes de mudá-la.",
        "Separe a capacidade ociosa de uma linha que não tem usuário.",
        "Responda as três decisões.",
        "Na nota, diga o que você limita, o que você para e o que você mantém porque o balcão precisa.",
      ],
      decisions: [
        {
          prompt: "O que você faz com os runners de CI ociosos?",
          options: ["Deixa, porque a velocidade deveria parecer de graça", "Limita e atribui os minutos ao serviço de estado", "Passa para um cartão pessoal e esconde a linha"],
        },
        {
          prompt: "O que você faz com os resumos do modelo que ninguém lê?",
          options: ["Compra uma janela de contexto maior", "Para até uma pessoa usar o resultado numa decisão", "Compartilha a chave para que mais gente talvez leia"],
        },
        {
          prompt: "A transcodificação pessoal está na conta compartilhada. O que você faz?",
          options: ["Deixa, porque a pessoa está aprendendo", "Tira, e trata a conta compartilhada como uma confiança", "Renomeia o projeto para a linha parecer de produção"],
        },
      ],
      noteLabel: "Sua nota para quem paga a conta",
      noteHint: "Escreva o que você limita, o que você para e o que você mantém porque o balcão precisa.",
    },
  },
  brief: {
    title: "Lançamento da Northline",
    dek: "Lance a linha de estado uma vez, com um histórico, quatro números e uma fatura que você consegue defender.",
    situation: [
      "Amanhã o balcão de pagamentos vai atualizar /status antes de as caixas abrirem. O arquivo está pronto. Uma chave ativa foi encontrada num commit antigo no main. Na semana passada uma implantação falhou e a restauração foi medida. A conta compartilhada ainda paga runners ociosos e um resumo sem leitores.",
      "Isto é um lançamento, não quatro projetos. A resposta, o histórico, a medição e o gasto precisam concordar.",
    ],
    task: "Escolha a resposta, o histórico, a medição e o gasto deste lançamento.",
    steps: [
      "Decida o que /status envia, inclusive a conexão que o cliente pediu para fechar.",
      "Decida onde a correção vive e o que acontece com uma chave que já vazou.",
      "Decida quais números você vai anotar para este lançamento.",
      "Na nota, diga o que o balcão vê, onde a chave vive agora e qual gasto você para.",
    ],
    decisions: [
      {
        prompt: "O que /status envia?",
        options: ["Um 500 que inclui a chave", "200 com o arquivo de estado, sem a chave, e a conexão fechada", "Nada, e o socket fica aberto"],
      },
      {
        prompt: "Onde a correção cai?",
        options: ["Direto no main, com a chave ainda no histórico", "Num ramo, depois no main com as verificações verdes, e a chave é girada", "Num arquivo zip no chat"],
      },
      {
        prompt: "O que você registra para este lançamento?",
        options: ["Nada, se a demo parecia calma", "Frequência, lead time, taxa de falha e tempo de restauração", "Só que você implanta uma vez por mês"],
      },
      {
        prompt: "O que acontece com a fatura compartilhada?",
        options: ["O gasto fica como está, inclusive os resumos sem leitura", "Limite os runners ociosos e pare os resumos sem leitura", "Compartilhe a conta para a fatura ser problema de todo mundo"],
      },
    ],
    noteLabel: "Sua nota de lançamento",
    noteHint: "Escreva o que /status mostra, onde a chave vive agora e qual gasto você para.",
    narration:
      "O lançamento da Northline envia o arquivo de estado sem a chave, chega ao main só depois que as verificações ficam verdes, registra os quatro números da DORA, limita os runners ociosos e para o gasto com o modelo que ninguém lê.",
    figure: "Um lançamento: uma resposta de estado segura, um main verde, quatro números, e uma fatura com o trabalho ocioso limitado e o trabalho sem leitura parado.",
  },
};
