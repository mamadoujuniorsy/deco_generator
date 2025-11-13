import { NextResponse } from 'next/server';

/**
 * Get all available design options for Home Designs AI
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      // Interior Design Styles
      interiorStyles: [
        'Modern',
        'Minimalist',
        'Contemporary',
        'Scandinavian',
        'Industrial',
        'Mid-Century Modern',
        'Bohemian',
        'Coastal',
        'Traditional',
        'Transitional',
        'Rustic',
        'Farmhouse',
        'French Country',
        'Art Deco',
        'Victorian',
        'Mediterranean',
        'Japanese',
        'Tropical',
        'Hollywood Glam',
        'Shabby Chic',
        'Eclectic',
        'Urban Modern',
        'Nordic',
        'Zen'
      ],

      // Room Types
      roomTypes: [
        'Living Room',
        'Bedroom',
        'Kitchen',
        'Bathroom',
        'Dining Room',
        'Home Office',
        'Kids Room',
        'Nursery',
        'Master Bedroom',
        'Guest Bedroom',
        'Walk-in Closet',
        'Laundry Room',
        'Mudroom',
        'Entryway',
        'Hallway',
        'Basement',
        'Attic',
        'Garage',
        'Home Theater',
        'Game Room',
        'Gym',
        'Library',
        'Sunroom',
        'Balcony',
        'Patio',
        'Terrace'
      ],

      // Exterior Styles
      exteriorStyles: [
        'Modern',
        'Contemporary',
        'Traditional',
        'Colonial',
        'Victorian',
        'Craftsman',
        'Mediterranean',
        'Spanish',
        'Ranch',
        'Tudor',
        'Cape Cod',
        'Farmhouse',
        'Mid-Century Modern',
        'Industrial',
        'Rustic',
        'Beach House'
      ],

      // House Angles
      houseAngles: [
        'Front of house',
        'Side of house',
        'Back of house'
      ],

      // Garden Types
      gardenTypes: [
        'Backyard',
        'Front Yard',
        'Courtyard',
        'Rooftop Garden',
        'Balcony Garden',
        'Patio',
        'Terrace',
        'Side Garden',
        'Vegetable Garden',
        'Flower Garden',
        'Zen Garden',
        'Tropical Garden'
      ],

      // Garden Styles
      gardenStyles: [
        'Modern',
        'Traditional',
        'Tropical',
        'Mediterranean',
        'Japanese',
        'English',
        'French',
        'Desert',
        'Minimalist',
        'Cottage',
        'Zen',
        'Contemporary'
      ],

      // AI Intervention Levels
      aiInterventionLevels: [
        { value: 'Very Low', label: 'Très bas - Changements minimaux' },
        { value: 'Low', label: 'Bas - Quelques modifications' },
        { value: 'Mid', label: 'Moyen - Modifications équilibrées' },
        { value: 'Extreme', label: 'Extrême - Transformation complète' }
      ],

      // Design Types
      designTypes: [
        { value: 'Interior', label: 'Intérieur', icon: '🏠' },
        { value: 'Exterior', label: 'Extérieur', icon: '🏡' },
        { value: 'Garden', label: 'Jardin', icon: '🌳' }
      ],

      // Number of Designs
      designCounts: [
        { value: 1, label: '1 design' },
        { value: 2, label: '2 designs (recommandé)' }
      ]
    }
  });
}
