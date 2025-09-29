/**
 * DEBUG: OneSignal Users Check
 * Dekhtey hain actually koi subscribed user hai ya nahi
 */

console.log('🔍 OneSignal Users Debug kar rahe hain...');
console.log('');

async function checkOneSignalUsers() {
  const ONESIGNAL_APP_ID = 'a3f5070d-9c46-44cd-8b0a-259df155ae94';
  const ONESIGNAL_REST_API_KEY = 'os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy';

  try {
    console.log('1. Checking OneSignal app details...');
    
    const appResponse = await fetch(`https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}`, {
      headers: {
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      }
    });

    if (appResponse.ok) {
      const appData = await appResponse.json();
      console.log('✅ App Details:');
      console.log(`   - Name: ${appData.name}`);
      console.log(`   - Players: ${appData.players}`);
      console.log(`   - Messageable Players: ${appData.messageable_players}`);
      console.log(`   - Updated At: ${appData.updated_at}`);
      
      if (appData.players === 0 || appData.messageable_players === 0) {
        console.log('❌ NO ACTIVE USERS FOUND!');
        console.log('💡 Koi device properly subscribe nahi kiya hai');
        return false;
      }
    } else {
      console.log('❌ App check failed');
      return false;
    }

    console.log('');
    console.log('2. Checking all players...');
    
    const playersResponse = await fetch(`https://onesignal.com/api/v1/players?app_id=${ONESIGNAL_APP_ID}&limit=300`, {
      headers: {
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      }
    });

    if (playersResponse.ok) {
      const playersData = await playersResponse.json();
      console.log(`📊 Total Players Found: ${playersData.players?.length || 0}`);
      
      if (playersData.players && playersData.players.length > 0) {
        playersData.players.forEach((player, index) => {
          console.log(`\n👤 Player ${index + 1}:`);
          console.log(`   - ID: ${player.id}`);
          console.log(`   - Valid Subscriber: ${player.valid_subscriber}`);
          console.log(`   - Session Count: ${player.session_count}`);
          console.log(`   - Device Type: ${player.device_type}`);
          console.log(`   - Last Active: ${player.last_active}`);
          console.log(`   - Created At: ${player.created_at}`);
        });
        
        const activeUsers = playersData.players.filter(p => p.valid_subscriber);
        console.log(`\n📊 Active Subscribers: ${activeUsers.length}`);
        
        if (activeUsers.length === 0) {
          console.log('❌ NO ACTIVE SUBSCRIBERS!');
          console.log('💡 Sarey players invalid hain');
          return false;
        }
        
        return true;
      } else {
        console.log('❌ No players found at all!');
        return false;
      }
    } else {
      console.log('❌ Players check failed');
      return false;
    }

  } catch (error) {
    console.log('💥 Error in OneSignal check:', error.message);
    return false;
  }
}

async function sendTestToActiveUsers() {
  console.log('\n3. Testing direct notification to active users...');
  
  const payload = {
    app_id: 'a3f5070d-9c46-44cd-8b0a-259df155ae94',
    headings: { en: '🔥 DIRECT TEST!' },
    contents: { 
      en: `Debug notification direct bheja hai!\n\nTime: ${new Date().toLocaleTimeString()}\n\nAgar ye aa gaya to system working hai!`
    },
    included_segments: ['Subscribed Users'],
    // Also try targeting all users regardless of subscription
    // include_player_ids: [], // We'll add this if we find any players
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic os_v2_app_6zf7asvroregfj5umk4nspyvtoi4yl4hrd3u7suvnwraxsu43zmjjgzlysqusuxf7gjgfkjzgwpunhz4m3yflqr4fz7kfitlcxxsexy'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test notification sent!');
      console.log('📊 Result:', {
        id: result.id,
        recipients: result.recipients,
        errors: result.errors
      });
    } else {
      console.log('❌ Test notification failed:');
      console.log('📋 Error:', result);
    }
  } catch (error) {
    console.log('💥 Test notification error:', error.message);
  }
}

// Main debug function
async function runFullDebug() {
  console.log('🚀 Starting OneSignal Full Debug...');
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('');
  
  const hasActiveUsers = await checkOneSignalUsers();
  
  if (hasActiveUsers) {
    await sendTestToActiveUsers();
  } else {
    console.log('\n💡 SOLUTION:');
    console.log('   1. Emulator mein koi app OneSignal se subscribe nahi hai');
    console.log('   2. Test karne ke liye koi real device ya proper OneSignal setup chahiye');
    console.log('   3. Ya phir simulator mein proper OneSignal integration karna padega');
  }
  
  console.log('\n🎯 DEBUG COMPLETE!');
}

runFullDebug();
