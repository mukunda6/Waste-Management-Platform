

import type { Issue, Worker, AppUser } from './types';
import { addHours, subDays, subHours } from 'date-fns';

const now = new Date();

export const mockUsers: (AppUser & { password?: string })[] = [
  {
    uid: 'admin-user-01',
    name: 'Waste Admin',
    nameKey: 'admin_manager',
    email: 'admin@test.com',
    password: 'password',
    role: 'Admin',
    avatarUrl: 'https://picsum.photos/seed/admin/100/100',
  },
   {
    uid: 'worker-user-01',
    name: 'Suresh Kumar',
    nameKey: 'suresh_kumar',
    email: 'worker@test.com',
    password: 'password',
    role: 'Worker',
    avatarUrl: 'https://picsum.photos/seed/Suresh/100/100',
  },
   {
    uid: 'worker-user-02',
    name: 'Priya Sharma',
    nameKey: 'priya_sharma',
    email: 'worker2@test.com',
    password: 'password',
    role: 'Worker',
    avatarUrl: 'https://picsum.photos/seed/Priya/100/100',
  },
  {
    uid: 'buyer-user-01',
    name: 'Recycle Corp.',
    nameKey: 'recycle_corp',
    email: 'buyer@test.com',
    password: 'password',
    role: 'Buyer',
    avatarUrl: 'https://picsum.photos/seed/buyer/100/100',
    mobileNumber: '9876543213',
  },
  {
    uid: 'citizen-user-01',
    name: 'John Citizen',
    nameKey: 'john_citizen',
    email: 'citizen@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/John/100/100',
    mobileNumber: '9876543210',
  },
  {
    uid: 'citizen-user-02',
    name: 'Jane Doe',
    nameKey: 'jane_doe',
    email: 'jane.doe@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Jane/100/100',
    mobileNumber: '9876543211',
    },
    {
    uid: 'citizen-user-03',
    name: 'Peter Jones',
    nameKey: 'peter_jones',
    email: 'peter.jones@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Peter/100/100',
    mobileNumber: '9876543212',
    },
    {
    uid: 'citizen-user-04',
    name: 'Mary Smith',
    nameKey: 'mary_smith',
    email: 'mary.smith@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Mary/100/100',
    },
    {
    uid: 'citizen-user-05',
    name: 'David Williams',
    nameKey: 'david_williams',
    email: 'david.williams@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/David/100/100',
    },
    {
    uid: 'citizen-user-06',
    name: 'Susan Brown',
    nameKey: 'susan_brown',
    email: 'susan.brown@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Susan/100/100',
    },
    {
    uid: 'citizen-user-07',
    name: 'Michael Miller',
    nameKey: 'michael_miller',
    email: 'michael.miller@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Michael/100/100',
    },
    {
    uid: 'citizen-user-08',
    name: 'Karen Wilson',
    nameKey: 'karen_wilson',
    email: 'karen.wilson@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Karen/100/100',
    },
    {
    uid: 'citizen-user-09',
    name: 'James Moore',
    nameKey: 'james_moore',
    email: 'james.moore@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/James/100/100',
    },
    {
    uid: 'citizen-user-10',
    name: 'Patricia Taylor',
    nameKey: 'patricia_taylor',
    email: 'patricia.taylor@test.com',
    password: 'password',
    role: 'Citizen',
    avatarUrl: 'https://picsum.photos/seed/Patricia/100/100',
    },
];


export const mockWorkers: Worker[] = [
  {
    id: 'worker-1',
    name: 'Arjun Gupta',
    nameKey: 'arjun_gupta',
    area: 'Kukatpally',
    avatarUrl: 'https://picsum.photos/seed/Arjun/100/100',
  },
  {
    id: 'worker-2',
    name: 'Anjali Reddy',
    nameKey: 'anjali_reddy',
    area: 'Gachibowli',
    avatarUrl: 'https://picsum.photos/seed/Anjali/100/100',
  },
  {
    id: 'worker-3',
    name: 'Vikram Singh',
    nameKey: 'vikram_singh',
    area: 'Charminar',
    avatarUrl: 'https://picsum.photos/seed/Vikram/100/100',
  },
    {
    id: 'worker-4',
    name: 'Meera Rao',
    nameKey: 'meera_rao',
    area: 'Secunderabad',
    avatarUrl: 'https://picsum.photos/seed/Meera/100/100',
  },
];

const citizens = mockUsers.filter(u => u.role === 'Citizen');
const citizen1 = citizens[1]; 
const citizen2 = citizens[2];
const citizen3 = citizens[3];
const citizen4 = citizens[4];
const citizen5 = citizens[5];
const citizen6 = citizens[6];
const citizen7 = citizens[7];
const citizen8 = citizens[8];
const citizen9 = citizens[9];


export let mockIssues: Issue[] = [
    {
    id: 'default-1',
    title: 'Hazardous chemical barrels dumped',
    description: 'Several barrels leaking some kind of chemical have been illegally dumped near the river.',
    category: 'Hazardous Waste Spillage',
    status: 'Submitted',
    city: 'New York',
    slaStatus: 'On Time',
    isEmergency: true,
    slaDeadline: addHours(now, 24).toISOString(),
    location: { lat: 40.7145, lng: -74.0080 },
    imageUrl: 'https://picsum.photos/seed/chemicalspill/600/400',
    imageHint: 'chemical barrel',
    submittedBy: { name: citizen1.name, nameKey: citizen1.nameKey, uid: citizen1.uid, email: citizen1.email },
    submittedAt: subHours(now, 2).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subHours(now, 2).toISOString(), description: 'Emergency issue reported by citizen. Immediate attention required.' }
    ]
  },
  {
    id: 'default-2',
    title: 'Garbage not collected for 3 days',
    description: 'Our street\'s garbage has not been collected for three days and it is starting to smell.',
    category: 'Garbage Not Collected',
    status: 'Submitted',
    city: 'Los Angeles',
    slaStatus: 'On Time',
    slaDeadline: addHours(now, 48).toISOString(),
    location: { lat: 40.7295, lng: -73.9965 },
    imageUrl: 'https://picsum.photos/seed/garbagemissed/600/400',
    imageHint: 'garbage bags',
    submittedBy: { name: citizen2.name, nameKey: citizen2.nameKey, uid: citizen2.uid, email: citizen2.email },
    submittedAt: subHours(now, 10).toISOString(),
    assignedTo: undefined,
    updates: [
        { status: 'Submitted', updatedAt: subHours(now, 10).toISOString(), description: 'Issue reported by citizen. Awaiting assignment.' }
    ]
  },
  {
    id: '1',
    title: 'Overflowing bin at bus stop',
    description: 'The public trash can at the bus stop on Main St is overflowing with waste.',
    category: 'Overflowing Bins',
    status: 'Resolved',
    city: 'New York',
    slaStatus: 'On Time',
    slaDeadline: addHours(subDays(now, 3), 48).toISOString(),
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    imageHint: 'overflowing bin',
    submittedBy: { name: citizen4.name, nameKey: citizen4.nameKey, uid: citizen4.uid, email: citizen4.email },
    submittedAt: subDays(now, 3).toISOString(),
    assignedTo: 'worker-1',
    updates: [
      { status: 'Submitted', updatedAt: subDays(now, 3).toISOString(), description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: subDays(now, 2).toISOString(), description: 'Work crew assigned. ETA: 2 days.' },
      { status: 'Resolved', updatedAt: subDays(now, 1).toISOString(), description: 'Bin has been cleared.', imageUrl: 'https://picsum.photos/seed/resolved1/600/400', imageHint: 'clean bin' }
    ]
  },
  {
    id: '2',
    title: 'Apartment complex not segregating',
    description: 'The residents of "Green View Apartments" are mixing wet and dry waste in the main disposal area.',
    category: 'Non-segregation of Waste',
    status: 'In Progress',
    city: 'New York',
    slaStatus: 'On Time',
    slaDeadline: addHours(now, 20).toISOString(), // At risk
    location: { lat: 40.7829, lng: -73.9654 },
    imageUrl: 'https://picsum.photos/seed/water1/600/400',
    imageHint: 'mixed garbage',
    submittedBy: { name: citizen5.name, nameKey: citizen5.nameKey, uid: citizen5.uid, email: citizen5.email },
    submittedAt: subHours(now, 28).toISOString(),
    assignedTo: 'worker-2',
    updates: [
      { status: 'Submitted', updatedAt: subHours(now, 28).toISOString(), description: 'Issue reported by citizen.' },
      { status: 'In Progress', updatedAt: subHours(now, 26).toISOString(), description: 'Compliance officer dispatched to inspect and issue a warning.' }
    ]
  },
  {
    id: '3',
    title: 'Illegal construction debris dumped',
    description: 'A large pile of construction debris has been illegally dumped in the empty lot behind our building.',
    category: 'Illegal Dumping',
    status: 'Submitted',
    city: 'Los Angeles',
    slaStatus: 'On Time',
    slaDeadline: addHours(now, 40).toISOString(),
    location: { lat: 34.0522, lng: -118.2437 },
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
    imageHint: 'construction debris',
    submittedBy: { name: citizen6.name, nameKey: citizen6.nameKey, uid: citizen6.uid, email: citizen6.email },
    submittedAt: subHours(now, 8).toISOString(),
    assignedTo: 'worker-1',
    updates: [
      { status: 'Submitted', updatedAt: subHours(now, 8).toISOString(), description: 'Issue reported by citizen. Awaiting clearance.' }
    ]
  }
];
