<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <v-row align="center" justify="center">
          <h3 class="mr-3 text--bold my-5"> اختيار الصف والشعبة </h3>
        </v-row>
        <v-form v-model="isFormValidAdd">
          <v-row align="center" justify="center">
            <v-col cols="12" sm="6">
              <v-autocomplete v-model="data.chooseClass" :items="class_select" :loading="classLoading"
                :item-text="item => item.class_name + ' - ' + item.leader" :rules="addRules.classRules" clearable
                label="الصف والشعبة" solo return-object></v-autocomplete>
              <!-- <v-select
                v-model="data.chooseClass"
                :items="class_select"
                :loading="classLoading"
                item-text="classes_name"
                item-value="classes_id"
                :rules="addRules.classRules"
                clearable
                label="الصف"
                solo
                @click:clear="
                  (data.chooseClass = null), (data.chooseLeader = null)
                "
                @change="FilteredLeaderArray"
              ></v-select> -->
            </v-col>
          </v-row>
          <!-- <v-row
            align="center"
            justify="center"
          >
            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                v-model="data.chooseLeader"
                :items="leader_select_filter"
                item-text="class_school_leader"
                item-value="class_school_id"
                :rules="addRules.leaderRules"
                clearable
                label="الشعبة"
                solo
                @click:clear="data.chooseLeader = null"
                @change="getClassAndSchoolName($event)"
              ></v-select>
            </v-col>
          </v-row> -->
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
import Api from '../../../../api/api'

export default {
  data() {
    return {
      isFormValidAdd: false,

      class_select: [],

      leader_select: [],

      leader_select_filter: [],

      data: {
        chooseClass: null,
        chooseLeader: null,
      },

      classLoading: false,

      addRules: {
        classRules: [value => !!value || 'يجب اختيار الصف'],
        leaderRules: [value => !!value || 'يجب اختيار الشعبة'],
      },
      selected_class_school: {},
    }
  },
  created() {
    this.getClassSchool()
  },
  methods: {
    goToStudentPage() {
      this.$router.push(
        `/showAbsence/show/${this.data.chooseClass._id}/${this.data.chooseClass.class_name}_${this.data.chooseClass.leader}`,
      )
    },
    async getClassAndSchoolName(event) {
      this.selected_class_school = await this.selectClassAndSchoolNameFromId(event)
    },
    selectClassAndSchoolNameFromId(class_school_id) {
      const { leader_select } = this
      for (const key in leader_select) {
        if (leader_select[key].class_school_id === class_school_id) {
          return leader_select[key]
        }
      }
    },
    // getClassSchool() {
    //   this.classLoading = true
    //   this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    //   this.$http
    //     .get('teacher/classSchool')
    //     .then(Response => {
    //       this.classLoading = false
    //       if (Response.data.results === 'غير مصرح') {
    //         this.$store.dispatch('submitLogout')
    //       } else if (Response.data.error === false) {
    //         this.class_select = Response.data.results
    //         this.leader_select = Response.data.results
    //       }
    //     })
    //     .catch(error => {
    //       this.classLoading = false
    //       console.log(error)
    //     })
    // },
    // },
    async getClassSchool() {
      this.classLoading = true

      const response = await Api.getClassSchool()
      console.log('response', response)
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.classLoading = false

        this.class_select = response.data.results
        // this.leader_select = response.data.results
      }
    },

    FilteredLeaderArray() {
      const { chooseClass } = this.data
      console.log('chooseClass', chooseClass)
      const leader = this.leader_select
      this.leader_select_filter = []
      if (chooseClass) {
        for (let i = 0; i < leader.length; i++) {
          if (leader[i].class_school_forclass == chooseClass) {
            this.leader_select_filter.push(leader[i])
          }
        }
      } else {
        this.leader_select_filter = []
      }
    },
  },
}
</script>
