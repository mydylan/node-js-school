import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { OK, CREATED, NO_CONTENT, BAD_REQUEST, FORBIDDEN } from 'http-status-codes';
import { User } from '../entity/user';
import { Book } from '../entity/book';

export default class BookController {

    public static async getBooks (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);

        const user: User = await userRepository.findOne({ id: ctx.params.id }, { relations: ['books'] });

        if (!user) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to retrieve doesn\'t exist in the db';
            return;
        }

        ctx.status = OK;
        ctx.body = user.books;
    }

    public static async getBook (ctx: BaseContext) {
        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        const book: Book = await bookRepository.findOne({ id: ctx.params.bookId });

        if (!book) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to retrieve book that doesn\'t exist in the db';
            return;
        }

        ctx.status = OK;
        ctx.body = book;
    }

    public static async createBook (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        const user: User = await userRepository.findOne({ id: ctx.params.id }, { relations: ['books'] });

        const bookToBeSaved: Book = new Book();
        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.date = ctx.request.body.date;
        bookToBeSaved.user = ctx.params.id;

        const errors: ValidationError[] = await validate(bookToBeSaved);

        if (errors.length > 0) {
            ctx.status = BAD_REQUEST;
            ctx.body = errors;
            return;
        }

        if (!user) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to update doesn\'t exist in the db';
            return;
        }

        if (user.books.find(book => book.name === ctx.request.body.name)) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The book you are trying to create already exist in this user';
            return;
        }

        const book = await bookRepository.save(bookToBeSaved);

        ctx.status = CREATED;
        ctx.body = book;
    }

    public static async updateBook (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        const user: User = await userRepository.findOne({ id: ctx.params.id }, { relations: ['books'] });

        const bookToBeSaved: Book = new Book();
        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.date = ctx.request.body.date;

        const errors: ValidationError[] = await validate(bookToBeSaved); // errors is an array of validation errors

        if (errors.length > 0) {
            ctx.status = BAD_REQUEST;
            ctx.body = errors;
            return;
        }

        if (!user) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to update doesn\'t exist in the db';
            return;
        }

        if (!user.books.find(book => book.id === Number(ctx.params.bookId))) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The book you are trying to update doesn\'t exist in this user';
            return;
        }

        const book = await bookRepository.save(bookToBeSaved);

        ctx.status = OK;
        ctx.body = book;
    }

    public static async deleteBook (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        const user: User = await userRepository.findOne({ id: ctx.params.id }, { relations: ['books'] });
        const bookToRemove: Book = await bookRepository.findOne(ctx.params.bookId);

        if (!user) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to update doesn\'t exist in the db';
            return;
        }

        if (!bookToRemove) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The book you are trying to delete doesn\'t exist';
            return;
        }

        await bookRepository.remove(bookToRemove);

        ctx.status = NO_CONTENT;
    }

}
