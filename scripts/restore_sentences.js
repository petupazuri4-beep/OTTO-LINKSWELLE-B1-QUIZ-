import fs from 'fs';
import path from 'path';

/**
 * Automated restoration script for Linkswelle Goethe B1 Sentences Ladder.
 * Restores all 15 topics (70 sentences each, 1,050 total) from the backup snapshot.
 */
const SNAPSHOT_PATH = path.resolve('backup/sentenceExercises_snapshot.json');
const TARGET_DIR = path.resolve('src/data/sentences');
const INDEX_FILE = path.resolve('src/data/sentenceExercises.js');

const TOPIC_FILE_MAP = {
  "Daily Life & Home": "topic_daily_life.js",
  "Work & Education": "topic_work_education.js",
  "People & Relationships": "topic_people_relationships.js",
  "Travel & Transportation": "topic_travel_transport.js",
  "Communication": "topic_communication.js",
  "Food & Dining": "topic_food_dining.js",
  "Health & Body": "topic_health_body.js",
  "Money & Shopping": "topic_money_shopping.js",
  "Time & Schedule": "topic_time_schedule.js",
  "Environment & Nature": "topic_environment_nature.js",
  "Leisure & Culture": "topic_leisure_culture.js",
  "Emotions & Opinions": "topic_emotions_opinions.js",
  "Technology & Media": "topic_technology_media.js",
  "Society & Law": "topic_society_law.js",
  "Buildings & Places": "topic_buildings_places.js"
};

const EXPORT_NAME_MAP = {
  "Daily Life & Home": "dailyLifeSentences",
  "Work & Education": "workEducationSentences",
  "People & Relationships": "peopleRelationshipsSentences",
  "Travel & Transportation": "travelTransportSentences",
  "Communication": "communicationSentences",
  "Food & Dining": "foodDiningSentences",
  "Health & Body": "healthBodySentences",
  "Money & Shopping": "moneyShoppingSentences",
  "Time & Schedule": "timeScheduleSentences",
  "Environment & Nature": "environmentNatureSentences",
  "Leisure & Culture": "leisureCultureSentences",
  "Emotions & Opinions": "emotionsOpinionsSentences",
  "Technology & Media": "technologyMediaSentences",
  "Society & Law": "societyLawSentences",
  "Buildings & Places": "buildingsPlacesSentences"
};

function restore() {
  console.log('🔄 Starting Linkswelle Sentences Ladder Restore...');
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error('❌ Snapshot file not found at:', SNAPSHOT_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf-8');
  const payload = JSON.parse(raw);
  const data = payload.data;

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  let totalRestored = 0;
  for (const [topic, sentences] of Object.entries(data)) {
    const filename = TOPIC_FILE_MAP[topic];
    const exportName = EXPORT_NAME_MAP[topic];
    if (!filename || !exportName) continue;

    const fileContent = `export const ${exportName} = ${JSON.stringify(sentences, null, 2)};\n`;
    fs.writeFileSync(path.join(TARGET_DIR, filename), fileContent, 'utf-8');
    totalRestored += sentences.length;
    console.log(`  ✓ Restored ${topic}: ${sentences.length} sentences -> ${filename}`);
  }

  // Restore index
  const indexImports = Object.keys(data).map(topic => {
    return `import { ${EXPORT_NAME_MAP[topic]} } from './sentences/${TOPIC_FILE_MAP[topic]}';`;
  }).join('\n');

  const indexExports = Object.keys(data).map(topic => {
    return `  "${topic}": ${EXPORT_NAME_MAP[topic]}`;
  }).join(',\n');

  const indexContent = `${indexImports}\n\nexport const SENTENCE_EXERCISES = {\n${indexExports}\n};\n`;
  fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');

  console.log(`\n✅ RESTORE COMPLETE! Successfully restored ${totalRestored} sentences across ${Object.keys(data).length} topics.`);
}

restore();
