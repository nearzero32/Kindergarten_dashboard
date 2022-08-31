/* eslint-disable */

// const results = resultsLocalStorage.features_finger_id

let index = [{
        title: 'الصفحة الرئيسية',
        icon: 'fa-home',
        to: 'home',
    },
    // accountant
    {
        title: 'الحسابات',
        icon: 'fa-file-contract',
        href: "https://counting.jasmine-k.com/",
    },

    //classSchool
    {
        title: 'الصف والشعبة',
        icon: 'fa-school',
        to: 'classSchool',
    },

    // subjects
    {
        title: 'المواد',
        icon: 'fa-book',
        to: 'subject',
    },

    //teachers
    {
        title: 'الاساتذة',
        icon: 'fa-chalkboard-teacher',
        to: 'teachers',
    },


    //students
    {
        title: 'الطلاب',
        icon: 'fa-user-graduate',
        children: [{
                title: 'الطلاب المسجلين',
                to: 'students',
                // alias: ['/studentInClass', '/addStudent', '/studentProfile'],
            },
            {
                title: 'جميع الطلاب',
                to: { name: 'allStudent' },
            },
            // {
            //     title: 'الطلاب الموقوفين',
            //     to: { name: 'stopedStudent' },
            // },
            {
                title: 'الطلاب المحذوفين',
                to: { name: 'deletedStudent' },
            },
        ],
    },


    //notification
    {
        title: 'الاشعارات',
        icon: 'fa-bell',
        to: 'notification',
    },

    //monthly messages
    {
        title: 'الرسائل الشهرية',
        icon: 'fa-envelope',
        to: 'messages',
    },

    // messages
    {
        title: 'montessori',
        icon: 'fa-clipboard',
        to: 'montessori',
    },

    // occasions
    {
        title: 'المناسبات',
        icon: ' fa-gift',
        to: 'occasions',
    },


    // activities
    {
        title: 'الانشطة',
        icon: 'fa-tasks',
        to: 'activities',
    },

    // activities
    {
        title: 'استراتجيات التدريس',
        icon: 'fa-book-open',
        to: 'studyStrategy',
    },

    // ads
    {
        title: 'الاعلانات',
        icon: 'fa-newspaper',
        to: 'ads',
    },

    //connectUs
    {
        title: 'اتصل بنا',
        icon: 'fa-phone-square',
        to: 'connectUs',
    },
]

export default index