<template>
    <Header />
    <div class="container">
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
                <button class="support-button" @click="supportPackage(pkg)">สนับสนุน</button>
            </div>
        </div>
    </div>
</template>

<script setup>
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

const accessToken = "3Ok9sDtpWsj1PEwlQLs99NNV8ts4WS+mTUNbryXZLwveWhJYu5Zxy2KKM7OCFChWIR3LsG4dWYePq6XegKqn5b9/GuZzzCVbXXhyQ4Oi8CIFFKVr48q/Nq0amToB2OhXmHpZscds/MX4Hgj1hgb0IAdB04t89/1O/w1cDnyilFU=";  // ใส่ Channel Access Token ใหม่
const userId = "blank";  // ใช้ User ID หรือ Group ID ของ LINE OA

const sendMessageToLine = async (messageText) => {
    const message = {
        type: "text",
        text: messageText
    };

    try {
        const response = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${"3Ok9sDtpWsj1PEwlQLs99NNV8ts4WS+mTUNbryXZLwveWhJYu5Zxy2KKM7OCFChWIR3LsG4dWYePq6XegKqn5b9/GuZzzCVbXXhyQ4Oi8CIFFKVr48q/Nq0amToB2OhXmHpZscds/MX4Hgj1hgb0IAdB04t89/1O/w1cDnyilFU="}` // ใส่ Channel Access Token ของคุณ
            },
            body: JSON.stringify({
                to: "blank", // ส่งข้อความไปที่ User หรือ Group ของ LINE OA
                messages: [message]
            })
        });

        const responseData = await response.json();
        if (response.ok) {
            console.log("ข้อความถูกส่งไปยัง LINE OA เรียบร้อยแล้ว!");
            alert("การสั่งซื้อถูกส่งไปยัง LINE OA เรียบร้อย!");
        } else {
            console.error("ไม่สามารถส่งข้อความได้", responseData);
            alert(`เกิดข้อผิดพลาด: ${responseData.error.message}`);
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการส่งข้อความ", error);
        alert("เกิดข้อผิดพลาดในการส่งข้อความไป LINE");
    }
};

const supportPackage = (pkg) => {
    const messageText = `📢 ลูกค้าสนใจสนับสนุนเครื่องวัดฝุ่น 🎉\n\nแพ็กเกจ: ${pkg.name}\nราคา: ${pkg.price} บาท\n\n📌 ขอบคุณสำหรับการสนับสนุน!`;

    // ส่งข้อความไป LINE OA
    sendMessageToLine(messageText);

    // ลิงก์เชื่อมต่อไปยัง LINE OA
    window.location.href = "https://line.me/R/ti/p/@606phsmk";
};
</script>


<style>
body {
    font-family: 'Sarabun', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #070d22;
    color: #333;
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
    color: #ffffff;
}

.bank-details {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
    text-align: center;
}

.bank-details h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.bank-details p {
    font-size: 16px;
    color: #555;
    margin: 5px 0;
}

.packages {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.package {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    flex: 1 1 300px;
    max-width: 300px;
}

.package h3 {
    font-size: 22px;
    color: #f02a51;
    margin-bottom: 15px;
}

.package p {
    font-size: 16px;
    color: #555;
    margin: 10px 0;
}

.package .price {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 20px 0;
}

.package .support-button {
    background: #f02a51;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.package .support-button:hover {
    background: #d92041;
}

.grey-text {
    color: #b8b6b6;
}
</style>
