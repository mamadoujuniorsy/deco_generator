'use client';

import { useState, useEffect } from 'react';

interface DesignOptions {
  interiorStyles: string[];
  roomTypes: string[];
  exteriorStyles: string[];
  houseAngles: string[];
  gardenTypes: string[];
  gardenStyles: string[];
  aiInterventionLevels: Array<{ value: string; label: string }>;
  designTypes: Array<{ value: string; label: string; icon: string }>;
  designCounts: Array<{ value: number; label: string }>;
}

interface DesignOptionsSelectProps {
  onOptionsChange: (options: {
    designType: string;
    designStyle: string;
    roomType?: string;
    houseAngle?: string;
    gardenType?: string;
    aiIntervention: string;
    noDesign: number;
  }) => void;
}

export default function DesignOptionsSelect({ onOptionsChange }: DesignOptionsSelectProps) {
  const [options, setOptions] = useState<DesignOptions | null>(null);
  const [designType, setDesignType] = useState<'Interior' | 'Exterior' | 'Garden'>('Interior');
  const [designStyle, setDesignStyle] = useState('Modern');
  const [roomType, setRoomType] = useState('Living Room');
  const [houseAngle, setHouseAngle] = useState('Front of house');
  const [gardenType, setGardenType] = useState('Backyard');
  const [aiIntervention, setAiIntervention] = useState('Mid');
  const [noDesign, setNoDesign] = useState(2);
  const [loading, setLoading] = useState(true);

  // Fetch options
  useEffect(() => {
    fetch('/api/design-options')
      .then(res => res.json())
      .then(data => {
        setOptions(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading options:', error);
        setLoading(false);
      });
  }, []);

  // Notify parent of changes
  useEffect(() => {
    if (!options) return;

    const currentOptions: any = {
      designType,
      designStyle,
      aiIntervention,
      noDesign,
    };

    if (designType === 'Interior') {
      currentOptions.roomType = roomType;
    } else if (designType === 'Exterior') {
      currentOptions.houseAngle = houseAngle;
    } else if (designType === 'Garden') {
      currentOptions.gardenType = gardenType;
    }

    onOptionsChange(currentOptions);
  }, [designType, designStyle, roomType, houseAngle, gardenType, aiIntervention, noDesign, options, onOptionsChange]);

  // Update style when design type changes
  useEffect(() => {
    if (designType === 'Interior') {
      setDesignStyle('Modern');
    } else if (designType === 'Exterior') {
      setDesignStyle('Modern');
    } else if (designType === 'Garden') {
      setDesignStyle('Modern');
    }
  }, [designType]);

  if (loading) {
    return (
      <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!options) {
    return (
      <div className="p-6 bg-red-50 rounded-lg text-red-600">
        Erreur lors du chargement des options
      </div>
    );
  }

  const getStyleOptions = () => {
    if (designType === 'Interior') return options.interiorStyles;
    if (designType === 'Exterior') return options.exteriorStyles;
    return options.gardenStyles;
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Type de Design
        </label>
        <div className="grid grid-cols-3 gap-3">
          {options.designTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setDesignType(type.value as any)}
              className={`p-3 rounded-lg border-2 transition-all ${
                designType === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="style" className="block text-sm font-medium text-gray-700">
          Style de Design
        </label>
        <select
          id="style"
          value={designStyle}
          onChange={(e) => setDesignStyle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {getStyleOptions().map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      {designType === 'Interior' && (
        <div className="space-y-2">
          <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
            Type de Pièce
          </label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {options.roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {designType === 'Exterior' && (
        <div className="space-y-2">
          <label htmlFor="houseAngle" className="block text-sm font-medium text-gray-700">
            Angle de la Maison
          </label>
          <select
            id="houseAngle"
            value={houseAngle}
            onChange={(e) => setHouseAngle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {options.houseAngles.map((angle) => (
              <option key={angle} value={angle}>
                {angle}
              </option>
            ))}
          </select>
        </div>
      )}

      {designType === 'Garden' && (
        <div className="space-y-2">
          <label htmlFor="gardenType" className="block text-sm font-medium text-gray-700">
            Type de Jardin
          </label>
          <select
            id="gardenType"
            value={gardenType}
            onChange={(e) => setGardenType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {options.gardenTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="intervention" className="block text-sm font-medium text-gray-700">
          Niveau d&apos;Intervention AI
        </label>
        <select
          id="intervention"
          value={aiIntervention}
          onChange={(e) => setAiIntervention(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {options.aiInterventionLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="count" className="block text-sm font-medium text-gray-700">
          Nombre de Designs
        </label>
        <select
          id="count"
          value={noDesign}
          onChange={(e) => setNoDesign(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {options.designCounts.map((count) => (
            <option key={count.value} value={count.value}>
              {count.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
