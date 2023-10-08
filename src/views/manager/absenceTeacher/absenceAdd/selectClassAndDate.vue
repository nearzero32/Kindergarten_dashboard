<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <v-row
          align="center"
          justify="center"
        >
          <h3 class="mr-3 text--bold my-5">
            اختيار التاريخ
          </h3>
        </v-row>
        <v-form v-model="isFormValidAdd">
          <v-row
            align="center"
            justify="center"
          >
            <v-col
              cols="12"
              sm="6"
            >
              <v-menu
                v-model="menuAccountStartDate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="data.date"
                    :rules="addRules.date"
                    label="التاريخ"
                    outlined
                    clearable
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="data.date"
                  @input="menuAccountStartDate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>

        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="6"
          >
            <v-btn
              depressed
              color="primary"
              :disabled="!isFormValidAdd"
              @click="goToAbsensePage"
            >
              عرض
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isFormValidAdd: false,

      menuAccountStartDate: false,

      class_select: [],

      leader_select: [],

      leader_select_filter: [],

      data: {
        chooseClass: null,
        chooseLeader: null,
        date: this.getCurrentDate(),
      },

      classLoading: false,

      addRules: {
        classRules: [value => !!value || 'يجب اختيار الصف'],
        leaderRules: [value => !!value || 'يجب اختيار الشعبة'],
        date: [value => !!value || 'يجب اختيار التاريخ'],
      },
      selected_class_school: {},
    }
  },
  created() {},
  methods: {
    goToAbsensePage() {
      this.$router.push(`/absenceTeacher/add/${this.data.date}`)
    },
    getCurrentDate() {
      const d = new Date()
      let month = `${d.getMonth() + 1}`
      let day = `${d.getDate()}`
      const year = d.getFullYear()

      if (month.length < 2) {
        month = `0${month}`
      }
      if (day.length < 2) {
        day = `0${day}`
      }

      return [year, month, day].join('-')
    },
  },
}
</script>
