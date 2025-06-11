// Channel Manager Node for n8n
// Place this node right after the Enhanced Input Processor
// This node ensures the required channel exists in the System server

const inputData = $input.first().json;

// Discord API configuration
const DISCORD_BOT_TOKEN = $env.DISCORD_BOT_TOKEN; // Set this in n8n environment
const SYSTEM_SERVER_ID = 'a90f1d41-12a9-4586-b9a4-a513d3bd01d9';

async function createChannel(channelName, serverId = SYSTEM_SERVER_ID) {
  try {
    console.log(`Creating channel: ${channelName} in server: ${serverId}`);
    
    const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: channelName,
        type: 0, // Text channel
        topic: `Auto-created channel for ${channelName.replace('sys-', '')} operations`,
        permission_overwrites: [] // Inherit server permissions
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`Discord API error:`, error);
      throw new Error(`Discord API error: ${response.status} - ${error}`);
    }
    
    const channel = await response.json();
    console.log(`Channel created successfully: ${channel.id}`);
    return channel;
    
  } catch (error) {
    console.error('Channel creation error:', error.message);
    throw error;
  }
}

async function findExistingChannel(channelName, serverId = SYSTEM_SERVER_ID) {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, {
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.status}`);
    }
    
    const channels = await response.json();
    const existingChannel = channels.find(ch => ch.name === channelName && ch.type === 0);
    
    if (existingChannel) {
      console.log(`Found existing channel: ${existingChannel.id}`);
      return existingChannel;
    }
    
    return null;
  } catch (error) {
    console.error('Channel lookup error:', error.message);
    return null;
  }
}

// Main channel management logic
async function manageChannel() {
  try {
    // If no channel creation needed, pass through
    if (!inputData.needsChannelCreation) {
      console.log('Using existing channel:', inputData.channelId);
      return {
        ...inputData,
        channelId: inputData.channelId,
        channelCreated: false,
        channelExists: true
      };
    }
    
    const channelName = inputData.channelName;
    console.log(`Managing channel: ${channelName}`);
    
    // First, try to find existing channel
    let channel = await findExistingChannel(channelName);
    let channelCreated = false;
    
    // If not found, create it
    if (!channel) {
      console.log(`Channel ${channelName} not found, creating...`);
      channel = await createChannel(channelName);
      channelCreated = true;
    }
    
    // Return updated data with channel ID
    return {
      ...inputData,
      channelId: channel.id,
      channelCreated: channelCreated,
      channelExists: true,
      channelData: {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        type: channel.type
      }
    };
    
  } catch (error) {
    console.error('Channel management failed:', error.message);
    
    // Fallback to default system channel
    console.log('Falling back to default system channel');
    return {
      ...inputData,
      channelId: inputData.fallbackChannelId,
      channelCreated: false,
      channelExists: true,
      channelError: error.message,
      usingFallback: true
    };
  }
}

// Execute and return result
return manageChannel(); 