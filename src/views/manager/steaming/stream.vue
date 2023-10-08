<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text">
          البث المباشر
        </h1>
        <v-row class="mt-5">
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="table.headers"
              loading-text="جاري التحميل ... الرجاء الانتظار"
              :items="table.teacherData"
              :options.sync="tableOptions"
              :server-items-length="table.totalTeacherData"
              :loading="table.loading"
              class="elevation-1"
              :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }"
            >
              <template
                slot="item.zoom_learning_id"
                slot-scope="props"
              >
                {{
                  (tableOptions.page - 1) * tableOptions.itemsPerPage +
                    props.index +
                    1
                }}
              </template>
              <template v-slot:item.zoom_learning_classes="{ item }">
                <v-btn
                  v-if="item.zoom_learning_classes"
                  color="primary"
                  @click="showClasses(item.zoom_learning_classes)"
                >
                  اظهار الصفوف
                </v-btn>
              </template>
              <template v-slot:item.zoom_learning_url="{ item }">
                <v-btn
                  v-if="item.zoom_learning_url"
                  color="primary"
                  @click="goToLink(item.zoom_learning_url)"
                >
                  الدخول الى الرابط
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- Edit dialog -->
    <v-dialog
      v-model="classesDailog.open"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">الصفوف</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <div class="classes_list">
              <ul>
                <li
                  v-for="item in classes"
                  :key="item.class_school_id"
                >
                  {{ item.classes_name + '_' + item.class_school_leader }}
                </li>
              </ul>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="classesDailog.open = false"
          >
            الغاء
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
    <!--- Dailog for show info to user-->
    <v-dialog
      v-model="dialogData.open"
      max-width="500px"
    >
      <v-toolbar
        :color="dialogData.color"
        dense
      ></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center">
          {{
            dialogData.bodyText
          }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialogData.open = false"
          >
            تم
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isFormValidEditPassword: false,

      deleteItemLoading: false,

      dialogDelete: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      classesDailog: {
        open: false,
      },

      deletedItem: {},

      tableOptions: {},

      classes: [],

      table: {
        totalTeacherData: 0,
        teacherData: [],
        loading: true,
        showImageDailog: false,
        imageUrlForShow: null,

        headers: [
          {
            text: '#',
            align: 'start',
            width: 1,
            sortable: false,
            value: 'zoom_learning_id',
          },
          {
            text: 'العنوان',
            sortable: false,
            value: 'zoom_learning_title',
          },
          { text: 'المادة', sortable: false, value: 'zoom_learning_title' },
          { text: 'استاذ المادة', sortable: false, value: 'account_name' },
          { text: 'الصفوف', sortable: false, value: 'zoom_learning_classes' },
          { text: 'الرابط', sortable: false, value: 'zoom_learning_url' },
          { text: 'عدد الطلاب المتواجدين في البث', sortable: false, value: 'zoom_learning_count' },
        ],
      },
    }
  },
  watch: {
    tableOptions: {
      handler() {
        this.getTeacherDataAxios()
      },
      deep: true,
    },
    '$route.query.search': {
      handler(search) {
        this.table.search = search
        this.getTeacherDataAxios(search)
      },
      deep: true,

      // immediate: true,
    },
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
  methods: {
    getTeacherDataAxios() {
      // let search = this.table.search;
      this.table.loading = true
      let { page, itemsPerPage } = this.tableOptions

      // if (!search) {
      //   search = "";
      // }

      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get(`zoom/${page}/${itemsPerPage}`)
        .then(Response => {
          this.table.loading = false
          this.table.teacherData = Response.data.results
          this.table.totalTeacherData = Response.data.count
        })
        .catch(error => {
          this.table.loading = false
          console.log('error', error)
        })
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    goToLink(file) {
      window.open(file)
    },
    showClasses(classes) {
      this.showClassesAxois(classes)
      this.classesDailog.open = true
    },
    showClassesAxois(classes) {
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('zoom', {
          class_school_id: classes,
        })
        .then(Response => {
          this.classes = Response.data.results
        })
        .catch(error => {
          console.log('error', error)
        })
    },
  },
}
</script>

<style scoped>
.classes_list {
  display: flex;
  justify-content: center;
}
.classes_list ul {
  list-style: repeating-linear-gradient();
}
.classes_list ul li {
  margin-bottom: 15px;
}
a {
  text-decoration: none;
}
</style>
