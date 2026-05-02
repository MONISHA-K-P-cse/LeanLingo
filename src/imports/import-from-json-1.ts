/**
 * LEANLINGO Project Import Script
 *
 * Usage:
 * 1. Upload project-export.json to your Replit or target environment
 * 2. Run: node import-from-json.js
 * 3. Run: pnpm install
 * 4. Run: pnpm dev
 */

import * as fs from 'fs';
import * as path from 'path';

interface ProjectExport {
  name: string;
  description: string;
  files: Record<string, string>;
}

function importProject(jsonPath: string) {
  console.log('📦 Importing LEANLINGO project...\n');

  // Read the JSON export
  const exportData: ProjectExport = JSON.parse(
    fs.readFileSync(jsonPath, 'utf8')
  );

  console.log(`Project: ${exportData.name}`);
  console.log(`Files to import: ${Object.keys(exportData.files).length}\n`);

  let created = 0;
  let skipped = 0;

  // Create all files
  Object.entries(exportData.files).forEach(([filepath, content]) => {
    try {
      // Create directory if it doesn't exist
      const dir = path.dirname(filepath);
      if (dir !== '.') {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the file
      fs.writeFileSync(filepath, content, 'utf8');
      created++;

      if (created % 10 === 0) {
        console.log(`  Created ${created} files...`);
      }
    } catch (err) {
      console.warn(`  ⚠️  Could not create: ${filepath}`);
      skipped++;
    }
  });

  console.log(`\n✓ Import complete!`);
  console.log(`  Created: ${created} files`);
  if (skipped > 0) {
    console.log(`  Skipped: ${skipped} files`);
  }

  console.log('\nNext steps:');
  console.log('  1. Run: pnpm install');
  console.log('  2. Run: pnpm dev');
  console.log('  3. Open the app in your browser\n');
}

// Run the import
const jsonFile = process.argv[2] || 'project-export.json';
importProject(jsonFile);
