# Image Guesser

## Example Admin User Login Details for Testing

Admin User:

The admin user is not a normal priveledge any user can obtain through normal use of the website,
as you cannot use the UI to sign up to be an admin account due to safety reasons. Instead someone must register for a normal account and in the appwrite database, the database owners (group 12) will set an admin label on that account, which will be checked for on the client side when the user logs in to grant
the admin permissions.

Example Admin User Login Credentials:

- Email: admin123@gmail.com
- Password: password

## Docker Deployment

To deploy the application using docker.

1. Open a terminal in the project repository and enter:
   `npm install `
2. After the required libraries are installed, enter:
   `docker compose up --build `
3. After it the container has been built, it can be checked by entering in another terminal:
   `docker ps`
4. Open the website by opening the following in a browser:
   `http://localhost:5173/` \*_It should be port 5173_

## Render Deployment

https://seng513-202501-group-12.onrender.com/
