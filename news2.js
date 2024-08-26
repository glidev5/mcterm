const PORT = 3000;
import express from 'express';
import axios from 'axios'
import * as cheerio from 'cheerio'

const app = express();

const newspapers = [
    {
        name: 'usatoday',
        address: 'https://eu.usatoday.com/tech/'
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/section/technology'
    },
    //{
    //    name: 'reuters',
    //    address: 'https://www.reuters.com/technology'
    //},
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/business/tech'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/technology/all'
    },
    {
        name: 'arstechnica',
        address: 'https://arstechnica.com/'
    },
    {
        name: 'techcrunch',
        address: 'https://techcrunch.com/'
    },
    {
        name: 'mashable',
        address: 'https://mashable.com/tech/'
    }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.json('This is a Tech News API');
});

app.get('/sources', (req, res) => {
    const sources = newspapers.map((newspaper) => newspaper.name);
    res.json(sources);
});

app.get('/search', async (req, res) => {
    const keyword = req.query.keyword;
    console.log(keyword);
    try {
        const articles = [];

        await Promise.all(
            newspapers.map(async (newspaper) => {
		try{
                const response = await axios.get(newspaper.address);
                const html = response.data;
                const $ = cheerio.load(html);

                let selector = '';
                let titleSelector = '';
                let textSelector = '';

                switch (newspaper.name) {
                    case 'nytimes':
                        selector = 'ol li article';
                        titleSelector = 'div h3';
                        textSelector = 'div p';
                        break;
                    case 'reuters':
                        selector = 'ul li';
                        titleSelector = 'div div a';
                        textSelector = 'div div a';
                        break;
                    default:
                        break;
                }

                $(selector).each(function () {
                    //console.log($(this).text())
                    const title = $(this).find(titleSelector).text();
                    const url = $(this).find(titleSelector).attr('href');
                    const imageUrl = $(this).find('img').attr('src');
                    const articleText = $(this).find(textSelector).text();

                    if (articleText.toLowerCase().includes(keyword.toLowerCase()) || title.toLowerCase().includes(keyword.toLowerCase())) {
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: newspaper.name
                        });
                    }
                });
		}
		catch(e){
                  console.log(e);
                }
            })
        );

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


 






app.get('/news', async (req, res) => {
    console.log("/news")
    try {
        const articles = [];

        await Promise.all(
            newspapers.map(async (newspaper) => {
 		try{
                const response = await axios.get(newspaper.address);
                const html = response.data;
                const $ = cheerio.load(html);

                if (newspaper.name === 'nytimes') {
                    $('ol li article').each(function() {
                        const title = $(this).find('h3').text();
                        const url = 'https://www.nytimes.com' + $(this).find('a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: newspaper.name
                        });
			}
                    });
                } else if (newspaper.name === 'reuters') {
                    $('ul li').each(function() {
                        const title = $(this).find('div div a').text();
                        const url = 'https://www.reuters.com' + $(this).find('div div a').attr('href');
                        const imageUrl = $(this).find('img').attr('src');
                        const date = $(this).find('div div time').text();

			if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            date,
                            source: newspaper.name
                        });
			}
                    });
                } else if (newspaper.name === 'cnn') {
                    $('div.card.container__item.container__item--type-section').each(function() {
                        const title = $(this).find('span[data-editable="headline"]').text();
                        const url = 'https://edition.cnn.com' + $(this).find('a').attr('href');
                        const imageUrl = $(this).find('img').attr('data-url');

                        if(title){
                        articles.push({
                            title,
                            url,
                            imageUrl,
                            source: newspaper.name
                        });
			}
                    });
                } else {
                    $('.gnt_m_flm_a').each(function() {
                        const title = $(this).text();
                        const url = newspaper.address+$(this).attr('href');

                        if(title){
			articles.push({
                            title,
                            url,
                            source: newspaper.name
                        });
			}
                    });
                    $('main section div ul li div div a').parent().each(function() {
                        const title = $(this).find('h3').text();
                        const url = newspaper.address+$(this).find('a').attr('href');

                        if(title){
			articles.push({
                            title,
                            url,
                            source: newspaper.name
                        });
			}
                    });

                }
		}
		catch(e){console.log(e);}
            })
        );

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));