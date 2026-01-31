
import { CityPlacesData, Place } from '../types';

const placesDatabase: Record<string, CityPlacesData> = {
  "Mumbai": {
    tier: 1,
    parks: [
      {
        id: "p1", name: "Sanjay Gandhi National Park", description: "Large protected area with caves and wildlife.",
        address: "Borivali East, Mumbai, Maharashtra 400066", timings: "7:30 AM - 5:30 PM", entryFee: "₹64",
        rating: 4.5, googleMapsLink: "https://maps.google.com/?q=Sanjay+Gandhi+National+Park",
        highlights: ["Tiger Safari", "Kanheri Caves", "Boating"], image: "🌳"
      },
      {
        id: "p2", name: "Hanging Gardens", description: "Terraced gardens with topiaries and sunset views.",
        address: "Ridge Rd, Simla Nagar, Malabar Hill, Mumbai, 400006", timings: "5:00 AM - 9:00 PM", entryFee: "Free",
        rating: 4.4, googleMapsLink: "https://maps.google.com/?q=Hanging+Gardens+Mumbai",
        highlights: ["Sunset Views", "Topiaries", "Photography"], image: "🌷"
      }
    ],
    cinemas: [
      {
        id: "c1", name: "PVR ICON Phoenix Palladium", description: "Ultra-luxury cinema experience in Lower Parel.",
        address: "Phoenix Palladium Mall, Lower Parel, Mumbai", timings: "9:00 AM - 12:00 AM", ticketRange: "₹400 - ₹1200",
        rating: 4.7, googleMapsLink: "https://maps.google.com/?q=PVR+ICON+Palladium",
        amenities: ["IMAX", "Gourmet Food", "Valet Parking"], image: "🎬"
      },
      {
        id: "c2", name: "Regal Cinema", description: "Historic Art Deco movie house in South Mumbai.",
        address: "Colaba Causeway, Mumbai", timings: "10:00 AM - 11:00 PM", ticketRange: "₹200 - ₹400",
        rating: 4.3, googleMapsLink: "https://maps.google.com/?q=Regal+Cinema+Mumbai",
        amenities: ["Classic Architecture", "Central Location"], image: "📽️"
      }
    ],
    events: [
      {
        id: "e1", name: "NCPA (National Centre for the Performing Arts)", description: "Premier cultural hub for music, dance, and theater.",
        address: "Nariman Point, Mumbai", upcomingEvents: "Symphony Orchestra, Indian Classical Dance", ticketRange: "₹500 - ₹5000",
        rating: 4.8, website: "https://www.ncpamumbai.com",
        highlights: ["Multiple Theaters", "Sea View"], image: "🎵"
      }
    ],
    sightseeing: [
      {
        id: "s1", name: "Gateway of India", description: "Colonial-era arch monument and major tourist hub.",
        address: "Apollo Bandar, Colaba, Mumbai", timings: "24 Hours", entryFee: "Free",
        rating: 4.6, googleMapsLink: "https://maps.google.com/?q=Gateway+of+India",
        highlights: ["Architecture", "Ferry to Elephanta"], image: "🏛️"
      },
      {
        id: "s2", name: "Marine Drive", description: "Scenic 3.6-km boulevard along the coast.",
        address: "Netaji Subhash Chandra Bose Road, Mumbai", timings: "24 Hours", entryFee: "Free",
        rating: 4.7, googleMapsLink: "https://maps.google.com/?q=Marine+Drive+Mumbai",
        highlights: ["Evening Walks", "City Skyline"], image: "🌉"
      }
    ]
  },
  "New Delhi": {
    tier: 1,
    parks: [
      {
        id: "ndp1", name: "Lodhi Garden", description: "Historic park with 15th-century tombs.",
        address: "Lodhi Rd, New Delhi, 110003", timings: "6:00 AM - 8:00 PM", entryFee: "Free",
        rating: 4.6, googleMapsLink: "https://maps.google.com/?q=Lodhi+Garden",
        highlights: ["Historic Tombs", "Jogging Track"], image: "🌳"
      }
    ],
    cinemas: [
      {
        id: "ndc1", name: "PVR Director's Cut", description: "Luxury cinema with personal service.",
        address: "Ambience Mall, Vasant Kunj, New Delhi", timings: "10:00 AM - 1:00 AM", ticketRange: "₹800 - ₹2500",
        rating: 4.8, googleMapsLink: "https://maps.google.com/?q=PVR+Directors+Cut+Delhi",
        amenities: ["Fine Dining", "Recliner Seats"], image: "🎬"
      }
    ],
    events: [
      {
        id: "nde1", name: "Siri Fort Auditorium", description: "Large government-run auditorium for big cultural events.",
        address: "August Kranti Marg, New Delhi", upcomingEvents: "Cultural Festivals, Film Screenings", ticketRange: "₹200 - ₹2000",
        rating: 4.5, website: "https://www.ndmc.gov.in",
        highlights: ["Large Seating", "Central Location"], image: "🎵"
      }
    ],
    sightseeing: [
      {
        id: "nds1", name: "Qutub Minar", description: "UNESCO World Heritage site with a 73m brick minaret.",
        address: "Mehrauli, New Delhi", timings: "7:00 AM - 9:00 PM", entryFee: "₹40",
        rating: 4.5, googleMapsLink: "https://maps.google.com/?q=Qutub+Minar",
        highlights: ["Ancient Architecture", "Iron Pillar"], image: "🏛️"
      }
    ]
  },
  "Bangalore": {
    tier: 1,
    parks: [
      {
        id: "blrp1", name: "Cubbon Park", description: "The 'Lungs of the City' with bamboo groves.",
        address: "Kasturba Road, Bengaluru, 560001", timings: "6:00 AM - 8:00 PM", entryFee: "Free",
        rating: 4.5, googleMapsLink: "https://maps.google.com/?q=Cubbon+Park",
        highlights: ["Bamboo Groves", "Museums Nearby"], image: "🌳"
      }
    ],
    cinemas: [
      {
        id: "blrc1", name: "INOX: Lido Mall", description: "Modern multiplex near MG Road.",
        address: "Lido Mall, Ulsoor, Bengaluru", timings: "9:00 AM - 11:00 PM", ticketRange: "₹300 - ₹800",
        rating: 4.4, googleMapsLink: "https://maps.google.com/?q=INOX+Lido+Mall",
        amenities: ["Food Court", "Central Location"], image: "🎬"
      }
    ],
    events: [
      {
        id: "blre1", name: "Chowdiah Memorial Hall", description: "Unique violin-shaped auditorium.",
        address: "Malleswaram, Bengaluru", upcomingEvents: "Classical Concerts, Plays", ticketRange: "₹200 - ₹2000",
        rating: 4.6, website: "N/A",
        highlights: ["Architecture", "Acoustics"], image: "🎻"
      }
    ],
    sightseeing: [
      {
        id: "blrs1", name: "Lalbagh Botanical Garden", description: "Famous for its flower shows and glass house.",
        address: "Mavalli, Bengaluru", timings: "6:00 AM - 7:00 PM", entryFee: "₹25",
        rating: 4.5, googleMapsLink: "https://maps.google.com/?q=Lalbagh+Botanical+Garden",
        highlights: ["Glass House", "Lake"], image: "🏛️"
      }
    ]
  },
  "Jaipur": {
    tier: 2,
    parks: [
      {
        id: "jp1", name: "Central Park Jaipur", description: "City center park with the tallest national flag.",
        address: "Prithviraj Rd, Jaipur", timings: "5:00 AM - 9:00 PM", entryFee: "Free",
        rating: 4.6, googleMapsLink: "https://maps.google.com/?q=Central+Park+Jaipur",
        highlights: ["Jogging Track", "Musical Fountain"], image: "🌳"
      }
    ],
    cinemas: [
      {
        id: "jc1", name: "Raj Mandir Cinema", description: "Famous meringue-shaped theater.",
        address: "Bhagwan Das Rd, Jaipur", timings: "11:00 AM - 11:00 PM", ticketRange: "₹200 - ₹500",
        rating: 4.7, googleMapsLink: "https://maps.google.com/?q=Raj+Mandir+Jaipur",
        amenities: ["Classic Experience"], image: "🎬"
      }
    ],
    events: [
      {
        id: "je1", name: "Jawahar Kala Kendra", description: "Cultural center for arts and crafts.",
        address: "Jawaharlal Nehru Marg, Jaipur", upcomingEvents: "Art Exhibitions, Folk Music", ticketRange: "Free - ₹500",
        rating: 4.6, website: "http://jawaharkalakendra.rajasthan.gov.in",
        highlights: ["Modern Architecture", "Library"], image: "🎨"
      }
    ],
    sightseeing: [
      {
        id: "js1", name: "Hawa Mahal", description: "Iconic 'Palace of Winds' with 953 small windows.",
        address: "Hawa Mahal Rd, Jaipur", timings: "9:00 AM - 5:00 PM", entryFee: "₹50",
        rating: 4.5, googleMapsLink: "https://maps.google.com/?q=Hawa+Mahal",
        highlights: ["Photography", "City Views"], image: "🏛️"
      }
    ]
  }
};

export const placesService = {
  loadLocalPlaces: (city: string): CityPlacesData | null => {
    // Exact match case-insensitive
    const key = Object.keys(placesDatabase).find(k => k.toLowerCase() === city.toLowerCase());
    return key ? placesDatabase[key] : null;
  }
};
