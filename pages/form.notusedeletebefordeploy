<script setup>
import { onMounted, ref } from 'vue';

const items = ref([]);
const newItem = ref({ model_id: '', model: '', address: '' });
const models = ['model1', 'model2', 'model3']; // Enum ของ model
const apiUrl = 'http://localhost:3000/items';

// ดึงข้อมูลเมื่อโหลดหน้า
const fetchItems = async () => {
  try {
    const response = await fetch(apiUrl);
    items.value = await response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

// เพิ่มข้อมูล
const addItem = async () => {
  if (!newItem.value.model_id || !newItem.value.model || !newItem.value.address) {
    alert('กรุณากรอกข้อมูลให้ครบ');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem.value),
    });

    const data = await response.json();

    if (response.ok) {
      items.value.push(data);
      newItem.value = { model_id: '', model: '', address: '' }; // เคลียร์ฟอร์ม
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error adding item:', error);
  }
};

// ลบข้อมูล
const deleteItem = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      items.value = items.value.filter(item => item.id !== id);
    } else {
      alert('ลบไม่สำเร็จ');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

onMounted(fetchItems);
</script>

<template>
  <div class="container">
    <h1>จัดการข้อมูล Items</h1>

    <!-- ฟอร์มเพิ่มข้อมูล -->
    <div class="form">
      <input v-model="newItem.model_id" placeholder="Model ID (String)" />
      <select v-model="newItem.model">
        <option disabled value="">เลือก Model</option>
        <option v-for="model in models" :key="model" :value="model">{{ model }}</option>
      </select>
      <input v-model="newItem.address" placeholder="Address" />
      <button @click="addItem">เพิ่มข้อมูล</button>
    </div>

    <!-- ตารางข้อมูล -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Model ID</th>
          <th>Model</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.model_id }}</td>
          <td>{{ item.model }}</td>
          <td>{{ item.address }}</td>
          <td>
            <button @click="deleteItem(item.id)">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
}

button:hover {
  background: darkred;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
