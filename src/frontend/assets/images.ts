/**
 * Centralized image asset registry.
 *
 * All images used across the frontend are declared here.
 * To replace an image, drop your file into src/frontend/assets/
 * with the matching filename — no need to edit components.
 *
 * Services use temporary representative remote images for now;
 * replace the local imports below with your own files when ready.
 */
import heroBg from './HEROSECTION copy.png';
import aboutImg from './QUI_SOMMES_NOUS.jpg';
import pacAirAirImg from './PAC_AIRE_AIRE_(3).jpg';

export const IMAGES = {
  hero: {
    pacInstaller: heroBg,
    background: heroBg,
  },
  about: {
    technician: aboutImg,
  },
  services: {
    pacAirAir: pacAirAirImg,
    pacAirEau:
      'https://images.pexels.com/photos/38067323/pexels-photo-38067323.jpeg?auto=compress&cs=tinysrgb&w=800',
    ballonSolaire:
      'https://images.pexels.com/photos/27566315/pexels-photo-27566315.jpeg?auto=compress&cs=tinysrgb&w=800',
    ssc:
      'https://images.pexels.com/photos/38021376/pexels-photo-38021376.jpeg?auto=compress&cs=tinysrgb&w=800',
    poeleGranules:
      'https://images.pexels.com/photos/19966782/pexels-photo-19966782.jpeg?auto=compress&cs=tinysrgb&w=800',
    isolationCombles:
      'https://images.pexels.com/photos/6124239/pexels-photo-6124239.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  popup: {
    renovation: heroBg,
  },
} as const;
