import type { OpsPack } from "./types";

export const fr: OpsPack = {
  sections: {
    web: {
      title: "Le web et internet",
      promise: "Distinguer le réseau des documents qu'il transporte, et suivre une requête jusqu'à la réponse du serveur.",
      objectives: [
        "Séparer le web d'internet en une phrase.",
        "Nommer IP, TCP et HTTP par le travail que chacun fait.",
        "Suivre une requête depuis le port ouvert jusqu'à la réponse, et en tenir les secrets à l'écart.",
      ],
      start: [
        "Internet est le réseau d'ordinateurs. Le web, ce sont les documents, le son et la vidéo que ces ordinateurs échangent. Tim Berners-Lee a tracé cette ligne : sur internet, on trouve des ordinateurs ; sur le web, on trouve des œuvres. Une page peut échouer alors que les câbles vont bien, et les câbles peuvent échouer alors que la page est encore un fichier sur un disque.",
        "Un paquet, c'est un morceau de ce travail plus un en-tête, pour que la machine d'en face sache à quoi sert le morceau. Le message est découpé en paquets, les paquets voyagent sous forme de bits, et les routeurs et les commutateurs les acheminent. À l'autre bout, on les remet dans l'ordre. Si l'en-tête et les données ne s'accordent pas, le destinataire ne peut rien afficher sans risque.",
      ],
      how: [
        "Trois accords font presque tout le transport. IP déplace les paquets d'un réseau à un autre. TCP vérifie qu'ils sont arrivés et les rassemble en une connexion. HTTP est l'accord d'une requête web : une méthode, un chemin, des en-têtes, puis un statut, des en-têtes et un corps.",
        "Un client demande. Un serveur écoute sur un port. Le serveur accepte la connexion TCP, lit la méthode, le chemin et les en-têtes, et vérifie que la méthode est permise et que le chemin est connu. Un fichier est lu sur le disque. Une page construite à partir d'un enregistrement est remise à l'application. Un appel d'API exécute le code qui lit ou modifie des données. La réponse porte un statut comme 200, 404 ou 500, les en-têtes et le corps. Avant l'envoi, le serveur vérifie qu'aucun secret n'est dans ce corps, et qu'une redirection est utilisée quand elle est exigée. La réponse repart alors sur la même connexion, en paquets. Un HTTP plus ancien, ou un client qui le demande, ferme la connexion. Sinon, elle peut rester ouverte, pour que la requête suivante saute la poignée de main.",
      ],
      expert: [
        "La machine dans l'armoire est du matériel, assez petit pour tenir dans un boîtier : un serveur lame ou une tour, avec un processeur, de la mémoire, du stockage et des ports réseau. Une ferme de serveurs est un bâtiment qui en est plein. Le serveur que vous configurez est un logiciel qui utilise ce matériel. On dit serveur pour les deux. Quand une page de statut échoue, il vous faut encore savoir duquel vous parlez : le matériel, ou le logiciel.",
        "Northline Payments tient, pour le personnel qui n'est pas ingénieur, une ligne de statut publique : ouvert ou retenu. La ligne est un fichier. La clé du grand livre reste dans l'environnement de l'application. Un 500 qui affiche la clé n'est pas une panne d'internet. C'est une réponse qui a raté sa dernière vérification.",
      ],
      figure: "Une requête circule en paquets sur internet, puis devient une réponse HTTP sur le serveur.",
      links: [],
      narration:
        "Internet est le réseau d'ordinateurs. Le web, ce sont les documents que ces ordinateurs échangent. Un paquet porte un morceau du travail et un en-tête. IP déplace les paquets, TCP vérifie la connexion, et HTTP porte la requête et la réponse. Le serveur écoute, accepte, lit, valide, répond, puis ferme ou garde la connexion. La clé du grand livre ne figure pas sur la page de statut.",
      checkPrompt: "Quelle phrase correspond à la différence entre le web et internet ?",
      checkOptions: [
        "Le web, ce sont les câbles entre les bâtiments",
        "Le web, ce sont les documents et les médias ; internet est le réseau qui déplace les paquets",
        "Ce sont deux noms pour la même chose",
        "Le web n'est que la fenêtre du navigateur",
      ],
      labTitle: "Lancer une requête de statut",
      labScene: [
        "Le service de statut de Northline écoute. La requête sur le câble est GET /status HTTP/1.0, host status.northline.example, Connection: close. Le fichier /status contient la ligne Northline payments: open. L'environnement détient LEDGER_KEY. Cette clé ne fait pas partie du fichier.",
        "Mettez le travail du serveur dans l'ordre où il se passe vraiment. Puis choisissez le statut, le corps, et ce qu'il advient de la connexion. Lancez avant d'enregistrer. Le panneau montre la réponse que vos choix enverraient.",
      ],
      labWarn: "Cette réponse porte LEDGER_KEY, ou c'est un 500. Le fichier de statut existe. La clé reste dans l'environnement.",
      fields: {
        path: {
          prompt: "Mettez le travail du serveur dans l'ordre.",
          options: [
            "Écouter sur le port",
            "Accepter la connexion TCP",
            "Lire la méthode, le chemin et les en-têtes",
            "Vérifier la méthode et le chemin",
            "Construire le statut, les en-têtes et le corps",
            "Envoyer la réponse, puis fermer cette connexion",
          ],
        },
        status: { prompt: "Quel statut convient à cette requête ?", options: ["200 OK", "404 Not Found", "500 Internal Server Error"] },
        body: { prompt: "Quel corps est envoyé ?", options: ["Le fichier de statut", "LEDGER_KEY de l'environnement", "Un corps vide"] },
        connection: {
          prompt: "Le client a demandé Connection: close en HTTP/1.0. Que fait le serveur après la réponse ?",
          options: ["Fermer la connexion", "La garder ouverte pour d'autres requêtes"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-01",
      caseTitle: "La page de statut et la clé",
      caseSituation: [
        "À 08:10, la page de statut a affiché un 500 et le texte de LEDGER_KEY. L'ingénieur de nuit a dit qu'internet était en panne. Les graphiques du réseau étaient calmes. Le fichier /status était toujours la ligne Northline payments: open.",
        "Le personnel du comptoir des paiements actualise cette page avant d'ouvrir les caisses. Ce ne sont pas des ingénieurs. Il leur faut une ligne vraie, et ils ne doivent jamais voir une clé.",
      ],
      caseTask: "Décider de ce qui a vraiment échoué, de ce que la prochaine réponse doit contenir, et de ce qu'il advient de la connexion.",
      caseSteps: [
        "Séparer le réseau calme de la réponse que le serveur a choisi d'envoyer.",
        "Relire la requête : GET /status, HTTP/1.0, Connection: close, et le fichier existe.",
        "Répondre aux trois décisions.",
        "Dans la note, dire ce que le comptoir doit voir, et ce qui ne doit jamais y apparaître.",
      ],
      decisions: [
        {
          prompt: "Qu'est-ce qui a échoué à 08:10 ?",
          options: ["Internet, c'est-à-dire les câbles", "Le serveur a mal répondu pour un fichier qui existe", "La couleur du navigateur"],
        },
        {
          prompt: "Que contient la prochaine réponse ?",
          options: ["Le même corps, pour que les ingénieurs voient la clé", "La ligne de statut, et la clé reste sur le serveur", "La clé dans un en-tête, ce qui serait plus sûr"],
        },
        {
          prompt: "Le client a envoyé HTTP/1.0 et Connection: close. Après une réponse valide, que se passe-t-il ?",
          options: ["Le socket reste ouvert pour toujours", "Le serveur ferme la connexion", "Une seconde connexion s'ouvre pour la même réponse"],
        },
      ],
      noteLabel: "Votre note pour le comptoir des paiements",
      noteHint: "Écrivez ce que /status doit afficher, et ce qui ne doit jamais apparaître sur cette page.",
    },
    git: {
      title: "Git et l'historique partagé",
      promise: "Garder un historique qu'un inconnu peut suivre, et en tenir les secrets à l'écart.",
      objectives: [
        "Dire ce que fait Git, et ce qu'ajoute un hôte comme GitHub.",
        "Faire le commit d'un petit changement sur une branche, avec un message qui dit ce qui a changé.",
        "Laisser la branche main verte, et laisser les identifiants hors de l'arbre.",
      ],
      start: [
        "Git est l'historique sur la machine : des instantanés, des branches, et la différence entre ce que vous avez et ce que vous avez enregistré en dernier. Un hôte comme GitHub garde cet historique là où d'autres personnes peuvent recevoir un accès. Git fonctionne sans l'hôte. L'hôte n'est pas l'historique.",
        "Un dépôt se lit quand son nom veut dire quelque chose, et que le README dit ce qu'est le projet, de quoi il dépend, comment le lancer et comment le tester. On commit par petits morceaux qui font chacun une seule chose : une fonction, un correctif, ou un remaniement. Un seul commit à la fin, appelé Version finale, est un tas, pas un historique.",
      ],
      how: [
        "Écrivez le message à l'impératif, et nommez le changement. Renvoyer 404 quand le chemin de statut est inconnu est un message. Mise à jour, Changements et Version finale ne disent pas à la personne suivante ce qui a bougé. Relisez le diff avant le commit. Retirez les affichages, les brouillons et les fichiers qui n'ont pas leur place.",
        "Faites ce travail sur une branche nommée d'après le travail, comme feature/status-404. Ne la fusionnez dans main que lorsqu'elle se construit, que les tests passent et que les vérifications sont vertes. La branche main est la ligne qu'une autre personne peut lancer. Les mots de passe, les clés, les jetons d'accès, les chaînes de connexion et les données personnelles restent dans l'environnement, ou dans un fichier que gitignore exclut. Si une clé active entre dans un commit, retirez-la et remplacez-la. Un dépôt privé n'est pas un coffre-fort pour une clé active.",
      ],
      expert: [
        "L'agencement fait partie de l'historique. Le code, les tests, les documents et la configuration vivent à des endroits évidents. Ne commitez pas la sortie de construction, les dossiers de dépendances, ni les brouillons de l'éditeur, sauf si le projet en donne une raison écrite. Quand la façon de lancer le projet change, changez le README dans le même travail.",
        "Le service de statut de Northline est un petit dépôt. L'arbre devant vous contient un vrai correctif, une ligne du README, un .env avec une clé active, un fichier construit et une note de brouillon. Deux seulement appartiennent au prochain commit, et ce commit n'arrive pas sur main de lui-même.",
      ],
      figure: "Le correctif et le README vont sur une branche. Le secret, la construction et la note de brouillon restent dehors. La branche main n'avance qu'une fois les vérifications vertes.",
      links: [],
      narration:
        "Git est l'historique sur la machine. Un hôte comme GitHub est l'endroit où cet historique peut être partagé. On commit de petits morceaux, avec un message qui nomme le changement, sur une branche. La branche main reste verte. Les secrets restent hors de l'arbre, et une clé qui a fui est remplacée.",
      checkPrompt: "Qu'est-ce que GitHub, à côté de Git ?",
      checkOptions: [
        "Le contrôle de version qui tourne sur votre machine",
        "Un hôte de dépôts Git, avec un accès que vous pouvez accorder",
        "Le serveur qui déploie la page de statut",
        "Le moniteur qui vous alerte la nuit",
      ],
      labTitle: "Choisir le commit",
      labScene: [
        "L'arbre de travail a cinq changements. README.md explique comment lancer les vérifications. src/status.ts renvoie 404 quand le chemin est inconnu. .env contient API_KEY=live-secret. dist/app.js est une sortie de construction. notes.tmp est une note de brouillon.",
        "Choisissez les fichiers qui vont dans un seul commit, le message et la branche. Lancez, puis lisez le commit que vous vous apprêtez à faire. La branche main doit rester la dernière ligne verte.",
      ],
      labWarn: "Ce commit contient un secret, une sortie de construction ou une note de brouillon, ou il déplace main. Laissez la clé dehors, et laissez main en place.",
      fields: {
        files: {
          prompt: "Quels fichiers entrent dans ce commit ?",
          options: [
            "README.md, comment lancer les vérifications",
            "src/status.ts, les chemins inconnus renvoient 404",
            ".env, API_KEY=live-secret",
            "dist/app.js, sortie de construction",
            "notes.tmp, une note de brouillon",
          ],
        },
        message: {
          prompt: "Quel message va sur le commit ?",
          options: ["Mise à jour", "Renvoyer 404 quand le chemin de statut est inconnu", "Version finale"],
        },
        branch: {
          prompt: "Où atterrit ce commit ?",
          options: ["Sur main, maintenant", "Sur feature/status-404, et main reste en l'état"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-02",
      caseTitle: "La clé sur main",
      caseSituation: [
        "Un prestataire a poussé un commit sur main. Le message est Version finale. Le diff ajoute le correctif du 404, et il ajoute aussi .env avec une clé active. Il n'y a pas de branche, et le README dit encore que le projet ne peut pas être lancé.",
        "Le service de statut est ce à quoi le comptoir des paiements se fie le matin. La personne suivante doit pouvoir lancer main, et la clé active doit cesser de fonctionner.",
      ],
      caseTask: "Décider de ce qui arrive à la clé, de la façon dont le correctif est décrit, et de l'endroit où le travail suivant atterrit.",
      caseSteps: [
        "Traiter la clé comme déjà exposée, même si le dépôt est privé.",
        "Séparer le correctif utile des fichiers qui n'auraient jamais dû être dans un commit.",
        "Répondre aux trois décisions.",
        "Dans la note, dire quelle clé vous remplacez, et ce que main a le droit de contenir demain.",
      ],
      decisions: [
        {
          prompt: "La clé active est dans le commit. Que faites-vous ?",
          options: ["La laisser, parce que le dépôt est privé", "La retirer de l'arbre et remplacer la clé", "L'envoyer par courriel à l'équipe, pour qu'elle en ait une copie"],
        },
        {
          prompt: "Quel message va sur le correctif ?",
          options: ["Mise à jour", "Renvoyer 404 quand le chemin de statut est inconnu", "Version finale"],
        },
        {
          prompt: "Où le changement suivant atterrit-il en premier ?",
          options: ["Directement sur main", "Sur une branche, puis sur main une fois les vérifications vertes", "Dans un fichier zip, dans le chat"],
        },
      ],
      noteLabel: "Votre note pour la personne suivante sur le dépôt",
      noteHint: "Écrivez ce que vous faites de la clé qui a fui, et ce que main doit contenir demain.",
    },
    devops: {
      title: "Développement et exploitation",
      promise: "Construire, tester et mettre en service comme une seule pratique continue, et le mesurer avec quatre nombres.",
      objectives: [
        "Définir DevOps comme le développement et l'exploitation sur un même chemin vers la mise en service.",
        "Classer une tâche en développement, exploitation ou automatisation.",
        "Lire, dans un journal, la fréquence de déploiement, le délai de mise en production, le taux d'échec et le délai de restauration.",
      ],
      start: [
        "DevOps réunit le développement et l'exploitation pour que le logiciel soit construit, testé et mis en service comme une seule pratique, et que le service tienne ensuite. C'est continu. Le but est un logiciel apte à tourner, pas un travail jeté par-dessus un mur.",
        "Le développement écrit le changement, ajoute la fonction, corrige le défaut, lance les tests unitaires, conçoit l'application, garde l'historique des versions, et travaille dans un environnement de développement. L'exploitation fait tourner le service et le maintient disponible. Elle entretient l'infrastructure, surveille la production, fait tourner les serveurs et le réseau, déploie, et est responsable de la production. Vous vous spécialiserez souvent. Il vous faut quand même voir où les deux côtés se rencontrent.",
      ],
      how: [
        "L'automatisation retire le travail manuel qui n'a pas besoin d'une personne : la passe de tests, le déploiement, le retour arrière. Une personne décide encore de ce qui est bon. La machine répète les étapes qui ne doivent pas varier selon qui est éveillé.",
        "Vous pouvez vous exercer sur un système qui n'appartient qu'à vous. L'historique, les vérifications et le chemin de retour doivent quand même rester clairs pour la personne suivante, y compris pour vous plus tard. Quatre nombres, issus du programme de recherche DORA, gardent la pratique honnête. La fréquence de déploiement, c'est le nombre de fois où vous déployez. Le délai de mise en production, c'est le temps entre l'acceptation d'un changement et son déploiement. Le taux d'échec, c'est la fréquence à laquelle un déploiement échoue. Le délai de restauration, c'est le temps qu'il faut pour rétablir le service.",
      ],
      expert: [
        "Une mise en service par mois, une semaine de délai de mise en production, des échecs qui attendent le lundi, et aucune restauration écrite : voilà une pratique qui ne peut pas se voir. Les quatre nombres ne remplacent pas le jugement. Ils vous empêchent de prendre pour une réussite une mise en service rare et fragile, seulement parce que la démo semblait calme.",
        "Dans le journal du laboratoire, Northline a déployé quatre fois. L'un de ces déploiements a échoué. Le service était revenu le soir même. Classez le travail, puis lisez les quatre nombres dans le journal. Un déploiement échoué compte encore comme un déploiement.",
      ],
      figure: "Le développement change le logiciel. L'exploitation le fait tourner. L'automatisation répète les étapes qui ne doivent pas dépendre de qui est éveillé. Quatre nombres disent si la mise en service est saine.",
      links: [{ href: "https://dora.dev/", label: "DORA" }],
      narration:
        "DevOps réunit le développement et l'exploitation pour qu'un changement soit construit, testé, mis en service et maintenu en marche. L'automatisation prend les étapes manuelles qui ne devraient pas exiger une personne. Quatre nombres DORA gardent cela honnête : combien de fois vous déployez, combien de temps passe de l'acceptation au déploiement, combien de fois un déploiement échoue, et combien de temps une restauration demande.",
      checkPrompt: "Combien de mesures DORA portent sur la livraison et le rétablissement ?",
      checkOptions: [
        "Une : combien de fois vous déployez",
        "Quatre : fréquence, délai de mise en production, taux d'échec et délai de restauration",
        "Douze : une pour chaque mois",
        "Aucune : DevOps n'est qu'une humeur",
      ],
      labTitle: "Lire la semaine",
      labScene: [
        "Journal de Northline, en heure locale. Lundi 09:00 accepté, 11:00 déployé, réussi. Mardi 10:00 accepté, 18:00 déployé, échoué, 20:30 service rétabli. Jeudi 09:00 accepté, 09:30 déployé, réussi. Vendredi 12:00 accepté, 13:00 déployé, réussi.",
        "Classez trois travaux. Puis lisez les quatre nombres dans ce journal. Le délai de mise en production de mardi va de 10:00 à 18:00. La restauration va du déploiement échoué jusqu'à 20:30. Comptez le déploiement échoué dans la fréquence.",
      ],
      labWarn: "Le journal est la source. Vérifiez chaque nombre contre les heures avant de l'enregistrer.",
      fields: {
        code: {
          prompt: "Écrire le test unitaire de la ligne de statut, c'est quel travail ?",
          options: ["Développement", "Exploitation", "Automatisation"],
        },
        watch: {
          prompt: "Surveiller le taux d'erreur en production, c'est quel travail ?",
          options: ["Développement", "Exploitation", "Automatisation"],
        },
        rollback: {
          prompt: "Un script qui fait le retour arrière d'un déploiement échoué, sans que quelqu'un le tape, c'est quel travail ?",
          options: ["Développement", "Exploitation", "Automatisation"],
        },
        frequency: {
          prompt: "Combien de déploiements contient ce journal ?",
          options: ["Une fois cette semaine", "Quatre fois cette semaine", "Vingt fois cette semaine"],
        },
        lead: {
          prompt: "Quelle est la durée du délai de mise en production du changement de mardi, de l'acceptation au déploiement ?",
          options: ["30 minutes", "8 heures", "Une semaine"],
        },
        fail: {
          prompt: "Combien de ces déploiements ont échoué ?",
          options: ["Aucun", "Un des quatre", "Tous"],
        },
        restore: {
          prompt: "Combien de temps a-t-il fallu pour rétablir le service après le déploiement échoué de mardi ?",
          options: ["10 minutes", "2 heures et 30 minutes", "Le week-end"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-03",
      caseTitle: "La restauration du week-end",
      caseSituation: [
        "Le trimestre dernier, Northline déployait une fois par mois. Un changement accepté le premier lundi partait souvent trois semaines plus tard. Environ un déploiement sur trois échouait, et le service restait parfois faux jusqu'au lundi suivant. Il n'y avait aucun script de retour arrière.",
        "Quelqu'un au comptoir a dit que DevOps ne s'applique pas, parce qu'il n'y a pas d'équipe d'exploitation à part. Le statut des paiements reste leur service. Le journal du laboratoire est la semaine plus récente, où un échec a été rétabli le soir même.",
      ],
      caseTask: "Décider de ce qu'une seule personne peut encore faire, de quel nombre est la restauration, et de ce qui doit tourner sans personne au clavier.",
      caseSteps: [
        "Prendre le journal du laboratoire comme preuve, et non le souvenir du trimestre.",
        "Nommer l'intervalle de restauration à part du délai de mise en production.",
        "Répondre aux trois décisions.",
        "Dans la note, écrire les quatre nombres de la semaine du laboratoire, et nommer l'étape qui doit être automatique.",
      ],
      decisions: [
        {
          prompt: "Il n'y a pas d'équipe d'exploitation à part. Que faites-vous le soir d'un échec ?",
          options: ["Attendre une équipe qui n'existe pas", "Le retracer, le rétablir, et écrire les quatre nombres", "Traiter DevOps comme une affaire que seul un département peut faire"],
        },
        {
          prompt: "Dans le journal du laboratoire, quel intervalle est le délai de restauration ?",
          options: ["Le jeudi, de 09:00 à 09:30", "Le mardi, du déploiement échoué à 18:00 jusqu'à 20:30", "Le nombre de déploiements de la semaine"],
        },
        {
          prompt: "Qu'est-ce qui doit être automatique ?",
          options: ["Cacher un déploiement échoué pour que le tableau reste calme", "Le retour arrière, pour que personne n'ait à le taper la nuit", "Chaque changement de production, sans aucune trace"],
        },
      ],
      noteLabel: "Votre note sur la livraison de la semaine",
      noteHint: "Écrivez les quatre nombres de la semaine du laboratoire, et nommez l'étape qui doit tourner sans une personne.",
    },
    finops: {
      title: "Coût, confiance et valeur",
      promise: "Savoir à quoi sert la dépense, et refuser une facture qui n'achète aucun résultat.",
      objectives: [
        "Traiter un compte payant partagé comme une confiance, pas comme de la capacité en trop.",
        "Attribuer un coût de cloud au service qui le cause, et plafonner ce qui est inactif.",
        "Juger la dépense d'un modèle selon le résultat qu'une personne utilise vraiment.",
      ],
      start: [
        "Dès qu'un service est réel, certains outils se paient : des runners, des bases de données, des sièges, des modèles. Un compte payant partagé est une confiance : il vous est confié. Le travail personnel, et les copies discrètes de données de production, n'y ont pas leur place. La facture fait partie du système.",
        "FinOps consiste à voir ce coût, à l'attribuer au service qui le cause, et à décider de ce que l'on garde. Un spécialiste pourra approfondir plus tard. La décision devant vous est déjà concrète : conserver, plafonner ou arrêter.",
      ],
      how: [
        "Des runners de CI inactifs pendant la nuit ne sont pas de la vitesse gratuite. Plafonnez-les à ce que vos constructions exigent vraiment, et laissez ces minutes au service qui en a besoin. Une base de données de production qui détient le grand livre, c'est le service. Vous ne l'arrêtez pas pour alléger la facture, et vous ne la cachez pas sur une carte personnelle.",
        "Les jetons d'un modèle sont un coût qui pose une question : cet usage produit-il un résultat que quelqu'un utilise ? L'économie des jetons observe la production, la consommation et le coût de cet usage tout au long de sa vie. Un résumé de nuit que personne n'a ouvert depuis un mois n'est pas un résultat. Une fenêtre de contexte plus grande ne répare pas une page non lue. Arrêtez cela jusqu'à ce qu'une personne utilise le résultat dans une décision.",
      ],
      expert: [
        "Plafonner n'est pas arrêter. Plafonnez la capacité inactive de ce dont vous avez encore besoin. Arrêtez ce qui n'a pas d'utilisateur, ou ce qui rompt la confiance du compte partagé. Conservez ce sans quoi le service ne tourne pas, et dites à quel service cela appartient.",
        "Le mois de Northline tient en quatre lignes sur un seul compte partagé : CI, la base du grand livre, un résumé de modèle non lu, et un transcodage personnel. Le laboratoire, c'est cette facture. L'aboutissement, c'est la note que vous enverriez à la personne qui la paie.",
      ],
      figure: "Conservez ce sans quoi le service ne tourne pas. Plafonnez ce qui est inactif. Arrêtez ce que personne n'utilise, et retirez le travail personnel du compte partagé.",
      links: [
        { href: "https://www.finops.org/", label: "FinOps Foundation" },
        { href: "https://www.tokeneconomics.com/state-of-tokenomics/", label: "State of Tokenomics" },
      ],
      narration:
        "Un compte payant partagé est une confiance. FinOps attribue chaque coût au service qui le cause. Plafonnez les runners inactifs. Conservez la base du grand livre. Arrêtez la dépense de modèle que personne n'utilise. Retirez le travail personnel du compte partagé.",
      checkPrompt: "Quand une dépense de modèle est-elle justifiée ?",
      checkOptions: [
        "Quand la facture est assez élevée pour paraître sérieuse",
        "Quand les jetons changent un résultat qu'une personne utilise vraiment",
        "Quand le fournisseur dit que le modèle est avancé",
        "Quand la clé est partagée pour que chacun puisse essayer",
      ],
      labTitle: "Marquer la facture",
      labScene: [
        "Un compte partagé de Northline, ce mois-ci. Runners de CI, 400 dollars, surtout inactifs la nuit, alors que les vraies constructions n'en demandent qu'une fraction. La base du grand livre, 220 dollars, détient le registre des paiements. Résumés du modèle, 900 dollars, et la page de résumés n'a aucun lecteur depuis un mois. Transcodage vidéo personnel, 300 dollars, lancé par une personne sur le compte partagé.",
        "Marquez chaque ligne : conserver, plafonner ou arrêter. Lancez, et lisez la facture que vous allez défendre. Plafonner ne retire pas une charge personnelle. Conserver les résumés non lus laisse les 900 dollars en place.",
      ],
      labWarn: "Une charge personnelle est encore sur le compte partagé, ou les résumés non lus sont encore payés. La confiance et le résultat sont le critère.",
      fields: {
        ci: { prompt: "Runners de CI, 400 dollars, surtout inactifs la nuit.", options: ["Conserver", "Plafonner", "Arrêter"] },
        db: { prompt: "Base du grand livre, 220 dollars, le registre des paiements.", options: ["Conserver", "Plafonner", "Arrêter"] },
        tokens: { prompt: "Résumés du modèle, 900 dollars, aucun lecteur depuis un mois.", options: ["Conserver", "Plafonner", "Arrêter"] },
        shared: { prompt: "Transcodage vidéo personnel, 300 dollars, sur le compte partagé.", options: ["Conserver", "Plafonner", "Arrêter"] },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-04",
      caseTitle: "La facture et la confiance",
      caseSituation: [
        "Le compte partagé a doublé. La moitié du nouveau total est le résumé du modèle que personne ne lit. Une autre ligne est le transcodage vidéo d'une seule personne. Les runners de CI sont encore taillés pour une journée chargée qu'ils n'ont pas. La base du grand livre n'a pas changé, et c'est le registre dont le comptoir dépend.",
        "La personne qui paie le compte a demandé une seule note : ce qui reste, ce qui est plafonné, et ce qui part. Elle ne demande pas un nouveau modèle.",
      ],
      caseTask: "Attribuer le coût, juger le modèle à son résultat, et retirer le travail personnel du compte partagé.",
      caseSteps: [
        "Nommer le service qui cause chaque ligne avant de la changer.",
        "Séparer la capacité inactive d'une ligne qui n'a aucun utilisateur.",
        "Répondre aux trois décisions.",
        "Dans la note, dire ce que vous plafonnez, ce que vous arrêtez, et ce que vous conservez parce que le comptoir en a besoin.",
      ],
      decisions: [
        {
          prompt: "Que faites-vous des runners de CI inactifs ?",
          options: ["Les laisser, parce que la vitesse devrait sembler gratuite", "Les plafonner, et attribuer les minutes au service de statut", "Les passer sur une carte personnelle et cacher la ligne"],
        },
        {
          prompt: "Que faites-vous des résumés du modèle que personne ne lit ?",
          options: ["Acheter une fenêtre de contexte plus grande", "Les arrêter jusqu'à ce qu'une personne utilise le résultat dans une décision", "Partager la clé pour que davantage de personnes les lisent peut-être"],
        },
        {
          prompt: "Le transcodage personnel est sur le compte partagé. Que faites-vous ?",
          options: ["Le laisser, parce que la personne apprend", "Le retirer, et traiter le compte partagé comme une confiance", "Renommer le projet pour que la ligne ait l'air d'être en production"],
        },
      ],
      noteLabel: "Votre note pour la personne qui paie le compte",
      noteHint: "Écrivez ce que vous plafonnez, ce que vous arrêtez, et ce que vous conservez parce que le comptoir en a besoin.",
    },
  },
  brief: {
    title: "Mise en service Northline",
    dek: "Mettre la ligne de statut en service une seule fois, avec un historique, quatre nombres, et une facture que vous pouvez défendre.",
    situation: [
      "Demain, le comptoir des paiements actualisera /status avant l'ouverture des caisses. Le fichier est prêt. Une clé active a été trouvée dans un ancien commit sur main. La semaine dernière, un déploiement a échoué et la restauration a été mesurée. Le compte partagé paie encore des runners inactifs et un résumé non lu.",
      "C'est une seule mise en service, pas quatre projets. La réponse, l'historique, la mesure et la dépense doivent s'accorder.",
    ],
    task: "Choisir la réponse, l'historique, la mesure et la dépense de cette mise en service.",
    steps: [
      "Décider de ce qu'envoie /status, y compris la connexion que le client a demandé de fermer.",
      "Décider où le correctif doit vivre, et ce qui arrive à une clé qui a déjà fui.",
      "Décider des nombres que vous noterez pour cette mise en service.",
      "Dans la note, dire ce que voit le comptoir, où se trouve la clé maintenant, et quelle dépense s'arrête.",
    ],
    decisions: [
      {
        prompt: "Qu'envoie /status ?",
        options: ["Un 500 qui contient la clé", "200 avec le fichier de statut, sans clé, et la connexion fermée", "Rien, et le socket reste ouvert"],
      },
      {
        prompt: "Où atterrit le correctif ?",
        options: ["Tout droit sur main, la clé encore dans l'historique", "Sur une branche, puis sur main une fois les vérifications vertes, et la clé est remplacée", "Dans un fichier zip, dans le chat"],
      },
      {
        prompt: "Qu'enregistrez-vous pour cette mise en service ?",
        options: ["Rien, si la démo semblait calme", "La fréquence, le délai de mise en production, le taux d'échec et le délai de restauration", "Seulement que vous déployez une fois par mois"],
      },
      {
        prompt: "Qu'arrive-t-il à la facture partagée ?",
        options: ["La dépense reste en l'état, y compris les résumés non lus", "Plafonner les runners inactifs et arrêter les résumés non lus", "Partager le compte pour que la facture devienne le problème de tous"],
      },
    ],
    noteLabel: "Votre note de mise en service",
    noteHint: "Écrivez ce qu'affiche /status, où se trouve la clé maintenant, et quelle dépense s'arrête.",
    narration:
      "La mise en service de Northline envoie le fichier de statut sans la clé, n'arrive sur main qu'une fois les vérifications vertes, enregistre les quatre nombres DORA, plafonne les runners inactifs et arrête la dépense de modèle non lue.",
    figure: "Une mise en service : une réponse de statut sûre, la branche main au vert, quatre nombres, et une facture où le travail inactif est plafonné et le travail non lu est arrêté.",
  },
};
