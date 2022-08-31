<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="header-text">
        اقساط الطالب
      </h1>
      <h2 class="text-center subtitle-5 black--text">
        ({{ $route.params.name }})
      </h2>
      <div class="container">
        <div class="school-logo-name">
          <h2>مدرسة الامل</h2>
          <h2>Logo</h2>
        </div>

        <div>
          <h3>بغداد</h3>
          <h3>07803548158</h3>
        </div>
        <div class="student-details">
          <h3>اسم الطالب: محمد جبار</h3>
          <h3>التاريخ: 2016</h3>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {}
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
.header-text {
  text-align: center;
}
.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
@media (min-width: 576px) {
  .container {
    width: 540px;
  }
}
@media (min-width: 768px) {
  .container {
    width: 720px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 960px;
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1140px;
  }
}

.student-details {
  margin: 15px 0;
}
.school-logo-name {
  display: flex;
  margin: 50px 15px;
  justify-content: space-between;
}
</style>
