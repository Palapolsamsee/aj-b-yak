import { onMounted, ref } from 'vue';
import { useRuntimeConfig } from '#app';

export interface ColorRange {
  id?: number;
  min: number;
  max: number;
  color: string;
}

export function useColorSettings() {
  const colorRanges = ref<ColorRange[]>([]);

  // ดึงจาก .env ผ่าน runtimeConfig
  const config = useRuntimeConfig();
  const BASE_URL = config.colorange; 

  const getAllColorRanges = async () => {
    try {
      const response = await fetch(`${BASE_URL}`);
      const data: ColorRange[] = await response.json();
      colorRanges.value = data;
    } catch (error) {
      console.error('Error fetching color ranges:', error);
    }
  };

  const saveAllColorRanges = async () => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colorRanges.value),
      });
      const data = await response.json();
      console.log('Color ranges saved:', data);
      alert('บันทึกการตั้งค่าเรียบร้อย!');
    } catch (error) {
      console.error('Error saving color ranges:', error);
    }
  };

  const addColorRange = async (range: ColorRange) => {
    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(range),
      });
      const data: ColorRange = await response.json();
      colorRanges.value.push(data);
    } catch (error) {
      console.error('Error adding color range:', error);
    }
  };

  const deleteColorRange = async (id: number) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      colorRanges.value = colorRanges.value.filter((range) => range.id !== id);
    } catch (error) {
      console.error('Error deleting color range:', error);
    }
  };

  const addRange = () => {
    colorRanges.value.push({ min: 0, max: 0, color: '#000000' });
  };

  const removeRange = (index: number) => {
    colorRanges.value.splice(index, 1);
  };

  onMounted(getAllColorRanges);

  return {
    colorRanges,
    getAllColorRanges,
    saveAllColorRanges,
    addColorRange,
    deleteColorRange,
    addRange,
    removeRange,
  };
}
