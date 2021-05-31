# Hypixel Status Bot

A Discord bot that tracks players' online status on the Hypixel Minecraft server to provide notifications and statistics!

## Limitations

This was created as a custom bot for a private Discord server, so it does not provide much flexibility/configuration. However, feel free to tweak it to your needs, or even contribute!

The bot is not designed to work in multiple servers and will not work properly in such situations. This is partially because Hypixel's API rate limit only allows this to work for a limited number of players, otherwise the polling frequency would need to be much slower.

Lastly, I'm a relatively inexperienced developer, so some things may be a bit lacking.

## Installation
Here are the steps if you would like to host your own copy of the bot for your server.

### Discord
First, we need to register our bot's account.
1. Head over to the [Discord Developer Portal](https://discord.com/developers/applications) and log in if neccasary
2. Create a new application
3. Navigate to the "bot" section and click "Add Bot"
4. Uncheck "public bot", as the bot will only be in your server (see limitations)
5. Copy the token, and save it for later
6. Change the profile picture and name of the bot if you would like (I suggest naming it "Hypixel Status Bot")
7. Navigate to the OAuth2 Section, scroll down and check the "bot" scope, then use the link to add the bot to your server! Make sure it has `Send Messages`, `Manage Roles`, and `Embed Links` permissions.

### MongoDB Database
The bot uses a MongoDB Database to store data. I choose to use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to host my copy of the bot, but you may host yours anywhere.

Set up a Mongo server/cluster and create a database user with read and write access. Create a database within the server to store your data. Make note of the database name, and a connection string (You can find this in Atlas by clicking the "connect" button).

### Hypixel API Key
You will also need a Hypixel API key. Join Hypixel using Minecraft, and type the command `/api new` in chat. Make note of the API key for later! 

### Hosting and enviorment variables
You can host the bot locally, or use a cloud hosting provider such as [Heroku](https://www.heroku.com) or [Replit](https://replit.com/site/hosting). Clone the repository into a location of your choice, or download it through Github.

For the bot to work, you must configure the following enviorment variables:
- `HYPIXEL_KEY`: The Hypixel API key you obtained earlier
- `BOT_TOKEN`: The Discord bot token from earlier
- `MONGO_URI`: The MongoDB connection string
- `DB_NAME`: The name of the MongoDB database you would like to store data in
- `GUILD_ID`: The ID of the Discord server you are setting up the bot for
- `CHANNEL_ID`: The ID of the Discord channel you would like online/offline notifications to be sent to
- `ROLE_ID`: The ID of the Discord role you would like to be given to online members
- `OWNER_ID`: Your Discord user ID
- `TZ`: The time zone you would like the bot to operate in

To start the bot, run `npm start` or `node src/index` in the repository's root directory!

If you are hosting locally, you may want to use `dotenv` to load the enviorment variables. Create a `.env` file at the root of the project with the variables listed above. When starting the bot, use `npm dotenv` or `node -r dotenv/config src/index` instead of the above commands.

That's it! Thanks!