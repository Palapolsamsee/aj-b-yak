<template>
  <section id="regis">
    <div class="container">
      <h1>ร่วมสนับสนุน</h1>
      <div class="support-text">
        ยักษ์ขาว
        เปิดรับการสนับสนุนในการส่งมอบเครื่องวัดฝุ่นให้กับโรงเรียนและชุมชนที่ยังขาดแคลน
      </div>

   <div class="bank-details">
    
    <div class="bank-header">
      <span>บริจาคผ่านธนาคาร ชื่อบัญชี : สมาคมยักษ์ขาว</span>
      <span>โทรแจ้ง: 061-265-0505</span>
    </div>

    <hr class="bank-divider" />

    <div class="bank-body">
      <img 
        src="https://www.kasikornbank.com/SiteCollectionDocuments/about/img/logo/logo.png" 
        alt="โลโก้ธนาคารกสิกรไทย" 
        class="bank-logo" 
      />
      <div class="account-details">
        <p class="account-number">062-8-46998-9</p>
        <p class="bank-name">ธนาคารกสิกรไทย</p>
      </div>
    </div>

</div>

</div>
      <div class="packages">
        <div v-for="(pkg, index) in packages" :key="index" class="package">
          <h3 class="name">{{ pkg.name }}</h3>
          <div class="features">
   <div class="features">
  <p
    v-for="(feature, i) in pkg.features"
    :key="i"
    :class="{ 'grey-text': !feature.included }"
  >
    {{ feature.text }}
  </p>
</div>
</div>
          <div class="price">{{ pkg.price }} บาท</div>
          <button class="support-button" @click="openForm(pkg)">
            สนับสนุน
          </button>
        </div>
      </div>

      <!-- แบบฟอร์มยืนยัน -->
      <div v-if="showForm" class="overlay">
        <div class="form-popup">
          <h2>ยืนยันการสนับสนุน - {{ selectedPackage.name }}</h2>

          <form @submit.prevent="submitSupport">
            <input
              type="text"
              v-model="form.name"
              placeholder="ชื่อ-นามสกุล"
              required
            />
            <input
              type="text"
              v-model="form.phone"
              placeholder="เบอร์โทรศัพท์"
              required
            />
            <input type="date" v-model="form.date" required />
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              required
            />
            <textarea
              v-model="form.note"
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
            ></textarea>

            <!-- Loading and Success Messages -->
            <div v-if="loading" class="skeleton-wrapper">
              <div class="skeleton-line w-3/4"></div>
              <div class="skeleton-line w-1/2"></div>
              <div class="skeleton-line w-full"></div>
            </div>

            <div v-if="successMessage" class="message success">
              ✅ {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="message error">
              ❌ {{ errorMessage }}
            </div>

            <div class="form-buttons">
              <button type="submit" class="confirm" :disabled="loading">
                {{ loading ? "กำลังส่ง..." : "ยืนยัน" }}
              </button>
              <button
                type="button"
                class="cancel"
                @click="closeForm"
                :disabled="loading"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    
  </section>
</template>

<script setup>
import { ref } from "vue";

const packages = [
  {
    name: "ยักษ์ขาว #1",
    price: "4,000",
    features: [
      { text: "📶 เชื่อมต่อผ่าน WiFi", included: true },
      { text: "📱 เชื่อมกับ แอพยักษ์ขาว", included: true },
      { text: "🔌 อแดปเตอร์", included: true },
      { text: "❌ เชื่อมต่อผ่าน 3G/4G", included: false },
      { text: "❌ ระบบพลังแสงอาทิตย์", included: false },
      
    ],
  },
  {
    name: "ยักษ์ขาว #2",
    price: "6,000",
    features: [
      { text: "📶 เชื่อมต่อผ่าน WiFi", included: true },
      { text: "📱 เชื่อมกับ แอพยักษ์ขาว", included: true },
      { text: "🔌 อแดปเตอร์", included: true          },
      { text: "📡 เชื่อมต่อผ่าน 3G/4G", included: true },
      { text: "❌ ระบบพลังแสงอาทิตย์", included: false },
      
    ],
  },
  {
    name: "ยักษ์ขาว #3",
    price: "10,000",
    features: [
      { text: "📶 เชื่อมต่อผ่าน WiFi", included: true },
      { text: "📱 เชื่อมกับ แอพยักษ์ขาว", included: true },
      { text: "🔌 อแดปเตอร์", included: true },
      { text: "📡 เชื่อมต่อผ่าน 3G/4G", included: true },
      { text: "☀️ ระบบพลังแสงอาทิตย์", included: true },
    ],
  },
];

const showForm = ref(false);
const selectedPackage = ref(null);
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const form = ref({
  name: "",
  phone: "",
  date: "",
  note: "",
  slip: null,
});

const openForm = (pkg) => {
  selectedPackage.value = pkg;
  showForm.value = true;
  // Reset messages when opening form
  successMessage.value = "";
  errorMessage.value = "";
};

const closeForm = () => {
  showForm.value = false;
  loading.value = false;
  form.value = {
    name: "",
    phone: "",
    date: "",
    note: "",
    slip: null,
  };
  successMessage.value = "";
  errorMessage.value = "";
};

const handleFileUpload = (event) => {
  form.value.slip = event.target.files[0];
};

const submitSupport = async () => {
  try {
    loading.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    const messageText = `
📋 ยืนยันการสนับสนุนเครื่องวัดฝุ่น
━━━━━━━━━━━━━━━
📦 แพ็กเกจ: ${selectedPackage.value.name}
💰 ราคา: ${selectedPackage.value.price} บาท
👤 ชื่อ: ${form.value.name}
📞 เบอร์โทร: ${form.value.phone}
📅 วันที่โอน: ${form.value.date}
📝 หมายเหตุ: ${form.value.note || "-"}
━━━━━━━━━━━━━━━
        `.trim();

    // Use CORS proxy to avoid CORS issues
    const googleScriptUrl =
      "https://script.google.com/macros/s/AKfycbw9MCRDfvcyeqMxvhKQ3wt6V0HHjDzy-XSn4i9Y2xr35QYaYcKBFMKJTeSPvYgZllLdPw/exec";

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
      }),
    });

    // With no-cors, we can't read the response but the request is sent
    successMessage.value = "✅ ส่งข้อมูลสำเร็จ! ขอบคุณสำหรับการสนับสนุน";
    setTimeout(() => {
      closeForm();
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
    errorMessage.value = `❌ ส่งข้อมูลไม่สำเร็จ: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

/*         const result = await response.json();
        console.log('Server Response:', result);

        if (result.success) {
            successMessage.value = '✅ ส่งข้อมูลไปยัง LINE สำเร็จ! ขอบคุณสำหรับการสนับสนุน';
            setTimeout(() => {
                closeForm();
            }, 3000);
        } else {
            throw new Error(result.error || 'ไม่สามารถส่งข้อความได้');
        }

    } catch (error) {
        console.error('Error:', error);
        errorMessage.value = `❌ ส่งข้อมูลไม่สำเร็จ: ${error.message}`;
    } finally {
        loading.value = false;
    }
}; */
</script>

<style>
/* Your existing styles... */

/* Add message styles */
body {
  font-family: "Sarabun", sans-serif;
  color: #fff;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
}

.support-text {
  text-align: center;
  font-size: 18px;
  color: black;
  margin-bottom: 40px;
}

/* กล่องหลัก */
.bank-details {
  background-color: #ffffff;
  /* สีขอบฟ้าเหมือนในรูป */
  border: 2px solid #c7c6c6; 
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 40px; /* ระยะห่างด้านล่าง (จากโค้ดเดิม) */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* เพิ่มเงาเล็กน้อย */
  max-width: 1088px;   /* ← เพิ่ม */
  margin: 0 auto 40px auto;
}

/* แถวบน (ชื่อบัญชี และ เบอร์โทร) */
.bank-header {
 display: flex;
  justify-content: space-between; /* ดันข้อความไป 2 ฝั่ง */
  align-items: center;
  flex-wrap: wrap; /* เผื่อหน้าจอแคบ */
  gap: 100px;
  font-weight: 600; /* ตัวหนาเล็กน้อย */
  color: #333;
}

/* เส้นคั่นสีเทา */
.bank-divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin-top: 15px;
  margin-bottom: 15px;
}

/* แถวล่าง (โลโก้ และ เลขบัญชี) */
.bank-body {
  display: flex;
  align-items: center;
  gap: 20px; /* ระยะห่างระหว่างโลโก้กับข้อความ */
}

/* โลโก้ธนาคาร */
.bank-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  flex-shrink: 0; /* ไม่ให้โลโก้หดเมื่อจอแคบ */
}

/* กลุ่มข้อความเลขบัญชี */
.account-details {
  display: flex;
  flex-direction: column;
}

/* ลบ margin ของ <p> ที่ติดมา */
.account-details p {
  margin: 0; 
  color: #444; /* ตั้งสีตัวอักษรกลับเป็นสีเข้ม */
}

/* เลขบัญชี (ตัวใหญ่) */
.account-number {
  font-size: 1.75rem; /* ขนาดใหญ่ */
  font-weight: 700; /* ตัวหนา */
  color: #000000;
  line-height: 1.2;
}

/* ชื่อธนาคาร (ตัวเล็ก) */
.bank-name {
  font-size: 1.1rem;
}


.packages {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 90px;
}

.package {
  background: #ffffff;
  color: #172554;
  padding: 20px;
  border-radius: 10px;
   text-align: left;
  text-align: center;
  flex: 1 1 300px;
  max-width: 300px;
  border: 2px solid #d4d4d9;
}

.package .name {
  font-size: 25px;
  font-weight: bold;
  color: #172554;
}

.package h3 {
  color: #f02a51;
}

.package .price {
  font-size: 22px;
  font-weight: bold;
  margin: 20px 0;
  color: rgb(0, 0, 0);
}

.package .support-button {
  background: #172554;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.package .support-button:hover {
  background: #d92041;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 6px; /* ระยะห่างบรรทัดเท่ากัน */
  text-align: left; /* ชิดซ้ายให้เหมือน bullet list */
  margin-top: 10px;
}


.grey-text {
  color: #ee0000;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.form-popup {
  background: #fff;
  color: #333;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}

.form-popup input,
.form-popup textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.form-buttons .confirm {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  flex: 1;
}

.form-buttons .cancel {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  flex: 1;
}

.message {
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.message.loading {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.message.success {
  background: #d1edff;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Disabled state for buttons */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
