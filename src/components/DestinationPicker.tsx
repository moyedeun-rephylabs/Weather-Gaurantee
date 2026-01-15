import type { Destination } from '../types';

const DESTINATIONS: Destination[] = [
  { name: 'Hong Kong Disneyland', lat: 22.3128, lng: 114.0413, timezone: 'Asia/Hong_Kong' },
  { name: 'Tokyo Disney Resort', lat: 35.6329, lng: 139.8804, timezone: 'Asia/Tokyo' },
  { name: 'Universal Studios Singapore', lat: 1.254, lng: 103.8238, timezone: 'Asia/Singapore' },
  { name: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, timezone: 'Australia/Sydney' },
];

interface DestinationPickerProps {
  value: Destination | null;
  onChange: (destination: Destination) => void;
}

export function DestinationPicker({ value, onChange }: DestinationPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Destination
      </label>
      <select
        value={value?.name || ''}
        onChange={(e) => {
          const dest = DESTINATIONS.find((d) => d.name === e.target.value);
          if (dest) onChange(dest);
        }}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        <option value="">Select a destination...</option>
        {DESTINATIONS.map((dest) => (
          <option key={dest.name} value={dest.name}>
            {dest.name}
          </option>
        ))}
      </select>
    </div>
  );
}
