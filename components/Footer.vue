<template>
  <footer class="bg-white text-black py-6 px-4">
    <div class="container mx-auto flex justify-between space-x-4">
      <!-- เกี่ยวกับเรา -->
      <div class="w-1/3 bg-gray-100 border border-gray-300 rounded-lg p-3">
        <h2 class="text-xl font-bold mb-2 p-2">เกี่ยวกับเรา</h2>
        <p class="text-sm leading-relaxed indent-4">
          สมาคมยักษ์ขาวก่อตั้งขึ้นเพื่อเป็นตัวกลางในการตรวจติดตามปัญหาฝุ่นควันของประเทศไทย
          โดยเริ่มต้นจากจังหวัดเชียงราย และเครือข่ายจังหวัดในภาคเหนือ.
          พร้อมทั้งแจกจ่ายอุปกรณ์วัดค่าฝุ่นเพื่อแจ้งเตือนประชาชนในพื้นที่ ในการเตรียมพร้อมรับมือ ตามหลักการธงสุขภาพ
          เพื่อสุขภาพอันดีของประชาชนชาวไทย
          ภายใต้สถานการณ์ฝุ่นควันพิษในอากาศ PM2.5
        </p>
      </div>

      <!-- สถานที่ดำเนินการ -->
      <div class="w-1/3 bg-gray-100 border border-gray-300 rounded-lg p-3">
        <h3 class="text-lg font-bold mb-2 p-2">สถานที่ดำเนินการ</h3>
        <p class="text-sm indent-4">จังหวัดเชียงราย และเครือข่ายจังหวัดในภาคเหนือ</p>
      </div>

      <!-- เริ่มต้นเมื่อ -->
      <div class="w-1/3 bg-gray-100 border border-gray-300 rounded-lg p-3">
        <h3 class="text-lg font-bold mb-2 p-2">เริ่มต้นเมื่อ</h3>
        <p class="text-sm indent-4">29 ส.ค. 2562</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// You can add any logic here if needed
</script>

<style scoped>
/* ปรับแต่งฟุตเตอร์ */
footer {
  background-color: white; /* พื้นหลังสีขาว */
  color: black;
  padding-top: 30px;
  padding-bottom: 30px;
  background-image: url('https://asset.readme.me/files/41145/cover.jpgnp'); /* ใส่ URL ของรูปภาพที่ต้องการ */
  background-size: cover; /* ทำให้รูปครอบคลุมทั้งพื้นที่ */
  background-position: contain; /* จัดตำแหน่งรูปให้ตรงกลาง */
  background-repeat: no-repeat; /* ไม่ให้รูปซ้ำ */
}

/* การจัดการฟุตเตอร์ */
.container {
  display: flex;
  justify-content: space-between;
  gap: 1rem; /* ลดระยะห่างระหว่างคอลัมน์ */
}

/* ปรับขนาดและการจัดการข้อความ */
h2, h3 {
  font-size: 1.25rem; /* ปรับขนาดหัวข้อ */
  margin-bottom: 0.75rem;
  padding: 8px;
}

p {
  font-size: 0.875rem; /* ขนาดตัวหนังสือเล็กลง */
  line-height: 1.4;
  text-align: left;
  margin-left: 1rem;
  color: #333;
  white-space: normal;
}

.indent-4 {
  text-indent: 1rem; /* การย่อหน้า */
}

/* ปรับให้แต่ละกล่องมีกรอบและพื้นหลัง */
footer .container div {
  background-color: rgba(245, 245, 245, 0.8); /* พื้นหลังสีเทาอ่อน */
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* เงาอ่อน ๆ */
  border: 1px solid #e0e0e0; /* กรอบสีเทาอ่อน */
}
</style>
