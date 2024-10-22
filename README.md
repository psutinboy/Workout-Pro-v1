# Workout Pro

## Description

Workout Pro is a comprehensive workout planning application designed to help users create personalized workout plans based on their fitness goals, available time, and preferences. With an intuitive interface and robust backend, Workout Pro simplifies the process of setting up and following a workout routine, making it easier for users to stay motivated and achieve their fitness objectives.

## Table of Contents

1. [Installation Instructions](#installation-instructions)
2. [Usage](#usage)
3. [Features](#features)
4. [License](#license)
5. [Credits](#credits)
6. [Contact Information](#contact-information)

## Installation Instructions

To set up Workout Pro locally, follow these steps:

### Prerequisites

* Node.js (v14.0 or higher)
* MongoDB (local or cloud instance)

### Steps

1. **Clone the Repository:**
```bash
git clone https://github.com/psutinboy/workout-pro.git
cd workout-pro
```

1.

**Install Dependencies:**
```bash
npm install
```

2.
**Set Up Environment Variables:** Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=<Your MongoDB connection string>
SESSION_SECRET=<Your session secret>
OPENAI_API_KEY=<Your OpenAI API key>
```

3.

**Run the Application:**
```bash
npm start
```

4. The application will run on `http://localhost:3000`.

## Usage

After setting up the project, you can use the application to create personalized workout plans.

* **Sign Up:** Create an account by providing your username, email, and password.
* **Login:** Use your credentials to log in.
* **Create a Workout Plan:** Answer a series of questions to generate a personalized workout plan based on your preferences.
* **View Your Plan:** Access your latest workout plan on the home page.

## Features

* Personalized workout plans based on fitness goals and preferences
* Intuitive interface for easy navigation
* Robust backend for efficient data management

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Credits

* **Libraries Used:**
    * [Express](https://expressjs.com/)
    * [Mongoose](https://mongoosejs.com/)
    * [Passport](http://www.passportjs.org/)
    * [OpenAI API](https://beta.openai.com/)
    * [Bcrypt](https://www.npmjs.com/package/bcrypt)
* **Contributors:**
    * [psutinboy](https://github.com/psutinboy)

## Contact Information

For any questions, suggestions, or issues, feel free to reach out:

* **Email:** grantledbetter12@gmail.com
* **GitHub:** [psutinboy](https://github.com/psutinboy)
