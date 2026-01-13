# Custom Notification Icon Setup

## 🎨 Create Custom Notification Icon

### Step 1: Create Icon Files
Create these icon files in `ServicePandaProvider/android/app/src/main/res/`:

```
drawable-hdpi/ic_notification.png (24x24dp)
drawable-mdpi/ic_notification.png (24x24dp)  
drawable-xhdpi/ic_notification.png (24x24dp)
drawable-xxhdpi/ic_notification.png (24x24dp)
drawable-xxxhdpi/ic_notification.png (24x24dp)
```

### Step 2: Icon Requirements
- **Size**: 24x24dp (24px, 36px, 48px, 72px, 96px for different densities)
- **Format**: PNG with transparency
- **Style**: White/transparent icon on transparent background
- **Design**: Simple, recognizable icon (e.g., bell, service icon)

### Step 3: Update AndroidManifest.xml
```xml
<meta-data
    android:name="onesignal_notification_icon"
    android:resource="@drawable/ic_notification" />
```

### Step 4: Add Color (Optional)
```xml
<meta-data
    android:name="onesignal_notification_accent_color"
    android:resource="@color/notification_accent" />
```

## 🎯 Current Setup
- Using app launcher icon: `@mipmap/ic_launcher`
- Accent color: `@color/colorAccent`

## 📱 Result
- Notification will show your custom icon
- Icon will be white/transparent on colored background
- Matches your app's branding

