import * as Router from 'koa-router';
import controller = require('./controller');

const router = new Router();

// GENERAL ROUTES
router.get('/', controller.general.helloWorld);
router.get('/jwt', controller.general.getJwtPayload);

// USER ROUTES
router.get('/users', controller.user.getUsers);
router.get('/users/:id', controller.user.getUser);
router.post('/users', controller.user.createUser);
router.put('/users/:id', controller.user.updateUser);
router.delete('/users/:id', controller.user.deleteUser);

// BOOK ROUTES
router.get('/users/:id/books', controller.book.getBooks);
router.get('/users/:id/books/:bookId', controller.book.getBook);
router.post('/users/:id/books', controller.book.createBook);
router.put('/users/:id/books/:bookId', controller.book.updateBook);
router.delete('/users/:id/books/:bookId', controller.book.deleteBook);

// FILE ROUTES
router.post('/service', controller.service.register);
router.post('/service/:id/execute', controller.service.execute);

export { router };
