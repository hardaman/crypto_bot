
# Crypto Bot

In order to work with this, make sure you have cloned this on your system.

You can do this by : 

git clone https://github.com/hardaman/crypto_bot.git

Once you have the directory on your system

cd ./crypto_bot

Here, you'll see three scripts -

- crypto_bot1.js
- crypto_bot2.js
- crypto_bot3.js

First script, crypto_bot1, is for sending mails against a particular symbol, eg. BNBUSDT, recommending a BUY Signal, if the requirements match.

For that you'd have to configure crypto_bot1.js

In that you have to set your E-mail Address, in order to be a sender, which is on Line 13 & Line 20.

The password needs to be configured as well, but your normal password is not going to work and you'll have to create a special access password for this.

Here's how you can do that :

- Visit this link - https://myaccount.google.com/security
- Scroll down & In Looking for something else Section, Click on Search Option.
- In the Search Bar, look for "App Passwords"
- Clicking on that will require a Login, and then Select "Mail" as an option for selecting app.
- For Select Device, choose others and write any name, for instance - "Crypto Bot".
- Then. click on Generate and you'll have a 16 digit password which you can use in the password configuration.

After you're done with your E-mail and Password configuration pass the receiver's E-mail ID when calling the function, on Line 59.

This is all the configuration you need. Then you can run the scripts like this :

- npm run script1 -- BNBUSDT 

For other two scripts we can run :

- npm run script2 -- ETH && npm run script3 -- SHIB

You can pass any other argument as well instead of ETH & SHIB, as long as it's supported by CoinBase.



