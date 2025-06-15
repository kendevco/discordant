#!/usr/bin/env node

/**
 * Environment Variables Comparison
 * Compare local .env with what should be in Vercel
 */

const fs = require('fs');

console.log('🔍 ENVIRONMENT VARIABLES COMPARISON\n');

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key] = line.split('=');
      return key.trim();
    });

  console.log('📋 LOCAL ENVIRONMENT VARIABLES:');
  console.log('================================');
  
  const criticalVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 
    'CLERK_SECRET_KEY',
    'UPLOADTHING_SECRET',
    'UPLOADTHING_APP_ID',
    'N8N_WEBHOOK_URL',
    'N8N_API_KEY',
    'LIVEKIT_API_KEY',
    'LIVEKIT_API_SECRET',
    'NEXT_PUBLIC_LIVEKIT_URL'
  ];

  criticalVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    const status = hasVar ? '✅' : '❌';
    console.log(`${status} ${varName}`);
  });

  console.log('\n🚀 VERCEL COMMANDS TO RUN:');
  console.log('================================');
  
  console.log('1. Login to Vercel:');
  console.log('   npx vercel login');
  
  console.log('\n2. Check current Vercel env vars:');
  console.log('   npx vercel env ls');
  
  console.log('\n3. Add missing variables (run these one by one):');
  criticalVars.forEach(varName => {
    console.log(`   npx vercel env add ${varName}`);
  });
  
  console.log('\n4. Force redeploy:');
  console.log('   npx vercel --prod --force');
  
  console.log('\n5. Test health endpoint:');
  console.log('   curl https://your-app.vercel.app/api/health');

  console.log('\n📝 DEBUGGING CHECKLIST:');
  console.log('================================');
  console.log('□ All environment variables added to Vercel');
  console.log('□ Database URL is accessible from Vercel');
  console.log('□ Build completes successfully');
  console.log('□ Health endpoint returns 200');
  console.log('□ No serverless function timeouts');

} catch (error) {
  console.error('❌ Error:', error.message);
} 