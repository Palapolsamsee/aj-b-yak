import { ref, onMounted } from 'vue';

export interface ColorRange {
  min: number;
  max: number;
  color: string;
}

export function useColorSettings() {
  const colorRanges = ref<ColorRange[]>([
    { min: 1, max: 10, color: '#ff69b4' },
    { min: 11, max: 29, color: '#ff0000' }
  ]);

  const addRange = () => {
    colorRanges.value.push({ min: 0, max: 0, color: '#000000' });
  };

  const removeRange = (index: number) => {
    colorRanges.value.splice(index, 1);
  };

  const saveSettings = () => {
    localStorage.setItem('colorRanges', JSON.stringify(colorRanges.value));
    alert('บันทึกการตั้งค่าเรียบร้อย!');
    console.log(colorRanges.value);
  };

  const loadSettings = () => {
    const savedRanges = localStorage.getItem('colorRanges');
    if (savedRanges) {
      colorRanges.value = JSON.parse(savedRanges);
    }
  };

  onMounted(loadSettings);

  return { colorRanges, addRange, removeRange, saveSettings };
}
