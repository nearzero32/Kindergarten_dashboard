<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-bottom-navigation :value="value" color="#00BCD4">
        <v-btn @click="selectedCompnent = 'Home'">
          <span class="pa-1">عام</span>
          <v-icon>fa-home</v-icon>
        </v-btn>
        <v-btn @click="selectedCompnent = 'Edit'">
          <span>تعديل</span>
          <v-icon>fa-edit</v-icon>
        </v-btn>
        <v-btn @click="selectedCompnent = 'EditImages'">
          <span>تعديل المستمسكات</span>
          <v-icon>fa-edit</v-icon>
        </v-btn>
        <!-- <v-btn
          @click="selectedCompnent = 'StudentSalay'"
        >
          <span>اقساط الطالب</span>

          <v-icon>fas fa-money-bill-alt</v-icon>
        </v-btn> -->
      </v-bottom-navigation>
      <component :is="selectedCompnent"></component>
    </v-container>
  </div>
</template>
<script>
import Edit from './studentProfileInfo/edit.vue'
import EditImages from './studentProfileInfo/editImages.vue'
import Home from './studentProfileInfo/home.vue'

// import StudentSalay from './studentProfileInfo/studentSalary.vue'

export default {
  // components: { Home, Edit, StudentSalay },
  components: { Home, Edit, EditImages },
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
