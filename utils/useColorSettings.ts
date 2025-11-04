import { onMounted, ref } from 'vue';
import { useRuntimeConfig } from '#app';
import {
  fetchColorRanges,
  getResolvedColorRangeUrl,
  buildColorRangeUrlCandidates,
  type ColorRange as ApiColorRange,
} from '@/utils/api/colorRanges';

export type ColorRange = ApiColorRange;

export function useColorSettings() {
  const colorRanges = ref<ColorRange[]>([]);
  const resolvedBaseUrl = ref<string | null>(null);

  // ดึงจาก .env ผ่าน runtimeConfig
  const config = useRuntimeConfig();
  const baseUrlFromConfig = [
    (config as any)?.colorange,
    (config as any)?.COLOUR,
    (config.public as any)?.COLOUR,
    (config.public as any)?.colour,
    (config.public as any)?.colorange,
  ].find(
    (candidate): candidate is string =>
      typeof candidate === 'string' && candidate.trim().length > 0
  );
  const urlCandidates = buildColorRangeUrlCandidates(baseUrlFromConfig);

  const ensureBaseUrl = async (): Promise<string | null> => {
    if (resolvedBaseUrl.value) return resolvedBaseUrl.value;

    const resolved = getResolvedColorRangeUrl();
    if (resolved) {
      resolvedBaseUrl.value = resolved;
      return resolvedBaseUrl.value;
    }

    await getAllColorRanges();
    if (resolvedBaseUrl.value) {
      return resolvedBaseUrl.value;
    }

    if (urlCandidates.length > 0) {
      for (const candidate of urlCandidates) {
        try {
          const response = await fetch(candidate, { method: 'HEAD' });
          if (response.ok) {
            resolvedBaseUrl.value = candidate;
            return resolvedBaseUrl.value;
          }
        } catch {
          continue;
        }
      }
      resolvedBaseUrl.value = urlCandidates[0];
      return resolvedBaseUrl.value;
    }

    return null;
  };

  const getAllColorRanges = async () => {
    try {
      const data = await fetchColorRanges(true);
      colorRanges.value = data;
      const resolved = getResolvedColorRangeUrl();
      if (resolved) {
        resolvedBaseUrl.value = resolved;
      } else if (!resolvedBaseUrl.value && urlCandidates.length > 0) {
        resolvedBaseUrl.value = urlCandidates[0];
      }
    } catch (error) {
      console.error('Error fetching color ranges:', error);
    }
  };

  const saveAllColorRanges = async () => {
    try {
      const baseUrl = await ensureBaseUrl();
      if (!baseUrl) {
        throw new Error('Color range endpoint is not configured.');
      }
      const response = await fetch(baseUrl, {
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
      const baseUrl = await ensureBaseUrl();
      if (!baseUrl) {
        throw new Error('Color range endpoint is not configured.');
      }
      const response = await fetch(`${baseUrl}/add`, {
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
      const baseUrl = await ensureBaseUrl();
      if (!baseUrl) {
        throw new Error('Color range endpoint is not configured.');
      }
      await fetch(`${baseUrl}/${id}`, {
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
