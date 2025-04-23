import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');
console.log('Checking for .env.local at:', envPath);
console.log('File exists:', existsSync(envPath));

if (existsSync(envPath)) {
  console.log('\nFile contents:');
  const contents = readFileSync(envPath, 'utf8');
  // Print the length of the contents without showing the actual content
  console.log('File length:', contents.length, 'characters');
  console.log('First few characters (sanitized):', contents.substring(0, 15).replace(/[^\s]/g, '*'));
} 