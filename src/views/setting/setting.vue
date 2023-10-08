<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> الاعدادت </h1>
        <v-row class="mt-5">
          <!-- study year -->
          <v-col cols="12">
            <v-select v-model="addData.study_year" :items="studyYearData" item-text="setting_year" dense
              label="السنة الدراسية" outlined>
            </v-select>
          </v-col>
        </v-row>
        <div class="d-flex justify-center mt-2">
          <v-btn :loading="addBtnLoading" color="primary" @click="submitAdd()"> تعديل </v-btn>
          <v-btn class="mr-5" @click="cancelAdd()"> الغاء </v-btn>
        </div>
      </v-card>
    </v-container>
    <!--- Dailog for show info to user-->
    <v-dialog v-model="dialogData.open" max-width="500px">
      <v-toolbar :color="dialogData.color" dense></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center"> {{ dialogData.bodyText }} </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

export default {


  data() {
    return {
      studyYearData: [],
      addBtnLoading: false,
      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },
      addData: {
        study_year: null
      }
    }
  },

  created() {
    this.studyYearData = JSON.parse(localStorage.getItem("studyYearData"))
    this.addData.study_year = JSON.parse(localStorage.getItem("study_year"))
  },

  methods: {
    async submitAdd() {
      localStorage.setItem("study_year", JSON.stringify(this.addData.study_year))
    },

    cancelAdd() {
      this.$router.back(1)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    isNumber(evt) {
      const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
      const keyPressed = evt.key
      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }
    },
  },
}
</script>
