const domain = 'https://choosealicense.dev.rusrobots.ru';

const routes = {
    baseUrl: `${domain}/api`,
    licensesDictionary: '/licenses/dictionary',
    quiz: '/quiz/active',
    quizId: (id:number) => `/quiz/${id}`, 
}

export default routes;