const domain = import.meta.env.VUE_APP_DOMAIN; //YOUR DOMAIN

const routes = {
    baseUrl: `${domain}/api`,
    licensesDictionary: '/licenses/dictionary',
    quiz: '/quiz/active',
    quizId: (id:number) => `/quiz/${id}`, 
}

export default routes;