// Interactive 10 Exams Sets Database for A1, A2, B1 CEFR Exams in Vanilla JS

const THEMES = [
  { id: 1, nameEn: "Social & Everyday", nameDe: "Alltag & Soziales" },
  { id: 2, nameEn: "Travel & Leisure", nameDe: "Reisen & Freizeit" },
  { id: 3, nameEn: "Health & Doctor", nameDe: "Gesundheit & Arzt" },
  { id: 4, nameEn: "Shopping & Commerce", nameDe: "Einkaufen & Kaufhaus" },
  { id: 5, nameEn: "Career & Work", nameDe: "Beruf & Arbeit" },
  { id: 6, nameEn: "Housing & Rent", nameDe: "Wohnen & WG-Leben" },
  { id: 7, nameEn: "Customs & Culture", nameDe: "Feste & Bräuche" },
  { id: 8, nameEn: "Environment & Green", nameDe: "Umwelt & Natur" },
  { id: 9, nameEn: "Media & Digital Life", nameDe: "Medien & Technik" },
  { id: 10, nameEn: "Education & VHS", nameDe: "Schule & Lernen" }
];

export function getA1ExamSets(t) {
  return THEMES.map((theme, idx) => {
    const sId = idx + 1;
    return {
      lesen: [
        {
          id: 1,
          title: t(`Teil 1: Social Invitation Note - Set ${sId}`, `Teil 1: Einladungen und Notizen - Satz ${sId}`),
          instruction: t("Read the message and decide whether the statements are True or False.", "Lies den Text und entscheide, ob die Sätze richtig (Richtig) oder falsch (Falsch) sind."),
          passage: idx === 0 
            ? "Hallo Thomas,\n\nich feiere am Samstag meinen Geburtstag! Die Party beginnt um 18:00 Uhr in meiner neuen Wohnung (Schillerstraße 12). Bring bitte gute Laune und etwas zum Trinken mit. Snacks und Pizza gibt es bei mir!\n\nKannst du kommen? Schreib mir bitte bis Donnerstag.\n\nViele Grüße,\nLisa"
            : `Hallo Sarah,\n\nich möchte dich herzlich zu unserem ${theme.nameDe}-Treffen einladen! Wir treffen uns am Sonntag um 15:00 Uhr im Stadtpark oder bei Regen in meiner Küche. Bring bitte deinen Bruder oder deine Freunde mit. Bitte gib mir bis Freitag Bescheid.\n\nHerzliche Grüße,\nMichael`,
          questions: idx === 0 ? [
            { id: `a1_l_t1_q1_s${sId}`, statement: "Thomas hat am Samstag Geburtstag.", answer: false, explanationDe: "Lisa feiert ihren Geburtstag, nicht Thomas.", explanationEn: "Lisa is celebrating her birthday, not Thomas." },
            { id: `a1_l_t1_q2_s${sId}`, statement: "Lisa wohnt jetzt in der Schillerstraße.", answer: true, explanationDe: "Lisa schreibt: 'in meiner neuen Wohnung (Schillerstraße 12)'", explanationEn: "Lisa writes: 'in my new apartment (Schillerstraße 12)'" },
            { id: `a1_l_t1_q3_s${sId}`, statement: "Die Party fängt am Abend an.", answer: true, explanationDe: "Die Party beginnt um 18:00 Uhr, das ist am Abend.", explanationEn: "The party begins at 18:00, which is in the evening." },
          ] : [
            { id: `a1_l_t1_q1_s${sId}`, statement: "Das Treffen findet am Sonntag statt.", answer: true, explanationDe: "Richtig. Michael schreibt 'am Sonntag um 15:00 Uhr'.", explanationEn: "Correct. Michael writes 'on Sunday at 3:00 PM'." },
            { id: `a1_l_t1_q2_s${sId}`, statement: "Sarah darf niemanden mitbringen.", answer: false, explanationDe: "Falsch. Er schreibt 'Bring bitte deinen Bruder oder deine Freunde mit'.", explanationEn: "False. He writes 'Please bring your brother or your friends'." },
            { id: `a1_l_t1_q3_s${sId}`, statement: "Sarah soll sich bis Samstag melden.", answer: false, explanationDe: "Falsch. Sie soll bis Freitag Bescheid geben.", explanationEn: "False. She should let him know by Friday." },
          ]
        },
        {
          id: 2,
          title: t(`Teil 2: Everyday Situation Matching - Set ${sId}`, `Teil 2: Alltagssituationen & Anzeigen - Satz ${sId}`),
          instruction: t("Match each person's wish with the absolute best advertisement.", "Ordne den Wünschen der Personen die am besten passende Anzeige zu."),
          people: idx === 0 ? [
            { id: 'p1', name: "Marta (24)", wishDe: "Möchte günstig am Wochenende Deutsch lernen.", wishEn: "Wants to study German affordably on weekends." },
            { id: 'p2', name: "Sarah (31)", wishDe: "Sucht einen Schwimmkurs für ihre 5-jährige Tochter.", wishEn: "Looking for a swimming class for her 5-year-old daughter." },
            { id: 'p3', name: "Daniel (40)", wishDe: "Möchte abends italienisch essen gehen.", wishEn: "Wants to eat Italian food for dinner." }
          ] : [
            { id: 'p1', name: "Julia (20)", wishDe: `Sucht ein Buch oder Material zum Thema: ${theme.nameDe}.`, wishEn: `Wants to find reading material about: ${theme.nameEn}.` },
            { id: 'p2', name: "Markus (28)", wishDe: "Möchte lernen, wie man gesund kocht am Abend.", wishEn: "Wants to learn how to cook healthy meals in the evening." },
            { id: 'p3', name: "Erika (55)", wishDe: "Sucht einen Computerkurs für Anfänger am Samstag.", wishEn: "Looking for a computer course for beginners on Saturday." }
          ],
          ads: idx === 0 ? [
            { id: 'A', textDe: "Anzeige A: Deutsch-Intensivkurs am Samstag & Sonntag! Nur 45 € pro Monat bei der VHS.", textEn: "Ad A: Weekend German Intensive! Just 45 € per month at the VHS." },
            { id: 'B', textDe: "Anzeige B: Pizzeria 'La Bella' - Geöffnet täglich von 17:00 bis 23:00 Uhr. Echte Holzofenpizza!", textEn: "Ad B: Pizzeria 'La Bella' - Open daily from 17:00 to 23:00. Real wood-fired pizza!" },
            { id: 'C', textDe: "Anzeige C: Baby- und Kinderschwimmen 'Seepferdchen' für Kinder von 4 bis 7 Jahren. Jeden Samstagmittag.", textEn: "Ad C: Baby and kids swimming 'Seepferdchen' for children aged 4 to 7. Every Saturday noon." },
            { id: 'D', textDe: "Anzeige D: Spanisch lernen leicht gemacht! Abendkurse für Berufstätige.", textEn: "Ad D: Learn Spanish made easy! Evening courses for professionals." }
          ] : [
            { id: 'A', textDe: `Anzeige A: Bestseller und Zeitschriften zu ${theme.nameDe} jetzt 20% günstiger kaufen!`, textEn: `Ad A: Buying books about ${theme.nameEn} now with 20% discounts!` },
            { id: 'B', textDe: "Anzeige B: Fit & Gesund in der Küche! Abendkurs jeden Dienstag ab 19 Uhr. Jetzt anmelden.", textEn: "Ad B: Healthy cooking evening classes every Tuesday at 7 PM." },
            { id: 'C', textDe: "Anzeige C: Computertraining für Senioren und Einsteiger: Jeden Samstag 10:00 - 13:00 Uhr.", textEn: "Ad C: Saturday computer introductory sessions 10 AM to 1 PM." },
            { id: 'D', textDe: "Anzeige D: Malen und Zeichnen für Jung und Alt. Malkurs am Donnerstagabend.", textEn: "Ad D: Art classes on Thursday evening." }
          ],
          correctMapping: { 'p1': 'A', 'p2': 'B', 'p3': 'C' }
        },
        {
          id: 3,
          title: t(`Teil 3: Public Notice - Set ${sId}`, `Teil 3: Hinweisschilder - Satz ${sId}`),
          instruction: t("Read the notice and assess whether the assertions are correct or wrong.", "Lies das Hinweisschild und entscheide, ob die Behauptungen richtig oder falsch sind."),
          passage: idx === 0 
            ? "⚠️ ACHTUNG - SCHWIMMHALTEPUNKT ⚠️\n\nLiebe Hausgäste,\n\nBitte benutzen Sie außerhalb der Öffnungszeiten (08:00 - 21:00) nicht den Poolbereich. Ab 22:00 Uhr gilt im gesamten Innenhof absolute Ruhezeit (Ruhezeit-Regelung).\n\nKinder dürfen nur in Begleitung von Erwachsenen in das Becken!\n\nDie Hausverwaltung"
            : `⚠️ BITTE BEACHTEN Sie die neuen Hausregeln bezüglich ${theme.nameDe} ⚠️\n\nLiebe Mieter,\n\nEs ist verboten, Gegenstände im Flur abzustellen. Der Haupteingang muss immer frei sein. Besuche sind grundsätzlich bis 22:00 Uhr erlaubt. Nach 22:00 Uhr bitten wir um Ruhe.\n\nIhr Hausmeister Schmidt`,
          questions: idx === 0 ? [
            { id: `a1_l_t3_q1_s${sId}`, statement: "Man darf um 07:00 Uhr morgens schwimmen.", answer: false, explanationDe: "Nein, erst ab 08:00 Uhr morgens geöffnet.", explanationEn: "No, it only opens starting from 08:00 AM." },
            { id: `a1_l_t3_q2_s${sId}`, statement: "Ein 8-jähriges Kind darf alleine schwimmen.", answer: false, explanationDe: "Nein, Kinder dürfen nur in Begleitung von Erwachsenen schwimmen.", explanationEn: "No, children are only allowed with adult supervision." },
            { id: `a1_l_t3_q3_s${sId}`, statement: "Ab 22 Uhr muss es im Innenhof ruhig sein.", answer: true, explanationDe: "Richtig, ab 22:00 Uhr gilt absolute Ruhezeit.", explanationEn: "Correct, absolute quiet hours start from 22:00." },
          ] : [
            { id: `a1_l_t3_q1_s${sId}`, statement: "Der Flur muss komplett frei bleiben.", answer: true, explanationDe: "Richtig. Der Hausmeister schreibt: 'Es ist verboten, Gegenstände im Flur abzustellen.'", explanationEn: "Correct. The caretaker writes: 'It is forbidden to leave objects in the hallway.'" },
            { id: `a1_l_t3_q2_s${sId}`, statement: "Besucher dürfen über Nacht bleiben.", answer: false, explanationDe: "Falsch. Besuche sind nur bis 22:00 Uhr erlaubt.", explanationEn: "False. Visits are only allowed until 10 PM." },
            { id: `a1_l_t3_q3_s${sId}`, statement: "Ab 22:00 Uhr soll man im Haus leise sein.", answer: true, explanationDe: "Richtig. Es gilt die Nachtruhe ab 22:00 Uhr.", explanationEn: "Correct. Quiet hours apply starting at 10:00 PM." }
          ]
        }
      ],
      hoeren: [
        {
          id: 1,
          title: t(`Teil 1: Daily Dialogues - Set ${sId}`, `Teil 1: Alltagsgespräche - Satz ${sId}`),
          audio_transcript: idx === 0
            ? "Frau: Entschuldigung, fährt dieser Zug nach Frankfurt?\nMann: Nein, das ist der Intercity nach Stuttgart. Der Zug nach Frankfurt fährt auf Gleis 4 ab, direkt gegenüber.\nFrau: Ah, vielen Dank! Und wann fährt er?\nMann: In 5 Minuten, also um 14:15 Uhr."
            : `Frau: Hallo, ich suche Informationen zu: ${theme.nameDe}. Gibt es einen Kurs?\nMann: Ja, der nächste Kurs beginnt am Montag um 09:30 Uhr in Raum 202. Es kostet 20 Euro.\nFrau: Super! Kann ich mich hier direkt anmelden?\nMann: Ja, das geht gerne. Bitte füllen Sie dieses kleine Formular aus.`,
          question: idx === 0 
            ? t("Auf welchem Gleis fährt der Zug der Frau nach Frankfurt?", "Auf welchem Gleis fährt der Zug nach Frankfurt?")
            : t(`Wann fängt der Kurs zum Thema ${theme.nameEn} an?`, "Wann fängt der Kurs an?"),
          options: idx === 0 
            ? ["Gleis 4", "Gleis 5", "Gleis 14"]
            : ["Montag um 09:30 Uhr", "Dienstag um 10:00 Uhr", "Samstag um 15:00 Uhr"],
          ans: 0,
          audio_target: idx === 0 ? "Gleis 4 gegenüber." : "Montag um 09:30 Uhr.",
          explanation: idx === 0 
            ? t("The train departs from platform 4 ('Gleis 4') in 5 minutes.", "Der Zug fährt von Gleis 4 ab.")
            : t("The course starts on Monday morning at 09:30 AM in room 202.", "Der Kurs beginnt am Montag um 09:30 Uhr.")
        },
        {
          id: 2,
          title: t(`Teil 2: Public Announcement - Set ${sId}`, `Teil 2: Lautsprecher-Durchsage - Satz ${sId}`),
          audio_transcript: idx === 0
            ? "📢 'Achtung an Gleis 2: Der InterCity Express 592 nach Hamburg Altona über Hannover, geplante Abfahrt 12:30 Uhr, hat heute voraussichtlich 20 Minuten Verspätung. Grund dafür ist eine Stellwerksstörung. Wir bitten um Verständnis.'"
            : `📢 'Achtung liebe Kundinnen und Kunden: Wegen unseres Sonderthemas ${theme.nameDe} bieten wir heute im ersten Stock exklusive Rabatte an. Besuchen Sie uns und sparen Sie! Unser Café schließt heute ausnahmsweise schon um 16:00 Uhr.'`,
          questions: idx === 0 ? [
            { id: `a1_h_t2_q1_s${sId}`, statement: "Der Zug nach Hamburg kommt pünktlich.", answer: false, explanationDe: "Der Zug hat voraussichtlich 20 Minuten Verspätung.", explanationEn: "The train is expected to have a 20 minute delay." },
            { id: `a1_h_t2_q2_s${sId}`, statement: "Der Grund für die Verspätung ist eine Störung.", answer: true, explanationDe: "Es liegt eine Stellwerksstörung vor.", explanationEn: "There is a signal box malfunction." }
          ] : [
            { id: `a1_h_t2_q1_s${sId}`, statement: "Kunden können heute im ersten Stock Geld sparen.", answer: true, explanationDe: "Richtig, es gibt dort heute exklusive Rabatte.", explanationEn: "Correct, there are exclusive discounts on the first floor." },
            { id: `a1_h_t2_q2_s${sId}`, statement: "Das Café hat heute bis 20:00 Uhr geöffnet.", answer: false, explanationDe: "Falsch, es schließt heute bereits ausnahmsweise um 16:00 Uhr.", explanationEn: "False, it closes exceptionally early at 4:00 PM." }
          ]
        },
        {
          id: 3,
          title: t(`Teil 3: Phone Voicemail - Set ${sId}`, `Teil 3: Telefon-Anrufbeantworter - Satz ${sId}`),
          audio_transcript: idx === 0
            ? "📞 'Hallo Maria, hier spricht Peter. Wir wollten uns doch morgen um 15:00 Uhr im Cafe Müller treffen. Leider muss ich länger arbeiten. Können wir uns erst um 17:30 Uhr treffen? Sag mir bitte Bescheid. Danke!'"
            : `📞 'Hallo Herr Weber, hier ist das Kundenzentrum für ${theme.nameDe}. Ihr gebuchter Beratungstermin am Freitag kann leider nicht stattfinden. Bitte rufen Sie uns zurück, um einen neuen Termin für Montag zu vereinbaren. Auf Wiederhören!'`,
          question: idx === 0
            ? t("Wann möchte Peter sich treffen?", "Wann möchte Peter sich treffen?")
            : t("Wann soll der neue Ausweichtermin stattfinden?", "Wann soll der neue Termin sein?"),
          options: idx === 0
            ? ["Um 15:00 Uhr", "Um 17:30 Uhr", "Morgen früh"]
            : ["Am Montag", "Am Freitag", "Am Wochenende"],
          ans: 0,
          explanation: idx === 0
            ? t("Peter asks to push the meeting to 17:30 because he has to work longer.", "Peter fragt nach 17:30 Uhr wegen der Arbeit.")
            : t("They mention scheduling the replacement meeting for monday.", "Der neue Termin ist für Montag geplant.")
        }
      ],
      schreiben: [
        {
          id: 1,
          title: t(`Teil 1: Form Filling - Set ${sId}`, `Teil 1: Formular ausfüllen - Satz ${sId}`),
          description: t("Fill in the official registration form with absolute spelling precision based on personal details.", "Trage die Daten deines Freundes fehlerfrei in das Anmeldeformular ein."),
          prompt: idx === 0
            ? "Freund: Mario Rossi\nGeburtstag: 14. September 1995\nGeburtsort: Rom, Italien\nGewünschter Kurs: Abendkurs (Deutsch A1)\nAdresse: Aachener Str. 45, 50674 Köln"
            : `Freund: Ana Silva\nGeburtstag: 22. Mai 1993\nGeburtsort: Lissabon, Portugal\nGewünschter Kurs: ${theme.nameDe} Basiskurs\nAdresse: Hauptstraße 10, 80331 München`,
          fields: idx === 0 ? [
            { id: 'fName', label: "Familienname / Surname", expected: "Rossi" },
            { id: 'fVorname', label: "Vorname / First name", expected: "Mario" },
            { id: 'fOrt', label: "Geburtsort / Place of birth", expected: "Rom" },
            { id: 'fAddress', label: "Straße & Hausnummer / Street", expected: "Aachener Str. 45" },
            { id: 'fPlz', label: "Stadt / City & Postcode", expected: "Köln" },
          ] : [
            { id: 'fName', label: "Familienname / Surname", expected: "Silva" },
            { id: 'fVorname', label: "Vorname / First name", expected: "Ana" },
            { id: 'fOrt', label: "Geburtsort / Place of birth", expected: "Lissabon" },
            { id: 'fAddress', label: "Straße & Hausnummer / Street", expected: "Hauptstraße 10" },
            { id: 'fPlz', label: "Stadt / City & Postcode", expected: "München" },
          ]
        },
        {
          id: 2,
          title: t(`Teil 2: Short Email Draft - Set ${sId}`, `Teil 2: Kurze E-Mail verfassen - Satz ${sId}`),
          description: idx === 0
            ? t("Write a short email (approx. 30 words) to Klaus: 1. Ask how he is, 2. Invite him to a picnic next Sunday, 3. Bring a guitar.", "Schreibe Klaus eine E-Mail (ca. 30 Wörter): 1. Fragen wie es geht, 2. Einladung zum Picknick am Sonntag, 3. Bitten eine Gitarre mitzubringen.")
            : t(`Write a quick email (ca. 30 words) about: ${theme.nameEn}: 1. Thank for invitation, 2. Accept your attendance, 3. Ask what time it begins.`, `Schreibe eine kurze E-Mail (ca. 30 Wörter) zum Thema ${theme.nameDe}: 1. Danke für die Einladung, 2. Zusage geben, 3. Fragen wann es genau anfängt.`),
          ideal_hints: idx === 0 ? [
            "Lieber Klaus, ...",
            "Wie geht es dir?",
            "Ich lade dich zu einem Picknick am Sonntag ein.",
            "Kannst du deine Gitarre mitbringen?",
            "Viele Grüße, ..."
          ] : [
            "Hallo Michael, ...",
            "Vielen Dank für die Einladung!",
            "Ich komme sehr gerne.",
            "Wann fängt unser Treffen am Sonntag an?",
            "Bis bald, ..."
          ],
          placeholder: t("Write here...", "Schreibe hier dein A1-Schreiben...")
        }
      ],
      sprechen: [
        {
          id: 1,
          title: t(`Teil 1: Self-Introduction Cards - Set ${sId}`, `Teil 1: Sich vorstellen - Satz ${sId}`),
          description: t("Rehearse templates. Click card to hear recommended German audio guides.", "Übe deine Vorstellung. Klicke auf die Karten für Audiobeispiele."),
          cards: [
            { label: "Name", de: idx === 0 ? "Mein Name ist Mario Rossi." : "Mein Name ist Ana Silva.", en: idx === 0 ? "My name is Mario Rossi." : "My name is Ana Silva." },
            { label: "Alter (Age)", de: idx === 0 ? "Ich bin dreißig Jahre alt." : "Ich bin zweiunddreißig Jahre alt.", en: idx === 0 ? "I am thirty years old." : "I am thirty-two years old." },
            { label: "Land (Country)", de: idx === 0 ? "Ich komme aus Italien." : "Ich komme aus Portugal.", en: idx === 0 ? "I come from Italy." : "I come from Portugal." },
            { label: "Wohnort (Home)", de: idx === 0 ? "Ich wohne jetzt in Köln." : "Ich wohne jetzt in München.", en: idx === 0 ? "I live in Cologne now." : "I live in Munich now." },
            { label: "Sprachen (Languages)", de: "Ich spreche Englisch und ein bisschen Deutsch.", en: "I speak English and a little German." },
            { label: "Beruf (Job)", de: idx === 0 ? "Ich arbeite als Ingenieur." : "Ich arbeite als Sekretärin.", en: idx === 0 ? "I work as an engineer." : "I work as a secretary." },
            { label: "Hobby / " + theme.nameEn, de: `Ich mag ${theme.nameDe} und Bücher lesen.`, en: `I like ${theme.nameEn} and reading books.` },
          ]
        },
        {
          id: 2,
          title: t(`Teil 2: Theme Cards Dialogues - Set ${sId}`, `Teil 2: Fragen stellen & beantworten - Satz ${sId}`),
          description: t("Create W-Questions corresponding to keywords and check recommended certified structures.", "Formuliere W-Fragen zu den Stichworten."),
          theme: `Thema: ${theme.nameEn} (${theme.nameDe})`,
          keyword: t("Information / Kurs", "Information / Kurs"),
          questionsAndAnswers: [
            { q: `Wann fängt ein Kurs für ${theme.nameDe} an?`, a: "Der Kurs fängt am Montag um neun Uhr an." },
            { q: "Wo bekomme ich Informationen dazu?", a: "An der Rezeption im ersten Stock." }
          ]
        },
        {
          id: 3,
          title: t(`Teil 3: Polite Requests - Set ${sId}`, `Teil 3: Höfliche Bitten - Satz ${sId}`),
          description: t("Translate requests. Click the items to listen to spoken models in German.", "Lerne höfliche Bitten zu alltäglichen Gegenständen zu formulieren."),
          items: idx === 0 ? [
            { name: t("A pen (Kugelschreiber)", "Ein Kugelschreiber"), request: "Kannst du mir bitte einen Kuli geben?", trans: "Can you please give me a pen?" },
            { name: t("A glass of water (Glas Wasser)", "Ein Glas Wasser"), request: "Geben Sie mir bitte ein Glas Wasser?", trans: "Could you please give me a glass of water?" },
            { name: t("The dictionary (Wörterbuch)", "Das Wörterbuch"), request: "Kann ich bitte dein Wörterbuch benutzen?", trans: "Can I please use your dictionary?" }
          ] : [
            { name: t("Information flyer", "Ein Prospekt"), request: "Kannst du mir bitte den Prospekt geben?", trans: "Can you please give me the flyer?" },
            { name: t("A cup of tea (Tasse Tee)", "Eine Tasse Tee"), request: "Guten Tag, geben Sie mir bitte eine Tasse Tee?", trans: "Hello, could you please give me a cup of tea?" },
            { name: t("A ticket (Fahrkarte)", "Eine Fahrkarte"), request: "Kann ich bitte eine Fahrkarte kaufen?", trans: "Can I please buy a ticket?" }
          ]
        }
      ]
    };
  });
}

export function getA2ExamSets(t) {
  return THEMES.map((theme, idx) => {
    const sId = idx + 1;
    return {
      lesen: [
        {
          id: 1,
          title: t(`Teil 1: Travel Reports - Set ${sId}`, `Teil 1: Reise- und Erfahrungsberichte - Satz ${sId}`),
          instruction: t("Read the article and solve the multiple choice questions.", "Lies den Bericht und beantworte die Fragen."),
          passage: idx === 0
            ? "Letzten Monat habe ich mit meiner Familie eine einwöchige Radtour entlang der wunderschönen Donau gemacht. Wir starteten in Passau und fuhren täglich etwa 45 Kilometer auf flachen, gepflasterten Radwegen. Zum Glück war das Juni-Wetter fast immer trocken, nur am Mittwochnachmittag war es ein bisschen bewölkt und windig. Übernachtet haben wir nicht im Zelt, sondern in gemütlichen Pensionen am Wegesrand. Das Essen war herrlich und die bayerischen Brezeln haben den Kindern besonders gut geschmeckt. Am Abend des siebten Tages erreichten wir glücklich unser Ziel in Wien."
            : `Letztes Jahr bin ich wegen einer neuen Fortbildung zum Thema ${theme.nameDe} nach Berlin gereist. Ich hatte eine tolle Zeit in einer kleinen Pension nahe dem Alexanderplatz. Die Kurse begannen täglich um 9 Uhr morgens und dauerten bis zum Nachmittag. Das Wetter war wechselhaft, aber es gab kaum Regen. Am Mittag habe ich oft typisch deutsche Gerichte gekocht oder gegessen. Insgesamt war es eine lehrreiche Erfahrung, die mir beruflich sehr geholfen hat.`,
          questions: idx === 0 ? [
            { id: `a2_l_t1_q1_s${sId}`, qDe: "Wie lange dauerte die Radtour der Familie?", qEn: "How long was the family's cycling trip?", opts: ["Eine Woche / One week", "Zwei Wochen / Two weeks", "Drei Tage / Three days"], ans: 0, explanationDe: "Der Text schreibt am Anfang: 'eine einwöchige Radtour...'", explanationEn: "The text starts with: 'eine einwöchige Radtour' (a one-week tour)." },
            { id: `a2_l_t1_q2_s${sId}`, qDe: "Wie war das Wetter während der Fahrt?", qEn: "How was the weather during the ride?", opts: ["Es hat jeden Tag geregnet / Rained daily", "Fast immer trocken / Almost always dry", "Sehr heiß und windig / Scorching hot"], ans: 1, explanationDe: "Es heißt: 'das Juni-Wetter fast immer trocken'.", explanationEn: "It states: 'fast immer trocken'." },
            { id: `a2_l_t1_q3_s${sId}`, qDe: "Wo hat die Familie übernachtet?", qEn: "Where did the family sleep during the trip?", opts: ["In einem Zelt / In a tent", "In Hotels in Großstädten / In city hotels", "In gemütlichen Pensionen / In cozy guesthouses"], ans: 2, explanationDe: "Es heißt ausdrücklich: 'Übernachtet haben wir nicht im Zelt, sondern in gemütlichen Pensionen...'", explanationEn: "Explicitly says: 'gemütlichen Pensionen'." }
          ] : [
            { id: `a2_l_t1_q1_s${sId}`, qDe: "Warum reiste die Person nach Berlin?", qEn: "Why did the person travel to Berlin?", opts: ["Für eine Fortbildung / For training", "Für einen Urlaub / For holiday", "Um Verwandte zu besuchen / To visit relatives"], ans: 0, explanationDe: "Richtig. Die Person reiste wegen einer Fortbildung.", explanationEn: "Correct. The traveler visited for training." },
            { id: `a2_l_t1_q2_s${sId}`, qDe: "Wie war das Wetter dorthin?", qEn: "How was the weather there?", opts: ["Immer sonnig / Always sunny", "Wechselhaft mit wenig Regen / Changeable, tiny rain", "Stürmisch / Stormy"], ans: 1, explanationDe: "Es heißt: 'Das Wetter war wechselhaft, aber kaum Regen'.", explanationEn: "Text says: 'changeable, but hardly any rain'." },
            { id: `a2_l_t1_q3_s${sId}`, qDe: "Besitzt die Fortbildung einen beruflichen Nutzen?", qEn: "Did the training have professional benefits?", opts: ["Nein, gar nicht / No", "Ja, sie half sehr / Yes, it helped a lot", "Es war zu kurz / Too short"], ans: 1, explanationDe: "Es heißt: 'hat mir beruflich sehr geholfen.'", explanationEn: "It was a helpful experience." }
          ]
        },
        {
          id: 2,
          title: t(`Teil 2: Mall Directories - Set ${sId}`, `Teil 2: Kaufhaus-Wegweiser & Wünsche - Satz ${sId}`),
          instruction: t("Match the wishes of mall visitors with the correct directory floors.", "Ordne den Wünschen der Personen die passende Etage des Kaufhauses zu."),
          infoBoard: [
            t("🏢 Erdgeschoss (EG): Lebensmittel, Bäckerei, Friseur-Salon 'Haarzauber'", "🏢 Erdgeschoss (EG): Lebensmittel, Bäckerei, Friseur-Salon 'Haarzauber'"),
            t("👗 1. Obergeschoss (1. OG): Damen- und Herrenmode, Schneiderwerkstatt", "👗 1. Obergeschoss (1. OG): Damen- und Herrenmode, Schneiderwerkstatt"),
            t(`⚽ 2. Obergeschoss (2. OG): Sportgeräte, Schuhe, Kinderkleidung und Zubehör ${theme.nameDe}`, `⚽ 2. Obergeschoss (2. OG): Sportgeräte, Schuhe, Kinderkleidung und Zubehör ${theme.nameDe}`),
            t("🍽️ 3. Obergeschoss (3. OG): Restaurant 'Dachgarten', Fundbüro, Toiletten", "🍽️ 3. Obergeschoss (3. OG): Restaurant 'Dachgarten', Fundbüro, Toiletten"),
          ],
          matches: idx === 0 ? [
            { id: `a2_l_t2_m1_s${sId}`, person: t("Herr Schmidt möchte ein neues Oberhemd kaufen.", "Herr Schmidt möchte ein neues Oberhemd kaufen."), answer: "1. Obergeschoss (1. OG)", opts: ["Erdgeschoss (EG)", "1. Obergeschoss (1. OG)", "2. Obergeschoss (2. OG)", "3. Obergeschoss (3. OG)"], explanation: "Herrenmode ist im 1. OG." },
            { id: `a2_l_t2_m2_s${sId}`, person: t("Frau Krüger sucht frische Brötchen und Wurst.", "Frau Krüger sucht frische Brötchen und Wurst."), answer: "Erdgeschoss (EG)", opts: ["Erdgeschoss (EG)", "1. Obergeschoss (1. OG)", "2. Obergeschoss (2. OG)", "3. Obergeschoss (3. OG)"], explanation: "Lebensmittel und Bäckerei sind im EG." },
            { id: `a2_l_t2_m3_s${sId}`, person: t("Leon möchte ein Paar neue Laufschuhe anprobieren.", "Leon möchte ein Paar neue Laufschuhe anprobieren."), answer: "2. Obergeschoss (2. OG)", opts: ["Erdgeschoss (EG)", "1. Obergeschoss (1. OG)", "2. Obergeschoss (2. OG)", "3. Obergeschoss (3. OG)"], explanation: "Schuhe und Sportgeräte sind im 2. OG." }
          ] : [
            { id: `a2_l_t2_m1_s${sId}`, person: t(`Herr Becker sucht Zubehör zum Thema ${theme.nameEn}.`, `Herr Becker sucht Zubehör zum Thema ${theme.nameDe}.`), answer: "2. Obergeschoss (2. OG)", opts: ["Erdgeschoss (EG)", "1. Obergeschoss (1. OG)", "2. Obergeschoss (2. OG)", "3. Obergeschoss (3. OG)"], explanation: `Ausrüstung zu ${theme.nameDe} befindet sich im 2. OG.` },
            { id: `a2_l_t2_m2_s${sId}`, person: t("Anna möchte ein Mittagessen einnehmen.", "Anna möchte ein Mittagessen einnehmen."), answer: "3. Obergeschoss (3. OG)", opts: ["Erdgeschoss (EG)", "1. Obergeschoss (1. OG)", "2. Obergeschoss (2. OG)", "3. Obergeschoss (3. OG)"], explanation: "Das Restaurant ist im 3. OG." },
            { id: `a2_l_t2_m3_s${sId}`, person: t("Paul muss dringend seine Haare schneiden lassen.", "Paul muss dringend seine Haare schneiden lassen."), answer: "Erdgeschoss (EG)", opts: ["Erdgeschoss (EG)", "1. Obergeschoss (1. OG)", "2. Obergeschoss (2. OG)", "3. Obergeschoss (3. OG)"], explanation: "Der Friseurladen ist im Erdgeschoss." }
          ]
        }
      ],
      hoeren: [
        {
          id: 1,
          title: t(`Teil 1: Audio Rescheduling - Set ${sId}`, `Teil 1: Praktische Telefonate - Satz ${sId}`),
          audio_transcript: idx === 0
            ? "Mann: Zahnarztpraxis Dr. Becker, guten Tag!\nFrau: Guten Tag, hier ist Anna Müller. Ich habe morgen um 10:00 Uhr einen Termin. Leider habe ich unerwartet ein wichtiges Meeting in der Firma und kann erst nachmittags kommen.\nMann: Kein Problem. Wir haben morgen um 16:30 Uhr noch einen Termin frei. Passt Ihnen das?\nFrau: Ja, wunderbar. Bis morgen um halb fünf!"
            : `Mann: Reparatur-Service Wagner, guten Tag!\nFrau: Hallo, ich habe meine Bestellung zu ${theme.nameDe} für morgen Nachmittag gebucht. Kann ich sie stattdessen am Vormittag um 10:00 Uhr abholen?\nMann: Ja, morgen um zehn Uhr ist alles bereit für Sie.\nFrau: Perfekt, danke! Bis morgen!`,
          question: idx === 0 
            ? t("Wann hat Frau Müller nun ihren Zahnarzttermin?", "Wann hat Frau Müller jetzt einen Zahnarzttermin?")
            : t("Wann holt die Kundin ihre Bestellung ab?", "Wann holt die Kundin ihre Bestellung ab?"),
          options: idx === 0
            ? ["Morgen um 10:00 Uhr", "Morgen um 16:30 Uhr", "Nächste Woche"]
            : ["Morgen um 10:00 Uhr", "Morgen um 15:00 Uhr", "Nächste Woche Montag"],
          ans: 0,
          explanation: idx === 0 
            ? t("She reschedules for tomorrow at 16:30 (halb fünf).", "Frau Müller vereinbart den Termin für 16:30 Uhr.")
            : t("The customer moves the pickup time to 10:00 AM.", "Abholung am Vormittag um 10:00 Uhr zugesagt.")
        },
        {
          id: 2,
          title: t(`Teil 2: Interviews - Set ${sId}`, `Teil 2: Alltags-Interview - Satz ${sId}`),
          audio_transcript: idx === 0
            ? "Interviewer: Jonas, du wohnst seit einem Jahr mit zwei Freunden in einer WG. Klappt das mit dem Putzen?\nJonas: Ja, eigentlich schon! Wir haben einen Putzplan an der Kühlschranktür. Jeder ist eine Woche lang für das Badezimmer und die Küche zuständig.\nInterviewer: Und das klappt immer?\nJonas: Fast immer. Wenn jemand Prüfungsstress hat, tauschen wir einfach die Aufgaben. Man muss nur miteinander sprechen!"
            : `Interviewer: Frau Silva, macht Ihnen Ihr neues Hobby zum Thema ${theme.nameDe} Spaß?\nFrau Silva: Ja, absolut! Ich mache das dreimal in der Woche mit meinen Nachbarn. Wir teilen uns die anfallenden Kosten und helfen uns gegenseitig.\nInterviewer: Das klingt toll.\nFrau Silva: Ja, und man bleibt fit und knüpft tolle Kontakte im Stadtteil.`,
          questions: idx === 0 ? [
            { id: `a2_h_t4_q1_s${sId}`, statement: "Jonas wohnt alleine in einer großen Wohnung.", answer: false, explanationDe: "Nein, er wohnt mit zwei Freunden in einer WG (Wohngemeinschaft).", explanationEn: "No, he lives with two friends in a shared flat." },
            { id: `a2_h_t4_q2_s${sId}`, statement: "Es gibt einen schriftlichen Plan für das Putzen.", answer: true, explanationDe: "Richtig, sie haben einen Putzplan an der Kühlschranktür.", explanationEn: "Correct, they have a cleaning plan on the refrigerator door." },
            { id: `a2_h_t4_q3_s${sId}`, statement: "Bei Stress kann man Aufgaben tauschen.", answer: true, explanationDe: "Ja, sie tauschen die Aufgaben bei Prüfungsstress aus.", explanationEn: "Yes, they swap duties during exam stress." }
          ] : [
            { id: `a2_h_t4_q1_s${sId}`, statement: "Frau Silva trainiert ganz alleine.", answer: false, explanationDe: "Falsch, sie macht es dreimal wöchentlich mit Nachbarn.", explanationEn: "False, she practices it three times a week with neighbors." },
            { id: `a2_h_t4_q2_s${sId}`, statement: "Sie teilen sich die Kosten für das Hobby auf.", answer: true, explanationDe: "Richtig, sie teilen sich alle Kosten.", explanationEn: "Correct, they split all costs cleanly." },
            { id: `a2_h_t4_q3_s${sId}`, statement: "Das Hobby hilft, neue Leute zu treffen.", answer: true, explanationDe: "Richtig, sie knüpft tolle Kontakte im Stadtteil.", explanationEn: "Correct, she makes nice local connections easily." }
          ]
        }
      ],
      schreiben: [
        {
          id: 1,
          title: t(`Teil 1: Guided Text (SMS) - Set ${sId}`, `Teil 1: Kurze SMS - Satz ${sId}`),
          description: idx === 0
            ? t("Compose SMS to flatmate Lucas: 1. Delayed train reason, 2. Waiting location, 3. Arrival.", "Schreibe Lucas eine SMS: 1. Grund für Verspätung, 2. Aufenthaltsort, 3. Ankunftszeit.")
            : t(`SMS to friend Lisa: 1. Apologize for delay, 2. Mention ${theme.nameEn} schedule, 3. Propose meeting location.`, `SMS an Lisa: 1. Verspätung entschuldigen, 2. ${theme.nameDe} erwähnen, 3. Treffpunkt nennen.`),
          ideal_hints: idx === 0 ? [
            "Hallo Lucas, mein Zug hat Verspätung.",
            "Ich warte am Gleis 3.",
            "Ich bin um 19:00 Uhr da. Bis gleich!"
          ] : [
            "Hallo Lisa, tut mir leid, ich verspäte mich etwas.",
            "Unser Treffen wegen " + theme.nameDe + " findet am Bahnhof statt.",
            "Lass uns im Café Schmidt treffen. Bis gleich!"
          ],
          placeholder: t("Write your SMS here...", "Schreibe hier deine A2-SMS...")
        },
        {
          id: 2,
          title: t(`Teil 2: Semi-formal teacher mail - Set ${sId}`, `Teil 2: E-Mail an Lehrkraft - Satz ${sId}`),
          description: idx === 0
            ? t("Write formal email to teacher Frau Lorenz: 1. Sickness absence, 2. Homework inquiry, 3. Return day.", "E-Mail an Frau Lorenz: 1. Grund des Fehlens (Krankheit), 2. Hausaufgaben erfragen, 3. Rückkehr mitteilen.")
            : t(`Formal email to teacher: 1. Absence reason (${theme.nameEn}), 2. Homework inquiry, 3. Return day.`, `E-Mail an die Lehrkraft: 1. Grund des Fehlens (${theme.nameDe}), 2. Hausaufgaben erfragen, 3. Rückkehr mitteilen.`),
          ideal_hints: [
            "Sehr geehrte(r) Frau/Herr ...,",
            "ich kann heute leider nicht am Kurs teilnehmen.",
            "Könnten Sie mir bitte die Hausaufgaben zusenden?",
            "Nächsten Montag bin ich wieder anwesend.",
            "Mit freundlichen Grüßen, ..."
          ],
          placeholder: t("Write your email...", "Sehr geehrte(r) Frau/Herr ...,")
        }
      ],
      sprechen: [
        {
          id: 1,
          title: t(`Teil 1: Get to know partner - Set ${sId}`, `Teil 1: Fragen stellen mit Partnerkarten - Satz ${sId}`),
          description: t("Generate cards to ask partner questions.", "Stelle Fragen zu den Stichwortkarten, um deinen Partner kennenzulernen."),
          cards: idx === 0 ? [
            { keyword: "Schule / Ausbildung", question: "Auf welche Schule bist du früher gegangen?", answer: "Ich bin auf eine Schule in Rom gegangen." },
            { keyword: "Wochenende", question: "Was machst du am liebsten am Wochenende?", answer: "Ich treffe gern Freunde oder gehe im Park laufen." },
            { keyword: "Urlaub", question: "Wohin reist du am liebsten im Urlaub?", answer: "In den Sommerferien fahre ich sehr gerne ans Meer." },
            { keyword: "Lieblingsessen", question: "Was ist dein deutsches Lieblingsessen?", answer: "Ich mag besonders gerne Brezeln mit Butter!" }
          ] : [
            { keyword: theme.nameEn, question: `Hast du Erfahrung mit ${theme.nameDe}?`, answer: `Ja, ich habe Kurse zu ${theme.nameDe} besucht.` },
            { keyword: "Freizeit", question: "Was sind deine liebsten Hobbys in der Freizeit?", answer: "Ich koche gerne am Abend für meine Freunde." },
            { keyword: "Sprachen", question: "Welche Fremdsprachen lernst du aktuell?", answer: "Ich lerne nun intensiv Deutsch und Englisch." },
            { keyword: "Heimatstadt", question: "Woher kommst du ursprünglich?", answer: "Ich komme aus einer bezaubernden Stadt in Portugal." }
          ]
        },
        {
          id: 2,
          title: t(`Teil 2: Short Monologues - Set ${sId}`, `Teil 2: Thema-Monolog - Satz ${sId}`),
          description: t("Prepare a short continuous talk about a theme using checklist guide rules.", "Bereite einen kurzen Monolog zu dem Thema vor."),
          question: idx === 0 
            ? "Unterthema-Leitfaden: Was machen Sie mit Ihrem Geld? (Taschengeld)"
            : `Unterthema-Leitfaden: ${theme.nameEn} in Ihrem Heimatgebiet`,
          subtopics: idx === 0 ? [
            "👔 Kleidung & Mode (Buying clothes)",
            "🍔 Essen gehen & Hobbys (Fast food & hobbies)",
            "💰 Sparen für die Zukunft (Saving money)",
            "📱 Gadgets & Spiele (Gaming & entertainment)",
          ] : [
            "👶 Wichtig für Jugendliche / Kinder (Youth importance)",
            "🏃 Freizeitverhalten & Kultur (Leisure habits)",
            "🏛️ Angebote der Stadt (City offers available)",
            "💡 Persönliche Meinung (Your personal thoughts)",
          ],
          exemplarDe: idx === 0
            ? "Als Jugendlicher habe ich jeden Monat 30 Euro Taschengeld bekommen. Den größten Teil habe ich für Bücher oder Spiele ausgegeben. Ein bisschen Geld habe ich auch gespart, um mir später ein gutes Fahrrad zu kaufen. Meine Eltern haben mir beigebracht, sorgsam mit Finanzen umzugehen."
            : `Das Thema ${theme.nameDe} ist in meinem Heimatland sehr populär. Viele Menschen engagieren sich in Vereinen und organisieren gemeinsame Treffen am Wochenende. Ich persönlich denke, dass die Kommunen mehr Gelder bereitstellen sollten, um Bildungsangebote für Jugendliche auszubauen.`,
          exemplarEn: idx === 0
            ? "As a teenager, I got 30 euros pocket money monthly. I spent most of it on books. I also saved a little for a bike."
            : `The topic of ${theme.nameEn} is popular in my homeland. Many people engage in associations. In my opinion, cities should offer better public infrastructure.`
        }
      ]
    };
  });
}

import { generateB1ExamSets, B1_STRUCTURE_INFO } from './b1ExamData.js';

export { B1_STRUCTURE_INFO };

export function getB1ExamSets(t) {
  return generateB1ExamSets(t);
}
