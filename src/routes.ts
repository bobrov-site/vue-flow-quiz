import utils from "./utils";

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

if (utils.isCurrentUrlDev(currentUrl)) {
    routes.baseUrl = `${domain.development}/api`
}
else {
    routes.baseUrl = `${domain.production}/api`
}

export default routes;