<template>
  <div class="team">
    <v-card id="printable" class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> معلومات طلب التسجيل للطالب </h1>
      <h2 class="text-center subtitle-4 black--text">{{ data.name }}</h2>
      <v-row class="mt-5">
        <v-col md="5" sm="12" cols="12">
          <img v-if="data.image" :src="content_url + data.image" alt="" width="300"
            height="200" />
          <img v-else src="@/assets/img/default_profile.png" alt="" width="200" height="200" />
        </v-col>
        <v-col md="7" sm="12" cols="12">
          <!-- sname -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">الاسم </span> {{ data.name }}
          </div>
          <!-- birthday -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">تاريخ الميلاد </span> {{ data.birthday }}
          </div>
          <!-- currentStage -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">المرحلة الدراسية الحالية</span> {{ data.currentStage }}
          </div>
          <!-- brotherNumbers -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">عدد الاخوة</span> {{ data.brotherNumbers }}
          </div>
          <!-- sequence -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">التسلسل بين اخوتة</span> {{ data.sequence }}
          </div>
          <!-- liveWithParents -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">هل يقيم مع ابويه</span> <v-icon v-if="data.liveWithParents" color="green"> fa-check </v-icon>
                  <v-icon v-else color="red"> fa-times </v-icon>
          </div>
           <!-- reason -->
           <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">مع من يقيم</span> {{ data.reason }}
          </div>
           <!-- fathersStudy -->
           <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">التحصيل الدراسي للاب</span> {{ data.fathersStudy }}
          </div>
          <!-- fathersJob -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">عمل الاب</span> {{ data.fathersJob }}
          </div>
          <!-- mothersStudy -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">التحصيل الدراسي للام</span> {{ data.mothersStudy }}
          </div>
          <!-- mothersJob -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">عمل الام</span> {{ data.mothersJob }}
          </div>
          <!-- previouslyKindergartenName -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">اسم الروضة سابقا</span> {{ data.previouslyKindergartenName }}
          </div>
          <!-- reasonSchoolName -->
          <div class="py-2 px-2 d-flex justify-space-between gap-2" style="border: 1px solid cyan">
            <span class="primary--text ml-5">سبب النقل من الروضة الحالية</span> {{ data.reasonSchoolName }}
          </div>
          <!-- address -->
          <div class="py-2 px-2 d-flex justify-space-between gap-2" style="border: 1px solid cyan">
            <span class="primary--text ml-5">العنوان - م - ز - د</span> {{ data.address + ' - ' + data.house
 + ' - ' + data.alley + ' - ' + data.locality }}
          </div>
          <!-- nearestPoint -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">اقرب نقطة دالة</span> {{ data.nearestPoint }}
          </div>
          <!-- fatherPhone -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">هاتف الاب</span> {{ data.fatherPhone }}
          </div>
          <!-- motherPhone -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">هاتف الام</span> {{ data.motherPhone }}
          </div>
           <!-- is_allergic -->
           <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">هل لدى الطفل اي نوع من الحساسية</span> <v-icon v-if="data.is_allergic" color="green"> fa-check </v-icon>
                  <v-icon v-else color="red"> fa-times </v-icon>
          </div>
          <!-- allergic -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">اذكر نوع الحساسية</span> {{ data.allergic }}
          </div>
          <!-- diseases -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text ml-5">هل لدى الطفل اي نوع من الامراض المزمنة</span> {{ data.diseases }}
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
        name: null,
        image: null,
        birthday: null,
        currentStage: null,
        sequence: null,
        staying_with: null,
        father_degree: null,
        father_jop: null,
        mother_degree: null,
        mother_jop: null,
        past_Kindergarten: null,
        school_name: null,
        reasonSchoolName: null,
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
    const data = JSON.parse(localStorage.getItem('kindergartenReqDetails'))
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
