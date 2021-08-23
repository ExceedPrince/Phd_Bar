# Phd Bar

## Fullstack Api Exam Project

This is a Fullstack MERN (MongoDB, Express.js, React, Node.js) application about a fictional restaurant.
I've used Redux on the client side for the requests and responses for the server side communication.
This project also has some jest tests, but only on the server side, testing the endpoints.

There are some secret/dynamic information in this code, which can be found in .env files in both sides of the project.
Of course, they are not in this repository because of the gitignore (and in dockerignore, too), so if you would like to run the code, you should use your own API keys and of course your own MongoDB database.

## Details about environment variables:
- Frontend:
	REACT_APP_BE_URL= The URL of the server side where it runs with the number of the PORT on its end

- Backend:
	MONGOURI= The connection code from MongoDB
	FRONTEND_PORT= The URL of the client side where it runs with the number of the PORT on its end
	JWTSECRET= Basicly this can be anything but you will need it for authentication
	SENDGRID_API_KEY= An API key from SendGrid to send emails at certain events

## Run the application: 

### NPM
For running the server side with npm, you have multiple options, but the most flexible way is open the 'backend' folder, type in the 'npm install' command and then: npm run server 
For running the client side you should open the 'frontend' folder and type in the 'npm install' command and then: npm start

### DOCKER
If you wish to run the application, you can find a docker-compose.yaml file in the root folder and a .env file. This .env file is needed to run the whole application sucesfully but of course it contains some sensitive data, so I let them be as a null string. If you'd like to run the application with all API key, than you can create your own and use them, I've defined earlier what kind of environment variables are they. Or optinoally you might ask a permission from me to give you my API keys. 

If you have all environment variables, thn head to the root folder and use command: docker-compose up -d

Now, open the frontend port in your browser and you should see the application running.

## !Important!

If you wish to use this application with its full capacity, you're going to need a registered user in your MongoDB!
There is no any endpoint to register a user with the User schema, so your only options are: You should upload one manually in your database; or create a mongoose insert method in the app.js file, to run it when the server kicks in!

That user object should be something like this:
{

	name: "randomName" - string,

	email: "aValidEmailWhatYouUse" - string,

	password: "BcryptedPassword" - string (bcrypt required),

	isAdmin: true - boolean,

	date: JSGeneratedNewDate - Date,

	code: "random6DigitsCode" - string,

}

Thank you reading me and and have fun!

