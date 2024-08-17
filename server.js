const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors'); // правила политики cors
const Router = require('koa-router');
const http = require('http');
const { v4: uuidv4 } = require('uuid'); // импортируем v4 из uuid и переименовываем как uuidv4

const app = new Koa();
const notes = [];

app.use(koaBody({ // чтобы обработать тело запроса
  // (обязательно объявить до Middleware где работаем с body)
  urlencoded: true, // иначе тело будет undefined (тело будет строкой)
  multipart: true,
}));

app.use(cors()); // задаем правила для политики CORS

const router = new Router(); // создали роутер
app.use(router.routes());

router.post('/notes', (ctx) => {
  // Добавить новое текстовое сообщение (широковещательный ответ)
  console.log('POST /notes:', ctx.request.body);
  notes.push({ ...ctx.request.body, id: uuidv4() });
  ctx.response.status = 204;
});

router.get('/notes', (ctx) => {
  // Получить список всех сообщений (одиночный ответ)
  console.log('GET /notes:', ctx.request.header.referer);
  ctx.response.status = 200;
  ctx.response.body = JSON.stringify(notes);
});

router.delete('/notes/:id', (ctx) => {
  // Получить список всех сообщений (одиночный ответ)
  console.log('Delete /notes/:id', ctx.request.header.referer);
  console.log('Параметры', ctx.params);
  const { id } = ctx.params;
  const index = notes.findIndex((o) => o.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  ctx.response.status = 204;
});

const port = process.env.PORT || 9000;
const server = http.createServer(app.callback());

server.listen(port, (err) => {
  // два аргумента (1-й это порт, 2-й это callback по результатам запуска сервера)
  if (err) { // в callback может быть передана ошибка
    // (выводим её в консоль для примера, если она появится)
    console.log(err);
    return;
  }
  console.log(`The server is running on http://localhost:${port}`);
});
