<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text">
        اقساط الطالب
      </h1>
      <h2 class="text-center subtitle-5 black--text">
        ({{ $route.params.name }})
      </h2>
      <!-- <div class="mb-2 d-flex justify-end">
        <v-btn
          color="warning"
          @click="goToPrintPage"
        >
          طباعة
        </v-btn>
      </div> -->
      <v-row
        v-if="isPageNotLoading"
        class="mt-5"
      >
        <v-col cols="12">
          <v-card
            class="mx-auto pa-2"
            elevation="6"
            max-width="400"
            tile
          >
            <div class="d-flex mb-2 justify-space-between">
              <span class="display-1">القسط الكلي</span>
              <v-chip
                color="primary"
                outlined
                label
              >
                {{
                  salary
                }}
              </v-chip>
            </div>
            <div class="d-flex mb-2 justify-space-between">
              <span class="display-1">الواصل</span>
              <v-chip
                color="#388E3C"
                outlined
                label
              >
                {{
                  payment
                }}
              </v-chip>
            </div>
            <div class="d-flex mb-2 justify-space-between">
              <span class="display-1">الخصم</span>
              <v-chip
                color="#E57373"
                outlined
                label
              >
                {{
                  discount
                }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between">
              <span class="display-1">المتبقي</span>
              <v-chip
                color="primary"
                outlined
                label
              >
                {{
                  allSalary
                }}
              </v-chip>
            </div>
          </v-card>
          <div class="d-flex justify-space-between align-center mt-3">
            <p class="mt-5">
              * تاريخ الدفعة القادمة
              <span style="color: blue">{{ nextPayment }}</span>
            </p>
            <v-btn
              color="primary"
              @click="goToDetailsPage"
            >
              التفاصيل
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row
        v-else
        class="mt-10 mb-2 d-flex justify-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPageNotLoading: true,
      discount: 0,
      payment: 0,
      salary: 0,
      allSalary: 0,
      nextPayment: '',
    }
  },
  async mounted() {
    this.getSalaryAxios()
  },
  methods: {
    getSalaryAxios() {
      this.isPageNotLoading = false
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get(`salaryStudent/${this.$route.params.id}`)
        .then(Response => {
          this.isPageNotLoading = true
          if (Response.data.results.length) {
            const { results } = Response.data

            this.assignData(results)
            this.allSalary = Response.data.salary_all
            this.nextPayment = Response.data.next_payment
          }
        })
        .catch(error => {
          this.isPageNotLoading = true
          console.log('error', error)
        })
    },
    async assignData(list) {
      // eslint-disable-next-line no-restricted-syntax
      for (const iterator of list) {
        if (iterator.salary_student_type === 'discount') {
          this.discount = iterator.salary_student_salary
        }
        if (iterator.salary_student_type === 'salary') {
          this.salary = iterator.salary_student_salary
        }
        if (iterator.salary_student_type === 'payment') {
          this.payment += iterator.salary_student_salary
        }
      }
    },
    goToDetailsPage() {
      this.$router.push(
        `/students/studentProfile/studentSalaryDetails/${this.$route.params.id}/${this.$route.params.name}`,
      )
    },

    // goToPrintPage() {
    //   this.$router.push('/salaryPrint')
    // },
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
