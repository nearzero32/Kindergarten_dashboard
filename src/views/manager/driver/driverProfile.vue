<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-bottom-navigation
        :value="value"
        color="#00BCD4"
      >
        <v-btn
          @click="selectedCompnent = 'Home'"
        >
          <span>عام</span>
          <v-icon>fa-home</v-icon>
        </v-btn>
        <v-btn
          @click="selectedCompnent = 'Edit'"
        >
          <span>تعديل</span>

          <v-icon>fa-edit</v-icon>
        </v-btn>
        <v-btn
          @click="selectedCompnent = 'AddStudentToDriver'"
        >
          <span>اضافة طلاب للسائق</span>

          <v-icon>fa-user-plus</v-icon>
        </v-btn>
        <v-btn
          @click="selectedCompnent = 'DeleteStudentFromDriver'"
        >
          <span>حذف طلاب السائق</span>

          <v-icon>fa-user-minus</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <component :is="selectedCompnent"></component>
    </v-container>
  </div>
</template>
<script>
import Edit from './driverProfile/edit.vue'
import Home from './driverProfile/home.vue'
import AddStudentToDriver from './driverProfile/addStudentToDriver.vue'
import DeleteStudentFromDriver from './driverProfile/deleteStudentDriver.vue'

export default {
  components: {
    Home,
    Edit,
    AddStudentToDriver,
    DeleteStudentFromDriver,
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
