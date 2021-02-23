# TechbaseBEChallenge
This is source code for Techbase code challenge

## Some rules
Base on the requirement, I am assuming each Director does not join any projects team, department lead does not join any projects team.
When you login using director, you can see list of all users.
When you login using department lead, you can only see list of all members that join in projects whose belong to department that person lead.
When you login using memberm you can only see list of members that join same projects team as that person.
Login using username as id of that user.

## Installation
First, you have to import database structure. There is 2 files in src/public/database.
Create database first then import TBBE_empty_database.sql dump for empty database with structure or TBBE_with_data.sql with sample data

Next install all nessasary dependencies
```bash
npm install
```
If there are no .env file, create one base on envexample file to connect to database and setting up enviroment variables
To use for test/production/dev change .env file content to fit the enviroment

## Usage
To run
```bash
npm start
```

### Login
```
POST {{url}}/api/login
Body:
{
    "username":ID of member,
    "password":"123456" //default password
}
```

This request will return a token. Save this token and use it for authentication throught Bearer token or token in query.

### Get member list
```
GET {{url}}/api/members
Query: projectId //filter for members work in project with id = projectId
```
This request will return all members base on which members login

## Testing
to test
```bash
npm test
```

## Additional information
POSTMAN link: https://www.getpostman.com/collections/1fd81f25779d578cb33f