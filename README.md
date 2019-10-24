# f19-health-calendar

A calendar app to help schedule your life.

## Teams (Subject to change/flexibility)

Front-End:
- Larry
- Lisa
- Kelly

Back-End:
- Tejna
- Danny
- Medha

## Setting up

### Cloning the Repo

If you haven't used GitHub before, it's not too hard to get started.

To get the repo onto the computer, run the following command in your terminal/command prompt in your home directory:
```
git clone https://github.com/txconvergent/f19-health-calendar.git
```

After finishing running it, you should have a new folder in your home directory called `f19-health-calendar/`. Go into it and you should see the contents of this repo.

### Installing the stuff

For our project, we need to be able to use React Native and Flask from Python. I'll go over how to install the dependencies required for both.

#### Node.js / React Native

We went over this in meeting, but it's good to review.

1. First, download both. Get Node.js and NPM [here](https://nodejs.org/en/), as they're both bundled together. Check if you have both by running the commands, `node -v` and `npm -v` to check their versions.

2. Now, we need to install Expo, a tool used to compile, build, and test React Native Apps for development. Run `npm install -g expo-cli to install it (the `-g` flag means install this globally onto the system for use everywhere).

    2a. If an error pops up, you might not have permissions to install an npm package globally. Do the command:
    `sudo npm install -g expo-cli` where prepending sudo allows you to run things with root permissions.

3. Because the repository is already cloned, we're done! Open the `client` folder with your terminal and run
```
npm start
```
to start the expo environment, which will allow you to run the app on your phone using the Expo app on the app store.

#### Python / Flask

1. If you don't already have Python 3.7 installed, get it [here](https://www.python.org/downloads/) and install. Pip, the Python package manager equivalent to NPM for Node.js should be automatically with Python 3.7 as well.

2. Now, we need to install pipenv, a module that will allow us to use local repository dependencies (modules that we download, like Flask, that we store locally in our repository that our program depends on) and run our Flask app. Run the following to install:
```
pip install pipenv
```

3. To run the flask app, first do
```
pipenv shell
```
to launch pipenv's virtual environment. In there, you then type
```
flask run
```
to run the Flask app. Type `localhost:5000` in the browser and you should see the app run with a "Hello world!" message.
