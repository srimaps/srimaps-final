export interface Bus {
  id: string;
  number: string;
  route: string;
  startDestination: string;
  endDestination: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'on-time' | 'delayed';
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  route: string;
  date: string;
  time: string;
}

export interface Alert {
  id: string;
  route: string;
  description: string;
  severity: 'warning' | 'danger';
  date: string;
  time: string;
}

export interface ScheduleItem {
  id: string;
  route: string;
  startDestination: string;
  endDestination: string;
  departureTime: string;
}

export interface LostFoundItem {
  id: string;
  itemName: string;
  description: string;
  contact: string;
  route: string;
  date: string;
  time: string;
}

// Mock buses (Colombo, Sri Lanka area)
export const mockBuses: Bus[] = [
{
  id: '1',
  number: '138',
  route: 'Colombo - Malabe',
  startDestination: 'Colombo Fort',
  endDestination: 'Malabe',
  currentLocation: { lat: 6.9271, lng: 79.8612 },
  status: 'on-time'
},
{
  id: '2',
  number: '177',
  route: 'Colombo - Kaduwela',
  startDestination: 'Colombo Fort',
  endDestination: 'Kaduwela',
  currentLocation: { lat: 6.9344, lng: 79.985 },
  status: 'on-time'
},
{
  id: '3',
  number: '120',
  route: 'Colombo - Piliyandala',
  startDestination: 'Colombo Fort',
  endDestination: 'Piliyandala',
  currentLocation: { lat: 6.8013, lng: 79.922 },
  status: 'delayed'
},
{
  id: '4',
  number: '155',
  route: 'Colombo - Nugegoda',
  startDestination: 'Colombo Fort',
  endDestination: 'Nugegoda',
  currentLocation: { lat: 6.8649, lng: 79.8997 },
  status: 'on-time'
}];


export const mockNews: NewsItem[] = [
{
  id: '1',
  title: 'New Express Service on Route 138',
  description:
  'Starting from Monday, Route 138 will have express services during peak hours with limited stops for faster travel.',
  route: '138',
  date: '2024-01-15',
  time: '09:30 AM'
},
{
  id: '2',
  title: 'Route 177 Schedule Update',
  description:
  'Due to road construction near Battaramulla, Route 177 will experience slight delays. Additional buses deployed.',
  route: '177',
  date: '2024-01-14',
  time: '02:15 PM'
},
{
  id: '3',
  title: 'Weekend Service Changes',
  description:
  'All routes will operate on reduced frequency this weekend due to maintenance work. Please plan accordingly.',
  route: 'All Routes',
  date: '2024-01-13',
  time: '11:00 AM'
}];


export const mockAlerts: Alert[] = [
{
  id: '1',
  route: '138',
  description: 'Bus approaching Malabe Junction in 5 minutes',
  severity: 'warning',
  date: '2024-01-15',
  time: '10:45 AM'
},
{
  id: '2',
  route: '120',
  description: 'Route 120 delayed by 15 minutes due to heavy traffic',
  severity: 'danger',
  date: '2024-01-15',
  time: '10:30 AM'
},
{
  id: '3',
  route: '177',
  description: 'Bus arriving at Kaduwela terminal in 3 minutes',
  severity: 'warning',
  date: '2024-01-15',
  time: '10:20 AM'
}];


export const mockSchedules: ScheduleItem[] = [
{
  id: '1',
  route: '138',
  startDestination: 'Colombo Fort',
  endDestination: 'Malabe',
  departureTime: '06:00 AM'
},
{
  id: '2',
  route: '138',
  startDestination: 'Colombo Fort',
  endDestination: 'Malabe',
  departureTime: '07:30 AM'
},
{
  id: '3',
  route: '138',
  startDestination: 'Colombo Fort',
  endDestination: 'Malabe',
  departureTime: '09:00 AM'
},
{
  id: '4',
  route: '177',
  startDestination: 'Colombo Fort',
  endDestination: 'Kaduwela',
  departureTime: '06:30 AM'
},
{
  id: '5',
  route: '177',
  startDestination: 'Colombo Fort',
  endDestination: 'Kaduwela',
  departureTime: '08:00 AM'
},
{
  id: '6',
  route: '120',
  startDestination: 'Colombo Fort',
  endDestination: 'Piliyandala',
  departureTime: '07:00 AM'
}];


export const mockLostItems: LostFoundItem[] = [
{
  id: '1',
  itemName: 'Black Backpack',
  description: 'Black backpack with laptop inside, has a red keychain',
  contact: '+94 77 123 4567',
  route: '138',
  date: '2024-01-14',
  time: '03:30 PM'
},
{
  id: '2',
  itemName: 'Mobile Phone',
  description: 'Samsung Galaxy S21, blue color with cracked screen',
  contact: '+94 71 987 6543',
  route: '177',
  date: '2024-01-13',
  time: '11:15 AM'
}];


export const mockFoundItems: LostFoundItem[] = [
{
  id: '1',
  itemName: 'Wallet',
  description: 'Brown leather wallet with ID cards inside',
  contact: '+94 76 555 1234',
  route: '120',
  date: '2024-01-15',
  time: '09:00 AM'
},
{
  id: '2',
  itemName: 'Umbrella',
  description: 'Blue folding umbrella, slightly damaged',
  contact: '+94 75 444 9876',
  route: '138',
  date: '2024-01-14',
  time: '05:45 PM'
}];