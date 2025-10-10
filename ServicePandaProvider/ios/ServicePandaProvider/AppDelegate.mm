#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <UIKit/UIKit.h>
#import <OneSignalFramework/OneSignalFramework.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"ServicePandaProvider"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Initialize OneSignal with basic setup
  [OneSignal initialize:@"a3f5070d-9c46-44cd-8b0a-259df155ae94" withLaunchOptions:launchOptions];
  
  // Request notification permission
  [OneSignal.Notifications requestPermission:^(BOOL accepted) {
    NSLog(@"User accepted notifications: %d", accepted);
  }];
  
  NSLog(@"OneSignal initialized with App ID: a3f5070d-9c46-44cd-8b0a-259df155ae94");
  
  return YES;
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


#pragma mark - Background App Refresh

- (void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"📱 Background fetch triggered");
  
  // Perform background tasks here
  // For example, check for new leads, update data, etc.
  
  // Call completion handler
  completionHandler(UIBackgroundFetchResultNewData);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"📱 Remote notification received in background: %@", userInfo);
  
  // Handle background notification
  // Process the notification data
  
  completionHandler(UIBackgroundFetchResultNewData);
}

#pragma mark - OneSignal Notification Handlers

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"📱 Device token received: %@", deviceToken);
  // OneSignal will automatically handle the device token
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"❌ Failed to register for remote notifications: %@", error.localizedDescription);
}

@end
