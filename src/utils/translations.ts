export type Language = 'en' | 'si' | 'ta';

export interface Translations {
  [key: string]: {
    en: string;
    si: string;
    ta: string;
  };
}

export const translations: Translations = {
  // App Title
  appName: {
    en: 'Sri Maps',
    si: 'ශ්‍රී මැප්ස්',
    ta: 'ஸ்ரீ மேப்ஸ்'
  },

  // Role Selection
  welcomeToSriMaps: {
    en: 'Welcome to Sri Maps',
    si: 'ශ්‍රී මැප්ස් වෙත සාදරයෙන් පිළිගනිමු',
    ta: 'ஸ்ரீ மேப்ஸ் க்கு வரவேற்கிறோம்'
  },
  selectYourRole: {
    en: 'Please select your role to continue',
    si: 'ඉදිරියට යාමට ඔබේ භූමිකාව තෝරන්න',
    ta: 'தொடர உங்கள் பங்கை தேர்ந்தெடுக்கவும்'
  },
  passenger: {
    en: 'Passenger',
    si: 'මගී',
    ta: 'பயணி'
  },
  passengerDescription: {
    en: 'Track buses, view schedules, and access all features',
    si: 'බස් ලුහුබඳින්න, කාලසටහන් බලන්න සහ සියලුම විශේෂාංග වෙත ප්‍රවේශ වන්න',
    ta: 'பேருந்துகளை கண்காணிக்கவும், அட்டவணைகளை பார்க்கவும், அனைத்து அம்சங்களையும் அணுகவும்'
  },
  driver: {
    en: 'Driver',
    si: 'රියදුරු',
    ta: 'ஓட்டுநர்'
  },
  driverDescription: {
    en: 'Share your location and manage your bus route',
    si: 'ඔබේ ස්ථානය බෙදාගෙන ඔබේ බස් මාර්ගය කළමනාකරණය කරන්න',
    ta: 'உங்கள் இருப்பிடத்தை பகிர்ந்து உங்கள் பேருந்து வழித்தடத்தை நிர்வகிக்கவும்'
  },

  // Driver Login
  driverLogin: {
    en: 'Driver Login',
    si: 'රියදුරු පිවිසුම',
    ta: 'ஓட்டுநர் உள்நுழைவு'
  },
  enterYourCredentials: {
    en: 'Enter your credentials to access the driver dashboard',
    si: 'රියදුරු උපකරණ පුවරුවට ප්‍රවේශ වීමට ඔබේ අක්තපත්‍ර ඇතුළත් කරන්න',
    ta: 'ஓட்டுநர் டாஷ்போர்டை அணுக உங்கள் நற்சான்றிதழ்களை உள்ளிடவும்'
  },
  password: {
    en: 'Password',
    si: 'මුරපදය',
    ta: 'கடவுச்சொல்'
  },
  login: {
    en: 'Login',
    si: 'පිවිසෙන්න',
    ta: 'உள்நுழைய'
  },
  back: {
    en: 'Back',
    si: 'ආපසු',
    ta: 'பின்'
  },
  invalidCredentials: {
    en: 'Invalid bus number or password',
    si: 'වලංගු නොවන බස් අංකය හෝ මුරපදය',
    ta: 'தவறான பேருந்து எண் அல்லது கடவுச்சொல்'
  },
  demoCredentials: {
    en: 'Demo credentials:',
    si: 'ආදර්ශන අක්තපත්‍ර:',
    ta: 'டெமோ நற்சான்றிதழ்கள்:'
  },

  // Driver Dashboard
  driverDashboard: {
    en: 'Driver Dashboard',
    si: 'රියදුරු උපකරණ පුවරුව',
    ta: 'ஓட்டுநர் டாஷ்போர்டு'
  },
  logout: {
    en: 'Logout',
    si: 'පිටවන්න',
    ta: 'வெளியேறு'
  },
  locationSharing: {
    en: 'Location Sharing',
    si: 'ස්ථාන බෙදාගැනීම',
    ta: 'இருப்பிட பகிர்வு'
  },
  sharingActive: {
    en: 'Your location is being shared with passengers',
    si: 'ඔබේ ස්ථානය මගීන් සමඟ බෙදාගනිමින් පවතී',
    ta: 'உங்கள் இருப்பிடம் பயணிகளுடன் பகிரப்படுகிறது'
  },
  sharingInactive: {
    en: 'Location sharing is currently off',
    si: 'ස්ථාන බෙදාගැනීම දැනට අක්‍රියයි',
    ta: 'இருப்பிட பகிர்வு தற்போது முடக்கப்பட்டுள்ளது'
  },
  startSharing: {
    en: 'Start Sharing',
    si: 'බෙදාගැනීම ආරම්භ කරන්න',
    ta: 'பகிர்வதைத் தொடங்கு'
  },
  stopSharing: {
    en: 'Stop Sharing',
    si: 'බෙදාගැනීම නවත්වන්න',
    ta: 'பகிர்வதை நிறுத்து'
  },

  // Quick Access
  quickAccess: {
    en: 'Quick Access',
    si: 'ඉක්මන් ප්‍රවේශය',
    ta: 'விரைவு அணுகல்'
  },
  quickAccessNote: {
    en: 'Click on bus 138 to view its location (other buses coming soon)',
    si: 'එහි ස්ථානය බැලීමට 138 බස් මත ක්ලික් කරන්න (අනෙකුත් බස් ඉක්මනින්)',
    ta: 'அதன் இருப்பிடத்தைப் பார்க்க பேருந்து 138 ஐ கிளிக் செய்யவும் (மற்ற பேருந்துகள் விரைவில்)'
  },

  // Navigation
  liveTracking: {
    en: 'Live Tracking',
    si: 'සජීවී ලුහුබැඳීම',
    ta: 'நேரடி கண்காணிப்பு'
  },
  busNews: {
    en: 'Bus News',
    si: 'බස් පුවත්',
    ta: 'பேருந்து செய்திகள்'
  },
  alerts: {
    en: 'Alerts',
    si: 'ඇඟවීම්',
    ta: 'எச்சரிக்கைகள்'
  },
  schedule: {
    en: 'Schedule',
    si: 'කාලසටහන',
    ta: 'அட்டவணை'
  },
  lostAndFound: {
    en: 'Lost & Found',
    si: 'නැතිවූ සහ හමුවූ',
    ta: 'தொலைந்தது & கண்டுபிடிப்பு'
  },

  // Live Tracking
  searchBus: {
    en: 'Search by bus number or route',
    si: 'බස් අංකය හෝ මාර්ගය අනුව සොයන්න',
    ta: 'பேருந்து எண் அல்லது வழித்தடம் மூலம் தேடுங்கள்'
  },
  busNumber: {
    en: 'Bus Number',
    si: 'බස් අංකය',
    ta: 'பேருந்து எண்'
  },
  startDestination: {
    en: 'Start Destination',
    si: 'ආරම්භක ගමනාන්තය',
    ta: 'தொடக்க இலக்கு'
  },
  endDestination: {
    en: 'End Destination',
    si: 'අවසාන ගමනාන්තය',
    ta: 'இறுதி இலக்கு'
  },
  searchButton: {
    en: 'Search',
    si: 'සොයන්න',
    ta: 'தேடு'
  },
  currentLocation: {
    en: 'Current Location',
    si: 'වත්මන් ස්ථානය',
    ta: 'தற்போதைய இடம்'
  },
  route: {
    en: 'Route',
    si: 'මාර්ගය',
    ta: 'வழித்தடம்'
  },
  status: {
    en: 'Status',
    si: 'තත්ත්වය',
    ta: 'நிலை'
  },
  onTime: {
    en: 'On Time',
    si: 'නියමිත වේලාවට',
    ta: 'சரியான நேரத்தில்'
  },
  delayed: {
    en: 'Delayed',
    si: 'ප්‍රමාදයි',
    ta: 'தாமதம்'
  },

  // Bus News
  newsTitle: {
    en: 'Latest Bus News',
    si: 'නවතම බස් පුවත්',
    ta: 'சமீபத்திய பேருந்து செய்திகள்'
  },
  createNews: {
    en: 'Create News',
    si: 'පුවත් නිර්මාණය කරන්න',
    ta: 'செய்தி உருவாக்கு'
  },
  newsHeading: {
    en: 'News Title',
    si: 'පුවත් ශීර්ෂය',
    ta: 'செய்தி தலைப்பு'
  },
  description: {
    en: 'Description',
    si: 'විස්තරය',
    ta: 'விளக்கம்'
  },
  routeNumber: {
    en: 'Route Number',
    si: 'මාර්ග අංකය',
    ta: 'வழித்தட எண்'
  },
  submit: {
    en: 'Submit',
    si: 'ඉදිරිපත් කරන්න',
    ta: 'சமர்ப்பிக்கவும்'
  },
  cancel: {
    en: 'Cancel',
    si: 'අවලංගු කරන්න',
    ta: 'ரத்து செய்'
  },

  // Alerts
  realTimeAlerts: {
    en: 'Real-Time Alerts',
    si: 'තත්‍ය කාලීන ඇඟවීම්',
    ta: 'நேரடி எச்சரிக்கைகள்'
  },
  busApproaching: {
    en: 'Bus Approaching',
    si: 'බස් රථය ළඟා වෙමින්',
    ta: 'பேருந்து நெருங்குகிறது'
  },
  busDelayed: {
    en: 'Bus Delayed',
    si: 'බස් රථය ප්‍රමාදයි',
    ta: 'பேருந்து தாமதம்'
  },

  // Schedule
  busSchedule: {
    en: 'Bus Schedule',
    si: 'බස් කාලසටහන',
    ta: 'பேருந்து அட்டவணை'
  },
  departureTime: {
    en: 'Departure Time',
    si: 'පිටත්වීමේ වේලාව',
    ta: 'புறப்படும் நேரம்'
  },
  destination: {
    en: 'Destination',
    si: 'ගමනාන්තය',
    ta: 'இலக்கு'
  },

  // Lost & Found
  lostItems: {
    en: 'Lost Items',
    si: 'නැතිවූ භාණ්ඩ',
    ta: 'தொலைந்த பொருட்கள்'
  },
  foundItems: {
    en: 'Found Items',
    si: 'හමුවූ භාණ්ඩ',
    ta: 'கண்டுபிடிக்கப்பட்ட பொருட்கள்'
  },
  submitItem: {
    en: 'Submit Item',
    si: 'භාණ්ඩය ඉදිරිපත් කරන්න',
    ta: 'பொருளை சமர்ப்பிக்கவும்'
  },
  itemType: {
    en: 'Item Type',
    si: 'භාණ්ඩ වර්ගය',
    ta: 'பொருள் வகை'
  },
  lost: {
    en: 'Lost',
    si: 'නැතිවූ',
    ta: 'தொலைந்தது'
  },
  found: {
    en: 'Found',
    si: 'හමුවූ',
    ta: 'கண்டுபிடிக்கப்பட்டது'
  },
  itemName: {
    en: 'Item Name',
    si: 'භාණ්ඩ නම',
    ta: 'பொருளின் பெயர்'
  },
  contactInfo: {
    en: 'Contact Info',
    si: 'සම්බන්ධතා තොරතුරු',
    ta: 'தொடர்பு தகவல்'
  },
  iFoundThis: {
    en: 'I Found This',
    si: 'මම මේක හොයාගත්තා',
    ta: 'நான் இதைக் கண்டேன்'
  },
  claimItem: {
    en: 'Claim Item',
    si: 'භාණ්ඩය ඉල්ලන්න',
    ta: 'பொருளை கோருங்கள்'
  },

  // Common
  date: {
    en: 'Date',
    si: 'දිනය',
    ta: 'தேதி'
  },
  time: {
    en: 'Time',
    si: 'වේලාව',
    ta: 'நேரம்'
  },
  close: {
    en: 'Close',
    si: 'වසන්න',
    ta: 'மூடு'
  },
  loading: {
    en: 'Loading...',
    si: 'පූරණය වෙමින්...',
    ta: 'ஏற்றுகிறது...'
  },
  noResults: {
    en: 'No results found',
    si: 'ප්‍රතිඵල හමු නොවීය',
    ta: 'முடிவுகள் எதுவும் இல்லை'
  }
};

export function translate(key: string, language: Language): string {
  return translations[key]?.[language] || key;
}