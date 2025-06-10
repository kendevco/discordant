#!/usr/bin/env tsx

/**
 * Script to set a user as HOST role in the internal system
 * Run with: npx tsx scripts/set-host-role.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔑 Setting up HOST role for current user...\n');

  try {
    // Get the first profile (assuming it's the main user)
    const profiles = await prisma.profile.findMany({
      take: 1,
      orderBy: { createdAt: 'asc' }
    });

    if (profiles.length === 0) {
      console.log('❌ No profiles found. Create a profile first by signing in.');
      return;
    }

    const profile = profiles[0];
    console.log(`👤 Found profile: ${profile.name} (${profile.email})`);

    // Update the profile to HOST role
    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: { role: 'HOST' }
    });

    console.log(`✅ Successfully set ${updatedProfile.name} as HOST user`);
    console.log(`📧 Email: ${updatedProfile.email}`);
    console.log(`🆔 Profile ID: ${updatedProfile.id}`);
    console.log(`👑 Role: ${updatedProfile.role}`);

    console.log('\n🎉 You now have HOST privileges!');
    console.log('📝 You can:');
    console.log('  - Access Host Settings (/host/settings)');
    console.log('  - Manage Environment Config (/host/environment)');
    console.log('  - Access Admin Panel (/admin/external-integrations)');
    console.log('  - Create API tokens for VAPI integration');
    console.log('  - Manage all user roles');

  } catch (error) {
    console.error('\n❌ Error setting HOST role:', error);
    
    // Check if it's a column doesn't exist error
    if (error instanceof Error && error.message.includes('Unknown column')) {
      console.log('\n💡 The role column might not exist yet.');
      console.log('📝 Run this command to add it:');
      console.log('   npx prisma db push');
      console.log('   Then run this script again.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
}); 