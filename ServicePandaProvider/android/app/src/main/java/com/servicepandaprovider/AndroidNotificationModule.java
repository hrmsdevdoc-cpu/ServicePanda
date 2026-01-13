package com.servicepandaprovider;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

public class AndroidNotificationModule extends ReactContextBaseJavaModule {
    private static final String CHANNEL_ID = "servicepanda_notifications";
    private static final String CHANNEL_NAME = "ServicePanda Provider";
    private static final String CHANNEL_DESCRIPTION = "Customer requests and payments";
    
    private ReactApplicationContext reactContext;
    private NotificationManagerCompat notificationManager;

    public AndroidNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.notificationManager = NotificationManagerCompat.from(reactContext);
        createNotificationChannel();
    }

    @Override
    public String getName() {
        return "AndroidNotificationModule";
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription(CHANNEL_DESCRIPTION);
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 250, 100, 250});
            
            NotificationManager manager = reactContext.getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    @ReactMethod
    public void showNotification(ReadableMap notificationData, Promise promise) {
        try {
            String title = notificationData.hasKey("title") ? notificationData.getString("title") : "ServicePanda Provider";
            String message = notificationData.hasKey("message") ? notificationData.getString("message") : "New notification";
            String type = notificationData.hasKey("type") ? notificationData.getString("type") : "general";
            
            // Create notification
            NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification) // You need to add this icon
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setVibrate(new long[]{0, 250, 100, 250})
                .setColor(getNotificationColor(type));

            // Show notification
            int notificationId = (int) System.currentTimeMillis();
            notificationManager.notify(notificationId, builder.build());
            
            promise.resolve("Notification sent to Android notification bar successfully");
            
        } catch (Exception e) {
            promise.reject("NOTIFICATION_ERROR", "Failed to show notification: " + e.getMessage());
        }
    }

    private int getNotificationColor(String type) {
        switch (type) {
            case "lead":
                return 0xFFFF6B35; // Orange
            case "payment":
                return 0xFF00C853; // Green
            case "system":
                return 0xFF2196F3; // Blue
            default:
                return 0xFFFF9800; // Default orange
        }
    }
}
