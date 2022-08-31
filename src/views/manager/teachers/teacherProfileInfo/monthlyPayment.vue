<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> الراتب للشهر الحالي </h1>
      <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
      <v-row v-if="isPageNotLoading" class="mt-5">
        <v-col cols="12">
          <v-card class="mx-auto pa-2" elevation="6" max-width="400" tile>
            <div class="d-flex mb-2 justify-space-between">
              <span class="display-1">الراتب المستحق</span>
              <v-chip color="primary"> {{ salary }} </v-chip>
            </div>
            <div class="d-flex mb-2 justify-space-between">
              <span class="display-1">الاستقطاع</span>
              <v-chip color="#E57373"> {{ withdraw }} </v-chip>
            </div>
            <div class="d-flex mb-2 justify-space-between">
              <span class="display-1">المكافاة</span>
              <v-chip color="#80CBC4"> {{ deposit }} </v-chip>
            </div>
            <div class="d-flex justify-space-between">
              <span class="display-1">المجموع</span>
              <v-chip color="primary"> {{ allSalary }} </v-chip>
            </div>
          </v-card>
          <div class="d-flex justify-space-between align-center">
            <p class="mt-5"> * هذا الراتب من <span style="color: blue">{{ startDate }}</span> الى <span
                style="color: blue">{{ endDate }}</span>
            </p>
            <v-btn color="primary" @click="goToDetailsPage"> التفاصيل </v-btn>
          </div>
        </v-col>
        <!-- <v-btn color="primary" @click="showTable = !showTable"
          >عرض التفاصيل</v-btn
        > -->
      </v-row>
      <v-row v-else class="mt-10 mb-2 d-flex justify-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import Api from '../../../../api/api'

export default {
  data() {
    return {
      isPageNotLoading: true,
      deposit: 0,
      withdraw: 0,
      salary: 0,
      allSalary: 0,
      startDate: '',
      endDate: '',
    }
  },
  async mounted() {
    this.getSalaryAxios()
  },
  methods: {
    async getSalaryAxios() {
      this.isPageNotLoading = false

      const response = await Api.getSalaryTeacher(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.isPageNotLoading = true
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.isPageNotLoading = true
        this.salary = response.data.results.salaryAmount
        this.startDate = response.data.results.salaryStartDate
        this.endDate = response.data.results.salaryEndDate
        this.withdraw = response.data.results.discountAmount
        this.deposit = response.data.results.depositAmount
        this.allSalary = response.data.results.deserveAmount
      }
    },
    goToDetailsPage() {
      this.$router.push(
        `/teachers/monthlyPaymentDetails/${this.$route.params.id}/${this.$route.params.name}/${this.startDate}/${this.endDate}`,
      )
    },
    getDepositAndWithdraw(results) {
      for (const key in results) {
        if (results[key].salary_type === 'withdraw') {
          this.withdraw += results[key].salary_amount
        }
        if (results[key].salary_type === 'deposit') {
          this.deposit += results[key].salary_amount
        }
      }
    },
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
}

a {
  text-decoration: none;
}
</style>
