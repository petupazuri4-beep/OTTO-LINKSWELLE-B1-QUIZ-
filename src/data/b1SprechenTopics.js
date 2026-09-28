// Goethe-Zertifikat B1 Sprechen Teil 2: Authentic Exam Presentation Topics & Scripts
// Extracted and curated directly from authentic Goethe B1 Prüfung Sprechen Themen

import { B1_PDF_PRESENTATIONS, convertPdfToB1Topic } from './b1PdfPresentations.js';

export const GOETHE_B1_SPRECHEN_REDEMITTEL = [
  {
    id: "folie1",
    phase: "Folie 1: Einleitung & Struktur",
    phaseEn: "Slide 1: Intro & Structure",
    icon: "🎯",
    badge: "Folie 1",
    phrases: [
      { de: "Das Thema meiner Präsentation lautet: ...", en: "The topic of my presentation is: ..." },
      { de: "In meiner heutigen Präsentation geht es um die Frage: ...", en: "My presentation today deals with the question: ..." },
      { de: "Ich habe dieses Thema gewählt, weil es mich persönlich sehr interessiert.", en: "I chose this topic because I am personally very interested in it." },
      { de: "Mein Vortrag gliedert sich in folgende vier Teile:", en: "My talk is structured into the following four parts:" },
      { de: "Zuerst möchte ich von meinen persönlichen Erfahrungen erzählen.", en: "First, I would like to share my personal experiences." },
      { de: "Danach beschreibe ich die Situation in meinem Heimatland.", en: "Next, I will describe the situation in my home country." },
      { de: "Dann möchte ich über Vor- und Nachteile sprechen und Beispiele nennen.", en: "Then I would like to talk about pros and cons and give examples." },
      { de: "Zum Schluss werde ich meine persönliche Meinung äußern.", en: "Finally, I will express my personal opinion." }
    ]
  },
  {
    id: "folie2",
    phase: "Folie 2: Eigene Erfahrungen",
    phaseEn: "Slide 2: Personal Experience",
    icon: "👤",
    badge: "Folie 2",
    phrases: [
      { de: "Was meine persönlichen Erfahrungen angeht, so...", en: "As far as my personal experiences go, ..." },
      { de: "Ich habe schon oft die Erfahrung gemacht, dass...", en: "I have frequently experienced that..." },
      { de: "In meinem Alltag spielt dieses Thema eine wichtige Rolle, weil...", en: "In my daily life, this topic plays an important role because..." },
      { de: "Ich selbst nutze / mache das sehr oft / eher selten.", en: "I personally use / do this very often / rather rarely." },
      { de: "Als ich ein Kind / jünger war, habe ich...", en: "When I was a child / younger, I..." },
      { de: "Aus eigener Erfahrung kann ich bestätigen, dass...", en: "From my own experience, I can confirm that..." }
    ]
  },
  {
    id: "folie3",
    phase: "Folie 3: Situation im Heimatland",
    phaseEn: "Slide 3: Situation in Home Country",
    icon: "🌍",
    badge: "Folie 3",
    phrases: [
      { de: "Jetzt möchte ich über die Situation in meinem Heimatland sprechen.", en: "Now I would like to talk about the situation in my home country." },
      { de: "In meiner Heimat ist die Situation etwas anders als in Deutschland.", en: "In my homeland, the situation is somewhat different from Germany." },
      { de: "Bei uns ist es üblich, dass die meisten Menschen...", en: "Where I come from, it is customary that most people..." },
      { de: "Besonders die jüngere Generation bevorzugt...", en: "Especially the younger generation prefers..." },
      { de: "Im Vergleich zu Deutschland gibt es bei uns...", en: "Compared to Germany, in our country there are..." },
      { de: "Viele Menschen in meinem Heimatland haben keine Möglichkeit...", en: "Many people in my home country don't have the opportunity..." }
    ]
  },
  {
    id: "folie4",
    phase: "Folie 4: Vor- und Nachteile mit Beispielen",
    phaseEn: "Slide 4: Pros & Cons with Examples",
    icon: "⚖️",
    badge: "Folie 4",
    phrases: [
      { de: "Nun komme ich zu den Vor- und Nachteilen.", en: "Now I come to the advantages and disadvantages." },
      { de: "Ein großer Vorteil ist sicherlich, dass...", en: "A major advantage is certainly that..." },
      { de: "Positiv ist auch zu erwähnen, dass man dadurch...", en: "Another positive aspect is that it allows one to..." },
      { de: "Einerseits spart man Zeit, andererseits...", en: "On one hand you save time, on the other hand..." },
      { de: "Auf der anderen Seite gibt es natürlich auch Nachteile.", en: "On the other hand, there are of course disadvantages as well." },
      { de: "Ein bedeutender Nachteil ist die Tatsache, dass...", en: "A significant drawback is the fact that..." },
      { de: "Als konkretes Beispiel möchte ich anführen, dass...", en: "As a concrete example, I would like to mention that..." }
    ]
  },
  {
    id: "folie5",
    phase: "Folie 5: Eigene Meinung & Abschluss",
    phaseEn: "Slide 5: Personal Opinion & Conclusion",
    icon: "💡",
    badge: "Folie 5",
    phrases: [
      { de: "Meiner Meinung nach sollte man...", en: "In my opinion, one should..." },
      { de: "Ich bin persönlich fest davon überzeugt, dass...", en: "I am personally firmly convinced that..." },
      { de: "Zusammenfassend lässt sich sagen, dass ein Mittelweg der beste ist.", en: "In conclusion, it can be said that a middle ground is best." },
      { de: "Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!", en: "That concludes my presentation. Thank you very much for your attention!" },
      { de: "Haben Sie noch Fragen? Ich beantworte sie gerne.", en: "Do you have any questions? I would be glad to answer them." }
    ]
  },
  {
    id: "teil3",
    phase: "Teil 3: Feedback, Rückfragen & Antworten",
    phaseEn: "Part 3: Feedback, Questions & Answers",
    icon: "🤝",
    badge: "Teil 3",
    phrases: [
      { de: "Vielen Dank für deinen interessanten Vortrag. Du hast sehr deutlich gesprochen.", en: "Thank you for your interesting presentation. You spoke very clearly." },
      { de: "Besonders spannend fand ich den Vergleich mit deiner Heimat.", en: "I found the comparison with your home country especially interesting." },
      { de: "Ich fand dein Beispiel zum Thema sehr anschaulich und gut gewählt.", en: "I found your example on the topic very vivid and well chosen." },
      { de: "Ich hätte dazu noch eine Frage an dich: ...", en: "I have one more question for you about that: ..." },
      { de: "Mich würde noch interessieren: Würdest du das persönlich auch so machen?", en: "I'd also be interested to know: Would you personally do that too?" },
      { de: "Danke für diese Frage. Dazu möchte ich sagen, dass...", en: "Thank you for this question. Regarding that, I'd like to say that..." },
      { de: "Das ist ein interessanter Punkt. Meiner Erfahrung nach...", en: "That's an interesting point. In my experience..." },
      { de: "Könnten Sie die Frage bitte noch einmal wiederholen?", en: "Could you please repeat the question once more?" }
    ]
  }
];

export { B1_PDF_PRESENTATIONS };
export const B1_SPRECHEN_TOPICS = B1_PDF_PRESENTATIONS.map(convertPdfToB1Topic);

const LEGACY_B1_SPRECHEN_TOPICS = [
  {
    id: "stadt_oder_land",
    number: 1,
    title: "1. Das Leben auf dem Land oder in der Stadt",
    question: "Was denken Sie ist besser: das Leben auf dem Land oder in der Stadt?",
    category: "Wohnen & Lebensstil",
    badge: "Klassiker #1",
    fullText: `Das Thema meiner Präsentation ist das Leben auf dem Land oder in der Stadt. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen und Beispiele nennen. Zum Schluss sage ich meine Meinung.

Viele Menschen müssen im Leben eine wichtige Entscheidung treffen, wo sie in Zukunft leben werden. Oft kann man das Leben auf dem Land oder in der Stadt wählen. Jetzt geht es um meine persönlichen Erfahrungen: Ich wohne am liebsten in der Stadt. Wichtig sind für mich gute und nahe Einkaufsmöglichkeiten, kurze Wege zur Arbeit, ein attraktives Freizeitangebot, Kultur und Leben auf den Straßen. Ich wohne zurzeit mit meinen Eltern mitten im Stadtzentrum.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meiner Heimat wohnen die meisten Menschen am liebsten in den großen Städten wegen der besseren Arbeitsplätze, der Universitäten und der modernen Infrastruktur. Auf dem Land gibt es oft weniger Schulen und Krankenhäuser.

Nun erwähne ich einige Vor- und Nachteile: Ein großer Vorteil der Stadt ist, dass alles schnell zu Fuß oder mit öffentlichen Verkehrsmitteln zu erreichen ist. Die Wege zur Arbeit sind kürzer und Jugendliche haben viele Freizeitangebote wie Kinos, Theater und Parks. Auf dem Land ist jedoch die Luft viel sauberer als in der Stadt. Es gibt weniger Lärm und Hektik, sodass Kinder ruhiger und sicherer aufwachsen können. Ein Nachteil der Stadt sind die hohen Mieten, der dichte Autoverkehr und die Luftverschmutzung. Auf dem Land gibt es dagegen weniger Kultur und man braucht fast immer ein Auto.

Meiner Meinung nach bin ich fest überzeugt, dass ich ein Stadtmensch bin. Für meine jetzige Lebensphase ist die Stadt ideal. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit! Haben Sie noch Fragen?`,
    wordCount: 305,
    estTime: "ca. 2:50 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Thema nennen und die 4 Teile der Präsentation klar ankündigen.",
        notes: [
          "Thema: Leben auf dem Land oder in der Stadt",
          "Teil 1: Eigene persönliche Erfahrungen",
          "Teil 2: Situation im Heimatland",
          "Teil 3: Vor- und Nachteile mit Beispielen",
          "Teil 4: Eigene Meinung & Abschluss"
        ],
        textDe: "Guten Tag allerseits. Das Thema meiner Präsentation ist das Leben auf dem Land oder in der Stadt. Meine Präsentation besteht aus vier Teilen: Zuerst berichte ich von meinen persönlichen Erfahrungen. Danach beschreibe ich die Situation in meinem Heimatland. Dann nenne ich Vor- und Nachteile und zum Schluss sage ich meine persönliche Meinung.",
        speak: "Guten Tag allerseits. Das Thema meiner Präsentation ist: Leben auf dem Land oder in der Stadt. Mein Vortrag besteht aus vier Teilen: Zuerst erzähle ich von meinen eigenen Erfahrungen, danach über mein Heimatland, dann über Vor- und Nachteile und schließlich meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Meine Präsentation besteht aus folgenden Teilen:", "Zuerst möchte ich..."]
      },
      {
        slide: 2,
        title: "Folie 2: Persönliche Erfahrungen",
        objective: "Von eigenen Wohnerfahrungen in Stadt oder Dorf berichten.",
        notes: [
          "Wohne zurzeit in der Stadt mit Eltern",
          "Vorteile im Alltag: Kurze Wege, Supermarkt um die Ecke, Freizeitangebote",
          "Schätze das bunte Kulturangebot"
        ],
        textDe: "Jetzt geht es um meine persönlichen Erfahrungen: Ich wohne am liebsten in der Stadt. Für mich sind kurze Wege zur Arbeit, gute Einkaufsmöglichkeiten und ein lebendiges Kulturangebot sehr wichtig. Ich lebe mitten im Zentrum und genieße es, fast alles zu Fuß erreichen zu können.",
        speak: "Zu meinen persönlichen Erfahrungen: Ich lebe sehr gerne in der Stadt. Kurze Wege zum Einkaufen und zur Arbeit sind mir besonders wichtig.",
        usefulPhrases: ["Was meine persönlichen Erfahrungen angeht...", "Ich selbst lebe in...", "Für mich ist wichtig, dass..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Die Lage in der Heimat beschreiben (Stadt vs. Land).",
        notes: [
          "Große Städte sehr beliebt wegen Arbeitsplätzen & Unis",
          "Auf dem Land weniger Infrastruktur, Schulen & Ärzte",
          "Landflucht junger Menschen in die Ballungsräume"
        ],
        textDe: "In meinem Heimatland zieht es vor allem junge Leute und Familien in die Großstädte. Dort gibt es mehr Universitäten, bessere Gehälter und moderne Krankenhäuser. Auf dem Land ist das Leben zwar traditioneller, aber die Arbeitsmöglichkeiten sind begrenzter.",
        speak: "In meinem Heimatland bevorzugen die meisten Menschen das Leben in der Stadt, weil es dort mehr Arbeit und bessere Schulen gibt.",
        usefulPhrases: ["In meinem Heimatland ist es so, dass...", "Bei uns ziehen viele Menschen...", "Im Vergleich dazu..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile mit Beispielen",
        objective: "Beide Seiten objektiv beleuchten und konkrete Beispiele geben.",
        notes: [
          "Vorteile Stadt: Öffentlicher Nahverkehr, Kultur, Freizeit, Einkauf",
          "Nachteile Stadt: Hohe Mieten, Lärm, Abgase, Hektik",
          "Vorteile Land: Natur, Ruhe, saubere Luft, Platz für Kinder, günstige Mieten",
          "Nachteile Land: Auto unverzichtbar, weite Wege, weniger Angebote"
        ],
        textDe: "Nun zu den Vor- und Nachteilen: In der Stadt hat man alles in der Nähe: Kinos, Cafés und gute Arbeitsplätze. Aber die Mieten sind extrem teuer und es gibt viel Verkehrslärm. Auf dem Land hat man saubere Luft, viel Natur und Ruhe, was perfekt für Kinder ist. Der Nachteil dort ist, dass man ohne Auto kaum mobil ist.",
        speak: "Ein Vorteil der Stadt ist die gute Infrastruktur, Nachteil sind hohe Mieten und Lärm. Auf dem Land ist die Luft sauberer und es ist ruhiger, aber man braucht ein Auto.",
        usefulPhrases: ["Ein großer Vorteil der Stadt ist...", "Auf der anderen Seite sind die Nachteile...", "Auf dem Land dagegen..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Klare persönliche Positionierung und Einladung zu Fragen.",
        notes: [
          "Persönliches Fazit: Momentan klares Ja zur Stadt",
          "Im Alter oder mit Familie eventuell Umzug ins Grüne",
          "Dank für die Aufmerksamkeit, Fragen willkommen"
        ],
        textDe: "Zusammenfassend bin ich fest überzeugt, dass für mich zurzeit das Leben in der Stadt die beste Wahl ist, weil ich die Vielfalt und Mobilität brauche. Das war meine Präsentation. Vielen herzlichen Dank für Ihre Aufmerksamkeit. Ich freue mich auf Ihre Fragen!",
        speak: "Zusammenfassend bin ich ein überzeugter Stadtmensch. Vielen Dank für Ihre Aufmerksamkeit. Ich beantworte nun gerne Ihre Fragen.",
        usefulPhrases: ["Meiner Meinung nach...", "Ich bin fest überzeugt, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Könntest du dir vorstellen, später als Rentner auf dem Land zu leben?",
        questionEn: "Could you imagine living in the countryside later when you are retired?",
        modelAnswerDe: "Ja, durchaus! Wenn ich älter bin und nicht mehr jeden Tag pünktlich ins Büro muss, wäre ein ruhiges Haus mit Garten im Grünen eine wunderschöne Vorstellung.",
        modelAnswerEn: "Yes, definitely! When I'm older and don't need to commute to the office every day, a quiet house with a garden in the green would be wonderful."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Was könnte die Politik tun, um das Leben auf dem Land für junge Familien attraktiver zu machen?",
        questionEn: "What could policymakers do to make rural life more attractive for young families?",
        modelAnswerDe: "Meiner Ansicht nach müsste vor allem schnelles Internet auf dem Land ausgebaut werden, damit Homeoffice funktioniert, und es braucht verlässliche Busverbindungen sowie gute Kindergärten.",
        modelAnswerEn: "In my view, fast fiber internet needs to be expanded in rural areas so home-office works, plus reliable bus connections and quality kindergartens."
      }
    ]
  },
  {
    id: "ausbildung",
    number: 2,
    title: "2. Ausbildung (Duale Berufsausbildung vs. Studium)",
    question: "Was ist eine duale Ausbildung und welche Vor- und Nachteile bringt sie mit sich?",
    category: "Bildung & Beruf",
    badge: "Top-Thema Beruf",
    fullText: `Das Thema meiner Präsentation ist die Ausbildung. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Was bedeutet eigentlich eine duale Ausbildung? Nach der Schule kann man einen Beruf praxisnah erlernen. Man lernt die Theorie an einer Berufsschule und arbeitet gleichzeitig in einem Betrieb. Das dauert meistens zwischen zwei und drei Jahren. 

Jetzt geht es um meine persönlichen Erfahrungen: Ich selbst habe nach der Schule zunächst überlegt zu studieren, aber ein guter Freund von mir hat eine Lehre als KFZ-Mechatroniker gemacht. Er war begeistert, weil er von Anfang an sein eigenes Gehalt verdiente und direkt am Auto arbeiten konnte.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meiner Heimat gibt es das deutsche duale Ausbildungssystem so gut wie gar nicht. Die meisten jungen Leute streben sofort ein Universitätsstudium an. Berufe werden entweder direkt in kurzen Kursen von drei bis sechs Monaten gelernt oder man lernt sie praktisch vom Vater in der Familienwerkstatt.

Nun erwähne ich einige Vor- und Nachteile: Ein großer Vorteil einer Ausbildung ist, dass man sofort Praxiswissen erlangt und während der Lehrzeit bereits ein Monatsgehalt verdient. Man ist finanziell schneller unabhängig. Ein Nachteil ist jedoch, dass mit einer reinen Ausbildung manche Führungspositionen schwieriger zu erreichen sind und Akademiker auf lange Sicht oft höhere Gehälter erzielen.

Meiner Meinung nach ist die duale Ausbildung ein großartiges Modell. Nicht jeder hat Lust auf jahrelange trockene Universitätstheorie. Viele möchten früh anpacken und Verantwortung übernehmen. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 298,
    estTime: "ca. 2:45 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Ausbildungskonzept definieren und die Gliederung ankündigen.",
        notes: ["Thema: Duale Berufsausbildung", "Gliederung: Eigene Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Das Thema meiner Präsentation ist die berufliche Ausbildung. Ich möchte erklären, was eine duale Ausbildung ausmacht, und gliedere meinen Vortrag in vier Abschnitte: eigene Erfahrungen, die Situation im Heimatland, die Vor- und Nachteile sowie mein persönliches Fazit.",
        speak: "Guten Tag. Ich präsentiere das Thema Berufsausbildung. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Mein Vortrag ist wie folgt aufgebaut:", "Ich beginne mit..."]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Erfahrungen aus dem Bekanntenkreis oder eigene Lehre beschreiben.",
        notes: ["Freund hat Ausbildung zum Mechatroniker gemacht", "Guter Lerneffekt durch Kombination aus Theorie und Werkstatt"],
        textDe: "Was meine persönlichen Erfahrungen angeht: Ein enger Freund von mir hat eine Ausbildung zum Mechaniker absolviert. Er konnte theoretischen Unterricht mit praktischer Werkstattarbeit verbinden und war sehr stolz auf sein erstes selbstverdientes Geld.",
        speak: "Zu meinen Erfahrungen: Ein Freund hat eine Ausbildung gemacht und war sehr zufrieden, weil er Theorie und Praxis verbinden konnte.",
        usefulPhrases: ["In meinem Umfeld...", "Ein Freund von mir hat...", "Dabei hat er gelernt, dass..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Die Bedeutung von Lehre vs. Universität in der Heimat kontrastieren.",
        notes: ["Kein duales System", "Sehr hoher Druck, an die Universität zu gehen", "Handwerk oft im Familienbetrieb erlernt"],
        textDe: "In meinem Heimatland gibt es leider kaum duale Ausbildungen. Das Ansehen eines Universitätsabschlusses ist sehr hoch, weshalb fast alle studieren möchten. Handwerkliche Berufe werden meist informell in der Familie weitergegeben.",
        speak: "In meiner Heimat gibt es kein duales Ausbildungssystem. Die meisten machen ein Studium oder lernen privat im Betrieb.",
        usefulPhrases: ["In meinem Heimatland ist das anders, weil...", "Dort studieren die meisten, da...", "Praktische Berufe..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Frühes Gehalt & Praxis gegen Karrieregrenzen abwägen.",
        notes: [
          "Vorteile: Eigenes Geld ab Tag 1, Praxisbezug, hohe Übernahmechancen",
          "Nachteile: Spätere Aufstiegsmöglichkeiten ohne Weiterbildung oft limitiert"
        ],
        textDe: "Ein klarer Vorteil der Ausbildung ist die finanzielle Unabhängigkeit schon ab 18 Jahren und die hohe Praxisnähe. Als Nachteil muss man erwähnen, dass Akademiker in großen Konzernen langfristig oft höhere Gehälter und mehr Aufstiegschancen haben.",
        speak: "Vorteil: Man verdient sofort Geld und lernt die Praxis. Nachteil: Die Aufstiegschancen können im Vergleich zum Studium geringer sein.",
        usefulPhrases: ["Der größte Vorteil ist...", "Auf der anderen Seite...", "Ein wesentlicher Nachteil besteht darin, dass..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Stellung beziehen und sich bei den Prüfern bedanken.",
        notes: ["Ausbildung ist ideal für praktisch veranlagte Menschen", "Dank an Zuhörer"],
        textDe: "Meiner Meinung nach ist eine Berufsausbildung ein hervorragender Start ins Berufsleben. Wer will, kann später immer noch einen Meister oder Bachelor dranhängen. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach ist die duale Ausbildung eine tolle Chance. Vielen Dank für Ihre Aufmerksamkeit! Ich freue mich auf Ihre Fragen.",
        usefulPhrases: ["Meiner Ansicht nach...", "Ich kann nur betonen, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Glaubst du, dass man mit einer Ausbildung heute noch genug Geld für eine Familie verdienen kann?",
        questionEn: "Do you think one can still earn enough money for a family with a vocational training today?",
        modelAnswerDe: "Ja, absolut. Gute Fachkräfte und Handwerker werden in Deutschland so dringend gesucht, dass sie oft mehr verdienen als mancher Akademiker.",
        modelAnswerEn: "Yes, absolutely. Skilled craftsmen are so urgently sought after in Germany that they often earn more than many academics."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Welchen Ausbildungsberuf fänden Sie persönlich am interessantesten?",
        questionEn: "Which vocational apprenticeship would you personally find most interesting?",
        modelAnswerDe: "Mich würde eine Ausbildung im IT-Bereich oder im Hotelmanagement reizen, weil man dort viel mit moderner Technik und internationalen Menschen zu tun hat.",
        modelAnswerEn: "An apprenticeship in IT or hotel management would appeal to me because it involves modern technology and international people."
      }
    ]
  },
  {
    id: "auswanderung",
    number: 3,
    title: "3. Auswanderung (Auslandsaufenthalt ja oder nein?)",
    question: "Sollte man für längere Zeit oder für immer ins Ausland gehen?",
    category: "Gesellschaft & Familie",
    badge: "Sehr beliebt",
    fullText: `Das Thema meiner Präsentation ist Auswanderung. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine Meinung.

Jetzt geht es um meine persönlichen Erfahrungen: Ich selbst habe den Schritt gewagt und bin nach Deutschland gekommen, um eine neue Sprache zu lernen und mir hier eine berufliche Zukunft aufzubauen. Am Anfang war das Heimweh groß, aber mittlerweile habe ich viele neue Freunde gefunden.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meinem Heimatland möchten sehr viele gut ausgebildete junge Menschen auswandern, vor allem wegen wirtschaftlicher Probleme und fehlender Berufsperspektiven. Viele Absolventen gehen nach Europa oder Nordamerika, um dort zu arbeiten und ihre Familien daheim finanziell zu unterstützen.

Nun erwähne ich einige Vor- und Nachteile: Die Vorteile des Lebens im Ausland sind enorm: Man lernt eine neue Sprache fließend, erweitert seinen Horizont, lernt andere Kulturen kennen und hat oft viel bessere Arbeitsbedingungen. Aber die Nachteile dürfen nicht unterschätzt werden: Es ist eine schwere Entscheidung, die eigene Familie und Freunde zurückzulassen. Man muss sich in einer völlig neuen Gesellschaft zurechtfinden und kämpft am Anfang oft mit Einsamkeit und bürokratischen Hürden.

Meiner Meinung nach ist ein Auslandsaufenthalt eine der wertvollsten Erfahrungen im Leben. Selbst wenn man später wieder zurückkehrt, wächst man an dieser Herausforderung. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 260,
    estTime: "ca. 2:30 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Gliederung",
        objective: "Das Thema Auswanderung vorstellen und Struktur nennen.",
        notes: ["Thema: Auswanderung & Leben im Ausland", "Struktur: Erfahrung, Heimatland, Vor-/Nachteile, Fazit"],
        textDe: "Das Thema meiner Präsentation ist Auswanderung. Mein Vortrag gliedert sich in vier Teile: persönliche Erfahrungen, die Situation in meinem Heimatland, Vor- und Nachteile sowie meine eigene Meinung.",
        speak: "Guten Tag. Mein Thema lautet: Auswanderung. Ich berichte über meine Erfahrungen, mein Heimatland, Vor- und Nachteile und mein Fazit.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich gliedere meinen Vortrag in..."]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Vom eigenen Umzug ins Ausland und dem Start in Deutschland berichten.",
        notes: ["Umzug nach Deutschland zum Deutschlernen", "Heimweh am Anfang, heute gut integriert"],
        textDe: "Ich bin selbst vor einiger Zeit nach Deutschland gezogen. Zu Beginn fiel mir die Sprache schwer und ich vermisste meine Familie, aber durch Sprachkurse und Offenheit habe ich schnell Anschluss gefunden.",
        speak: "Aus eigener Erfahrung: Ich bin nach Deutschland gekommen, um Deutsch zu lernen. Der Anfang war nicht leicht, aber heute fühle ich mich wohl.",
        usefulPhrases: ["Aus eigener Erfahrung weiß ich...", "Am Anfang war es...", "Mit der Zeit..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Gründe für Auswanderung im Heimatland erklären (Brain Drain, Wirtschaft).",
        notes: ["Viele Absolventen suchen Jobs im Ausland", "Wirtschaftliche Gründe stehen im Vordergrund"],
        textDe: "In meinem Heimatland träumen viele junge Akademiker von einem Leben im Ausland, weil es daheim an gut bezahlten Arbeitsplätzen fehlt. Viele schicken Geld nach Hause, um ihre Verwandten zu unterstützen.",
        speak: "In meinem Heimatland wandern viele junge Menschen aus, weil sie dort keine guten Jobs finden.",
        usefulPhrases: ["In meiner Heimat ist die Situation so, dass...", "Hauptgründe sind..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Chancen (Sprache, Karriere) gegen Risiken (Heimweh, Trennung) abwägen.",
        notes: ["Vorteile: Sprachkenntnisse, Karriere, neue Perspektiven", "Nachteile: Heimweh, fremde Kultur, Einsamkeit am Anfang"],
        textDe: "Vorteile sind erstklassige Karrierechancen, persönliche Reife und das Erlernen einer neuen Sprache. Nachteile sind der Verlust des gewohnten sozialen Umfelds und die Hürden der Einwanderungsbürokratie.",
        speak: "Vorteile: Bessere Chancen und neue Erfahrungen. Nachteile: Trennung von Familie und anfängliche Einsamkeit.",
        usefulPhrases: ["Ein wesentlicher Vorteil ist...", "Auf der Kehrseite steht jedoch...", "Man darf nicht vergessen, dass..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Stellungnahme: Mut zum Schritt ins Ausland, aber Respekt vor der Hürde.",
        notes: ["Auswanderung stärkt die Persönlichkeit", "Dank und Fragebereitschaft"],
        textDe: "Meiner Meinung nach lohnt sich der Schritt ins Ausland, weil man die Welt mit neuen Augen sieht. Man sollte sich aber vorher gründlich vorbereiten. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach ist Auswandern eine große Chance. Herzlichen Dank für Ihre Aufmerksamkeit. Ich beantworte gerne Ihre Fragen.",
        usefulPhrases: ["Meiner Überzeugung nach...", "Ich empfehle jedem...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Was vermisst du am meisten an deiner Heimat?",
        questionEn: "What do you miss the most about your home country?",
        modelAnswerDe: "Vor allem die spontanen Treffen mit meiner Familie am Wochenende und das traditionelle Essen meiner Mutter. Über Videoanrufe halten wir aber täglichen Kontakt.",
        modelAnswerEn: "Mainly the spontaneous weekend gatherings with my family and my mother's home cooking. But we stay in daily touch via video calls."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Was war für Sie die größte Herausforderung beim Einleben in Deutschland?",
        questionEn: "What was the biggest challenge for you when settling into Germany?",
        modelAnswerDe: "Ganz klar die deutsche Grammatik und die Behördengänge. Aber die Menschen im Kurs und in meiner Nachbarschaft waren sehr hilfsbereit.",
        modelAnswerEn: "Definitely the German grammar and the official appointments. But people in my course and neighborhood were very helpful."
      }
    ]
  },
  {
    id: "bio_essen",
    number: 4,
    title: "4. Bio-Essen (Was denken Sie über Bio-Lebensmittel?)",
    question: "Lohnt es sich, mehr Geld für Bio-Produkte auszugeben?",
    category: "Ernährung & Gesundheit",
    badge: "Gesundheit & Umwelt",
    fullText: `Das Thema meiner Präsentation ist Bio-Essen. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Jetzt geht es um meine persönlichen Erfahrungen: In meiner Familie achten wir sehr auf frische Zutaten. Meine Mutter kauft am liebsten auf dem Wochenmarkt ein. Ich selbst kaufe im Supermarkt manche Produkte in Bio-Qualität, zum Beispiel Eier, Milch und Äpfel. Bei anderen Dingen wie Nudeln oder Reis greife ich aber zu normalen Produkten.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meiner Heimat gibt es das offizielle Bio-Siegel erst seit wenigen Jahren und die Produkte sind nur in teuren Spezialgeschäften in Großstädten erhältlich. Auf dem Land kaufen die Menschen ohnehin direkt beim Bauern, sodass man weiß, woher das Gemüse kommt, ohne dass 'Bio' draufstehen muss.

Nun erwähne ich einige Vor- und Nachteile: Der größte Vorteil von Bio-Lebensmitteln ist, dass sie ohne chemische Pestizide und künstliche Düngemittel angebaut werden. Das schont die Umwelt, das Grundwasser und ist gesünder für den menschlichen Körper. Auch Tiere auf Bio-Höfen haben oft mehr Auslauf und artgerechtes Futter. Der Hauptnachteil ist der Preis: Bio-Produkte sind oft 30 bis 50 Prozent teurer als konventionelle Lebensmittel, was sich Familien mit knappem Budget kaum leisten können.

Meiner Meinung nach sollte jeder so oft wie möglich zu regionalen und biologischen Lebensmitteln greifen. Wenn Bio zu teuer ist, ist es immer noch am besten, saisonale Produkte aus der eigenen Region zu kaufen. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 285,
    estTime: "ca. 2:40 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Thema Bio-Lebensmittel ankündigen und Gliederung nennen.",
        notes: ["Thema: Bio-Essen und gesunde Ernährung", "4 Teile: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation lautet: 'Was denken Sie über Bio-Essen?'. Ich gliedere meinen Vortrag in vier Abschnitte: eigene Erfahrungen, die Situation in meinem Heimatland, Vor- und Nachteile sowie mein Fazit.",
        speak: "Guten Tag. Mein Thema ist Bio-Essen. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich habe meinen Vortrag wie folgt gegliedert:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Einkaufsgewohnheiten und Kauf von Bio-Artikeln schildern.",
        notes: ["Kaufe Bio-Eier und Milch", "Obst und Gemüse teils auf dem Wochenmarkt"],
        textDe: "Was meine Erfahrungen betrifft: Bei tierischen Produkten wie Eiern und Milch kaufe ich fast immer Bio, weil mir das Tierwohl wichtig ist. Bei Obst und Gemüse achte ich vor allem auf Frische und Herkunft.",
        speak: "Zu meinen Erfahrungen: Ich kaufe vor allem Eier und Milch in Bio-Qualität, weil mir Tierwohl wichtig ist.",
        usefulPhrases: ["Was meine Erfahrungen angeht...", "Ich achte beim Einkaufen darauf, dass..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Bedeutung von Bio-Zertifikaten vs. traditionellem Markt in der Heimat.",
        notes: ["Bio-Siegel noch selten", "Traditionelle Märkte bieten frische Ware direkt vom Bauern"],
        textDe: "In meinem Heimatland sind verpackte Bio-Waren sehr teuer und nur in Metropolen zu finden. Die meisten Menschen vertrauen aber traditionellen Bauernmärkten, wo Obst und Gemüse frisch geerntet verkauft werden.",
        speak: "In meinem Heimatland gibt es wenig zertifiziertes Bio-Essen, aber viele kaufen frisch auf dem Bauernmarkt.",
        usefulPhrases: ["In meinem Heimatland ist Bio...", "Auf den Märkten vor Ort..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Umweltschutz & Gesundheit gegen hohe Preise abwägen.",
        notes: [
          "Vorteile: Keine Pestizide, besserer Geschmack, Umwelt- und Artenschutz",
          "Nachteile: Deutlich teurer, kürzere Haltbarkeit"
        ],
        textDe: "Ein klarer Vorteil von Bio ist der Verzicht auf gefährliche Pflanzenschutzmittel und mehr Tierwohl. Ein Nachteil ist jedoch der höhere Preis, den sich nicht jede Familie leisten kann, sowie die kürzere Haltbarkeit.",
        speak: "Vorteil: Besser für Umwelt und Gesundheit, keine Spritzmittel. Nachteil: Bio-Produkte sind oft viel teurer.",
        usefulPhrases: ["Ein wesentlicher Pluspunkt ist...", "Nachteilig ist allerdings der hohe Preis..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Persönliche Empfehlung (Regional vor Bio) und Danksagung.",
        notes: ["Empfehlung: Regional und saisonal einkaufen", "Fragen beantworten"],
        textDe: "Meiner Meinung nach ist regionale Qualität oft genauso gut wie Bio. Am besten kauft man saisonal auf dem Markt ein. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach sollte man regional und bewusst einkaufen. Danke für Ihre Aufmerksamkeit! Haben Sie Fragen?",
        usefulPhrases: ["Meiner Ansicht nach...", "Zusammenfassend halte ich fest...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Glaubst du wirklich, dass Bio-Gemüse besser schmeckt als normales?",
        questionEn: "Do you really believe that organic vegetables taste better than regular ones?",
        modelAnswerDe: "Bei manchen Sorten wie Tomaten oder Erdbeeren schmecke ich tatsächlich einen intensiveren Geschmack, weil sie langsamer in der Sonne reifen durften.",
        modelAnswerEn: "With some types like tomatoes or strawberries, I really do taste a more intense flavor because they were allowed to ripen more slowly in the sun."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Wie könnte gesundes Bio-Essen auch für einkommensschwache Familien bezahlbar werden?",
        questionEn: "How could healthy organic food become affordable for lower-income families as well?",
        modelAnswerDe: "Der Staat könnte die Mehrwertsteuer auf Grundnahrungsmittel in Bio-Qualität senken oder ökologische Landwirtschaft stärker subventionieren.",
        modelAnswerEn: "The government could reduce VAT on basic organic foods or subsidize ecological agriculture more strongly."
      }
    ]
  },
  {
    id: "online_shopping",
    number: 7,
    title: "7. Einkaufen im Internet (Online-Shopping)",
    question: "Soll man im Internet einkaufen oder lieber im lokalen Geschäft?",
    category: "Konsum & Technologie",
    badge: "Sehr häufig im Examen",
    fullText: `Das Thema meiner Präsentation ist Einkaufen im Internet. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine Meinung.

Heutzutage gibt es unzählige Plattformen, auf denen man rund um die Uhr einkaufen kann. Jetzt geht es um meine persönlichen Erfahrungen: Ich kaufe regelmäßig Kleidung, Elektronikartikel und Bücher online. Vor kurzem habe ich mir ein Paar Sportschuhe bestellt, die im Laden vergriffen waren, und sie wurden nach zwei Tagen geliefert. Bei Lebensmitteln gehe ich aber weiterhin lieber in den Supermarkt um die Ecke.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meinem Heimatland wächst der Online-Handel zwar stetig, aber viele ältere Menschen sind immer noch misstrauisch gegenüber Online-Zahlungen und haben Angst vor Betrug. In den Großstädten nutzen jüngere Leute jedoch täglich Liefer-Apps.

Nun erwähne ich einige Vor- und Nachteile: Ein großer Vorteil des Online-Shoppings ist die unglaubliche Bequemlichkeit: Man kann 24 Stunden am Tag und an sieben Tagen in der Woche von der Couch aus einkaufen, Preise blitzschnell vergleichen und bekommt alles direkt nach Hause geliefert. Ein wesentlicher Nachteil ist jedoch, dass man Kleidung nicht vorher anprobieren kann, was zu vielen Rücksendungen und Müll führt. Außerdem schadet es den Innenstädten, wenn kleine Einzelhändler schließen müssen.

Meiner Meinung nach ist ein gesunder Mix am besten: Bei Standardartikeln spart das Internet Zeit, aber lokale Händler sollte man durch persönliche Einkäufe unterstützen. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 275,
    estTime: "ca. 2:35 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Thema Online-Shopping vorstellen und Struktur nennen.",
        notes: ["Thema: Online-Shopping vs. Einzelhandel", "4 Teile: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Mein Vortrag befasst sich mit dem Thema 'Einkaufen im Internet'. Ich gliedere meine Präsentation in vier Teile: persönliche Erfahrungen, Situation im Heimatland, Vor- und Nachteile sowie mein Fazit.",
        speak: "Guten Tag. Mein Thema ist Einkaufen im Internet. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich gliedere meinen Vortrag in..."]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Über persönliche Online-Bestellungen und Erfahrungen berichten.",
        notes: ["Elektronik & Kleidung online bestellt", "Lebensmittel lieber im Geschäft vor Ort"],
        textDe: "Ich bestelle regelmäßig online, vor allem Kleidung und Technik. Es spart Zeit und ich finde auch seltene Artikel, die es in meiner Stadt nicht gibt. Frische Lebensmittel kaufe ich aber immer im Geschäft.",
        speak: "Zu meinen Erfahrungen: Ich kaufe Technik und Kleidung gern online, weil es schnell und bequem ist.",
        usefulPhrases: ["Was meine Erfahrungen angeht...", "Ich bestelle häufig...", "Vor kurzem habe ich..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Verbreitung von E-Commerce und Vertrauen in Online-Zahlungen schildern.",
        notes: ["Jüngere Generation kauft online", "Ältere misstrauen Online-Zahlung und bevorzugen Bargeld"],
        textDe: "In meinem Heimatland wird Online-Shopping bei jungen Leuten immer beliebter. Viele ältere Menschen zahlen aber lieber bar im Geschäft, weil sie Angst vor Datendiebstahl im Netz haben.",
        speak: "In meinem Heimatland wächst der Online-Handel, aber viele Menschen haben immer noch Angst vor Betrug im Internet.",
        usefulPhrases: ["In meiner Heimat ist das so...", "Besonders junge Menschen...", "Ältere Generationen..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Bequemlichkeit & Preisauswahl gegen Retouren & Aussterben von Läden abwägen.",
        notes: [
          "Vorteile: 24/7 geöffnet, Preisvergleich, riesige Auswahl, Lieferung nach Hause",
          "Nachteile: Keine Beratung, Retourenflut, kleine Läden gehen bankrott"
        ],
        textDe: "Vorteile sind der einfache Preisvergleich und die Lieferung bis an die Haustür. Nachteile sind fehlende persönliche Beratung, unnötiger Verpackungsmüll und das Sterben kleiner Geschäfte in den Innenstädten.",
        speak: "Vorteile sind Bequemlichkeit und Preisvergleich. Nachteile sind Verpackungsmüll und das Aussterben lokaler Geschäfte.",
        usefulPhrases: ["Ein großer Pluspunkt ist...", "Auf der anderen Seite führt das dazu, dass...", "Als Nachteil sehe ich..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Persönliche Balance empfehlen und Zuhörer danken.",
        notes: ["Gleichgewicht: Online für Spezielles, lokal für Alltag", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach ist Online-Shopping eine großartige Erleichterung, aber wir sollten auch die Geschäfte vor Ort unterstützen. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach sollte man beides nutzen. Vielen Dank für Ihre Aufmerksamkeit! Haben Sie Fragen?",
        usefulPhrases: ["Meiner Meinung nach...", "Ich finde es wichtig, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Hast du schon einmal schlechte Erfahrungen mit einem Online-Kauf gemacht?",
        questionEn: "Have you ever had a bad experience with an online purchase?",
        modelAnswerDe: "Ja, einmal kam ein Paket beschädigt an und die Rückerstattung hat mehrere Wochen gedauert. Seitdem achte ich sehr genau auf seriöse Kundenbewertungen.",
        modelAnswerEn: "Yes, once a package arrived damaged and the refund took several weeks. Since then, I pay close attention to reputable customer reviews."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Glauben Sie, dass es in Zukunft überhaupt noch traditionelle Modegeschäfte geben wird?",
        questionEn: "Do you believe that there will still be traditional fashion stores in the future?",
        modelAnswerDe: "Ja, davon bin ich überzeugt. Viele Kunden schätzen das haptische Erlebnis, Stoffe anzufassen, und möchten eine persönliche Stilberatung, die kein Computer ersetzen kann.",
        modelAnswerEn: "Yes, I am convinced of that. Many customers appreciate the tactile experience of touching fabrics and want personal styling advice no computer can replace."
      }
    ]
  },
  {
    id: "soziale_netzwerke",
    number: 30,
    title: "30. Soziale Netzwerke (Facebook, Instagram & Co.)",
    question: "Sind soziale Netzwerke im Alltag ein Segen oder eine Gefahr?",
    category: "Technologie & Medien",
    badge: "Dauerbrenner",
    fullText: `Das Thema meiner Präsentation ist Soziale Netzwerke. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Soziale Netzwerke wie Instagram, WhatsApp und Facebook spielen heute eine gigantische Rolle. Jetzt geht es um meine persönlichen Erfahrungen: Ich benutze soziale Netzwerke täglich, um mit meiner Familie und Freunden in meiner Heimat in Kontakt zu bleiben. Wir teilen Fotos und schreiben Nachrichten. Manchmal merke ich aber auch, dass ich zu viel Zeit mit sinnlosem Scrollen verliere.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meinem Heimatland sind soziale Netzwerke extrem populär, besonders bei Jugendlichen und jungen Erwachsenen. Sie nutzen Plattformen nicht nur privat, sondern auch für geschäftliche Zwecke, um Produkte zu verkaufen oder Sprachkurse zu finden.

Nun erwähne ich einige Vor- und Nachteile: Ein unbestreitbarer Vorteil ist, dass man weltweit kostenlos und in Sekundenschnelle kommunizieren kann. Man bleibt mit Freunden vernetzt und kann sich über Nachrichten informieren. Die Nachteile sind jedoch gravierend: Soziale Medien können süchtig machen, lenken von der Arbeit oder dem Studium ab und bergen Risiken wie Cybermobbing und Fake News. Außerdem leidet oft die echte persönliche Kommunikation von Angesicht zu Angesicht.

Meiner Meinung nach sind soziale Netzwerke ein wunderbares Werkzeug, wenn man sie kontrolliert einsetzt. Man sollte sich tägliche Zeitlimits setzen, um nicht die reale Welt zu vernachlässigen. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 260,
    estTime: "ca. 2:30 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Aufbau",
        objective: "Das Thema Social Media vorstellen und den Ablauf erklären.",
        notes: ["Thema: Soziale Netzwerke", "Aufbau: Eigene Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation lautet: 'Soziale Netzwerke'. Ich habe meinen Vortrag in vier Punkte unterteilt: eigene Erfahrungen, die Situation im Heimatland, Vor- und Nachteile sowie mein persönliches Fazit.",
        speak: "Guten Tag. Mein Thema sind Soziale Netzwerke. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation lautet...", "Ich habe meinen Vortrag in vier Teile gegliedert:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Eigene Social-Media-Nutzung reflektieren.",
        notes: ["Täglich Kontakt zur Familie im Ausland via WhatsApp/Instagram", "Ablenkung durch langes Scrollen"],
        textDe: "Ich nutze soziale Netzwerke vor allem, um mit meinen Freunden und meiner Familie im Ausland in Kontakt zu bleiben. Fotos und Nachrichten erleichtern die Nähe, aber manchmal sitze ich zu lange vor dem Bildschirm.",
        speak: "Zu meinen Erfahrungen: Ich nutze soziale Medien täglich für Nachrichten an Freunde, verliere dabei aber manchmal die Zeit.",
        usefulPhrases: ["In meinem Alltag nutze ich...", "Für mich ist das wichtig, um...", "Allerdings merke ich..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Stellenwert von Social Media in der Heimat darstellen.",
        notes: ["Fast jeder Jugendliche hat ein Smartphone", "Große Rolle für Online-Handel und Information"],
        textDe: "In meinem Heimatland nutzt fast jeder Jugendliche soziale Medien über das Smartphone. Viele kleine Händler verkaufen ihre Waren direkt über Instagram, da das einfacher ist als eine eigene Website.",
        speak: "In meinem Heimatland sind soziale Netzwerke extrem beliebt. Viele nutzen sie sogar für ihre Arbeit und Geschäfte.",
        usefulPhrases: ["In meinem Heimatland...", "Besonders beliebt ist...", "Dort nutzt man Plattformen auch für..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Vernetzung & Schnelligkeit gegen Sucht & Datenschutz abwägen.",
        notes: [
          "Vorteile: Kostenlose globale Vernetzung, schnelle Information, Unterhaltung",
          "Nachteile: Suchtgefahr, Konzentrationsverlust, Datenschutzprobleme, Fake News"
        ],
        textDe: "Der Vorteil ist der schnelle, weltweite Austausch mit Familie und Freunden. Als Nachteile sehe ich die Suchtgefahr, den Zeitverlust sowie die Verbreitung von Falschmeldungen im Netz.",
        speak: "Vorteil: Schnelle weltweite Kommunikation. Nachteile: Suchtgefahr, Datenschutzrisiken und weniger echte Gespräche.",
        usefulPhrases: ["Als Vorteil möchte ich nennen...", "Ein ernster Nachteil ist jedoch...", "Zudem besteht die Gefahr, dass..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Ein klares Fazit (Medienkompetenz & Zeitlimits) ziehen.",
        notes: ["Feste Bildschirmzeiten vereinbaren", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach sind soziale Medien nützlich, solange man die Kontrolle behält. Ich empfehle jedem, feste bildschirmfreie Zeiten einzulegen. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach sind soziale Netzwerke nützlich, wenn man sich Zeitlimits setzt. Danke für Ihre Aufmerksamkeit!",
        usefulPhrases: ["Meiner Meinung nach...", "Ich bin der Ansicht, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Wie viel Zeit verbringst du durchschnittlich pro Tag auf sozialen Netzwerken?",
        questionEn: "How much time on average do you spend per day on social media?",
        modelAnswerDe: "Ehrlich gesagt etwa ein bis zwei Stunden täglich, hauptsächlich abends. Ich versuche aber, mein Handy beim Lernen oder Essen ganz wegzulegen.",
        modelAnswerEn: "Honestly about one to two hours a day, mainly in the evening. But I try to put my phone completely away while studying or eating."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Sollten Eltern ihren Kindern die Nutzung von Social Media bis zu einem bestimmten Alter verbieten?",
        questionEn: "Should parents ban their children from using social media until a certain age?",
        modelAnswerDe: "Ein totales Verbot bringt selten etwas, weil Kinder es dann heimlich tun. Besser ist es, die Nutzung gemeinsam zu begleiten und klare Regeln zu vereinbaren.",
        modelAnswerEn: "A complete ban rarely helps because kids will just do it secretly. It is better to guide their usage together and set clear ground rules."
      }
    ]
  },
  {
    id: "oeffentliche_verkehrsmittel",
    number: 35,
    title: "35. Öffentliche Verkehrsmittel (Bus & Bahn statt Auto)",
    question: "Sollte man im Alltag öffentliche Verkehrsmittel statt des Autos nutzen?",
    category: "Umwelt & Mobilität",
    badge: "Ökologie & Stadt",
    fullText: `Das Thema meiner Präsentation ist öffentliche Verkehrsmittel. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Jetzt geht es um meine persönlichen Erfahrungen: Seitdem ich in Deutschland lebe, habe ich kein eigenes Auto mehr. Ich fahre täglich mit der U-Bahn und der Straßenbahn zur Arbeit und zum Sprachkurs. Das ist für mich sehr stressfrei, weil ich während der Fahrt Podcasts hören oder ein Buch lesen kann und keine Parkplätze suchen muss.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meiner Heimatstadt fahren die meisten Menschen mit dem privaten Auto oder Motorrad, weil das Busnetz unzuverlässig ist und oft im Stau steht. Es gibt in vielen Regionen keine U-Bahnen, weshalb ein Auto für viele Familien unverzichtbar ist.

Nun erwähne ich einige Vor- und Nachteile: Der größte Vorteil öffentlicher Verkehrsmittel ist der Umweltschutz: Züge und Busse verbrauchen pro Person viel weniger Energie als Autos und stoßen weniger CO2 aus. Außerdem spart man sich teure Benzinpreise, Reparaturen und Parkgebühren. Ein Nachteil ist jedoch die mangelnde Flexibilität: Wenn Züge Verspätung haben oder ausfallen, kommt man zu spät. Auf dem Land fahren Busse oft nur selten, besonders abends und am Wochenende.

Meiner Meinung nach ist die Nutzung von Bus und Bahn in der Stadt dem Auto überlegen. Der Staat sollte den Nahverkehr weiter ausbauen und Tickets günstig halten, damit noch mehr Menschen umsteigen. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 270,
    estTime: "ca. 2:35 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Thema öffentlicher Nahverkehr vorstellen und Ablauf skizzieren.",
        notes: ["Thema: Öffentliche Verkehrsmittel", "Gliederung: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation ist: 'Öffentliche Verkehrsmittel'. Ich werde über meine persönlichen Erfahrungen berichten, die Situation in meinem Heimatland schildern, Vor- und Nachteile abwägen und meine Meinung nennen.",
        speak: "Guten Tag. Mein Thema sind öffentliche Verkehrsmittel. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich gliedere meinen Vortrag wie folgt:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Persönliche Nutzung von Bus und Bahn im Alltag schildern.",
        notes: ["Kein Auto in Deutschland", "Fahre täglich U-Bahn und Tram, entspannt ohne Stau"],
        textDe: "Ich fahre in Deutschland fast überall mit U-Bahn, Bus oder Tram. Ohne Auto spare ich Geld und muss in der Innenstadt keine teuren Parkplätze suchen. Während der Fahrt lese ich gerne.",
        speak: "Zu meinen Erfahrungen: Ich fahre täglich mit U-Bahn und Bus. Es ist stressfrei und ich muss keinen Parkplatz suchen.",
        usefulPhrases: ["Aus eigener Erfahrung kann ich sagen...", "In meinem Alltag nutze ich...", "Besonders schätze ich daran..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Verkehrssituation in der Heimat (Stau, Autoverkehr) darstellen.",
        notes: ["Kaum U-Bahnen, Busse oft überfüllt und unpünktlich", "Auto oder Moped gilt als Status- und Notwendigkeit"],
        textDe: "In meinem Heimatland ist der öffentliche Nahverkehr leider schlecht ausgebaut. Busse sind oft überfüllt und haben keine festen Fahrpläne, weshalb jeder versucht, ein eigenes Auto zu kaufen.",
        speak: "In meinem Heimatland sind Busse oft unpünktlich, deshalb fahren die meisten lieber mit dem eigenen Auto oder Moped.",
        usefulPhrases: ["In meiner Heimat ist die Situation anders...", "Viele Menschen dort besitzen...", "Der Nahverkehr ist leider..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Klimaschutz & Kostenersparnis gegen Verspätungen & Ausfälle abwägen.",
        notes: [
          "Vorteile: Umweltfreundlich, kein Staufrust, günstiger als Unterhalt eines PKW",
          "Nachteile: Verspätungen, Abhängigkeit vom Fahrplan, schlechte Anbindung auf dem Land"
        ],
        textDe: "Vorteile sind der Klimaschutz, geringere Kosten und stressfreies Reisen ohne Stau. Nachteile sind mögliche Verspätungen, Zugausfälle und die schlechte Anbindung in ländlichen Regionen.",
        speak: "Vorteil: Günstiger als ein Auto und gut für die Umwelt. Nachteil: Verspätungen und feste Fahrpläne schränken ein.",
        usefulPhrases: ["Ein wesentlicher Vorteil ist der Umweltschutz...", "Auf der anderen Seite ärgern Verspätungen...", "Besonders auf dem Land..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Fazit zum Verkehrswandel und Dank an die Zuhörer.",
        notes: ["Öffentliche Verkehrsmittel sind die Zukunft", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach sind Bus und Bahn die Zukunft der modernen Mobilität. Günstige Tickets wie das Deutschlandticket machen den Umstieg leicht. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach sollten wir mehr Bus und Bahn fahren. Vielen Dank für Ihre Aufmerksamkeit! Ich beantworte gerne Ihre Fragen.",
        usefulPhrases: ["Meiner Meinung nach...", "Ich halte es für notwendig, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Was machst du, wenn die Bahn streikt oder dein Zug ausfällt?",
        questionEn: "What do you do if the train is on strike or your train is cancelled?",
        modelAnswerDe: "In solchen Fällen nutze ich Leihfahrräder, E-Scooter oder organisiere Fahrgemeinschaften mit Kollegen. Notfalls arbeite ich im Homeoffice.",
        modelAnswerEn: "In such cases, I use rental bikes, e-scooters, or carpool with colleagues. If necessary, I work from home."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Sollte der öffentliche Nahverkehr für alle Bürger komplett kostenlos sein?",
        questionEn: "Should public local transportation be completely free for all citizens?",
        modelAnswerDe: "Das wäre ein wunderbares Ziel für den Klimaschutz. Allerdings muss gewährleistet sein, dass trotzdem genug Geld für neue Züge und saubere Bahnhöfe da ist.",
        modelAnswerEn: "That would be a wonderful goal for climate protection. However, it must be ensured that there is still enough funding for new trains and clean stations."
      }
    ]
  },
  {
    id: "haustiere",
    number: 18,
    title: "18. Haustiere (Soll man Haustiere halten?)",
    question: "Ist es gut und sinnvoll, Haustiere wie Hunde oder Katzen in der Wohnung zu halten?",
    category: "Gesellschaft & Familie",
    badge: "Familie & Freizeit",
    fullText: `Das Thema meiner Präsentation ist Haustiere. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Jetzt geht es um meine persönlichen Erfahrungen: Ich bin mit einem Hund aufgewachsen. Er war zehn Jahre lang mein treuester Begleiter. Wenn ich nach der Schule traurig war oder Stress hatte, habe ich mit ihm gespielt und bin spazieren gegangen. Das hat mir immer geholfen, mich zu entspannen.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meinem Heimatland halten verhältnismäßig wenige Menschen Tiere direkt in der Wohnung. Katzen sieht man draußen auf der Straße und Hunde werden meistens als Wachhunde in Höfen oder Gärten gehalten. Tierfutter und Tierärzte sind dort für viele Familien ein Luxus.

Nun erwähne ich einige Vor- und Nachteile: Ein großer Vorteil von Haustieren ist, dass sie treue Freunde sind. Sie vertreiben die Einsamkeit, bringen Freude ins Haus und bringen Besitzer dazu, sich bei Wind und Wetter draußen zu bewegen. Für Kinder ist ein Haustier toll, um früh Verantwortung zu lernen. Ein klarer Nachteil sind die hohen Kosten: Futter, Impfungen, Tierarztbesuche und Hundesteuer kosten viel Geld. Außerdem schränken Haustiere die Urlaubsplanung ein, da man sie nicht überallhin mitnehmen kann.

Meiner Meinung nach bereichern Haustiere das Leben ungemein, aber man muss vor der Anschaffung genau prüfen, ob man genug Zeit, Platz und Geld für das Tier hat. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 265,
    estTime: "ca. 2:30 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Thema Haustiere vorstellen und Ablauf skizzieren.",
        notes: ["Thema: Haustiere halten", "Gliederung: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation ist: 'Haustiere'. Mein Vortrag ist in vier Teile gegliedert: persönliche Erfahrungen, die Lage in meinem Heimatland, Vor- und Nachteile sowie meine persönliche Meinung.",
        speak: "Guten Tag. Mein Thema sind Haustiere. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation lautet...", "Ich habe meinen Vortrag wie folgt gegliedert:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Von eigenen Erlebnissen mit Hund, Katze oder Kleintier berichten.",
        notes: ["Mit Hund aufgewachsen", "Gassi gehen gegen Stress, treuer Freund"],
        textDe: "Ich hatte als Kind einen Hund, der mir sehr ans Herz gewachsen ist. Wenn ich schlechte Laune hatte, hat mir das Spielen mit dem Hund geholfen, mich wieder wohlzufühlen.",
        speak: "Zu meinen Erfahrungen: Ich bin mit einem Hund aufgewachsen. Er war ein treuer Begleiter und hat mir immer Freude bereitet.",
        usefulPhrases: ["Aus eigener Erfahrung weiß ich...", "In meiner Familie hatten wir...", "Das hat mir geholfen..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Stellenwert von Haustieren in der Heimat (Wohnung vs. Garten/Hof) schildern.",
        notes: ["Tiere selten in Wohnungen", "Hunde meist Wachhunde auf dem Land", "Tierarztkosten gelten als Luxus"],
        textDe: "In meinem Heimatland leben Haustiere selten in der Wohnung. Man hält Hunde eher im Garten zur Bewachung des Hauses. Spezialisiertes Futter und Tierärzte sind dort sehr teuer.",
        speak: "In meinem Heimatland haben wenige Menschen Tiere in der Wohnung. Hunde leben meistens draußen im Garten.",
        usefulPhrases: ["In meiner Heimat ist das anders...", "Haustiere in der Wohnung sind...", "Auf dem Land..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Freude, Trost & Bewegung gegen Kosten, Zeit & Urlaubseinschränkung abwägen.",
        notes: [
          "Vorteile: Treuer Freund, gut gegen Einsamkeit, fördert Bewegung an frischer Luft",
          "Nachteile: Tierarztkosten, Zeitaufwand, Tierhaare, schwierige Urlaubsplanung"
        ],
        textDe: "Vorteile sind echte Zuneigung, Bewegung an der frischen Luft und weniger Einsamkeit. Nachteile sind die beträchtlichen Kosten für Futter und Tierarzt sowie die Schwierigkeit, mit Tier zu verreisen.",
        speak: "Vorteil: Ein treuer Freund gegen Einsamkeit und für mehr Bewegung. Nachteil: Hohe Kosten und weniger Flexibilität bei Reisen.",
        usefulPhrases: ["Ein wesentlicher Vorteil ist die Nähe...", "Ein großer Nachteil sind die Kosten für...", "Zudem schränkt es ein, wenn..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Verantwortungsbewussten Umgang betonen und Danksagung.",
        notes: ["Tiere sind Lebewesen, keine Spielzeuge", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach sind Haustiere eine wunderbare Bereicherung, aber man sollte sich nur ein Tier anschaffen, wenn man ihm ein artgerechtes Leben bieten kann. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach machen Haustiere glücklich, brauchen aber viel Verantwortung. Danke für Ihre Aufmerksamkeit! Haben Sie Fragen?",
        usefulPhrases: ["Meiner Meinung nach...", "Ich rate jedem dazu, vorher zu prüfen...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Hättest du heute in deiner Wohnung in Deutschland gerne wieder ein Haustier?",
        questionEn: "Would you like to have a pet again in your apartment in Germany today?",
        modelAnswerDe: "Sehr gerne sogar, aber momentan arbeite ich tagsüber zu lange und meine Mietwohnung ist zu klein. Vielleicht klappt es in ein paar Jahren.",
        modelAnswerEn: "Very gladly, but at the moment I work too long during the day and my rented flat is too small. Maybe in a few years."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Was halten Sie von Pflicht-Hundeführerscheinen für Erstbesitzer?",
        questionEn: "What do you think about mandatory dog licenses for first-time owners?",
        modelAnswerDe: "Das halte ich für eine sehr vernünftige Idee. So lernen Halter den richtigen Umgang mit dem Tier und gefährliche Vorfälle auf der Straße werden vermieden.",
        modelAnswerEn: "I consider that a very sensible idea. That way owners learn how to properly handle the animal and dangerous incidents on the street are avoided."
      }
    ]
  },
  {
    id: "hotel_mama",
    number: 19,
    title: "19. Hotel Mama (Bis wann bei den Eltern wohnen?)",
    question: "Bis zu welchem Alter sollten junge Erwachsene bei ihren Eltern wohnen?",
    category: "Gesellschaft & Familie",
    badge: "Kultureller Vergleich",
    fullText: `Das Thema meiner Präsentation ist Hotel Mama. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Was versteht man unter 'Hotel Mama'? Es bedeutet, dass junge Erwachsene auch nach der Schule oder während des Berufslebens bei den Eltern wohnen bleiben. Jetzt geht es um meine persönlichen Erfahrungen: Ich selbst habe bis zu meinem 23. Lebensjahr bei meiner Familie gewohnt. Meine Mutter hat oft gekocht und gewaschen, während ich mich auf meine Prüfungen konzentrieren konnte. Erst mit dem Umzug nach Deutschland bin ich auf eigenen Beinen gestanden.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meinem Heimatland ist es völlig normal, dass junge Männer und Frauen bis zur Heirat bei den Eltern wohnen, oft sogar bis ins Alter von 30 Jahren. Es wird in unserer Kultur als familiärer Zusammenhalt und Fürsorge verstanden, nicht als Faulheit.

Nun erwähne ich einige Vor- und Nachteile: Ein unschlagbarer Vorteil ist das Geldsparen: Junge Leute müssen keine eigene Miete, Strom oder Internet zahlen und können Geld für die spätere Zukunft sparen. Man hat immer ein warmes Essen und die Familie unterstützt sich gegenseitig. Ein gravierender Nachteil ist aber, dass man unselbstständig bleibt: Wer mit 25 noch nie selbst geputzt, gewaschen oder Rechnungen bezahlt hat, tut sich später im Leben schwer. Außerdem fehlt jungen Erwachsenen oft die nötige Privatsphäre und Freiheit.

Meiner Meinung nach ist es schön, während der Ausbildung bei den Eltern zu wohnen, aber mit spätestens 25 Jahren sollte jeder auf eigenen Beinen stehen und den Schritt in die Selbstständigkeit wagen. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 290,
    estTime: "ca. 2:45 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Definition",
        objective: "Begriff 'Hotel Mama' erklären und Gliederung ankündigen.",
        notes: ["Begriff Hotel Mama: Wohnen bei Eltern als Erwachsener", "Gliederung: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation lautet: 'Hotel Mama – bis wann sollen junge Erwachsene bei den Eltern wohnen?'. Ich habe meine Präsentation in vier Teile gegliedert: persönliche Erfahrungen, Situation in meiner Heimat, Vor- und Nachteile sowie mein Fazit.",
        speak: "Guten Tag. Mein Thema ist Hotel Mama. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Unter diesem Begriff versteht man...", "Ich gliedere meinen Vortrag in..."]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Über das eigene Wohnen bei den Eltern und den Auszug berichten.",
        notes: ["Bis 23 bei Eltern gewohnt", "Unterstützung beim Haushalt, Fokus auf Studium"],
        textDe: "Ich habe bis zum Alter von 23 Jahren bei meiner Familie gelebt. Das war sehr angenehm, weil ich mich voll auf mein Studium konzentrieren konnte. Der spätere Auszug war eine Umstellung, hat mich aber selbstständig gemacht.",
        speak: "Zu meinen Erfahrungen: Ich habe bis 23 bei meinen Eltern gewohnt. Es war bequem, aber der eigene Haushalt hat mich reifer gemacht.",
        usefulPhrases: ["Was meine Erfahrungen angeht...", "Ich habe bis... bei meinen Eltern gewohnt", "Rückblickend war das..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Kulturelle Unterschiede betonen (Wohnen bis zur Heirat).",
        notes: ["Wohnen bis zur Heirat üblich", "Hoher familiärer Zusammenhalt", "Wohnungen für Alleinstehende teuer"],
        textDe: "In meinem Heimatland wohnen viele Erwachsene bis zur Hochzeit bei ihren Eltern. Das Zusammenleben unter einem Dach gilt als Ehre und stärkt die Familienbande, Alleinwohnen ist eher die Ausnahme.",
        speak: "In meinem Heimatland wohnen junge Leute oft bis zur Heirat bei den Eltern. Die Familie steht immer an erster Stelle.",
        usefulPhrases: ["In meinem Heimatland ist das ganz normal, weil...", "Dort bleibt man oft bis zur Hochzeit daheim...", "Es wird angesehen als..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Geldersparnis & Geborgenheit gegen Unselbstständigkeit & Konflikte abwägen.",
        notes: [
          "Vorteile: Keine Mietkosten, leckeres Essen, familiäre Unterstützung, Sicherheit",
          "Nachteile: Fehlende Privatsphäre, Unselbstständigkeit im Haushalt, Einmischung der Eltern"
        ],
        textDe: "Vorteile sind das Sparen teurer Mieten und die herzliche Unterstützung der Eltern. Nachteile sind fehlende Privatsphäre, Abhängigkeit und das Risiko, alltägliche Dinge wie Kochen und Putzen nicht zu lernen.",
        speak: "Vorteil: Man spart viel Geld und hat familiären Halt. Nachteil: Man lernt nicht, sein Leben eigenständig zu organisieren.",
        usefulPhrases: ["Ein klarer Vorteil liegt in der Ersparnis...", "Demgegenüber steht als Nachteil...", "Viele lernen dadurch nicht, wie man..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Konkrete Altersempfehlung und Dank an die Prüfer.",
        notes: ["Spätestens Mitte 20 eigene Wohnung suchen", "Dank und Fragebereitschaft"],
        textDe: "Meiner Meinung nach sollte man den Schritt in eine eigene Wohnung bis Mitte 20 wagen. Nur wer alleine lebt, lernt echte Selbstverantwortung. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach sollte man mit 24 oder 25 ausziehen, um selbstständig zu werden. Danke für Ihre Aufmerksamkeit!",
        usefulPhrases: ["Meiner Meinung nach...", "Ich bin fest davon überzeugt, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Was war für dich das Schwierigste, als du das erste Mal eine eigene Wohnung hattest?",
        questionEn: "What was the hardest thing for you when you first had your own apartment?",
        modelAnswerDe: "Ganz klar das tägliche Kochen und Einkaufen nach einem langen Arbeitstag. Bei den Eltern stand das Essen immer pünktlich auf dem Tisch!",
        modelAnswerEn: "Definitely daily cooking and grocery shopping after a long workday. At my parents' house, dinner was always on the table on time!"
      },
      {
        asker: "Prüfer/in",
        questionDe: "Wie können Eltern ihre erwachsenen Kinder im Haus zu mehr Selbstständigkeit erziehen?",
        questionEn: "How can parents raise their adult children in the household towards more independence?",
        modelAnswerDe: "Indem sie feste Aufgaben verteilen, zum Beispiel das regelmäßige Putzen des Badezimmers oder das Waschen der eigenen Kleidung, und vielleicht einen kleinen Beitrag zu den Nebenkosten verlangen.",
        modelAnswerEn: "By assigning fixed chores, such as regularly cleaning the bathroom or washing one's own clothes, and perhaps asking for a small contribution to utility bills."
      }
    ]
  },
  {
    id: "wohngemeinschaft",
    number: 34,
    title: "34. Wohngemeinschaft (WG-Leben für Studierende)",
    question: "Sollen Studenten und junge Leute in einer Wohngemeinschaft leben?",
    category: "Wohnen & Lebensstil",
    badge: "Studium & Jugend",
    fullText: `Das Thema meiner Präsentation ist die Wohngemeinschaft, kurz WG. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Nach dem Schulabschluss ziehen viele junge Menschen von zu Hause aus, um in einer anderen Stadt zu studieren. Jetzt geht es um meine persönlichen Erfahrungen: Als ich in Deutschland ankam, bin ich in eine Dreier-WG mit zwei deutschen Mitbewohnern gezogen. Das war für mich ein Glücksfall, weil ich jeden Tag mein Deutsch im Gespräch verbessern konnte und wir oft gemeinsam gekocht haben.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meinem Heimatland ist das Konzept der gemischten privaten WG weniger verbreitet. Studierende wohnen entweder in staatlichen Studentenwohnheimen, getrennt nach Männern und Frauen, oder mieten sich eine kleine Wohnung zusammen mit Verwandten oder Geschwistern.

Nun erwähne ich einige Vor- und Nachteile: Ein großer Vorteil einer WG sind die geteilten Kosten: Miete, Internet, Strom und Rundfunkbeitrag werden durch die Mitbewohner geteilt, was das Wohnen sehr bezahlbar macht. Man findet schnell Freunde in einer fremden Stadt und ist nie einsam. Die Nachteile zeigen sich oft im Alltag: Das leidige Thema Putzen führt häufig zu Streit, wenn kein fester Putzplan eingehalten wird. Zudem kann es laut werden, wenn Mitbewohner Partys feiern und man eigentlich für eine wichtige Prüfung lernen muss.

Meiner Meinung nach ist das WG-Leben für Studierende und Berufseinsteiger eine fantastische Erfahrung. Man lernt Kompromissbereitschaft und schließt oft Freundschaften fürs Leben. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 275,
    estTime: "ca. 2:40 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Thema Wohngemeinschaft vorstellen und Gliederung nennen.",
        notes: ["Thema: Wohngemeinschaft (WG)", "Gliederung: Eigene Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation ist: 'Wohngemeinschaft – sollen Studierende zusammenleben?'. Ich gliedere meine Präsentation in vier Teile: persönliche Erfahrungen, Situation im Heimatland, Vor- und Nachteile sowie meine persönliche Meinung.",
        speak: "Guten Tag. Mein Thema ist die Wohngemeinschaft. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich habe meinen Vortrag wie folgt gegliedert:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Über das Leben in einer WG oder mit Mitbewohnern berichten.",
        notes: ["Wohne in 3er-WG in Deutschland", "Sprachpraxis & gemeinsames Kochen"],
        textDe: "Ich lebe seit einem Jahr in einer WG mit zwei Mitbewohnern. Für mich ist das ideal, weil wir uns gegenseitig helfen und ich beim Abendessen mein Deutsch im Alltag üben kann.",
        speak: "Zu meinen Erfahrungen: Ich lebe in einer WG. Das gemeinsame Kochen und Reden hilft mir sehr beim Deutschlernen.",
        usefulPhrases: ["Aus eigener Erfahrung weiß ich...", "Ich lebe derzeit in einer WG mit...", "Besonders positiv war..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "WG-Kultur in der Heimat mit Deutschland vergleichen.",
        notes: ["Getrennte Wohnheime oder Wohnen mit Geschwistern", "Gemischte WGs unüblich"],
        textDe: "In meinem Heimatland gibt es private WGs selten. Die meisten Studierenden wohnen in staatlichen Studentenheimen oder bleiben bei ihren Verwandten wohnen, da gemischte WGs traditionell nicht üblich sind.",
        speak: "In meinem Heimatland wohnen Studenten meist im Wohnheim oder bei der Familie. Gemischte WGs gibt es kaum.",
        usefulPhrases: ["In meiner Heimat ist das anders...", "Studierende wohnen meist in...", "Traditionell ist es üblich, dass..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Geteilte Kosten & Geselligkeit gegen Putzstreit & Lärm abwägen.",
        notes: [
          "Vorteile: Günstige Miete, geteilte Nebenkosten, Anschluss in neuer Stadt, nie einsam",
          "Nachteile: Putzstreitigkeiten, mangelnde Privatsphäre, Lärmbelästigung bei Prüfungen"
        ],
        textDe: "Vorteile sind die niedrigeren Kosten und der schnelle soziale Anschluss. Nachteile sind Konflikte um Sauberkeit und mangelnde Ruhe, wenn man ungestört lernen möchte.",
        speak: "Vorteil: Günstige Kosten und man ist nie allein. Nachteil: Streit um den Putzplan und manchmal zu wenig Ruhe.",
        usefulPhrases: ["Ein wesentlicher Pluspunkt sind die geteilten Kosten...", "Häufiger Streitpunkt ist jedoch...", "Wenn man lernen muss, stört oft..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Persönliche Empfehlung und Dank an die Prüfer.",
        notes: ["WG-Leben schult Sozialkompetenz", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach sollte jeder junge Mensch mindestens ein Jahr in einer WG gelebt haben, weil man dort lernt, Kompromisse zu schließen. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach ist das WG-Leben eine wertvolle Erfahrung für junge Leute. Danke für Ihre Aufmerksamkeit!",
        usefulPhrases: ["Meiner Meinung nach...", "Ich kann das WG-Leben jedem empfehlen, weil...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Wie regelt ihr in eurer WG das leidige Thema Putzen?",
        questionEn: "How do you handle the tiresome topic of cleaning in your shared apartment?",
        modelAnswerDe: "Wir haben einen digitalen Putzplan per App eingerichtet. Jede Woche ist jemand anderes für Küche und Bad zuständig, und das klappt meistens erstaunlich gut.",
        modelAnswerEn: "We set up a digital cleaning schedule via an app. Every week someone else is in charge of the kitchen and bathroom, and it mostly works surprisingly well."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Worauf sollte man bei der Auswahl neuer Mitbewohner am meisten achten?",
        questionEn: "What should one pay the most attention to when choosing new flatmates?",
        modelAnswerDe: "Vor allem auf ähnliche Vorstellungen von Ordnung, Schlafenszeiten und Ruhebedürfnis. Sympathie ist wichtig, aber der Alltag muss harmonieren.",
        modelAnswerEn: "Mainly on similar ideas regarding tidiness, sleeping hours, and need for quiet. Liking each other is important, but daily routines must harmonize."
      }
    ]
  },
  {
    id: "fertiggerichte",
    number: 12,
    title: "12. Fertiggerichte & Fastfood",
    question: "Soll man Fertiggerichte und Fastfood essen oder selbst kochen?",
    category: "Ernährung & Gesundheit",
    badge: "Gesundheit",
    fullText: `Das Thema meiner Präsentation ist Fertiggerichte und Fastfood. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Jetzt geht es um meine persönlichen Erfahrungen: Früher habe ich oft Fertiggerichte gegessen und ging mit Freunden mindestens zweimal in der Woche in Fastfood-Restaurants. Mittlerweile weiß ich aber, wie ungesund das ist. Wenn ich heute wenig Zeit habe, kaufe ich mir höchstens mal einen fertigen Salat im Supermarkt, versuche aber meistens, am Vorabend frisch zu kochen.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: Früher gab es in meiner Heimat kaum Fertigessen, da traditionell jeden Tag frisch gekocht wurde. Heutzutage boomen Fastfood-Ketten und Lieferdienste jedoch, besonders bei Schülern und Berufstätigen, die wenig Zeit haben.

Nun erwähne ich einige Vor- und Nachteile: Der größte Vorteil von Fertiggerichten ist die enorme Zeitersparnis: Man muss nicht einkaufen, kein Gemüse schneiden und hat nach zehn Minuten eine warme Mahlzeit auf dem Tisch. Zudem ist Fastfood oft relativ günstig. Der Nachteil ist jedoch gravierend: Fertiggerichte enthalten sehr viel Fett, Zucker, Salz und chemische Konservierungsstoffe. Sie machen dick, träge und erhöhen auf Dauer das Risiko für schwere Erkrankungen wie Diabetes und Bluthochdruck.

Meiner Meinung nach sollte man Fastfood nur in Ausnahmefällen essen. Eine frische Ernährung mit viel Gemüse und Obst ist die beste Investition in die eigene Gesundheit. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 265,
    estTime: "ca. 2:35 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Thema Fastfood vorstellen und Struktur nennen.",
        notes: ["Thema: Fertiggerichte & Fastfood", "Gliederung: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation lautet: 'Fertiggerichte und Fastfood'. Ich werde über meine persönlichen Erfahrungen berichten, die Lage in meinem Heimatland schildern, Vor- und Nachteile abwägen und meine Meinung nennen.",
        speak: "Guten Tag. Mein Thema sind Fertiggerichte. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich habe meinen Vortrag in vier Teile gegliedert:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Eigene Ernährungsgewohnheiten und Fastfood-Konsum schildern.",
        notes: ["Früher 2x pro Woche Fastfood", "Heute mehr Bewusstsein für frische Küche"],
        textDe: "Früher habe ich oft Burger und Pizza gegessen, weil es schnell ging. Heute koche ich lieber selbst, weil ich mich nach frischem Essen viel fitter und energiegeladener fühle.",
        speak: "Zu meinen Erfahrungen: Früher aß ich viel Fastfood, heute koche ich lieber frisch, weil es mir besser tut.",
        usefulPhrases: ["Was meine Erfahrungen angeht...", "Früher habe ich oft...", "Heute achte ich mehr darauf, dass..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Verbreitung von Fastfood und Lieferdiensten in der Heimat schildern.",
        notes: ["Früher nur traditionelle Hausmannskost", "Heute wachsen Fastfood-Ketten rasant"],
        textDe: "In meinem Heimatland war frisches Kochen immer ein zentraler Teil der Kultur. In den letzten Jahren haben jedoch internationale Fastfood-Ketten und Liefer-Apps rasant zugenommen, besonders unter Jugendlichen.",
        speak: "In meinem Heimatland kochen Familien traditionell selbst, aber Fastfood wird bei jungen Leuten immer beliebter.",
        usefulPhrases: ["In meinem Heimatland war früher...", "Heutzutage sieht man überall...", "Vor allem Jugendliche..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Schnelligkeit & Bequemlichkeit gegen Nährstoffmangel & Krankheiten abwägen.",
        notes: [
          "Vorteile: Sehr schnell zubereitet, keine Kochkenntnisse nötig, praktisch bei Stress",
          "Nachteile: Viel Fett, Zucker & Salz, ungesund, begünstigt Übergewicht und Krankheiten"
        ],
        textDe: "Vorteile sind die Schnelligkeit und Bequemlichkeit nach einem anstrengenden Arbeitstag. Nachteile sind der hohe Gehalt an ungesunden Fetten und Zusatzstoffen, die unserer Gesundheit schaden.",
        speak: "Vorteil: Man spart viel Zeit beim Kochen. Nachteil: Fertigessen ist sehr fettig und macht auf Dauer krank.",
        usefulPhrases: ["Ein offensichtlicher Vorteil ist die Zeitersparnis...", "Demgegenüber steht der große Nachteil, dass...", "Auf Dauer führt das zu..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Plädoyer für gesunde Ernährung und Dank an Zuhörer.",
        notes: ["Selber kochen macht gesund und glücklich", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach sollten wir uns die Zeit nehmen, frisch zu kochen. Gesunde Ernährung ist das Fundament eines langen Lebens. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach ist selbstgekochtes Essen durch nichts zu ersetzen. Danke für Ihre Aufmerksamkeit!",
        usefulPhrases: ["Meiner Meinung nach...", "Ich bin fest davon überzeugt, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Was kochst du am liebsten, wenn es mal schnell gehen muss?",
        questionEn: "What do you like to cook most when it needs to be quick?",
        modelAnswerDe: "Vollkornnudeln mit Tomatensoße und frischem Basilikum oder ein buntes Pfannengemüse. Das dauert keine fünfzehn Minuten und ist viel gesünder als eine Tiefkühlpizza.",
        modelAnswerEn: "Whole grain pasta with tomato sauce and fresh basil, or stir-fried vegetables. That takes less than fifteen minutes and is much healthier than a frozen pizza."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Sollte Fastfood an Schulen in der Mensa komplett verboten werden?",
        questionEn: "Should fast food be completely banned in school cafeterias?",
        modelAnswerDe: "Ja, in Schulen sollte man Kindern eine Vorbildfunktion bieten und ausschließlich ausgewogene, vitaminreiche Mahlzeiten servieren.",
        modelAnswerEn: "Yes, schools should serve as role models for children and exclusively offer balanced, vitamin-rich meals."
      }
    ]
  },
  {
    id: "sport_treiben",
    number: 31,
    title: "31. Sport treiben (Soll man regelmäßig Sport treiben?)",
    question: "Wie wichtig ist regelmäßige Bewegung für die Gesundheit und den Alltag?",
    category: "Ernährung & Gesundheit",
    badge: "Gesundheit & Fitness",
    fullText: `Das Thema meiner Präsentation ist Sport treiben. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Viele Menschen wissen, wie wichtig körperliche Bewegung für das Wohlbefinden ist. Jetzt geht es um meine persönlichen Erfahrungen: Ich gehe dreimal pro Woche ins Fitnessstudio und schwimme regelmäßig. Seitdem ich aktiv Sport treibe, fühle ich mich nach der Arbeit viel fitter, schlafe besser und habe seit Monaten nicht mehr geraucht.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meiner Heimat spielen fast alle Jungen begeistert Fußball auf den Straßen und Mädchen machen Gymnastik. Immer mehr Menschen besuchen moderne Sportvereine und Fitnesscenter, um dem stressigen Berufsalltag zu entfliehen.

Nun erwähne ich einige Vor- und Nachteile: Ein großer Vorteil des Sports ist, dass man Stress abbaut, das Herz-Kreislauf-System stärkt und Übergewicht verhindert. Sport macht den Kopf frei und schenkt neue Energie. Im Teamsport lernt man außerdem tolle neue Freunde kennen. Als Nachteil muss man erwähnen, dass man Zeit und Disziplin investieren muss. Wenn man sich nicht richtig aufwärmt, besteht zudem die Gefahr von schmerzhaften Sportverletzungen.

Meiner Meinung nach sollte jeder Mensch mindestens dreimal pro Woche dreißig Minuten aktiv sein. Es muss kein Hochleistungssport sein – zügiges Spazierengehen oder Radfahren reichen schon aus. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 250,
    estTime: "ca. 2:25 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Thema Sport vorstellen und Gliederung präsentieren.",
        notes: ["Thema: Sport treiben", "Gliederung: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation lautet: 'Sport treiben'. Ich werde über meine persönlichen Erfahrungen berichten, die Lage in meinem Heimatland schildern, Vor- und Nachteile beleuchten und meine Meinung sagen.",
        speak: "Guten Tag. Mein Thema ist Sport treiben. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich habe meinen Vortrag wie folgt aufgebaut:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Von eigenen Sportarten (z.B. Schwimmen, Joggen, Fitness) berichten.",
        notes: ["3x pro Woche Sport (Fitnessstudio, Schwimmen)", "Mehr Energie, besserer Schlaf"],
        textDe: "Ich treibe mehrmals pro Woche Sport. Vor allem Schwimmen hilft mir, nach einem langen Tag am Schreibtisch den Rücken zu entlasten und den Kopf freizubekommen.",
        speak: "Zu meinen Erfahrungen: Ich treibe regelmäßig Sport. Es hilft mir, Stress abzubauen und mich gesund zu fühlen.",
        usefulPhrases: ["Was meine Erfahrungen angeht...", "Ich treibe regelmäßig...", "Dadurch fühle ich mich..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Sportbegeisterung und Angebote in der Heimat schildern.",
        notes: ["Fußball ist Nationalsport", "Fitnessstudios boomen in den Städten"],
        textDe: "In meinem Heimatland ist Fußball die beliebteste Sportart. Viele junge Leute treffen sich abends zum Kicken oder gehen in moderne Fitnessclubs, um in Form zu bleiben.",
        speak: "In meinem Heimatland treiben viele Menschen Sport, besonders Fußball und Fitness sind sehr beliebt.",
        usefulPhrases: ["In meinem Heimatland spielt Sport...", "Sehr populär ist vor allem...", "Viele Menschen nutzen..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Fitness & Stressabbau gegen Zeitmangel & Verletzungsrisiko abwägen.",
        notes: [
          "Vorteile: Baut Stress ab, stärkt Immunsystem, beugt Krankheiten vor",
          "Nachteile: Verletzungsgefahr, Zeitaufwand, Kosten für Beiträge"
        ],
        textDe: "Vorteile sind die Stärkung des Immunsystems, Stressabbau und gute Laune. Nachteile sind das Risiko von Verletzungen und die Überwindung des inneren Schweinehunds.",
        speak: "Vorteil: Sport hält gesund und baut Stress ab. Nachteil: Man braucht Zeit und es gibt ein gewisses Verletzungsrisiko.",
        usefulPhrases: ["Ein riesiger Vorteil ist...", "Auf der anderen Seite besteht das Risiko von...", "Man muss dafür Zeit einplanen..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Persönliche Empfehlung für Alltagsbewegung und Dank an Prüfer.",
        notes: ["Täglich etwas Bewegung reicht schon aus", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach ist regelmäßige Bewegung der beste Schlüssel zu einem langen und glücklichen Leben. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach sollte jeder regelmäßig Sport treiben. Danke für Ihre Aufmerksamkeit! Haben Sie Fragen?",
        usefulPhrases: ["Meiner Meinung nach...", "Ich empfehle jedem...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Was motiviert dich, wenn du nach der Arbeit eigentlich zu müde für Sport bist?",
        questionEn: "What motivates you when you are actually too tired for sports after work?",
        modelAnswerDe: "Ich verabrede mich fest mit einem Freund. Wenn man zusammen trainiert, sagt man nicht so schnell ab und hat hinterher ein tolles Erfolgsgefühl.",
        modelAnswerEn: "I make a fixed appointment with a friend. When you train together, you don't cancel as easily and have a great feeling of accomplishment afterwards."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Sollten Arbeitgeber ihren Mitarbeitern Sportangebote während der Arbeitszeit ermöglichen?",
        questionEn: "Should employers enable sports activities for their employees during working hours?",
        modelAnswerDe: "Ja, absolut. Firmen, die Sport fördern, haben nachweislich weniger Krankheitsausfälle und zufriedenere Mitarbeiter.",
        modelAnswerEn: "Yes, absolutely. Companies that promote sports verifiably have fewer sick leaves and happier employees."
      }
    ]
  },
  {
    id: "reisen",
    number: 29,
    title: "29. Reisen (Soll man verreisen?)",
    question: "Welche Bedeutung hat das Reisen für die persönliche Entwicklung?",
    category: "Konsum & Freizeit",
    badge: "Freizeit & Kultur",
    fullText: `Das Thema meiner Präsentation ist Reisen. Meine Präsentation besteht aus folgenden Teilen: Zuerst möchte ich Ihnen von meinen persönlichen Erfahrungen erzählen. Danach beschreibe ich die Situation in meinem Heimatland. Dann möchte ich über Vor- und Nachteile sprechen. Zum Schluss sage ich meine persönliche Meinung.

Jetzt geht es um meine persönlichen Erfahrungen: Reisen ist für mich die schönste Art, den Urlaub zu verbringen. Vor zwei Jahren habe ich eine Reise durch Italien gemacht. Ich war begeistert von der Geschichte, der Architektur und dem leckeren Essen. Diese Reise hat mir geholfen, den stressigen Alltag komplett zu vergessen.

Jetzt würde ich gerne über die Situation in meinem Heimatland sprechen: In meinem Heimatland arbeiten viele Menschen sehr hart und haben oft nur wenig Urlaub oder Geld für weite Fernreisen. Deshalb verbringen die meisten ihre Ferien im eigenen Land bei Verwandten oder am Meer. Allerdings reisen jüngere Leute heute immer häufiger auch ins Ausland.

Nun erwähne ich einige Vor- und Nachteile: Ein großer Vorteil des Reisens ist, dass man fremde Kulturen kennenlernt, neue Sprachen hört und die eigene Denkweise erweitert. Man sieht berühmte Sehenswürdigkeiten mit eigenen Augen und sammelt unvergessliche Erinnerungen. Ein Nachteil sind die hohen Reisekosten für Flüge, Hotels und Verpflegung. Zudem kann Reisen anstrengend sein und Flüge belasten das Klima.

Meiner Meinung nach sollte jeder Mensch reisen, wenn es die Finanzen erlauben. Man muss nicht ans andere Ende der Welt fliegen – auch eine kurze Reise in die Nachbarstadt kann sehr bereichernd sein. Das war meine Präsentation. Vielen Dank für Ihre Aufmerksamkeit!`,
    wordCount: 255,
    estTime: "ca. 2:30 Min.",
    slides: [
      {
        slide: 1,
        title: "Folie 1: Thema & Struktur",
        objective: "Das Thema Reisen ankündigen und Gliederung präsentieren.",
        notes: ["Thema: Reisen & Urlaub", "Gliederung: Erfahrung, Heimatland, Vor-/Nachteile, Meinung"],
        textDe: "Guten Tag. Das Thema meiner Präsentation ist: 'Reisen – soll man verreisen?'. Ich habe meinen Vortrag in vier Abschnitte unterteilt: persönliche Erfahrungen, Situation im Heimatland, Vor- und Nachteile sowie mein Fazit.",
        speak: "Guten Tag. Mein Thema ist Reisen. Ich spreche über Erfahrungen, mein Heimatland, Vor- und Nachteile und meine Meinung.",
        usefulPhrases: ["Das Thema meiner Präsentation ist...", "Ich habe meinen Vortrag wie folgt gegliedert:"]
      },
      {
        slide: 2,
        title: "Folie 2: Eigene Erfahrungen",
        objective: "Über eigene Urlaubsreisen und Erlebnisse berichten.",
        notes: ["Reise nach Italien", "Kultur, Essen und Erholung genossen"],
        textDe: "Ich verreise leidenschaftlich gerne. Meine schönste Reise ging nach Italien: Das Eintauchen in eine andere Kultur hat mir neue Kraft für die Arbeit geschenkt.",
        speak: "Zu meinen Erfahrungen: Ich reise sehr gerne. Bei Reisen lerne ich neue Kulturen kennen und kann mich erholen.",
        usefulPhrases: ["Aus eigener Erfahrung kann ich sagen...", "Eine meiner schönsten Reisen war...", "Dabei habe ich gelernt..."]
      },
      {
        slide: 3,
        title: "Folie 3: Situation im Heimatland",
        objective: "Urlaubsgewohnheiten in der Heimat darstellen.",
        notes: ["Meist Inlandsreisen zur Familie oder ans Meer", "Auslandsreisen oft zu teuer"],
        textDe: "In meinem Heimatland reisen viele Menschen innerhalb des Landes, um ihre Verwandten zu besuchen. Für Auslandsreisen fehlt vielen Familien schlicht das Geld.",
        speak: "In meinem Heimatland verbringen die meisten ihren Urlaub bei der Familie im eigenen Land, weil Reisen ins Ausland teuer sind.",
        usefulPhrases: ["In meiner Heimat ist es üblich, dass...", "Viele Familien verbringen ihren Urlaub...", "Auslandsreisen sind..."]
      },
      {
        slide: 4,
        title: "Folie 4: Vor- und Nachteile",
        objective: "Horizont-Erweiterung & Erholung gegen Kosten & CO2-Belastung abwägen.",
        notes: [
          "Vorteile: Horizont erweitern, neue Sprachen, Erholung, schöne Erinnerungen",
          "Nachteile: Hohe Kosten, Reiseaufwand, Belastung für die Umwelt durch Flüge"
        ],
        textDe: "Vorteile sind unbezahlbare Erfahrungen, neue Perspektiven und tiefe Entspannung. Nachteile sind die beträchtlichen Kosten und die Umweltbelastung durch den Flugverkehr.",
        speak: "Vorteil: Man erweitert seinen Horizont und entdeckt Neues. Nachteil: Es kostet viel Geld und schadet oft der Umwelt.",
        usefulPhrases: ["Der wichtigste Pluspunkt ist...", "Auf der anderen Seite sind Reisen...", "Besonders das Fliegen belastet..."]
      },
      {
        slide: 5,
        title: "Folie 5: Eigene Meinung & Abschluss",
        objective: "Persönliche Sichtweise formulieren und Danksagung.",
        notes: ["Reisen bildet und verbindet Menschen", "Dank und Fragerunde"],
        textDe: "Meiner Meinung nach erweitert Reisen den Geist und baut Vorurteile ab. Schon kleine Ausflüge in die Natur tun gut. Vielen Dank für Ihre Aufmerksamkeit!",
        speak: "Meiner Meinung nach lohnt sich jede Reise. Herzlichen Dank für Ihre Aufmerksamkeit! Haben Sie noch Fragen?",
        usefulPhrases: ["Meiner Meinung nach...", "Ich bin der Überzeugung, dass...", "Vielen Dank für Ihre Aufmerksamkeit!"]
      }
    ],
    qa: [
      {
        asker: "Gesprächspartner/in",
        questionDe: "Wohin möchtest du in deinem Leben unbedingt noch reisen?",
        questionEn: "Where in your life do you definitely still want to travel?",
        modelAnswerDe: "Ich möchte unbedingt einmal mit dem Zug durch die Schweizer Alpen fahren und den Norden von Skandinavien mit seinen Polarlichtern sehen.",
        modelAnswerEn: "I definitely want to travel through the Swiss Alps by train and see northern Scandinavia with its northern lights."
      },
      {
        asker: "Prüfer/in",
        questionDe: "Wie kann man reisen, ohne dabei der Umwelt zu schaden?",
        questionEn: "How can one travel without harming the environment?",
        modelAnswerDe: "Indem man mit der Bahn statt mit dem Flugzeug reist, regionale Unterkünfte bucht und Plastikmüll vor Ort vermeidet.",
        modelAnswerEn: "By traveling by train instead of flying, booking regional accommodations, and avoiding plastic waste on site."
      }
    ]
  }
];
