// composables/useSensorData.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

interface Sensor {
  deviceid: string;
  timestamp: number;
  place: string;
  ddate: string;
  dtime: string;
  pm25: number;
  temperature: number; // Added temperature
  latitude: number;
  longitude: number;
}

interface ColorRange {
  min: number;
  max: number;
  color: string;
}

export function useSensorData() {
  const itemsPerPage = 5;

  const visibleItems = ref<number>(itemsPerPage);
  const searchQuery = ref<string>('');
  const showModal = ref<boolean>(false);
  const selectedDeviceId = ref<string | null>(null);
  const selectedSensorPlace = ref<string>('');

  // User location (latitude and longitude)
  const userLocation = ref<{ lat: number; lng: number } | null>(null);

  // Fetch sensor data
  const { data: sensorData, pending, error } = useAsyncData<Sensor[]>('sensorData', async () => {
    try {
      const response = await $fetch<Sensor[]>('http://localhost:8080/api/airquality/sensor_data/week');
      return response || [];
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      return [];
    }
  }, { default: () => [] });

  // Fetch color ranges
  const { data: colorRanges } = useAsyncData<ColorRange[]>('colorRanges', async () => {
    try {
      const response = await $fetch<ColorRange[]>('http://localhost:8080/colorranges');
      return response || [];
    } catch (err) {
      console.error('Error fetching color ranges:', err);
      return [];
    }
  }, { default: () => [] });

  const uniqueSensors = computed(() => {
    if (!sensorData.value) return [];
    const latest: Record<string, Sensor> = {};
    for (const sensor of sensorData.value) {
      if (!latest[sensor.deviceid] || sensor.timestamp > latest[sensor.deviceid].timestamp) {
        latest[sensor.deviceid] = sensor;
      }
    }
    return Object.values(latest).sort((a, b) => a.deviceid.localeCompare(b.deviceid));
  });

  const filteredSensors = computed(() => {
    if (!searchQuery.value) return uniqueSensors.value;
    const query = searchQuery.value.toLowerCase();
    return uniqueSensors.value.filter(sensor => sensor.place.toLowerCase().includes(query));
  });

  const displayedSensors = computed(() => filteredSensors.value.slice(0, visibleItems.value));
  const hasMoreSensors = computed(() => visibleItems.value < filteredSensors.value.length);

  function showMore() {
    visibleItems.value += itemsPerPage;
  }

  function getColorByValue(value: number): string {
    if (!colorRanges.value) return '#000';
    const matched = colorRanges.value.find(range => value >= range.min && value <= range.max);
    return matched ? matched.color : '#000';
  }

  /**
   * Haversine formula to calculate distance between two points.
   */
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  /**
   * Find the nearest sensor to the user's location.
   */
  const nearestSensor = computed(() => {
    if (!userLocation.value || !sensorData.value) return null;

    let closestSensor: Sensor | null = null;
    let minDistance = Infinity;

    for (const sensor of sensorData.value) {
      const distance = calculateDistance(
        userLocation.value.lat,
        userLocation.value.lng,
        sensor.latitude,
        sensor.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestSensor = sensor;
      }
    }

    return closestSensor;
  });

  /**
   * Set user location.
   */
  function setUserLocation(lat: number, lng: number) {
    userLocation.value = { lat, lng };
  }

  return {
    sensorData,
    pending,
    error,
    visibleItems,
    searchQuery,
    showModal,
    selectedDeviceId,
    selectedSensorPlace,
    displayedSensors,
    hasMoreSensors,
    showMore,
    getColorByValue,
    setUserLocation,
    nearestSensor,
  };
}
