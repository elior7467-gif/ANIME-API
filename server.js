const express = require('express');
const animeapi = require('./src/index.js');

const app = express();

const wrap = fn => async (req, res) => {
	try {
		const q = req.query.q;
		const ep = Number(req.query.ep || 1);
		if (!q) {
			return res.status(400).json({error: 'missing q'});
		}

		const data = await fn(q, ep);
		res.json(data);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

app.get('/', (_, res) => res.send('ok'));
app.get('/links', wrap(q => animeapi.links(q)));
app.get('/stream', wrap((q, ep) => animeapi.stream(q, ep)));
app.get('/download', wrap((q, ep) => animeapi.download(q, ep)));

app.listen(process.env.PORT || 3000, () => console.log('anime api running'));
