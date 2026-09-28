import type { OpsPack } from "./types";

export const de: OpsPack = {
  sections: {
    web: {
      title: "Das Web und das Internet",
      promise: "Unterscheiden Sie das Netz von den Dokumenten, die es transportiert, und folgen Sie einer Anfrage, bis der Server antwortet.",
      objectives: [
        "Trennen Sie das Web vom Internet in einem Satz.",
        "Nennen Sie IP, TCP und HTTP nach der Aufgabe, die sie jeweils erfüllen.",
        "Gehen Sie eine Anfrage vom offenen Port bis zur Antwort durch und lassen Sie Geheimnisse außen vor.",
      ],
      start: [
        "Das Internet ist das Netz der Computer. Das Web sind die Dokumente, der Ton und das Video, die diese Computer austauschen. Tim Berners-Lee zog diese Grenze: Im Internet finden Sie Computer, im Web finden Sie Werke. Eine Seite kann ausfallen, während die Kabel in Ordnung sind, und die Kabel können ausfallen, während die Seite noch eine Datei auf einer Platte ist.",
        "Ein Paket ist ein Stück dieser Arbeit plus ein Header, damit die Maschine am anderen Ende weiß, wozu das Stück da ist. Die Nachricht wird in Pakete zerlegt, die Pakete laufen als Bits, und Router sowie Switches leiten sie weiter. Am anderen Ende werden sie wieder in die richtige Reihenfolge gesetzt. Stimmen Header und Daten nicht überein, kann die empfangende Seite nichts sicher anzeigen.",
      ],
      how: [
        "Drei Vereinbarungen übernehmen fast den ganzen Transport. IP bringt Pakete von einem Netz ins andere. TCP prüft, dass diese Pakete angekommen sind, und setzt sie zu einer Verbindung zusammen. HTTP ist die Vereinbarung für eine Anfrage im Web: eine Methode, ein Pfad, Header, und danach ein Status, Header und ein Body.",
        "Ein Client stellt eine Anfrage. Ein Server hört auf einem Port. Der Server nimmt die TCP-Verbindung an, liest die Methode, den Pfad und die Header und prüft, ob die Methode erlaubt ist und ob er den Pfad kennt. Eine Datei wird von der Platte gelesen. Eine Seite aus einem Datensatz geht an die Anwendung. Ein API-Aufruf führt den Code aus, der Daten liest oder ändert. Die Antwort trägt einen Status wie 200, 404 oder 500, die Header und den Body. Bevor sie hinausgeht, prüft der Server, dass in diesem Body kein Geheimnis steht und dass eine Weiterleitung benutzt wird, wenn eine nötig ist. Danach geht die Antwort über dieselbe Verbindung zurück, in Paketen. Älteres HTTP, oder ein Client, der es verlangt, schließt die Verbindung. Sonst kann sie offen bleiben, damit die nächste Anfrage den Handshake überspringt.",
      ],
      expert: [
        "Die Maschine im Rack ist Hardware: ein Blade oder ein Tower, klein genug für ein Gehäuse, mit Prozessor, Arbeitsspeicher, Speicher und Netzwerkanschlüssen. Eine Serverfarm ist ein Gebäude voll davon. Der Server, den Sie konfigurieren, ist Software, die diese Hardware benutzt. Beides heißt im Alltag Server. Wenn eine Statusseite ausfällt, müssen Sie trotzdem wissen, welches von beiden Sie meinen.",
        "Northline Payments hält für Mitarbeitende, die nicht entwickeln, eine öffentliche Statuszeile bereit, offen oder angehalten. Die Zeile ist eine Datei. Der Schlüssel des Hauptbuchs bleibt in der Umgebung der Anwendung. Ein 500, der den Schlüssel ausgibt, ist kein Ausfall des Internets. Das ist eine Antwort, die ihre letzte Prüfung nicht bestanden hat.",
      ],
      figure: "Eine Anfrage läuft als Pakete über das Internet und wird auf dem Server zu einer HTTP-Antwort.",
      links: [],
      narration:
        "Das Internet ist das Netz der Computer. Das Web sind die Dokumente, die diese Computer austauschen. Ein Paket trägt ein Stück der Arbeit und einen Header. IP bewegt Pakete, TCP prüft die Verbindung, und HTTP trägt Anfrage und Antwort. Der Server hört, nimmt an, liest, prüft, antwortet und schließt danach die Verbindung oder hält sie offen. Der Schlüssel des Hauptbuchs bleibt von der Statusseite fern.",
      checkPrompt: "Welcher Satz trifft den Unterschied zwischen dem Web und dem Internet?",
      checkOptions: [
        "Das Web sind die Kabel zwischen den Gebäuden",
        "Das Web sind die Dokumente und die Medien; das Internet ist das Netz, das die Pakete bewegt",
        "Es sind zwei Namen für dieselbe Sache",
        "Das Web ist nur das Fenster des Browsers",
      ],
      labTitle: "Eine Statusanfrage ausführen",
      labScene: [
        "Der Statusdienst von Northline hört. Die Anfrage auf der Leitung lautet GET /status HTTP/1.0, host status.northline.example, Connection: close. Die Datei /status enthält die Zeile Northline payments: open. Die Umgebung hält LEDGER_KEY. Dieser Schlüssel gehört nicht zur Datei.",
        "Bringen Sie die Arbeit des Servers in die Reihenfolge, in der sie wirklich abläuft. Wählen Sie dann den Status, den Body und das, was mit der Verbindung geschieht. Führen Sie es aus, bevor Sie es festhalten. Das Panel zeigt die Antwort, die Ihre Auswahl senden würde.",
      ],
      labWarn: "Diese Antwort enthält LEDGER_KEY, oder sie ist ein 500. Die Statusdatei existiert. Der Schlüssel bleibt in der Umgebung.",
      fields: {
        path: {
          prompt: "Bringen Sie die Arbeit des Servers in die richtige Reihenfolge.",
          options: [
            "Auf dem Port hören",
            "Die TCP-Verbindung annehmen",
            "Die Methode, den Pfad und die Header lesen",
            "Die Methode und den Pfad prüfen",
            "Den Status, die Header und den Body bauen",
            "Die Antwort senden und dann diese Verbindung schließen",
          ],
        },
        status: { prompt: "Welcher Status passt zu dieser Anfrage?", options: ["200 OK", "404 Not Found", "500 Internal Server Error"] },
        body: { prompt: "Welcher Body wird gesendet?", options: ["Die Statusdatei", "LEDGER_KEY aus der Umgebung", "Ein leerer Body"] },
        connection: {
          prompt: "Der Client hat Connection: close bei HTTP/1.0 verlangt. Was tut der Server nach der Antwort?",
          options: ["Die Verbindung schließen", "Für weitere Anfragen offen lassen"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-01",
      caseTitle: "Die Statusseite und der Schlüssel",
      caseSituation: [
        "Um 08:10 zeigte die Statusseite einen 500 und den Text von LEDGER_KEY. Die Person in der Nachtschicht sagte, das Internet sei ausgefallen. Die Netzgrafiken waren ruhig. Die Datei /status war noch die Zeile Northline payments: open.",
        "Die Mitarbeitenden am Zahlungsschalter laden diese Seite neu, bevor sie die Kassen öffnen. Es sind keine Entwicklerinnen und Entwickler. Nötig ist eine wahre Zeile, und ein Schlüssel darf dort nie erscheinen.",
      ],
      caseTask: "Entscheiden Sie, was wirklich ausgefallen ist, was die nächste Antwort enthalten muss und was mit der Verbindung geschieht.",
      caseSteps: [
        "Trennen Sie das ruhige Netz von der Antwort, für die sich der Server entschieden hat.",
        "Lesen Sie die Anfrage noch einmal: GET /status, HTTP/1.0, Connection: close, und die Datei existiert.",
        "Beantworten Sie die drei Entscheidungen.",
        "Sagen Sie in der Notiz, was der Zahlungsschalter sehen soll und was dort nie erscheinen darf.",
      ],
      decisions: [
        {
          prompt: "Was ist um 08:10 ausgefallen?",
          options: ["Das Internet, gemeint sind die Kabel", "Der Server hat schlecht geantwortet, obwohl die Datei existiert", "Die Farbe des Browsers"],
        },
        {
          prompt: "Was enthält die nächste Antwort?",
          options: ["Denselben Body, damit die Entwicklung den Schlüssel sieht", "Die Statuszeile, und der Schlüssel bleibt auf dem Server", "Den Schlüssel in einem Header, was sicherer sei"],
        },
        {
          prompt: "Der Client hat HTTP/1.0 und Connection: close gesendet. Was geschieht nach einer gültigen Antwort?",
          options: ["Der Socket bleibt für immer offen", "Der Server schließt die Verbindung", "Für dieselbe Antwort wird eine zweite Verbindung geöffnet"],
        },
      ],
      noteLabel: "Ihre Notiz an den Zahlungsschalter",
      noteHint: "Schreiben Sie, was /status zeigen soll und was auf dieser Seite nie erscheinen darf.",
    },
    git: {
      title: "Git und die gemeinsame Historie",
      promise: "Bewahren Sie eine Historie, der eine fremde Person folgen kann, und halten Sie Geheimnisse heraus.",
      objectives: [
        "Sagen Sie, was Git tut und was ein Host wie GitHub hinzufügt.",
        "Committen Sie eine kleine Änderung auf einem Branch, mit einer Nachricht, die sagt, was sich geändert hat.",
        "Lassen Sie main grün und die Zugangsdaten aus dem Baum.",
      ],
      start: [
        "Git ist die Historie auf der Maschine: Schnappschüsse, Branches und der Unterschied zwischen dem, was Sie haben, und dem, was Sie zuletzt festgehalten haben. Ein Host wie GitHub speichert diese Historie dort, wo anderen Personen Zugang gegeben werden kann. Git funktioniert ohne den Host. Der Host ist nicht die Historie.",
        "Ein Repository ist lesbar, wenn sein Name etwas bedeutet und die README sagt, was das Projekt ist, wovon es abhängt, wie es läuft und wie es getestet wird. Committen Sie in kleinen Stücken, die jeweils nur eine Sache tun: ein Feature, eine Korrektur oder ein Refactoring. Ein einzelner Commit am Ende namens Finale Version ist ein Haufen, keine Historie.",
      ],
      how: [
        "Schreiben Sie die Nachricht im Imperativ und benennen Sie die Änderung. Eine Nachricht lautet: 404 zurückgeben, wenn der Statuspfad unbekannt ist. Update, Änderungen und Finale Version sagen der nächsten Person nicht, was sich geändert hat. Prüfen Sie den Diff, bevor Sie committen. Nehmen Sie Konsolenausgaben, Reste und Dateien heraus, die nicht dazugehören.",
        "Arbeiten Sie auf einem Branch, der nach der Aufgabe benannt ist, zum Beispiel feature/status-404. Führen Sie ihn erst in main zusammen, wenn er baut, die Tests bestehen und die Checks grün sind. Main ist die Linie, die eine andere Person ausführen kann. Passwörter, Schlüssel, Tokens, Verbindungszeichenfolgen und personenbezogene Daten bleiben in der Umgebung oder in einer Datei, die gitignore ausschließt. Landet ein Live-Schlüssel in einem Commit, entfernen Sie ihn und rotieren Sie den Schlüssel. Ein privates Repository ist kein Tresor für einen Live-Schlüssel.",
      ],
      expert: [
        "Die Anordnung gehört zur Historie. Quelltext, Tests, Dokumente und Konfiguration liegen an offensichtlichen Stellen. Committen Sie keine Build-Ausgabe, keine Ordner mit Abhängigkeiten und keine Editorreste, es sei denn, das Projekt nennt einen Grund. Wenn sich ändert, wie das Projekt läuft, ändern Sie die README in derselben Arbeit.",
        "Der Statusdienst von Northline ist ein kleines Repository. Der Baum vor Ihnen enthält eine echte Korrektur, eine Zeile in der README, eine .env mit einem Live-Schlüssel, eine gebaute Datei und eine flüchtige Notiz. Nur zwei davon gehören in den nächsten Commit, und dieser Commit landet nicht von allein auf main.",
      ],
      figure: "Die Korrektur und die README gehen auf einen Branch. Geheimnis, Build und Notiz bleiben draußen. Main bewegt sich erst, wenn die Checks grün sind.",
      links: [],
      narration:
        "Git ist die Historie auf der Maschine. Ein Host wie GitHub ist der Ort, an dem sich diese Historie teilen lässt. Committen Sie kleine Stücke auf einem Branch, mit einer Nachricht, die die Änderung benennt. Main bleibt grün. Geheimnisse bleiben aus dem Baum, und ein durchgesickerter Schlüssel wird rotiert.",
      checkPrompt: "Was ist GitHub, neben Git?",
      checkOptions: [
        "Die Versionsverwaltung, die auf Ihrer Maschine läuft",
        "Ein Host für Git-Repositories, mit Zugang, den Sie vergeben können",
        "Der Server, der die Statusseite bereitstellt",
        "Der Monitor, der Sie nachts anruft",
      ],
      labTitle: "Den Commit wählen",
      labScene: [
        "Der Arbeitsbaum hat fünf Änderungen. README.md erklärt, wie die Checks laufen. src/status.ts gibt 404 zurück, wenn der Pfad unbekannt ist. .env enthält API_KEY=live-secret. dist/app.js ist Build-Ausgabe. notes.tmp ist eine flüchtige Notiz.",
        "Wählen Sie die Dateien für einen Commit, die Nachricht und den Branch. Führen Sie es aus und lesen Sie den Commit, den Sie gleich anlegen. Main soll die letzte grüne Linie bleiben.",
      ],
      labWarn: "Dieser Commit enthält ein Geheimnis, eine Build-Ausgabe oder eine flüchtige Notiz, oder er landet auf main. Lassen Sie den Schlüssel draußen und lassen Sie main, wo es ist.",
      fields: {
        files: {
          prompt: "Welche Dateien gehören in diesen Commit?",
          options: [
            "README.md, wie die Checks laufen",
            "src/status.ts, unbekannte Pfade geben 404 zurück",
            ".env, API_KEY=live-secret",
            "dist/app.js, Build-Ausgabe",
            "notes.tmp, eine flüchtige Notiz",
          ],
        },
        message: {
          prompt: "Welche Nachricht gehört auf den Commit?",
          options: ["Update", "404 zurückgeben, wenn der Statuspfad unbekannt ist", "Finale Version"],
        },
        branch: {
          prompt: "Wohin landet dieser Commit?",
          options: ["Auf main, jetzt", "Auf feature/status-404, und main bleibt, wie es ist"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-02",
      caseTitle: "Der Schlüssel auf main",
      caseSituation: [
        "Eine beauftragte Person hat einen Commit nach main geschoben. Die Nachricht lautet Finale Version. Der Diff fügt die Korrektur für 404 hinzu und auch .env mit einem Live-Schlüssel. Einen Branch gibt es nicht, und die README sagt noch, dass sich das Projekt nicht ausführen lässt.",
        "Der Statusdienst ist das, worauf der Zahlungsschalter am Morgen vertraut. Die nächste Person muss main ausführen können, und der Live-Schlüssel muss aufhören zu funktionieren.",
      ],
      caseTask: "Entscheiden Sie, was mit dem Schlüssel geschieht, wie die Korrektur beschrieben wird und wohin die nächste Arbeit zuerst kommt.",
      caseSteps: [
        "Behandeln Sie den Schlüssel als schon offengelegt, auch wenn das Repository privat ist.",
        "Trennen Sie die nützliche Korrektur von den Dateien, die nie in einem Commit hätten sein dürfen.",
        "Beantworten Sie die drei Entscheidungen.",
        "Sagen Sie in der Notiz, was Sie rotieren und was main morgen enthalten darf.",
      ],
      decisions: [
        {
          prompt: "Der Live-Schlüssel steht im Commit. Was tun Sie?",
          options: ["Ihn lassen, weil das Repository privat ist", "Ihn aus dem Baum nehmen und den Schlüssel rotieren", "Den Schlüssel per E-Mail an das Team schicken, damit eine Kopie existiert"],
        },
        {
          prompt: "Welche Nachricht gehört zur Korrektur?",
          options: ["Update", "404 zurückgeben, wenn der Statuspfad unbekannt ist", "Finale Version"],
        },
        {
          prompt: "Wohin kommt die nächste Änderung zuerst?",
          options: ["Direkt auf main", "Auf einen Branch, und danach auf main, wenn die Checks grün sind", "In einer Zip-Datei im Chat"],
        },
      ],
      noteLabel: "Ihre Notiz an die nächste Person am Repository",
      noteHint: "Schreiben Sie, was Sie mit dem durchgesickerten Schlüssel tun und was main morgen enthalten muss.",
    },
    devops: {
      title: "Entwicklung und Betrieb",
      promise: "Bauen, prüfen und veröffentlichen Sie als eine fortlaufende Praxis und messen Sie sie mit vier Zahlen.",
      objectives: [
        "Definieren Sie DevOps als Entwicklung und Betrieb auf einem Weg zur Veröffentlichung.",
        "Ordnen Sie eine Aufgabe der Entwicklung, dem Betrieb oder der Automatisierung zu.",
        "Lesen Sie Bereitstellungshäufigkeit, Vorlaufzeit, Fehlerrate und Wiederherstellungszeit aus einem Log.",
      ],
      start: [
        "DevOps verbindet Entwicklung und Betrieb, damit Software als eine Praxis gebaut, geprüft und veröffentlicht wird und der Dienst danach erreichbar bleibt. Es ist fortlaufend. Das Ziel ist Software, die sich betreiben lässt, nicht eine Übergabe über eine Mauer.",
        "Die Entwicklung schreibt die Änderung, fügt die Funktion hinzu, behebt den Defekt, führt die Unit-Tests aus, entwirft die Anwendung, bewahrt die Versionshistorie und arbeitet in einer Entwicklungsumgebung. Der Betrieb betreibt den Dienst, pflegt die Infrastruktur, hält ihn verfügbar, beobachtet die Produktion, betreibt die Server und das Netz, stellt bereit und verantwortet die Produktion. Sie werden sich oft spezialisieren. Trotzdem müssen Sie sehen, wo sich die beiden Seiten treffen.",
      ],
      how: [
        "Automatisierung nimmt manuelle Arbeit weg, die keine Person braucht: den Testlauf, die Bereitstellung, das Rollback. Was gut heißt, entscheidet weiterhin eine Person. Die Maschine wiederholt die Schritte, die nicht davon abhängen dürfen, wer gerade wach ist.",
        "Das können Sie an einem System üben, das Ihnen allein gehört. Historie, Checks und der Weg zurück müssen für die nächste Person trotzdem verständlich bleiben, auch für Sie später. Vier Zahlen aus dem Forschungsprogramm DORA halten die Praxis ehrlich. Die Bereitstellungshäufigkeit sagt, wie oft Sie bereitstellen. Die Vorlaufzeit ist die Zeit zwischen der Annahme einer Änderung und ihrer Bereitstellung. Die Fehlerrate sagt, wie oft eine Bereitstellung scheitert. Die Wiederherstellungszeit sagt, wie lange es dauert, den Dienst wiederherzustellen.",
      ],
      expert: [
        "Eine Veröffentlichung im Monat, eine Woche Vorlaufzeit, Fehler, die bis Montag warten, und keine aufgeschriebene Wiederherstellung: das ist eine Praxis, die sich selbst nicht sehen kann. Die vier Zahlen ersetzen das Urteil nicht. Sie verhindern, dass Sie eine seltene, brüchige Veröffentlichung einen Erfolg nennen, nur weil die Demo ruhig aussah.",
        "Northline hat im Log des Labors viermal bereitgestellt. Eine dieser Bereitstellungen ist gescheitert. Der Dienst war am selben Abend wieder da. Ordnen Sie die Arbeit ein und lesen Sie dann die vier Zahlen aus dem Log. Eine gescheiterte Bereitstellung zählt als Bereitstellung.",
      ],
      figure: "Entwicklung ändert die Software. Betrieb betreibt sie. Automatisierung wiederholt die Schritte, die nicht davon abhängen dürfen, wer wach ist. Vier Zahlen sagen, ob die Veröffentlichung gesund ist.",
      links: [{ href: "https://dora.dev/", label: "DORA" }],
      narration:
        "DevOps verbindet Entwicklung und Betrieb, damit eine Änderung gebaut, geprüft, veröffentlicht und weiter betrieben wird. Automatisierung übernimmt die manuellen Schritte, die keine Person brauchen sollten. Vier Zahlen von DORA halten das ehrlich: wie oft Sie bereitstellen, wie lange es von der Annahme bis zur Bereitstellung dauert, wie oft eine Bereitstellung scheitert und wie lange eine Wiederherstellung dauert.",
      checkPrompt: "Wie viele Metriken von DORA messen Lieferung und Wiederherstellung?",
      checkOptions: [
        "Eine: wie oft Sie bereitstellen",
        "Vier: Häufigkeit, Vorlaufzeit, Fehlerrate und Wiederherstellungszeit",
        "Zwölf: eine für jeden Monat",
        "Keine: DevOps ist nur eine Stimmung",
      ],
      labTitle: "Die Woche lesen",
      labScene: [
        "Das Log von Northline, in Ortszeit. Montag 09:00 angenommen, 11:00 bereitgestellt, gelungen. Dienstag 10:00 angenommen, 18:00 bereitgestellt, gescheitert, 20:30 Dienst wiederhergestellt. Donnerstag 09:00 angenommen, 09:30 bereitgestellt, gelungen. Freitag 12:00 angenommen, 13:00 bereitgestellt, gelungen.",
        "Ordnen Sie drei Arbeiten ein. Lesen Sie dann die vier Zahlen aus diesem Log. Die Vorlaufzeit am Dienstag geht von 10:00 bis 18:00. Die Wiederherstellung geht von der gescheiterten Bereitstellung bis 20:30. Zählen Sie die gescheiterte Bereitstellung bei der Häufigkeit mit.",
      ],
      labWarn: "Das Log ist die Quelle. Prüfen Sie jede Zahl an den Uhrzeiten, bevor Sie sie festhalten.",
      fields: {
        code: {
          prompt: "Den Unit-Test für die Statuszeile zu schreiben, ist welche Art von Arbeit?",
          options: ["Entwicklung", "Betrieb", "Automatisierung"],
        },
        watch: {
          prompt: "Die Fehlerquote der Produktion zu beobachten, ist welche Art von Arbeit?",
          options: ["Entwicklung", "Betrieb", "Automatisierung"],
        },
        rollback: {
          prompt: "Ein Skript, das eine gescheiterte Bereitstellung zurückrollt, ohne dass jemand es eintippt, ist welche Art von Arbeit?",
          options: ["Entwicklung", "Betrieb", "Automatisierung"],
        },
        frequency: {
          prompt: "Wie viele Bereitstellungen stehen in diesem Log?",
          options: ["Eine in dieser Woche", "Vier in dieser Woche", "Zwanzig in dieser Woche"],
        },
        lead: {
          prompt: "Wie lang ist die Vorlaufzeit der Änderung vom Dienstag, von der Annahme bis zur Bereitstellung?",
          options: ["30 Minuten", "8 Stunden", "Eine Woche"],
        },
        fail: {
          prompt: "Wie viele dieser Bereitstellungen sind gescheitert?",
          options: ["Keine", "Eine von vier", "Alle"],
        },
        restore: {
          prompt: "Wie lange dauerte es, den Dienst nach der gescheiterten Bereitstellung vom Dienstag wiederherzustellen?",
          options: ["10 Minuten", "2 Stunden 30 Minuten", "Das Wochenende"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-03",
      caseTitle: "Die Wiederherstellung am Wochenende",
      caseSituation: [
        "Im letzten Quartal hat Northline einmal im Monat bereitgestellt. Eine Änderung, die am ersten Montag angenommen wurde, ging oft erst drei Wochen später hinaus. Ungefähr eine von drei Bereitstellungen scheiterte, und der Dienst blieb manchmal bis zum nächsten Montag falsch. Ein Skript zum Zurückrollen gab es nicht.",
        "Jemand am Schalter sagte, DevOps gelte hier nicht, weil es kein getrenntes Betriebsteam gebe. Der Zahlungsstatus bleibt der Dienst des Schalters. Das Log im Labor ist die neuere Woche, in der ein Ausfall noch am selben Abend behoben wurde.",
      ],
      caseTask: "Entscheiden Sie, was eine einzelne Person trotzdem tun kann, welche Zahl die Wiederherstellung ist und was ohne eine Person an der Tastatur laufen soll.",
      caseSteps: [
        "Nehmen Sie das Log aus dem Labor als Beleg, nicht die Erinnerung an das Quartal.",
        "Nennen Sie das Intervall der Wiederherstellung getrennt von der Vorlaufzeit.",
        "Beantworten Sie die drei Entscheidungen.",
        "Schreiben Sie in der Notiz die vier Zahlen der Laborwoche und nennen Sie den Schritt, der automatisch sein soll.",
      ],
      decisions: [
        {
          prompt: "Es gibt kein getrenntes Betriebsteam. Was tun Sie in der Nacht eines Ausfalls?",
          options: ["Auf ein Team warten, das es nicht gibt", "Den Ausfall nachverfolgen, den Dienst wiederherstellen und die vier Zahlen aufschreiben", "DevOps als etwas behandeln, das nur eine Abteilung kann"],
        },
        {
          prompt: "Welches Intervall im Log des Labors ist die Wiederherstellungszeit?",
          options: ["Donnerstag, von 09:00 bis 09:30", "Dienstag, von der gescheiterten Bereitstellung um 18:00 bis 20:30", "Die Anzahl der Bereitstellungen in der Woche"],
        },
        {
          prompt: "Was soll automatisch sein?",
          options: ["Eine gescheiterte Bereitstellung verbergen, damit die Tafel ruhig bleibt", "Das Rollback, damit es nachts niemand eintippen muss", "Jede Änderung an der Produktion, ohne Aufzeichnung"],
        },
      ],
      noteLabel: "Ihre Notiz zur Lieferung der Woche",
      noteHint: "Schreiben Sie die vier Zahlen der Laborwoche und nennen Sie den Schritt, der ohne eine Person laufen soll.",
    },
    finops: {
      title: "Kosten, Vertrauen und Wert",
      promise: "Wissen Sie, wofür das Geld da ist, und lehnen Sie eine Rechnung ab, die kein Ergebnis kauft.",
      objectives: [
        "Behandeln Sie ein gemeinsames kostenpflichtiges Konto als anvertrautes Gut, nicht als freie Kapazität.",
        "Ordnen Sie Cloud-Kosten dem Dienst zu, der sie verursacht, und begrenzen Sie, was ungenutzt ist.",
        "Beurteilen Sie die Ausgabe für ein Modell nach dem Ergebnis, das eine Person wirklich nutzt.",
      ],
      start: [
        "Sobald ein Dienst echt ist, sind manche Werkzeuge bezahlt: Runner, Datenbanken, Sitze, Modelle. Ein gemeinsames kostenpflichtiges Konto ist ein anvertrautes Gut. Persönliche Arbeit und stille Kopien von Produktionsdaten gehören nicht darauf. Die Rechnung ist Teil des Systems.",
        "FinOps ist die Praxis, diese Kosten zu sehen, sie dem Dienst zuzuordnen, der sie verursacht, und zu entscheiden, was bleibt. Eine Fachperson kann später tiefer gehen. Die Entscheidung vor Ihnen ist schon konkret: behalten, begrenzen oder stoppen.",
      ],
      how: [
        "CI-Runner, die nachts ungenutzt dastehen, sind keine kostenlose Geschwindigkeit. Begrenzen Sie sie auf die Builds, die Sie wirklich ausführen, und belassen Sie diese Minuten bei dem Dienst, der sie braucht. Eine Produktionsdatenbank, die das Hauptbuch hält, ist der Dienst. Sie stoppen sie nicht, um die Rechnung kleiner zu machen, und Sie verstecken sie nicht auf einer persönlichen Karte.",
        "Tokens eines Modells sind Kosten mit einer Frage: Erzeugt diese Nutzung ein Ergebnis, das jemand nutzt? Die Token-Ökonomie betrachtet Herstellung, Verbrauch und Kosten dieser Nutzung über die ganze Lebensdauer. Eine nächtliche Zusammenfassung, die seit einem Monat niemand geöffnet hat, ist kein Ergebnis. Ein größeres Kontextfenster repariert keine ungelesene Seite. Stoppen Sie das, bis eine Person das Ergebnis in einer Entscheidung nutzt.",
      ],
      expert: [
        "Begrenzen ist nicht stoppen. Begrenzen Sie die ungenutzte Kapazität von etwas, das Sie noch brauchen. Stoppen Sie etwas, das niemand nutzt oder das das Vertrauen in das gemeinsame Konto bricht. Behalten Sie, worauf der Dienst angewiesen ist, und sagen Sie, zu welchem Dienst es gehört.",
        "Im Monat von Northline stehen vier Zeilen auf einem gemeinsamen Konto: CI, die Hauptbuch-Datenbank, eine ungelesene Modellzusammenfassung und eine persönliche Transkodierung. Das Labor ist diese Rechnung. Der Abschluss ist die Notiz, die Sie an die Person senden würden, die sie bezahlt.",
      ],
      figure: "Behalten Sie, worauf der Dienst angewiesen ist. Begrenzen Sie, was ungenutzt ist. Stoppen Sie, was niemand nutzt, und nehmen Sie persönliche Arbeit vom gemeinsamen Konto.",
      links: [
        { href: "https://www.finops.org/", label: "FinOps Foundation" },
        { href: "https://www.tokeneconomics.com/state-of-tokenomics/", label: "State of Tokenomics" },
      ],
      narration:
        "Ein gemeinsames kostenpflichtiges Konto ist ein anvertrautes Gut. FinOps ordnet jede Ausgabe dem Dienst zu, der sie verursacht. Begrenzen Sie ungenutzte Runner. Behalten Sie die Hauptbuch-Datenbank. Stoppen Sie Ausgaben für ein Modell, die niemand nutzt. Nehmen Sie persönliche Arbeit vom gemeinsamen Konto.",
      checkPrompt: "Wann ist die Ausgabe für ein Modell gerechtfertigt?",
      checkOptions: [
        "Wenn die Rechnung groß genug ist, um ernst zu wirken",
        "Wenn die Tokens ein Ergebnis ändern, das eine Person wirklich nutzt",
        "Wenn der Anbieter sagt, das Modell sei fortgeschritten",
        "Wenn der Schlüssel geteilt wird, damit alle es ausprobieren können",
      ],
      labTitle: "Die Rechnung markieren",
      labScene: [
        "Ein gemeinsames Konto von Northline, dieser Monat. CI-Runner, 400 Dollar, nachts größtenteils ungenutzt, und die echten Builds brauchen davon nur einen Bruchteil. Die Hauptbuch-Datenbank, 220 Dollar, hält den Zahlungsdatensatz. Modellzusammenfassungen, 900 Dollar, und die Seite mit den Zusammenfassungen hat seit einem Monat keine Leserinnen und Leser. Persönliche Videotranskodierung, 300 Dollar, von einer Person auf dem gemeinsamen Konto ausgeführt.",
        "Markieren Sie jede Zeile mit Behalten, Begrenzen oder Stoppen. Führen Sie es aus und lesen Sie die Rechnung, die Sie gleich verteidigen. Begrenzen nimmt eine persönliche Arbeit nicht weg. Die ungelesenen Zusammenfassungen zu behalten lässt die 900 Dollar stehen.",
      ],
      labWarn: "Eine persönliche Arbeit liegt noch auf dem gemeinsamen Konto, oder die ungelesenen Zusammenfassungen werden weiter bezahlt. Das anvertraute Gut und das Ergebnis sind der Maßstab.",
      fields: {
        ci: { prompt: "CI-Runner, 400 Dollar, nachts größtenteils ungenutzt.", options: ["Behalten", "Begrenzen", "Stoppen"] },
        db: { prompt: "Hauptbuch-Datenbank, 220 Dollar, der Zahlungsdatensatz.", options: ["Behalten", "Begrenzen", "Stoppen"] },
        tokens: { prompt: "Modellzusammenfassungen, 900 Dollar, seit einem Monat ohne Leserinnen und Leser.", options: ["Behalten", "Begrenzen", "Stoppen"] },
        shared: { prompt: "Persönliche Videotranskodierung, 300 Dollar, auf dem gemeinsamen Konto.", options: ["Behalten", "Begrenzen", "Stoppen"] },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-04",
      caseTitle: "Die Rechnung und das Vertrauen",
      caseSituation: [
        "Das gemeinsame Konto hat sich verdoppelt. Die Hälfte der neuen Summe ist die ungelesene Modellzusammenfassung. Eine weitere Zeile ist die Videotranskodierung einer Person. Die CI-Runner sind noch für einen vollen Tag bemessen, den sie nicht haben. Die Hauptbuch-Datenbank ist unverändert, und auf diesen Datensatz ist der Zahlungsschalter angewiesen.",
        "Die Person, die das Konto bezahlt, hat um eine Notiz gebeten: was bleibt, was begrenzt wird und was geht. Ein neues Modell ist nicht gefragt.",
      ],
      caseTask: "Ordnen Sie die Kosten zu, beurteilen Sie das Modell nach seinem Ergebnis und nehmen Sie persönliche Arbeit vom gemeinsamen Konto.",
      caseSteps: [
        "Nennen Sie den Dienst, der jede Zeile verursacht, bevor Sie sie ändern.",
        "Trennen Sie ungenutzte Kapazität von einer Zeile ohne nutzende Person.",
        "Beantworten Sie die drei Entscheidungen.",
        "Sagen Sie in der Notiz, was Sie begrenzen, was Sie stoppen und was Sie behalten, weil der Zahlungsschalter es braucht.",
      ],
      decisions: [
        {
          prompt: "Was tun Sie mit den ungenutzten CI-Runnern?",
          options: ["Ungenutzt lassen, weil Geschwindigkeit kostenlos wirken soll", "Begrenzen und die Minuten dem Statusdienst zuordnen", "Auf eine persönliche Karte schieben und die Zeile verstecken"],
        },
        {
          prompt: "Was tun Sie mit den ungelesenen Modellzusammenfassungen?",
          options: ["Ein größeres Kontextfenster kaufen", "Stoppen, bis eine Person das Ergebnis in einer Entscheidung nutzt", "Den Schlüssel teilen, damit mehr Leute sie vielleicht lesen"],
        },
        {
          prompt: "Die persönliche Transkodierung liegt auf dem gemeinsamen Konto. Was tun Sie?",
          options: ["Lassen, weil die Person lernt", "Vom Konto nehmen und das gemeinsame Konto als anvertrautes Gut behandeln", "Das Projekt umbenennen, damit die Zeile nach Produktion aussieht"],
        },
      ],
      noteLabel: "Ihre Notiz an die Person, die das Konto bezahlt",
      noteHint: "Schreiben Sie, was Sie begrenzen, was Sie stoppen und was Sie behalten, weil der Zahlungsschalter es braucht.",
    },
  },
  brief: {
    title: "Veröffentlichung von Northline",
    dek: "Liefern Sie die Statuszeile einmal aus, mit einer Historie, vier Zahlen und einer Rechnung, die Sie verteidigen können.",
    situation: [
      "Morgen lädt der Zahlungsschalter /status neu, bevor die Kassen öffnen. Die Datei ist bereit. Ein Live-Schlüssel wurde in einem alten Commit auf main gefunden. Letzte Woche ist eine Bereitstellung gescheitert, und die Wiederherstellung wurde zeitlich erfasst. Das gemeinsame Konto zahlt noch für ungenutzte Runner und eine ungelesene Zusammenfassung.",
      "Das ist eine Veröffentlichung, nicht vier Projekte. Antwort, Historie, Messung und Ausgabe müssen übereinstimmen.",
    ],
    task: "Wählen Sie Antwort, Historie, Messung und Ausgabe für diese Veröffentlichung.",
    steps: [
      "Entscheiden Sie, was /status sendet, einschließlich der Verbindung, die der Client schließen wollte.",
      "Entscheiden Sie, wo die Korrektur liegt und was mit einem Schlüssel geschieht, der schon durchgesickert ist.",
      "Entscheiden Sie, welche Zahlen Sie für diese Veröffentlichung aufschreiben.",
      "Sagen Sie in der Notiz, was der Zahlungsschalter sieht, wo der Schlüssel jetzt liegt und welche Ausgabe stoppt.",
    ],
    decisions: [
      {
        prompt: "Was sendet /status?",
        options: ["Einen 500, der den Schlüssel enthält", "200 mit der Statusdatei, ohne Schlüssel, und die Verbindung geschlossen", "Nichts, und der Socket bleibt offen"],
      },
      {
        prompt: "Wohin landet die Korrektur?",
        options: ["Direkt auf main, und der Schlüssel bleibt in der Historie", "Auf einen Branch, dann auf main, wenn die Checks grün sind, und der Schlüssel wird rotiert", "In einer Zip-Datei im Chat"],
      },
      {
        prompt: "Was halten Sie für diese Veröffentlichung fest?",
        options: ["Nichts, wenn die Demo ruhig aussah", "Häufigkeit, Vorlaufzeit, Fehlerrate und Wiederherstellungszeit", "Nur, dass Sie einmal im Monat bereitstellen"],
      },
      {
        prompt: "Was geschieht mit der gemeinsamen Rechnung?",
        options: ["Die Ausgabe bleibt, wie sie ist, einschließlich der ungelesenen Zusammenfassungen", "Die ungenutzten Runner begrenzen und die ungelesenen Zusammenfassungen stoppen", "Das Konto teilen, damit die Rechnung alle angeht"],
      },
    ],
    noteLabel: "Ihre Notiz zur Veröffentlichung",
    noteHint: "Schreiben Sie, was /status zeigt, wo der Schlüssel jetzt liegt und welche Ausgabe stoppt.",
    narration:
      "Die Veröffentlichung von Northline sendet die Statusdatei ohne den Schlüssel, kommt auf main erst, wenn die Checks grün sind, hält die vier Zahlen von DORA fest, begrenzt ungenutzte Runner und stoppt die ungelesene Ausgabe für das Modell.",
    figure: "Eine Veröffentlichung: eine sichere Statusantwort, ein grünes main, vier Zahlen und eine Rechnung, bei der ungenutzte Arbeit begrenzt und ungelesene Arbeit gestoppt ist.",
  },
};
