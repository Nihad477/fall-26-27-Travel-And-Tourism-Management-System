
let accounts = [
    { id: 1, fullName: "B M NIHAD ALIM",       username: "admin",       email: "admin@travestro.com",  password: "travestro1", role: "admin",    status: "Active",    joined: "2026-08-01" },
    { id: 2, fullName: "MOHAMMAD AQIL SHAFIYEE", username: "traveler",  email: "aqil@mail.com",       password: "traveler1",  role: "traveler", status: "Active",    joined: "2026-09-12" },
    { id: 3, fullName: "TARANNUM AFRIN AFIA",  username: "tarannum",    email: "tarannum@mail.com",    password: "tarannum1",  role: "traveler", status: "Active",    joined: "2026-09-20" },
    { id: 4, fullName: "KARIMA KHATUN",        username: "guide",       email: "karima@mail.com",      password: "guide1234",  role: "guide",    status: "Active",    joined: "2026-08-15" },
    { id: 5, fullName: "MEHEDI HASAN",         username: "mehedi_guide", email: "mehedi@mail.com",       password: "guide1234",  role: "guide",    status: "Pending",   joined: "2026-11-17" },
    { id: 6, fullName: "Royal Beach Resort",   username: "provider",    email: "royalbeach@mail.com",  password: "provider1",  role: "provider",  status: "Active",    joined: "2026-08-20" },
    { id: 7, fullName: "White Orchid",         username: "whiteorchid", email: "whiteorchid@mail.com",   password: "provider1",  role: "provider",  status: "Pending",   joined: "2026-11-19" }
];


let tours = [
    { id: 1, name: "Tea Garden Trails",       city: "Sreemangal",   tag: "Nature",    days: 2, price: 6500,  seats: 14, level: "Easy",   guide: "guide", summary: "Walk through tea estates, Lawachara forest and taste the seven-layer tea." },
    { id: 2, name: "Coral Island Escape",     city: "Saint Martin", tag: "Beach",     days: 3, price: 9800,  seats: 18, level: "Easy",   guide: "guide", summary: "Ship ride from Teknaf, coral beach, Chera Dwip cycling and a seafood night." },
    { id: 3, name: "Hill Tracks Explorer",    city: "Bandarban",    tag: "Adventure", days: 4, price: 11500, seats: 10, level: "Tough",  guide: "guide", summary: "Nilgiri, Boga Lake and a full-day trek with a local Bawm family stay." },
    { id: 4, name: "Mangrove Boat Safari",    city: "Sundarbans",   tag: "Nature",    days: 3, price: 13500, seats: 12, level: "Medium", guide: "guide", summary: "Three days on a launch boat, Kotka beach, deer spotting and canal rides." },
    { id: 5, name: "Old Dhaka Heritage Walk", city: "Dhaka",        tag: "Heritage",  days: 1, price: 2200,  seats: 20, level: "Easy",   guide: "guide", summary: "Lalbagh Fort, Ahsan Manzil, Armenian Church and a street food finish." },
    { id: 6, name: "Lake and Tribal Culture", city: "Rangamati",    tag: "Heritage",  days: 2, price: 7200,  seats: 15, level: "Medium", guide: "guide", summary: "Kaptai Lake by boat, the hanging bridge and the tribal museum." }
];


let trips = [
    { id: 1, traveler: "traveler", tourId: 1, startDate: "2026-12-12", people: 2, phone: "01711000001", note: "Window seat on the train please", status: "Confirmed" },
    { id: 2, traveler: "traveler", tourId: 3, startDate: "2027-01-08", people: 4, phone: "01711000001", note: "",                               status: "Requested" },
    { id: 3, traveler: "traveler", tourId: 2, startDate: "2026-12-20", people: 2, phone: "01711000001", note: "Need a vegetarian meal",         status: "Requested" },
    { id: 4, traveler: "traveler", tourId: 4, startDate: "2026-09-15", people: 3, phone: "01711000001", note: "",                               status: "Completed" },
    { id: 5, traveler: "tarannum", tourId: 1, startDate: "2026-12-12", people: 3, phone: "01811000002", note: "",                               status: "Confirmed" },
    { id: 6, traveler: "tarannum", tourId: 6, startDate: "2026-10-05", people: 2, phone: "01811000002", note: "",                               status: "Completed" }
];


let reviews = [
    { id: 1, tourId: 1, from: "MOHAMMAD AQIL SHAFIYEE", stars: 5, comment: "Karima Apu knew every corner of the tea garden. Loved it!", date: "2026-10-01", reply: "Thank you Aqil! Come back in the rainy season." },
    { id: 2, tourId: 4, from: "MOHAMMAD AQIL SHAFIYEE", stars: 4, comment: "Great boat and food. The cabin was a bit small.",          date: "2026-09-20", reply: "" },
    { id: 3, tourId: 6, from: "TARANNUM AFRIN AFIA", stars: 3, comment: "Nice lake, but we waited two hours for the boat.",         date: "2026-10-08", reply: "" },
    { id: 4, tourId: 2, from: "Farhan Kabir",  stars: 5, comment: "Best beach trip of my life, very well planned.",           date: "2026-11-02", reply: "" },
    { id: 5, tourId: 3, from: "Lamia Sultana", stars: 2, comment: "Day two felt too rushed for beginners.",                   date: "2026-11-10", reply: "" }
];


let itinerary = [
    { id: 1, tourId: 1, day: 1, time: "08:00", activity: "Pick-up from Sreemangal railway station" },
    { id: 2, tourId: 1, day: 1, time: "11:00", activity: "Guided walk in Lawachara National Park" },
    { id: 3, tourId: 1, day: 1, time: "17:00", activity: "Seven-layer tea at Nilkantha cabin" },
    { id: 4, tourId: 1, day: 2, time: "09:00", activity: "Tea factory visit and garden photo walk" },
    { id: 5, tourId: 3, day: 1, time: "07:30", activity: "Jeep ride from Bandarban town to Ruma" }
];


let stays = [
    { id: 1, title: "Ocean View Deluxe", roomType: "Deluxe",   price: 6500, maxGuests: 2, facilities: ["AC", "WiFi", "Sea View"], status: "Open",   provider: "provider" },
    { id: 2, title: "Family Suite",      roomType: "Suite",    price: 9800, maxGuests: 5, facilities: ["AC", "WiFi", "Kitchen"],  status: "Open",   provider: "provider" },
    { id: 3, title: "Budget Twin",       roomType: "Standard", price: 3200, maxGuests: 2, facilities: ["WiFi"],                   status: "Open",   provider: "provider" },
    { id: 4, title: "Garden Cottage",    roomType: "Cottage",  price: 5400, maxGuests: 3, facilities: ["AC", "Garden"],           status: "Closed", provider: "provider" }
];


let stayRequests = [
    { id: 1, guest: "MOHAMMAD AQIL SHAFIYEE",  stayId: 1, checkIn: "2026-12-12", nights: 2, guests: 2, status: "Waiting"  },
    { id: 2, guest: "TARANNUM AFRIN AFIA",  stayId: 2, checkIn: "2026-12-20", nights: 3, guests: 6, status: "Waiting"  },
    { id: 3, guest: "Nusrat Jahan",   stayId: 3, checkIn: "2026-11-28", nights: 1, guests: 2, status: "Accepted" },
    { id: 4, guest: "Farhan Kabir",  stayId: 4, checkIn: "2026-12-01", nights: 2, guests: 2, status: "Waiting"  },
    { id: 5, guest: "Lamia Sultana", stayId: 1, checkIn: "2026-11-25", nights: 1, guests: 1, status: "Declined" }
];

let blockedNights = [];

let buses = [
    { id: 1, name: "Green Line Volvo", route: "Dhaka to Cox's Bazar",   date: "2026-11-28", time: "22:30", fare: 2200, booked: [1, 2, 5, 6, 9, 14] },
    { id: 2, name: "Hill Express",     route: "Dhaka to Bandarban",     date: "2026-11-29", time: "21:00", fare: 1500, booked: [3, 4, 7] },
    { id: 3, name: "Sea Pearl Ship",   route: "Teknaf to Saint Martin", date: "2026-11-30", time: "09:30", fare: 1200, booked: [] }
];

let tickets = [
    { id: 1, from: "tarannum", subject: "Refund for a cancelled trip",     message: "My Rangamati trip was cancelled by rain. When will I get my money back?", priority: "High",   status: "Open",        date: "2026-11-18" },
    { id: 2, from: "guide",    subject: "Cannot change tour photo",        message: "The photo option is not showing on my tour card.",                        priority: "Low",    status: "In Progress", date: "2026-11-16" },
    { id: 3, from: "provider", subject: "Wrong payout amount",             message: "October payout is 2,000 taka less than my records.",                    priority: "Medium", status: "Open",        date: "2026-11-15" },
    { id: 4, from: "traveler", subject: "Change travel date",              message: "Please move my Tea Garden trip one week later.",                          priority: "Medium", status: "Resolved",    date: "2026-11-10" }
];


let promos = [
    { id: 1, code: "WINTER25",  percent: 25, from: "2026-11-15", to: "2027-01-31", note: "Winter season offer" },
    { id: 2, code: "EIDJOY10",  percent: 10, from: "2026-06-01", to: "2026-06-30", note: "Eid holiday offer" },
    { id: 3, code: "NEWYEAR15", percent: 15, from: "2026-12-25", to: "2027-01-05", note: "New year week" }
];


let decisions = [
    { name: "Coxs Surf Club", role: "provider", decision: "Rejected", reason: "Trade licence number could not be verified.", date: "2026-11-12" }
];

let wishlist = [
    { id: 1, place: "Cappadocia",   country: "Turkey",     stage: "Dream" },
    { id: 2, place: "Bali",         country: "Indonesia",  stage: "Dream" },
    { id: 3, place: "Kathmandu",    country: "Nepal",      stage: "Planned" },
    { id: 4, place: "Sajek Valley", country: "Bangladesh", stage: "Planned" },
    { id: 5, place: "Darjeeling",   country: "India",      stage: "Visited" }
];

let friends = ["Nihad", "Tarannum", "Aqil"];

let expenses = [
    { id: 1, title: "Hotel (2 nights)", amount: 6000, paidBy: "Aqil" },
    { id: 2, title: "Seafood dinner",   amount: 1800, paidBy: "Tarannum" },
    { id: 3, title: "Boat ride",        amount: 1200, paidBy: "Nihad" }
];

let rates = [
    { code: "BDT", name: "Bangladeshi Taka",  taka: 1 },
    { code: "USD", name: "US Dollar",         taka: 122 },
    { code: "EUR", name: "Euro",              taka: 132 },
    { code: "GBP", name: "British Pound",     taka: 155 },
    { code: "INR", name: "Indian Rupee",      taka: 1.45 },
    { code: "MYR", name: "Malaysian Ringgit", taka: 27.5 },
    { code: "THB", name: "Thai Baht",         taka: 3.6 },
    { code: "AED", name: "UAE Dirham",        taka: 33 }
];
