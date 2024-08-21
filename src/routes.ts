const domain = 'https://choosealicense.dev.rusrobots.ru'; //YOUR DOMAIN

const routes = {
    baseUrl: `${domain}/api`,
    licensesDictionary: '/licenses/dictionary',
    quiz: '/quiz/active',
    quizId: (id:number) => `/quiz/${id}/update`, 
}

export default routes;