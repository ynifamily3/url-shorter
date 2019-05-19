const express = require('express');
const app = express();
const AppDAO = require('./dao')  
const UrlShorterRepository = require('./url_shorter_repository')

const dao = new AppDAO('./url_shorter_database.sqlite3');
const urlRepo = new UrlShorterRepository(dao);
require('dotenv').config()

urlRepo.createTable()
.then(() => {
	console.log('테이블 만들기 성공')
	resolve('success')
})
.catch((err) => {
	console.log('Error: ')
	console.log(JSON.stringify(err))
})

async function get_hash_to_url(hash) {
	const url = await urlRepo.getByHash(hash);
	console.log(url);
	return url.to_url;
}

async function insert(url) {
	let hash = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
	let id = await urlRepo.create(hash, url);
	console.log(id)
	let hash2 = await urlRepo.getById(id.id);
	return hash2;
}
// view 경로 설정
app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
		// console.log(process.env.TEST)
		res.render('register.html');
});

app.post('/', async (req, res) => {
		// db에 등록한다.
		try {
			const result = await insert(req.body['to_url']);
			console.log(result);
			res.render("complete.html", {url: result['hash']})
			// res.send('단축 URL 생성 성공 ' + 'https://u.miel.dev/' + result['hash']);
		} catch (error) {
			res.send('단축 URL 생성 실패');
		}
});

app.get('/:go', async (req, res) => {
		try {
		const url = await get_hash_to_url(req.params['go']);
			res.redirect(url);
		} catch (error) {
			res.send("리다이렉션 할 곳을 못 찾았어요");
		}
		});

const port = process.env.PORT || 8080;
app.listen(port, () => {
		console.log('서버 살살 녹는다~');
});

// gcloud builds submit --tag gcr.io/url-shorter-241104/urlshortimage
/*

// Imports the Google Cloud client library
const {Datastore} = require('@google-cloud/datastore');

async function quickStart() {
  // Your Google Cloud Platform project ID
  const projectId = 'url-shorter-241104';

  // Creates a client
  const datastore = new Datastore({
    projectId: projectId,
  });

  // The kind for the new entity
  const kind = 'Task';
  // The name/ID for the new entity
  const name = 'sampletask12'; // autoincrement
  // The Cloud Datastore key for the new entity
  const taskKey = datastore.key([kind, name]);

  // Prepares the new entity
  const task = {
    key: taskKey,
    data: {
	  another: '123',
      description: '+99',
    },
  };

  // Saves the entity
  await datastore.save(task);
  console.log(`Saved ${task.key.name}: ${task.data.description}`);
}
quickStart().catch(console.error);*/