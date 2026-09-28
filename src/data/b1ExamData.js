// Goethe-Institut B1 Authentic Exam Database
// Follows the official CEFR B1 Exam specification:
// - Lesen (Reading): 65 Min, 30 Marks (Teile 1-5)
// - Hören (Listening): 40 Min, 30 Marks (Teile 1-4)
// - Schreiben (Writing): 60 Min, 100 Marks (Teile 1-3)
// - Sprechen (Speaking): 15 Min, 100 Marks (Teile 1-3 + Aussprache)
// Passing score: 60% in each module

import { B1_SPRECHEN_TOPICS, GOETHE_B1_SPRECHEN_REDEMITTEL } from './b1SprechenTopics.js';

export { B1_SPRECHEN_TOPICS, GOETHE_B1_SPRECHEN_REDEMITTEL };

export const B1_STRUCTURE_INFO = {
  title: "Goethe-Zertifikat B1 Prüfungsaufbau",
  passingScore: "Mindestens 60% in jedem Prüfungsteil (60/100 Punkte bzw. 18/30 Punkte)",
  modules: [
    {
      id: "lesen",
      name: "Lesen",
      nameEn: "Reading",
      icon: "📖",
      time: "65 Minuten",
      marks: "30 Punkte (60% = 18 Punkte)",
      teile: [
        { teil: 1, marks: "6 Punkte", desc: "Private / berufsbezogene E-Mail lesen (6 Richtig/Falsch-Aufgaben)" },
        { teil: 2, marks: "6 Punkte", desc: "Zwei Pressetexte / Berichte lesen (je 3 Multiple-Choice-Aufgaben, total 6 Aufgaben)" },
        { teil: 3, marks: "7 Punkte", desc: "7 Personenbedürfnisse 10 Anzeigen zuordnen (oder 0 wählen)" },
        { teil: 4, marks: "7 Punkte", desc: "7 Leserkommentare in einem Diskussionsforum analysieren (Ja/Dafür vs. Nein/Dagegen)" },
        { teil: 5, marks: "4 Punkte", desc: "Eine Hausordnung / Richtlinie / Informationstabelle verstehen (4 Multiple-Choice-Aufgaben)" }
      ]
    },
    {
      id: "hoeren",
      name: "Hören",
      nameEn: "Listening",
      icon: "🎧",
      time: "40 Minuten",
      marks: "30 Punkte (60% = 18 Punkte)",
      teile: [
        { teil: 1, marks: "10 Punkte", desc: "5 kurze Alltagsdialoge / Durchsagen (je 1 Richtig/Falsch + 1 Multiple-Choice, 2x gehört)" },
        { teil: 2, marks: "5 Punkte", desc: "Einen längeren Monolog / Führung / Vortrag verstehen (5 Multiple-Choice-Aufgaben, 1x gehört)" },
        { teil: 3, marks: "7 Punkte", desc: "Ein informelles Gespräch zwischen zwei Personen verstehen (7 Richtig/Falsch-Aufgaben, 1x gehört)" },
        { teil: 4, marks: "8 Punkte", desc: "Eine Radiodiskussion mit Moderator und zwei Gästen verfolgen (8 Aufgaben zu Meinungen & Aussagen, 2x gehört)" }
      ]
    },
    {
      id: "schreiben",
      name: "Schreiben",
      nameEn: "Writing",
      icon: "✍️",
      time: "60 Minuten",
      marks: "100 Punkte (60% = 60 Punkte)",
      teile: [
        { teil: 1, marks: "40 Punkte", desc: "Informelle E-Mail an eine/n Freund/in über ein verpasstes Event (ca. 80 Wörter, 3 Leitpunkte)" },
        { teil: 2, marks: "40 Punkte", desc: "Einen Diskussionsbeitrag / Forumsbeitrag im Internet verfassen (ca. 80 Wörter, 3 Leitpunkte)" },
        { teil: 3, marks: "20 Punkte", desc: "Eine formelle Mitteilung / E-Mail an Kursleiter/Chef schreiben (ca. 40 Wörter, Höflichkeitsform)" }
      ]
    },
    {
      id: "sprechen",
      name: "Sprechen",
      nameEn: "Speaking",
      icon: "🗣️",
      time: "ca. 15 Minuten (Paarprüfung)",
      marks: "100 Punkte (60% = 60 Punkte)",
      teile: [
        { teil: 1, marks: "28 Punkte", desc: "Gemeinsam etwas planen (ca. 3 Min., Zeit, Ort, Aufgaben, Mitbringsel abstimmen)" },
        { teil: 2, marks: "40 Punkte", desc: "Ein Thema präsentieren (ca. 3 Min., 5 Folien: Einleitung, Erfahrung, Heimatland, Vor-/Nachteile, Abschluss)" },
        { teil: 3, marks: "16 Punkte", desc: "Über das Thema sprechen / Feedback & Rückfragen (Feedback geben, Frage stellen & beantworten)" },
        { teil: 4, marks: "16 Punkte", desc: "Aussprache & Redefluss (Wortakzent, Satzmelodie, Intonation und Flüssigkeit während der gesamten Prüfung)" }
      ]
    }
  ]
};

const B1_THEMES = [
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

export function generateB1ExamSets(t) {
  return B1_THEMES.map((theme, idx) => {
    const sId = idx + 1;

    // 1. LESEN (5 Teile)
    const lesen = [
      // Teil 1: E-Mail & 6 True/False
      {
        id: 1,
        teil: 1,
        type: 'true_false',
        title: t(`Teil 1: Personal Email - Set ${sId}`, `Teil 1: Persönliche E-Mail (6 Punkte) - Satz ${sId}`),
        instruction: t(
          "Read the email and decide if statements 1–6 are True (Richtig) or False (Falsch). Time target: ca. 10 minutes.",
          "Lies die E-Mail und entscheide, ob die Aussagen 1–6 Richtig oder Falsch sind. Zeitvorgabe: ca. 10 Minuten."
        ),
        passage: idx === 0
          ? `Liebe Caroline,\n\nich hoffe, dir geht es gut! Ich wollte dir unbedingt von meinem neuen Alltag nach dem Umzug berichten. Wie du weißt, bin ich vor zwei Wochen in eine ruhige Vorstadt-Wohnung gezogen, um mich besser auf mein Studium und meine Abschlussprüfungen konzentrieren zu können.\nDie Wohnung gefällt mir prima: Sie hat einen sonnigen Südbalkon und einen kleinen Arbeitsbereich. Das Einzige, was mich etwas stört, ist der Weg zur Universität. Statt wie früher fünf Minuten mit dem Fahrrad brauche ich jetzt fast vierzig Minuten mit der S-Bahn. Zum Glück fährt die Bahn alle zehn Minuten pünktlich.\nLetzten Samstag habe ich eine kleine Einweihungsfeier veranstaltet. Schade, dass du wegen deiner Dienstreise nach Hamburg nicht dabei sein konntest! Wir haben auf dem Balkon gegrillt und bis spät in die Nacht Musik gehört. Die Nachbarn waren sehr verständnisvoll und haben sich nicht beschwert.\nNächsten Monat habe ich ein langes Wochenende frei. Hast du Lust, mich zu besuchen? Ich könnte dir die Gegend zeigen und wir kochen gemeinsam etwas Schönes!\n\nLiebe Grüße,\nMarkus`
          : `Hallo Felix,\n\nich hoffe, du hast eine erfolgreiche Woche! Bei mir im Bereich ${theme.nameDe} hat sich in den letzten Wochen einiges getan. Seit Anfang des Monats nehme ich an einem intensiven Projekt teil, das von unserer Abteilung initiiert wurde.\nDas Projekt verlangt zwar viel Engagement und zusätzliche Überstunden am Donnerstagabend, aber das Team arbeitet hervorragend zusammen. Wir haben gestern den ersten Zwischenbericht abgegeben und sogar ein großes Lob von der Leitung erhalten.\nLetzte Woche wollte ich eigentlich zum Sportkurs gehen, musste aber wegen einer spontanen Teambesprechung absagen. Trotz des Stresses versuche ich, mich gesund zu ernähren und abends spazieren zu gehen.\nWie sieht es bei dir am kommenden Wochenende aus? Wir könnten uns am Samstag auf einen Kaffee treffen und in Ruhe über die Neuigkeiten sprechen. Sag mir Bescheid!\n\nHerzliche Grüße,\nStefan`,
        questions: idx === 0 ? [
          { id: `b1_l_t1_q1_s${sId}`, statement: "1. Markus wohnt erst seit wenigen Wochen in der neuen Wohnung.", answer: true, explanationDe: "Richtig. Er schreibt 'vor zwei Wochen'.", explanationEn: "Correct. He moved in two weeks ago." },
          { id: `b1_l_t1_q2_s${sId}`, statement: "2. Markus braucht zur Universität weniger Zeit als früher.", answer: false, explanationDe: "Falsch. Er braucht jetzt 40 Minuten statt früher 5 Minuten.", explanationEn: "False. He takes 40 min now instead of 5 min." },
          { id: `b1_l_t1_q3_s${sId}`, statement: "3. Die S-Bahn fährt nur zweimal pro Stunde.", answer: false, explanationDe: "Falsch. Sie fährt alle 10 Minuten.", explanationEn: "False. It runs every 10 minutes." },
          { id: `b1_l_t1_q4_s${sId}`, statement: "4. Caroline konnte nicht zur Einweihungsfeier kommen, weil sie beruflich verreist war.", answer: true, explanationDe: "Richtig. Sie war auf Dienstreise in Hamburg.", explanationEn: "Correct. She was on a business trip to Hamburg." },
          { id: `b1_l_t1_q5_s${sId}`, statement: "5. Die Nachbarn haben wegen der lauten Musik die Polizei gerufen.", answer: false, explanationDe: "Falsch. Sie waren sehr verständnisvoll.", explanationEn: "False. Neighbors were very understanding." },
          { id: `b1_l_t1_q6_s${sId}`, statement: "6. Markus lädt Caroline ein, ihn im nächsten Monat zu besuchen.", answer: true, explanationDe: "Richtig. Er schlägt vor, dass sie ihn an einem freien Wochenende besucht.", explanationEn: "Correct. He invites her for a long weekend." }
        ] : [
          { id: `b1_l_t1_q1_s${sId}`, statement: "1. Stefan ist mit der Arbeit im aktuellen Team sehr unzufrieden.", answer: false, explanationDe: "Falsch. Er betont, dass das Team hervorragend zusammenarbeitet.", explanationEn: "False. He stresses that the team works great." },
          { id: `b1_l_t1_q2_s${sId}`, statement: `2. Im Projekt zum Thema ${theme.nameDe} fallen teilweise Überstunden an.`, answer: true, explanationDe: "Richtig. Es gibt zusätzliche Überstunden am Donnerstagabend.", explanationEn: "Correct. There is overtime on Thursday evenings." },
          { id: `b1_l_t1_q3_s${sId}`, statement: "3. Die Abteilungsleitung kritisierte den ersten Zwischenbericht scharf.", answer: false, explanationDe: "Falsch. Sie erhielten ein großes Lob.", explanationEn: "False. They received high praise from management." },
          { id: `b1_l_t1_q4_s${sId}`, statement: "4. Stefan konnte letzte Woche nicht zum Sportkurs gehen.", answer: true, explanationDe: "Richtig. Wegen einer spontanen Besprechung musste er absagen.", explanationEn: "Correct. He had to cancel due to a meeting." },
          { id: `b1_l_t1_q5_s${sId}`, statement: "5. Stefan ernährt sich derzeit ausschließlich von Fertiggerichten.", answer: false, explanationDe: "Falsch. Er achtet darauf, sich gesund zu ernähren.", explanationEn: "False. He tries to eat healthily." },
          { id: `b1_l_t1_q6_s${sId}`, statement: "6. Stefan schlägt ein Treffen am kommenden Samstag vor.", answer: true, explanationDe: "Richtig. Er schlägt ein Kaffeetreffen am Samstag vor.", explanationEn: "Correct. He suggests coffee on Saturday." }
        ]
      },

      // Teil 2: 2 Pressetexte / Berichte & 6 Multiple-Choice
      {
        id: 2,
        teil: 2,
        type: 'multiple_choice',
        title: t(`Teil 2: Press Articles - Set ${sId}`, `Teil 2: Zwei Pressetexte (6 Punkte) - Satz ${sId}`),
        instruction: t(
          "Read both articles and answer questions 7–12 with the best option (a, b, or c). Time target: ca. 20 minutes.",
          "Lies die beiden Texte und wähle bei den Aufgaben 7–12 die richtige Lösung (a, b oder c). Zeitvorgabe: ca. 20 Minuten."
        ),
        passage: t(
          `📰 TEXT 1: BERLINER TAGESBLATT - TRENDS IN ${theme.nameEn.toUpperCase()}\nIn German urban centers, more and more citizens are opting for community-based sharing programs instead of individual purchases. According to a recent survey by the Federal Environmental Agency, over 40% of households in metropolitan areas regularly use shared tools, vehicles, or neighborhood workshops. Sociologists emphasize that this trend not only saves considerable personal expenses, but also strengthens local social ties across different age groups.\n\n📰 TEXT 2: WIRTSCHAFTSREPORT - MODERN WORKING ENVIRONMENTS\nModern enterprises in Germany are increasingly implementing flexible work-hour models to maintain staff satisfaction. While full remote work was dominant during previous years, the current hybrid standard combines two office attendance days with three telecommuting days. Surveys reveal that in-person collaboration remains indispensable for creative brainstorming and onboarding junior employees.`,
          `📰 TEXT 1: BERLINER TAGESBLATT - TREND ZUM TEILEN IM BEREICH ${theme.nameDe.toUpperCase()}\nIn deutschen Großstädten entscheiden sich immer mehr Bürger für genossenschaftliche Sharing-Modelle statt für Neukäufe. Laut einer aktuellen Umfrage des Umweltbundesamts nutzen bereits über 40 Prozent der Haushalte in Ballungsräumen geteilte Werkzeuge, Fahrzeuge oder Nachbarschaftswerkstätten. Soziologen betonen, dass dieser Trend nicht nur erhebliche Kosten spart, sondern vor allem das soziale Miteinander im Quartier generationsübergreifend stärkt.\n\n📰 TEXT 2: WIRTSCHAFTSREPORT - MODERNE ARBEITSWELTEN\nDeutsche Unternehmen setzen vermehrt auf flexible Arbeitszeitmodelle, um qualifizierte Fachkräfte zu binden. Während in den Vorjahren reine Heimarbeit dominierte, hat sich nun ein hybrides Modell mit zwei festen Bürotagen und drei Tagen im Homeoffice etabliert. Umfragen belegen: Die persönliche Begegnung vor Ort ist für kreative Brainstormings und die Einarbeitung neuer Kolleginnen und Kollegen nach wie vor unverzichtbar.`
        ),
        questions: [
          {
            id: `b1_l_t2_q7_s${sId}`,
            qDe: "7. Was zeigt die Umfrage des Umweltbundesamts in Text 1?",
            qEn: "7. What does the Environmental Agency survey show in Text 1?",
            opts: [
              t("a) Niemand interessiert sich für geteilte Werkzeuge.", "a) Niemand interessiert sich für geteilte Werkzeuge."),
              t("b) Über 40% der Haushalte in Ballungsräumen nutzen Sharing-Angebote.", "b) Über 40% der Haushalte in Ballungsräumen nutzen Sharing-Angebote."),
              t("c) Die meisten Menschen kaufen lieber alles neu im Baumarkt.", "c) Die meisten Menschen kaufen lieber alles neu im Baumarkt.")
            ],
            ans: 1,
            explanationDe: "Richtig. Im Text steht: 'nutzen bereits über 40 Prozent der Haushalte in Ballungsräumen geteilte Werkzeuge...'",
            explanationEn: "Correct. Text states over 40% of households in metropolitan areas use shared tools."
          },
          {
            id: `b1_l_t2_q8_s${sId}`,
            qDe: "8. Welchen Vorteil betonen Soziologen im ersten Artikel?",
            qEn: "8. What benefit do sociologists emphasize in the first article?",
            opts: [
              t("a) Man muss überhaupt nicht mehr mit Nachbarn sprechen.", "a) Man muss überhaupt nicht mehr mit Nachbarn sprechen."),
              t("b) Man spart Geld und stärkt die sozialen Kontakte im Viertel.", "b) Man spart Geld und stärkt die sozialen Kontakte im Viertel."),
              t("c) Die Wohnungsmieten werden dadurch automatisch halbiert.", "c) Die Wohnungsmieten werden dadurch automatisch halbiert.")
            ],
            ans: 1,
            explanationDe: "Richtig. Sie betonen Kostenersparnis und Stärkung des sozialen Miteinanders.",
            explanationEn: "Correct. They highlight cost savings and neighborhood community bonds."
          },
          {
            id: `b1_l_t2_q9_s${sId}`,
            qDe: "9. Die Sharing-Werkstätten richten sich ...",
            qEn: "9. The sharing workshops target ...",
            opts: [
              t("a) ausschließlich an Senioren über 70 Jahre.", "a) ausschließlich an Senioren über 70 Jahre."),
              t("b) an Bürger verschiedener Altersgruppen.", "b) an Bürger verschiedener Altersgruppen."),
              t("c) nur an Touristen aus dem Ausland.", "c) nur an Touristen aus dem Ausland.")
            ],
            ans: 1,
            explanationDe: "Richtig. Das Miteinander wird 'generationsübergreifend' gestärkt.",
            explanationEn: "Correct. It strengthens bonds across all generations."
          },
          {
            id: `b1_l_t2_q10_s${sId}`,
            qDe: "10. Welches Arbeitsmodell ist laut Text 2 heute Standard?",
            qEn: "10. Which work model is standard according to Text 2?",
            opts: [
              t("a) 100% Büropräsenz ohne Ausnahme.", "a) 100% Büropräsenz ohne Ausnahme."),
              t("b) Hybrides Arbeiten mit zwei Bürotagen und drei Homeoffice-Tagen.", "b) Hybrides Arbeiten mit zwei Bürotagen und drei Homeoffice-Tagen."),
              t("c) Nur noch Nachtschichten am Wochenende.", "c) Nur noch Nachtschichten am Wochenende.")
            ],
            ans: 1,
            explanationDe: "Richtig. Zwei feste Bürotage und drei Tage im Homeoffice haben sich etabliert.",
            explanationEn: "Correct. Hybrid model with 2 office days and 3 home office days."
          },
          {
            id: `b1_l_t2_q11_s${sId}`,
            qDe: "11. Warum ist der direkte Kontakt im Büro weiterhin wichtig?",
            qEn: "11. Why is direct contact in the office still important?",
            opts: [
              t("a) Für kreative Ideen und die Einarbeitung neuer Mitarbeiter.", "a) Für kreative Ideen und die Einarbeitung neuer Mitarbeiter."),
              t("b) Weil man dort kostenlosen Kaffee trinken kann.", "b) Weil man dort kostenlosen Kaffee trinken kann."),
              t("c) Um die Büromöbel nicht ungenutzt verstauben zu lassen.", "c) Um die Büromöbel nicht ungenutzt verstauben zu lassen.")
            ],
            ans: 0,
            explanationDe: "Richtig. Für kreative Brainstormings und die Einarbeitung neuer Kolleginnen und Kollegen.",
            explanationEn: "Correct. For creative brainstorming and training new colleagues."
          },
          {
            id: `b1_l_t2_q12_s${sId}`,
            qDe: "12. Welches Hauptziel verfolgen die Unternehmen mit den flexiblen Modellen?",
            qEn: "12. What primary goal do firms pursue with flexible models?",
            opts: [
              t("a) Gehälter um die Hälfte zu kürzen.", "a) Gehälter um die Hälfte zu kürzen."),
              t("b) Qualifizierte Fachkräfte langfristig an die Firma zu binden.", "b) Qualifizierte Fachkräfte langfristig an die Firma zu binden."),
              t("c) Sämtliche Bürogebäude in der Stadt sofort zu verkaufen.", "c) Sämtliche Bürogebäude in der Stadt sofort zu verkaufen.")
            ],
            ans: 1,
            explanationDe: "Richtig. Ziel ist es, 'qualifizierte Fachkräfte zu binden'.",
            explanationEn: "Correct. Goal is employee retention of qualified staff."
          }
        ]
      },

      // Teil 3: 7 Personen & 10 Anzeigen
      {
        id: 3,
        teil: 3,
        type: 'mapping',
        title: t(`Teil 3: Advertisement Matching - Set ${sId}`, `Teil 3: Anzeigen zuordnen (7 Punkte) - Satz ${sId}`),
        instruction: t(
          "Match each person's requirement with the best advertisement (A–J). If no advertisement fits, select '0'. Time target: ca. 10 minutes.",
          "Lies die Wünsche der Personen 13–19 und ordne ihnen die passende Anzeige (A–J) zu. Wenn keine Anzeige passt, wähle '0'. Zeitvorgabe: ca. 10 Minuten."
        ),
        ads: [
          { id: 'A', textDe: "Fahrrad-Kurierdienst Blitz: Suchen sportliche Fahrer für Wochenendschichten. Eigenes Rad von Vorteil, gute Bezahlung.", textEn: "Bicycle Courier Blitz: Seeking sporty riders for weekend shifts. Own bike advantageous, good pay." },
          { id: 'B', textDe: "Kanzlei Weber & Partner: Bieten bezahltes Sommerpraktikum für Studierende mit sehr guten Office-Kenntnissen.", textEn: "Law Office Weber & Partner: Offering paid summer internship for students with strong Office skills." },
          { id: 'C', textDe: "Kreativ-Atelier Farbenspiel: Wochenendkurse für Ölmalerei und Aquarelltechnik für Fortgeschrittene ab 16 Jahren.", textEn: "Creative Studio Colors: Weekend courses in oil painting and watercolor for advanced learners." },
          { id: 'D', textDe: "Café Glockenspiel: Servicekraft (m/w/d) in Teilzeit für Samstag- und Sonntagvormittag gesucht. Erfahrung erwünscht.", textEn: "Café Glockenspiel: Part-time service staff wanted for Saturday and Sunday mornings. Experience desired." },
          { id: 'E', textDe: "Sprachschule Lingua: Intensiver Konversationskurs Spanisch für den Urlaub, donnerstags 18:30 bis 20:30 Uhr.", textEn: "Language School Lingua: Intensive Spanish holiday conversation, Thursdays 6:30-8:30 PM." },
          { id: 'F', textDe: "Bio-Bauernhof Sonnenschein: Suchen helfende Hände bei der Apfelernte im September. Kost und Logis inklusive.", textEn: "Organic Farm Sunshine: Helpers needed for apple harvest in September. Room & board included." },
          { id: 'G', textDe: "IT-Reparaturservice Chip: Bieten flexible Werkstudentenstelle für Hardware-Reparatur und Kundenberatung.", textEn: "IT Repair Chip: Flexible student job for hardware repair and customer consultation." },
          { id: 'H', textDe: "Sportverein Grün-Weiß: Schwimmtraining für Erwachsene jeden Dienstagabend. Schnuppertraining kostenlos.", textEn: "Sports Club Grün-Weiß: Swimming training for adults every Tuesday evening. Free trial session." },
          { id: 'I', textDe: "Gebrauchtbuchladen Antiqua: Sortierhilfe gesucht, mittwochs 4 Stunden am Nachmittag.", textEn: "Used Bookstore Antiqua: Sorting assistant wanted, Wednesdays 4 hours in afternoon." },
          { id: 'J', textDe: "Fotoclub Fokus: Einführungsworkshop digitale Fotografie mit eigener Spiegelreflexkamera.", textEn: "Photo Club Fokus: Introductory workshop on digital photography with own DSLR camera." }
        ],
        people: [
          { id: `p1_s${sId}`, name: "13. Riccardo (21)", wishDe: "Möchte sich am Wochenende sportlich betätigen und dabei etwas Geld auf dem Fahrrad verdienen.", wishEn: "Wants to do sports on weekends and earn some money on his bike." },
          { id: `p2_s${sId}`, name: "14. Yvonne (24)", wishDe: "Studiert Jura und sucht für die Semesterferien eine bezahlte Bürotätigkeit mit Computerarbeit.", wishEn: "Studies law and wants a paid summer desk job with computer tasks." },
          { id: `p3_s${sId}`, name: "15. Maria (30)", wishDe: "Möchte ihr Spanisch für die bevorstehende Reise nach Südamerika verbessern.", wishEn: "Wants to improve her Spanish for an upcoming trip to South America." },
          { id: `p4_s${sId}`, name: "16. Lukas (19)", wishDe: "Liebt Computer-Hardware und möchte neben dem Studium PCs reparieren und beraten.", wishEn: "Loves computer hardware and wants a student job repairing PCs." },
          { id: `p5_s${sId}`, name: "17. Daniel (28)", wishDe: "Sucht einen Wochenendjob im Café als Kellner am Vormittag.", wishEn: "Wants a weekend morning waiter job in a café." },
          { id: `p6_s${sId}`, name: "18. Sonja (35)", wishDe: "Möchte abends regelmäßig schwimmen gehen und eine Trainingsgruppe besuchen.", wishEn: "Wants regular evening swimming training with an adult group." },
          { id: `p7_s${sId}`, name: "19. Tobias (22)", wishDe: "Möchte lernen, wie man professionell ein Motorrad repariert und wartet.", wishEn: "Wants to learn how to professionally repair and service a motorbike." }
        ],
        correctMapping: {
          [`p1_s${sId}`]: 'A',
          [`p2_s${sId}`]: 'B',
          [`p3_s${sId}`]: 'E',
          [`p4_s${sId}`]: 'G',
          [`p5_s${sId}`]: 'D',
          [`p6_s${sId}`]: 'H',
          [`p7_s${sId}`]: '0'
        }
      },

      // Teil 4: 7 Leserkommentare & Meinungen (Ja / Nein)
      {
        id: 4,
        teil: 4,
        type: 'opinion',
        title: t(`Teil 4: Forum Opinions - Set ${sId}`, `Teil 4: Meinungen im Internetforum (7 Punkte) - Satz ${sId}`),
        instruction: t(
          "Read the 7 comments on the topic 'Should city centers be completely car-free?'. Decide whether each writer is FOR (Ja) or AGAINST (Nein). Time target: ca. 15 minutes.",
          "Lies die 7 Kommentare zum Thema 'Sollten Innenstädte komplett autofrei sein?'. Ist die Person DAFÜR (Ja) oder DAGEGEN (Nein)? Zeitvorgabe: ca. 15 Minuten."
        ),
        passage: t(
          `🗣️ DEUTSCHLAND-FORUM: "AUTOFREIE INNENSTÄDTE - SINNVOLL ODER UNREALISTISCH?"\n
1. Fabian (24, Student): "Absolut dafür! Autos verstopfen die Straßen, machen Lärm und verschmutzen die Luft. Ohne Autos gewinnen wir wertvollen Platz für Straßencafés, Grünflächen und sichere Radwege."
2. Claudia (48, Einzelhändlerin): "Ein völliges Verbot würde uns Ladenbesitzern die Existenz kosten. Viele Kunden kommen aus den Vororten und kaufen größere Waren ein, die man unmöglich mit dem Bus transportieren kann."
3. Jan (31, Architekt): "Ich befürworte autofreie Zonen uneingeschränkt. Städte in Skandinavien zeigen eindrucksvoll, dass Handel und Lebensqualität deutlich aufblühen, sobald der motorisierte Individualverkehr draußen bleibt."
4. Renate (62, Rentnerin): "Für ältere Menschen oder Menschen mit Gehbehinderung ist ein Verbot fatal. Die Wege von den Haltestellen sind oft zu weit, und Taxis müssten wenigstens bis vor die Haustür fahren dürfen."
5. Sebastian (39, Familienvater): "Wir brauchen dringend autofreie Zentren. Ich möchte, dass meine Kinder sicher durch die Fußgängerzonen laufen können, ohne an jeder Ecke Angst vor abbiegenden Fahrzeugen haben zu müssen."
6. Monika (53, Pendlerin): "Der öffentliche Nahverkehr ist auf dem Land noch viel zu unzuverlässig und teuer. Solange keine echten Alternativen existieren, ist ein rigoroses Autoverbot schlicht unsozial."
7. Tim (27, Softwareentwickler): "Volle Zustimmung zum Verbot! Elektrobusse und Lastenfahrräder reichen für Lieferungen völlig aus. Autos gehören ins Parkhaus am Stadtrand."`,
          `🗣️ DEUTSCHLAND-FORUM: "AUTOFREIE INNENSTÄDTE - SINNVOLL ODER UNREALISTISCH?"\n
1. Fabian (24, Student): "Absolut dafür! Autos verstopfen die Straßen, machen Lärm und verschmutzen die Luft. Ohne Autos gewinnen wir wertvollen Platz für Straßencafés, Grünflächen und sichere Radwege."
2. Claudia (48, Einzelhändlerin): "Ein völliges Verbot würde uns Ladenbesitzern die Existenz kosten. Viele Kunden kommen aus den Vororten und kaufen größere Waren ein, die man unmöglich mit dem Bus transportieren kann."
3. Jan (31, Architekt): "Ich befürworte autofreie Zonen uneingeschränkt. Städte in Skandinavien zeigen eindrucksvoll, dass Handel und Lebensqualität deutlich aufblühen, sobald der motorisierte Individualverkehr draußen bleibt."
4. Renate (62, Rentnerin): "Für ältere Menschen oder Menschen mit Gehbehinderung ist ein Verbot fatal. Die Wege von den Haltestellen sind oft zu weit, und Taxis müssten wenigstens bis vor die Haustür fahren dürfen."
5. Sebastian (39, Familienvater): "Wir brauchen dringend autofreie Zentren. Ich möchte, dass meine Kinder sicher durch die Fußgängerzonen laufen können, ohne an jeder Ecke Angst vor abbiegenden Fahrzeugen haben zu müssen."
6. Monika (53, Pendlerin): "Der öffentliche Nahverkehr ist auf dem Land noch viel zu unzuverlässig und teuer. Solange keine echten Alternativen existieren, ist ein rigoroses Autoverbot schlicht unsozial."
7. Tim (27, Softwareentwickler): "Volle Zustimmung zum Verbot! Elektrobusse und Lastenfahrräder reichen für Lieferungen völlig aus. Autos gehören ins Parkhaus am Stadtrand."`
        ),
        questions: [
          { id: `b1_l_t4_q20_s${sId}`, person: "20. Fabian (24)", opinion: "Ja", explanation: t("Fabian supports car-free centers for cleaner air and green spaces.", "Fabian ist für ein Verbot, um Platz für Cafés und Radwege zu schaffen.") },
          { id: `b1_l_t4_q21_s${sId}`, person: "21. Claudia (48)", opinion: "Nein", explanation: t("Claudia fears business losses for retail stores.", "Claudia befürchtet Umsatzverluste für Händler.") },
          { id: `b1_l_t4_q22_s${sId}`, person: "22. Jan (31)", opinion: "Ja", explanation: t("Jan points to successful Scandinavian models.", "Jan verweist auf positive Beispiele aus Skandinavien.") },
          { id: `b1_l_t4_q23_s${sId}`, person: "23. Renate (62)", opinion: "Nein", explanation: t("Renate worries about accessibility for seniors and handicapped people.", "Renate sorgt sich um die Mobilität älterer Menschen.") },
          { id: `b1_l_t4_q24_s${sId}`, person: "24. Sebastian (39)", opinion: "Ja", explanation: t("Sebastian emphasizes safety for children.", "Sebastian betont die Sicherheit für Kinder.") },
          { id: `b1_l_t4_q25_s${sId}`, person: "25. Monika (53)", opinion: "Nein", explanation: t("Monika considers bans unfair due to insufficient rural public transit.", "Monika hält Verbote bei schlechtem Land-ÖPNV für unsozial.") },
          { id: `b1_l_t4_q26_s${sId}`, person: "26. Tim (27)", opinion: "Ja", explanation: t("Tim argues park-and-ride plus cargo bikes are sufficient.", "Tim plädiert für Lastenräder und Parkhäuser am Stadtrand.") }
        ]
      },

      // Teil 5: Hausordnung / Richtlinie & 4 Multiple-Choice
      {
        id: 5,
        teil: 5,
        type: 'multiple_choice',
        title: t(`Teil 5: Official Regulations & Table - Set ${sId}`, `Teil 5: Haus- & Benutzerordnung (4 Punkte) - Satz ${sId}`),
        instruction: t(
          "Read the official house rules and answer questions 27–30 with the correct option (a, b, or c). Time target: ca. 10 minutes.",
          "Lies die Auszüge aus der Haus- und Nutzungsordnung und wähle bei den Aufgaben 27–30 die richtige Lösung (a, b oder c). Zeitvorgabe: ca. 10 Minuten."
        ),
        passage: t(
          `📋 HAUSORDNUNG DER WOHNANLAGE AM PARKRING
§ 1 Ruhezeiten
Die allgemeinen Ruhezeiten sind von 13:00 bis 15:00 Uhr (Mittagsruhe) sowie von 22:00 bis 07:00 Uhr (Nachtruhe). Während dieser Zeiten sind laute Musik, Handwerkerarbeiten (z.B. Bohren) und lautes Staubsaugen im gesamten Gebäude untersagt.

§ 2 Fluchtwege und Hausflur
Kinderwagen und Gehhilfen dürfen im Erdgeschoss unter der Treppe abgestellt werden, sofern sie den Fluchtweg nicht behindern. Das Abstellen von Fahrrädern, Schuhschränken oder Müllsäcken im Treppenhaus ist aus Brandschutzgründen strengstens untersagt. Fahrräder gehören in den Fahrradkeller.

§ 3 Mülltrennung
Restmüll, Altpapier und Verpackungen (Gelber Sack) sind sorgfältig in den dafür vorgesehenen Containern im Hof zu entsorgen. Biomüll muss in kompostierbaren Papiertüten eingeworfen werden. Sperrmüll darf erst am Vorabend des Abholtermins an der Straße bereitgestellt werden.

§ 4 Haustierhaltung
Das Halten von Kleintieren (z.B. Hamster, Zierfische) ist ohne gesonderte Genehmigung gestattet. Die Haltung von Hunden und Katzen bedarf der vorherigen schriftlichen Zustimmung der Hausverwaltung. Im gesamten Hausflur und Hof gilt für Hunde Leinenpflicht.`,
          `📋 HAUSORDNUNG DER WOHNANLAGE AM PARKRING
§ 1 Ruhezeiten
Die allgemeinen Ruhezeiten sind von 13:00 bis 15:00 Uhr (Mittagsruhe) sowie von 22:00 bis 07:00 Uhr (Nachtruhe). Während dieser Zeiten sind laute Musik, Handwerkerarbeiten (z.B. Bohren) und lautes Staubsaugen im gesamten Gebäude untersagt.

§ 2 Fluchtwege und Hausflur
Kinderwagen und Gehhilfen dürfen im Erdgeschoss unter der Treppe abgestellt werden, sofern sie den Fluchtweg nicht behindern. Das Abstellen von Fahrrädern, Schuhschränken oder Müllsäcken im Treppenhaus ist aus Brandschutzgründen strengstens untersagt. Fahrräder gehören in den Fahrradkeller.

§ 3 Mülltrennung
Restmüll, Altpapier und Verpackungen (Gelber Sack) sind sorgfältig in den dafür vorgesehenen Containern im Hof zu entsorgen. Biomüll muss in kompostierbaren Papiertüten eingeworfen werden. Sperrmüll darf erst am Vorabend des Abholtermins an der Straße bereitgestellt werden.

§ 4 Haustierhaltung
Das Halten von Kleintieren (z.B. Hamster, Zierfische) ist ohne gesonderte Genehmigung gestattet. Die Haltung von Hunden und Katzen bedarf der vorherigen schriftlichen Zustimmung der Hausverwaltung. Im gesamten Hausflur und Hof gilt für Hunde Leinenpflicht.`
        ),
        questions: [
          {
            id: `b1_l_t5_q27_s${sId}`,
            qDe: "27. Wann darf man in der Wohnung renovieren und laute Bohrmaschinen benutzen?",
            qEn: "27. When are noisy renovation drills permitted in the apartment?",
            opts: [
              t("a) Rund um die Uhr, solange man vorher Bescheid gibt.", "a) Rund um die Uhr, solange man vorher Bescheid gibt."),
              t("b) Außerhalb der Ruhezeiten (z.B. vormittags ab 7 Uhr oder nachmittags von 15 bis 22 Uhr).", "b) Außerhalb der Ruhezeiten (z.B. vormittags ab 7 Uhr oder nachmittags von 15 bis 22 Uhr)."),
              t("c) Nur nachts zwischen 22:00 und 07:00 Uhr.", "c) Nur nachts zwischen 22:00 und 07:00 Uhr.")
            ],
            ans: 1,
            explanationDe: "Richtig. Von 13-15 Uhr und 22-7 Uhr gilt Ruhezeit.",
            explanationEn: "Correct. Quiet hours are 13-15 and 22-07."
          },
          {
            id: `b1_l_t5_q28_s${sId}`,
            qDe: "28. Wo dürfen Fahrräder der Hausbewohner abgestellt werden?",
            qEn: "28. Where may residents store their bicycles?",
            opts: [
              t("a) Direkt vor der eigenen Wohnungstür im Flur.", "a) Direkt vor der eigenen Wohnungstür im Flur."),
              t("b) Im eigens dafür vorgesehenen Fahrradkeller.", "b) Im eigens dafür vorgesehenen Fahrradkeller."),
              t("c) Im Treppenhaus neben den Müllsäcken.", "c) Im Treppenhaus neben den Müllsäcken.")
            ],
            ans: 1,
            explanationDe: "Richtig. 'Fahrräder gehören in den Fahrradkeller.'",
            explanationEn: "Correct. Bicycles belong in the bike cellar."
          },
          {
            id: `b1_l_t5_q29_s${sId}`,
            qDe: "29. Wann darf Sperrmüll an die Straße gestellt werden?",
            qEn: "29. When may bulky waste be placed on the street?",
            opts: [
              t("a) Bereits eine Woche im Voraus.", "a) Bereits eine Woche im Voraus."),
              t("b) Erst am Vorabend des offiziellen Abholtermins.", "b) Erst am Vorabend des offiziellen Abholtermins."),
              t("c) Jederzeit, wenn im Keller kein Platz mehr ist.", "c) Jederzeit, wenn im Keller kein Platz mehr ist.")
            ],
            ans: 1,
            explanationDe: "Richtig. 'Sperrmüll darf erst am Vorabend des Abholtermins an der Straße bereitgestellt werden.'",
            explanationEn: "Correct. Only on the eve of the pickup date."
          },
          {
            id: `b1_l_t5_q30_s${sId}`,
            qDe: "30. Welche Regelung gilt für Haustiere?",
            qEn: "30. What rule applies to pets?",
            opts: [
              t("a) Sämtliche Haustiere sind ausnahmslos verboten.", "a) Sämtliche Haustiere sind ausnahmslos verboten."),
              t("b) Für Hunde und Katzen benötigt man eine schriftliche Erlaubnis der Hausverwaltung.", "b) Für Hunde und Katzen benötigt man eine schriftliche Erlaubnis der Hausverwaltung."),
              t("c) Hunde dürfen im Hausflur ohne Leine frei herumlaufen.", "c) Hunde dürfen im Hausflur ohne Leine frei herumlaufen.")
            ],
            ans: 1,
            explanationDe: "Richtig. Für Hunde und Katzen ist die vorherige schriftliche Zustimmung erforderlich.",
            explanationEn: "Correct. Written permission is required for dogs and cats."
          }
        ]
      }
    ];

    // 2. HÖREN (4 Teile)
    const hoeren = [
      // Teil 1: 5 kurze Alltagsdialoge / Durchsagen (je 1 Richtig/Falsch + 1 Multiple-Choice, 10 Punkte)
      {
        id: 1,
        teil: 1,
        title: t(`Teil 1: Short Announcements (10 Points) - Set ${sId}`, `Teil 1: Fünf kurze Ansagen (10 Punkte) - Satz ${sId}`),
        instruction: t(
          "Listen to five short dialogues or announcements. For each text, solve one True/False task and one Multiple-Choice question. The audio is played twice. Total: 10 marks.",
          "Du hörst fünf kurze Texte aus dem Alltag (je 1x Richtig/Falsch und 1x Multiple Choice). Jeder Text wird zweimal vorgelesen. Insgesamt 10 Punkte."
        ),
        audio_transcript: `Text 1 (Hauptbahnhof Ansage): Achtung an Gleis 7. Der Intercity-Express nach München über Nürnberg, planmäßige Abfahrt um 14:15 Uhr, fährt heute mit einer Verspätung von circa 25 Minuten ein. Grund dafür ist eine technische Störung an der Weiche. Reisende nach Nürnberg nutzen bitte alternativ den Regional-Express auf Gleis 4 um 14:20 Uhr.\n\nText 2 (Kaufhaus Durchsage): Sehr geehrte Kundinnen und Kunden, besuchen Sie heute unsere Frühlingsaktion in der Haushaltsabteilung im zweiten Obergeschoss. Nur heute erhalten Sie 20 Prozent Rabatt auf alle Kaffeemaschinen und Küchengeräte. Unsere Café-Lounge im dritten Stock lädt Sie außerdem zu frischem Apfelkuchen ein.\n\nText 3 (Anrufbeantworter Arztpraxis): Herzlich willkommen in der Praxis Dr. Bergmann. Unsere Praxis ist wegen Urlaubs bis zum 15. August geschlossen. In dringenden medizinischen Notfällen wenden Sie sich bitte an die Vertretungspraxis Dr. Schneider in der Poststraße 4 oder an den ärztlichen Bereitschaftsdienst unter 116 117.\n\nText 4 (Wetterbericht im Radio): Und nun zum Wetter für Süddeutschland: Am Vormittag zeigt sich der Himmel vielerorts noch freundlich und sonnig bei Höchstwerten um 22 Grad. Ab dem späten Nachmittag ziehen von Westen her dichte Regenwolken auf, begleitet von kräftigen Gewittern und stürmischen Böen. Denken Sie also an den Regenschirm!\n\nText 5 (Museumsführung Treffpunkt): Liebe Besucherinnen und Besucher, die Sonderführung 'Meisterwerke der Moderne' beginnt in zehn Minuten im Foyer beim Infotresen. Bitte geben Sie Rucksäcke und größere Taschen vorher an der kostenlosen Garderobe im Untergeschoss ab. Das Fotografieren mit Blitz ist in den Ausstellungsräumen nicht gestattet.`,
        questions: [
          // Text 1
          { id: `b1_h_t1_q1_s${sId}`, type: 'tf', statement: "Text 1: 1. Der ICE nach München fährt pünktlich um 14:15 Uhr ab.", answer: false, explanationDe: "Falsch. Er hat circa 25 Minuten Verspätung.", explanationEn: "False. It has about 25 minutes delay." },
          { id: `b1_h_t1_q2_s${sId}`, type: 'mc', question: "Text 1: 2. Was sollen Reisende nach Nürnberg tun?", options: ["a) Den nächsten ICE morgen früh nehmen.", "b) Den Regional-Express auf Gleis 4 um 14:20 Uhr nutzen.", "c) Zu Fuß zum Busbahnhof gehen."], ans: 1, explanationDe: "Richtig. Als Alternative wird der RE um 14:20 Uhr empfohlen.", explanationEn: "Correct. Regional Express at 14:20 on platform 4 is advised." },
          // Text 2
          { id: `b1_h_t1_q3_s${sId}`, type: 'tf', statement: "Text 2: 3. Der Rabatt von 20% gilt für alle Kleidungsstücke im Kaufhaus.", answer: false, explanationDe: "Falsch. Er gilt nur für Kaffeemaschinen und Küchengeräte im 2. OG.", explanationEn: "False. Discount is on coffee machines & kitchenware." },
          { id: `b1_h_t1_q4_s${sId}`, type: 'mc', question: "Text 2: 4. Wo befindet sich die Café-Lounge?", options: ["a) Im Erdgeschoss am Ausgang.", "b) Im dritten Stockwerk.", "c) Im Parkhaus."], ans: 1, explanationDe: "Richtig. Die Café-Lounge ist im 3. Stock.", explanationEn: "Correct. Café lounge is on the 3rd floor." },
          // Text 3
          { id: `b1_h_t1_q5_s${sId}`, type: 'tf', statement: "Text 3: 5. Die Praxis Dr. Bergmann ist derzeit regulär geöffnet.", answer: false, explanationDe: "Falsch. Sie ist wegen Urlaubs geschlossen.", explanationEn: "False. The practice is closed for holidays." },
          { id: `b1_h_t1_q6_s${sId}`, type: 'mc', question: "Text 3: 6. An wen wendet man sich bei Notfällen?", options: ["a) An die Praxis Dr. Schneider in der Poststraße.", "b) An das örtliche Rathaus.", "c) An die Apotheke am Bahnhof."], ans: 0, explanationDe: "Richtig. Vertretung ist Dr. Schneider in der Poststraße 4.", explanationEn: "Correct. Stand-in doctor is Dr. Schneider." },
          // Text 4
          { id: `b1_h_t1_q7_s${sId}`, type: 'tf', statement: "Text 4: 7. Am Vormittag ist das Wetter in Süddeutschland sonnig.", answer: true, explanationDe: "Richtig. Vormittags ist es freundlich und sonnig.", explanationEn: "Correct. Sunny and pleasant in the morning." },
          { id: `b1_h_t1_q8_s${sId}`, type: 'mc', question: "Text 4: 8. Was passiert am späten Nachmittag?", options: ["a) Es schneit stark in den Bergen.", "b) Es ziehen dichte Regenwolken mit Gewittern auf.", "c) Es wird 35 Grad heiß."], ans: 1, explanationDe: "Richtig. Gewitter und Regenwolken ziehen auf.", explanationEn: "Correct. Rain clouds and thunderstorms move in." },
          // Text 5
          { id: `b1_h_t1_q9_s${sId}`, type: 'tf', statement: "Text 5: 9. Große Taschen dürfen mit in die Ausstellungsräume genommen werden.", answer: false, explanationDe: "Falsch. Sie müssen an der Garderobe abgegeben werden.", explanationEn: "False. Large bags must be left at coat check." },
          { id: `b1_h_t1_q10_s${sId}`, type: 'mc', question: "Text 5: 10. Was ist beim Fotografieren im Museum verboten?", options: ["a) Fotos mit Blitzlicht zu machen.", "b) Mit dem Handy zu fotografieren.", "c) Nach der Führung Fotos zu machen."], ans: 0, explanationDe: "Richtig. Blitzlicht ist in den Ausstellungsräumen verboten.", explanationEn: "Correct. Flash photography is forbidden." }
        ]
      },

      // Teil 2: Ein Monolog / Führung (5 Multiple-Choice, 5 Punkte)
      {
        id: 2,
        teil: 2,
        title: t(`Teil 2: Monologue Guided Tour (5 Points) - Set ${sId}`, `Teil 2: Monolog / Führung (5 Punkte) - Satz ${sId}`),
        instruction: t(
          "Listen to a monologue (a city or botanical garden guide welcoming visitors). Answer questions 11–15 with the best option (a, b, or c). The audio is played once. Total: 5 marks.",
          "Du hörst einen Monolog (Begrüßung und Führung durch den Stadtgarten). Beantworte die Aufgaben 11–15. Der Text wird einmal vorgelesen. Insgesamt 5 Punkte."
        ),
        audio_transcript: `Herzlich willkommen im Botanischen Garten München! Mein Name ist Susanne Meyer und ich begleite Sie heute auf unserem circa einstündigen Rundgang durch unsere historischen Gewächshäuser. Der Garten wurde bereits im Jahr 1812 gegründet und beherbergt heute über 19.000 verschiedene Pflanzenarten aus aller Welt. Unser Rundgang beginnt im Palmenhaus, das wegen seiner feucht-warmen Tropenluft berühmt ist. Bitte bleiben Sie während der gesamten Tour stets auf den befestigten Hauptwegen, da viele der seltenen Orchideenarten sehr empfindlich auf Berührungen reagieren. Nach der Führung haben Sie Gelegenheit, in unserem gemütlichen Garten-Café selbstgebackene Kuchen und Teespezialitäten zu genießen oder in unserem Shop botanische Fachbücher und Pflanzensamen als Andenken zu erwerben. Wenn Sie Fragen haben, können Sie mich jederzeit ansprechen. Gehen wir nun gemeinsam hinein!`,
        questions: [
          {
            id: `b1_h_t2_q11_s${sId}`,
            type: 'mc',
            question: "11. Wie lange dauert der Rundgang mit Susanne Meyer?",
            options: ["a) Eine halbe Stunde.", "b) Zirka eine Stunde.", "c) Den ganzen Nachmittag."],
            ans: 1,
            explanationDe: "Richtig. Sie spricht von einem 'circa einstündigen Rundgang'.",
            explanationEn: "Correct. She mentions an approximately one-hour tour."
          },
          {
            id: `b1_h_t2_q12_s${sId}`,
            type: 'mc',
            question: "12. Wie viele Pflanzenarten gibt es im Botanischen Garten?",
            options: ["a) Rund 1.800 Arten.", "b) Über 19.000 verschiedene Arten.", "c) Genau 500 Arten."],
            ans: 1,
            explanationDe: "Richtig. 'über 19.000 verschiedene Pflanzenarten aus aller Welt'.",
            explanationEn: "Correct. Over 19,000 different plant species."
          },
          {
            id: `b1_h_t2_q13_s${sId}`,
            type: 'mc',
            question: "13. Warum müssen Besucher auf den befestigten Wegen bleiben?",
            options: ["a) Weil sich wilde Tiere im Gebüsch verstecken.", "b) Weil seltene Pflanzenarten sehr empfindlich sind.", "c) Weil der Boden frisch gestrichen ist."],
            ans: 1,
            explanationDe: "Richtig. Seltene Orchideen reagieren sehr empfindlich auf Berührungen.",
            explanationEn: "Correct. Rare orchids are sensitive to touch."
          },
          {
            id: `b1_h_t2_q14_s${sId}`,
            type: 'mc',
            question: "14. Wo beginnt die Führung?",
            options: ["a) Im historischen Palmenhaus.", "b) Im Parkhaus am Haupteingang.", "c) Direkt im Café."],
            ans: 0,
            explanationDe: "Richtig. Der Rundgang beginnt im Palmenhaus.",
            explanationEn: "Correct. Tour begins in the Palm House."
          },
          {
            id: `b1_h_t2_q15_s${sId}`,
            type: 'mc',
            question: "15. Was können Besucher nach der Führung im Shop kaufen?",
            options: ["a) Antiquarische Möbel.", "b) Fachbücher und Pflanzensamen.", "c) Elektronische Tablets."],
            ans: 1,
            explanationDe: "Richtig. 'botanische Fachbücher und Pflanzensamen als Andenken'.",
            explanationEn: "Correct. Specialist books and plant seeds."
          }
        ]
      },

      // Teil 3: Ein Gespräch zwischen 2 Personen (7 Richtig/Falsch, 7 Punkte)
      {
        id: 3,
        teil: 3,
        title: t(`Teil 3: Everyday Conversation (7 Points) - Set ${sId}`, `Teil 3: Gespräch zwischen zwei Personen (7 Punkte) - Satz ${sId}`),
        instruction: t(
          "Listen to a conversation between two colleagues, Anna and Markus. Decide if statements 16–22 are True (Richtig) or False (Falsch). The audio is played once. Total: 7 marks.",
          "Du hörst ein Gespräch zwischen zwei Kollegen (Anna und Markus) in der Kaffeeküche. Entscheide, ob die Aussagen 16–22 Richtig oder Falsch sind. Der Text wird einmal vorgelesen. Insgesamt 7 Punkte."
        ),
        audio_transcript: `Markus: Hallo Anna! Du siehst ja ganz nachdenklich aus. Ist bei dir alles in Ordnung?\nAnna: Hallo Markus. Ja, alles gut, danke. Ich überlege nur gerade wegen meines anstehenden Sommerurlaubs. Ich wollte ja eigentlich mit dem Flugzeug nach Portugal fliegen, aber die Flugtickets sind dieses Jahr extrem teuer geworden.\nMarkus: Das kenne ich. Wir wollten im Juli nach Südfrankreich, haben uns aber dann entschieden, mit dem Nachtzug nach Wien zu fahren. Das war erstaunlich entspannt und viel günstiger!\nAnna: Eine Zugreise? Daran habe ich noch gar nicht gedacht. Gibt es denn gute Verbindungen von hier aus?\nMarkus: Ja, absolut. Ab München fährt der Nachtzug direkt nach Rom oder Wien. Man schläft im Schlafwagen und kommt am nächsten Morgen mitten in der Stadt an. Und man spart sich eine Hotelübernachtung!\nAnna: Das klingt wirklich verlockend. Ich werde mir heute Abend gleich mal die Fahrpläne der ÖBB und der Deutschen Bahn ansehen. Wie war denn das Essen im Zug?\nMarkus: Das Frühstück war im Preis inbegriffen – frische Brötchen und Kaffee. Für das Abendessen haben wir uns vor der Abfahrt Salate und Sandwiches am Bahnhof gekauft.\nAnna: Super Tipp, danke Markus! Ich schaue mir das direkt heute an.`,
        questions: [
          { id: `b1_h_t3_q16_s${sId}`, type: 'tf', statement: "16. Anna hat ihren Sommerurlaub bereits fest gebucht.", answer: false, explanationDe: "Falsch. Sie überlegt noch und die Flüge waren ihr zu teuer.", explanationEn: "False. She hasn't booked yet due to high flight prices." },
          { id: `b1_h_t3_q17_s${sId}`, type: 'tf', statement: "17. Markus ist mit dem Nachtzug nach Wien gereist.", answer: true, explanationDe: "Richtig. Er fuhr mit dem Nachtzug nach Wien.", explanationEn: "Correct. He traveled to Vienna on the night train." },
          { id: `b1_h_t3_q18_s${sId}`, type: 'tf', statement: "18. Markus fand die Fahrt mit dem Nachtzug extrem anstrengend und laut.", answer: false, explanationDe: "Falsch. Er fand es 'erstaunlich entspannt und viel günstiger'.", explanationEn: "False. He found it surprisingly relaxed and cheaper." },
          { id: `b1_h_t3_q19_s${sId}`, type: 'tf', statement: "19. Mit dem Nachtzug spart man sich eine Hotelübernachtung.", answer: true, explanationDe: "Richtig. Da man im Zug schläft, spart man das Hotel.", explanationEn: "Correct. Sleeping on the train saves a night's hotel cost." },
          { id: `b1_h_t3_q20_s${sId}`, type: 'tf', statement: "20. Anna lehnt Reisen mit dem Zug grundsätzlich ab.", answer: false, explanationDe: "Falsch. Sie findet die Idee 'wirklich verlockend'.", explanationEn: "False. She finds the idea very tempting." },
          { id: `b1_h_t3_q21_s${sId}`, type: 'tf', statement: "21. Das Frühstück im Nachtzug musste Markus extra teuer bezahlen.", answer: false, explanationDe: "Falsch. Das Frühstück war im Fahrpreis inbegriffen.", explanationEn: "False. Breakfast was included in the ticket price." },
          { id: `b1_h_t3_q22_s${sId}`, type: 'tf', statement: "22. Anna möchte sich heute Abend die Zugverbindungen im Internet ansehen.", answer: true, explanationDe: "Richtig. Sie will sich die Fahrpläne heute Abend ansehen.", explanationEn: "Correct. She plans to check train timetables tonight." }
        ]
      },

      // Teil 4: Radiodiskussion mit Moderator und 2 Gästen (8 Fragen, 8 Punkte)
      {
        id: 4,
        teil: 4,
        type: 'mc',
        title: t(`Teil 4: Radio Discussion (8 Points) - Set ${sId}`, `Teil 4: Radiodiskussion (8 Punkte) - Satz ${sId}`),
        instruction: t(
          "Listen to a radio talk show with a moderator and two guests (Dr. Weimann and Frau Lindner) on the topic 'Work-Life-Balance & 4-Day Workweek'. Answer questions 23–30. The audio is played twice. Total: 8 marks.",
          "Du hörst eine Radiodiskussion mit einem Moderator und zwei Gästen (Dr. Weimann und Frau Lindner) zum Thema 'Vier-Tage-Woche'. Beantworte die Aufgaben 23–30 (Wer sagt was?). Die Sendung wird zweimal vorgelesen. Insgesamt 8 Punkte."
        ),
        audio_transcript: `Moderator: Herzlich willkommen zu unserer wöchentlichen Debatte im Kulturradio. Heute diskutieren wir über das Modell der Vier-Tage-Woche bei vollem Lohnausgleich. Dazu begrüße ich im Studio den Arbeitspsychologen Dr. Bernd Weimann und die Geschäftsführerin eines mittelständischen Softwareunternehmens, Frau Sabine Lindner. Herr Dr. Weimann, warum fordern immer mehr Beschäftigte die Vier-Tage-Woche?\nDr. Weimann: Die Belastung im Arbeitsalltag hat durch ständige Erreichbarkeit und Digitalisierung stark zugenommen. Drei freie Tage pro Woche ermöglichen echte Erholung, senken nachweislich stressbedingte Krankheiten und steigern die Konzentration an den verbleibenden vier Arbeitstagen enorm.\nModerator: Frau Lindner, Sie haben das Modell in Ihrem Betrieb vor sechs Monaten eingeführt. Wie fällt Ihr Fazit aus?\nFrau Lindner: Wir waren anfangs skeptisch, ob unsere Kundenprojekte rechtzeitig fertig werden. Aber das Ergebnis hat uns positiv überrascht: Unsere Mitarbeiter sind deutlich motivierter, der Krankenstand sank um über 30 Prozent und wir bekommen plötzlich Bewerbungen von absoluten Top-Fachkräften.\nModerator: Herr Dr. Weimann, eignet sich das Modell für alle Berufsbranchen?\nDr. Weimann: Nein, man muss ehrlich sein. In Branchen mit Schichtbetrieb wie in der Pflege, bei der Polizei oder im öffentlichen Nahverkehr fehlt schlicht das Personal, um einen ganzen Arbeitstag ohne zusätzliche Einstellungen auszugleichen. Dort müsste der Staat erst massive Förderungen bereitstellen.\nFrau Lindner: Da stimme ich Herrn Dr. Weimann zu. In Dienstleistungs- und Wissensberufen funktioniert es hervorragend, aber im Handwerk und im Gesundheitswesen müssen wir vorsichtiger planen.\nModerator: Ein sehr differenzierter Blick auf ein hochaktuelles Thema. Wir danken unseren Gästen für das Gespräch!`,
        questions: [
          {
            id: `b1_h_t4_q23_s${sId}`,
            type: 'mc',
            question: "23. Worüber sprechen die Gäste in der Radiosendung?",
            options: ["a) Über höhere Rentenbeiträge.", "b) Über die Vier-Tage-Woche bei vollem Lohnausgleich.", "c) Über die Schließung von Universitäten."],
            ans: 1,
            explanationDe: "Richtig. Thema ist die Vier-Tage-Woche bei vollem Gehalt.",
            explanationEn: "Correct. Topic is the 4-day workweek with full pay."
          },
          {
            id: `b1_h_t4_q24_s${sId}`,
            type: 'mc',
            question: "24. Wer betont, dass ständige Erreichbarkeit zu Stress führt?",
            options: ["a) Der Moderator.", "b) Dr. Weimann (Arbeitspsychologe).", "c) Frau Lindner (Unternehmerin)."],
            ans: 1,
            explanationDe: "Richtig. Dr. Weimann erwähnt die Belastung durch ständige Erreichbarkeit.",
            explanationEn: "Correct. Dr. Weimann notes constant availability causes stress."
          },
          {
            id: `b1_h_t4_q25_s${sId}`,
            type: 'mc',
            question: "25. Wie lange testet Frau Lindner das Modell bereits in ihrer Firma?",
            options: ["a) Seit sechs Monaten.", "b) Seit fünf Jahren.", "c) Erst seit gestern."],
            ans: 0,
            explanationDe: "Richtig. 'vor sechs Monaten eingeführt'.",
            explanationEn: "Correct. Introduced six months ago."
          },
          {
            id: `b1_h_t4_q26_s${sId}`,
            type: 'mc',
            question: "26. Wie hat sich der Krankenstand in Frau Lindners Firma verändert?",
            options: ["a) Er ist um 30% gestiegen.", "b) Er ist um über 30% gesunken.", "c) Er ist unverändert geblieben."],
            ans: 1,
            explanationDe: "Richtig. Der Krankenstand sank um über 30 Prozent.",
            explanationEn: "Correct. Sick leave dropped by over 30%."
          },
          {
            id: `b1_h_t4_q27_s${sId}`,
            type: 'mc',
            question: "27. Welchen weiteren Vorteil bemerkt Frau Lindner bei der Personalsuche?",
            options: ["a) Sie muss niemanden mehr bezahlen.", "b) Sie erhält Bewerbungen von Top-Fachkräften.", "c) Niemand bewirbt sich mehr."],
            ans: 1,
            explanationDe: "Richtig. 'wir bekommen plötzlich Bewerbungen von absoluten Top-Fachkräften'.",
            explanationEn: "Correct. Receives applications from top specialists."
          },
          {
            id: `b1_h_t4_q28_s${sId}`,
            type: 'mc',
            question: "28. Warum ist die 4-Tage-Woche laut Dr. Weimann in der Pflege schwierig?",
            options: ["a) Weil Pflegekräfte nicht gerne frei haben.", "b) Weil dort das Personal für zusätzliche freie Tage fehlt.", "c) Weil Krankenhäuser am Wochenende schließen."],
            ans: 1,
            explanationDe: "Richtig. Es fehlt schlicht das Personal für Ausfalltage.",
            explanationEn: "Correct. Lack of staffing in shift sectors."
          },
          {
            id: `b1_h_t4_q29_s${sId}`,
            type: 'mc',
            question: "29. Wer fordert in schwierigen Branchen staatliche Förderungen?",
            options: ["a) Dr. Weimann.", "b) Die Hörer am Telefon.", "c) Nur der Moderator."],
            ans: 0,
            explanationDe: "Richtig. Dr. Weimann meint, der Staat müsste dort Förderungen bereitstellen.",
            explanationEn: "Correct. Dr. Weimann calls for state funding."
          },
          {
            id: `b1_h_t4_q30_s${sId}`,
            type: 'mc',
            question: "30. In welchen Berufen funktioniert das Modell laut beiden Gästen besonders gut?",
            options: ["a) Ausschließlich in der Landwirtschaft.", "b) In Wissens- und Dienstleistungsberufen.", "c) Bei der Feuerwehr."],
            ans: 1,
            explanationDe: "Richtig. 'In Dienstleistungs- und Wissensberufen funktioniert es hervorragend'.",
            explanationEn: "Correct. Excellent in knowledge and service careers."
          }
        ]
      }
    ];

    // 3. SCHREIBEN (3 Teile, 100 Punkte)
    const schreiben = [
      // Teil 1: Informelle E-Mail (40 Punkte, ca. 80 Wörter, 3 Leitpunkte)
      {
        id: 1,
        teil: 1,
        targetWords: 80,
        marks: "40 Punkte",
        timeTarget: "ca. 20 Minuten",
        title: t(`Teil 1: Informal Email to a Friend - Set ${sId}`, `Teil 1: Informelle E-Mail an eine/n Freund/in (40 Punkte) - Satz ${sId}`),
        instruction: t(
          "Write an informal email to your friend who missed an important event / celebration (ca. 80 words). Address all three points with coherent paragraphs, greetings, and closing. 40 Marks.",
          "Schreibe eine E-Mail an deinen Freund / deine Freundin (ca. 80 Wörter), der/die bei einem wichtigen Event/Fest nicht dabei sein konnte. Bearbeite alle 3 Leitpunkte sorgfältig!"
        ),
        description: t(
          `Situation: Last weekend you organized an event related to ${theme.nameEn}. Your friend could not attend due to sudden illness.\nWrite an email (~80 words) addressing:\n1. Describe how the event went and what you did.\n2. Explain why it was a great pity they were missing.\n3. Make a concrete suggestion to meet up soon.`,
          `Situation: Am letzten Wochenende fand eine Feier / Veranstaltung zum Thema ${theme.nameDe} statt. Dein Freund / deine Freundin konnte wegen einer Erkältung nicht kommen.\nSchreibe eine E-Mail (ca. 80 Wörter) und gehe auf folgende Punkte ein:\n1. Beschreibe: Wie war die Feier und was habt ihr gemacht?\n2. Begründe: Warum war es besonders schade, dass er/sie gefehlt hat?\n3. Mache einen konkreten Vorschlag für ein baldigeres Treffen.`
        ),
        ideal_hints: [
          "Liebe/r [Name], wie geht es dir? Ich hoffe, du bist wieder gesund...",
          "Unsere Feier am Samstag war wirklich ein voller Erfolg! Wir haben...",
          "Es war wirklich so schade, dass du nicht da warst, denn...",
          "Wie wäre es, wenn wir uns am nächsten Samstag treffen? Ich könnte...",
          "Schreib mir bald! Liebe Grüße, [Dein Name]"
        ],
        useful_phrases: [
          "Wie geht es dir? Ich hoffe, du fühlst dich schon besser.",
          "Es war wirklich schade, dass du nicht kommen konntest.",
          "Besonders gefallen hat mir, dass...",
          "Wir haben so viel gelacht und über alte Zeiten gesprochen.",
          "Hast du nächste Woche Zeit? Lass uns doch gemeinsam..."
        ],
        modelText: `Liebe Sarah,

ich hoffe, dir geht es schon viel besser und du hast dich von deiner Erkältung erholt!

Unsere Feier am letzten Samstag war wirklich ein voller Erfolg. Wir haben im Garten gegrillt, Musik gehört und bis spät in die Nacht über alte Zeiten gelacht. Besonders schön war, dass so viele Freunde aus dem Sprachkurs gekommen sind.

Es war wirklich unglaublich schade, dass du nicht dabei sein konntest! Wir haben alle sehr oft an dich gedacht, denn ohne deine fröhliche Art hat einfach etwas gefehlt.

Wie sieht es bei dir am kommenden Wochenende aus? Lass uns doch am Samstagnachmittag gemeinsam in ein gemütliches Café in der Altstadt gehen. Ich erzähle dir alles ganz genau und zeige dir die Fotos!

Schreib mir bald!
Herzliche Grüße
Dein Markus`,
        placeholder: "Liebe/r ..., \n\nich hoffe, es geht dir schon wieder besser! Unsere Feier am Samstag war..."
      },

      // Teil 2: Diskussionsbeitrag / Forumsbeitrag im Internet (40 Punkte, ca. 80 Wörter)
      {
        id: 2,
        teil: 2,
        targetWords: 80,
        marks: "40 Punkte",
        timeTarget: "ca. 25 Minuten",
        title: t(`Teil 2: Online Forum Comment - Set ${sId}`, `Teil 2: Forumsbeitrag / Meinung äußern (40 Punkte) - Satz ${sId}`),
        instruction: t(
          "Write an opinion comment for an online discussion board (ca. 80 words) on a contemporary topic. Structure your arguments clearly with examples. 40 Marks.",
          "Schreibe einen Forumsbeitrag (ca. 80 Wörter) zu einem aktuellen Thema. Begründe deine Meinung mit Beispielen und vergleiche mit deiner Heimat. 40 Punkte."
        ),
        description: t(
          `Topic: Should people prioritize buying locally produced and sustainable goods in the context of ${theme.nameEn}?\nWrite a structured forum comment (~80 words) covering:\n1. State your personal opinion on this debate.\n2. Give reasons and mention your own personal experiences.\n3. Describe how this is handled in your home country.`,
          `Thema: Sollen Verbraucher mehr regionale und nachhaltige Produkte im Bereich ${theme.nameDe} bevorzugen?\nSchreibe einen Beitrag für das Diskussionsforum (ca. 80 Wörter):\n1. Äußere deine persönliche Meinung zum Thema.\n2. Nenne Gründe und berichte von deinen eigenen Erfahrungen.\n3. Beschreibe kurz die Situation in deinem Heimatland.`
        ),
        ideal_hints: [
          "In der heutigen Diskussion möchte ich mich zu diesem wichtigen Thema äußern...",
          "Meiner Meinung nach ist es von großer Bedeutung, dass...",
          "Ich persönlich achte beim Einkaufen immer darauf, dass...",
          "In meinem Heimatland kaufen die meisten Menschen auf dem Wochenmarkt, weil...",
          "Zusammenfassend lässt sich sagen, dass nachhaltiger Konsum die Zukunft ist."
        ],
        useful_phrases: [
          "Ich bin der festen Ansicht, dass...",
          "Aus eigener Erfahrung kann ich sagen, dass...",
          "Ein großer Vorteil dabei ist, dass...",
          "In meinem Heimatland ist das ganz anders / ähnlich, denn...",
          "Zusammenfassend möchte ich betonen, dass..."
        ],
        modelText: `In diesem Diskussionsforum möchte ich gerne meine Meinung zu diesem aktuellen Thema äußern.

Ich bin der festen Überzeugung, dass wir alle viel mehr auf regionale und nachhaltige Produkte achten sollten. Ein wesentlicher Vorteil ist, dass kurze Transportwege das Klima schützen und wir lokale Landwirte und kleine Händler direkt unterstützen. Aus eigener Erfahrung kaufe ich fast jedes Wochenende frisches Obst und Gemüse auf dem Bauernmarkt. Die Qualität und Frische sind deutlich besser als im Großsupermarkt.

In meinem Heimatland kaufen die meisten Menschen traditionell auf lokalen Märkten ein, weil frische Lebensmittel sehr geschätzt werden und die Preise dort oft günstiger sind als in modernen Einkaufszentren.

Zusammenfassend lässt sich sagen, dass nachhaltiger und bewusster Konsum unsere Lebensqualität langfristig verbessert.`,
        placeholder: "In diesem Diskussionsforum möchte ich meine Meinung zum Thema äußern..."
      },

      // Teil 3: Formelle Mitteilung / E-Mail (20 Punkte, ca. 40 Wörter)
      {
        id: 3,
        teil: 3,
        targetWords: 40,
        marks: "20 Punkte",
        timeTarget: "ca. 15 Minuten",
        title: t(`Teil 3: Formal Email to Instructor / Boss - Set ${sId}`, `Teil 3: Formelle E-Mail (20 Punkte) - Satz ${sId}`),
        instruction: t(
          "Write a formal email (ca. 40 words) to your course instructor or supervisor apologizing for missing a class/meeting and politely asking for materials. Use proper formal address ('Sie / Ihnen'). 20 Marks.",
          "Schreibe eine formelle E-Mail (ca. 40 Wörter) an deine/n Kursleiter/in oder Vorgesetzte/n. Entschuldige dich höflich für dein Fehlen und bitte um Unterlagen. Achte auf die Höflichkeitsform (Sie/Ihnen). 20 Punkte."
        ),
        description: t(
          `Situation: You could not attend the important German module on ${theme.nameEn} yesterday because of a medical appointment.\nWrite a formal email (~40 words) to your course instructor Frau Dr. Weber:\n1. State the reason why you could not attend yesterday.\n2. Apologize politely for your absence.\n3. Ask if you can receive the presentation slides and homework exercises.`,
          `Situation: Du konntest gestern wegen eines dringenden Arzttermins nicht am Seminar zum Thema ${theme.nameDe} teilnehmen.\nSchreibe eine formelle E-Mail (ca. 40 Wörter) an deine Kursleiterin Frau Dr. Weber:\n1. Nenne den Grund für dein Fehlen gestern.\n2. Entschuldige dich höflich für die Abwesenheit.\n3. Bitte um Zusendung der Präsentationsfolien und Hausaufgaben.`
        ),
        ideal_hints: [
          "Sehr geehrte Frau Dr. Weber,",
          "ich möchte mich dafür entschuldigen, dass ich gestern nicht am Unterricht teilnehmen konnte.",
          "Wegen eines dringenden Arzttermins war es mir leider nicht möglich zu kommen.",
          "Könnten Sie mir bitte die Unterrichtsmaterialien und Hausaufgaben per E-Mail zusenden?",
          "Vielen Dank für Ihr Verständnis. Mit freundlichen Grüßen, [Vorname Nachname]"
        ],
        useful_phrases: [
          "Sehr geehrte Frau Dr. Weber, / Sehr geehrter Herr Professor...",
          "Ich schreibe Ihnen, weil ich gestern leider verhindert war.",
          "Ich bitte vielmals um Entschuldigung für mein Fehlen.",
          "Wären Sie so freundlich, mir die Unterlagen zukommen zu lassen?",
          "Mit freundlichen Grüßen"
        ],
        modelText: `Sehr geehrte Frau Dr. Weber,

ich möchte mich herzlich dafür entschuldigen, dass ich gestern leider nicht an Ihrem Unterricht teilnehmen konnte. Wegen eines dringenden Termins beim Facharzt war es mir unmöglich zu kommen.

Wären Sie so freundlich, mir die Präsentationsfolien sowie die Hausaufgaben per E-Mail zuzusenden? 

Vielen Dank für Ihre Hilfe und Ihr Verständnis.

Mit freundlichen Grüßen
Alex Müller`,
        placeholder: "Sehr geehrte Frau Dr. Weber, \n\nich möchte mich herzlich dafür entschuldigen, dass..."
      }
    ];

    // 4. SPRECHEN (3 Teile + Aussprache, 100 Punkte)
    const sprechen = [
      // Teil 1: Gemeinsam etwas planen (28 Punkte, ca. 3 Min.)
      {
        id: 1,
        teil: 1,
        marks: "28 Punkte",
        title: t(`Teil 1: Plan an Event Together - Set ${sId}`, `Teil 1: Gemeinsam etwas planen (28 Punkte) - Satz ${sId}`),
        instruction: t(
          "Plan an event or project together with your partner (~3 minutes). Discuss date, place, tasks, supplies, and invitations. Reach agreement collaboratively!",
          "Plane gemeinsam mit deinem Gesprächspartner ein Event / Projekt (ca. 3 Minuten). Tauscht Vorschläge aus, reagiert aufeinander und trefft gemeinsame Entscheidungen!"
        ),
        titleDe: `Gemeinsam ein Sommerfest / Projekttreffen zu ${theme.nameDe} organisieren.`,
        titleEn: `Organize a summer gathering / project workshop about ${theme.nameEn}.`,
        checklist: [
          "📅 Wann soll das Event stattfinden? (Wochentag, Uhrzeit)",
          "📍 Wo wollen wir uns treffen? (Stadtpark, Gemeinschaftsraum, Garten)",
          "🍕 Wer kümmert sich um Essen und Getränke? (Buffet, Grill, Mitbringsel)",
          "🎵 Musik und Unterhaltung (Playlist, Gesellschaftsspiele, Sport)",
          "✉️ Wie informieren wir die anderen Teilnehmer? (WhatsApp-Gruppe, Einladungs-Mail)"
        ],
        convo_tips: [
          { phrase: "Lass uns am kommenden Samstag um 15:00 Uhr anfangen, was meinst du?", meaning: "Let's start next Saturday at 3:00 PM, what do you think?" },
          { phrase: "Das ist ein hervorragender Vorschlag! Ich könnte den Grill mitbringen.", meaning: "That's an excellent suggestion! I could bring the barbecue grill." },
          { phrase: "Ich bin mir nicht sicher, ob das Wetter hält. Haben wir einen Plan B?", meaning: "I'm not sure if the weather holds up. Do we have a backup plan?" },
          { phrase: "Wenn es regnet, können wir in den Gemeinschaftsraum der WG ausweichen.", meaning: "If it rains, we can switch to the shared apartment community room." },
          { phrase: "Wer schreibt die Einladungen für die Gruppe?", meaning: "Who writes the group invitations?" }
        ],
        model_feedback: [
          { phrase: "Einverstanden! Dann erstelle ich heute die WhatsApp-Gruppe und du kaufst die Getränke.", translation: "Agreed! Then I'll set up the WhatsApp group today and you buy the drinks." },
          { phrase: "Perfekt, so machen wir das. Ich freue mich schon sehr auf das Treffen!", translation: "Perfect, let's do it like that. I'm really looking forward to the meetup!" }
        ]
      },

      // Teil 2: Ein Thema präsentieren (40 Punkte, 5 Folien, ca. 3 Min.)
      {
        id: 2,
        teil: 2,
        marks: "40 Punkte",
        title: t(`Teil 2: 5-Slide Presentation - Set ${sId}`, `Teil 2: Ein Thema präsentieren (40 Punkte) - Satz ${sId}`),
        instruction: t(
          "Choose Topic A or Topic B and present it using the 5 standard Goethe B1 slides (ca. 3 minutes). Listen to the model pronunciation script for each slide!",
          "Wähle Thema A oder Thema B und halte eine kurze Präsentation (ca. 3 Minuten) anhand der 5 Folien. Nutze die gesprochenen Beispielsätze zur Aussprache!"
        ),
        topics: [
          {
            ...B1_SPRECHEN_TOPICS[(idx * 2) % B1_SPRECHEN_TOPICS.length],
            topicLetter: 'A',
            title: `Thema A: ${B1_SPRECHEN_TOPICS[(idx * 2) % B1_SPRECHEN_TOPICS.length].title}`
          },
          {
            ...B1_SPRECHEN_TOPICS[(idx * 2 + 1) % B1_SPRECHEN_TOPICS.length],
            topicLetter: 'B',
            title: `Thema B: ${B1_SPRECHEN_TOPICS[(idx * 2 + 1) % B1_SPRECHEN_TOPICS.length].title}`
          }
        ],
        allTopics: B1_SPRECHEN_TOPICS
      },

      // Teil 3: Über das Thema sprechen / Fragen & Feedback (16 Punkte)
      {
        id: 3,
        teil: 3,
        marks: "16 Punkte",
        title: t(`Teil 3: Feedback & Q&A (16 Points) - Set ${sId}`, `Teil 3: Feedback & Rückfragen (16 Punkte) - Satz ${sId}`),
        instruction: t(
          "In Teil 3, give feedback to your partner's presentation, ask one relevant question, and answer questions directed at you (~2 minutes). 16 Marks.",
          "In Teil 3 gibst du deinem Partner Feedback zu seinem Vortrag, stellst eine inhaltliche Frage und beantwortest Rückfragen des Prüfers (ca. 2 Minuten). 16 Punkte."
        ),
        topics: [
          {
            ...B1_SPRECHEN_TOPICS[(idx * 2) % B1_SPRECHEN_TOPICS.length],
            topicLetter: 'A',
            title: `Thema A: ${B1_SPRECHEN_TOPICS[(idx * 2) % B1_SPRECHEN_TOPICS.length].title}`
          },
          {
            ...B1_SPRECHEN_TOPICS[(idx * 2 + 1) % B1_SPRECHEN_TOPICS.length],
            topicLetter: 'B',
            title: `Thema B: ${B1_SPRECHEN_TOPICS[(idx * 2 + 1) % B1_SPRECHEN_TOPICS.length].title}`
          }
        ],
        allTopics: B1_SPRECHEN_TOPICS,
        checklist: [
          "🗣️ Lob & Feedback äußern ('Ich fand deinen Vortrag sehr strukturiert und verständlich...')",
          "❓ Eine konkrete Frage zum Inhalt stellen ('Mich würde interessieren, wie viel Zeit du täglich...')",
          "💬 Auf Fragen des Partners und der Prüfer flüssig antworten",
          "✨ Höflichkeitsformeln anwenden ('Danke für die interessante Frage, dazu möchte ich sagen...')"
        ],
        convo_tips: [
          { phrase: "Vielen Dank für deinen interessanten Vortrag. Du hast sehr deutlich und flüssig gesprochen.", meaning: "Thank you for your interesting presentation. You spoke very clearly and fluently." },
          { phrase: "Besonders spannend fand ich deinen Vergleich mit deinem Heimatland.", meaning: "I found your comparison with your home country especially engaging." },
          { phrase: "Ich habe dazu noch eine Frage: Würdest du das Modell auch deinen Eltern empfehlen?", meaning: "I have a question about that: Would you recommend this model to your parents too?" },
          { phrase: "Das ist eine gute Frage! Ich denke, für ältere Menschen ist das am Anfang nicht ganz einfach, aber...", meaning: "That's a good question! I think for older people it's not so easy at first, but..." }
        ],
        questions: B1_SPRECHEN_TOPICS[(idx * 2) % B1_SPRECHEN_TOPICS.length].qa,
        model_feedback: [
          { phrase: "Prüferfrage: 'Was hat Sie bei Ihren Recherchen zu diesem Thema am meisten überrascht?'", translation: "Examiner Question: 'What surprised you most during your research on this topic?'" },
          { phrase: "Antwort: 'Mich hat überrascht, wie viele Menschen ähnliche Erfahrungen gemacht haben und wie schnell positive Veränderungen spürbar werden.'", translation: "Answer: 'I was surprised by how many people had similar experiences and how quickly positive changes become noticeable.'" }
        ]
      },

      // Teil 4: Aussprache & Redefluss (16 Punkte)
      {
        id: 4,
        teil: 4,
        marks: "16 Punkte",
        title: t(`Teil 4: Pronunciation & Fluency (16 Points) - Set ${sId}`, `Teil 4: Aussprache & Redefluss (16 Punkte) - Satz ${sId}`),
        instruction: t(
          "In Teil 4, examiners evaluate your pronunciation, word stress, sentence melody, and conversational fluency across the entire oral exam. Practice the 4 core phonetic standards to secure all 16 marks!",
          "In Teil 4 bewerten die Goethe-Prüfer deine Lautbildung, Wortbetonung, Satzmelodie und den natürlichen Redefluss. Trainiere die 4 phonetischen Kernkriterien, um alle 16 Punkte zu sichern!"
        ),
        phoneticDrills: [
          {
            category: "1. Wortakzent: Trennbare vs. Nichttrennbare Verben",
            categoryEn: "1. Word Stress: Separable vs. Inseparable Verbs",
            rule: "Trennbare Präfixe (ab-, auf-, mit-, vor-, ein-) tragen den Hauptakzent. Nichttrennbare (be-, ver-, zer-, ent-, ge-) sind unbetont!",
            examples: [
              { word: "AB-fahren", note: "Akzent auf 'AB'", audio: "Wir müssen pünktlich abfahren.", trans: "We must depart on time." },
              { word: "ver-STEH-en", note: "Akzent auf 'STEH'", audio: "Ich kann Sie sehr gut verstehen.", trans: "I can understand you very well." },
              { word: "VOR-bereiten", note: "Akzent auf 'VOR'", audio: "Ich möchte mich gut vorbereiten.", trans: "I want to prepare well." },
              { word: "be-ANT-worten", note: "Akzent auf 'ANT'", audio: "Darf ich diese Frage beantworten?", trans: "May I answer this question?" }
            ]
          },
          {
            category: "2. Satzmelodie: Aussage vs. Entscheidungsfrage",
            categoryEn: "2. Sentence Melody: Statements vs. Yes/No Questions",
            rule: "Aussagesätze und W-Fragen enden mit fallender Melodie ↘. Ja/Nein-Fragen enden mit ansteigender Melodie ↗!",
            examples: [
              { word: "Aussagesatz (↘)", note: "Stimme senken", audio: "Ich wohne seit zwei Jahren in Deutschland.", trans: "I have been living in Germany for two years." },
              { word: "W-Frage (↘)", note: "Stimme senken", audio: "Wann treffen wir uns am Samstag?", trans: "When do we meet on Saturday?" },
              { word: "Entscheidungsfrage (↗)", note: "Stimme heben", audio: "Hast du am Wochenende Zeit dafür?", trans: "Do you have time for that this weekend?" }
            ]
          },
          {
            category: "3. Umlaut-Präzision & Vokallänge",
            categoryEn: "3. Umlaut Precision & Vowel Length",
            rule: "Klare Unterscheidung zwischen kurzen und langen Vokalen sowie Umlauten verhindert Bedeutungsverwechslungen!",
            examples: [
              { word: "schon vs. schön", note: "kurz/rund vs. lang/gerundet", audio: "Ich kenne das schon, es ist wirklich sehr schön.", trans: "I already know that, it is really very beautiful." },
              { word: "zahlen vs. zählen", note: "a vs. ä", audio: "Wir zahlen zusammen, damit wir nicht zählen müssen.", trans: "We pay together so we don't have to count." },
              { word: "müssen vs. mussten", note: "ü vs. u", audio: "Wir müssen heute pünktlich anfangen.", trans: "We must start on time today." }
            ]
          },
          {
            category: "4. Glottisschlag (Knacklaut) bei Vokalanlaut",
            categoryEn: "4. Glottal Stop Before Vowel Onsets",
            rule: "Im Deutschen beginnt jeder Vokal am Wortanfang oder nach Präfixen mit einem feinen Kehlkopf-Verschlusslaut.",
            examples: [
              { word: "be-achten [bəˈʔaxtn̩]", note: "Knacklaut vor 'a'", audio: "Bitte beachten Sie die Prüfungsregeln.", trans: "Please note the exam regulations." },
              { word: "überall [ˈʔyːbɐʔal]", note: "Knacklaut vor 'ü' und 'a'", audio: "Im Sommer ist es überall grün.", trans: "In summer it is green everywhere." },
              { word: "am Anfang [ʔam ˈʔanfaŋ]", note: "Knacklaut vor 'am' und 'Anfang'", audio: "Am Anfang möchte ich mich vorstellen.", trans: "At the beginning I would like to introduce myself." }
            ]
          }
        ]
      }
    ];

    return {
      lesen,
      hoeren,
      schreiben,
      sprechen
    };
  });
}
