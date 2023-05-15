import axios from 'axios'
import sha512 from 'js-sha512'

class Api {
  async login(account_email, account_password, auth_phone_details, auth_ip, auth_city, auth_lat, auth_lon) {
    return axios
      .post('/login', {
        account_email,
        account_password: sha512(account_password),
        auth_phone_details,
        auth_ip,
        auth_city,
        auth_lat,
        auth_lon,

        // auth_phone_id: authData.firebaseToken,
        // auth_firebase: authData.firebaseToken,
      })
      .then(Response => ({ error: false, results: Response }))
      .catch(() => ({ error: true, results: [] }))
  }

  // mainData
  async mainData() {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/mainData`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async logout() {
    return axios
      .get('/logout')
      .then(Response => {
        if (Response.error === false) {
          return { error: false, results: Response }
        }

        return { error: true, results: Response }
      })
      .catch(() => ({ error: true, results: [] }))
  }

  // dashboard
  async getDashboard(study_year) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/dashboard/get/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // teacher
  async getTeachers(page, limit, search) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('/teacher/get', {
        page,
        limit,
        search,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getAllTeachers() {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('/teacher/getAll')
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeTeacher(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .delete(`/teacher/remove/account_id/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editPasswordTeacher(account_id, account_password, account_password_show) {
    console.log(
      'account_id, account_password, account_password_show',
      account_id,
      account_password,
      account_password_show,
    )
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/teacher/changePassword', {
        account_id,
        account_password,
        account_password_show,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getOneTeacher(teacher_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/teacher/getOne/teacher_id/${teacher_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getSalaryTeacher(teacher_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/teacher/getSalary/teacher_id/${teacher_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editTeachers({ _id, account_name, account_mobile, account_birthday, account_card_number, account_gender, isAccountDisabled, account_address, account_max_vacation, isAccountCanSendNotification, account_salary, account_division, account_subject }) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/teacher/edit', {
        _id,
        account_name,
        account_mobile,
        account_birthday,
        account_card_number,
        account_gender,
        isAccountDisabled,
        account_address,
        account_max_vacation,
        isAccountCanSendNotification,
        account_salary,
        account_division,
        account_subject
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addTeachers({ account_name, account_mobile, account_email, account_password, account_password_show, account_start_date, account_payment_type, account_birthday, account_card_number, account_gender, isAccountDisabled, account_address, account_max_vacation, isAccountCanSendNotification, account_salary, account_division, account_subject }) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('/teacher/add', {
        account_name,
        account_mobile,
        account_email,
        account_password,
        account_password_show,
        account_start_date,
        account_birthday,
        account_card_number,
        account_gender,
        isAccountDisabled,
        account_address,
        account_max_vacation,
        isAccountCanSendNotification,
        account_payment_type,
        account_salary,
        account_division,
        account_subject
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // students
  async getStudents(page, limit, search) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('/student/get', {
        page,
        limit,
        search,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getAllStudents() {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get('/student/getAll')
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  async getOneStudent(student_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/student/getOne/student_id/${student_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeStudent(account_id, reason) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/student/remove', {
        account_id,
        account_delete_reason: reason
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeStudentInfo(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/student/remove/info', {
        account_id,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editPasswordStudent(account_id, account_password, account_password_show) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/student/changePassword', {
        account_id,
        account_password,
        account_password_show,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async disableStudent(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/student/disable/account_id/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async studentInClassSchool(class_school_id, study_year) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/student/get/class_school_id/${class_school_id}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addStudent({ account_name, account_email, account_mobile, account_password, account_password_show, account_birthday, account_address, account_card_number, account_card_number_two, class_school_id, isAccountDisabled, study_year }) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post('/student/add', {
        account_name,
        account_email,
        account_mobile,
        account_password,
        account_password_show,
        account_birthday,
        account_address,
        account_card_number,
        account_card_number_two,
        account_division: {
          class_school_id,
          class_study_year: study_year
        },
        isAccountDisabled

      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editStudent({ _id, account_name, account_mobile1, account_mobile2, account_mobile3, account_mobile4, account_password, account_password_show, account_home, account_area, account_city, account_alley, account_nearest_point, account_birthday, account_card_number, account_card_number_two, isAccountDisabled, account_address, class_school_id, class_study_year }) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/student/edit', {
        account_id: _id,
        account_name,
        account_mobile1,
        account_mobile2,
        account_mobile3,
        account_mobile4,
        account_password,
        account_password_show,
        account_home,
        account_area,
        account_city,
        account_alley,
        account_nearest_point,
        account_birthday,
        account_card_number,
        account_card_number_two,
        isAccountDisabled,
        account_address,
        account_division: {
          class_school_id,
          class_study_year
        },
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editStudentImages(data) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/student/editImages', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // disable student
  async getStudentsDisabled(page, limit, search) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/student/disabled/get/page/${page}/limit/${limit}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async restoreDisabledStudent(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/student/disabled/restore/account_id/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // deleted student
  async getStudentsDeleted(page, limit, search) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/student/deleted/get/page/${page}/limit/${limit}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async restoreDeletedStudent(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/student/deleted/restore/account_id/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // class School
  async getClassSchool() {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get("/classSchool")
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getOneClassSchool(id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/classSchool/getOne/classSchoolId/${id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addClassSchool(class_name, leader) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post("/classSchool", {
        schoolClass: {
          class_name,
          leader
        }
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editClassSchool({ id, class_name, leader }) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .put("/classSchool", {
        class_name,
        leader,
        classSchoolId: id
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeClassSchool(class_school_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .delete(`/classSchool/remove/class_school_id/${class_school_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // driver
  async getDriver() {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get('/driver/get')
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getOneDriver(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/driver/getOne/driver_id/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeDriver(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .delete(`/driver/remove/account_id/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editPasswordDriver(account_id, account_password, account_password_show) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/student/changePassword', {
        account_id,
        account_password,
        account_password_show,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editDriver({ _id, account_name, account_mobile, account_birthday, account_gender, isAccountDisabled, account_address, account_max_vacation, account_salary, account_car_type, account_car_color, account_car_number }) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/driver/edit', {
        _id,
        account_name,
        account_mobile,
        account_birthday,
        account_gender,
        isAccountDisabled,
        account_address,
        account_max_vacation,
        account_salary,
        account_car_type,
        account_car_color,
        account_car_number
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addDriver({ account_name, account_password, account_password_show, account_mobile, account_email, account_birthday, account_gender, isAccountDisabled, account_address, account_max_vacation, account_salary, account_start_date, account_car_type, account_car_color, account_car_number }) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('/driver/add', {
        account_name,
        account_password,
        account_password_show,
        account_mobile,
        account_email,
        account_birthday,
        account_gender,
        isAccountDisabled,
        account_address,
        account_max_vacation,
        account_salary,
        account_start_date,
        account_car_type,
        account_car_color,
        account_car_number
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getDriverStudent(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/driver/getStudents/accountId/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getStudentsThatNotBelongToDriver(page, limit, search) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('driver/getStudentsThatNotBelongToDriver', {
        page: +page,
        limit: +limit,
        search
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeDriverStudent(account_id, student_ids) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('/driver/removeStudent', {
        account_id,
        student_ids
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addDriverStudent(account_id, student_ids) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post('/driver/addStudent', {
        account_id,
        student_ids
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // Subject
  async getSubject() {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get("/subjects/get")
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getSubjectWithoutFeatures() {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get("/subjects/getSubjectWithoutFeatures")
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addSubject(subject_name) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post("/subjects/add", {
        subject_name
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  async editSubject(subject_name, subject_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .put("/subjects/edit", {
        subject_name,
        subject_id
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeSubject(subject_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .delete(`/subjects/remove/subject_id/${subject_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // class
  async getClass() {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get("/class")
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // absence
  async getAbsenceStudent(class_school_id, study_year) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/absence/student/class_school/${class_school_id}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }
  async getAbsenceForSpecificAccount(account_id, study_year, page, limit) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/absence/student/account_id/${account_id}/study_year/${study_year}/page/${+page}/limit/${+limit}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getAccountAbsenceClassSchool(class_school_id, study_year, absence_date) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/absence/student/class_school_id/${class_school_id}/study_year/${study_year}/absence_date/${absence_date}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addAbsence(data, absenceIds) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post(`/absence/student/add`, {
        data,
        absenceIds
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeAbsenceStudent(absence_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .delete(`/absence/student/absence_id/${absence_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // teacher Absence
  async getAbsenceTeacher(study_year) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/absence/teacher/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getAbsenceAccountToAdd(study_year, absence_date) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/absence/teacher/study_year/${study_year}/absence_date/${absence_date}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // review
  async getReview(account_id, study_year) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/review/student/account_id/${account_id}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getAccountReviewClassSchool(class_school_id, review_date, study_year) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/review/student/get/class_school_id/${class_school_id}/review_date/${review_date}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addReview(data, reviewIds) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post(`/review/student/add`, {
        data,
        reviewIds
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeReview(review_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .delete(`/review/student/remove/review_id/${review_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // DailyExams
  async getDailyExams(study_year, page, limit, search) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post('/dailyExams/get', {
        study_year,
        page,
        limit,
        search,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getDailyExamsDegrees(class_school, study_year, exams_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .get(`/dailyExams/class_school/${class_school}/daily_exam_id/${exams_id}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addDailyExamsDegrees(exams_id, daily_exam_degrees) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post('/dailyExams/addDegrees', {
        exams_id,
        daily_exam_degrees,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addDailyExams(daily_exam_subject, daily_exam_max_degree, daily_exam_date, daily_exam_study_year, daily_exam_class_school_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post('/dailyExams', {
        daily_exam_subject,
        daily_exam_max_degree,
        daily_exam_date,
        daily_exam_study_year,
        daily_exam_class_school_id,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeDailyExams(exams_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .delete(`/dailyExams/remove/exams_id/${exams_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }



  // notification
  async getNotification({ notificationType, startDate, endDate, search, page, limit }) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post(`/notification/get`, {
        notificationType,
        startDate,
        endDate,
        search,
        page,
        limit,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getNotificationStudent({ account_id, class_school, page, limit }) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post(`/notification/getForStudent`, {
        class_school,
        account_id,
        page,
        limit,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addNotification(formData) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post(`/notification/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeNotification(notification_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .delete(`/notification/remove/notification_id/${notification_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // latestNews
  async getAds(page, limit, search) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/ads/get/page/${page}/limit/${limit}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addAds(formData) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .post(`/ads/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeAds(ads_id) {

    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    return axios
      .delete(`/ads/remove/ads_id/${ads_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // contact us
  async getContactUs() {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get('/contactUs/get')
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editContactUs(formData) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put('/contactUs/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // schedule
  async getSchedule(classSchool, study_year) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/weeklySchedule/get/class_school/${classSchool}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addSchedule(data) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/weeklySchedule/add`, { data })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // exams
  async getExams(classSchool, study_year) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/exams/get/class_school/${classSchool}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getOneExams(classSchool, study_year) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/exams/getOne/class_school/${classSchool}/study_year/${study_year}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addOneExams({ exams_name, exams_study_year, exams_for_class_school }) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/exams/addOne`, {
        exams_name,
        exams_study_year,
        exams_for_class_school,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editExams(exams_name, exams_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put(`/exams/edit`, {
        exams_name,
        exams_id
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeExams(exams_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .delete(`/exams/remove/exams_id/${exams_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // exams Schedule
  async getExamsSchedule(exams_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/exams/getExamsSchedule/exams_id/${exams_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addExamsSchedule(exams_id, exams_schedule) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/exams/addExamsSchedule`, {
        exams_id,
        exams_schedule,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editExamsSchedule(exams_id, exams_schedule) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put(`/exams/editExamsSchedule`, {
        exams_id,
        exams_schedule,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  async removeExamsSchedule(exams_id, exams_schedule_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .delete(`/exams/removeExamsSchedule/exams_id/${exams_id}/exams_schedule_id/${exams_schedule_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  //exams system
  async getExamsSystem() {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .delete(`/examsSystem/get`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // degrees
  async getExamsNameDegrees(study_year, page, limit, search) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/degrees/getExamsNameWithoutSubject`, {
        study_year,
        page,
        limit,
        search,
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getDegrees({ subject_id, class_school, degree_exam_name, study_year }) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/degrees/getData`, {
        subject_id,
        class_school,
        degree_exam_name,
        study_year
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  async addExamsNameDegrees(data) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/degrees/addExamsName`, { data })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addDegrees(exam_id, students) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/degrees/addDegrees`, { exam_id, students })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeExamsNameDegrees(exams_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .delete(`/degrees/remove/exams_id/${exams_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  // employee
  async getEmployee() {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/employee/get`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async getOneEmployee(employee_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .get(`/employee/getOne/employee_id/${employee_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async addEmployee(data) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .post(`/employee/add`, {
        data
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async editEmployee(data) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .put(`/employee/edit`, {
        data
      })
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeEmployee(account_id) {
    axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

    return axios
      .delete(`/employee/remove/account_id/${account_id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }


  // school register
  async getRegister({ student_class, page, limit, search }) {
    return axios
      .get(`/school/register/student_class/${student_class}?page=${page}&limit=${limit}&search=${search}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }

  async removeRegister(id) {
    return axios
      .delete(`/school/register/id/${id}`)
      .then(Response => Response)
      .catch(error => {
        console.log('error', error)

        return error.response
      })
  }
}

export default new Api()
