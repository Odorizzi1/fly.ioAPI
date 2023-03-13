const fetch = require('node-fetch');
const { Buffer } = require('buffer');


exports.courses = functions.https.onRequest(async (req, res) => {
    try {
        const authToken = `${process.env.CLIENT_ID}:${process.env.UD_API_KEY}`;
        const encodedToken = Buffer.from(authToken).toString('base64');
        const response = await fetch(
            `https://www.udemy.com/api-2.0/courses/?search=&price=price-free,price-paid&price_currency=brl&fields[course]=@default,visible_instructors&ordering=-price&price__lte=50&language=pt&skip_price=1&page=1&page_size=10`,
            {
                headers: {
                    Authorization: `Basic ${encodedToken}`,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers':
                        'Origin, X-Requested-With, Content-Type, Accept',
                },
            }
        );
        const data = await response.json();
        const courses = data.results;
        const filteredCourses = courses.filter(
            (course) => course.price.amount < 50
        );
        res.json(filteredCourses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao obter cursos');
    }
});




