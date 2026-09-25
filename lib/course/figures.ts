import type { Locale } from "../locale";

const pictures = {
  toolsA: `
        +----------+     +----------+     +----------+
        |    1     |     |    2     |     |    3     |
        +----------+     +----------+     +----------+
              \\               |               /
               \\              |              /
                +-------------+-------------+
                              |
                         +----------+
                         |    4     |
                         +----------+
`,
  toolsB: `
   one laptop                         shared workbench
+------------------+               +------------------+
| one person       |               | anyone trained   |
| the only copy    |               | a history        |
+------------------+               +------------------+
`,
  platformsA: `
   rider          inspector         office
  +------+        +------+        +------+
  | door |        | door |        | door |
  +--+---+        +--+---+        +--+---+
     \\               |              /
      \\              |             /
       +-------------+------------+
                     |
              +--------------+
              | one record   |
              +--------------+
`,
  platformsB: `
  stays the same              changes with the door
  ------------------          ---------------------
  who the person is           screen size
  what they may do            keyboard or touch
  the record                  network, or none
  the promise                 how fast they must act
`,
  designA: `
  twelve fields, one screen          one step at a time
  +------------------------+         +------------------+
  | 1 2 3 4 5 6 7 8 9 ...  |         | one question     |
  | error, form cleared    |         | a way back       |
  +------------------------+         | answers kept     |
                                     +------------------+
`,
  designB: `
  person ---> step ---> step ---> done
                |
                +--> error: what happened, and what to do next
                     the earlier answers stay
`,
  tiersA: `
  +----------------+    +----------------+    +----------------+
  | 1  seen        |    | 2  decides     |    | 3  remembers   |
  | browser        |--->| application    |--->| database       |
  +----------------+    +----------------+    +----------------+
`,
  tiersB: `
  tap "closed"
       |
       v
  browser sends the wish
       |
       v
  application checks permission
       |
       +--> down?  say so. do not invent hours
       |
       v
  database writes the row
       |
       v
  browser shows "saved"
`,
  integrationA: `
  change --> checklist --> second person --> shared line
                |
                +--> red: stop. yesterday's version stays
`,
  integrationB: `
  night before a public morning

  red  [####] blocked
  green [####] may join, after a second person looks
`,
  deploymentA: `
  private try  -->  trial, like the real one  -->  real system
                                                      |
                                                      +--> way back
`,
  deploymentB: `
  whole place at once              one part first
  +----------------------+         +------+  +------+  +------+
  | all wards, no return |         | new  |  | old  |  | old  |
  +----------------------+         +------+  +------+  +------+
        risk                              rehearsed return
`,
  maintainA: `
  one pile                         a map
  +------------------+             +----------+    +----------+
  | letter + payment |             | letter   |    | payment  |
  | change either,   |             +----+-----+    +----+-----+
  | risk both        |                  \\              /
  +------------------+                   +------------+
                                         | one door   |
                                         +------------+
`,
  maintainB: `
  map
  +------------------------------+
  | hours ........ staff         |
  | who may edit . named owner   |
  | payment ...... separate      |
  | night call ... named role    |
  +------------------------------+
`,
  scaleA: `
  people
  Saturday         ####
  festival minute  ##############################

  the bar may grow
  the exact record stays one sale, one charge
`,
  scaleB: `
  crowd --> queue --> exact record
              |
              +--> public hint, a few seconds old
                   not the payment
`,
  observeA: `
  one request     how many        what was written
  +----------+    +----------+    +----------+
  | trace    |    | metric   |    | log      |
  | path     |    | a number |    | a line   |
  +----------+    +----------+    +----------+
`,
  observeB: `
  failed saves
       |
       v
  crossed the line?
       |
       +--> yes: wake the named role, pause releases
       |
       +--> a slow picture: no page
`,
  securityA: `
  sign in                         permission
  +------------------+            +------------------+
  | who are you?     |            | what may you do? |
  +------------------+            +------------------+
           \\                            /
            +------------+-------------+
                         |
              own stall, not the next one
`,
  securityB: `
  three ordinary leaks

  [ shared password ]
  [ private fact in the address ]
  [ backup on a laptop ]

  safer: own login, least access, locked backup
`,
  futuresA: `
  new door, at the edge
  +------------------+
  | speech, or a    |
  | new screen      |
  +--------+---------+
           |
           v
  +------------------+         export
  | the record       |--------------------> you can leave
  +------------------+
`,
  futuresB: `
  keep                 prepare                 refuse
  the record           a tested exit           the only copy
  readable             before you depend       inside a service
                       on the new door         you cannot leave
`,
  brief: `
  tools --> platforms --> design
              |
              v
  rooms --> checklist --> release --> next person
              |
              v
  scale --> sight --> security --> a future you can leave
              |
              v
        Harbor Market brief
`,
  home: `
  01 tools      02 platforms    03 design
  04 rooms      05 checklist    06 release
  07 next person  08 scale      09 sight
  10 security   11 what holds
                |
                v
         one brief, Harbor Market
`,
} as const;

type Pic = keyof typeof pictures;

const caps: Record<Locale, Record<string, { picture: Pic; caption: string }[]>> = {
  en: {
    home: [{ picture: "home", caption: "Eleven sections, then one brief. The later sections use the earlier ones." }],
    tools: [
      { picture: "toolsA", caption: "1 editor, where the change is written. 2 browser, where a person tries it. 3 terminal, where a check runs. 4 history, which keeps every saved change." },
      { picture: "toolsB", caption: "A laptop that only one person can open is a single point of loss. A shared workbench keeps the history with the work." },
    ],
    platforms: [
      { picture: "platformsA", caption: "Three doors can look different. They read and write one record. A second copy of that record will disagree with the first." },
      { picture: "platformsB", caption: "Identity, permission, the record, and the promise stay. The screen, the input, and the network change with the door." },
    ],
    design: [
      { picture: "designA", caption: "Twelve fields on one screen ask for everything before the person has finished one thing. One question at a time keeps the work and offers a way back." },
      { picture: "designB", caption: "An error is part of the path. It names what happened and the next action. Earlier answers stay." },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 is what a person sees. 2 applies the rules. 3 remembers. A rule that lives only in 1 can be changed by the person looking at the screen." },
      { picture: "tiersB", caption: "Follow one tap. If the deciding room is down, say so. Do not invent a saved result." },
    ],
    integration: [
      { picture: "integrationA", caption: "A change meets the checklist, then a second person, and only then the shared line. Red stops it." },
      { picture: "integrationB", caption: "On the night before a public morning, red keeps yesterday's working version in place." },
    ],
    deployment: [
      { picture: "deploymentA", caption: "There is a private place to try the change, a trial that resembles the real system, and the real system. The real system has a way back." },
      { picture: "deploymentB", caption: "One part first, with the rest unchanged, is easier to return from than a change to the whole place at once." },
    ],
    maintain: [
      { picture: "maintainA", caption: "When the letter and the payment share one pile, a wording change can break the payment. A door between them lets one change without the other." },
      { picture: "maintainB", caption: "A written map names the piece, the owner, and who is called at night." },
    ],
    scale: [
      { picture: "scaleA", caption: "The crowd can grow by a large factor. The promise does not: one sale, one charge." },
      { picture: "scaleB", caption: "A queue protects the exact record. A public hint may be a few seconds old. The payment is not cached." },
    ],
    observe: [
      { picture: "observeA", caption: "A trace is the path of one request. A metric is a count over time. A log is a line written at the time." },
      { picture: "observeB", caption: "An alert names the action and the person. A slow picture does not use the same alert as a failed save." },
    ],
    security: [
      { picture: "securityA", caption: "Signing in answers who you are. Permission answers what you may do. One does not grant the other." },
      { picture: "securityB", caption: "Shared passwords, private facts in the address, and backups on personal laptops are ordinary leaks. Own logins, smaller access, and a locked backup close them." },
    ],
    futures: [
      { picture: "futuresA", caption: "A new door can sit in front. The record stays where you can export it. If the door closes, the record remains." },
      { picture: "futuresB", caption: "Keep the record. Prepare an exit before you depend on the new door. Refuse a design where the only copy sits in a service you cannot leave." },
    ],
    brief: [{ picture: "brief", caption: "The brief is the same market, with every promise on one page: tools, doors, design, rooms, checks, release, the next person, scale, sight, security, and an exit." }],
  },
  es: {
    home: [{ picture: "home", caption: "Once secciones y luego un informe. Las últimas usan las primeras." }],
    tools: [
      { picture: "toolsA", caption: "1 editor, donde se escribe el cambio. 2 navegador, donde una persona lo prueba. 3 terminal, donde corre una comprobación. 4 historial, que guarda cada cambio." },
      { picture: "toolsB", caption: "Un portátil que solo abre una persona es un único punto de pérdida. Un banco compartido guarda el historial con el trabajo." },
    ],
    platforms: [
      { picture: "platformsA", caption: "Tres puertas pueden verse distintas. Leen y escriben un solo registro. Una segunda copia acabará en desacuerdo." },
      { picture: "platformsB", caption: "Identidad, permiso, registro y promesa se quedan. La pantalla, la entrada y la red cambian con la puerta." },
    ],
    design: [
      { picture: "designA", caption: "Doce campos en una pantalla piden todo antes de terminar una cosa. Una pregunta cada vez conserva el trabajo y deja volver atrás." },
      { picture: "designB", caption: "El error forma parte del camino. Dice qué pasó y qué hacer después. Las respuestas anteriores se quedan." },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 es lo que ve una persona. 2 aplica las reglas. 3 recuerda. Una regla que solo vive en 1 la puede cambiar quien mira la pantalla." },
      { picture: "tiersB", caption: "Sigue un toque. Si la sala que decide está caída, dilo. No inventes un resultado guardado." },
    ],
    integration: [
      { picture: "integrationA", caption: "El cambio pasa por la lista, luego por una segunda persona, y solo entonces llega a la línea compartida. El rojo lo detiene." },
      { picture: "integrationB", caption: "La noche antes de una mañana pública, el rojo deja en su sitio la versión de ayer que funcionaba." },
    ],
    deployment: [
      { picture: "deploymentA", caption: "Hay un lugar privado para probar, un ensayo parecido al sistema real, y el sistema real. El sistema real tiene camino de vuelta." },
      { picture: "deploymentB", caption: "Una parte primero, con el resto igual, se deshace con más calma que un cambio de todo a la vez." },
    ],
    maintain: [
      { picture: "maintainA", caption: "Si la carta y el pago comparten un montón, cambiar las palabras puede romper el pago. Una puerta entre ambos deja cambiar uno sin el otro." },
      { picture: "maintainB", caption: "Un mapa escrito nombra la pieza, el dueño y a quién se llama de noche." },
    ],
    scale: [
      { picture: "scaleA", caption: "La multitud puede crecer mucho. La promesa no: una venta, un cobro." },
      { picture: "scaleB", caption: "Una cola protege el registro exacto. Una pista pública puede tener unos segundos. El pago no se guarda en caché." },
    ],
    observe: [
      { picture: "observeA", caption: "Un rastro es el camino de una petición. Una métrica es un recuento en el tiempo. Un registro es una línea escrita en ese momento." },
      { picture: "observeB", caption: "Una alerta nombra la acción y la persona. Una imagen lenta no usa la misma alerta que un guardado fallido." },
    ],
    security: [
      { picture: "securityA", caption: "Entrar responde quién eres. El permiso responde qué puedes hacer. Uno no concede el otro." },
      { picture: "securityB", caption: "Contraseñas compartidas, datos privados en la dirección y copias en portátiles son fugas habituales. Accesos propios, menos permiso y una copia cerrada las cierran." },
    ],
    futures: [
      { picture: "futuresA", caption: "Una puerta nueva puede ponerse delante. El registro se queda donde puedes exportarlo. Si la puerta se cierra, el registro sigue." },
      { picture: "futuresB", caption: "Conserva el registro. Prepara una salida antes de depender de la puerta nueva. Rechaza un diseño cuya única copia vive en un servicio del que no puedes salir." },
    ],
    brief: [{ picture: "brief", caption: "El informe es el mismo mercado, con cada promesa en una página: herramientas, puertas, diseño, salas, lista, publicación, la persona siguiente, escala, vista, seguridad y una salida." }],
  },
  fr: {
    home: [{ picture: "home", caption: "Onze sections, puis une note. Les suivantes s'appuient sur les premières." }],
    tools: [
      { picture: "toolsA", caption: "1 éditeur, où le changement s'écrit. 2 navigateur, où une personne l'essaie. 3 terminal, où une vérification tourne. 4 historique, qui garde chaque changement." },
      { picture: "toolsB", caption: "Un ordinateur qu'une seule personne peut ouvrir est un seul point de perte. Un établi partagé garde l'historique avec le travail." },
    ],
    platforms: [
      { picture: "platformsA", caption: "Trois portes peuvent avoir un aspect différent. Elles lisent et écrivent un seul enregistrement. Une seconde copie finira par contredire la première." },
      { picture: "platformsB", caption: "L'identité, la permission, l'enregistrement et la promesse restent. L'écran, la saisie et le réseau changent avec la porte." },
    ],
    design: [
      { picture: "designA", caption: "Douze champs sur un écran demandent tout avant qu'une chose soit finie. Une question à la fois garde le travail et laisse revenir en arrière." },
      { picture: "designB", caption: "Une erreur fait partie du chemin. Elle dit ce qui s'est passé et l'action suivante. Les réponses déjà données restent." },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 est ce qu'une personne voit. 2 applique les règles. 3 se souvient. Une règle qui ne vit qu'en 1 peut être changée par la personne devant l'écran." },
      { picture: "tiersB", caption: "Suivez un geste. Si la salle qui décide est arrêtée, dites-le. N'inventez pas un enregistrement réussi." },
    ],
    integration: [
      { picture: "integrationA", caption: "Le changement rencontre la liste, puis une deuxième personne, et alors seulement la ligne partagée. Le rouge l'arrête." },
      { picture: "integrationB", caption: "La nuit avant un matin public, le rouge laisse en place la version d'hier qui fonctionnait." },
    ],
    deployment: [
      { picture: "deploymentA", caption: "Il y a un lieu privé pour essayer, un essai qui ressemble au système réel, et le système réel. Le système réel a un retour." },
      { picture: "deploymentB", caption: "Une partie d'abord, le reste inchangé, se reprend plus nettement qu'un changement de tout l'ensemble d'un coup." },
    ],
    maintain: [
      { picture: "maintainA", caption: "Quand la lettre et le paiement partagent un tas, changer les mots peut casser le paiement. Une porte entre les deux permet de changer l'un sans l'autre." },
      { picture: "maintainB", caption: "Une carte écrite nomme la pièce, le responsable, et qui est appelé la nuit." },
    ],
    scale: [
      { picture: "scaleA", caption: "La foule peut grandir fortement. La promesse, non : une vente, un encaissement." },
      { picture: "scaleB", caption: "Une file protège l'enregistrement exact. Un indice public peut avoir quelques secondes. Le paiement n'est pas mis en cache." },
    ],
    observe: [
      { picture: "observeA", caption: "Une trace est le chemin d'une demande. Une mesure est un compte dans le temps. Un journal est une ligne écrite à ce moment." },
      { picture: "observeB", caption: "Une alerte nomme l'action et la personne. Une image lente n'utilise pas la même alerte qu'un enregistrement raté." },
    ],
    security: [
      { picture: "securityA", caption: "Entrer répond à qui vous êtes. La permission répond à ce que vous pouvez faire. L'un ne donne pas l'autre." },
      { picture: "securityB", caption: "Mots de passe partagés, fait privé dans l'adresse, copie sur un ordinateur personnel : des fuites ordinaires. Un accès propre, un droit plus petit, une copie verrouillée les ferment." },
    ],
    futures: [
      { picture: "futuresA", caption: "Une porte nouvelle peut se placer devant. L'enregistrement reste là où vous pouvez l'exporter. Si la porte se ferme, l'enregistrement demeure." },
      { picture: "futuresB", caption: "Gardez l'enregistrement. Préparez une sortie avant de dépendre de la nouvelle porte. Refusez un dessin dont la seule copie vit dans un service que vous ne pouvez pas quitter." },
    ],
    brief: [{ picture: "brief", caption: "La note est le même marché, avec chaque promesse sur une page : outils, portes, dessin, salles, liste, mise en service, la personne suivante, échelle, vue, sécurité, et une sortie." }],
  },
  de: {
    home: [{ picture: "home", caption: "Elf Abschnitte, dann eine Notiz. Die späteren bauen auf den früheren auf." }],
    tools: [
      { picture: "toolsA", caption: "1 Editor, wo die Änderung geschrieben wird. 2 Browser, wo eine Person sie ausprobiert. 3 Terminal, wo eine Prüfung läuft. 4 Verlauf, der jede gespeicherte Änderung behält." },
      { picture: "toolsB", caption: "Ein Laptop, den nur eine Person öffnen kann, ist ein einzelner Verlustpunkt. Eine gemeinsame Werkbank behält den Verlauf bei der Arbeit." },
    ],
    platforms: [
      { picture: "platformsA", caption: "Drei Türen können verschieden aussehen. Sie lesen und schreiben einen Datensatz. Eine zweite Kopie wird der ersten widersprechen." },
      { picture: "platformsB", caption: "Identität, Recht, Datensatz und Versprechen bleiben. Bildschirm, Eingabe und Netz ändern sich mit der Tür." },
    ],
    design: [
      { picture: "designA", caption: "Zwölf Felder auf einem Bildschirm verlangen alles, bevor eine Sache fertig ist. Eine Frage nach der anderen behält die Arbeit und lässt einen Rückweg." },
      { picture: "designB", caption: "Ein Fehler gehört zum Weg. Er nennt, was geschah, und die nächste Handlung. Frühere Antworten bleiben." },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 ist, was eine Person sieht. 2 wendet die Regeln an. 3 merkt sich. Eine Regel, die nur in 1 lebt, kann die Person am Bildschirm ändern." },
      { picture: "tiersB", caption: "Folgen Sie einem Tipp. Wenn der Raum, der entscheidet, ausfällt, sagen Sie das. Erfinden Sie kein gespeichertes Ergebnis." },
    ],
    integration: [
      { picture: "integrationA", caption: "Eine Änderung trifft die Prüfliste, dann eine zweite Person, und erst dann die gemeinsame Linie. Rot hält sie an." },
      { picture: "integrationB", caption: "In der Nacht vor einem öffentlichen Morgen lässt Rot die gestrige funktionierende Fassung an ihrem Platz." },
    ],
    deployment: [
      { picture: "deploymentA", caption: "Es gibt einen privaten Ort zum Probieren, eine Probe, die dem echten System ähnelt, und das echte System. Das echte System hat einen Rückweg." },
      { picture: "deploymentB", caption: "Ein Teil zuerst, der Rest unverändert, lässt sich klarer zurücknehmen als eine Änderung am ganzen Ort auf einmal." },
    ],
    maintain: [
      { picture: "maintainA", caption: "Wenn Brief und Zahlung in einem Haufen liegen, kann eine Wortänderung die Zahlung beschädigen. Eine Tür dazwischen lässt eines ändern, ohne das andere." },
      { picture: "maintainB", caption: "Eine geschriebene Karte nennt das Stück, die zuständige Person und wen man nachts anruft." },
    ],
    scale: [
      { picture: "scaleA", caption: "Die Menge kann stark wachsen. Das Versprechen nicht: ein Verkauf, eine Belastung." },
      { picture: "scaleB", caption: "Eine Warteschlange schützt den genauen Datensatz. Ein öffentlicher Hinweis darf ein paar Sekunden alt sein. Die Zahlung wird nicht zwischengespeichert." },
    ],
    observe: [
      { picture: "observeA", caption: "Eine Spur ist der Weg einer Anfrage. Eine Kennzahl ist eine Zählung über die Zeit. Ein Protokoll ist eine Zeile aus diesem Moment." },
      { picture: "observeB", caption: "Ein Alarm nennt die Handlung und die Person. Ein langsames Bild benutzt nicht denselben Alarm wie ein fehlgeschlagenes Speichern." },
    ],
    security: [
      { picture: "securityA", caption: "Die Anmeldung beantwortet, wer Sie sind. Die Berechtigung beantwortet, was Sie tun dürfen. Das eine gibt das andere nicht." },
      { picture: "securityB", caption: "Gemeinsame Passwörter, private Angaben in der Adresse und Sicherungen auf privaten Laptops sind gewöhnliche Lecks. Eigene Anmeldung, kleineres Recht und eine verschlossene Sicherung schließen sie." },
    ],
    futures: [
      { picture: "futuresA", caption: "Eine neue Tür kann davor stehen. Der Datensatz bleibt dort, wo Sie ihn exportieren können. Schließt sich die Tür, bleibt der Datensatz." },
      { picture: "futuresB", caption: "Behalten Sie den Datensatz. Bereiten Sie einen Ausgang vor, bevor Sie von der neuen Tür abhängen. Lehnen Sie einen Entwurf ab, dessen einzige Kopie in einem Dienst liegt, den Sie nicht verlassen können." },
    ],
    brief: [{ picture: "brief", caption: "Die Notiz ist derselbe Markt, mit jedem Versprechen auf einer Seite: Werkzeuge, Türen, Gestaltung, Räume, Prüfliste, Veröffentlichung, die nächste Person, Größe, Sicht, Sicherheit und ein Ausgang." }],
  },
  pt: {
    home: [{ picture: "home", caption: "Onze seções e depois um parecer. As últimas usam as primeiras." }],
    tools: [
      { picture: "toolsA", caption: "1 editor, onde a mudança é escrita. 2 navegador, onde uma pessoa experimenta. 3 terminal, onde uma verificação roda. 4 histórico, que guarda cada mudança salva." },
      { picture: "toolsB", caption: "Um notebook que só uma pessoa abre é um único ponto de perda. Uma bancada compartilhada guarda o histórico com o trabalho." },
    ],
    platforms: [
      { picture: "platformsA", caption: "Três portas podem parecer diferentes. Elas leem e escrevem um registro. Uma segunda cópia vai discordar da primeira." },
      { picture: "platformsB", caption: "Identidade, permissão, registro e promessa ficam. A tela, a entrada e a rede mudam com a porta." },
    ],
    design: [
      { picture: "designA", caption: "Doze campos numa tela pedem tudo antes de uma coisa terminar. Uma pergunta de cada vez guarda o trabalho e deixa voltar." },
      { picture: "designB", caption: "Um erro faz parte do caminho. Ele diz o que aconteceu e a próxima ação. As respostas anteriores ficam." },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 é o que uma pessoa vê. 2 aplica as regras. 3 lembra. Uma regra que só vive em 1 pode ser mudada por quem olha a tela." },
      { picture: "tiersB", caption: "Siga um toque. Se a sala que decide estiver fora, diga isso. Não invente um resultado salvo." },
    ],
    integration: [
      { picture: "integrationA", caption: "A mudança encontra a lista, depois uma segunda pessoa, e só então a linha compartilhada. Vermelho a para." },
      { picture: "integrationB", caption: "Na noite antes de uma manhã pública, vermelho deixa no lugar a versão de ontem que funcionava." },
    ],
    deployment: [
      { picture: "deploymentA", caption: "Há um lugar privado para experimentar, um ensaio parecido com o sistema real, e o sistema real. O sistema real tem um caminho de volta." },
      { picture: "deploymentB", caption: "Uma parte primeiro, com o resto igual, volta com mais clareza do que uma mudança no lugar inteiro de uma vez." },
    ],
    maintain: [
      { picture: "maintainA", caption: "Quando a carta e o pagamento dividem uma pilha, mudar as palavras pode quebrar o pagamento. Uma porta entre eles deixa mudar um sem o outro." },
      { picture: "maintainB", caption: "Um mapa escrito nomeia a peça, o responsável e quem é chamado à noite." },
    ],
    scale: [
      { picture: "scaleA", caption: "A multidão pode crescer muito. A promessa não: uma venda, uma cobrança." },
      { picture: "scaleB", caption: "Uma fila protege o registro exato. Uma pista pública pode ter alguns segundos. O pagamento não entra em cache." },
    ],
    observe: [
      { picture: "observeA", caption: "Um rastro é o caminho de um pedido. Uma métrica é uma contagem no tempo. Um registro é uma linha escrita naquele momento." },
      { picture: "observeB", caption: "Um alerta nomeia a ação e a pessoa. Uma imagem lenta não usa o mesmo alerta de um salvamento que falhou." },
    ],
    security: [
      { picture: "securityA", caption: "Entrar responde quem você é. A permissão responde o que você pode fazer. Uma coisa não concede a outra." },
      { picture: "securityB", caption: "Senha compartilhada, fato privado no endereço e cópia num notebook são vazamentos comuns. Acesso próprio, permissão menor e cópia trancada fecham esses caminhos." },
    ],
    futures: [
      { picture: "futuresA", caption: "Uma porta nova pode ficar na frente. O registro fica onde você pode exportá-lo. Se a porta fechar, o registro continua." },
      { picture: "futuresB", caption: "Guarde o registro. Prepare uma saída antes de depender da porta nova. Recuse um desenho cuja única cópia vive num serviço do qual você não pode sair." },
    ],
    brief: [{ picture: "brief", caption: "O parecer é o mesmo mercado, com cada promessa numa página: ferramentas, portas, desenho, salas, lista, publicação, a próxima pessoa, escala, visão, segurança e uma saída." }],
  },
  zh: {
    home: [{ picture: "home", caption: "十一节，然后一份简报。后面的节用到前面的节。" }],
    tools: [
      { picture: "toolsA", caption: "1 是编辑器，改动写在这里。2 是浏览器，人在这里试用。3 是终端，检查在这里跑。4 是变更历史，记住每一次保存。" },
      { picture: "toolsB", caption: "只有一个人能打开的笔记本电脑，是单一的丢失点。共享工作台把历史和工作放在一起。" },
    ],
    platforms: [
      { picture: "platformsA", caption: "三扇门可以长得不一样。它们读写同一份记录。第二份拷贝会和第一份不一致。" },
      { picture: "platformsB", caption: "身份、权限、记录和承诺留着。屏幕、输入方式和网络随门而变。" },
    ],
    design: [
      { picture: "designA", caption: "一屏十二个字段，在一件事做完之前就要全部答案。一次一个问题，工作还在，也能退回。" },
      { picture: "designB", caption: "错误是路径的一部分。它说明发生了什么、下一步做什么。已经填过的答案留着。" },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 是人看见的。2 执行规则。3 记住。只活在 1 里的规则，看屏幕的人可以改掉。" },
      { picture: "tiersB", caption: "跟着一次点击走。做决定的房间停了，就说停了。不要编造一个已保存的结果。" },
    ],
    integration: [
      { picture: "integrationA", caption: "改动先过检查清单，再过第二个人，然后才进入共享的线。红色把它停住。" },
      { picture: "integrationB", caption: "公开的早晨之前的夜里，红色让昨天还能用的版本留在原处。" },
    ],
    deployment: [
      { picture: "deploymentA", caption: "有一个私下试的地方，一个像真实系统的试运行，然后是真实系统。真实系统有退路。" },
      { picture: "deploymentB", caption: "先改一部分，其余不动，比一次改掉全部更容易退回。" },
    ],
    maintain: [
      { picture: "maintainA", caption: "感谢信和付款堆在一起时，改措辞可能弄坏付款。中间有一扇门，就可以改一个而不动另一个。" },
      { picture: "maintainB", caption: "写下来的地图标明这一块、负责人，以及夜里打给谁。" },
    ],
    scale: [
      { picture: "scaleA", caption: "人群可以长很多。承诺不长：一次销售，一次收费。" },
      { picture: "scaleB", caption: "队列保护精确的记录。公开提示可以旧几秒。付款不放进缓存。" },
    ],
    observe: [
      { picture: "observeA", caption: "追踪是一次请求的路径。指标是一段时间里的计数。日志是当时写下的一行。" },
      { picture: "observeB", caption: "警报写出动作和人。一张慢图片不用和一次失败的保存同一条警报。" },
    ],
    security: [
      { picture: "securityA", caption: "登录回答你是谁。权限回答你可以做什么。前者不自动给出后者。" },
      { picture: "securityB", caption: "共用密码、地址栏里的私人事实、笔记本电脑上的备份，是常见的泄漏。各自登录、更小的权限、锁住的备份，把它们关上。" },
    ],
    futures: [
      { picture: "futuresA", caption: "新的门可以放在前面。记录留在你能导出的地方。门关了，记录还在。" },
      { picture: "futuresB", caption: "留下记录。在依赖新门之前准备好出口。拒绝唯一副本放在一个你离不开的服务里。" },
    ],
    brief: [{ picture: "brief", caption: "简报是同一个市场，每一项承诺都在一页上：工具、门、设计、房间、检查、发布、下一个人、规模、看见、安全和一条出口。" }],
  },
  ja: {
    home: [{ picture: "home", caption: "十一の節、それから一通の報告書。後の節は前の節を使います。" }],
    tools: [
      { picture: "toolsA", caption: "1 はエディタ。変更を書く場所です。2 はブラウザ。人が試す場所です。3 はターミナル。確認が走る場所です。4 は履歴。保存した変更を残します。" },
      { picture: "toolsB", caption: "一人だけが開けるノートパソコンは、失う点が一つです。共有の作業台は、履歴を仕事と一緒に残します。" },
    ],
    platforms: [
      { picture: "platformsA", caption: "三つの扉は見た目が違ってよい。読む記録と書く記録は一つです。二つ目のコピーは、一つ目と食い違います。" },
      { picture: "platformsB", caption: "誰か、何ができるか、記録、約束は残ります。画面、入力、ネットワークは扉とともに変わります。" },
    ],
    design: [
      { picture: "designA", caption: "一画面に十二の欄があると、一つのことが終わる前に全部を求めます。一つずつ聞くと、仕事は残り、戻れます。" },
      { picture: "designB", caption: "誤りは道の一部です。何が起きたか、次に何をするかを言います。それまでの答えは残ります。" },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 は人が見るもの。2 は規則を適用します。3 は覚えます。1 にしかない規則は、画面を見ている人が変えられます。" },
      { picture: "tiersB", caption: "一つのタップを追います。決める部屋が止まっていたら、そう言います。保存できた結果を作りません。" },
    ],
    integration: [
      { picture: "integrationA", caption: "変更は確認リストに会い、次に二人目の人に会い、その後で共有の線に入ります。赤は止めます。" },
      { picture: "integrationB", caption: "公開の朝の前の夜、赤は昨日動いていた版をそのままにします。" },
    ],
    deployment: [
      { picture: "deploymentA", caption: "試す私的な場所、本物に似た試し、そして本物のシステムがあります。本物には戻り道があります。" },
      { picture: "deploymentB", caption: "一部を先に、残りはそのまま。全体を一度に変えるより、戻せます。" },
    ],
    maintain: [
      { picture: "maintainA", caption: "手紙と支払いが一つの山だと、言葉の変更が支払いを壊すことがあります。間に扉があれば、一方を他方なしに変えられます。" },
      { picture: "maintainB", caption: "書いた地図は、部分と担当と、夜に誰を呼ぶかを名づけます。" },
    ],
    scale: [
      { picture: "scaleA", caption: "人の数は大きく伸びることがあります。約束は伸びません。一つの販売、一つの請求です。" },
      { picture: "scaleB", caption: "待ち行列が正確な記録を守ります。公開のヒントは数秒古くてよい。支払いはキャッシュしません。" },
    ],
    observe: [
      { picture: "observeA", caption: "トレースは一つの要求の道です。メトリクスは時間の中の数です。ログはそのとき書かれた一行です。" },
      { picture: "observeB", caption: "警報は行動と人を名づけます。遅い画像は、失敗した保存と同じ警報を使いません。" },
    ],
    security: [
      { picture: "securityA", caption: "入ることは、誰であるかに答えます。許可は、何をしてよいかに答えます。前者は後者を与えません。" },
      { picture: "securityB", caption: "共有のパスワード、住所欄の私的な事実、個人のノートパソコンの控えは、普通の漏れです。各自の入口、小さい許可、鍵のかかった控えが閉じます。" },
    ],
    futures: [
      { picture: "futuresA", caption: "新しい扉は前に置けます。記録は書き出せる場所に残します。扉が閉じても、記録は残ります。" },
      { picture: "futuresB", caption: "記録を残す。新しい扉に頼る前に出口を用意する。唯一のコピーが、離れられないサービスの中にある形は拒む。" },
    ],
    brief: [{ picture: "brief", caption: "報告書は同じ市場です。道具、扉、設計、部屋、確認、公開、次の人、規模、見え方、安全、出口が一つのページにあります。" }],
  },
  ar: {
    home: [{ picture: "home", caption: "أحد عشر قسما، ثم مذكرة واحدة. الأقسام اللاحقة تستخدم السابقة." }],
    tools: [
      { picture: "toolsA", caption: "1 المحرر، حيث يُكتب التغيير. 2 المتصفح، حيث يجربه شخص. 3 الطرفية، حيث يجري الفحص. 4 السجل، الذي يبقي كل تغيير محفوظ." },
      { picture: "toolsB", caption: "حاسوب لا يفتحه إلا شخص واحد نقطة فقدان واحدة. المنضدة المشتركة تبقي السجل مع العمل." },
    ],
    platforms: [
      { picture: "platformsA", caption: "ثلاثة أبواب قد تختلف في الشكل. تقرأ وتكتب سجلا واحدا. نسخة ثانية ستخالف الأولى." },
      { picture: "platformsB", caption: "الهوية والإذن والسجل والوعد تبقى. الشاشة والإدخال والشبكة تتغير مع الباب." },
    ],
    design: [
      { picture: "designA", caption: "اثنا عشر حقلا في شاشة واحدة تطلب كل شيء قبل أن تنتهي مهمة واحدة. سؤال واحد في كل مرة يبقي العمل ويترك طريق رجوع." },
      { picture: "designB", caption: "الخطأ جزء من الطريق. يسمي ما حدث والفعل التالي. الإجابات السابقة تبقى." },
    ],
    tiers: [
      { picture: "tiersA", caption: "1 ما يراه الشخص. 2 يطبق القواعد. 3 يتذكر. قاعدة تعيش في 1 فقط يستطيع من أمام الشاشة تغييرها." },
      { picture: "tiersB", caption: "تتبّع لمسة واحدة. إن سقطت الغرفة التي تقرر، قل ذلك. لا تخترع نتيجة محفوظة." },
    ],
    integration: [
      { picture: "integrationA", caption: "التغيير يلتقي القائمة، ثم شخصا ثانيا، وعندئذ فقط الخط المشترك. الأحمر يوقفه." },
      { picture: "integrationB", caption: "في الليلة قبل صباح عام، الأحمر يبقي نسخة الأمس العاملة في مكانها." },
    ],
    deployment: [
      { picture: "deploymentA", caption: "مكان خاص للتجربة، وتجربة تشبه النظام الحقيقي، ثم النظام الحقيقي. للنظام الحقيقي طريق رجوع." },
      { picture: "deploymentB", caption: "جزء أولا والباقي كما هو، أسهل في الرجوع من تغيير المكان كله دفعة واحدة." },
    ],
    maintain: [
      { picture: "maintainA", caption: "حين تشارك الرسالة والدفع كومة واحدة، تغيير الكلام قد يكسر الدفع. باب بينهما يتيح تغيير أحدهما دون الآخر." },
      { picture: "maintainB", caption: "خريطة مكتوبة تسمي القطعة والمسؤول ومن يُتصل به ليلا." },
    ],
    scale: [
      { picture: "scaleA", caption: "الزحام قد يكبر كثيرا. الوعد لا يكبر: بيع واحد، وتحصيل واحد." },
      { picture: "scaleB", caption: "الطابور يحمي السجل الدقيق. تلميح عام قد يتأخر ثواني. الدفع لا يُخزَّن مؤقتا." },
    ],
    observe: [
      { picture: "observeA", caption: "الأثر طريق طلب واحد. الرقم عدّ عبر الزمن. السجل سطر كُتب في تلك اللحظة." },
      { picture: "observeB", caption: "التنبيه يسمي الفعل والشخص. الصورة البطيئة لا تستخدم تنبيه الحفظ الفاشل." },
    ],
    security: [
      { picture: "securityA", caption: "الدخول يجيب من أنت. الإذن يجيب ماذا يجوز لك. أحدهما لا يمنح الآخر." },
      { picture: "securityB", caption: "كلمة سر مشتركة، وحقيقة خاصة في العنوان، ونسخة على حاسوب شخصي، تسربات معتادة. دخول خاص، وإذن أصغر، ونسخة مقفلة تغلقها." },
    ],
    futures: [
      { picture: "futuresA", caption: "باب جديد يمكن أن يقف في الأمام. السجل يبقى حيث تستطيع تصديره. إن أُغلق الباب، يبقى السجل." },
      { picture: "futuresB", caption: "أبقِ السجل. جهّز مخرجا قبل أن تعتمد على الباب الجديد. ارفض تصميما نسخته الوحيدة داخل خدمة لا تستطيع مغادرتها." },
    ],
    brief: [{ picture: "brief", caption: "المذكرة هي السوق نفسه، وكل وعد في صفحة: الأدوات، والأبواب، والتصميم، والغرف، والقائمة، والنشر، والشخص التالي، والحجم، والرؤية، والأمن، ومخرج." }],
  },
};

export function lessonFigures(locale: Locale, id: string): { caption: string; picture: string }[] {
  const pack = caps[locale][id] ?? caps.en[id] ?? [];
  return pack.map((item) => ({ caption: item.caption, picture: pictures[item.picture] }));
}
