# 🎉 Gigmosaic Backend

[![CI/CD Pipeline](https://github.com/aplicy-com/gigmosaic-be-chatbot-mgmt-service/actions/workflows/main-cicd.yml/badge.svg)](https://github.com/aplicy-com/gigmosaic-be-chatbot-mgmt-service/actions/workflows/main-cicd.yml)
[![Dependabot Updates](https://github.com/aplicy-com/gigmosaic-be-chatbot-mgmt-service/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/aplicy-com/gigmosaic-be-chatbot-mgmt-service/actions/workflows/dependabot/dependabot-updates)

This repository contains the backend implementation for the gigmosaic-be-chatbot-mgmt-service. It is built using Node.js, Express, and Mongodb, and it handles events management with user permissions.

## 📚 Table of Contents

- [🎉 Gigmosaic Backend](#-gigmosaic-backend)
  - [📚 Table of Contents](#-table-of-contents)
  - [🚀 Getting Started](#-getting-started)
    - [⚙️ Installation](#️-installation)
  - [🛠️ Usage](#️-usage)
    - [Running in Development](#running-in-development)
    - [Building for adminion](#building-for-adminion)
  - [📁 Project Structure](#-project-structure)
  - [🔧 Environment Variables](#-environment-variables)
  - [🤝 Contributing](#-contributing)
  - [📜 License](#-license)

## 🚀 Getting Started

Follow the instructions below to get the project up and running on your local machine.

###📋 Prerequisites
Ensure you have the following installed:

- 🌐 Node.js (v20.x or later)
- 📦 npm (v6.x or later) or Yarn (v1.x or later)
- 🗄️ Mongodb

### ⚙️ Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/gigmosaic-be-chatbot-mgmt-service-be.git
    cd gigmosaic-be-chatbot-mgmt-service-be-chatbot-mgmt-service
    ```

2. Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up the environment variables:

    Create a `.env` file in the root directory and add the necessary environment variables as shown in the [Environment Variables](#environment-variables) section.

4. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

## 🛠️ Usage

### Running in Development

To run the project in development mode with hot reloading:

```bash
npm run dev
# or
yarn dev
```

### Building for adminion

To build the project for adminion:

```bash
npm run build
# or
yarn build
```

To start the adminion server:

```bash
npm start
# or
yarn start
```

## 📁 Project Structure

```plaintext
gigmosaic-be-chatbot-mgmt-service-be/

gigmosaic-be-chatbot-mgmt-service-be/
├── src/
│   ├── api/
│   │   ├── router.js
│   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── config/
│   │   │   └── utils/
│   │   └── v1/
│   │       ├── termsAndCondition/
│   │       └── .../
│   ├── OpenApi.yml
│   ├── app.ts
│   └── server.ts
├── .env
├── resources/
├── package.json
└── README.md


```

## 🔧 Environment Variables

The project uses the following environment variables:

```plaintext
#local
FRONTEND_DOMAIN=http://localhost:3000
NODE_ENV=development
PORT=3040
MONGODB_URL=mongodb://localhost:27017/gigmosaic-be-chatbot-mgmt-service

#email server
SOURCE=
COMPANY_EMAIL =

# itisid company connection
API_URL=https://api.itisid.com
VERIFICATION_LINK=
EMAIL=miloxe@polkaroad.net
PASSWORD=Test@123
Email_LIST=50
```

Ensure these are set in your `.env` file before starting the project.

## 🤝 Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
