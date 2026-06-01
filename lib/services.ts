import { Briefcase, Clock, MapPin, Plane, Route } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ServiceDefinition = {
  slug: string;
  title: string;
  desc: string;
  tag: string;
  overview: string;
  highlights: string[];
  details: string[];
  icon: LucideIcon;
};

export const services: ServiceDefinition[] = [
  {
    slug: 'city-rides',
    title: 'City Rides',
    desc: 'Quick and comfortable rides within the city for daily travel, office commutes, shopping, and meetings.',
    tag: 'Urban',
    overview:
      'Reliable city travel with clean cars, expert drivers, and smart pickup scheduling for every day and after-hours journeys.',
    highlights: [
      'Fast local pickup',
      'Professional chauffeurs',
      'Flexible payment options',
      'Safe and sanitized vehicles',
    ],
    details: [
      'Book hourly or point-to-point city trips in major metro areas.',
      'Perfect for business commutes, shopping runs, and short family outings.',
      'Receive instant confirmations and driver tracking updates.',
      'Choose premium sedans, SUVs, or executive cars for added comfort.',
    ],
    icon: MapPin,
  },
  {
    slug: 'airport-transfers',
    title: 'Airport Transfers',
    desc: 'Timely airport pickup and drop services with real-time tracking and professional drivers.',
    tag: 'Priority',
    overview:
      'Door-to-door airport transportation with flight monitoring, meet-and-greet service, and luggage assistance for a stress-free journey.',
    highlights: [
      'Real-time flight tracking',
      'Meet-and-greet service',
      'On-time arrivals and departures',
      'Luggage friendly vehicles',
    ],
    details: [
      'Scheduled pickups matched to your flight arrival time.',
      'Professional drivers monitor delays and adjust pickup automatically.',
      'Ideal for both domestic and international airport transfers.',
      'Enjoy premium comfort with spacious cars and courteous assistance.',
    ],
    icon: Plane,
  },
  {
    slug: 'flight-booking',
    title: 'Flight Booking',
    desc: 'Air ticket booking for economy, premium economy, business, and first class across domestic and international routes.',
    tag: 'All Classes',
    overview:
      'Complete flight booking support for all cabin classes, with expert fare comparison, flexible routing, and ticket management tailored to your schedule.',
    highlights: [
      'Economy to first class',
      'Domestic & international routes',
      'Multi-city and open-jaw options',
      'Visa-friendly ticketing advice',
    ],
    details: [
      'Book flights across the world with curated options for value and convenience.',
      'Receive guidance for the best cabin and fare class based on your travel needs.',
      'Let us handle bookings for business travel, family vacations, and special itineraries.',
      'Enjoy flexibility with changeable fares and coordinated pickup services.',
    ],
    icon: Plane,
  },
  {
    slug: 'visa-assistance',
    title: 'Visa Assistance',
    desc: 'End-to-end visa support for tourist, business, medical, and transit visas with documentation guidance and appointment help.',
    tag: 'Visa',
    overview:
      'Expert visa service that supports document preparation, embassy appointment booking, and application follow-up for smooth travel planning.',
    highlights: [
      'Tourist & business visas',
      'Medical & transit support',
      'Documentation review',
      'Application tracking',
    ],
    details: [
      'Receive step-by-step guidance on visa forms and required documents.',
      'Book embassy and consulate appointments on your behalf.',
      'Get support for travel insurance, invitation letters, and proof of stay.',
      'Track application progress to minimize delays and last-minute issues.',
    ],
    icon: Briefcase,
  },
  {
    slug: 'outstation-trips',
    title: 'Outstation Trips',
    desc: 'Enjoy smooth long-distance travel with affordable round-trip and one-way packages.',
    tag: 'Long Distance',
    overview:
      'Comfortable outstation travel packages for weekend escapes, business routes, and family journeys with transparent pricing and safe routes.',
    highlights: [
      'Round-trip and one-way plans',
      'Comfortable long-haul vehicles',
      'Highway-friendly routes',
      'Driver rest and safety measures',
    ],
    details: [
      'Choose from affordable one-way or round-trip options to any destination.',
      'Travel in well-maintained cars with experienced long-distance drivers.',
      'Ideal for leisure getaways, pilgrimage trips, and corporate transfers.',
      'Enjoy route planning and roadside support for complete peace of mind.',
    ],
    icon: Route,
  },
  {
    slug: 'hourly-rentals',
    title: 'Hourly Rentals',
    desc: 'Book cabs by the hour for flexible travel plans, business meetings, and personal use.',
    tag: 'Flexible',
    overview:
      'Flexible hourly rental plans for city travel, corporate schedules, and sightseeing with driver-on-demand convenience.',
    highlights: [
      'Hourly bookings',
      'City tours & meetings',
      'On-demand driver service',
      'Flexible schedules',
    ],
    details: [
      'Rent a car by the hour for errands, appointments, or day-long city plans.',
      'Enjoy full control over pickups, stops, and route changes.',
      'Perfect for event coordination, branch visits, and airport waits.',
      'Get transparent hourly pricing with no hidden charges.',
    ],
    icon: Clock,
  },
  {
    slug: 'corporate-travel',
    title: 'Corporate Travel',
    desc: 'Reliable transport solutions for companies, employees, and business executives.',
    tag: 'Business',
    overview:
      'Corporate travel solutions built for efficiency, privacy, and premium service across employee commutes and executive mobility.',
    highlights: [
      'Employee transfers',
      'Executive cars',
      'Bulk booking support',
      'Invoice and account management',
    ],
    details: [
      'Manage corporate bookings with a dedicated travel partner for teams and executives.',
      'Book premium sedans and SUVs for important clients and board members.',
      'Enjoy account-based billing and customized reporting for corporate travel.',
      'Rely on punctual service and professional drivers for your business agenda.',
    ],
    icon: Briefcase,
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
