import { ref } from 'vue';

export function useDevices() {
  const devices = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const fetchDevices = async () => {
    try {
      loading.value = true;
      const response = await fetch('https://yakkaw.mfu.ac.th/api/yakkaw/devices');s

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      devices.value = Array.isArray(data.response) ? data.response : [];

      console.log('📡 Data Fetched:', devices.value); 
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
      console.error('❌ Fetch Error:', error.value);
    } finally {
      loading.value = false;
    }
  };

  return { devices, fetchDevices, loading, error };
}
