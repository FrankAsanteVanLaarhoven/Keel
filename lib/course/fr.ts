import type { Pack } from "./types";

export const fr: Pack = {
  sections: {
    tools: {
      title: "L'établi",
      promise: "Savoir à quoi sert chaque outil, et dans quel environnement le travail vit vraiment.",
      objectives: [
        "Nommer l'éditeur, le navigateur, le terminal et l'historique.",
        "Distinguer un ordinateur portable personnel d'un environnement partagé.",
        "Poser quatre questions simples avant de faire confiance à un nouvel outil.",
      ],
      start: [
        "Un outil vous aide à faire un changement, puis à voir ce qui s'est passé. L'éditeur est l'endroit où le travail s'écrit. Le navigateur est l'endroit où une personne l'essaie. Le terminal est une fenêtre simple où vous demandez à la machine de lancer une vérification. Chaque fenêtre a un travail. Quand ces travaux sont distincts, le travail se partage plus clairement.",
        "Un environnement est le lieu où ces outils tournent. Votre propre ordinateur portable en est un. L'accueil d'une clinique en est un autre. Une machine partagée dans un centre de données en est un troisième. Le travail peut bouger. La promesse faite à la personne qui utilise le système, non.",
      ],
      how: [
        "L'historique des versions se souvient de chaque changement enregistré, de qui l'a fait, et d'une phrase qui dit pourquoi. Deux personnes peuvent travailler sans s'effacer l'une l'autre. Une liste de paquets note les pièces extérieures exactes que vous avez utilisées, pour que la construction de demain puisse correspondre à celle d'aujourd'hui. Un journal ou un débogueur permet de regarder une seule action au lieu de deviner.",
        "Quand vous rencontrez un nouvel outil, ignorez la couleur de la fenêtre et demandez : deux personnes peuvent-elles s'en servir sans écraser le travail l'une de l'autre ? Tourne-t-il de la même façon sur une deuxième machine ? Peut-on annuler ? Un échec apparaît-il en mots qu'une personne peut lire ? Si la réponse est non, c'est une esquisse, pas un établi.",
      ],
      expert: [
        "Les équipes rendent l'établi le même pour tout le monde. Une personne nouvelle devrait ouvrir le projet et lancer les vérifications dès le premier matin. Cela veut dire que la préparation est écrite, que les secrets ne sont pas stockés dans le projet, et que les vérifications ne dépendent pas d'un seul écran privé.",
        "L'échec qui coûte cher, c'est un système qui ne tourne que sur la machine de la personne qui est partie. La mode des éditeurs change. Le métier, non : refaire le travail, retrouver hier, et expliquer un échec.",
      ],
      example: [
        "Harbor Market garde le tableau public et le livre des stands dans un seul projet partagé. Un tenant de stand n'ouvre jamais l'éditeur. Le personnel, si. Le projet tourne dans un environnement géré, pas sur un ordinateur portable qui rentre à la maison le soir.",
        "Si cet ordinateur portable était la seule copie, un verre renversé fermerait les dossiers du marché. C'est l'historique, pas la marque de l'éditeur, qui permet de retrouver le mardi.",
      ],
      narration:
        "Un outil vous aide à faire un changement et à voir ce qui s'est passé. L'éditeur est l'endroit où le travail s'écrit. Le navigateur est l'endroit où une personne l'essaie. Le terminal est l'endroit où vous demandez à la machine de lancer une vérification. L'historique se souvient de chaque changement enregistré, pour que deux personnes ne puissent pas s'effacer l'une l'autre. Harbor Market garde cet historique sur un établi partagé, pas sur un seul ordinateur portable qui rentre à la maison le soir.",
      checkPrompt: "Quelle fonction permet à deux personnes de changer le travail sans s'effacer l'une l'autre en silence ?",
      checkOptions: ["Un thème de couleurs plus vif", "Un historique de chaque changement enregistré", "Un écran plus grand", "Une souris plus rapide"],
      benchTitle: "Mettre la matinée en ordre",
      benchPrompt: "Un nouveau membre du personnel s'apprête à changer les heures d'ouverture. Mettez les étapes dans l'ordre auquel vous feriez confiance.",
      benchItems: [
        "Nommer le travail en une phrase.",
        "Ouvrir l'établi partagé, pas une copie privée.",
        "Faire un seul petit changement.",
        "L'enregistrer dans l'historique, avec une phrase qui dit pourquoi.",
        "Le montrer à un collègue avant d'aller plus loin.",
      ],
      benchSlots: [],
      caseOrg: "Clinique Riverside",
      caseFile: "RC-01",
      caseTitle: "L'accueil et le seul ordinateur portable",
      caseSituation: [
        "La Clinique Riverside permet aux patients de réserver une infirmière par téléphone ou à l'accueil. Le changement de réservation vit sur un seul ordinateur portable, que seule la réceptionniste sait ouvrir. Quand cette personne est absente, l'accueil note les heures sur papier et les saisit plus tard.",
        "La clinique n'est pas une entreprise de logiciel. Les personnes à l'accueil ne sont pas des développeurs. Elles ont quand même besoin d'un établi qu'une autre personne formée peut ouvrir un lundi.",
      ],
      caseTask: "Choisir où ce travail doit vivre, et ce qui doit se passer quand une vérification échoue.",
      caseSteps: [
        "Lire les deux environnements : un ordinateur portable privé, ou un établi partagé de la clinique, avec un historique.",
        "Imaginer un lundi où la réceptionniste est absente et où un patient doit déplacer une heure.",
        "Répondre aux trois décisions avec des mots ordinaires.",
        "Dans la note, dire ce que la personne à l'accueil fait en premier, et ce qu'elle ne fait jamais avec la seule copie.",
      ],
      decisions: [
        {
          prompt: "Où le travail de réservation doit-il vivre ?",
          options: ["Sur l'ordinateur portable personnel de la réceptionniste", "Sur un établi partagé de la clinique, que toute personne formée peut ouvrir", "Sur papier seulement"],
        },
        {
          prompt: "Qu'est-ce qui se souvient des changements ?",
          options: ["La personne qui était à l'accueil ce jour-là", "Un historique de chaque changement enregistré", "Rien, si les gens font attention"],
        },
        {
          prompt: "Une vérification échoue avant que le changement n'arrive à l'accueil. Que faites-vous ?",
          options: ["Le mettre à l'accueil quand même", "S'arrêter, et ne pas le mettre à l'accueil", "Cacher l'échec pour que la matinée reste calme"],
        },
      ],
      noteLabel: "Votre note au responsable de la clinique",
      noteHint: "Écrivez ce que l'accueil doit ouvrir, et ce qui ne doit jamais être la seule copie.",
    },
    platforms: {
      title: "Plateformes",
      promise: "Voir ce qui change entre un téléphone, un bureau et une borne, et ce qui doit rester le même.",
      objectives: [
        "Dire ce qu'est une plateforme en une phrase.",
        "Séparer l'écran du dossier.",
        "Comparer deux plateformes sans se laisser tromper par la mode.",
      ],
      start: [
        "Une plateforme est l'endroit où une personne rencontre le système : un téléphone, un ordinateur de bureau, une borne, une tablette dans un couloir. L'écran change. Le travail, souvent, non. Un voyageur veut savoir si le bus arrive. Un contrôleur veut savoir si un titre est valable. Le bureau de nuit veut la même vérité, sur un écran plus grand, avec un clavier.",
        "Les personnes qui ne sont pas développeurs doivent quand même finir une tâche. Si la plateforme rend la tâche plus difficile, la plateforme a tort, même quand elle a l'air neuve.",
      ],
      how: [
        "Ce qui reste en général le même : qui est la personne, ce qu'elle a le droit de faire, le dossier de ce qui s'est passé, et la promesse que ce dossier est vrai. Ce qui change en général : la taille de l'écran, s'il y a un clavier, si le réseau coupe, et la vitesse à laquelle la personne doit agir.",
        "Une comparaison utile est un tableau de trois lignes. Le travail. Ce qui doit être vrai. Ce que la plateforme rend facile ou difficile. Si deux plateformes ne peuvent pas partager un seul dossier, vous n'avez pas deux portes. Vous avez deux systèmes qui vont se contredire.",
      ],
      expert: [
        "Les équipes ont des ennuis quand chaque plateforme fabrique sa propre copie des règles. Le téléphone dit que le titre est valable. L'appareil du contrôleur dit que non. Le bureau de nuit ne sait plus lequel croire. La solution, c'est un seul dossier et un seul endroit où la décision se prend, avec des portes minces devant.",
        "Travailler sans réseau compte. Une borne dans une gare peut perdre le réseau. Décidez, avant de construire, quelles actions doivent attendre et lesquelles peuvent être gardées puis envoyées plus tard. Écrivez-le. Cela fait partie du choix de plateforme, ce n'est pas une surprise.",
      ],
      example: [
        "Harbor Market a trois portes sur un seul livre des stands. Les clients utilisent une page de téléphone pour voir ce qui est ouvert. Les tenants de stand utilisent une page de téléphone simple pour se marquer ouverts ou fermés. Le bureau utilise un écran de bureau, avec un clavier, pour la journée entière.",
        "Les pages n'ont pas le même aspect. Le dossier est le même stand, les mêmes heures, la même personne autorisée à les changer. Un deuxième tableur privé ferait mentir le tableau.",
      ],
      narration:
        "Une plateforme est l'endroit où une personne rencontre le système. L'écran peut changer. Le dossier ne devrait pas. À Harbor Market, le client, le tenant de stand et le bureau ont chacun une porte différente. Ils lisent et écrivent tous un seul livre des stands. Si chaque porte gardait sa propre copie, le tableau mentirait.",
      checkPrompt: "Qu'est-ce qui doit rester le même quand on déplace un travail d'un téléphone vers un bureau ?",
      checkOptions: ["La couleur des boutons", "Le dossier et les règles", "Les animations", "Le slogan"],
      benchTitle: "Trois travaux, trois portes",
      benchPrompt: "City Hopper gère un titre de transport. Associez chaque travail à la porte qui lui convient. Le dossier du titre reste un seul dossier.",
      benchItems: ["Un téléphone dans la main du voyageur", "Un petit appareil pour le contrôleur, dans le véhicule", "Un écran de bureau pour l'équipe d'exploitation de nuit"],
      benchSlots: ["Le voyageur, qui vérifie un titre", "Le contrôleur, dans un bus qui roule", "L'équipe de nuit, avec un clavier et un long service"],
      caseOrg: "City Hopper",
      caseFile: "CH-02",
      caseTitle: "Un titre, trois portes",
      caseSituation: [
        "City Hopper veut que les voyageurs, les contrôleurs et le bureau de nuit fassent confiance au même titre. Un fournisseur a proposé trois applications séparées, chacune avec sa propre base de données, parce que c'est plus rapide à montrer.",
        "Les personnes qui s'en servent ne sont pas des développeurs. Un voyageur est pressé. Un contrôleur est debout dans une allée. Le bureau de nuit a du temps, un clavier, et le travail de corriger les erreurs.",
      ],
      caseTask: "Choisir les portes, et refuser une conception qui laisse les trois applications se contredire.",
      caseSteps: [
        "Lister les trois travaux, et l'endroit où chaque personne se tient.",
        "Marquer ce qui doit être identique : le titre, s'il est valable, et qui peut le changer.",
        "Répondre aux décisions.",
        "Dans la note, dire quelle porte est mince, et pourquoi une deuxième copie du titre serait un échec.",
      ],
      decisions: [
        {
          prompt: "Où un voyageur doit-il rencontrer le titre ?",
          options: ["Une carte en papier seulement", "Une page sur le téléphone", "Il doit venir au bureau"],
        },
        {
          prompt: "Qu'est-ce qui reste le même d'une porte à l'autre ?",
          options: ["La couleur de chaque application", "Le dossier du titre et les règles", "Le slogan sur l'écran d'ouverture"],
        },
        {
          prompt: "Le fournisseur propose trois applications avec trois bases de données. Que faites-vous ?",
          options: ["Les accepter, pour que la démonstration soit rapide", "Exiger un seul dossier derrière les portes", "Ne rien construire avant l'année prochaine"],
        },
      ],
      noteLabel: "Votre note au responsable du transport",
      noteHint: "Nommez les trois portes et le seul dossier qu'elles doivent partager.",
    },
    design: {
      title: "La conception pour les personnes",
      promise: "Partir de la tâche qu'une personne fatiguée essaie de finir, pas de l'écran que vous avez envie de dessiner.",
      objectives: [
        "Décrire une tâche avant de décrire un écran.",
        "Écrire une erreur qui dit à une personne quoi faire ensuite.",
        "Remarquer quand une conception ne marche que pour quelqu'un de reposé et d'expert.",
      ],
      start: [
        "Ici, la conception veut dire la forme de la tâche, pas une couche de peinture. Une personne arrive avec un travail : renouveler une prestation, réserver une infirmière, voir si un stand est ouvert. Elle peut être nouvelle, fatiguée, pressée, ou n'utiliser qu'un clavier. Le système devrait l'aider à finir.",
        "Si vous partez des couleurs, des logos ou de la forme de la base de données, vous construirez quelque chose qui a du sens pour les personnes qui le fabriquent, et pas pour celle qui s'en sert. Demandez ce qu'elle essaie de faire, avec ses mots, avant de demander à quoi ressemble l'écran.",
      ],
      how: [
        "Écrivez la tâche comme des étapes qu'une personne peut dire à voix haute. Une étape demande une seule chose. Chaque étape a un moyen de revenir en arrière. Un écran vide dit quoi faire, et pas seulement qu'il n'y a rien. Une erreur dit ce qui s'est mal passé et l'action suivante, en mots simples, sans un numéro de code comme seul indice.",
        "Ensuite, essayez les étapes comme trois personnes : quelqu'un de nouveau, quelqu'un de fatigué à la fin de son service, et quelqu'un qui n'utilise pas de souris. Si l'une d'elles reste bloquée, la conception n'est pas finie. Lisez les mots à voix haute. Si vous ne les diriez pas à une personne à un bureau, ne les mettez pas à l'écran.",
      ],
      expert: [
        "Les exigences sont les promesses : ce qui doit être vrai quand la personne a fini, ce qui ne doit jamais arriver, et ce qui peut attendre. Une page pour le public et la page du personnel, derrière, peuvent avoir l'air différentes et servir quand même une seule promesse. Le personnel a besoin d'aller vite et de voir l'ensemble. La page publique a besoin de calme et d'un chemin court.",
        "Une bonne conception laisse une trace. Quand une tâche échoue à mi-chemin, la personne ne devrait pas perdre son travail, et un collègue devrait pouvoir voir où cela s'est arrêté. C'est de la conception pour le fonctionnement, pas de la décoration.",
      ],
      example: [
        "La question publique de Harbor Market est petite : qu'est-ce qui est ouvert ce soir ? Le premier écran répond à cela, avec le nom du stand et les heures. Il ne commence pas par un compte, une carte de la base de données, ou douze filtres.",
        "Un tenant de stand qui se marque fermé reçoit une seule question, et une ligne claire qui dit que c'est enregistré. Si le réseau coupe, la page dit que le changement n'est pas encore enregistré, et quoi faire. Elle n'affiche pas un code d'erreur brut.",
      ],
      narration:
        "Partez de la tâche, pas de l'écran. Demandez ce que la personne essaie de finir, avec ses mots. Une étape devrait demander une seule chose. Une erreur devrait dire quoi faire ensuite. À Harbor Market, la question publique est simple : qu'est-ce qui est ouvert ce soir ? Le premier écran y répond, avant de demander quoi que ce soit d'autre.",
      checkPrompt: "Que concevez-vous en premier ?",
      checkOptions: ["La palette de couleurs", "La tâche que la personne essaie de finir", "Le logo", "La forme de la base de données"],
      benchTitle: "Un formulaire pour une personne fatiguée",
      benchPrompt: "Le renouvellement des Prestations Civiques pose aujourd'hui douze questions sur un seul écran. Choisissez la version qu'une personne fatiguée peut finir.",
      benchItems: [
        "Garder les douze champs sur un seul écran, pour que cela ait l'air complet.",
        "Poser une question à la fois, avec un moyen de revenir en arrière, et enregistrer au fur et à mesure.",
        "Remplacer les mots par des images et retirer les questions.",
      ],
      benchSlots: [],
      caseOrg: "Prestations Civiques",
      caseFile: "CB-03",
      caseTitle: "Le renouvellement à douze champs",
      caseSituation: [
        "Les personnes renouvellent une prestation une fois par an. Le formulaire actuel a douze champs, dont deux sont des codes que le bureau comprend et que l'habitant ne comprend pas. Si un champ est faux, la page dit « Erreur 422 » et efface le formulaire.",
        "Les habitants ne sont pas des développeurs. Beaucoup sont sur un téléphone. Certains n'utilisent qu'un clavier. Le bureau veut moins de renouvellements laissés à moitié, pas un logo plus joli.",
      ],
      caseTask: "Réécrire le chemin pour qu'une personne puisse le finir, y compris quand elle se trompe.",
      caseSteps: [
        "Dire la tâche de l'habitant en une phrase, avec ses mots.",
        "Découper le chemin en étapes qui demandent une seule chose.",
        "Décider comment une erreur parle, et comment quelqu'un sans souris finit quand même.",
        "Dans la note, écrire les trois premières étapes telles que l'habitant les verrait.",
      ],
      decisions: [
        {
          prompt: "Que fixez-vous avant l'écran ?",
          options: ["La couleur de l'en-tête", "La tâche, avec les mots de l'habitant", "La présentation du logo"],
        },
        {
          prompt: "Le renouvellement rate une vérification. Que dit la page ?",
          options: ["Erreur 422, et le formulaire est effacé", "Ce qui s'est mal passé, et la prochaine chose à faire, en gardant les réponses", "Une page blanche"],
        },
        {
          prompt: "Qui doit pouvoir finir ?",
          options: ["Seulement les personnes qui utilisent une souris", "Une personne avec seulement un clavier, y compris quelqu'un de nouveau ou de fatigué", "Seulement les personnes qui impriment le formulaire"],
        },
      ],
      noteLabel: "Les trois premières étapes, avec les mots de l'habitant",
      noteHint: "Écrivez les étapes qu'une personne verrait vraiment, y compris ce que dit une erreur.",
    },
    tiers: {
      title: "Trois pièces",
      promise: "Séparer ce que la personne voit, ce qui décide, et ce qui se souvient.",
      objectives: [
        "Nommer le navigateur, l'application et la base de données avec des mots simples.",
        "Suivre une demande depuis un appui jusqu'à un dossier enregistré.",
        "Dire ce que « il faut que cela continue de marcher un mardi soir » demande à chaque pièce.",
      ],
      start: [
        "La plupart des systèmes qui font face à une personne, et qui gardent aussi des dossiers, sont rangés en pièces. La première pièce est ce que la personne voit, souvent un navigateur. La deuxième décide : elle vérifie qui est la personne et applique les règles. La troisième se souvient : la base de données, et parfois un cache, c'est-à-dire une réserve de réponses que l'on peut se permettre de répéter.",
        "Vous pouvez dessiner cela pour une clinique, un marché ou un jeu. Les noms restent utiles. Mélanger les pièces, c'est ainsi qu'un système devient quelque chose que seul son auteur peut garder en tête.",
      ],
      how: [
        "Une demande voyage. La personne appuie sur « fermé pour ce soir ». Le navigateur envoie ce souhait à l'application. L'application vérifie que cette personne a le droit de changer ce stand, puis demande à la base de données de s'en souvenir. La base de données écrit la ligne. L'application le dit au navigateur, qui affiche un calme « enregistré ».",
        "Opérationnel veut dire que cela se fait encore un mardi soir, quand l'auteur dort. Chaque pièce a besoin d'un travail pour lequel on peut la surveiller. Le navigateur ne devrait pas être le seul endroit où une règle vit, parce qu'une personne peut modifier son propre navigateur. La base de données ne devrait pas inventer les règles. Elle devrait garder, en sûreté, ce que l'application a demandé.",
      ],
      expert: [
        "Les caches et les files d'attente sont des pièces en plus, que l'on ajoute quand on sait pourquoi. Un cache se souvient d'une réponse qui a le droit d'avoir quelques secondes de retard, comme une liste publique des stands ouverts. Il ne doit pas être le seul souvenir d'un paiement. Une file d'attente garde un travail qui peut attendre un moment, pour qu'une pointe n'assomme pas la pièce qui décide.",
        "Dessinez les pièces avant de nommer des produits. Les produits changent. La question, non : où cette décision est-elle prise, où est-elle retenue, et que se passe-t-il quand une pièce est à l'arrêt ? Si vous ne pouvez pas montrer la pièce, vous ne pouvez pas faire tourner le système.",
      ],
      example: [
        "À Harbor Market, le tableau public est la pièce du navigateur. La pièce de l'application décide si ce tenant de stand peut modifier ce stand. La pièce de la base de données se souvient des heures. Un cache peut garder la liste publique pendant quelques secondes. Il ne garde pas la seule copie d'un changement.",
        "Si l'application est à l'arrêt, le tableau devrait le dire, et non inventer des heures. Si la base de données est à l'arrêt, l'application devrait refuser l'écriture et dire que ce n'était pas enregistré. Le silence ressemblerait à une réussite.",
      ],
      narration:
        "Imaginez trois pièces. Le navigateur est ce qu'une personne voit. L'application décide, y compris qui a le droit d'agir. La base de données se souvient. Un appui voyage de la première pièce à la deuxième, puis à la troisième. À Harbor Market, le tableau public ne doit pas inventer des heures si la pièce qui décide est à l'arrêt. Un changement enregistré doit atteindre la pièce qui se souvient.",
      checkPrompt: "Où la décision « cette personne peut-elle changer ce stand ? » doit-elle vivre ?",
      checkOptions: ["Seulement dans le navigateur", "Dans l'application, là où les règles s'appliquent", "Seulement dans la base de données", "Sur une affiche en papier"],
      benchTitle: "Étiqueter les pièces",
      benchPrompt: "Associez chaque phrase à la pièce qui devrait en être responsable.",
      benchItems: ["Le navigateur, ce que la personne voit", "L'application, qui applique les règles", "La base de données, qui se souvient"],
      benchSlots: ["Montrer la liste des stands ouverts", "Décider si cette personne peut modifier ce stand", "Se souvenir des heures après le départ de la personne"],
      caseOrg: "Harbor Market",
      caseFile: "HM-04",
      caseTitle: "Le livre des stands et le tableau public",
      caseSituation: [
        "Harbor Market veut un tableau public de qui est ouvert, et un moyen pour les tenants de stand de mettre à jour leurs propres heures depuis un téléphone. Le bureau du marché est petit. Personne, là-bas, n'écrit de logiciel. Le bureau a pourtant besoin que le tableau soit vrai un samedi soir.",
        "Un ami du marché propose de « tout mettre dans la page », règles comprises, parce que cela fait moins d'éléments à héberger.",
      ],
      caseTask: "Nommer les trois pièces, et refuser une conception qui cache les règles seulement dans le navigateur.",
      caseSteps: [
        "Dessiner trois boîtes : ce que les personnes voient, ce qui décide, ce qui se souvient.",
        "Placer le tableau public, la règle « peut modifier », et les heures dans ces boîtes.",
        "Dire ce que le tableau devrait faire si la pièce qui décide est à l'arrêt.",
        "Dans la note, expliquer le chemin d'un changement, depuis un pouce sur un téléphone jusqu'à une ligne encore là le matin.",
      ],
      decisions: [
        {
          prompt: "Où vit « ce tenant de stand peut-il modifier ce stand ? » ?",
          options: ["Seulement dans la page du téléphone", "Dans l'application, avec les autres règles", "Sur une affiche dans le bureau"],
        },
        {
          prompt: "Où les heures sont-elles gardées en mémoire ?",
          options: ["Seulement dans le navigateur, jusqu'à ce qu'on le ferme", "Dans l'application, en mémoire, jusqu'à un redémarrage", "Dans la base de données"],
        },
        {
          prompt: "Que fait le tableau public pendant que la pièce qui décide est à l'arrêt ?",
          options: ["Dire que le tableau en direct n'est pas disponible", "Inventer des heures pour que la page ne soit pas vide", "Demander aux clients de modifier les stands eux-mêmes"],
        },
      ],
      noteLabel: "Le chemin d'un changement",
      noteHint: "Suivez un tenant de stand qui ferme pour la nuit, du téléphone jusqu'au dossier encore là le matin.",
    },
    integration: {
      title: "La liste de contrôle qui tourne",
      promise: "Laisser une machine répéter les vérifications à chaque fois, et s'arrêter quand elles échouent.",
      objectives: [
        "Expliquer ce que fait l'intégration continue, avec des mots qu'un collègue peut réutiliser.",
        "Nommer ce qu'un pipeline vérifie avant que des personnes puissent partager un changement.",
        "Dire ce qu'un résultat rouge signifie, une nuit qui compte.",
      ],
      start: [
        "L'intégration continue veut dire que l'équipe réunit les changements souvent, et qu'une liste de contrôle se lance toute seule à chaque fois. La liste répète les mêmes vérifications à chaque fois, pour qu'un soir chargé et un matin calme donnent le même résultat. Elle construit le travail, lance les tests, et parfois cherche des secrets qui ne devraient pas être dans les fichiers. Les personnes lisent encore le résultat. La machine fait la répétition.",
        "Sans cela, la première fois que vous découvrez un changement cassé, c'est devant une personne qui avait besoin du système. Avec cela, vous découvrez la casse pendant que le changement est encore petit.",
      ],
      how: [
        "Un pipeline est cette liste de contrôle, écrite pour qu'une machine puisse la lancer. Un ordre habituel : quelqu'un fait un changement, la liste se lance, une deuxième personne regarde, et alors seulement le changement rejoint la ligne partagée. Si la liste échoue, le changement ne la rejoint pas. L'écran montre du rouge. Le rouge veut dire pas encore : le changement reste hors de la ligne partagée tant que la liste n'est pas passée.",
        "Ce que vous mettez sur la liste dépend de la promesse. Un portail de résultats tient à ce que les notes s'additionnent correctement, et qu'un élève ne puisse pas voir les notes d'un autre élève. Un marché tient à ce qu'un inconnu ne puisse pas modifier un stand. Écrivez les promesses comme des vérifications. Une liste qui ne vérifie que la couleur d'un bouton, c'est du théâtre.",
      ],
      expert: [
        "Le pipeline devrait être le même le matin d'une personne qui développe, et la nuit d'avant un jour ouvert au public. Si l'on peut le sauter quand on est pressé, c'est justement dans la hâte qu'on en avait besoin. Protégez ce saut. Rendez-le rare, nommé, et écrit.",
        "Les journaux de la liste de contrôle ne sont pas un carnet pour y mettre des secrets. Les mots de passe, les clés et les dossiers personnels n'ont pas leur place dans le résultat. Une construction verte qui a affiché un secret est un échec, même si elle est verte.",
      ],
      example: [
        "La liste de contrôle de Harbor Market se lance quand le personnel propose un changement. Elle vérifie que le projet se construit encore, qu'un inconnu ne peut pas modifier un stand, et que le tableau public répond encore à « qu'est-ce qui est ouvert ? ». Ensuite, une deuxième personne regarde.",
        "Le matin d'une fête, une liste rouge arrête le changement. Le marché ouvre sur la version d'hier, celle que l'on savait bonne. C'est le but de la machine : elle accepte d'être impopulaire.",
      ],
      narration:
        "L'intégration continue veut dire qu'une liste de contrôle se lance à chaque fois que le travail change. La machine construit, vérifie, et s'arrête si quelque chose qui compte pour la promesse a échoué. Rouge veut dire pas encore. À Harbor Market, une liste rouge le matin d'une fête garde la version d'hier, celle qui marche, devant les clients.",
      checkPrompt: "Le résultat d'une liste de contrôle est rouge. Qu'est-ce que cela veut dire ?",
      checkOptions: [
        "L'envoyer : la couleur n'est qu'une décoration d'avertissement",
        "Ne pas continuer. Quelque chose qui compte pour la liste a échoué",
        "L'ignorer si le changement est petit",
        "Le fêter : rouge veut dire prêt",
      ],
      benchTitle: "Mettre le pipeline en ordre",
      benchPrompt: "Mettez ces étapes dans l'ordre qui empêche un mauvais changement d'entrer dans la ligne partagée.",
      benchItems: [
        "Quelqu'un fait un changement.",
        "La liste de contrôle se lance toute seule.",
        "Une deuxième personne regarde.",
        "Le changement rejoint la ligne partagée.",
      ],
      benchSlots: [],
      caseOrg: "École du Nord",
      caseFile: "NS-05",
      caseTitle: "La nuit d'avant le jour des résultats",
      caseSituation: [
        "L'École du Nord publie les résultats le matin. Le portail montre à chaque élève ses propres notes. Un changement de mise en page, fait avec de bonnes intentions, est proposé à 21 h, la veille au soir. L'auteur est sûr que c'est minuscule.",
        "Les parents et les élèves ne sont pas des développeurs. Un total faux, ou un élève qui voit les notes d'un autre, n'est pas un petit défaut d'apparence.",
      ],
      caseTask: "Concevoir la liste de contrôle pour cette nuit, y compris qui peut laisser passer un changement.",
      caseSteps: [
        "Écrire les promesses que la liste doit protéger : les totaux, et la vie privée.",
        "Mettre les étapes dans l'ordre, y compris une deuxième personne.",
        "Décider ce qui se passe quand la liste est rouge à 21 h.",
        "Dans la note, dire ce que le matin utilise si le changement n'est pas prêt.",
      ],
      decisions: [
        {
          prompt: "La liste de contrôle est rouge à 21 h. Qu'arrive-t-il au changement ?",
          options: ["Il sort, parce que le matin des résultats ne peut pas attendre", "Il est bloqué. Le matin utilise la dernière version qui a réussi", "On saute les vérifications, seulement cette fois"],
        },
        {
          prompt: "Qui peut laisser un changement rejoindre la ligne partagée ?",
          options: ["Seulement l'auteur", "L'auteur et une deuxième personne, une fois que la liste est verte", "Personne : les changements se copient à la main"],
        },
        {
          prompt: "Une vérification affiche un mot de passe de base de données dans son journal. Qu'est-ce que c'est ?",
          options: ["Utile, pour que la personne suivante puisse se connecter", "Un échec. Les secrets n'ont pas leur place dans le journal", "Quelque chose à envoyer par courriel à toute la liste du personnel"],
        },
      ],
      noteLabel: "Ce que le matin des résultats utilise",
      noteHint: "Dites ce qui tourne le matin si le changement de la nuit est rouge, et quelles promesses la liste protège.",
    },
    deployment: {
      title: "Publier avec soin",
      promise: "Mettre un changement devant les personnes par un petit pas, avec un chemin pour revenir.",
      objectives: [
        "Distinguer un essai du vrai système.",
        "Prévoir une publication que l'on peut annuler.",
        "Dire qui doit apprendre ce qui a changé.",
      ],
      start: [
        "Le déploiement, c'est prendre un changement depuis l'établi jusqu'à un endroit que de vraies personnes utilisent. Il y a d'habitude un endroit privé pour l'essayer, un endroit d'essai qui ressemble au vrai, et le vrai système. Le vrai système est celui auquel une personne fait confiance un mardi soir.",
        "Une publication est le moment où le changement entre dans ce vrai endroit. Les grandes publications ont l'air courageuses et échouent bruyamment. Les petites publications, avec un chemin pour revenir, ont l'air calmes. C'est ainsi que travaillent les équipes soigneuses.",
      ],
      how: [
        "Un chemin pour revenir veut dire que vous pouvez retourner à la version précédente sans la reconstruire de mémoire. Vous l'avez déjà pratiqué. Vous savez combien de temps cela prend. Vous savez ce qui arrive au travail que les personnes ont fait pendant la nouvelle version, s'il y en a.",
        "Prévenez les personnes qui vont rencontrer le changement. Les infirmières, le personnel de l'accueil, les tenants de stand. Ces personnes n'ont pas besoin d'un journal technique. Elles ont besoin de savoir ce qui a changé, quoi faire si cela a l'air faux, et qui appeler. Une publication silencieuse, c'est ainsi qu'une équipe de nuit perd la confiance.",
      ],
      expert: [
        "Les interrupteurs de fonction permettent d'allumer un changement d'abord pour quelques personnes. Ils sont utiles, et ce sont aussi une pièce qu'il faut ranger. Un interrupteur laissé allumé pendant un an est un deuxième système caché dans le premier. Nommez un responsable, et une date pour le retirer.",
        "Ne publiez jamais seulement parce que le calendrier le dit. Le vendredi après-midi, la nuit d'avant les résultats, l'heure où le marché ouvre : c'est là qu'un chemin pour revenir compte le plus. Si vous ne pouvez pas revenir en arrière, vous n'êtes pas prêts, même si la liste de contrôle était verte.",
      ],
      example: [
        "Harbor Market allume d'abord une nouvelle ligne « bientôt fermé » pour une seule rangée de stands. Le bureau observe le tableau pendant une heure. Le chemin pour revenir est un interrupteur vers le tableau d'hier, déjà essayé.",
        "Les tenants de stand l'apprennent dans la note du matin : ce qu'ils verront, et que les heures n'ont pas changé. La publication n'est pas une surprise lâchée à l'heure de l'ouverture.",
      ],
      narration:
        "Le déploiement est le moment où un changement atteint des personnes qui ne l'ont pas fabriqué. Gardez un endroit privé, un endroit d'essai, et le vrai système. Publiez par un petit pas, et gardez un chemin pour revenir que vous avez vraiment essayé. Dites aux personnes de service ce qui a changé et qui appeler. Une publication silencieuse, c'est ainsi que la confiance se perd.",
      checkPrompt: "Que devez-vous avoir avant qu'un changement n'atteigne le vrai système ?",
      checkOptions: ["Un vendredi après-midi, pour avoir le temps du week-end", "Un chemin pour revenir à la version précédente", "Le plus grand changement possible, pour ne le faire qu'une fois", "Le silence, pour que personne ne s'inquiète"],
      benchTitle: "Choisir la publication",
      benchPrompt: "L'Hôpital Sainte-Brigitte veut un nouveau moyen pour les infirmières d'échanger un créneau. À quelle publication faites-vous confiance ?",
      benchItems: [
        "Remplacer tout le tableau des horaires le lundi, au début du créneau, sans chemin pour revenir.",
        "Allumer le nouvel échange pour une seule unité, et garder un retour déjà essayé vers l'ancien tableau.",
        "L'allumer pour tout le monde à minuit, et ne le dire à personne.",
      ],
      benchSlots: [],
      caseOrg: "Hôpital Sainte-Brigitte",
      caseFile: "SB-06",
      caseTitle: "Le tableau des horaires",
      caseSituation: [
        "Les infirmières de l'Hôpital Sainte-Brigitte échangent des créneaux grâce à un tableau des horaires. Un nouveau bouton d'échange a passé ses vérifications. L'unité est pleine. Les personnes qui utilisent le tableau sont fatiguées, et ce ne sont pas des développeurs.",
        "Si le nouveau bouton laisse un créneau sans infirmière, le chemin pour revenir compte plus que le bouton.",
      ],
      caseTask: "Prévoir la publication : quelle taille, comment vous revenez, et qui vous prévenez.",
      caseSteps: [
        "Nommer le vrai système, et qui se tient devant.",
        "Choisir un petit premier pas, pas tout l'hôpital d'un coup.",
        "Écrire le chemin pour revenir en une phrase qu'un coordinateur de nuit peut suivre.",
        "Dans la note, rédiger le message que l'unité lira vraiment.",
      ],
      decisions: [
        {
          prompt: "Quelle est la taille de la première publication ?",
          options: ["Toutes les unités, lundi matin", "Une seule unité, le reste sans changement", "Une publication secrète, pour qu'il n'y ait pas d'agitation"],
        },
        {
          prompt: "Y a-t-il un chemin pour revenir ?",
          options: ["Non. Revenir prendrait une semaine de reconstruction", "Oui. Il est déjà essayé, et une personne de nuit peut le lancer", "Nous espérerons ne pas en avoir besoin"],
        },
        {
          prompt: "Qui apprend ce qui a changé ?",
          options: ["Personne, pour éviter les questions", "Les infirmières et le coordinateur, en mots simples, avec un nom à appeler", "Seulement une affiche dans le parking"],
        },
      ],
      noteLabel: "La note que l'unité lira",
      noteHint: "Dites ce qui a changé, quoi faire si cela a l'air faux, et qui appeler.",
    },
    maintain: {
      title: "La personne suivante",
      promise: "Laisser le système pour que quelqu'un qui arrive dans six mois puisse changer une chose sans risque.",
      objectives: [
        "Expliquer la maintenabilité comme un soin pour la personne suivante.",
        "Séparer un petit changement du cœur dangereux.",
        "Nommer un responsable pour la partie qui appelle quelqu'un la nuit.",
      ],
      start: [
        "Maintenable veut dire qu'une personne qui n'a pas construit le système peut encore le changer sans casser la promesse. Cette personne, ce peut être vous dans six mois, après avoir oublié la partie astucieuse. Ce peut être un nouveau collègue. Ce peut être un bénévole dans une association.",
        "Si chaque changement exige l'auteur d'origine, le système est déjà en train d'échouer, même s'il a l'air bien aujourd'hui.",
      ],
      how: [
        "Les noms devraient dire à quoi une chose sert. Les pièces devraient être assez petites pour tenir dans la tête. Une carte, écrite, dit où va un changement : la lettre de remerciement est ici, le paiement est là, et ils se rencontrent à une seule porte. La personne suivante change la lettre sans ouvrir le paiement.",
        "Le fait d'avoir un responsable fait partie de la carte. Quand le paiement échoue la nuit, un rôle nommé reçoit l'appel, pas « la personne qui se trouve là ». La carte dit aussi comment lancer les vérifications, où est l'historique, et ce qu'il ne faut jamais improviser.",
      ],
      expert: [
        "Une astuce que seul l'auteur peut lire est un coût, pas un cadeau. Préférez une structure qu'une nouvelle collègue ou un nouveau collègue peut suivre. Les commentaires expliquent pourquoi, pas ce que la ligne suivante dit déjà. Les interrupteurs abandonnés, les portes inutilisées, et les copies de la même règle à trois endroits sont une dette d'entretien.",
        "Un système pour des personnes qui ne sont pas développeurs a besoin de gens capables de refuser un enchevêtrement. « Une personne nouvelle peut-elle changer la lettre sans risque ? » est une question de publication, pas un confort en plus.",
      ],
      example: [
        "Harbor Market écrit une carte d'une page. Les heures d'ouverture sont une pièce. Qui peut modifier un stand en est une autre. Les paiements pour l'électricité et l'eau, s'ils sont ajoutés plus tard, restent à l'écart des mots publics sur le tableau.",
        "Un nouveau membre du personnel du samedi peut changer une fermeture de jour férié à partir de la carte, lancer la liste de contrôle, et demander au responsable nommé si la règle sur qui peut modifier est en jeu. Cette personne ne fouille pas dans un seul tas où tout est mélangé.",
      ],
      narration:
        "Maintenable veut dire que la personne suivante peut changer une chose sans risque. Cette personne, ce peut être vous dans six mois. Laissez une carte. Gardez la lettre de remerciement à l'écart du paiement. Nommez qui reçoit l'appel la nuit. À Harbor Market, un nouveau membre du personnel du samedi peut changer une fermeture de jour férié sans toucher à la règle sur qui peut modifier un stand.",
      checkPrompt: "Quelle phrase décrit le mieux un système maintenable ?",
      checkOptions: [
        "Il est astucieux, et seul l'auteur peut le changer",
        "Une personne nouvelle peut trouver la pièce et la changer sans casser le reste",
        "Il suit toujours la dernière mode",
        "C'est le fichier le plus long, pour que tout soit au même endroit",
      ],
      benchTitle: "La lettre de remerciement",
      benchPrompt: "Kindling est une petite association. La page de don et la lettre de remerciement vivent dans un seul enchevêtrement. Un bénévole doit changer la lettre. Que choisissez-vous ?",
      benchItems: [
        "Laisser la lettre dans le code du paiement, pour que rien ne se désaccorde.",
        "Séparer la lettre du paiement, avec une seule porte entre les deux, et une carte courte.",
        "Réécrire tout le site de l'association avant que la lettre puisse changer.",
      ],
      benchSlots: [],
      caseOrg: "Kindling",
      caseFile: "KL-07",
      caseTitle: "La page de don enchevêtrée",
      caseSituation: [
        "Le site de Kindling reçoit des dons et envoie une lettre de remerciement. Les deux ont grandi dans un seul tas de fichiers. Un bénévole, qui n'est pas développeur, veut changer la lettre pour l'hiver. La dernière fois que quelqu'un a essayé, les paiements par carte ont échoué pendant un après-midi.",
        "L'association ne peut pas embaucher une grande équipe. Elle peut laisser une carte et une frontière.",
      ],
      caseTask: "Proposer une séparation, pour que la lettre puisse changer sans mettre le paiement en risque.",
      caseSteps: [
        "Nommer les deux travaux : des mots chaleureux, et prendre l'argent sans risque.",
        "Mettre une frontière entre eux.",
        "Nommer qui reçoit l'appel si les paiements échouent.",
        "Dans la note, écrire la carte en quelques lignes qu'un bénévole peut suivre.",
      ],
      decisions: [
        {
          prompt: "Où la lettre de remerciement doit-elle vivre ?",
          options: ["Dans le code du paiement", "À l'écart du paiement, en le rencontrant à une seule porte", "Figée, pour que personne ne puisse changer les mots"],
        },
        {
          prompt: "Qui est appelé si les paiements échouent la nuit ?",
          options: ["La personne qui tombe dessus par hasard", "Un rôle nommé, écrit sur la carte", "Tout le groupe de discussion des bénévoles, en même temps"],
        },
        {
          prompt: "Où vit la carte ?",
          options: ["Dans la mémoire de l'auteur d'origine", "Écrite, à côté de la façon de lancer les vérifications", "Dans une conversation privée qui disparaît"],
        },
      ],
      noteLabel: "La carte pour un nouveau bénévole",
      noteHint: "Montrez où est la lettre, où est le paiement, et qui appeler.",
    },
    scale: {
      title: "Quand la file s'allonge",
      promise: "Augmenter le nombre de personnes sans casser ce qui doit rester exact.",
      objectives: [
        "Distinguer un moment chargé d'une conception qui est simplement du gaspillage.",
        "Expliquer une file d'attente et un cache sans cacher le compromis.",
        "Protéger l'exactitude et l'équité pendant que l'on grandit.",
      ],
      start: [
        "La montée en charge, c'est ce qui arrive quand plus de personnes se présentent que la forme actuelle ne peut en tenir. Dix personnes dans une clinique, ce n'est pas un million de personnes qui achètent un billet à la même seconde. Les deux cas sont réels. Le premier n'a pas besoin de la machinerie du second. Le second s'effondre si l'on fait semblant que c'est le premier.",
        "Ce qui doit rester vrai n'a pas le droit d'être approximatif. Une personne n'est débitée qu'une fois. Une place n'est vendue qu'une fois. Un titre est valable, ou il ne l'est pas. Les jolies pages peuvent attendre. Le dossier exact, non.",
      ],
      how: [
        "Quand une foule arrive, elle forme une file. Une file d'attente, c'est cette file pour le travail. Chaque personne a l'impression que c'est plus lent, et la pièce qui décide n'est pas assommée. Un cache répète une réponse publique qui peut avoir quelques secondes de retard, pour que l'on ne pose pas un million de fois la même question à la base de données. Une copie d'un service peut partager le travail qui ne fait que lire. Les copies ne pardonnent pas une règle qui n'était vraie que sur une seule machine.",
        "L'équité fait partie de la montée en charge. Une personne avec une connexion plus rapide ne devrait pas pouvoir passer devant dans une file dont on avait promis qu'elle serait juste. Écrivez ce que « juste » veut dire avant l'arrivée de la foule, pas pendant.",
      ],
      expert: [
        "L'ordre des opérations est celui-ci : mesurer la vraie douleur, protéger le dossier exact, puis ajouter une file d'attente ou un cache pour la partie qui peut être souple. Ne mettez pas un paiement en cache. Ne laissez pas la page publique frapper sans arrêt la ligne qui doit rester exacte. N'achetez pas une machine plus grosse comme seule idée, sinon vous l'achèterez encore l'année prochaine.",
        "Des millions de personnes en même temps, c'est une promesse précise. Il faut un nombre, une répétition, et un plan pour la minute où le nombre est dépassé. « Tout ira bien » n'est pas une architecture.",
      ],
      example: [
        "Le samedi ordinaire de Harbor Market n'a pas besoin de la machinerie d'une fête. La nuit de fête, si. Le tableau public peut avoir quelques secondes de retard. L'acte de marquer un stand fermé, et tout paiement, restent exacts, et passent par une file si la foule est grande.",
        "Les clients peuvent voir « ouvert » un moment après la fermeture d'un stand. Ils ne doivent jamais être débités deux fois. Et si le marché vend des billets numérotés, deux personnes ne doivent jamais s'entendre dire qu'elles ont la même dernière part.",
      ],
      narration:
        "La montée en charge veut dire plus de personnes que la forme actuelle ne peut en tenir. Dix personnes et un million de personnes sont des problèmes différents. Ce qui doit rester exact reste exact : une personne n'est débitée qu'une fois, une place n'est vendue qu'une fois. Une file d'attente est une file qui protège la pièce qui décide. Un cache peut répéter une réponse publique pendant quelques secondes. Il ne doit pas se souvenir d'un paiement. À Harbor Market, le tableau peut être en retard un court instant. L'argent, non.",
      checkPrompt: "Pendant qu'un système grandit, qu'est-ce qui doit rester vrai ?",
      checkOptions: ["Les pages deviennent plus jolies", "Les promesses exactes, comme ne débiter une personne qu'une fois", "La marque devient plus bruyante", "Les outils sont les plus neufs"],
      benchTitle: "La nuit de fête",
      benchPrompt: "Un million de personnes vont essayer d'acheter un billet pour la Fête des Lanternes à 10 h. Que protégez-vous en premier ?",
      benchItems: [
        "Un logo plus gros et une animation plus rapide.",
        "Le dossier exact : un billet, une vente, pas de double débit. Laisser la page publique attendre dans une file.",
        "Une galerie plus jolie des lanternes de l'an dernier.",
      ],
      benchSlots: [],
      caseOrg: "Fête des Lanternes",
      caseFile: "LF-08",
      caseTitle: "Les billets à 10 h",
      caseSituation: [
        "La Fête des Lanternes vend un nombre limité de billets. L'an dernier, la page a gelé à 10 h, et certaines personnes ont été débitées deux fois. Le public n'est pas une équipe technique. Les gens appuieront encore si la page a l'air bloquée.",
        "Vous avez des jours ordinaires, et vous avez cette minute-là. Ils ne devraient pas être conçus comme la même minute.",
      ],
      caseTask: "Dire ce que vous protégez en premier, ce qui peut attendre dans une file, et ce que vous ne mettrez pas en cache.",
      caseSteps: [
        "Nommer la promesse exacte : un billet, un débit.",
        "Dire ce que la personne voit pendant qu'elle attend, pour qu'elle n'appuie pas deux fois dans la panique.",
        "Décider ce qui peut être mis en cache, et ce qui ne le doit pas.",
        "Dans la note, écrire l'ordre des actions pour cette minute.",
      ],
      decisions: [
        {
          prompt: "Que protégez-vous en premier ?",
          options: ["Une page plus jolie", "Un billet et un débit, exactement", "Un nouveau film de marque"],
        },
        {
          prompt: "Comment la foule rencontre-t-elle la pièce qui vend ?",
          options: ["Chaque appui frappe tout de suite la ligne de paiement, aussi fort qu'il peut", "Une file d'attente, avec un état d'attente clair", "Fermer le site et vendre seulement par la poste"],
        },
        {
          prompt: "Que peut-on mettre en cache ?",
          options: ["Le paiement lui-même", "Un indice public, par exemple si des billets restent disponibles, avec quelques secondes de retard", "Rien, y compris les images fixes"],
        },
      ],
      noteLabel: "La minute de 10 h",
      noteHint: "Écrivez l'ordre : ce qui reste exact, ce qui attend, et ce que la personne voit.",
    },
    observe: {
      title: "Voir le système",
      promise: "Savoir quelles questions poser quand quelque chose a l'air faux, et quelles alertes une personne peut suivre par une action.",
      objectives: [
        "Séparer un journal, une métrique et une trace, avec des mots simples.",
        "Suivre une demande depuis la porte jusqu'au dossier.",
        "Écrire une alerte qui dit à un humain quoi faire.",
      ],
      start: [
        "L'observabilité veut dire que l'on peut dire ce que le système fait, sans deviner. Quand une personne dit « le tableau est faux », il faut un moyen de regarder qui ne dépend pas de l'auteur d'origine, réveillé.",
        "Trois questions couvrent la plupart des nuits. Qu'a fait cette demande-là ? Combien sont en échec ? Qu'est-ce que le système a écrit à ce moment-là ?",
      ],
      how: [
        "Un journal est une ligne de carnet : à cette heure, ce stand a été marqué fermé, par ce genre d'acteur, une personne ou une machine. Il ne doit contenir ni secrets, ni le dossier privé d'une personne au-delà de ce que la nuit exige. Une métrique est un nombre au fil du temps : combien de chargements du tableau ont échoué en cinq minutes. Une trace est le chemin d'une seule demande à travers les pièces, pour voir où elle s'est arrêtée.",
        "Une alerte est une métrique avec une promesse attachée : si ce nombre franchit une ligne, une personne nommée devrait faire une chose nommée. Une alerte sur laquelle personne ne peut agir est du bruit. Et le bruit apprend aux gens à ignorer la vraie alerte.",
      ],
      expert: [
        "Décidez des questions avant la panne. Un après-midi calme, écrivez : si les livraisons cessent de s'afficher comme en cours de livraison, quelle trace j'ouvre, quel nombre je crois, quel journal je lis. Si vous inventez les questions à 2 h 14, vous raterez la pièce qui a vraiment échoué.",
        "La santé est une phrase, pas un point vert. « En bonne santé » veut dire que le tableau public correspond à la base de données à quelques secondes près, et que les enregistrements échoués se voient. Un point vert qui cache une file d'attente bloquée, c'est ainsi qu'une nuit se perd poliment.",
      ],
      example: [
        "Harbor Market surveille trois choses. Le nombre d'enregistrements échoués. L'âge du cache public. Et, quand un tenant de stand dit « cela ne s'est pas enregistré », le chemin de cette seule demande.",
        "L'alerte est celle-ci : si les enregistrements échoués montent, réveiller le responsable nommé et arrêter les publications suivantes. On ne l'appelle pas parce qu'une image a mis du temps à charger.",
      ],
      narration:
        "On ne peut pas réparer ce que l'on ne peut pas voir. Un journal est une ligne de carnet. Une métrique est un nombre au fil du temps. Une trace est le chemin d'une seule demande. Une alerte devrait nommer l'action qu'une personne fait. À Harbor Market, si les enregistrements commencent à échouer, un responsable nommé est réveillé et les publications s'arrêtent. Une image lente n'appelle personne.",
      checkPrompt: "Un tenant de stand dit que le changement ne s'est pas enregistré. Que voulez-vous en premier ?",
      checkOptions: [
        "Espérer que c'était un cas isolé",
        "Le chemin de cette seule demande",
        "Une nouvelle couleur sur le point d'état",
        "Un redémarrage, avant de regarder",
      ],
      benchTitle: "Associer la question",
      benchPrompt: "Parcel & Pine, 2 h 14. Les livraisons ont cessé de s'afficher comme en cours de livraison. Associez chaque besoin à l'outil.",
      benchItems: ["Une trace, le chemin d'une seule demande", "Une métrique, un nombre au fil du temps", "Un journal, le carnet de ce qui a été écrit"],
      benchSlots: [
        "Suivre la mise à jour d'un colis à travers les pièces",
        "Voir combien de mises à jour échouent",
        "Lire ce que le système a écrit quand un livreur a marqué un colis",
      ],
      caseOrg: "Parcel & Pine",
      caseFile: "PP-09",
      caseTitle: "2 h 14, l'état se tait",
      caseSituation: [
        "Parcel & Pine montre aux clients un état : emballé, en cours de livraison, livré. À 2 h 14, les mises à jour « en cours de livraison » s'arrêtent. Les livreurs travaillent encore. Les clients actualisent et ne voient rien de nouveau. L'opérateur de nuit n'est pas un développeur.",
        "Vous écrivez les questions que cette personne devrait pouvoir poser, et l'alerte qui aurait dû réveiller quelqu'un.",
      ],
      caseTask: "Dire ce que vous regardez, ce que dit l'alerte, et ce qui ne vaut pas d'appeler un humain.",
      caseSteps: [
        "Écrire les trois questions : un colis, combien, ce qui a été écrit.",
        "Nommer le premier regard : le chemin d'une seule mise à jour.",
        "Écrire l'alerte comme une action, pas comme une humeur.",
        "Dans la note, définir « en bonne santé » en une phrase que l'opérateur peut vérifier.",
      ],
      decisions: [
        {
          prompt: "Quel est le premier regard ?",
          options: ["Tout redémarrer", "Le chemin d'une mise à jour qui aurait dû être montrée", "Attendre le matin, au cas où cela s'arrangerait tout seul"],
        },
        {
          prompt: "Que dit une bonne alerte ?",
          options: ["Quelque chose semble bizarre", "Les mises à jour échouées ont franchi la ligne. Faites ceci, et appelez ce rôle", "Écrire à toute l'entreprise"],
        },
        {
          prompt: "Une seule photo de produit charge lentement. Appelez-vous l'opérateur de nuit ?",
          options: ["Oui, appeler pour chaque image lente", "Non. Appeler pour les mises à jour d'état qui échouent, pas pour une image lente", "L'appeler toute la nuit, pour qu'il reste vigilant"],
        },
      ],
      noteLabel: "Ce que « en bonne santé » veut dire ce soir",
      noteHint: "Écrivez la phrase qu'un opérateur peut vérifier, et la première question qu'il pose.",
    },
    security: {
      title: "Qui, et ce qu'ils peuvent faire",
      promise: "Séparer l'identité de la permission, et empêcher les faits privés de s'échapper.",
      objectives: [
        "Distinguer l'authentification de l'autorisation, avec des mots simples.",
        "Nommer trois façons courantes dont un fait privé s'échappe.",
        "Choisir la permission la plus petite, exprès.",
      ],
      start: [
        "L'authentification répond à la question : qui êtes-vous ? L'autorisation répond à la question : que pouvez-vous faire ? Une connexion prouve la première. Elle n'accorde pas la seconde. Un élève qui peut se connecter ne doit pas, pour autant, voir les notes de tous les élèves. Un tenant de stand qui peut se connecter ne doit pas voir les recettes du stand d'à côté.",
        "La sécurité d'un système utilisé par des personnes qui ne sont pas développeurs, c'est surtout cette discipline, plus le soin apporté aux secrets. Les gens feront ce qui est facile. Ce qui est facile doit aussi être ce qui est sûr.",
      ],
      how: [
        "La route entre le navigateur et l'application est chiffrée, pour qu'un inconnu sur le réseau ne puisse pas lire la page. Les secrets, comme les mots de passe et les clés, vivent hors du projet et hors des journaux. Chaque personne a sa propre connexion. Un mot de passe partagé a l'air amical. Il rend chaque action impossible à attribuer, et impossible à retirer quand quelqu'un part.",
        "Les faits privés s'échappent par des erreurs ordinaires. On les met dans la barre d'adresse, où ils sont copiés et inscrits dans des journaux. On les laisse dans une sauvegarde sur un ordinateur portable. On les montre à un rôle qui n'en avait pas besoin. On les écrit dans le journal d'une liste de contrôle. Le moindre privilège veut dire que chaque rôle ne voit que ce dont le travail a besoin.",
      ],
      expert: [
        "Les menaces sont précises. Écrivez : qui pourrait vouloir ce dossier, ce que cette personne peut déjà faire, et ce qui compterait comme une fuite. Un carnet de notes fuit si un élève voit les notes d'un autre, si un ordinateur perdu contient la sauvegarde, ou si une adresse avec un numéro d'élève peut être devinée. Il n'y a pas besoin d'un scénario de film.",
        "Les sessions sont des cookies, de petits jetons que le navigateur garde. Elles devraient être impossibles à voler pour un programme d'un autre site, assez courtes pour expirer, et inutiles si on les copie dans un journal. Des plafonds d'essais empêchent un programme d'essayer un million de mots de passe. Rien de tout cela ne remplace la séparation de base : qui vous êtes, et ce que vous pouvez faire.",
      ],
      example: [
        "Harbor Market donne à chaque tenant de stand sa propre connexion. Il peut modifier son stand. Il ne peut pas ouvrir les recettes du stand d'à côté. Le rôle du bureau, si. Le public peut voir les heures d'ouverture, et rien d'autre.",
        "Une sauvegarde du livre des stands est chiffrée, et gardée par le responsable nommé, pas sur un ordinateur personnel dans un sac. L'adresse d'une page ne contient jamais un total privé.",
      ],
      narration:
        "L'authentification demande qui vous êtes. L'autorisation demande ce que vous pouvez faire. Une connexion n'est pas une permission de tout voir. Donnez à chaque personne sa propre connexion. Gardez les secrets hors du projet et hors des journaux. Les faits privés s'échappent par les barres d'adresse, les sauvegardes sur les ordinateurs portables, et les rôles qui peuvent voir trop de choses. À Harbor Market, un tenant de stand voit son propre stand, pas les recettes d'à côté.",
      checkPrompt: "Quelle affirmation est juste ?",
      checkOptions: [
        "L'authentification et l'autorisation sont deux mots pour la même chose",
        "L'authentification dit qui vous êtes. L'autorisation dit ce que vous pouvez faire",
        "Un long mot de passe est toute la sécurité",
        "Cacher la page vaut aussi bien qu'une permission",
      ],
      benchTitle: "Quelles conceptions laissent fuir ?",
      benchPrompt: "Le carnet de notes du Collège Westfield. Choisissez les trois conceptions qui laissent fuir. Laissez les trois plus sûres de côté.",
      benchItems: [
        "Un seul mot de passe partagé pour tous les enseignants, écrit au tableau de la salle des professeurs",
        "Les notes d'un élève placées dans la barre d'adresse",
        "La sauvegarde de la nuit, copiée sur l'ordinateur portable personnel d'un enseignant",
        "Chaque enseignant et chaque élève a sa propre connexion",
        "La sauvegarde est verrouillée, et seul un rôle nommé peut l'ouvrir",
        "Un élève peut voir ses propres notes, et un enseignant peut voir sa propre classe",
      ],
      benchSlots: [],
      caseOrg: "Collège Westfield",
      caseFile: "WC-10",
      caseTitle: "Le carnet de notes",
      caseSituation: [
        "Westfield garde les notes de chaque élève. Les enseignants les saisissent. Les élèves consultent les leurs. La démonstration d'un fournisseur utilise un seul mot de passe pour tout le personnel, et le numéro d'élève apparaît dans l'adresse web, pour qu'il soit facile de partager un lien.",
        "Les élèves sont jeunes. Le personnel est occupé. Le chemin facile sera celui qu'ils prendront. Le chemin facile doit être celui qui ne laisse rien fuir.",
      ],
      caseTask: "Dire qui peut voir quoi, et fermer trois fuites.",
      caseSteps: [
        "Lister les rôles : élève, enseignant, bureau.",
        "Écrire ce que chaque rôle peut voir, et ce qu'il ne doit pas voir.",
        "Marquer le mot de passe partagé, la barre d'adresse et la sauvegarde sur l'ordinateur portable comme les fuites à fermer.",
        "Dans la note, décrire la conception plus sûre, avec des mots qu'un professeur principal pourrait approuver.",
      ],
      decisions: [
        {
          prompt: "Comment les personnes se connectent-elles ?",
          options: ["Un seul mot de passe partagé, au tableau de la salle des professeurs", "Chaque personne a sa propre connexion", "Pas de connexion : la page est peu visible"],
        },
        {
          prompt: "Qui voit les notes d'un élève ?",
          options: ["Toute personne qui peut se connecter", "L'élève voit les siennes. Un enseignant voit sa classe. Le bureau voit ce dont son travail a besoin", "Les notes sont publiques, pour éviter les appels d'aide"],
        },
        {
          prompt: "Où vit la sauvegarde ?",
          options: ["Sur l'ordinateur portable personnel d'un enseignant", "Verrouillée, ouverte seulement par un rôle nommé", "Dans la conversation du personnel"],
        },
      ],
      noteLabel: "Le carnet de notes plus sûr",
      noteHint: "Dites qui voit quoi, et comment les trois fuites sont fermées.",
    },
    futures: {
      title: "Ce qui change, ce qui tient",
      promise: "Remarquer les vrais déplacements dans la façon de construire les systèmes, et refuser de parier la promesse.",
      objectives: [
        "Nommer des changements qui arrivent vraiment, sans les mots de la vente.",
        "Nommer ce qui ne se périme pas : la tâche, le dossier, l'échec, le soin.",
        "Préférer un avenir que l'on peut quitter.",
      ],
      start: [
        "Les outils, les plateformes et les modes changent. Les personnes ont encore besoin de finir une tâche, de faire confiance à un dossier, et d'obtenir de l'aide quand cela échoue. Une tendance d'avenir mérite l'attention quand elle change l'endroit où le travail tourne, qui détient les données, ou la façon dont une personne demande quelque chose. Elle ne mérite pas l'attention seulement parce qu'elle est neuve.",
        "Les systèmes pour des personnes qui ne sont pas développeurs auront encore besoin d'une porte tournée vers le public, et d'un système d'aide derrière elle. Cette aide pourra un jour se trouver plus près de la personne, sur un appareil, ou plus loin, dans un service partagé. La promesse doit survivre à l'un ou l'autre déplacement.",
      ],
      how: [
        "Surveillez trois déplacements. Le travail peut tourner plus près de la personne, pour qu'une borne ou un téléphone puisse tenir une petite promesse même quand le réseau coupe, et envoyer le dossier plus tard. L'organisation qui détient les données peut ne pas être celle à laquelle la personne pense : les contrats, et le droit de partir, comptent donc. Les personnes peuvent demander avec des paroles ordinaires, ce qui veut dire que le système a encore besoin d'une tâche claire sous la conversation.",
        "Ce qui tient : concevoir à partir de la tâche, une décision qui vit dans une pièce connue, une liste de contrôle, un chemin pour revenir, une carte pour la personne suivante, un dossier exact, un moyen de voir un échec, et une séparation entre qui est quelqu'un et ce qu'il peut faire. Cela n'expire pas quand un fournisseur expire.",
      ],
      expert: [
        "Un choix qui tient dans l'avenir est un choix que vous pouvez quitter. Pouvez-vous exporter le dossier ? Une autre équipe peut-elle lancer les vérifications ? Pouvez-vous éteindre la nouvelle porte ? Si la réponse est non, vous n'avez pas acheté un avenir. Vous avez loué un piège. Écrivez la sortie le jour où vous entrez.",
        "Ne pariez pas une école, une clinique, un marché ou une fête sur un seul service à la mode, que vous ne pouvez ni inspecter ni quitter. Utilisez la nouveauté à la marge, là où un échec se supporte. Gardez le dossier là où vous pourrez encore le lire dans dix ans.",
      ],
      example: [
        "Harbor Market pourra un jour laisser un tenant de stand dire les heures, au lieu d'appuyer dessus. La tâche ne change pas : ces heures, ce stand, cette personne autorisée à le dire. Le dossier ne change pas. La porte parlée est une nouvelle plateforme devant les mêmes pièces.",
        "Si le service de parole fermait, la page du téléphone resterait. C'est le test. Le marché ne garde pas la seule copie de ses heures dans un service qu'il ne peut pas exporter.",
      ],
      narration:
        "Les outils changeront. La promesse ne devrait pas. Les personnes ont encore besoin de finir une tâche, de faire confiance à un dossier, et d'obtenir de l'aide quand cela échoue. Vous pouvez rapprocher le travail de la personne, ou la laisser demander avec des paroles ordinaires. Gardez un moyen de partir. À Harbor Market, une porte parlée pourrait se tenir devant le même livre des stands. Si cette porte fermait, le dossier leur appartiendrait encore.",
      checkPrompt: "Qu'est-ce qui ne se périme pas ?",
      checkOptions: [
        "La mode actuelle du fournisseur",
        "La promesse faite à la personne : la tâche, le dossier, le soin quand cela échoue",
        "La mode visuelle de cette année",
        "Un slogan sur l'avenir",
      ],
      benchTitle: "Ce que vous gardez",
      benchPrompt: "La Salle nationale de lecture doit prévoir cinq ans devant elle. Quelle position prenez-vous ?",
      benchItems: [
        "Adopter un slogan et un seul fournisseur, et y mettre la seule copie du catalogue.",
        "Se préparer à changer d'outils, et refuser tout choix que l'on ne peut pas quitter. Le catalogue reste exportable.",
        "Geler chaque outil pour toujours, pour que rien de neuf ne puisse être essayé à la marge.",
      ],
      benchSlots: [],
      caseOrg: "Salle nationale de lecture",
      caseFile: "NR-11",
      caseTitle: "Cinq ans de catalogue",
      caseSituation: [
        "La Salle nationale de lecture prête au public et garde un catalogue sur lequel le personnel compte. Un fournisseur offre une belle nouvelle porte d'entrée, à condition que le catalogue vive seulement dans son service. Partir plus tard voudrait dire perdre l'historique des prêts.",
        "Les lecteurs et le personnel de l'accueil ne sont pas des développeurs. Ils aimeront une porte plus simple. Ils n'aimeront pas un catalogue qu'ils ne peuvent pas récupérer.",
      ],
      caseTask: "Écrire ce que vous gardez, ce que vous vous préparez à changer, et ce que vous refusez de parier.",
      caseSteps: [
        "Énoncer la promesse qui doit encore être vraie dans cinq ans.",
        "Nommer une nouvelle porte que vous accepteriez d'essayer à la marge.",
        "Nommer la sortie : comment le catalogue part avec vous.",
        "Dans la note, écrire la note que vous donneriez vraiment au conseil.",
      ],
      decisions: [
        {
          prompt: "Que gardez-vous, quoi que fassent les outils ?",
          options: ["La relation avec le fournisseur", "Le catalogue et le dossier des prêts, lisibles sans le fournisseur", "Le slogan"],
        },
        {
          prompt: "Que préparez-vous ?",
          options: ["Rester, même si vous ne pouvez pas exporter", "Un moyen de partir, déjà essayé, avant de dépendre de la nouvelle porte", "Rien. Cinq ans, c'est trop loin pour prévoir"],
        },
        {
          prompt: "Que refusez-vous ?",
          options: ["Une conception où la seule copie est dans un service que vous ne pouvez pas quitter", "Toute nouvelle porte, même un petit essai", "Une note écrite au conseil"],
        },
      ],
      noteLabel: "La note au conseil",
      noteHint: "Dites ce que vous gardez, ce que vous essaieriez, et ce que vous ne parierez pas.",
    },
  },
  brief: {
    title: "Harbor Market, de bout en bout",
    dek: "Un marché. Onze promesses. Une note qu'un directeur peut lire.",
    situation: [
      "Vous avez pratiqué les mêmes idées dans une clinique, une compagnie de bus, une école, un hôpital, une association, une fête, un réseau de colis, un collège et une bibliothèque. Harbor Market est l'endroit où elles se rencontrent.",
      "Les tenants de stand ne sont pas des développeurs. Les clients sont pressés. Le bureau est petit. Le tableau doit être vrai un samedi soir, et encore à vous dans cinq ans.",
    ],
    task: "Écrire la note de fonctionnement : un choix pour chaque promesse, et une note de clôture avec vos propres mots.",
    steps: [
      "Lire vos notes de cas précédentes dans le dossier. Elles sont l'entraînement. Cette page est le transfert.",
      "Répondre à chaque promesse pour Harbor Market, pas pour les autres organisations.",
      "Garder en vue en même temps le tableau public, le livre des stands et les personnes.",
      "Dans la note de clôture, dire à un nouveau directeur ce qui ne doit jamais être parié.",
    ],
    decisions: [
      { prompt: "Où vit l'établi du personnel ?", options: ["Sur un ordinateur portable qui rentre à la maison", "Sur un établi partagé, avec un historique", "Sur papier"] },
      { prompt: "Comment le client, le tenant de stand et le bureau rencontrent-ils le livre des stands ?", options: ["Trois systèmes séparés", "Trois portes, un seul dossier", "Une application de téléphone seulement, sans bureau"] },
      { prompt: "Que concevez-vous en premier ?", options: ["Les écrans", "La tâche : qu'est-ce qui est ouvert, et qui peut le dire", "Le logo"] },
      { prompt: "Où vit « cette personne peut-elle modifier ce stand ? » ?", options: ["Seulement dans le navigateur", "Dans l'application", "Seulement dans la base de données"] },
      { prompt: "Une liste de contrôle est rouge le matin d'une fête. Que se passe-t-il ?", options: ["Envoyer le changement plus tard dans la journée, quand même", "Le bloquer. Ouvrir sur la dernière version verte", "Sauter les vérifications"] },
      { prompt: "Comment publiez-vous un changement sur le tableau public ?", options: ["Tout, à l'heure de l'ouverture", "Un petit pas, avec un chemin pour revenir déjà essayé", "En silence"] },
      { prompt: "Un nouveau membre du personnel doit changer une fermeture de jour férié. Comment le système est-il formé ?", options: ["Un seul tas, y compris les paiements s'il y en a", "Les mots à l'écart de tout ce qui doit rester exact, avec une carte", "Figé, pour que rien ne puisse changer"] },
      { prompt: "Lors d'une nuit de foule, qu'est-ce qui reste exact ?", options: ["L'animation", "Le dossier d'un changement, et tout paiement", "Rien : on ferme le marché"] },
      { prompt: "Un tenant de stand dit qu'un changement ne s'est pas enregistré. Que voulez-vous ?", options: ["L'espoir", "Le chemin de cette seule demande, et une alerte sur laquelle une personne peut agir", "Un redémarrage immédiat comme seul outil"] },
      { prompt: "Qui voit les notes privées d'un stand ?", options: ["Toute personne qui a le mot de passe partagé du bureau", "Le tenant de stand, et le rôle du bureau qui en a besoin", "Le public"] },
      { prompt: "Une nouvelle porte parlée est proposée. Qu'exigez-vous ?", options: ["La seule copie des heures part dans ce service", "Vous pouvez partir. Le dossier reste exportable", "Aucune nouvelle porte ne pourra jamais être essayée"] },
    ],
    noteLabel: "La note au directeur",
    noteHint: "Dites ce que Harbor Market ne doit jamais parier : le dossier, les personnes, et le chemin pour revenir.",
    narration:
      "C'est tout le marché, dans une seule note. Les tenants de stand ne sont pas des développeurs. Le tableau doit être vrai un samedi soir, et le dossier doit encore appartenir au marché dans cinq ans. Choisissez l'établi partagé, un seul dossier derrière les portes, une liste de contrôle qui peut dire non, une petite publication avec un chemin pour revenir, une carte pour la personne suivante, un dossier exact quand la foule arrive, un moyen de voir un échec, des permissions qui correspondent au travail, et un avenir que vous pouvez quitter.",
  },
};
