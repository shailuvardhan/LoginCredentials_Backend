### Welcome to Backend Credentails

## Project Setup

- Create a new directory for your project.
- Navigate to the project directory in your terminal using cd.
- npm init -y to install package.json

## Installation
1. Installing Required packages using - npm install
2. Packages used:-expressJS,sqLite(open-method),sqlite3,nodemon,uuid.


1. Table creation
```
**    CREATE TABLE IF NOT EXISTS Users (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT,
        gender TEXT NOT NULL,
        location TEXT NOT NULL)**
```

## Deployment

- Platform Selection:- Choose a suitable deployment platform such as Heroku, AWS, or Vercel.
