<template>
  <div class="team">
    <v-bottom-navigation :value="value" color="#00BCD4">
      <v-btn @click="selectedCompnent = 'Home'">
        <span>عام</span>
        <v-icon>fa-home</v-icon>
      </v-btn>
      <v-btn @click="selectedCompnent = 'Edit'">
        <span class="pa-1">تعديل</span>
        <v-icon>fa-edit</v-icon>
      </v-btn>
      <!-- <v-btn
        @click="selectedCompnent = 'MonthlyPayment'"
      >
        <span class="pa-1">الراتب الشهري</span>

        <v-icon>fas fa-money-bill-alt</v-icon>
      </v-btn> -->
    </v-bottom-navigation>
    <component :is="selectedCompnent"></component>
  </div>
</template>
<script>
import Edit from './teacherProfileInfo/edit.vue'
import Home from './teacherProfileInfo/home.vue'
// import MonthlyPayment from './teacherProfileInfo/monthlyPayment.vue'

export default {
  components: {
    Home,
    Edit,
    // MonthlyPayment,
  },
  data() {
    return {
      value: 0,
      selectedCompnent: 'Home',
    }
  },
}
</script>

<style scoped>
.v-item-group.v-bottom-navigation .v-btn {
  padding: 30px;
}
</style>
