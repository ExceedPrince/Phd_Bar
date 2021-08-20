# Phd Bar Server Side

There are some secret/dynamic information in this code, which can be found in .env files in both sides of the project.
Of course, they are not in this repository because of the gitignore (and in dockerignore, too), so if you would like to run the code, you should use your own API keys and of course your own MongoDB database.

Details about environment variables in this folder:

- Backend:
	MONGOURI= The connection code from MongoDB
	FRONTEND_PORT= The URL of the client side where it runs with the number of the PORT on its end
	JWTSECRET= Basicly this can be anything but you will need it for authentication
	SENDGRID_API_KEY= An API key from SendGrid to send emails at certain events

For running the server side you have multiple options, but the most flexible way is open the 'backend' folder, type in the 'npm install' command and then: npm run server 

## !Important!

If you wish to use this application with its full capacity, you're going to need a registered user in your MongoDB!
There is no any endpoint to register a user with the User schema, so your only options are: You should upload one manually in your database; or create a new endpoint where you can post or insert a new user with a valid email!

Thank you reading me and and have fun!