<template>
      <section id="regis" class="py-16 bg-white"></section>
    <div class="container ">
        <h1>ร่วมสนับสนุน</h1>
        <div class="support-text">
            ยักษ์ขาว เปิดรับการสนับสนุนในการส่งมอบเครื่องวัดฝุ่น ให้กับโรงเรียนและชุมชนที่ยังขาดแคลน
        </div>

        <div class="bank-details">
            <h2>สนับสนุนผ่านบัญชีธนาคาร</h2>
            <p>ธนาคารกสิกรไทย</p>
            <p>ชื่อบัญชี: สมาคมยักษ์ขาว</p>
            <p>เลขที่บัญชี: 062-8-46998-9</p>
            <p>โทรแจ้ง: 061-265-0505</p>
        </div>

        <div class="packages">
            <div v-for="(pkg, index) in packages" :key="index" class="package">
                <h3>{{ pkg.name }}</h3>
                <p v-for="(feature, i) in pkg.features" :key="i" :class="{ 'grey-text': !feature.included }">
                    {{ feature.text }}
                </p>
                <div class="price">{{ pkg.price }} บาท</div>
                <button class="support-button" @click="openForm(pkg)">สนับสนุน</button>
            </div>
        </div>

        <!-- แบบฟอร์มยืนยัน -->
        <div v-if="showForm" class="overlay">
            <div class="form-popup">
                <h2>ยืนยันการสนับสนุน - {{ selectedPackage.name }}</h2>
                <form @submit.prevent="submitSupport">
                    <input type="text" v-model="form.name" placeholder="ชื่อ-นามสกุล" required />
                    <input type="text" v-model="form.phone" placeholder="เบอร์โทรศัพท์" required />
                    <input type="date" v-model="form.date" required />
                    <input type="file" @change="handleFileUpload" accept="image/*" required />
                    <textarea v-model="form.note" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"></textarea>

                    <div class="form-buttons">
                        <button type="submit" class="confirm">ยืนยัน</button>
                        <button type="button" class="cancel" @click="closeForm">ยกเลิก</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const packages = [
    {
        name: "ยักษ์ขาว #1",
        price: "4,000",
        features: [
            { text: "✔ เชื่อมต่อผ่าน WiFi", included: true },
            { text: "✔ เชื่อมกับ แอพยักษ์ขาว", included: true },
            { text: "✔ อแดปเตอร์", included: true },
            { text: "✘ เชื่อมต่อ 3G/4G", included: false },
            { text: "✘ ระบบพลังแสงอาทิตย์", included: false }
        ]
    },
    {
        name: "ยักษ์ขาว #2",
        price: "6,000",
        features: [
            { text: "✔ เชื่อมต่อผ่าน WiFi", included: true },
            { text: "✔ เชื่อมกับ แอพยักษ์ขาว", included: true },
            { text: "✔ อแดปเตอร์", included: true },
            { text: "✔ เชื่อมต่อผ่าน 3G/4G", included: true },
            { text: "✘ ระบบพลังแสงอาทิตย์", included: false }
        ]
    },
    {
        name: "ยักษ์ขาว #3",
        price: "10,000",
        features: [
            { text: "✔ เชื่อมต่อผ่าน WiFi", included: true },
            { text: "✔ เชื่อมกับ แอพยักษ์ขาว", included: true },
            { text: "✔ อแดปเตอร์", included: true },
            { text: "✔ เชื่อมต่อผ่าน 3G/4G", included: true },
            { text: "✔ ระบบพลังแสงอาทิตย์", included: true }
        ]
    }
];

const showForm = ref(false);
const selectedPackage = ref(null);
const form = ref({
    name: '',
    phone: '',
    date: '',
    note: '',
    slip: null
});

const openForm = (pkg) => {
    selectedPackage.value = pkg;
    showForm.value = true;
};

const closeForm = () => {
    showForm.value = false;
    form.value = {
        name: '',
        phone: '',
        date: '',
        note: '',
        slip: null
    };
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // แปลงไฟล์เป็น Base64
    const reader = new FileReader();
    reader.onload = () => {
        form.value.slip = reader.result; // เก็บค่า Base64 string
    };
    reader.readAsDataURL(file);
};

const submitSupport = async () => {
    try {
        // รอให้แปลงไฟล์เสร็จก่อน (ถ้ายังไม่เสร็จ)
        if (!form.value.slip.startsWith('data:')) {
            alert('กรุณารอสักครู่ กำลังประมวลผลรูปภาพ');
            return;
        }

        const messageText = `
        ยืนยันการสนับสนุนเครื่องวัดฝุ่น
        แพ็กเกจ: ${selectedPackage.value.name}
        ราคา: ${selectedPackage.value.price} บาท
        ชื่อ: ${form.value.name}
        เบอร์โทร: ${form.value.phone}
        วันที่โอน: ${form.value.date}
        หมายเหตุ: ${form.value.note || '-'}`;

        // ส่งข้อความและรูปภาพแยกกัน
        console.log('กำลังส่งข้อความ:', messageText);
        
        // ส่งข้อความ
        await sendMessageToLine(messageText);
        
        // ส่งรูปภาพ
        await sendImageToLine(form.value.slip);
        
        alert("ข้อมูลถูกส่งเรียบร้อยแล้ว! ขอบคุณสำหรับการสนับสนุน");
        closeForm();
    } catch (error) {
        console.error('Error in submitSupport:', error);
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
};

// LINE OA
const sendMessageToLine = async (messageText) => {
    try {
        console.log('กำลังส่งข้อความ:', messageText);

        const response = await fetch("http://localhost:3000/api/line-notify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: messageText
            })
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`API Error: ${JSON.stringify(responseData)}`);
        }

        const responseData = await response.json();
        console.log('Response Data:', responseData);
        
    } catch (error) {
        console.error("รายละเอียดข้อผิดพลาด:", {
            message: error.message,
            stack: error.stack
        });
        alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
        throw error;
    }
};

// เพิ่มฟังก์ชันสำหรับส่งรูปภาพ
const sendImageToLine = async (base64Image) => {
    try {
        const response = await fetch("http://localhost:3000/api/line-notify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: {
                    type: "image",
                    originalContentUrl: base64Image,
                    previewImageUrl: base64Image
                }
            })
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`API Error: ${JSON.stringify(responseData)}`);
        }

        const responseData = await response.json();
        console.log('Image Response Data:', responseData);
    } catch (error) {
        console.error("รายละเอียดข้อผิดพลาด (รูปภาพ):", error);
        throw error;
    }
};
</script>

<style>
body {
    font-family: 'Sarabun', sans-serif;
    background-color: #070d22;
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
    color: #f02a51;
    margin-bottom: 20px;
}

.support-text {
    text-align: center;
    font-size: 18px;
    margin-bottom: 40px;
}

.bank-details {
    background: #fff;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 40px;
    text-align: center;
}

.bank-details h2 {
    font-size: 24px;
    margin-bottom: 10px;
}

.packages {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.package {
    background: #fff;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    flex: 1 1 300px;
    max-width: 300px;
}

.package h3 {
    color: #f02a51;
}

.package .price {
    font-size: 24px;
    font-weight: bold;
    margin: 20px 0;
}

.package .support-button {
    background: #f02a51;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.package .support-button:hover {
    background: #d92041;
}

.grey-text {
    color: #b8b6b6;
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
</style>
