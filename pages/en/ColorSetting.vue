<!-- <template>
  <Header />
  <div class="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-bold mb-4">ตั้งค่าช่วงสี</h2>

    <div v-for="(range, index) in colorRanges" :key="index" class="mb-4 p-4 border rounded-lg">
      <label class="block text-gray-700">ช่วงที่ {{ index + 1 }}</label>
      <div class="flex space-x-2 mt-2">
        <input v-model.number="range.min" type="number" placeholder="Min" class="w-20 px-3 py-2 border rounded-lg" />
        <span>-</span>
        <input v-model.number="range.max" type="number" placeholder="Max" class="w-20 px-3 py-2 border rounded-lg" />
        <input v-model="range.color" type="color" class="w-10 h-10 border rounded-lg" />
        <button @click="removeRange(index)" class="px-3 py-2 bg-red-500 text-white rounded-lg">ลบ</button>
      </div>
    </div>

    <button @click="addRange" class="px-4 py-2 bg-blue-500 text-white rounded-lg">เพิ่มช่วง</button>
    <button @click="saveSettings" class="px-4 py-2 bg-green-500 text-white rounded-lg ml-2">บันทึก</button>
  </div>
</template>

<script setup lang="ts">
import { useColorSettings } from '@/utils/useColorSettings';

const { colorRanges, addRange, removeRange, saveSettings } = useColorSettings();
</script>
 -->
<template>
  <en-Header />
  <div class="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-bold mb-4">Color setting</h2>

    <div v-for="(range, index) in colorRanges" :key="index" class="mb-4 p-4 border rounded-lg">
      <label class="block text-gray-700">Color range {{ index + 1 }}</label>
      <div class="flex space-x-2 mt-2">
        <input v-model.number="range.min" type="number" placeholder="Min" class="w-20 px-3 py-2 border rounded-lg" />
        <span>-</span>
        <input v-model.number="range.max" type="number" placeholder="Max" class="w-20 px-3 py-2 border rounded-lg" />
        <input v-model="range.color" type="color" class="w-10 h-10 border rounded-lg" />
        <button @click="removeRange(index)" class="px-3 py-2 bg-red-500 text-white rounded-lg">Delete</button>
      </div>
    </div>

    <button @click="addRange" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Add color range</button>
    <button @click="saveSettings" class="px-4 py-2 bg-green-500 text-white rounded-lg ml-2">Save</button>
  </div>
</template>

<script setup lang="ts">
import { useColorSettings } from '@/utils/useColorSettings';

const { colorRanges, addRange, removeRange, saveSettings } = useColorSettings();
</script>
