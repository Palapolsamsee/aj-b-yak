import { onMounted, ref } from 'vue';

export interface ColorRange {
  id?: number; // Optional ID for backend management
  min: number;
  max: number;
  color: string;
}

export function useColorSettings() {
  const colorRanges = ref<ColorRange[]>([]);

  // Fetch all ColorRanges from the backend
  const getAllColorRanges = async () => {
    try {
      const response = await fetch('http://localhost:8080/color-ranges');
      const data: ColorRange[] = await response.json();
      colorRanges.value = data;
    } catch (error) {
      console.error('Error fetching color ranges:', error);
    }
  };

  // Save all ColorRanges to the backend
  const saveAllColorRanges = async () => {
    try {
      const response = await fetch('http://localhost:8080/color-ranges', {
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

  // Add a new ColorRange to the backend
  const addColorRange = async (range: ColorRange) => {
    try {
      const response = await fetch('http://localhost:8080/color-ranges/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(range),
      });
      const data: ColorRange = await response.json();
      colorRanges.value.push(data); // Add the new range to the local state
    } catch (error) {
      console.error('Error adding color range:', error);
    }
  };

  // Remove a ColorRange by ID from the backend
  const deleteColorRange = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/color-ranges/${id}`, {
        method: 'DELETE',
      });
      colorRanges.value = colorRanges.value.filter((range) => range.id !== id); // Remove from local state
    } catch (error) {
      console.error('Error deleting color range:', error);
    }
  };

  // Add a new range locally (without backend interaction)
  const addRange = () => {
    colorRanges.value.push({ min: 0, max: 0, color: '#000000' });
  };

  // Remove a range locally by index (without backend interaction)
  const removeRange = (index: number) => {
    colorRanges.value.splice(index, 1);
  };

  // Load settings from the backend on component mount
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
