<template>
  <section id="supporters" class="py-12 px-4 md:px-12 rounded-lg">
    <div class="container mx-auto text-center">
      <h2 class="text-2xl font-bold mb-8 text-white">ผู้สนับสนุนโครงการ</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div v-for="(sponsor, index) in sponsors" :key="index" class="supporter-item text-center">
          <img :src="sponsor.image" class="w-full h-auto object-contain mx-auto" alt="Sponsor Logo" />
          <p class="mt-2 text-sm font-medium text-black">{{ sponsor.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const sponsors = ref([
  { image: 'https://yakkaw.mfu.ac.th/img/gallery/1.jpg', name: 'สมาคมยักษ์ขาว' },
  { image: 'https://e-cms.rmutl.ac.th/assets/upload/images/2018/11/55_20181114104824.png', name: 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนาเชียงราย' },
  { image: 'https://crru.ac.th/wp-content/uploads/2023/10/%E0%B8%A1%E0%B8%A3%E0%B8%8A%E0%B8%A3.webp', name: 'มหาวิทยาลัยราชภัฏเชียงราย' },
  { image: 'https://upload.wikimedia.org/wikipedia/th/d/da/%E0%B8%AA%E0%B8%B1%E0%B8%8D%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%B3%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%A7%E0%B8%87.png', name: 'มหาวิทยาลัยแม่ฟ้าหลวง' },
  { image: 'http://datascience.mfu.ac.th/LOGO-AIE%20_New.png', name: 'ศูนย์วิจัยปัญญาประดิษฐ์และเทคโนโลยี'}, 
  { image: 'https://cen-ffh.mfu.ac.th/fileadmin/MFUTemplateStandard/Assets/images/logo/logo_CEN-FFH.png', name: 'ศูนย์ศึกษา วิจัยและปฏิบัติการเพื่อลดปัญหาการเกิดไฟป่า หมอกควันในประเทศไทยและในภูมิภาค' }, 
  { image: 'https://childimpact.s3.ap-southeast-1.amazonaws.com/campaign-img/campaign-1-1.jpg', name: 'ห้องเรียนสู้ฝุ่น' },
  { image: 'https://ird.rmutp.ac.th/wp-content/uploads/%E0%B8%82%E0%B8%99%E0%B8%B2%E0%B8%94-5057-1.png', name: 'สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)' },
  { image: 'https://thaipublica.org/wp-content/uploads/2022/11/logo-set-1000x600-1.jpg', name: 'ตลาดหลักทรัพย์แห่งประเทศไทย' },
  { image: 'https://www.srithat-ud.go.th/index/add_file/rPNgLItFri24523.png', name: 'เทศบาลตำบลศรีธาตุ' },
  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFohZP9a0qrVv-C7uQrdASgFLTjmUtKM2hB87Lf8lUEbiZO1MF_sRmmojvw1ZD3SYwHUU&usqp=CAU', name: 'AIS NB-IoT' },
  { image: 'https://www.setsocialimpact.com/upload/SET/w87pYJbHfF6Bg35lOGaM_full.png', name: 'ห้างหุ้นส่วนจำกัด เติมเต็มวิสาหกิจเพื่อสังคม' },
]);
console.log(sponsors.value);

</script>

<style scoped>
.supporter-item img {
  transition: transform 0.3s ease-in-out;
}
.supporter-item img:hover {
  transform: scale(1.1);
}

/* ✅ ปรับขนาดและพื้นหลังของรูป */
.supporter-item img {
  width: 150px; 
  height: 150px; 
  object-fit: contain; 
  background-color: white; 
  border-radius: 10px; 
  padding: 10px; 
}

/* ✅ จัดให้รูปอยู่ตรงกลาง */
.supporter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: white; 
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); 
}

/* เพิ่มระยะห่างจากขอบจอ */
section {
  padding-left: 16px;  
  padding-right: 16px; 
}
</style>
