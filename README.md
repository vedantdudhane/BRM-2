# BRM-1

server >> for storing book data >> user register >>subscriber

This is a book record API server/ backend for library system or management of records or books

Fine System

3 months
6 months
12 months

within subscription date>> if missed renewal>> 50/- day
subscription date missed>> renewal missed>> 100 + 50/-

# Routes and Endpoints

## /users

POST: Create a new user
GET: get all info of all users

## /users/{id}

GET: Get a user by id
PUT: update a user by id
DELETE: Delete a user by id(check if he/she still have an issued book)&&(is there any fine to be paid)

## /users/subscription-details/{id}

GET: Get user subscription details >> Date of subscription >>Valid till >>fine if any

## /books

GET: Get all the books
POST: Add a new book

## /books/{id}

GET: Get book by id
PUT: Update a book by id

## /books/issued

GET: Get all the issued books

## /books/issued/withFine

GET: Get all issued books with their fine

# npm init

# npm i nodemon --save-dev

# npm run dev
