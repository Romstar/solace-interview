import db from "..";
import { advocates } from "../schema";

const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const randomSpecialty = () => {
  const random1 = Math.floor(Math.random() * 24);
  const random2 = Math.floor(Math.random() * (24 - random1)) + random1 + 1;

  return [random1, random2];
};

const generateRandomFirstName = () => {
  const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Helen", "Mark", "Sandra", "Donald", "Donna",
    "Steven", "Carol", "Paul", "Ruth", "Andrew", "Sharon", "Joshua", "Michelle",
    "Kenneth", "Laura", "Kevin", "Sarah", "Brian", "Kimberly", "George", "Deborah",
    "Timothy", "Dorothy", "Ronald", "Amy", "Jason", "Angela", "Edward", "Ashley",
    "Jeffrey", "Brenda", "Ryan", "Emma", "Jacob", "Olivia", "Gary", "Cynthia",
    "Nicholas", "Marie", "Eric", "Janet", "Jonathan", "Catherine", "Stephen", "Frances",
    "Larry", "Christine", "Justin", "Samantha", "Scott", "Debra", "Brandon", "Rachel",
    "Benjamin", "Carolyn", "Samuel", "Janet", "Gregory", "Virginia", "Alexander", "Maria",
    "Patrick", "Heather", "Jack", "Diane", "Dennis", "Julie", "Jerry", "Joyce",
    "Tyler", "Victoria", "Aaron", "Kelly", "Jose", "Christina", "Henry", "Joan",
    "Adam", "Evelyn", "Douglas", "Judith", "Nathan", "Megan", "Zachary", "Cheryl",
    "Kyle", "Mildred", "Walter", "Katherine", "Harold", "Joan", "Carl", "Martha",
    "Jeremy", "Andrea", "Arthur", "Frances", "Gerald", "Hannah", "Keith", "Jacqueline",
    "Roger", "Martha", "Lawrence", "Gloria", "Sean", "Teresa", "Christian", "Sara",
    "Ethan", "Janice", "Austin", "Julia", "Joe", "Marie", "Albert", "Madison",
    "Jesse", "Grace", "Willie", "Judy", "Billy", "Theresa", "Bryan", "Janet",
    "Bruce", "Beverly", "Noah", "Denise", "Jordan", "Marilyn", "Dylan", "Amber",
    "Ivan", "Danielle", "Ralph", "Rose", "Eugene", "Brittany", "Wayne", "Diana",
    "Louis", "Abigail", "Philip", "Jane", "Johnny", "Lori", "Roy", "Beverly"
  ];
  
  return firstNames[Math.floor(Math.random() * firstNames.length)];
};

const generateRandomLastName = () => {
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
    "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
    "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
    "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey",
    "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza",
    "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers",
    "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell",
    "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes", "Gonzales", "Fisher",
    "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham",
    "Reynolds", "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant",
    "Herrera", "Gibson", "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray",
    "Ford", "Castro", "Marshall", "Owens", "Harrison", "Fernandez", "McDonald", "Woods",
    "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen", "Freeman", "Webb",
    "Tucker", "Guzman", "Burns", "Crawford", "Olson", "Simpson", "Porter", "Hunter",
    "Gordon", "Mendez", "Silva", "Shaw", "Snyder", "Mason", "Dixon", "Munoz",
    "Hunt", "Hicks", "Holmes", "Palmer", "Wagner", "Black", "Robertson", "Boyd",
    "Rose", "Stone", "Salazar", "Fox", "Warren", "Mills", "Meyer", "Rice",
    "Schmidt", "Garza", "Daniels", "Ferguson", "Nichols", "Stephens", "Soto", "Weaver",
    "Ryan", "Gardner", "Payne", "Grant", "Dunn", "Spencer", "Larson", "Powell",
    "Chambers", "Pope", "Lane", "Byrd", "Davidson", "Bishop", "Montgomery", "Richards",
    "Andrews", "Willis", "Johnston", "Banks", "Meyer", "Bishop", "McCoy", "Howell",
    "Alvarez", "Morrison", "Hansen", "Fernandez", "Garfield", "Harvey", "Little", "Burton",
    "Stanley", "Nguyen", "George", "Jacobs", "Reid", "Kim", "Fuller", "Lynch",
    "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", "Frazier", "Burke",
    "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler", "Brewer"
  ];
  
  return lastNames[Math.floor(Math.random() * lastNames.length)];
};

const generateRandomPhoneNumber = () => {
  // Generate a 10-digit phone number starting with 555
  const areaCode = '555';
  let number = '';
  
  for (let i = 0; i < 7; i++) {
    number += Math.floor(Math.random() * 10);
  }
  
  return parseInt(areaCode + number);
};

export const generateRandomAdvocates = (count: number = 1000000) => {
  const cities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "San Francisco", "Columbus", "Fort Worth", "Indianapolis", "Charlotte",
    "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville",
    "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville"
  ];
  
  const degrees = ["MD", "PhD", "MSW"];
  
  const advocates = [];
  
  for (let i = 0; i < count; i++) {
    advocates.push({
      firstName: generateRandomFirstName(),
      lastName: generateRandomLastName(),
      city: cities[Math.floor(Math.random() * cities.length)],
      degree: degrees[Math.floor(Math.random() * degrees.length)],
      specialties: specialties.slice(...randomSpecialty()),
      yearsOfExperience: Math.floor(Math.random() * 20) + 1, // 1-20 years
      phoneNumber: generateRandomPhoneNumber(),
    });
  }
  
  return advocates;
};

// const advocateData = [
//   {
//     firstName: "John",
//     lastName: "Doe",
//     city: "New York",
//     degree: "MD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 10,
//     phoneNumber: 5551234567,
//   },
//   {
//     firstName: "Jane",
//     lastName: "Smith",
//     city: "Los Angeles",
//     degree: "PhD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 8,
//     phoneNumber: 5559876543,
//   },
//   {
//     firstName: "Alice",
//     lastName: "Johnson",
//     city: "Chicago",
//     degree: "MSW",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 5,
//     phoneNumber: 5554567890,
//   },
//   {
//     firstName: "Michael",
//     lastName: "Brown",
//     city: "Houston",
//     degree: "MD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 12,
//     phoneNumber: 5556543210,
//   },
//   {
//     firstName: "Emily",
//     lastName: "Davis",
//     city: "Phoenix",
//     degree: "PhD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 7,
//     phoneNumber: 5553210987,
//   },
//   {
//     firstName: "Chris",
//     lastName: "Martinez",
//     city: "Philadelphia",
//     degree: "MSW",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 9,
//     phoneNumber: 5557890123,
//   },
//   {
//     firstName: "Jessica",
//     lastName: "Taylor",
//     city: "San Antonio",
//     degree: "MD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 11,
//     phoneNumber: 5554561234,
//   },
//   {
//     firstName: "David",
//     lastName: "Harris",
//     city: "San Diego",
//     degree: "PhD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 6,
//     phoneNumber: 5557896543,
//   },
//   {
//     firstName: "Laura",
//     lastName: "Clark",
//     city: "Dallas",
//     degree: "MSW",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 4,
//     phoneNumber: 5550123456,
//   },
//   {
//     firstName: "Daniel",
//     lastName: "Lewis",
//     city: "San Jose",
//     degree: "MD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 13,
//     phoneNumber: 5553217654,
//   },
//   {
//     firstName: "Sarah",
//     lastName: "Lee",
//     city: "Austin",
//     degree: "PhD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 10,
//     phoneNumber: 5551238765,
//   },
//   {
//     firstName: "James",
//     lastName: "King",
//     city: "Jacksonville",
//     degree: "MSW",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 5,
//     phoneNumber: 5556540987,
//   },
//   {
//     firstName: "Megan",
//     lastName: "Green",
//     city: "San Francisco",
//     degree: "MD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 14,
//     phoneNumber: 5559873456,
//   },
//   {
//     firstName: "Joshua",
//     lastName: "Walker",
//     city: "Columbus",
//     degree: "PhD",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 9,
//     phoneNumber: 5556781234,
//   },
//   {
//     firstName: "Amanda",
//     lastName: "Hall",
//     city: "Fort Worth",
//     degree: "MSW",
//     specialties: specialties.slice(...randomSpecialty()),
//     yearsOfExperience: 3,
//     phoneNumber: 5559872345,
//   },
// ];

//export { advocateData };
