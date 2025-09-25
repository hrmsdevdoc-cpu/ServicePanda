/**
 * Vector Icons Utility for ServicePandaProvider
 * 
 * This file provides a centralized way to import and use vector icons
 * throughout the app, similar to the customer app setup.
 */

// Import all icon families
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

// Export individual icon components for easy use
export const Icon = MaterialIcons;
export const MaterialIcon = MaterialIcons;
export const MaterialCommunityIcon = MaterialCommunityIcons;
export const FontAwesomeIcon = FontAwesome;
export const IonIcon = Ionicons;
export const FeatherIcon = Feather;
export const AntIcon = AntDesign;

// Common icon names used throughout the app
export const IconNames = {
  // Navigation
  home: 'home',
  dashboard: 'dashboard',
  menu: 'menu',
  back: 'arrow-back',
  forward: 'arrow-forward',
  close: 'close',
  
  // Authentication
  login: 'login',
  logout: 'logout',
  user: 'person',
  userAdd: 'person-add',
  lock: 'lock',
  unlock: 'lock-open',
  email: 'email',
  password: 'vpn-key',
  
  // Services & Leads
  service: 'build',
  leads: 'assignment',
  newLead: 'assignment-ind',
  activeLead: 'assignment-turned-in',
  closedLead: 'assignment-return',
  location: 'location-on',
  map: 'map',
  directions: 'directions',
  
  // Business
  business: 'business',
  work: 'work',
  schedule: 'schedule',
  calendar: 'event',
  time: 'access-time',
  clock: 'schedule',
  
  // Communication
  phone: 'phone',
  message: 'message',
  chat: 'chat',
  notification: 'notifications',
  notificationOff: 'notifications-off',
  bell: 'notifications-active',
  
  // Actions
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  cancel: 'cancel',
  check: 'check',
  checkCircle: 'check-circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
  
  // Media
  camera: 'camera-alt',
  photo: 'photo-camera',
  image: 'image',
  upload: 'cloud-upload',
  download: 'cloud-download',
  
  // Settings & Profile
  settings: 'settings',
  profile: 'account-circle',
  editProfile: 'edit',
  changePassword: 'vpn-key',
  help: 'help',
  support: 'support-agent',
  about: 'info',
  
  // Payment & Billing
  payment: 'payment',
  creditCard: 'credit-card',
  money: 'attach-money',
  dollar: 'monetization-on',
  wallet: 'account-balance-wallet',
  
  // Status & Rating
  star: 'star',
  starBorder: 'star-border',
  starHalf: 'star-half',
  rating: 'star-rate',
  thumbsUp: 'thumb-up',
  thumbsDown: 'thumb-down',
  
  // Documents
  document: 'description',
  file: 'insert-drive-file',
  folder: 'folder',
  attachment: 'attach-file',
  
  // Navigation & UI
  search: 'search',
  filter: 'filter-list',
  sort: 'sort',
  refresh: 'refresh',
  more: 'more-vert',
  expand: 'expand-more',
  collapse: 'expand-less',
  
  // Social & Sharing
  share: 'share',
  like: 'favorite',
  unlike: 'favorite-border',
  comment: 'comment',
  
  // Weather & Environment
  sunny: 'wb-sunny',
  cloudy: 'cloud',
  rainy: 'grain',
  
  // Transportation
  car: 'directions-car',
  bike: 'directions-bike',
  walk: 'directions-walk',
  public: 'directions-transit',
  
  // Tools & Equipment
  tool: 'build',
  wrench: 'build',
  hammer: 'handyman',
  screwdriver: 'handyman',
  
  // Safety & Security
  security: 'security',
  shield: 'shield',
  verified: 'verified-user',
  privacy: 'privacy-tip',
} as const;

// Icon size constants
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 48,
} as const;

// Helper function to get icon component by family
export const getIconComponent = (family: 'material' | 'materialCommunity' | 'fontAwesome' | 'ion' | 'feather' | 'ant') => {
  switch (family) {
    case 'material':
      return MaterialIcons;
    case 'materialCommunity':
      return MaterialCommunityIcons;
    case 'fontAwesome':
      return FontAwesome;
    case 'ion':
      return Ionicons;
    case 'feather':
      return Feather;
    case 'ant':
      return AntDesign;
    default:
      return MaterialIcons;
  }
};

// Helper function to create icon with consistent styling
export const createIcon = (
  name: string,
  size: keyof typeof IconSizes = 'md',
  color: string = '#000',
  family: 'material' | 'materialCommunity' | 'fontAwesome' | 'ion' | 'feather' | 'ant' = 'material'
) => {
  const IconComponent = getIconComponent(family);
  return {
    component: IconComponent,
    props: {
      name,
      size: IconSizes[size],
      color,
    },
  };
};

export default {
  Icon,
  MaterialIcon,
  MaterialCommunityIcon,
  FontAwesomeIcon,
  IonIcon,
  FeatherIcon,
  AntIcon,
  IconNames,
  IconSizes,
  getIconComponent,
  createIcon,
};
