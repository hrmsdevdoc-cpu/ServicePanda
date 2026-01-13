// Check real activities and notifications
async function checkRealActivities() {
  try {
    console.log('🔍 Checking REAL activities and notifications...');
    
    // Check activities endpoint with different provider IDs
    for (let providerId = 1; providerId <= 3; providerId++) {
      console.log(`\n👤 Checking Provider ${providerId}:`);
      
      const activitiesResponse = await fetch('https://api.servicepanda.com.au/api/provider/activity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-provider-id': providerId.toString(),
        }
      });

      if (activitiesResponse.ok) {
        const activities = await activitiesResponse.json();
        console.log(`📊 Total activities: ${activities.length}`);
        
        // Check today's activities
        const today = new Date().toISOString().split('T')[0];
        const todayActivities = activities.filter(activity => 
          activity.timestamp && activity.timestamp.startsWith(today)
        );
        console.log(`📅 Today's activities: ${todayActivities.length}`);
        
        // Check activity types
        const activityTypes = {};
        activities.forEach(activity => {
          activityTypes[activity.activityType] = (activityTypes[activity.activityType] || 0) + 1;
        });
        
        console.log('📋 Activity types:');
        Object.entries(activityTypes).forEach(([type, count]) => {
          console.log(`  ${type}: ${count}`);
        });
        
        // Show recent activities (last 5)
        console.log('🕐 Most recent activities:');
        activities.slice(0, 5).forEach((activity, index) => {
          const timestamp = activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'No timestamp';
          console.log(`  ${index + 1}. [${timestamp}] ${activity.activityType} - ${activity.message || activity.description || 'No message'}`);
        });
        
      } else {
        console.log(`❌ Failed to fetch activities for provider ${providerId}: ${activitiesResponse.status}`);
      }
    }

    // Check server notifications
    console.log('\n🔔 Checking server notifications:');
    const notificationsResponse = await fetch('https://api.servicepanda.com.au/api/provider/notifications/poll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-provider-id': '1',
      }
    });

    if (notificationsResponse.ok) {
      const notificationData = await notificationsResponse.json();
      console.log(`📡 Server notifications: ${notificationData.notifications?.length || 0}`);
      if (notificationData.notifications?.length > 0) {
        notificationData.notifications.slice(0, 3).forEach((notif, index) => {
          console.log(`  ${index + 1}. ${notif.title} - ${notif.message}`);
        });
      }
    } else {
      console.log('📡 Server notifications not available');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRealActivities();

