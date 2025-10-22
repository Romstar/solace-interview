import db from "..";
import { advocates } from "../schema";
import { specialtiesData } from "./specialties";

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
      yearsOfExperience: Math.floor(Math.random() * 20) + 1, // 1-20 years
      phoneNumber: generateRandomPhoneNumber(),
    });
  }
  
  return advocates;
};

const seedAdvocates = async () => {
  console.log("Seeding advocates...");
  
  try {
    // Generate and insert advocates in batches
    const batchSize = 5000;
    const totalAdvocates = 50000; // Adjust as needed
    
    for (let i = 0; i < totalAdvocates; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, totalAdvocates - i);
      const advocateData = generateRandomAdvocates(currentBatchSize);
      
      await db.insert(advocates).values(advocateData).onConflictDoNothing();
      
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalAdvocates / batchSize)}`);
    }
    
    console.log(`Successfully seeded ${totalAdvocates} advocates`);
  } catch (error) {
    console.error("Error seeding advocates:", error);
    throw error;
  }
};

export default seedAdvocates;
//export { advocateData };
