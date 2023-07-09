<template>
  <div class="team">
    <v-card id="printable" class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> معلومات طلب التسجيل للطالب </h1>
      <h2 class="text-center subtitle-4 black--text">{{ data.student_name }}</h2>
      <v-row class="mt-5">
        <v-col md="5" sm="12" cols="12">
          <img v-if="data.student_image" :src="content_url + data.student_image" alt="" width="300"
            height="200" />
          <img v-else src="@/assets/img/default_profile.png" alt="" width="200" height="200" />
        </v-col>
        <v-col md="7" sm="12" cols="12">
          <!-- student_name -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">الاسم </span> {{ data.student_name }}
          </div>
          <!-- student_birthday -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">تاريخ الميلاد </span> {{ data.student_birthday }}
          </div>
          <!-- student_class -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">المرحلة الدراسية الحالية</span> {{ data.student_class }}
          </div>
          <!-- student_brother_number -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">عدد الاخوة</span> {{ data.student_brother_number }}
          </div>
          <!-- student_brother_rank -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">التسلسل بين اخوتة</span> {{ data.student_brother_rank }}
          </div>
          <!-- student_brother_rank -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">هل يقيم مع ابويه</span> <v-icon v-if="data.is_staying_with_his_fathers" color="green"> fa-check </v-icon>
                  <v-icon v-else color="red"> fa-times </v-icon>
          </div>
           <!-- student_brother_rank -->
           <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">مع من يقيم</span> {{ data.student_staying_with }}
          </div>
           <!-- father_degree -->
           <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">التحصيل الدراسي للاب</span> {{ data.father_degree }}
          </div>
          <!-- father_jop -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">عمل الاب</span> {{ data.father_jop }}
          </div>
          <!-- mother_degree -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">التحصيل الدراسي للام</span> {{ data.mother_degree }}
          </div>
          <!-- mother_jop -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">عمل الام</span> {{ data.mother_jop }}
          </div>
          <!-- past_Kindergarten -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">اسم الروضة سابقا</span> {{ data.past_Kindergarten }}
          </div>
          <!-- school_name -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">اسم المدرسة الحالية</span> {{ data.school_name }}
          </div>
          <!-- past_school_reason -->
          <div class="py-2 px-2 d-flex justify-space-between gap-2" style="border: 1px solid cyan">
            <span class="primary--text ml-5">سبب النقل من المدرسة الحالية</span> {{ data.past_school_reason }}
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
            <span class="primary--text ml-5">هاتف الاب</span> {{ data.father_phone }}
          </div>
          <!-- mother_phone -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">هاتف الام</span> {{ data.mother_phone }}
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
    const data = JSON.parse(localStorage.getItem('schoolReqDetails'))
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
