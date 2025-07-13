require('dotenv').config({ path: '.env.local' });

console.log('Testing environment variables...');
console.log('');

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;

console.log('Publishable Key:');
console.log('Length:', publishableKey?.length || 0);
console.log('Starts with pk_:', publishableKey?.startsWith('pk_') || false);
console.log('First 20 chars:', publishableKey?.substring(0, 20) || 'NOT SET');
console.log('');

console.log('Secret Key:');
console.log('Length:', secretKey?.length || 0);
console.log('Starts with sk_:', secretKey?.startsWith('sk_') || false);
console.log('First 20 chars:', secretKey?.substring(0, 20) || 'NOT SET');
console.log('');

if (!publishableKey) {
  console.log('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
} else if (!publishableKey.startsWith('pk_')) {
  console.log('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY format is incorrect');
} else {
  console.log('✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY looks good');
}

if (!secretKey) {
  console.log('❌ CLERK_SECRET_KEY is not set');
} else if (!secretKey.startsWith('sk_')) {
  console.log('❌ CLERK_SECRET_KEY format is incorrect');
} else {
  console.log('✅ CLERK_SECRET_KEY looks good');
} 