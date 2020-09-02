# FarmLink
Our capstone project is a web application that helps FarmLink, a non-profit organization that moves food surplus from farms around the country to food banks in need, by automating the process of matching a food bank with a farm.
# How to get application running!
In this README file we will briefly explain how to get this application up and running on your computer. Feel free to reach out to the contributors to the repo for any further assistance.
## Step #1: Clone the Repository
In a terminal, navigate to the directory where you would like to clone the repository. Then in your browser, navigate to the main page of the repository, press the green code button, and then copy the link under "Clone with HTTPS".

Go to this [GitHub Tutorial](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) to learn more about how to clone a repository.
## Step #2: Download Dependencies 
If you haven't installed npm, navigate to this [download tutorial](https://www.npmjs.com/get-npm) and do so before continuing.

Now, navigate to the `view` directory within the codebase and run the following command:

    ~/farmlink/view npm install

Now repeat the process in the functions directory:

    ~/farmlink/functions npm install
Now you can test if the React application runs by running the following command in the view directory (if it doesn't run, you will likely need to download a missing dependency)

    ~/farmlink/functions npm start
If it runs, then you are good to go onto the next step!
## Step #3: Setup Firebase
Create a project in Firebase (go to this [tutorial](https://firebase.google.com/docs/projects/learn-more) to learn how) and run the following after doing so:

    ~/farmlink/functions npm install -g firebase-tools
    firebase init

Once you have run `firebase init`, answer the prompts as follows:

    Which Firebase CLI features do you want to set up for this folder? 
    => Functions: Configure and deploy Cloud Functions
    First, let’s associate this project directory with a Firebase project...
    => Use an existing project
    Select a default Firebase project for this directory
    => application_name 
    Do you want to use ESLint to catch probable bugs and enforce style?
    => No
    Do you want to install dependencies with npm now?
    => Yes

After this, you should see the following message:

    ✔ Firebase initialization complete!

## Step #3: Setup Firebase Firestore

Go to the database tab in Firebase console and create a database set to `test mode` and choose `us-central` as your hosting location.

If you would like to test Firebase Firestore locally, run `firebase serve` in the functions directory. We recommend using [Postman](https://www.postman.com/) as a tool for testing the APIs.

If you get an error regarding credentials when you run `firebase serve`, then use the following steps to fix it:

1. Go to the **Project Settings** tab in the Firebase Console
2. Go to the **Service Accounts tab**
3. There will be an option of **Generating a New Key**. Click on that option and it will download a file with a `.json` extension.
4. Use the command below to connect these credentials 

    export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/[FILE_NAME].json

And run: `firebase login --reauth`

## Step #4: Setup Firebase Authentication

Go to the **Project Settings > General** in Firebase Console and select the web application icon (which should contain `</>` in the icon). Now follow the process for making the web application. At the end of the process you will click **Continue to Console** and see a `.json` with the firebase config. Paste the contents of this `.json` into the `config.js` file in the **functions > util** directory of the application repository.
## Step #5: Setup Cloud Storage
Go to **Firebase Console > Storage** and click the **Get Started** button. Follow the directions to set up Cloud Storage.

Now go to the **Rules** tab and update the rules to the following:

    rules_version = '2';
    service firebase.storage {
	    match /b/{bucket}/o {
		    match /{allPaths=**} {
			    allow read;
			}
		}
	}

## Finished!

At this point, the repository and Firebase should be set up. We hope you enjoy using our code and feel free to reach out to the contributors with any questions. 
# Appendix
# Repository Structure
Here is a very basic description of the repository structure:
* `~/farmlink/functions` > contains all of the Cloud Functions (handle all of the CRUD operations / backend)
* `~/farmlink/view` > contains the React Application (handles all of the frontend of the application)

# Development Tips

## Back-End

    cd functions
    firebase serve

## Front-End

    cd view
    npm start

# Deployment Tips

## Back-End

    cd functions
    firebase deploy

## Front-End

    cd view
    npm run build
    firebase deploy
