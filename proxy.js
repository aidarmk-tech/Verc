// ===== Vercel Serverless Proxy для Filmix =====
//
// ДЕПЛОЙ (3 минуты):
// 1. Зарегистрируйтесь на vercel.com (бесплатно, через GitHub)
// 2. Создайте папку проекта с двумя файлами:
//    - api/proxy.js  (этот файл)
//    - vercel.json   (файл ниже)
// 3. Закиньте в GitHub репозиторий
// 4. На vercel.com: Add New Project → Import → Deploy
// 5. Получите URL типа: https://my-proxy.vercel.app
//
// Использование: https://my-proxy.vercel.app/api/proxy?path=/loader/news/films/
//

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const path = req.query.path || '/';
    const target = 'https://filmix.lat' + path;

    const agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    ];
    const ua = agents[Math.floor(Math.random() * agents.length)];

    try {
        const response = await fetch(target, {
            method: 'GET',
            headers: {
                'User-Agent': ua,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
                'Referer': 'https://filmix.lat/',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Upgrade-Insecure-Requests': '1',
                'sec-ch-ua': '"Chromium";v="121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
            },
            redirect: 'follow',
        });

        const html = await response.text();

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        res.status(response.status).send(html);
    } catch (err) {
        res.status(502).json({ error: err.message });
    }
}
