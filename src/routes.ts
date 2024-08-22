const domain = {
    production: 'https://choosealicense.ru',
    development: 'https://choosealicense.dev.rusrobots.ru',
}; //YOUR DOMAIN

const currentUrl = window.location.href

const routes = {
    baseUrl: ``,
    licensesDictionary: '/licenses/dictionary',
    quiz: '/quiz/active',
    quizId: (id:number) => `/quiz/${id}/update`, 
}

if (currentUrl === 'https://choosealicense.dev.rusrobots.ru/admin/main-page/quiz' || currentUrl === 'http://localhost:3000/') {
    routes.baseUrl = `${domain.development}/api`
}
if (currentUrl === 'https://choosealicense.ru/admin/main-page/quiz') {
    routes.baseUrl = `${domain.production}/api`
}

export default routes;