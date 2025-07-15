# Hotelbooking

Hotelbooking is a modern hotel management and booking platform built with Angular. It provides a seamless experience for both customers and administrators, featuring:

- Room search, booking, modification, and cancellation workflows
- Admin dashboard for managing rooms, bookings, customers, feedback, and content
- Secure authentication and user profile management
- Glassmorphism UI for a premium look and feel
- Responsive design for desktop and mobile
- LocalStorage-based data persistence for demo purposes
- Role-based access for admin and users

## Features
- **Customer Side:**
  - Search and book rooms
  - View, modify, and cancel bookings
  - Loyalty program and savings dashboard
  - Payment history and feedback submission
  - Profile and settings management

- **Admin Side:**
  - Manage rooms, bookings, customers, feedback, and site content
  - Edit booking status and send admin messages
  - View booking history and analytics

## Tech Stack

- Angular 19+
- Tailwind CSS for UI styling
- Font Awesome for icons
- LocalStorage for demo data (replaceable with backend API)

## Troubleshooting

- If you encounter build errors, try:
  - Deleting `node_modules` and running `npm install` again
  - Clearing Angular/TypeScript cache: delete `.angular` and `dist` folders
  - Make sure you are using Node.js v18+ and npm v9+

## Customization

- To change admin credentials, update the authentication logic in `auth.service.ts`.
- To connect to a real backend, replace LocalStorage calls with API requests in service files.
- To add more room types or amenities, edit the room management section in the admin dashboard.

## Contact & Support

For questions, suggestions, or support, contact:

- Project Owner: [yogesh1901](mailto:yogesh19012004@gmail.com)
- GitHub Issues: [Angular Issues](https://github.com/yogesh1901/Angular/issues)
- Copy rights - Yogeshwaran R 

## Admin & User Credentials

**Admin Login:** -- Hard coded
- Username: `admin@hotel.com`
- Password: `admin123`

**Sample User Login:**
- Username: `user1@hotel.com` --  example 
- Password: `user123` --example 

You can create additional users via the signup page. Admin credentials are fixed for demo purposes.

## How to Run the Project

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd hotelbooking
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   ng serve
   ```

4. **Open the app in your browser:**
   Navigate to [http://localhost:4200](http://localhost:4200)

5. **Login as Admin or User:**
   - Use the credentials above to log in as admin or user.

6. **Explore Features:**
   - Customers can book rooms, view booking history, manage profile, give feedback, and see savings.
   - Admins can manage rooms, bookings, customers, feedback, and site content.

## Project Structure

- `src/app/customer`: Customer-facing components (dashboard, booking, profile, payment, feedback, settings)
- `src/app/admin`: Admin-facing components (dashboard, manage rooms/bookings/customers/content/feedback)
- `src/assets`: Images and static assets
- `src/styles.css`: Global and Tailwind CSS styles


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
