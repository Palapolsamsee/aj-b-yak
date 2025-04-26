<script setup>
import { ref, onMounted } from 'vue';
import { fetchDevices, createDevice, updateDevice, deleteDevice } from '@/services/deviceService';

const devices = ref([]);
const newDevice = ref({
  dvid: '',
  model: '',
  address: '',
  latitude: null,
  longitude: null,
});

const loadDevices = async () => {
  try {
    devices.value = await fetchDevices();
  } catch (error) {
    console.error('Error fetching devices:', error);
  }
};

const addDevice = async () => {
  try {
    const createdDevice = await createDevice(newDevice.value);
    devices.value.push(createdDevice);
    newDevice.value = { dvid: '', model: '', address: '', latitude: null, longitude: null }; // Clear form
  } catch (error) {
    console.error('Error creating device:', error);
  }
};

const editDevice = async (id, updatedData) => {
  try {
    const updatedDevice = await updateDevice(id, updatedData);
    const index = devices.value.findIndex((device) => device.id === id);
    if (index !== -1) devices.value[index] = updatedDevice;
  } catch (error) {
    console.error('Error updating device:', error);
  }
};

const removeDevice = async (id) => {
  try {
    await deleteDevice(id);
    devices.value = devices.value.filter((device) => device.id !== id);
  } catch (error) {
    console.error('Error deleting device:', error);
  }
};

onMounted(loadDevices);
</script>

<template>
  <div>
    <h1>Device Manager</h1>
    <form @submit.prevent="addDevice">
      <input v-model="newDevice.dvid" placeholder="DVID" required />
      <input v-model="newDevice.model" placeholder="Model" required />
      <input v-model="newDevice.address" placeholder="Address" />
      <input v-model.number="newDevice.latitude" placeholder="Latitude" type="number" />
      <input v-model.number="newDevice.longitude" placeholder="Longitude" type="number" />
      <button type="submit">Add Device</button>
    </form>

    <ul>
      <li v-for="device in devices" :key="device.id">
        {{ device.dvid }} - {{ device.model }}
        <button @click="editDevice(device.id, { model: 'Updated Model' })">Edit</button>
        <button @click="removeDevice(device.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>
