
import { Psychiatrist } from '../types';

export const stateCityMap: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Surat"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli"],
  "Delhi": ["New Delhi", "Noida", "Gurgaon"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad"],
  "West Bengal": ["Kolkata"],
  "Gujarat": ["Ahmedabad", "Vadodara"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  "Kerala": ["Kochi"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
  "Bihar": ["Patna"],
  "Goa": ["Goa"],
  "Assam": ["Guwahati"],
  "Jharkhand": ["Ranchi"],
  "Uttarakhand": ["Dehradun"],
  "Odisha": ["Bhubaneswar"]
};

const rawPsychiatristData: Record<string, Omit<Psychiatrist, 'id' | 'address'>[]> = {
  "Mumbai": [
    { name: "Dr. Anjali Deshmukh", specialty: "Depression & Anxiety", qualifications: "MBBS, MD, DPM", experience: "15 years", contactNumber: "+91 22123 45678", email: "dr.deshmukh@fortis.in", hospitalAffiliation: "Fortis Hospital Mulund", consultationFee: "₹1500", acceptingNewPatients: true, languages: ["English", "Hindi", "Marathi"], availableDays: "Mon-Sat", rating: 4.8 },
    { name: "Dr. Rajesh Mehta", specialty: "Child Psychiatry", qualifications: "MBBS, MD", experience: "12 years", contactNumber: "+91 22234 56789", email: "rajesh.mehta@lilavati.in", hospitalAffiliation: "Lilavati Hospital Bandra", consultationFee: "₹1200", acceptingNewPatients: true, languages: ["English", "Hindi", "Gujarati"], availableDays: "Mon-Fri", rating: 4.7 },
    { name: "Dr. Priya Sharma", specialty: "De-addiction Specialist", qualifications: "MBBS, MD, DPM", experience: "10 years", contactNumber: "+91 22345 67890", email: "dr.sharma@breach.in", hospitalAffiliation: "Breach Candy Hospital", consultationFee: "₹1800", acceptingNewPatients: false, languages: ["English", "Hindi"], availableDays: "Mon-Sat", rating: 4.9 },
    { name: "Dr. Vikram Singh", specialty: "OCD & Anxiety Disorders", qualifications: "MBBS, MD", experience: "18 years", contactNumber: "+91 22456 78901", email: "vikram@hinduja.in", hospitalAffiliation: "Hinduja Hospital", consultationFee: "₹2000", acceptingNewPatients: true, languages: ["English", "Hindi"], availableDays: "Mon-Fri", rating: 4.6 }
  ],
  "Bangalore": [
    { name: "Dr. Suresh Kumar", specialty: "Depression & Mood Disorders", qualifications: "MBBS, MD Psychiatry", experience: "14 years", contactNumber: "+91 80123 45678", email: "suresh.k@manipal.in", hospitalAffiliation: "Manipal Hospital Whitefield", consultationFee: "₹1200", acceptingNewPatients: true, languages: ["English", "Hindi", "Kannada"], availableDays: "Mon-Sat", rating: 4.8 },
    { name: "Dr. Meera Reddy", specialty: "Bipolar & Schizophrenia", qualifications: "MBBS, MD, DPM", experience: "11 years", contactNumber: "+91 80234 56789", email: "meera.reddy@apollo.in", hospitalAffiliation: "Apollo Hospital Bannerghatta", consultationFee: "₹1500", acceptingNewPatients: true, languages: ["English", "Telugu", "Kannada"], availableDays: "Mon-Fri", rating: 4.7 },
    { name: "Dr. Arjun Nair", specialty: "Child & Adolescent Psychiatry", qualifications: "MBBS, MD", experience: "9 years", contactNumber: "+91 80345 67890", email: "arjun@columbia.in", hospitalAffiliation: "Columbia Asia Hospital", consultationFee: "₹1000", acceptingNewPatients: true, languages: ["English", "Malayalam", "Hindi"], availableDays: "Mon-Sat", rating: 4.9 },
    { name: "Dr. Kavitha Rao", specialty: "Geriatric Psychiatry", qualifications: "MBBS, MD", experience: "16 years", contactNumber: "+91 80456 78901", email: "kavitha@fortis.in", hospitalAffiliation: "Fortis Hospital Cunningham Road", consultationFee: "₹1400", acceptingNewPatients: false, languages: ["English", "Kannada", "Tamil"], availableDays: "Mon-Fri", rating: 4.6 }
  ],
  "New Delhi": [
    { name: "Dr. Amit Verma", specialty: "Anxiety & Depression", qualifications: "MBBS, MD, DPM", experience: "13 years", contactNumber: "+91 11123 45678", email: "amit.verma@aiims.in", hospitalAffiliation: "AIIMS Delhi", consultationFee: "₹800", acceptingNewPatients: true, languages: ["English", "Hindi"], availableDays: "Mon-Fri", rating: 4.9 },
    { name: "Dr. Neha Gupta", specialty: "PTSD & Trauma", qualifications: "MBBS, MD", experience: "10 years", contactNumber: "+91 11234 56789", email: "neha.gupta@max.in", hospitalAffiliation: "Max Super Specialty Saket", consultationFee: "₹1600", acceptingNewPatients: true, languages: ["English", "Hindi", "Punjabi"], availableDays: "Mon-Sat", rating: 4.7 }
  ],
  "Jaipur": [
    { name: "Dr. Rahul Sharma", specialty: "Depression & Anxiety", qualifications: "MBBS, MD", experience: "11 years", contactNumber: "+91 141234 5678", email: "rahul.sharma@fortis.in", hospitalAffiliation: "Fortis Escorts Hospital", consultationFee: "₹1000", acceptingNewPatients: true, languages: ["English", "Hindi", "Rajasthani"], availableDays: "Mon-Sat", rating: 4.7 },
    { name: "Dr. Sunita Rathore", specialty: "Child Psychiatry", qualifications: "MBBS, DPM", experience: "9 years", contactNumber: "+91 141345 6789", email: "sunita@eternal.in", hospitalAffiliation: "Eternal Hospital", consultationFee: "₹800", acceptingNewPatients: true, languages: ["English", "Hindi"], availableDays: "Mon-Fri", rating: 4.6 }
  ],
  "Pune": [
    { name: "Dr. Ashok Patil", specialty: "Bipolar Disorder", qualifications: "MBBS, MD, DPM", experience: "16 years", contactNumber: "+91 20123 45678", email: "ashok.patil@ruby.in", hospitalAffiliation: "Ruby Hall Clinic", consultationFee: "₹1400", acceptingNewPatients: true, languages: ["English", "Hindi", "Marathi"], availableDays: "Mon-Sat", rating: 4.8 },
    { name: "Dr. Sneha Kulkarni", specialty: "Anxiety Disorders", qualifications: "MBBS, MD", experience: "10 years", contactNumber: "+91 20234 56789", email: "sneha@sahyadri.in", hospitalAffiliation: "Sahyadri Hospital", consultationFee: "₹1100", acceptingNewPatients: true, languages: ["English", "Marathi"], availableDays: "Mon-Fri", rating: 4.7 }
  ]
};

// Fallback logic to generate more doctors if needed
const generateFullDatabase = () => {
  const db: Record<string, Psychiatrist[]> = {};
  
  Object.keys(stateCityMap).forEach(state => {
    stateCityMap[state].forEach(city => {
      const doctors = rawPsychiatristData[city] || [
        { name: `Dr. Sameer Khan`, specialty: "General Psychiatry", qualifications: "MBBS, MD", experience: "8 years", contactNumber: "+91 99887 76655", email: "sameer@clinic.in", hospitalAffiliation: "Global Health Clinic", consultationFee: "₹900", acceptingNewPatients: true, languages: ["English", "Hindi"], availableDays: "Mon-Sat", rating: 4.5 }
      ];
      
      db[city] = doctors.map((d, i) => ({
        ...d,
        id: `psy_${city}_${i}`,
        address: `${d.hospitalAffiliation || 'Wellness Clinic'}, ${city}, ${state}`
      }));
    });
  });
  
  return db;
};

const psychiatristDatabase = generateFullDatabase();

export const psychiatristService = {
  loadLocalPsychiatrists: (city: string): Psychiatrist[] => {
    return psychiatristDatabase[city] || [];
  },
  
  getStates: () => Object.keys(stateCityMap),
  getCitiesForState: (state: string) => stateCityMap[state] || []
};
