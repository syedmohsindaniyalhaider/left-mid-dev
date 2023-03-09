# Left Mid Admin Panel
This is where coaches / manager from Leftmid app can create, edit assessments for players in their team after every events.
# How to use

**Step 1:**

Add new .env file with the same level as .env.sample

Fill all information needed for firebase connection in .env file

Check .env.sample if you don't know what to fill

**Step 2:**

Open console inside the downloaded folder and execute the following command: 

```
git checkout develop
yarn install
```

**Step 3:**

After installing necessary packages, execute command below to run the web:

```
yarn start
```

# Main Features
- Login, logout
- View/Create assessments for events 
- Give reflection for player, mark their psychology status for the specific event
- Add player, event to existing assessment
- View player profile

# Code editing

Before modifying the code, please install eslint, prettier to follow the our code rules

```
yarn add --save-dev --save-exact prettier eslint-config-prettier
```

Also install husky and lint-staged for the project

```
npm install husky --save-dev
```

# Firebase: Storage & Cloud Function
- [firebase_storage](https://firebase.google.com/)
- [cloud_firestore](https://firebase.google.com/docs/firestore)
- [cloud_functions](https://firebase.google.com/docs/functions)

# State Management
- [redux_toolkit](https://redux-toolkit.js.org/)
