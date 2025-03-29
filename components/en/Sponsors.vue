<template>
    <section id="supporters" class="bg-[#070d22] py-12 px-4 md:px-12 rounded-lg">
      <div class="container mx-auto text-center">
        <h2 class="text-2xl font-bold mb-8 text-white">Sponsored by</h2>
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
    { image: 'https://yakkaw.mfu.ac.th/img/gallery/1.jpg', name: 'Yakkaw' },
    { image: 'https://upload.wikimedia.org/wikipedia/th/0/02/LANNAcolor.png', name: 'Rajamangala University of Technology Lanna Chiang Rai' },
    { image: 'https://upload.wikimedia.org/wikipedia/th/thumb/7/72/%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A0%E0%B8%B1%E0%B8%8F%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A2.png/255px-%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A0%E0%B8%B1%E0%B8%8F%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A2.png', name: 'Chiang Rai Rajabhat University' },
    { image: 'https://upload.wikimedia.org/wikipedia/th/d/da/%E0%B8%AA%E0%B8%B1%E0%B8%8D%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%B3%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%A7%E0%B8%87.png', name: 'Mae Fah Luang University' },
    { image: 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t39.30808-6/318538620_576304597834323_1976464744004569559_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=yFzBKqZ7JU8Q7kNvgGPfvuG&_nc_oc=AdjzfeirhUV-gE8B8YzGQrIMwSvzjMtSa_mgV5wNnYiI9x9fI5IXnwatnEJyhtGqm3JuKBg6tEIWfIr631M-GOFu&_nc_zt=23&_nc_ht=scontent.fbkk5-1.fna&_nc_gid=f-vbLP7QIcZidnq3tGh4dQ&oh=00_AYHH6-XcfW1-yy92bSALaTq9ObX2sAEb1jdn4Yjx2zTkKQ&oe=67DC765C',
    name: 'Artificial Intelligence and Technology Research Center'}, 
    { image: 'https://cen-ffh.mfu.ac.th/fileadmin/MFUTemplateStandard/Assets/images/logo/logo_CEN-FFH.png', name: 'Center for study, research and operations to reduce forest fire problems. Smog in Thailand and the region' }, 
    { image: 'https://childimpact.s3.ap-southeast-1.amazonaws.com/campaign-img/campaign-1-1.jpg', name: 'Dust fighting classroom' },
    { image: 'https://ird.rmutp.ac.th/wp-content/uploads/%E0%B8%82%E0%B8%99%E0%B8%B2%E0%B8%94-5057-1.png', name: 'Thai Health Promotion Foundation (Thai Health Promotion Foundation)' },
    { image: 'https://thaipublica.org/wp-content/uploads/2022/11/logo-set-1000x600-1.jpg', name: 'Stock Exchange of Thailand' },
    { image: 'https://www.srithat-ud.go.th/index/add_file/rPNgLItFri24523.png', name: 'Si That Subdistrict Municipality' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFohZP9a0qrVv-C7uQrdASgFLTjmUtKM2hB87Lf8lUEbiZO1MF_sRmmojvw1ZD3SYwHUU&usqp=CAU', name: 'AIS NB-IoT' },
    { image: 'https://scontent.fbkk5-6.fna.fbcdn.net/v/t39.30808-1/339581923_239027631937303_7551303411814658283_n.jpg?stp=c97.0.1186.1186a_dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=apNHxWNPFQ8Q7kNvgG5H8BY&_nc_oc=Adi55bqjD8vLpSOqhxXORRGfZ6E09-2gbGD9YXTMncjvXre4fBFm29Bosv78hxBseBn9Na3k0JQ9f6mNuyCuLULZ&_nc_zt=24&_nc_ht=scontent.fbkk5-6.fna&_nc_gid=vheHR87I1qDizoJBiyeVMA&oh=00_AYFBA5cInDtufumFqPPNEZFjb4W6kT7LqafXTW-ZnIJJTw&oe=67DC787C', name: 'limited partnership Fulfill social enterprises' },
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
  