#!/usr/bin/env tsx

/**
 * Migration script for External Integration System
 * 
 * This script safely migrates the database to support:
 * - API tokens for external authentication
 * - Agent profiles for bot management
 * - External message tracking
 * - Visitor session management
 * 
 * Run with: npx tsx scripts/migrate-external-integrations.ts
 */

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting External Integration Migration...\n');

  try {
    // Check if migration is needed
    console.log('📋 Checking current database schema...');
    
    // Test if new tables exist
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM api_token LIMIT 1`;
      console.log('✅ External integration tables already exist!');
      console.log('ℹ️  Migration may have already been run.');
      
      const continueAnyway = process.argv.includes('--force');
      if (!continueAnyway) {
        console.log('💡 Use --force flag to run anyway.\n');
        return;
      }
    } catch (error) {
      console.log('📝 New tables needed - proceeding with migration...\n');
    }

    // Step 1: Push schema changes
    console.log('🔄 Step 1: Applying database schema changes...');
    console.log('📝 Run this command manually: npx prisma db push');
    console.log('⚠️  This will create the new tables for external integrations.\n');

    // Wait for user confirmation
    if (!process.argv.includes('--auto')) {
      console.log('🛑 Please run `npx prisma db push` and then press Enter to continue...');
      await new Promise(resolve => {
        process.stdin.once('data', () => resolve(true));
      });
    }

    // Step 2: Verify tables exist
    console.log('🔍 Step 2: Verifying new tables...');
    
    const requiredTables = [
      'api_token',
      'agent_profile', 
      'external_message',
      'visitor_session'
    ];

    for (const table of requiredTables) {
      try {
        await prisma.$queryRaw`SELECT COUNT(*) FROM ${table} LIMIT 1`;
        console.log(`✅ Table '${table}' exists`);
      } catch (error) {
        throw new Error(`❌ Table '${table}' not found. Please run 'npx prisma db push' first.`);
      }
    }

    // Step 3: Create default integrations for existing servers
    console.log('\n🏗️  Step 3: Setting up default integrations...');
    
    // Get all existing servers
    const servers = await prisma.server.findMany({
      include: {
        profile: true,
        channels: true
      }
    });

    console.log(`📊 Found ${servers.length} existing servers`);

    for (const server of servers) {
      console.log(`\n🔧 Setting up integrations for server: ${server.name}`);
      
      // Create a default API token for each server
      const defaultToken = await prisma.apiToken.create({
        data: {
          id: randomUUID(),
          name: `${server.name} - Default Integration Token`,
          token: generateApiToken(),
          type: 'SERVICE_ACCOUNT',
          profileId: server.profileId,
          serverId: server.id,
          permissions: JSON.stringify({
            canSendMessages: true,
            canCreateAgents: true,
            canManageIntegrations: true
          }),
          rateLimit: 100,
          rateLimitWindow: 3600,
          isActive: true
        }
      });

      console.log(`✅ Created default API token: ${defaultToken.name}`);

      // Create a default AI assistant agent
      const aiAssistant = await prisma.agentProfile.create({
        data: {
          id: randomUUID(),
          profileId: server.profileId,
          apiTokenId: defaultToken.id,
          agentType: 'AI_ASSISTANT',
          displayName: `${server.name} AI Assistant`,
          description: 'Default AI assistant for external integrations',
          canImpersonate: false,
          canCreateUsers: false,
          systemBot: true,
          isOnline: true,
          messageCount: 0
        }
      });

      console.log(`🤖 Created AI assistant agent: ${aiAssistant.displayName}`);

      // Find or create a portfolio-inquiries channel
      let portfolioChannel = server.channels.find(c => 
        c.name.toLowerCase().includes('portfolio') || 
        c.name.toLowerCase().includes('inquir') ||
        c.name.toLowerCase().includes('contact')
      );

      if (!portfolioChannel) {
        portfolioChannel = await prisma.channel.create({
          data: {
            id: randomUUID(),
            name: 'portfolio-inquiries',
            type: 'TEXT',
            profileId: server.profileId,
            serverId: server.id,
            workflowEnabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log(`📝 Created portfolio-inquiries channel`);
      } else {
        console.log(`📝 Using existing channel: ${portfolioChannel.name}`);
      }

      // Update token to include the portfolio channel
      await prisma.apiToken.update({
        where: { id: defaultToken.id },
        data: {
          channelIds: JSON.stringify([portfolioChannel.id])
        }
      });

      console.log(`🔗 Linked token to channel: ${portfolioChannel.name}`);
    }

    // Step 4: Create example visitor session
    console.log('\n👥 Step 4: Creating example data...');
    
    const exampleSession = await prisma.visitorSession.create({
      data: {
        id: randomUUID(),
        sessionId: 'session_example_' + Date.now(),
        name: 'Example Visitor',
        email: 'visitor@example.com',
        origin: 'https://example-portfolio.com',
        pageViews: 3,
        messagesCount: 1,
        isActive: false,
        customData: JSON.stringify({
          source: 'migration-example',
          userAgent: 'Migration Script',
          referrer: 'Direct'
        })
      }
    });

    console.log(`👤 Created example visitor session: ${exampleSession.sessionId}`);

    // Step 5: Output integration information
    console.log('\n📋 Step 5: Integration Summary');
    console.log('═'.repeat(50));

    const tokenCount = await prisma.apiToken.count();
    const agentCount = await prisma.agentProfile.count();
    const sessionCount = await prisma.visitorSession.count();

    console.log(`🔑 API Tokens: ${tokenCount}`);
    console.log(`🤖 Agent Profiles: ${agentCount}`);
    console.log(`👥 Visitor Sessions: ${sessionCount}`);

    // Display first token for testing
    const firstToken = await prisma.apiToken.findFirst({
      include: {
        profile: true,
        server: true
      }
    });

    if (firstToken) {
      console.log('\n🧪 Test Token (for development):');
      console.log(`Name: ${firstToken.name}`);
      console.log(`Token: ${firstToken.token}`);
      console.log(`Server: ${firstToken.server?.name || 'Global'}`);
      console.log(`Owner: ${firstToken.profile.name}`);
      
      console.log('\n📝 Example API call:');
      console.log(`curl -X POST "${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/external/messages" \\`);
      console.log(`  -H "Authorization: Bearer ${firstToken.token}" \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -d '{`);
      console.log(`    "channelId": "${firstToken.channelIds ? JSON.parse(firstToken.channelIds)[0] : 'your-channel-id'}",`);
      console.log(`    "content": "Hello from external integration!",`);
      console.log(`    "sourceType": "test-migration"`);
      console.log(`  }'`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('1. Test the API endpoints with the provided token');
    console.log('2. Set up your portfolio integration using the documentation');
    console.log('3. Configure n8n workflows for AI responses');
    console.log('4. Deploy the chat widget to your portfolio site');
    console.log('\n📖 Full documentation: docs/external-integration-guide.md');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function generateApiToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const prefix = 'disc_';
  let token = prefix;
  
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}

// Check if script is run directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🎉 External Integration System is ready!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
} 