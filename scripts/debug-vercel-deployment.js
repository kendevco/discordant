#!/usr/bin/env node

/**
 * Vercel Deployment Debugger
 * Comprehensive debugging for deployment issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 VERCEL DEPLOYMENT DEBUGGER\n');

// 1. Check local environment
console.log('📋 LOCAL ENVIRONMENT CHECK');
console.log('================================');

try {
  // Check if .env exists
  const envExists = fs.existsSync('.env');
  console.log(`✅ .env file exists: ${envExists}`);
  
  if (envExists) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log(`✅ Environment variables count: ${envLines.length}`);
    
    // Check critical variables (without showing values)
    const criticalVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
      'UPLOADTHING_SECRET',
      'UPLOADTHING_APP_ID',
      'N8N_WEBHOOK_URL',
      'N8N_API_KEY'
    ];
    
    criticalVars.forEach(varName => {
      const hasVar = envContent.includes(varName);
      console.log(`${hasVar ? '✅' : '❌'} ${varName}: ${hasVar ? 'Present' : 'Missing'}`);
    });
  }
} catch (error) {
  console.error('❌ Error reading .env:', error.message);
}

// 2. Check build configuration
console.log('\n🏗️ BUILD CONFIGURATION CHECK');
console.log('================================');

try {
  // Check package.json scripts
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ Build script:', packageJson.scripts?.build || 'Not found');
  console.log('✅ Start script:', packageJson.scripts?.start || 'Not found');
  
  // Check Next.js config
  const nextConfigExists = fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs');
  console.log(`✅ Next.js config exists: ${nextConfigExists}`);
  
  // Check Prisma schema
  const prismaExists = fs.existsSync('prisma/schema.prisma');
  console.log(`✅ Prisma schema exists: ${prismaExists}`);
  
} catch (error) {
  console.error('❌ Error checking build config:', error.message);
}

// 3. Test local build
console.log('\n🔨 LOCAL BUILD TEST');
console.log('================================');

try {
  console.log('Running local build test...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Local build successful');
} catch (error) {
  console.error('❌ Local build failed:', error.message);
  console.error('Build output:', error.stdout?.toString());
}

// 4. Vercel project info
console.log('\n🚀 VERCEL PROJECT INFO');
console.log('================================');

try {
  // Get project info
  const projectInfo = execSync('npx vercel project ls', { encoding: 'utf8' });
  console.log('Projects:', projectInfo);
  
  // Get current deployment info
  const deployments = execSync('npx vercel ls --limit 5', { encoding: 'utf8' });
  console.log('Recent deployments:', deployments);
  
} catch (error) {
  console.error('❌ Error getting Vercel info:', error.message);
  console.log('💡 You may need to login: npx vercel login');
}

// 5. Generate debugging commands
console.log('\n🛠️ DEBUGGING COMMANDS');
console.log('================================');

console.log(`
📋 MANUAL DEBUGGING STEPS:

1. CHECK VERCEL LOGS (Real-time):
   npx vercel logs --follow

2. CHECK SPECIFIC DEPLOYMENT:
   npx vercel logs [deployment-url]

3. CHECK BUILD LOGS:
   npx vercel logs --limit 100 | grep -i error

4. CHECK ENVIRONMENT VARIABLES:
   npx vercel env ls

5. FORCE REDEPLOY:
   npx vercel --prod --force

6. CHECK FUNCTIONS:
   npx vercel logs --limit 50 | grep -i "api/"

7. DEBUG SPECIFIC API ROUTE:
   curl -v https://your-app.vercel.app/api/health

🔧 COMMON FIXES:

1. Environment Variables Mismatch:
   - Compare: npx vercel env ls
   - Update: npx vercel env add [NAME]

2. Build Issues:
   - Check: npx vercel logs | grep -i "build"
   - Fix: Update build command in vercel.json

3. Database Connection:
   - Test: Add /api/health endpoint
   - Check: DATABASE_URL format

4. Serverless Function Timeout:
   - Check: Function execution time
   - Fix: Add maxDuration in vercel.json
`);

console.log('\n✅ Debugging script complete!'); 