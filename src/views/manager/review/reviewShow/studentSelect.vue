<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <v-row align="center" justify="center">
          <h3 class="mr-3 text--bold my-5"> اختيار طالب </h3>
        </v-row>
        <v-form v-model="isFormValidAdd">
          <v-row align="center" justify="center">
            <v-col cols="12" sm="6">
              <v-autocomplete v-model="data.chooseStudent" :loading="studentLoading" :items="studentsData"
                item-text="account_name" item-value="_id" clearable outlined return-object :rules="addRules.studentRule"
                label="اختيار طالب" dense @click:clear="data.chooseStudent = null"></v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6">
            <v-btn depressed color="primary" :disabled="!isFormValidAdd" @click="goToStudentPage"> عرض </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import Api from '@/api/api'

export default {
  data() {
    return {
      isFormValidAdd: false,

      studentsData: [],

      data: {
        chooseStudent: null,
      },

      studentLoading: false,

      addRules: {
        studentRule: [value => !!value || 'يجب اختيار طالب'],
      },
    }
  },
  created() {
    this.getStudents()
  },
  methods: {
    goToStudentPage() {
      this.$router.push(
        `/showReview/show/details/${this.data.chooseStudent._id}/${this.data.chooseStudent.account_name}`,
      )
    },

    async getStudents() {
      this.studentLoading = true
      const response = await Api.getAllStudents()

      if (response.status === 401) {
        this.studentLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.studentLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.studentLoading = false
        this.studentsData = response.data.results
      }
    },
  },
}
</script>
