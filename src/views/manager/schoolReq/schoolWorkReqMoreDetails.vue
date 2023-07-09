<template>
  <div class="team">
    <v-card id="printable" class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> معلومات طلب العمل للشخص </h1>
      <h2 class="text-center subtitle-4 black--text">{{ data.name }}</h2>
      <v-row class="mt-5">
        <v-col md="5" sm="12" cols="12">
          <img v-if="data.image" :src="content_url + data.image" alt="" width="300"
            height="200" />
          <img v-else src="@/assets/img/default_profile.png" alt="" width="200" height="200" />
        </v-col>
        <v-col md="7" sm="12" cols="12">
          <!-- name -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">الاسم </span> {{ data.name }}
          </div>
          <!-- birthday -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">تاريخ الميلاد </span> {{ data.birthday }}
          </div>
          <!-- college -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">الجامعة</span> {{ data.college }}
          </div>
          <!-- year_graduate -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">سنة التخرج</span> {{ data.year_graduate }}
          </div>
          <!-- social_status -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">الحالة الاجتماعية</span> {{ data.social_status }}
          </div>
          <!-- past_school_reason -->
          <div class="py-2 px-2 d-flex justify-space-between gap-2" style="border: 1px solid cyan">
            <span class="primary--text ml-5">العنوان - م - ز - د</span> {{ data.address + ' - ' + data.address_m + ' - ' + data.address_z + ' - ' + data.address_d }}
          </div>
          <!-- nearest_landmark -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">اقرب نقطة دالة</span> {{ data.nearest_landmark }}
          </div>
          <!-- father_phone -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">الهاتف1</span> {{ data.phone1 }}
          </div>
          <!-- mother_phone -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">الهاتف2</span> {{ data.phone2 }}
          </div>
          <!-- تاريخ الاستمارة -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">تاريخ الاستمارة</span> {{ data.createdAt }}
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {
        student_name: null,
        student_image: null,
        student_birthday: null,
        student_class: null,
        student_brother_rank: null,
        student_staying_with: null,
        father_degree: null,
        father_jop: null,
        mother_degree: null,
        mother_jop: null,
        past_Kindergarten: null,
        school_name: null,
        past_school_reason: null,
        address: null,
        address_m: null,
        address_z: null,
        address_d: null,
        nearest_landmark: null,
        father_phone: null,
        mother_phone: null,
        is_staying_with_his_fathers: null,
        student_brother_number: null,
        createdAt: null,
      },
      content_url: null,
    }
  },

  created() {
    const data = JSON.parse(localStorage.getItem('schoolWorkReqMoreDetails'))
    this.data = data.item ? data.item : this.data
    this.content_url = data.content_url ? data.content_url : this.content_url
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
}
</style>
