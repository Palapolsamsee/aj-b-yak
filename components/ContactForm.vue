<template>
  <div class="contact-form">
    <h2>ติดต่อเรา</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">ชื่อ:</label>
        <input type="text" id="name" v-model="formData.name" required placeholder="กรอกชื่อของคุณ" />
      </div>
      <div class="form-group">
        <label for="email">อีเมล:</label>
        <input type="email" id="email" v-model="formData.email" required placeholder="example@mail.com" />
      </div>
      <div class="form-group">
        <label for="subject">หัวข้อเรื่อง:</label>
        <input type="text" id="subject" v-model="formData.subject" required placeholder="เรื่องที่ต้องการติดต่อ" />
      </div>
      <div class="form-group">
        <label for="message">ข้อความ:</label>
        <textarea id="message" v-model="formData.message" required placeholder="พิมพ์ข้อความของคุณ..."></textarea>
      </div>
      <button type="submit">ส่งข้อความ</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },
  methods: {
    submitForm() {
      console.log("Form submitted", this.formData);
      this.formData = { name: '', email: '', subject: '', message: '' };
    }
  }
};
</script>

<style scoped>
.contact-form {
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
  padding: 25px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: border-color 0.3s ease-in-out;
}

input:focus, textarea:focus {
  border-color: #1a237e;
  outline: none;
}

textarea {
  height: 100px;
  resize: none;
}

button {
  width: 100%;
  background-color: #1a237e;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #0d1b5a;
}
</style>
