# usersDashboard

A simple Vue 3 project for managing users and roles. It includes a dashboard to view users, create/edit/delete them, and see their roles with permissions. Built with Vue 3, Vuetify, Pinia, and tested with Cypress.

## Setup

1. Clone the repo: `git clone https://github.com/toqahussienyoussef/usersDashboard.git`
2. Install dependencies: `npm install`
3. Run the app: `npm run dev`

## Project Features

- View all users with filters and search.
- Create, edit, and delete users (admin/manager only).
- View roles with permissions (admin only).
- Confirmation dialogs for delete actions.
- Toaster notifications for success/error messages.

## Questions and Answers

### 1. How would you optimize API calls in this application for performance?

To make API calls faster, I’d reduce how often we call them. For example, in `usersStore`, we fetch users and roles when the app loads. Instead of fetching every time, we could fetch once and save the data locally (like in Pinia). We’d only fetch again if something changes, like adding a new user. Also, we could limit how much data comes back by adding filters to the API calls (e.g., fetch only 10 users at a time). This saves time and makes the app feel quicker, especially with lots of users.

### 2. Describe your approach to handling shared logic between components.

For shared logic, we already use Pinia stores like `usersStore` and `confirmationDialog`. This keeps code like fetching users or showing dialogs in one place, so components like `UsersView` and `RolesView` don’t repeat it. If two components need the same thing (like formatting a name), I’d make a small function in a file (e.g., `utils/helpers.ts`) and import it where needed. This keeps things simple and easy to update later.

### 3. How would you implement client-side data caching for this dashboard?

Caching means saving data on the user’s browser so we don’t fetch it again. I’d use Pinia to store data like users and roles after fetching them. For example, in `usersStore`, once `fetchUsers` gets the list, it stays in `users.value` until the app closes. To make it even better, we could save it in `localStorage` too, so it’s there even if the user refreshes the page. We’d just check if the data is old (like older than an hour) and fetch again if needed.

### 4. What strategy would you use to scale this application if it needed to support hundreds of different user permission types?

If we had hundreds of permissions, I’d change how we handle roles. Right now, permissions are simple lists in `usersStore`. I’d make a new store, `permissionsStore`, to manage them separately with IDs and names (e.g., `{ id: 1, name: "view_users" }`). Each role would link to permission IDs instead of full lists. This keeps data small and fast. For the UI, I’d add a filterable table in `RolesView` to manage permissions easily, even with hundreds of options.

### 5. Explain your testing strategy and how you decided what to test.

For testing, we used Cypress to check the main parts of the app. I focused on what users do most: viewing users (`UsersView`), deleting with dialogs (`ConfirmationDialog`), and fetching data (`usersStore`). We tested about 70% of the app—key components and store actions—because these are critical for the app to work right. I skipped smaller bits as the time was tight. Cypress component tests let us simulate clicks and check results, making sure the app behaves as expected.

### 6. How would you handle offline capabilities in this application?

To work offline, I’d save data like users and roles in `localStorage` using Pinia. When the app loads, it checks if there’s internet. If not, it uses the saved data to show the list. Actions like delete or create would wait in a queue (stored in `localStorage`) until the internet’s back, then sync with the server. We’d show a message like “You’re offline” in the UI so users know. This keeps the app usable without a connection.



## Test Coverage Information

We use Cypress to test about 70% of the app. This covers the main parts users interact with:
- **Components**: 
  - `UsersView.vue` (user list rendering, delete triggers).
  - `ConfirmationDialog.vue` (dialog display, confirm/cancel actions).
  - `DefaultLayout.vue` (navigation and user info display).
- **Stores**: 
  - `usersStore` (fetching users, deleting users).
- **Skipped**: Smaller parts like `Toaster.vue` and some `authStore` details to keep tests simple.

The focus is on critical features like showing users, deleting them with confirmation, and basic navigation. This ensures the app’s core works well.

## How to Run Tests

1. **Install Dependencies**: Make sure you’ve run `yarn` to get Cypress and other tools.
2. **Open Cypress**: Run this command to see and run tests:
   ```bash
   npx cypress open --component