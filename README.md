# Getting Started

Pull from the repository to ensure you have the latest version of the code before proceeding!

## Initial Setup for Dependencies
### Python Setup
Create your virtual environment inside of the api folder if it doesn't already exist.
```
python3 -m venv venv
```

Always source this virtual environment before proceeding with any testing.
```
source venv/bin/activate
```

To install the dependencies into your virtual environment, run:
```
pip install -r requirements.txt
```

### React/npm Setup
From the home directory, navigate to the react-flask-app folder.
```
cd react-flask-app
```

From there, install the dependencies specified in package-lock.json.
```
npm install
```

### Installing yarn/npm
If your operating system doesn't come with yarn or npm supported, you may need to install it.
```
sudo npm install -g npm
sudo npm install -g yarn
```
Note that the npm installation requires you to have Node.js already installed!

## Running Code
### Initialize API
To start the backend, run:
```
yarn start-api
```

### Start Frontend
To start the frontend, run:
```
yarn start
```