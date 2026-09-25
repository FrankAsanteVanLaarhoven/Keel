import type { Pack } from "./types";

export const de: Pack = {
  sections: {
    tools: {
      title: "Die Werkbank",
      promise: "Wissen, wofür jedes Werkzeug da ist und in welcher Umgebung die Arbeit wirklich lebt.",
      objectives: [
        "Nenne den Editor, den Browser, das Terminal und den Verlauf.",
        "Unterscheide einen privaten Laptop von einer gemeinsamen Umgebung.",
        "Stelle vier einfache Fragen, bevor du einem neuen Werkzeug vertraust.",
      ],
      start: [
        "Ein Werkzeug hilft dir, eine Änderung zu machen und dann zu sehen, was passiert ist. Der Editor ist der Ort, an dem die Arbeit geschrieben wird. Der Browser ist der Ort, an dem eine Person sie ausprobiert. Das Terminal ist ein schlichtes Fenster, in dem du die Maschine bittest, eine Prüfung auszuführen. Jedes Fenster hat eine Aufgabe. Wenn diese Aufgaben getrennt sind, lässt sich die Arbeit klarer teilen.",
        "Eine Umgebung ist der Ort, an dem diese Werkzeuge laufen. Dein eigener Laptop ist eine Umgebung. Der Empfang einer Klinik ist eine andere. Eine gemeinsame Maschine in einem Rechenzentrum ist eine dritte. Die Arbeit kann den Ort wechseln. Das Versprechen an die Person, die das System nutzt, darf es nicht.",
      ],
      how: [
        "Der Verlauf merkt sich jede gespeicherte Änderung, wer sie gemacht hat und einen Satz darüber, warum. Zwei Personen können arbeiten, ohne einander zu löschen. Eine Paketliste schreibt die genauen Teile von außen auf, die du benutzt hast, damit man morgen dasselbe bauen kann wie heute. Ein Protokoll oder ein Debugger lässt dich eine Handlung beobachten, statt zu raten.",
        "Wenn du ein neues Werkzeug kennenlernst, ignoriere die Farbe des Fensters und frage: Können zwei Personen es benutzen, ohne einander zu überschreiben? Läuft es auf einer zweiten Maschine gleich? Kannst du rückgängig machen? Zeigt sich ein Fehler in Worten, die eine Person lesen kann? Wenn die Antwort nein ist, ist es eine Skizze, keine Werkbank.",
      ],
      expert: [
        "Teams vereinheitlichen die Werkbank. Eine neue Person soll das Projekt öffnen und am ersten Morgen die Prüfungen ausführen können. Das bedeutet: Die Einrichtung ist aufgeschrieben, Geheimnisse liegen nicht im Projekt, und die Prüfungen hängen nicht an einem privaten Bildschirm.",
        "Teuer wird ein System, das nur auf der Maschine der Person läuft, die gegangen ist. Die Mode bei Editoren ändert sich. Die Aufgabe nicht: die Arbeit wiederholen, den gestrigen Stand zurückholen und einen Fehler erklären.",
      ],
      example: [
        "Harbor Market hält die öffentliche Tafel und das Standbuch in einem gemeinsamen Projekt. Wer einen Stand hat, öffnet nie den Editor. Das Personal schon. Das Projekt läuft in einer betreuten Umgebung, nicht auf einem Laptop, der abends nach Hause geht.",
        "Wäre dieser Laptop die einzige Kopie, würde ein verschüttetes Getränk die Unterlagen des Marktes schließen. Der Verlauf, nicht die Marke des Editors, sorgt dafür, dass sich der Dienstag wiederherstellen lässt.",
      ],
      narration:
        "Ein Werkzeug hilft dir, eine Änderung zu machen und zu sehen, was passiert ist. Der Editor ist der Ort, an dem die Arbeit geschrieben wird. Der Browser ist der Ort, an dem eine Person sie ausprobiert. Das Terminal ist der Ort, an dem du die Maschine bittest, eine Prüfung auszuführen. Der Verlauf merkt sich jede gespeicherte Änderung, damit zwei Personen einander nicht löschen können. Harbor Market hält diesen Verlauf auf einer gemeinsamen Werkbank, nicht auf einem Laptop, der abends nach Hause geht.",
      checkPrompt: "Welche Eigenschaft lässt zwei Personen die Arbeit ändern, ohne einander still zu löschen?",
      checkOptions: ["Ein helleres Farbschema", "Ein Verlauf jeder gespeicherten Änderung", "Ein größerer Monitor", "Eine schnellere Maus"],
      benchTitle: "Bringe den Morgen in Ordnung",
      benchPrompt: "Eine neue Person im Personal will die Öffnungszeiten ändern. Lege die Schritte in die Reihenfolge, der du vertrauen würdest.",
      benchItems: [
        "Benenne die Aufgabe in einem Satz.",
        "Öffne die gemeinsame Werkbank, nicht eine private Kopie.",
        "Mache eine kleine Änderung.",
        "Speichere sie im Verlauf, mit einem Satz darüber, warum.",
        "Zeige sie einer anderen Person im Team, bevor es weitergeht.",
      ],
      benchSlots: [],
      caseOrg: "Klinik Riverside",
      caseFile: "RC-01",
      caseTitle: "Der Empfang und der einzige Laptop",
      caseSituation: [
        "Die Klinik Riverside lässt Patientinnen und Patienten eine Pflegekraft per Telefon oder am Empfang buchen. Die Änderung an der Buchung liegt auf einem Laptop, den nur die Person am Empfang zu öffnen weiß. Wenn diese Person nicht da ist, schreibt der Empfang die Zeiten auf Papier und tippt sie später ein.",
        "Die Klinik ist kein Softwareunternehmen. Die Menschen am Empfang sind keine Entwicklerinnen und Entwickler. Sie brauchen trotzdem eine Werkbank, die eine andere geschulte Person an einem Montag öffnen kann.",
      ],
      caseTask: "Entscheide, wo diese Arbeit leben soll und was passieren muss, wenn eine Prüfung scheitert.",
      caseSteps: [
        "Lies die zwei Umgebungen: ein privater Laptop oder eine gemeinsame Werkbank der Klinik mit einem Verlauf.",
        "Stelle dir einen Montag vor, an dem die Person am Empfang fehlt und eine Patientin oder ein Patient eine Zeit verschieben muss.",
        "Beantworte die drei Entscheidungen in gewöhnlichen Worten.",
        "Sage in der Notiz, was die Person am Empfang zuerst tut und was sie mit der einzigen Kopie niemals tut.",
      ],
      decisions: [
        {
          prompt: "Wo soll die Buchungsarbeit leben?",
          options: ["Auf dem privaten Laptop der Person am Empfang", "Auf einer gemeinsamen Werkbank der Klinik, die jede geschulte Person öffnen kann", "Nur auf Papier"],
        },
        {
          prompt: "Was merkt sich die Änderungen?",
          options: ["Wer an dem Tag am Empfang war", "Ein Verlauf jeder gespeicherten Änderung", "Nichts, wenn die Leute vorsichtig sind"],
        },
        {
          prompt: "Eine Prüfung scheitert, bevor die Änderung den Empfang erreicht. Was tust du?",
          options: ["Trotzdem an den Empfang geben", "Anhalten und sie nicht an den Empfang geben", "Den Fehler verstecken, damit der Morgen ruhig bleibt"],
        },
      ],
      noteLabel: "Deine Notiz an die Klinikleitung",
      noteHint: "Schreibe, was der Empfang öffnen soll und was niemals die einzige Kopie sein darf.",
    },
    platforms: {
      title: "Plattformen",
      promise: "Sieh, was sich zwischen einem Handy, einem Schreibtisch und einem Kiosk ändert und was gleich bleiben muss.",
      objectives: [
        "Sage in einem Satz, was eine Plattform ist.",
        "Trenne den Bildschirm von der Aufzeichnung.",
        "Vergleiche zwei Plattformen, ohne dich von der Mode täuschen zu lassen.",
      ],
      start: [
        "Eine Plattform ist der Ort, an dem eine Person dem System begegnet: ein Handy, ein Computer am Schreibtisch, ein Kiosk, ein Tablet auf einem Flur. Der Bildschirm ändert sich. Die Aufgabe oft nicht. Ein Fahrgast will wissen, ob der Bus kommt. Eine Kontrollperson will wissen, ob ein Fahrschein gültig ist. Der Nachtschalter will dieselbe Wahrheit, auf einem größeren Bildschirm, mit einer Tastatur.",
        "Menschen, die keine Entwicklerinnen und Entwickler sind, müssen eine Aufgabe trotzdem zu Ende bringen. Wenn die Plattform die Aufgabe schwerer macht, ist die Plattform falsch, auch wenn sie neu aussieht.",
      ],
      how: [
        "Was meist gleich bleibt: wer die Person ist, was sie tun darf, die Aufzeichnung dessen, was passiert ist, und das Versprechen, dass die Aufzeichnung stimmt. Was sich meist ändert: die Größe des Bildschirms, ob es eine Tastatur gibt, ob das Netz abbricht und wie schnell die Person handeln muss.",
        "Ein nützlicher Vergleich ist eine Tabelle mit drei Zeilen. Die Aufgabe. Was stimmen muss. Was die Plattform leicht oder schwer macht. Wenn zwei Plattformen sich nicht eine Aufzeichnung teilen können, hast du nicht zwei Türen. Du hast zwei Systeme, die sich widersprechen werden.",
      ],
      expert: [
        "Teams geraten in Schwierigkeiten, wenn jede Plattform eine eigene Kopie der Regeln wachsen lässt. Das Handy sagt, der Fahrschein sei gültig. Das Gerät der Kontrollperson sagt, er sei es nicht. Der Nachtschalter kann nicht erkennen, welchem er glauben soll. Die Lösung ist eine Aufzeichnung und ein Ort, an dem die Entscheidung fällt, mit dünnen Türen davor.",
        "Ob es ohne Netz geht, zählt. Ein Kiosk in einem Bahnhof kann die Verbindung verlieren. Entscheide, bevor du baust, welche Handlungen warten müssen und welche gespeichert und später gesendet werden dürfen. Schreibe das auf. Es gehört zur Wahl der Plattform und ist keine Überraschung.",
      ],
      example: [
        "Harbor Market hat drei Türen zu einem Standbuch. Wer einkauft, nutzt eine Handyseite, um zu sehen, was geöffnet ist. Wer einen Stand hat, nutzt eine einfache Handyseite, um sich als geöffnet oder geschlossen zu markieren. Das Büro nutzt einen Bildschirm am Schreibtisch mit einer Tastatur für den ganzen Tag.",
        "Die Seiten sehen verschieden aus. Die Aufzeichnung ist derselbe Stand, dieselben Zeiten, dieselbe Person, die sie ändern darf. Eine zweite private Tabellenkalkulation würde die Tafel lügen lassen.",
      ],
      narration:
        "Eine Plattform ist der Ort, an dem eine Person dem System begegnet. Der Bildschirm darf sich ändern. Die Aufzeichnung nicht. Bei Harbor Market bekommen die einkaufende Person, die Person am Stand und das Büro jeweils eine andere Tür. Alle lesen und schreiben ein Standbuch. Wenn jede Tür eine eigene Kopie behielte, würde die Tafel lügen.",
      checkPrompt: "Was soll gleich bleiben, wenn du eine Aufgabe vom Handy an den Schreibtisch verlegst?",
      checkOptions: ["Die Farbe der Knöpfe", "Die Aufzeichnung und die Regeln", "Die Animationen", "Der Werbespruch"],
      benchTitle: "Drei Aufgaben, drei Türen",
      benchPrompt: "City Hopper betreibt einen Fahrschein. Ordne jede Aufgabe der Tür zu, die zu ihr passt. Die Aufzeichnung des Fahrscheins bleibt eine Aufzeichnung.",
      benchItems: ["Ein Handy in der Hand des Fahrgasts", "Ein kleines Handgerät für die Kontrollperson im Fahrzeug", "Ein Bildschirm am Schreibtisch für das Team der Nachtschicht"],
      benchSlots: ["Der Fahrgast, der einen Fahrschein prüft", "Die Kontrollperson, in einem fahrenden Bus", "Das Nachtschichtteam, mit einer Tastatur und einer langen Schicht"],
      caseOrg: "City Hopper",
      caseFile: "CH-02",
      caseTitle: "Ein Fahrschein, drei Türen",
      caseSituation: [
        "City Hopper will, dass Fahrgäste, das Kontrollpersonal und der Nachtschalter demselben Fahrschein vertrauen. Ein Anbieter hat drei getrennte Apps angeboten, jede mit einer eigenen Datenbank, weil sich das schneller vorführen lässt.",
        "Die Menschen, die sie benutzen, sind keine Entwicklerinnen und Entwickler. Ein Fahrgast hat es eilig. Eine Kontrollperson steht im Gang. Der Nachtschalter hat Zeit, eine Tastatur und die Aufgabe, Fehler zu beheben.",
      ],
      caseTask: "Wähle die Türen und lehne einen Entwurf ab, bei dem die drei Apps sich widersprechen dürfen.",
      caseSteps: [
        "Liste die drei Aufgaben auf und wo jede Person steht.",
        "Markiere, was gleich sein muss: der Fahrschein, ob er gültig ist und wer ihn ändern darf.",
        "Beantworte die Entscheidungen.",
        "Sage in der Notiz, welche Tür dünn ist und warum eine zweite Kopie des Fahrscheins ein Fehler wäre.",
      ],
      decisions: [
        {
          prompt: "Wo soll ein Fahrgast dem Fahrschein begegnen?",
          options: ["Nur eine Papierkarte", "Eine Handyseite", "Die Person muss ins Büro kommen"],
        },
        {
          prompt: "Was bleibt über die Türen hinweg gleich?",
          options: ["Die Farbe jeder App", "Die Aufzeichnung des Fahrscheins und die Regeln", "Der Werbespruch auf dem Startbildschirm"],
        },
        {
          prompt: "Der Anbieter bietet drei Apps mit drei Datenbanken an. Was tust du?",
          options: ["Sie annehmen, damit die Vorführung schnell geht", "Auf einer Aufzeichnung hinter den Türen bestehen", "Bis zum nächsten Jahr nichts bauen"],
        },
      ],
      noteLabel: "Deine Notiz an die Verkehrsleitung",
      noteHint: "Nenne die drei Türen und die eine Aufzeichnung, die sie teilen müssen.",
    },
    design: {
      title: "Gestaltung für Menschen",
      promise: "Fang bei der Aufgabe an, die eine müde Person zu Ende bringen will, nicht bei dem Bildschirm, den du zeichnen möchtest.",
      objectives: [
        "Beschreibe eine Aufgabe, bevor du einen Bildschirm beschreibst.",
        "Schreibe einen Fehler, der einer Person sagt, was sie als Nächstes tun soll.",
        "Merke, wenn eine Gestaltung nur für jemanden funktioniert, der ausgeruht und erfahren ist.",
      ],
      start: [
        "Gestaltung meint hier die Form der Aufgabe, nicht eine Schicht Farbe. Eine Person kommt mit einer Aufgabe: eine Leistung verlängern, eine Pflegekraft buchen, sehen, ob ein Stand geöffnet ist. Sie kann neu sein, müde, in Eile oder nur eine Tastatur benutzen. Das System soll ihr helfen, fertig zu werden.",
        "Wenn du bei Farben, Logos oder der Form der Datenbank anfängst, baust du etwas, das für die Menschen Sinn ergibt, die es bauen, und nicht für die Person. Frage, was sie tun will, in ihren Worten, bevor du fragst, wie der Bildschirm aussieht.",
      ],
      how: [
        "Schreibe die Aufgabe als Schritte, die eine Person laut sagen kann. Ein Schritt fragt nach einer Sache. Jeder Schritt hat einen Weg zurück. Ein leerer Bildschirm sagt, was zu tun ist, nicht nur, dass dort nichts ist. Ein Fehler sagt, was schiefging und welche Handlung als Nächstes kommt, in klaren Worten, ohne eine Kennnummer als einzigen Hinweis.",
        "Dann probiere die Schritte als drei Personen: jemand Neues, jemand Müdes am Ende einer Schicht und jemand, der keine Maus benutzt. Wenn eine dieser Personen stecken bleibt, ist die Gestaltung nicht fertig. Lies die Worte laut. Wenn du sie einer Person am Schreibtisch nicht sagen würdest, setze sie nicht auf den Bildschirm.",
      ],
      expert: [
        "Anforderungen sind die Versprechen: was stimmen muss, wenn die Person fertig ist, was niemals passieren darf und was warten kann. Eine Seite für die Menschen, die kommen, und die Seite für das Personal dahinter können verschieden aussehen und trotzdem einem Versprechen dienen. Das Personal braucht Tempo und Vollständigkeit. Die öffentliche Seite braucht Ruhe und einen kurzen Weg.",
        "Gute Gestaltung hinterlässt eine Spur. Wenn eine Aufgabe auf halbem Weg scheitert, soll die Person die Arbeit nicht verlieren, und eine andere Person im Team soll sehen können, wo sie stehen geblieben ist. Das ist Gestaltung für den Betrieb, nicht Schmuck.",
      ],
      example: [
        "Die öffentliche Frage von Harbor Market ist klein: Was ist heute Abend geöffnet? Der erste Bildschirm beantwortet das, mit dem Namen des Standes und den Zeiten. Er beginnt nicht mit einem Konto, einem Plan der Datenbank oder zwölf Filtern.",
        "Wer einen Stand hat und sich als geschlossen markiert, bekommt eine Frage und eine klare Zeile, dass gespeichert wurde. Wenn das Netz abbricht, sagt die Seite, dass die Änderung noch nicht gespeichert ist, und was zu tun ist. Sie zeigt keinen rohen Fehlercode.",
      ],
      narration:
        "Fang bei der Aufgabe an, nicht beim Bildschirm. Frage, was die Person zu Ende bringen will, in ihren Worten. Ein Schritt soll nach einer Sache fragen. Ein Fehler soll sagen, was als Nächstes zu tun ist. Bei Harbor Market ist die öffentliche Frage einfach: Was ist heute Abend geöffnet? Der erste Bildschirm beantwortet das, bevor er nach irgendetwas anderem fragt.",
      checkPrompt: "Was gestaltest du zuerst?",
      checkOptions: ["Die Farbpalette", "Die Aufgabe, die die Person zu Ende bringen will", "Das Logo", "Die Form der Datenbank"],
      benchTitle: "Ein Formular für eine müde Person",
      benchPrompt: "Die Verlängerung bei Bürgerleistungen stellt derzeit zwölf Fragen auf einem Bildschirm. Wähle die Fassung, die eine müde Person zu Ende bringen kann.",
      benchItems: [
        "Lass alle zwölf Felder auf einem Bildschirm, damit es vollständig aussieht.",
        "Frage eine Frage nach der anderen, mit einem Weg zurück, und speichere unterwegs.",
        "Ersetze die Worte durch Bilder und entferne die Fragen.",
      ],
      benchSlots: [],
      caseOrg: "Bürgerleistungen",
      caseFile: "CB-03",
      caseTitle: "Die Verlängerung mit zwölf Feldern",
      caseSituation: [
        "Menschen verlängern eine Leistung einmal im Jahr. Das aktuelle Formular hat zwölf Felder, von denen zwei Kennungen sind, die das Amt versteht und die Bewohnerinnen und Bewohner nicht. Wenn sie eine falsch machen, sagt die Seite »Fehler 422« und leert das Formular.",
        "Die Bewohnerinnen und Bewohner sind keine Entwicklerinnen und Entwickler. Viele sind am Handy. Manche benutzen nur eine Tastatur. Das Amt will weniger halb fertige Verlängerungen, nicht ein hübscheres Logo.",
      ],
      caseTask: "Schreibe den Weg so um, dass eine Person ihn zu Ende bringen kann, auch wenn sie einen Fehler macht.",
      caseSteps: [
        "Sage die Aufgabe der Bewohnerinnen und Bewohner in einem Satz, in ihren Worten.",
        "Teile den Weg in Schritte, die nach einer Sache fragen.",
        "Entscheide, wie ein Fehler spricht und wie jemand ohne Maus trotzdem fertig wird.",
        "Schreibe in der Notiz die ersten drei Schritte so, wie die Bewohnerinnen und Bewohner sie sehen würden.",
      ],
      decisions: [
        {
          prompt: "Was klärst du vor dem Bildschirm?",
          options: ["Die Farbe der Kopfzeile", "Die Aufgabe in den Worten der Bewohnerinnen und Bewohner", "Die feste Anordnung des Logos"],
        },
        {
          prompt: "Die Verlängerung besteht eine Prüfung nicht. Was sagt die Seite?",
          options: ["Fehler 422, und das Formular wird geleert", "Was schiefging und was als Nächstes zu tun ist, und die Antworten bleiben erhalten", "Eine leere Seite"],
        },
        {
          prompt: "Wer muss fertig werden können?",
          options: ["Nur Menschen, die eine Maus benutzen", "Eine Person nur mit Tastatur, auch wenn sie neu oder müde ist", "Nur Menschen, die das Formular ausdrucken"],
        },
      ],
      noteLabel: "Die ersten drei Schritte, in den Worten der Bewohnerinnen und Bewohner",
      noteHint: "Schreibe die Schritte, die eine Person wirklich sehen würde, und auch, was ein Fehler sagt.",
    },
    tiers: {
      title: "Drei Räume",
      promise: "Trenne, was die Person sieht, was entscheidet und was sich merkt.",
      objectives: [
        "Benenne den Browser, die Anwendung und die Datenbank in einfachen Worten.",
        "Verfolge eine Anfrage vom Tippen bis zu einer gespeicherten Aufzeichnung.",
        "Sage, was »Es muss an einem Dienstagabend weiterlaufen« von jedem Raum verlangt.",
      ],
      start: [
        "Die meisten Systeme, die einer Person begegnen und außerdem Aufzeichnungen behalten, sind in Räumen geordnet. Der erste Raum ist das, was die Person sieht, oft ein Browser. Der zweite Raum entscheidet: Er prüft, wer sie ist, und wendet die Regeln an. Der dritte Raum merkt sich: die Datenbank und manchmal ein Zwischenspeicher für Antworten, die du wiederholen darfst.",
        "Du kannst das für eine Klinik, einen Markt oder ein Spiel zeichnen. Die Namen bleiben nützlich. Die Räume zu vermischen ist der Weg, auf dem ein System zu etwas wird, das nur seine Autorin oder sein Autor im Kopf behalten kann.",
      ],
      how: [
        "Eine Anfrage reist. Die Person tippt »heute Abend geschlossen«. Der Browser schickt diesen Wunsch an die Anwendung. Die Anwendung prüft, dass diese Person diesen Stand ändern darf, und bittet dann die Datenbank, sich das zu merken. Die Datenbank schreibt die Zeile. Die Anwendung sagt es dem Browser, und der zeigt ein ruhiges »gespeichert«.",
        "Betriebsfähig heißt, dass es das auch an einem Dienstagabend noch tut, wenn die Autorin oder der Autor schläft. Jeder Raum braucht eine Aufgabe, bei der man sehen kann, ob er sie erfüllt. Der Browser soll nicht der einzige Ort sein, an dem eine Regel lebt, weil eine Person ihren eigenen Browser ändern kann. Die Datenbank soll keine Regeln erfinden. Sie soll speichern, was die Anwendung verlangt hat, und zwar sicher.",
      ],
      expert: [
        "Zwischenspeicher und Warteschlangen sind zusätzliche Räume, die du hinzufügst, wenn du weißt, warum. Ein Zwischenspeicher merkt sich eine Antwort, die ein paar Sekunden alt sein darf, zum Beispiel eine öffentliche Liste offener Stände. Er darf nicht die einzige Erinnerung an eine Zahlung sein. Eine Warteschlange hält Arbeit, die einen Moment warten kann, damit ein Ansturm den Raum, der entscheidet, nicht umwirft.",
        "Zeichne die Räume, bevor du Produkte benennst. Produkte ändern sich. Die Frage nicht: Wo wird diese Entscheidung getroffen, wo wird sie gemerkt, und was passiert, wenn ein Raum ausfällt? Wenn du nicht auf den Raum zeigen kannst, kannst du das System nicht betreiben.",
      ],
      example: [
        "Bei Harbor Market ist die öffentliche Tafel der Browser-Raum. Der Anwendungsraum entscheidet, ob diese Person am Stand diesen Stand bearbeiten darf. Der Datenbankraum merkt sich die Zeiten. Ein Zwischenspeicher darf die öffentliche Liste ein paar Sekunden halten. Er hält nicht die einzige Kopie einer Änderung.",
        "Wenn die Anwendung ausfällt, soll die Tafel das sagen und keine Zeiten erfinden. Wenn die Datenbank ausfällt, soll die Anwendung das Schreiben ablehnen und sagen, dass nicht gespeichert wurde. Schweigen würde wie ein Erfolg aussehen.",
      ],
      narration:
        "Stell dir drei Räume vor. Der Browser ist das, was eine Person sieht. Die Anwendung entscheidet, auch darüber, wer handeln darf. Die Datenbank merkt sich. Ein Tippen reist vom ersten Raum in den zweiten und dann in den dritten. Bei Harbor Market darf die öffentliche Tafel keine Zeiten erfinden, wenn der Raum ausfällt, der entscheidet. Eine gespeicherte Änderung muss den Raum erreichen, der sich merkt.",
      checkPrompt: "Wo soll die Entscheidung »Darf diese Person diesen Stand ändern?« leben?",
      checkOptions: ["Nur im Browser", "In der Anwendung, wo die Regeln laufen", "Nur in der Datenbank", "Auf einem Papierplakat"],
      benchTitle: "Beschrifte die Räume",
      benchPrompt: "Ordne jeden Satz dem Raum zu, dem er gehören soll.",
      benchItems: ["Der Browser, das, was die Person sieht", "Die Anwendung, die die Regeln anwendet", "Die Datenbank, die sich merkt"],
      benchSlots: ["Zeige die Liste der offenen Stände", "Entscheide, ob diese Person diesen Stand bearbeiten darf", "Merke dir die Zeiten, nachdem die Person gegangen ist"],
      caseOrg: "Harbor Market",
      caseFile: "HM-04",
      caseTitle: "Das Standbuch und die öffentliche Tafel",
      caseSituation: [
        "Harbor Market will eine öffentliche Tafel, die zeigt, wer geöffnet hat, und einen Weg, auf dem die Menschen an den Ständen ihre eigenen Zeiten vom Handy aus aktualisieren. Das Büro des Marktes ist klein. Niemand dort schreibt Software. Die Tafel muss an einem Samstagabend trotzdem stimmen.",
        "Ein Freund des Marktes bietet an, »alles in die Seite zu legen«, Regeln eingeschlossen, weil man dann weniger Teile betreiben muss.",
      ],
      caseTask: "Benenne die drei Räume und lehne einen Entwurf ab, der die Regeln nur im Browser versteckt.",
      caseSteps: [
        "Zeichne drei Kästen: was Menschen sehen, was entscheidet, was sich merkt.",
        "Lege die öffentliche Tafel, die Regel »darf bearbeiten« und die Zeiten in diese Kästen.",
        "Sage, was die Tafel tun soll, wenn der Raum ausfällt, der entscheidet.",
        "Erkläre in der Notiz den Weg einer Änderung, vom Daumen auf einem Handy bis zu einer Zeile, die am Morgen noch da ist.",
      ],
      decisions: [
        {
          prompt: "Wo lebt »Darf die Person, die den Stand hat, ihn bearbeiten?«?",
          options: ["Nur auf der Handyseite", "In der Anwendung, bei den anderen Regeln", "Auf einem Plakat im Büro"],
        },
        {
          prompt: "Wo werden die Zeiten gemerkt?",
          options: ["Nur im Browser, bis er geschlossen wird", "In der Anwendung, im Speicher, bis sie neu startet", "In der Datenbank"],
        },
        {
          prompt: "Was tut die öffentliche Tafel, während der Raum ausfällt, der entscheidet?",
          options: ["Sagen, dass die Tafel in Echtzeit nicht verfügbar ist", "Zeiten erfinden, damit die Seite nicht leer ist", "Die Kundinnen und Kunden bitten, die Stände selbst zu bearbeiten"],
        },
      ],
      noteLabel: "Der Weg einer Änderung",
      noteHint: "Folge einer Person am Stand, die für die Nacht schließt, vom Handy bis zur Aufzeichnung, die am Morgen noch da ist.",
    },
    integration: {
      title: "Die Prüfliste, die läuft",
      promise: "Lass eine Maschine die Prüfungen jedes Mal wiederholen und anhalten, wenn sie scheitern.",
      objectives: [
        "Erkläre, was kontinuierliche Integration tut, in Worten, die eine Kollegin oder ein Kollege weitergeben kann.",
        "Nenne, was eine Pipeline prüft, bevor Menschen eine Änderung teilen dürfen.",
        "Sage, was ein rotes Ergebnis in einer Nacht bedeutet, auf die es ankommt.",
      ],
      start: [
        "Kontinuierliche Integration heißt: Das Team fügt Änderungen oft zusammen, und jedes Mal läuft eine Prüfliste von selbst. Die Prüfliste wiederholt jedes Mal dieselben Prüfungen, damit ein voller Abend und ein ruhiger Morgen dasselbe Ergebnis liefern. Sie baut die Arbeit, führt die Tests aus und sucht manchmal nach Geheimnissen, die nicht in den Dateien stehen sollen. Menschen lesen das Ergebnis trotzdem. Die Maschine übernimmt die Wiederholung.",
        "Ohne das entdeckst du eine kaputte Änderung zum ersten Mal vor einer Person, die das System gebraucht hat. Mit ihr entdeckst du den Bruch, solange die Änderung noch klein ist.",
      ],
      how: [
        "Eine Pipeline ist diese Prüfliste, so geschrieben, dass eine Maschine sie ausführen kann. Eine typische Reihenfolge: Jemand macht eine Änderung, die Prüfliste läuft, eine zweite Person schaut hin, und erst dann kommt die Änderung in die gemeinsame Linie. Wenn die Prüfliste scheitert, kommt die Änderung nicht dazu. Der Bildschirm zeigt Rot. Rot heißt noch nicht: Die Änderung bleibt außerhalb der gemeinsamen Linie, bis die Prüfliste besteht.",
        "Was du auf die Liste setzt, hängt vom Versprechen ab. Ein Notenportal achtet darauf, dass die Summen stimmen und dass eine Schülerin oder ein Schüler nicht die Noten einer anderen Person sehen kann. Ein Markt achtet darauf, dass ein Stand nicht von einer fremden Person bearbeitet werden kann. Schreibe die Versprechen als Prüfungen. Eine Prüfliste, die nur die Farbe eines Knopfes prüft, ist Theater.",
      ],
      expert: [
        "Die Pipeline soll am Morgen einer Entwicklerin oder eines Entwicklers dieselbe sein wie in der Nacht vor einem öffentlichen Tag. Wenn Menschen sie überspringen können, sobald sie es eilig haben, ist die Eile genau der Moment, in dem sie gebraucht wurde. Schütze das Überspringen. Mache es selten, benenne es und schreibe es auf.",
        "Die Protokolle der Prüfliste sind kein Tagebuch für Geheimnisse. Passwörter, Schlüssel und persönliche Aufzeichnungen gehören nicht in die Ausgabe. Ein grünes Ergebnis, das ein Geheimnis ausgegeben hat, ist ein Fehler, auch wenn es grün ist.",
      ],
      example: [
        "Die Prüfliste von Harbor Market läuft, wenn das Personal eine Änderung anbietet. Sie prüft, dass das Projekt sich noch bauen lässt, dass eine fremde Person einen Stand nicht bearbeiten kann und dass die öffentliche Tafel noch »Was ist geöffnet?« beantwortet. Dann schaut eine zweite Person hin.",
        "Am Morgen eines Festes hält eine rote Prüfliste die Änderung an. Der Markt öffnet mit der gestrigen bewährten Fassung. Das ist der Sinn der Maschine: Sie ist bereit, unbeliebt zu sein.",
      ],
      narration:
        "Kontinuierliche Integration heißt, dass jedes Mal eine Prüfliste läuft, wenn sich die Arbeit ändert. Die Maschine baut, prüft und hält an, wenn etwas gescheitert ist, das dem Versprechen wichtig ist. Rot heißt: noch nicht. Bei Harbor Market hält eine rote Prüfliste am Morgen eines Festes die gestrige funktionierende Fassung vor die Kundinnen und Kunden.",
      checkPrompt: "Das Ergebnis einer Prüfliste ist rot. Was bedeutet das?",
      checkOptions: [
        "Schick es raus, die Farbe ist nur eine dekorative Warnung",
        "Mach nicht weiter. Etwas, das der Prüfliste wichtig ist, ist gescheitert",
        "Ignoriere es, wenn die Änderung klein ist",
        "Feiere, Rot heißt bereit",
      ],
      benchTitle: "Ordne die Pipeline",
      benchPrompt: "Lege diese Schritte in die Reihenfolge, die eine schlechte Änderung aus der gemeinsamen Linie heraushält.",
      benchItems: [
        "Jemand macht eine Änderung.",
        "Die Prüfliste läuft von selbst.",
        "Eine zweite Person schaut hin.",
        "Die Änderung kommt in die gemeinsame Linie.",
      ],
      benchSlots: [],
      caseOrg: "Nordschule",
      caseFile: "NS-05",
      caseTitle: "Die Nacht vor dem Tag der Noten",
      caseSituation: [
        "Die Nordschule veröffentlicht die Noten am Morgen. Das Portal zeigt jeder Schülerin und jedem Schüler die eigenen Noten. Eine gut gemeinte Änderung an der Anordnung wird um 21:00 Uhr in der Nacht davor angeboten. Die Autorin oder der Autor ist sicher, dass sie winzig ist.",
        "Eltern und Schülerinnen und Schüler sind keine Entwicklerinnen und Entwickler. Eine falsche Summe, oder dass eine Schülerin oder ein Schüler die Noten einer anderen Person sieht, ist kein kleines Schönheitsproblem.",
      ],
      caseTask: "Entwirf die Prüfliste für diese Nacht, einschließlich der Frage, wer eine Änderung durchlassen darf.",
      caseSteps: [
        "Schreibe die Versprechen, die die Prüfliste schützen muss: Summen und Privatsphäre.",
        "Lege die Schritte in eine Reihenfolge, einschließlich einer zweiten Person.",
        "Entscheide, was passiert, wenn die Prüfliste um 21:00 Uhr rot ist.",
        "Sage in der Notiz, was der Morgen benutzt, wenn die Änderung nicht bereit ist.",
      ],
      decisions: [
        {
          prompt: "Die Prüfliste ist um 21:00 Uhr rot. Was passiert mit der Änderung?",
          options: ["Sie geht hinaus, weil der Morgen der Noten nicht warten kann", "Sie wird blockiert. Der Morgen benutzt die letzte Fassung, die bestanden hat", "Die Prüfungen werden übersprungen, nur dieses eine Mal"],
        },
        {
          prompt: "Wer darf eine Änderung in die gemeinsame Linie lassen?",
          options: ["Nur die Autorin oder der Autor", "Die Autorin oder der Autor und eine zweite Person, nachdem die Prüfliste grün ist", "Niemand, Änderungen werden von Hand kopiert"],
        },
        {
          prompt: "Eine Prüfung gibt ein Datenbankpasswort in ihrem Protokoll aus. Was ist das?",
          options: ["Nützlich, damit die nächste Person sich anmelden kann", "Ein Fehler. Geheimnisse gehören nicht ins Protokoll", "Etwas, das man an die ganze Personalliste schickt"],
        },
      ],
      noteLabel: "Was der Morgen der Noten benutzt",
      noteHint: "Sage, was am Morgen läuft, wenn die Änderung der Nacht rot ist, und welche Versprechen die Prüfliste schützt.",
    },
    deployment: {
      title: "Vorsichtig veröffentlichen",
      promise: "Setze eine Änderung in einem kleinen Schritt vor Menschen, mit einem Weg zurück.",
      objectives: [
        "Unterscheide einen Probelauf vom echten System.",
        "Plane eine Veröffentlichung, die sich rückgängig machen lässt.",
        "Sage, wer hören muss, was sich geändert hat.",
      ],
      start: [
        "Bereitstellen heißt, eine Änderung von der Werkbank an einen Ort zu bringen, den echte Menschen benutzen. Es gibt meist einen privaten Ort, um sie zu probieren, einen Probeort, der wie der echte aussieht, und das echte System. Das echte System ist das, dem eine Person an einem Dienstagabend vertraut.",
        "Eine Veröffentlichung ist der Moment, in dem die Änderung in diesen echten Ort übergeht. Große Veröffentlichungen fühlen sich mutig an und scheitern laut. Kleine Veröffentlichungen, mit einem Weg zurück, fühlen sich still an und sind die Art, wie vorsichtige Teams arbeiten.",
      ],
      how: [
        "Ein Weg zurück heißt, dass du zur vorherigen Fassung zurückkehren kannst, ohne sie aus dem Gedächtnis wieder aufzubauen. Du hast es geübt. Du weißt, wie lange es dauert. Du weißt, was mit der Arbeit passiert, die Menschen während der neuen Fassung gemacht haben, falls es welche gibt.",
        "Sage es den Menschen, die der Änderung begegnen werden. Pflegekräfte, Personal am Empfang, Menschen an den Ständen. Sie brauchen kein technisches Tagebuch. Sie brauchen: was sich geändert hat, was zu tun ist, wenn es falsch aussieht, und wen man anruft. Eine stille Veröffentlichung ist der Weg, auf dem eine Nachtschicht das Vertrauen verliert.",
      ],
      expert: [
        "Funktionsschalter lassen dich eine Änderung zuerst für wenige Menschen einschalten. Sie sind nützlich, und sie sind auch ein Raum, den du aufräumen musst. Ein Schalter, der ein Jahr lang an bleibt, ist ein zweites System, das sich im ersten versteckt. Nenne eine verantwortliche Person und ein Datum, an dem du ihn entfernst.",
        "Veröffentliche niemals nur, weil der Kalender es sagt. Freitagnachmittag, die Nacht vor den Noten, die Stunde, in der der Markt öffnet: Dort zählt ein Weg zurück am meisten. Wenn du nicht zurücksetzen kannst, bist du nicht bereit, auch wenn die Prüfliste noch so grün war.",
      ],
      example: [
        "Harbor Market schaltet eine neue Zeile »schließt bald« zuerst für eine Reihe von Ständen ein. Das Büro beobachtet die Tafel eine Stunde lang. Der Weg zurück ist ein Schalter zur Tafel von gestern, schon geprobt.",
        "Die Menschen an den Ständen erfahren es in der Morgennotiz: was sie sehen werden und dass die Zeiten unverändert sind. Die Veröffentlichung ist keine Überraschung, die zur Öffnungszeit fällt.",
      ],
      narration:
        "Bereitstellen ist der Moment, in dem eine Änderung Menschen erreicht, die sie nicht gemacht haben. Halte einen privaten Ort, einen Probeort und das echte System. Veröffentliche in einem kleinen Schritt und behalte einen Weg zurück, den du wirklich probiert hast. Sage den Menschen in der Schicht, was sich geändert hat und wen sie anrufen sollen. Eine stille Veröffentlichung ist der Weg, auf dem Vertrauen verloren geht.",
      checkPrompt: "Was musst du haben, bevor eine Änderung das echte System erreicht?",
      checkOptions: ["Einen Freitagnachmittag, damit am Wochenende Zeit ist", "Einen Weg zurück zur vorherigen Fassung", "Die größtmögliche Änderung, damit du es nur einmal tust", "Stille, damit sich niemand sorgt"],
      benchTitle: "Wähle die Veröffentlichung",
      benchPrompt: "Das Krankenhaus St. Brigid will einen neuen Weg, auf dem Pflegekräfte eine Schicht tauschen. Welcher Veröffentlichung vertraust du?",
      benchItems: [
        "Ersetze den ganzen Dienstplan am Montag zu Beginn der Schicht, ohne Weg zurück.",
        "Schalte den neuen Tausch für eine Station ein und behalte eine geprobte Rückkehr zum alten Dienstplan.",
        "Schalte ihn um Mitternacht für alle ein und sage es niemandem.",
      ],
      benchSlots: [],
      caseOrg: "Krankenhaus St. Brigid",
      caseFile: "SB-06",
      caseTitle: "Der Dienstplan der Station",
      caseSituation: [
        "Pflegekräfte im Krankenhaus St. Brigid tauschen Schichten über einen Dienstplan. Ein neuer Tauschknopf hat seine Prüfungen bestanden. Die Station ist voll. Die Menschen, die den Dienstplan benutzen, sind müde, und sie sind keine Entwicklerinnen und Entwickler.",
        "Wenn der neue Knopf eine Schicht ohne Pflegekraft hängen lässt, zählt der Weg zurück mehr als der Knopf.",
      ],
      caseTask: "Plane die Veröffentlichung: wie groß, wie du zurückkehrst und wem du es sagst.",
      caseSteps: [
        "Benenne das echte System und wer davor steht.",
        "Wähle einen kleinen ersten Schritt, nicht das ganze Krankenhaus auf einmal.",
        "Schreibe den Weg zurück in einem Satz, dem eine Nachtleitung folgen kann.",
        "Schreibe in der Notiz die Nachricht, die die Station wirklich lesen wird.",
      ],
      decisions: [
        {
          prompt: "Wie groß ist die erste Veröffentlichung?",
          options: ["Jede Station, Montagmorgen", "Eine Station, der Rest bleibt unverändert", "Eine geheime Veröffentlichung, damit es keinen Wirbel gibt"],
        },
        {
          prompt: "Gibt es einen Weg zurück?",
          options: ["Nein. Zurückzugehen würde eine Woche Wiederaufbau brauchen", "Ja. Es ist geprobt, und eine Person in der Nacht kann es starten", "Wir hoffen, dass wir keinen brauchen"],
        },
        {
          prompt: "Wer hört, was sich geändert hat?",
          options: ["Niemand, um Fragen zu vermeiden", "Die Pflegekräfte und die Nachtleitung, in klaren Worten, mit einem Namen, den man anrufen kann", "Nur ein Plakat auf dem Parkplatz"],
        },
      ],
      noteLabel: "Die Notiz, die die Station lesen wird",
      noteHint: "Sage, was sich geändert hat, was zu tun ist, wenn es falsch aussieht, und wen man anruft.",
    },
    maintain: {
      title: "Die nächste Person",
      promise: "Hinterlasse das System so, dass jemand, der in sechs Monaten kommt, eine Sache sicher ändern kann.",
      objectives: [
        "Erkläre Wartbarkeit als Sorge für die nächste Person.",
        "Trenne eine kleine Änderung vom gefährlichen Kern.",
        "Nenne eine zuständige Rolle für den Teil, der nachts jemanden ruft.",
      ],
      start: [
        "Wartbar heißt: Eine Person, die das System nicht gebaut hat, kann es trotzdem ändern, ohne das Versprechen zu brechen. Diese Person kannst du selbst sein, in sechs Monaten, nachdem du den schlauen Teil vergessen hast. Es kann eine neue Person im Team sein. Es kann eine ehrenamtliche Person bei einer Hilfsorganisation sein.",
        "Wenn jede Änderung die ursprüngliche Autorin oder den ursprünglichen Autor braucht, scheitert das System schon, auch wenn es heute noch gut aussieht.",
      ],
      how: [
        "Namen sollen sagen, wofür eine Sache da ist. Teile sollen klein genug sein, dass man sie im Kopf behalten kann. Eine aufgeschriebene Karte sagt, wohin eine Änderung gehört: Der Dankesbrief ist hier, die Zahlung ist dort, und sie treffen sich an einer Tür. Die nächste Person ändert den Brief, ohne die Zahlung zu öffnen.",
        "Zuständigkeit ist Teil der Karte. Wenn die Zahlung nachts scheitert, bekommt eine benannte Rolle den Anruf, nicht »wer gerade da ist«. Die Karte enthält, wie man die Prüfungen ausführt, wo der Verlauf ist und was niemals improvisiert werden darf.",
      ],
      expert: [
        "Schläue, die nur die Autorin oder der Autor lesen kann, ist eine Last, kein Geschenk. Bevorzuge einen Aufbau, den eine neue Person nachverfolgen kann. Kommentare erklären, warum, nicht das, was die nächste Zeile schon sagt. Tote Schalter, ungenutzte Türen und Kopien derselben Regel an drei Orten sind Schulden bei der Wartung.",
        "Ein System für Menschen, die keine Entwicklerinnen und Entwickler sind, braucht Menschen, die ein Gewirr ablehnen können. »Kann eine neue Person den Brief sicher ändern?« ist eine Frage der Veröffentlichung, kein nettes Extra.",
      ],
      example: [
        "Harbor Market schreibt eine Karte auf einer Seite. Die Öffnungszeiten sind ein Teil. Wer einen Stand bearbeiten darf, ist ein anderer. Zahlungen für Strom und Wasser bleiben, falls sie später dazukommen, getrennt von den öffentlichen Worten auf der Tafel.",
        "Eine neue Person, die samstags arbeitet, kann anhand der Karte eine Feiertagsschließung ändern, die Prüfliste ausführen und die benannte zuständige Person fragen, wenn die Regel darüber beteiligt ist, wer bearbeiten darf. Sie muss nicht einen einzigen ungeordneten Haufen durchsuchen.",
      ],
      narration:
        "Wartbar heißt: Die nächste Person kann eine Sache sicher ändern. Diese Person kannst du selbst sein, in sechs Monaten. Hinterlasse eine Karte. Halte den Dankesbrief von der Zahlung getrennt. Nenne, wer nachts den Anruf bekommt. Bei Harbor Market kann eine neue Person, die samstags arbeitet, eine Feiertagsschließung ändern, ohne die Regel anzufassen, wer einen Stand bearbeiten darf.",
      checkPrompt: "Welcher Satz beschreibt ein wartbares System am besten?",
      checkOptions: [
        "Es ist schlau, und nur die Autorin oder der Autor kann es ändern",
        "Eine neue Person kann das Teil finden und es ändern, ohne den Rest zu zerbrechen",
        "Es benutzt immer die neueste Mode",
        "Es ist die längste Datei, damit alles an einem Ort ist",
      ],
      benchTitle: "Der Dankesbrief",
      benchPrompt: "Kindling ist eine kleine Hilfsorganisation. Die Spendenseite und der Dankesbrief leben in einem Gewirr. Eine ehrenamtliche Person muss den Brief ändern. Was wählst du?",
      benchItems: [
        "Lass den Brief im Zahlungscode, damit nichts auseinandergerät.",
        "Trenne den Brief von der Zahlung, mit einer Tür dazwischen und einer kurzen Karte.",
        "Schreibe die ganze Seite der Hilfsorganisation neu, bevor der Brief sich ändern darf.",
      ],
      benchSlots: [],
      caseOrg: "Kindling",
      caseFile: "KL-07",
      caseTitle: "Die verwickelte Spendenseite",
      caseSituation: [
        "Die Website von Kindling nimmt Spenden an und schickt einen Dankesbrief. Beides ist in einem Haufen von Dateien gewachsen. Eine ehrenamtliche Person, die keine Entwicklerin und kein Entwickler ist, will den Brief für den Winter ändern. Als es zuletzt jemand versucht hat, sind Kartenzahlungen einen Nachmittag lang gescheitert.",
        "Die Hilfsorganisation kann kein großes Team einstellen. Sie kann eine Karte und eine Grenze hinterlassen.",
      ],
      caseTask: "Schlage eine Trennung vor, damit der Brief sich ändern kann, ohne die Zahlung zu gefährden.",
      caseSteps: [
        "Benenne die zwei Aufgaben: warme Worte und Geld sicher annehmen.",
        "Setze eine Grenze zwischen ihnen.",
        "Nenne, wer den Anruf bekommt, wenn Zahlungen scheitern.",
        "Schreibe in der Notiz die Karte in wenigen Zeilen, denen eine ehrenamtliche Person folgen kann.",
      ],
      decisions: [
        {
          prompt: "Wo soll der Dankesbrief leben?",
          options: ["Im Zahlungscode", "Getrennt von der Zahlung, und er trifft sie an einer Tür", "Eingefroren, damit niemand die Worte ändern kann"],
        },
        {
          prompt: "Wer wird angerufen, wenn Zahlungen nachts scheitern?",
          options: ["Wer es zufällig sieht", "Eine benannte Rolle, auf der Karte aufgeschrieben", "Der ganze Chat der Ehrenamtlichen, alle auf einmal"],
        },
        {
          prompt: "Wo lebt die Karte?",
          options: ["Im Gedächtnis der ursprünglichen Autorin oder des ursprünglichen Autors", "Aufgeschrieben, neben der Anleitung, wie man die Prüfungen ausführt", "In einem privaten Chat, der verschwindet"],
        },
      ],
      noteLabel: "Die Karte für eine neue ehrenamtliche Person",
      noteHint: "Zeige, wo der Brief ist, wo die Zahlung ist und wen man anruft.",
    },
    scale: {
      title: "Wenn die Schlange lang wird",
      promise: "Lass die Zahl der Menschen wachsen, ohne das zu zerbrechen, was genau bleiben muss.",
      objectives: [
        "Unterscheide einen vollen Moment von einem Entwurf, der einfach verschwenderisch ist.",
        "Erkläre eine Warteschlange und einen Zwischenspeicher, ohne zu verstecken, was du dafür aufgibst.",
        "Schütze Genauigkeit und Fairness, während du wächst.",
      ],
      start: [
        "Skalierung ist das, was passiert, wenn mehr Menschen kommen, als die aktuelle Form halten kann. Zehn Menschen in einer Klinik sind nicht dasselbe wie eine Million Menschen, die in derselben Sekunde eine Karte kaufen. Beides ist wirklich. Das Erste braucht nicht die Maschinen des Zweiten. Das Zweite fällt um, wenn du so tust, als wäre es das Erste.",
        "Was wahr bleiben muss, darf nicht ungefähr werden. Eine Person wird einmal abgebucht. Ein Platz wird einmal verkauft. Ein Fahrschein ist gültig oder er ist es nicht. Hübsche Seiten können warten. Die genaue Aufzeichnung nicht.",
      ],
      how: [
        "Wenn eine Menge ankommt, stellt sie sich in eine Schlange. Eine Warteschlange ist diese Schlange für die Arbeit. Sie fühlt sich für jede Person langsamer an und hält den Raum, der entscheidet, davor, umgeworfen zu werden. Ein Zwischenspeicher wiederholt eine öffentliche Antwort, die ein paar Sekunden alt sein darf, damit die Datenbank nicht eine Million Mal dieselbe Frage gestellt bekommt. Eine Kopie eines Dienstes kann die Arbeit teilen, bei der nur gelesen wird. Kopien verzeihen keine Regel, die nur auf einer Maschine stimmte.",
        "Fairness gehört zur Skalierung. Eine Person mit einer schnelleren Verbindung soll sich nicht in eine Schlange vordrängeln können, von der du versprochen hast, dass sie gerecht ist. Schreibe auf, was »gerecht« bedeutet, bevor die Menge ankommt, nicht währenddessen.",
      ],
      expert: [
        "Die Reihenfolge der Schritte ist: Miss den wirklichen Schmerz, schütze die genaue Aufzeichnung, und füge dann eine Warteschlange oder einen Zwischenspeicher für den Teil hinzu, der nachgeben darf. Speichere eine Zahlung nicht zwischen. Lass die öffentliche Seite nicht auf die Zeile einhämmern, die genau bleiben muss. Kaufe keine größere Maschine als einzige Idee, sonst kaufst du sie nächstes Jahr wieder.",
        "Millionen Menschen zur gleichen Zeit sind ein bestimmtes Versprechen. Es braucht eine Zahl, eine Probe und einen Plan für die Minute, in der die Zahl überschritten wird. »Es wird schon gut gehen« ist kein Bauplan.",
      ],
      example: [
        "Der gewöhnliche Samstag von Harbor Market braucht nicht die Maschinen eines Festes. Die Festnacht schon. Die öffentliche Tafel darf ein paar Sekunden alt sein. Das Markieren eines Standes als geschlossen und jede Zahlung bleiben genau und gehen durch eine Schlange, wenn die Menge groß ist.",
        "Kundinnen und Kunden können einen Moment lang »geöffnet« sehen, nachdem ein Stand geschlossen hat. Sie dürfen niemals doppelt abgebucht werden, und es darf niemals zwei Menschen gesagt werden, dass sie dieselbe letzte Portion haben, wenn der Markt nummerierte Karten verkauft.",
      ],
      narration:
        "Skalierung heißt: mehr Menschen, als die aktuelle Form halten kann. Zehn Menschen und eine Million Menschen sind verschiedene Probleme. Was genau bleiben muss, bleibt genau: Eine Person wird einmal abgebucht, ein Platz wird einmal verkauft. Eine Warteschlange ist eine Schlange, die den Raum schützt, der entscheidet. Ein Zwischenspeicher darf eine öffentliche Antwort ein paar Sekunden wiederholen. Er darf sich keine Zahlung merken. Bei Harbor Market darf die Tafel kurz veraltet sein. Das Geld nicht.",
      checkPrompt: "Was muss wahr bleiben, während ein System wächst?",
      checkOptions: ["Die Seiten werden hübscher", "Die genauen Versprechen, zum Beispiel eine Person nur einmal abzubuchen", "Die Marke wird lauter", "Die Werkzeuge sind die neuesten"],
      benchTitle: "Festnacht",
      benchPrompt: "Eine Million Menschen werden um 10:00 Uhr versuchen, eine Karte für das Laternenfest zu kaufen. Was schützt du zuerst?",
      benchItems: [
        "Ein größeres Logo und eine schnellere Animation.",
        "Die genaue Aufzeichnung: eine Karte, ein Verkauf, keine doppelte Abbuchung. Die öffentliche Seite darf in einer Schlange warten.",
        "Eine hübschere Galerie der Laternen vom letzten Jahr.",
      ],
      benchSlots: [],
      caseOrg: "Laternenfest",
      caseFile: "LF-08",
      caseTitle: "Karten um 10:00 Uhr",
      caseSituation: [
        "Das Laternenfest verkauft eine begrenzte Zahl von Karten. Letztes Jahr ist die Seite um 10:00 Uhr eingefroren, und manche Menschen wurden doppelt abgebucht. Das Publikum ist die Öffentlichkeit, kein technisches Team. Die Menschen tippen noch einmal, wenn die Seite feststeckt.",
        "Du hast gewöhnliche Tage, und du hast diese Minute. Sie sollen nicht als dieselbe Minute entworfen werden.",
      ],
      caseTask: "Sage, was du zuerst schützt, was in einer Schlange warten darf und was du nicht zwischenspeicherst.",
      caseSteps: [
        "Benenne das genaue Versprechen: eine Karte, eine Abbuchung.",
        "Sage, was die Person sieht, während sie wartet, damit sie nicht in Panik zweimal tippt.",
        "Entscheide, was zwischengespeichert werden darf und was nicht.",
        "Schreibe in der Notiz die Reihenfolge der Handlungen für diese Minute.",
      ],
      decisions: [
        {
          prompt: "Was schützt du zuerst?",
          options: ["Eine hübschere Seite", "Eine Karte und eine Abbuchung, genau", "Einen neuen Werbefilm"],
        },
        {
          prompt: "Wie begegnet die Menge dem Verkaufsraum?",
          options: ["Jedes Tippen trifft die Zahlungszeile sofort, so hart es kann", "Eine Warteschlange, mit einem klaren Zustand des Wartens", "Schließ die Seite und verkaufe nur per Post"],
        },
        {
          prompt: "Was darf zwischengespeichert werden?",
          options: ["Die Zahlung selbst", "Ein öffentlicher Hinweis, zum Beispiel ob noch Karten da sind, ein paar Sekunden alt", "Nichts, auch die festen Bilder nicht"],
        },
      ],
      noteLabel: "Die Minute um 10:00 Uhr",
      noteHint: "Schreibe die Reihenfolge: was genau bleibt, was wartet und was die Person sieht.",
    },
    observe: {
      title: "Das System sehen",
      promise: "Wisse, welche Fragen du stellst, wenn etwas falsch aussieht, und auf welche Alarme eine Person handeln kann.",
      objectives: [
        "Trenne ein Protokoll, eine Kennzahl und eine Spur in einfachen Worten.",
        "Verfolge eine Anfrage von der Tür bis zur Aufzeichnung.",
        "Schreibe einen Alarm, der einem Menschen sagt, was zu tun ist.",
      ],
      start: [
        "Beobachtbarkeit heißt: Du kannst sagen, was das System tut, ohne zu raten. Wenn eine Person sagt »Die Tafel stimmt nicht«, brauchst du einen Weg hinzusehen, der nicht davon abhängt, dass die ursprüngliche Autorin oder der ursprüngliche Autor wach ist.",
        "Drei Fragen decken die meisten Nächte ab. Was hat diese eine Anfrage getan? Wie viele scheitern? Was hat das System zu dem Zeitpunkt aufgeschrieben?",
      ],
      how: [
        "Ein Protokoll ist eine Tagebuchzeile: Um diese Zeit wurde dieser Stand als geschlossen markiert, durch diese Art von Rolle. Es darf keine Geheimnisse enthalten und keine private Aufzeichnung einer Person über das hinaus, was die Nacht braucht. Eine Kennzahl ist eine Zahl über die Zeit: wie viele Male die Tafel in fünf Minuten nicht geladen hat. Eine Spur ist der Weg einer Anfrage durch die Räume, damit du sehen kannst, wo sie stehen geblieben ist.",
        "Ein Alarm ist eine Kennzahl mit einem Versprechen daran: Wenn diese Zahl eine Grenze überschreitet, soll eine benannte Person eine benannte Sache tun. Ein Alarm, auf den niemand handeln kann, ist Lärm, und Lärm lehrt die Menschen, den echten Alarm zu überhören.",
      ],
      expert: [
        "Entscheide die Fragen vor dem Ausfall. Schreibe an einem ruhigen Nachmittag: Wenn Sendungen nicht mehr als in Zustellung erscheinen, welche Spur öffne ich, welcher Zahl vertraue ich, welches Protokoll lese ich? Wenn du die Fragen um 02:14 Uhr erfindest, wirst du den Raum verpassen, der wirklich ausgefallen ist.",
        "Gesund ist ein Satz, kein grüner Punkt. »Gesund« heißt: Die öffentliche Tafel stimmt innerhalb weniger Sekunden mit der Datenbank überein, und gescheiterte Speicherungen sind sichtbar. Ein grüner Punkt, der eine feststeckende Warteschlange versteckt, ist der Weg, auf dem eine Nacht höflich verloren geht.",
      ],
      example: [
        "Harbor Market beobachtet drei Dinge. Die Zahl der gescheiterten Speicherungen. Das Alter des öffentlichen Zwischenspeichers. Und, wenn eine Person am Stand sagt »Es wurde nicht gespeichert«, den Weg dieser einen Anfrage.",
        "Der Alarm heißt: Wenn gescheiterte Speicherungen steigen, wecke die benannte zuständige Person und stoppe weitere Veröffentlichungen. Sie wird nicht geweckt, nur weil ein Bild langsam geladen wurde.",
      ],
      narration:
        "Du kannst nicht reparieren, was du nicht sehen kannst. Ein Protokoll ist eine Tagebuchzeile. Eine Kennzahl ist eine Zahl über die Zeit. Eine Spur ist der Weg einer Anfrage. Ein Alarm soll die Handlung benennen, die eine Person unternimmt. Bei Harbor Market wird, wenn Speicherungen zu scheitern beginnen, eine benannte zuständige Person geweckt, und die Veröffentlichungen hören auf. Ein langsames Bild weckt niemanden.",
      checkPrompt: "Eine Person am Stand sagt, die Änderung wurde nicht gespeichert. Was willst du zuerst?",
      checkOptions: [
        "Hoffen, dass es ein Einzelfall war",
        "Den Weg dieser einen Anfrage",
        "Eine neue Farbe auf dem Statuspunkt",
        "Einen Neustart, bevor du hinsiehst",
      ],
      benchTitle: "Ordne die Frage zu",
      benchPrompt: "Parcel & Pine, 02:14 Uhr. Sendungen erscheinen nicht mehr als in Zustellung. Ordne jedes Bedürfnis dem Werkzeug zu.",
      benchItems: ["Eine Spur, der Weg einer Anfrage", "Eine Kennzahl, eine Zahl über die Zeit", "Ein Protokoll, das Tagebuch dessen, was geschrieben wurde"],
      benchSlots: [
        "Folge der Aktualisierung eines Pakets durch die Räume",
        "Sieh, wie viele Aktualisierungen scheitern",
        "Lies, was das System geschrieben hat, als eine Zustellperson ein Paket markiert hat",
      ],
      caseOrg: "Parcel & Pine",
      caseFile: "PP-09",
      caseTitle: "02:14 Uhr, der Status wird still",
      caseSituation: [
        "Parcel & Pine zeigt Kundinnen und Kunden einen Status: verpackt, in Zustellung, zugestellt. Um 02:14 Uhr hören die Aktualisierungen »in Zustellung« auf. Die Zustellpersonen arbeiten noch. Die Kundinnen und Kunden laden neu und sehen nichts Neues. Die Person im Nachtdienst ist keine Entwicklerin und kein Entwickler.",
        "Du schreibst die Fragen, die sie stellen können sollen, und den Alarm, der jemanden hätte wecken sollen.",
      ],
      caseTask: "Sage, worauf du schaust, was der Alarm sagt und wofür es sich nicht lohnt, einen Menschen zu wecken.",
      caseSteps: [
        "Schreibe die drei Fragen: ein Paket, wie viele, was geschrieben wurde.",
        "Benenne den ersten Blick: den Weg einer Aktualisierung.",
        "Schreibe den Alarm als eine Handlung, nicht als eine Stimmung.",
        "Definiere in der Notiz »gesund« in einem Satz, den die Person im Dienst prüfen kann.",
      ],
      decisions: [
        {
          prompt: "Was ist der erste Blick?",
          options: ["Alles neu starten", "Der Weg einer Aktualisierung, die hätte angezeigt werden sollen", "Bis zum Morgen warten, falls es von allein heilt"],
        },
        {
          prompt: "Was sagt ein guter Alarm?",
          options: ["Irgendwas fühlt sich seltsam an", "Gescheiterte Aktualisierungen haben die Grenze überschritten. Tu dies und ruf diese Rolle an", "Schreibe eine E-Mail an die ganze Firma"],
        },
        {
          prompt: "Ein einzelnes Produktfoto lädt langsam. Weckst du die Person im Nachtdienst?",
          options: ["Ja, wecke sie bei jedem langsamen Bild", "Nein. Wecke sie bei den gescheiterten Statusaktualisierungen, nicht bei einem langsamen Bild", "Wecke sie die ganze Nacht, damit sie wachsam bleiben"],
        },
      ],
      noteLabel: "Was heute Nacht gesund heißt",
      noteHint: "Schreibe den Satz, den eine Person im Dienst prüfen kann, und die erste Frage, die sie stellt.",
    },
    security: {
      title: "Wer, und was sie tun dürfen",
      promise: "Trenne Identität von Erlaubnis, und lass private Tatsachen nicht auslaufen.",
      objectives: [
        "Unterscheide Authentifizierung und Autorisierung in einfachen Worten.",
        "Nenne drei gewöhnliche Wege, auf denen eine private Tatsache entkommt.",
        "Wähle absichtlich die kleinere Erlaubnis.",
      ],
      start: [
        "Die Authentifizierung antwortet: Wer bist du? Die Autorisierung antwortet: Was darfst du tun? Eine Anmeldung beweist das Erste. Sie gewährt nicht das Zweite. Wer sich als Schülerin oder Schüler anmelden kann, darf deshalb nicht die Noten aller Schülerinnen und Schüler sehen. Eine Person am Stand, die sich anmelden kann, darf nicht die Einnahmen eines anderen Standes sehen.",
        "Sicherheit für ein System, das Menschen benutzen, die keine Entwicklerinnen und Entwickler sind, ist vor allem genau dieses Trennen, und dazu Sorgfalt bei Geheimnissen. Menschen tun das Leichte. Das Leichte muss auch das Sichere sein.",
      ],
      how: [
        "Der Weg zwischen dem Browser und der Anwendung ist verschlüsselt, damit eine fremde Person im Netz die Seite nicht lesen kann. Geheimnisse, zum Beispiel Passwörter und Schlüssel, leben außerhalb des Projekts und außerhalb der Protokolle. Jede Person hat eine eigene Anmeldung. Ein gemeinsames Passwort fühlt sich freundlich an und macht es unmöglich, eine Handlung einer Person zuzuordnen oder sie zu entfernen, wenn jemand geht.",
        "Private Tatsachen laufen durch gewöhnliche Fehler aus. Sie werden in die Adresszeile gelegt, wo sie kopiert und protokolliert werden. Sie bleiben in einer Sicherung auf einem Laptop. Sie werden einer Rolle gezeigt, die sie nicht brauchte. Sie werden in ein Protokoll der Prüfliste geschrieben. Minimale Rechte heißt: Jede Rolle sieht nur, was die Aufgabe braucht.",
      ],
      expert: [
        "Bedrohungen sind konkret. Schreibe: Wer könnte diese Aufzeichnung wollen, was kann diese Person schon tun, und was würde als Auslaufen zählen. Ein Notenbuch läuft aus, wenn eine Schülerin oder ein Schüler die Noten einer anderen Person sieht, wenn ein verlorener Laptop die Sicherung enthält oder wenn sich eine Adresse mit einer Schülernummer erraten lässt. Dafür braucht es keine Filmhandlung.",
        "Sitzungen sind Cookies, die der Browser behält. Sie sollen für ein Skript auf einer anderen Seite unmöglich zu stehlen sein, kurz genug, um abzulaufen, und nutzlos, wenn sie in ein Protokoll kopiert werden. Begrenzungen der Versuche halten ein Skript davon ab, eine Million Passwörter zu probieren. Nichts davon ersetzt die einfache Trennung: wer du bist und was du tun darfst.",
      ],
      example: [
        "Harbor Market gibt jeder Person am Stand eine eigene Anmeldung. Sie darf den eigenen Stand bearbeiten. Sie darf nicht die Einnahmen des Standes nebenan öffnen. Die Rolle des Büros darf das. Die Öffentlichkeit kann die Öffnungszeiten sehen und sonst nichts.",
        "Eine Sicherung des Standbuchs ist verschlüsselt und liegt bei der benannten zuständigen Person, nicht auf einem privaten Laptop in einer Tasche. Die Adresse einer Seite enthält niemals eine private Summe.",
      ],
      narration:
        "Die Authentifizierung fragt, wer du bist. Die Autorisierung fragt, was du tun darfst. Eine Anmeldung ist keine Erlaubnis, alles zu sehen. Gib jeder Person eine eigene Anmeldung. Halte Geheimnisse aus dem Projekt und aus den Protokollen. Private Tatsachen laufen über Adresszeilen aus, über Sicherungen auf Laptops und über Rollen, die zu viel sehen können. Bei Harbor Market sieht eine Person am Stand den eigenen Stand, nicht die Einnahmen nebenan.",
      checkPrompt: "Welche Aussage stimmt?",
      checkOptions: [
        "Authentifizierung und Autorisierung sind zwei Wörter für dieselbe Sache",
        "Die Authentifizierung sagt, wer du bist. Die Autorisierung sagt, was du tun darfst",
        "Ein langes Passwort ist die ganze Sicherheit",
        "Die Seite zu verstecken ist so gut wie eine Erlaubnis",
      ],
      benchTitle: "Welche Entwürfe laufen aus?",
      benchPrompt: "Das Notenbuch des Westfield College. Wähle die drei Entwürfe, die auslaufen. Lass die drei sichereren in Ruhe.",
      benchItems: [
        "Ein gemeinsames Passwort für alle Lehrkräfte, an die Pinnwand im Lehrerzimmer geschrieben",
        "Die Noten einer Schülerin oder eines Schülers in der Adresszeile",
        "Die nächtliche Sicherung auf den privaten Laptop einer Lehrkraft kopiert",
        "Jede Lehrkraft und jede Schülerin oder jeder Schüler hat eine eigene Anmeldung",
        "Die Sicherung ist verschlossen, und nur eine benannte Rolle kann sie öffnen",
        "Eine Schülerin oder ein Schüler kann die eigenen Noten sehen, und eine Lehrkraft kann die eigene Klasse sehen",
      ],
      benchSlots: [],
      caseOrg: "Westfield College",
      caseFile: "WC-10",
      caseTitle: "Das Notenbuch",
      caseSituation: [
        "Westfield bewahrt die Noten jeder Schülerin und jedes Schülers auf. Lehrkräfte tragen sie ein. Schülerinnen und Schüler schlagen ihre eigenen nach. Eine Vorführung eines Anbieters benutzt ein Passwort für das ganze Personal, und die Schülernummer erscheint in der Webadresse, damit man einen Link leicht teilen kann.",
        "Die Schülerinnen und Schüler sind jung. Das Personal ist beschäftigt. Den leichten Weg werden sie gehen. Der leichte Weg muss der sein, der nicht ausläuft.",
      ],
      caseTask: "Sage, wer was sehen darf, und schließe drei Lecks.",
      caseSteps: [
        "Liste die Rollen auf: Schülerin oder Schüler, Lehrkraft, Büro.",
        "Schreibe, was jede Rolle sehen darf und was sie nicht darf.",
        "Markiere das gemeinsame Passwort, die Adresszeile und die Sicherung auf dem Laptop als die Lecks, die zu schließen sind.",
        "Beschreibe in der Notiz den sichereren Entwurf in Worten, die eine Jahrgangsleitung billigen könnte.",
      ],
      decisions: [
        {
          prompt: "Wie melden sich Menschen an?",
          options: ["Ein gemeinsames Passwort an der Pinnwand im Lehrerzimmer", "Jede Person hat eine eigene Anmeldung", "Keine Anmeldung, die Seite ist nur versteckt"],
        },
        {
          prompt: "Wer sieht die Noten einer Schülerin oder eines Schülers?",
          options: ["Jede Person, die sich anmelden kann", "Die Schülerin oder der Schüler sieht die eigenen. Eine Lehrkraft sieht ihre Klasse. Das Büro sieht, was seine Aufgabe braucht", "Die Noten sind öffentlich, um Anrufe beim Support zu sparen"],
        },
        {
          prompt: "Wo lebt die Sicherung?",
          options: ["Auf dem privaten Laptop einer Lehrkraft", "Verschlossen, und nur eine benannte Rolle öffnet sie", "Im Chat des Personals"],
        },
      ],
      noteLabel: "Das sicherere Notenbuch",
      noteHint: "Sage, wer was sieht und wie die drei Lecks geschlossen werden.",
    },
    futures: {
      title: "Was sich ändert, was bleibt",
      promise: "Bemerke echte Verschiebungen darin, wie Systeme gebaut werden, und weigere dich, das Versprechen zu verspielen.",
      objectives: [
        "Benenne Änderungen, die wirklich ankommen, ohne die Verkaufswörter.",
        "Benenne, was nicht veraltet: die Aufgabe, die Aufzeichnung, der Fehler, die Sorgfalt.",
        "Bevorzuge eine Zukunft, die du verlassen kannst.",
      ],
      start: [
        "Werkzeuge, Plattformen und Moden ändern sich. Menschen müssen trotzdem eine Aufgabe zu Ende bringen, einer Aufzeichnung vertrauen und Hilfe bekommen, wenn sie scheitert. Ein Zukunftstrend verdient Aufmerksamkeit, wenn er ändert, wo die Arbeit läuft, wer die Daten hält oder wie eine Person nach etwas fragt. Er verdient nicht Aufmerksamkeit, nur weil er neu ist.",
        "Systeme für Menschen, die keine Entwicklerinnen und Entwickler sind, werden weiterhin eine Tür für die Menschen brauchen und ein Unterstützungssystem dahinter. Diese Unterstützung kann eines Tages näher bei der Person sitzen, auf einem Gerät, oder weiter weg, in einem gemeinsamen Dienst. Das Versprechen muss beide Wege überstehen.",
      ],
      how: [
        "Beobachte drei Verschiebungen. Arbeit kann näher bei der Person laufen, sodass ein Kiosk oder ein Handy ein kleines Versprechen halten kann, auch wenn das Netz abbricht, und die Aufzeichnung später sendet. Die Organisation, die die Daten hält, muss nicht die sein, an die die Person denkt, also zählen Verträge und Ausstiege. Menschen können in gewöhnlicher Sprache fragen, und das heißt: Das System braucht unter dem Gespräch trotzdem eine klare Aufgabe.",
        "Was bleibt: von der Aufgabe her gestalten, eine Entscheidung, die in einem bekannten Raum lebt, eine Prüfliste, ein Weg zurück, eine Karte für die nächste Person, eine genaue Aufzeichnung, ein Weg, einen Fehler zu sehen, und eine Trennung zwischen der Frage, wer jemand ist, und der Frage, was diese Person tun darf. Die werden nicht ungültig, nur weil ein Anbieter geht.",
      ],
      expert: [
        "Eine zukunftssichere Wahl ist eine, die du verlassen kannst. Kannst du die Aufzeichnung exportieren, also vollständig mitnehmen? Kann ein anderes Team die Prüfungen ausführen? Kannst du die neue Tür ausschalten? Wenn die Antwort nein ist, hast du keine Zukunft gekauft. Du hast eine Falle gemietet. Schreibe den Ausstieg an dem Tag auf, an dem du einsteigst.",
        "Setze eine Schule, eine Klinik, einen Markt oder ein Fest nicht auf einen einzigen modischen Dienst, den du nicht einsehen und nicht verlassen kannst. Benutze das Neue am Rand, wo ein Ausfall zu verkraften ist. Halte die Aufzeichnung dort, wo du sie in zehn Jahren noch lesen kannst.",
      ],
      example: [
        "Harbor Market kann eines Tages eine Person am Stand die Zeiten sprechen lassen, statt sie zu tippen. Die Aufgabe ist unverändert: diese Zeiten, dieser Stand, diese Person, die das sagen darf. Die Aufzeichnung ist unverändert. Die gesprochene Tür ist eine neue Plattform vor denselben Räumen.",
        "Wenn der Sprachdienst schließt, bleibt die Handyseite. Das ist der Test. Der Markt behält die einzige Kopie seiner Zeiten nicht in einem Dienst, aus dem er sie nicht mitnehmen kann.",
      ],
      narration:
        "Werkzeuge werden sich ändern. Das Versprechen soll es nicht. Menschen müssen weiterhin eine Aufgabe zu Ende bringen, einer Aufzeichnung vertrauen und Hilfe bekommen, wenn sie scheitert. Du kannst Arbeit näher an die Person rücken oder sie in gewöhnlicher Sprache fragen lassen. Behalte einen Weg, zu gehen. Bei Harbor Market könnte eine gesprochene Tür vor demselben Standbuch sitzen. Wenn diese Tür schließt, gehört die Aufzeichnung immer noch dem Markt.",
      checkPrompt: "Was veraltet nicht?",
      checkOptions: [
        "Die aktuelle Mode des Anbieters",
        "Das Versprechen an die Person: die Aufgabe, die Aufzeichnung, die Sorgfalt, wenn es scheitert",
        "Die optische Mode dieses Jahres",
        "Ein Werbespruch über die Zukunft",
      ],
      benchTitle: "Was du behältst",
      benchPrompt: "Nationaler Lesesaal muss fünf Jahre vorausplanen. Welche Haltung nimmst du ein?",
      benchItems: [
        "Übernimm einen Werbespruch und einen einzigen Anbieter und lege die einzige Kopie des Katalogs dorthin.",
        "Bereite dich darauf vor, Werkzeuge zu wechseln, und lehne jede Wahl ab, die du nicht verlassen kannst. Der Katalog lässt sich mitnehmen.",
        "Friere jedes Werkzeug für immer ein, damit am Rand nichts Neues probiert werden kann.",
      ],
      benchSlots: [],
      caseOrg: "Nationaler Lesesaal",
      caseFile: "NR-11",
      caseTitle: "Fünf Jahre Katalog",
      caseSituation: [
        "Nationaler Lesesaal verleiht an die Öffentlichkeit und hält einen Katalog, auf den das Personal sich verlässt. Ein Anbieter bietet eine schöne neue Tür nach vorn an, unter der Bedingung, dass der Katalog nur in seinem Dienst lebt. Später zu gehen würde heißen, die Geschichte der Ausleihen zu verlieren.",
        "Leserinnen, Leser und das Personal am Tresen sind keine Entwicklerinnen und Entwickler. Sie werden eine einfachere Tür lieben. Sie werden einen Katalog nicht lieben, den sie nicht zurückbekommen.",
      ],
      caseTask: "Schreibe, was du behältst, worauf du dich vorbereitest zu ändern und was du dich weigerst zu verspielen.",
      caseSteps: [
        "Formuliere das Versprechen, das in fünf Jahren noch stimmen muss.",
        "Nenne eine neue Tür, die du am Rand auszuprobieren bereit wärst.",
        "Nenne den Ausstieg: wie der Katalog mit dir geht.",
        "Schreibe in der Notiz die Vorlage, die du dem Vorstand wirklich geben würdest.",
      ],
      decisions: [
        {
          prompt: "Was behältst du, egal was die Werkzeuge tun?",
          options: ["Die Beziehung zum Anbieter", "Den Katalog und die Ausleihaufzeichnung, lesbar ohne den Anbieter", "Den Werbespruch"],
        },
        {
          prompt: "Worauf bereitest du dich vor?",
          options: ["Zu bleiben, auch wenn du die Aufzeichnung nicht mitnehmen kannst", "Einen erprobten Weg zu gehen, bevor du von der neuen Tür abhängst", "Auf nichts. Fünf Jahre sind zu weit weg, um zu planen"],
        },
        {
          prompt: "Was lehnst du ab?",
          options: ["Einen Entwurf, bei dem die einzige Kopie in einem Dienst sitzt, den du nicht verlassen kannst", "Jede neue Tür, sogar eine kleine Probe", "Eine geschriebene Vorlage an den Vorstand"],
        },
      ],
      noteLabel: "Die Vorlage an den Vorstand",
      noteHint: "Sage, was du behältst, was du ausprobieren würdest und was du nicht verspielst.",
    },
  },
  brief: {
    title: "Harbor Market, von Anfang bis Ende",
    dek: "Ein Markt. Elf Versprechen. Eine Vorlage, die eine Direktion lesen kann.",
    situation: [
      "Du hast dieselben Ideen in einer Klinik, einem Busunternehmen, einer Schule, einem Krankenhaus, einer Hilfsorganisation, einem Fest, einem Paketnetz, einem College und einer Bibliothek geübt. Harbor Market ist der Ort, an dem sie sich treffen.",
      "Die Menschen an den Ständen sind keine Entwicklerinnen und Entwickler. Die Kundinnen und Kunden haben es eilig. Das Büro ist klein. Die Tafel muss an einem Samstagabend stimmen und in fünf Jahren immer noch dir gehören.",
    ],
    task: "Schreibe die Betriebsvorlage: eine Wahl für jedes Versprechen und eine Abschlussnotiz in deinen eigenen Worten.",
    steps: [
      "Lies deine früheren Fallnotizen im Dossier. Sie sind die Übung. Diese Seite ist die Übertragung.",
      "Beantworte jedes Versprechen für Harbor Market, nicht für die anderen Organisationen.",
      "Behalte die öffentliche Tafel, das Standbuch und die Menschen gleichzeitig im Blick.",
      "Sage in der Abschlussnotiz einer neuen Direktion, was niemals verspielt werden darf.",
    ],
    decisions: [
      { prompt: "Wo lebt die Werkbank des Personals?", options: ["Auf einem Laptop, der nach Hause geht", "Auf einer gemeinsamen Werkbank mit einem Verlauf", "Auf Papier"] },
      { prompt: "Wie begegnen die einkaufende Person, die Person am Stand und das Büro dem Standbuch?", options: ["Drei getrennte Systeme", "Drei Türen, eine Aufzeichnung", "Nur eine Handy-App, kein Schreibtisch"] },
      { prompt: "Was gestaltest du zuerst?", options: ["Die Bildschirme", "Die Aufgabe: was geöffnet ist und wer das sagen darf", "Das Logo"] },
      { prompt: "Wo lebt »Darf diese Person diesen Stand bearbeiten?«?", options: ["Nur im Browser", "In der Anwendung", "Nur in der Datenbank"] },
      { prompt: "Eine Prüfliste ist am Morgen eines Festes rot. Was passiert?", options: ["Die Änderung später am Tag trotzdem hinausschicken", "Sie blockieren. Mit der letzten grünen Fassung öffnen", "Die Prüfungen überspringen"] },
      { prompt: "Wie veröffentlichst du eine Änderung an der öffentlichen Tafel?", options: ["Alles, zur Öffnungszeit", "Ein kleiner Schritt, mit einem geprobten Weg zurück", "Still"] },
      { prompt: "Eine neue Person im Personal muss eine Feiertagsschließung ändern. Wie ist das System geformt?", options: ["Ein Haufen, Zahlungen eingeschlossen", "Die Worte getrennt von allem, was genau bleiben muss, mit einer Karte", "Eingefroren, damit sich nichts ändern kann"] },
      { prompt: "Was bleibt in einer vollen Nacht genau?", options: ["Die Animation", "Die Aufzeichnung einer Änderung und jede Zahlung", "Nichts, schließ den Markt"] },
      { prompt: "Eine Person am Stand sagt, eine Änderung wurde nicht gespeichert. Was willst du?", options: ["Hoffnung", "Den Weg dieser einen Anfrage und einen Alarm, auf den eine Person handeln kann", "Einen sofortigen Neustart als einziges Werkzeug"] },
      { prompt: "Wer sieht die privaten Notizen eines Standes?", options: ["Jede Person mit dem gemeinsamen Büro-Passwort", "Die Person am Stand und die Büro-Rolle, die sie braucht", "Die Öffentlichkeit"] },
      { prompt: "Eine neue gesprochene Tür wird angeboten. Was verlangst du?", options: ["Die einzige Kopie der Zeiten zieht in diesen Dienst", "Du kannst aussteigen. Die Aufzeichnung lässt sich mitnehmen", "Keine neue Tür darf jemals probiert werden"] },
    ],
    noteLabel: "Die Notiz an die Direktion",
    noteHint: "Sage, was Harbor Market niemals verspielen darf: die Aufzeichnung, die Menschen und den Weg zurück.",
    narration:
      "Das ist der ganze Markt, in einer Vorlage. Die Menschen an den Ständen sind keine Entwicklerinnen und Entwickler. Die Tafel muss an einem Samstagabend stimmen, und die Aufzeichnung muss in fünf Jahren immer noch dem Markt gehören. Wähle die gemeinsame Werkbank, eine Aufzeichnung hinter den Türen, eine Prüfliste, die nein sagen kann, eine kleine Veröffentlichung mit einem Weg zurück, eine Karte für die nächste Person, eine genaue Aufzeichnung, wenn die Menge ankommt, einen Weg, einen Fehler zu sehen, Erlaubnisse, die zur Aufgabe passen, und eine Zukunft, die du verlassen kannst.",
  },
};
