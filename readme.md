## Sample React + Express blog app

### Starting server
* Node 8+ required
* `yarn install` (or `npm install`, no lock file though)
* `yarn start`
* Listens on port 3001 or PORT env variable
* API is on `/api`
* `../client/build` is served on `/`

### Starting client
* `yarn install`
* `yarn start` for development
* `yarn build` to serve from API server

### Linting, testing
* `yarn lint` in both `client` and `server`
* `yarn test` in `server` (no client tests yet)

## Server overview
* [express](https://github.com/expressjs) with a few routes - users, posts, auth and root for static files
* [sequelize](https://github.com/sequelize/sequelize) models using SQLite
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for authorization
* [mocha](https://github.com/mochajs/mocha) + [supertest](https://github.com/visionmedia/supertest) + [chai](https://github.com/chaijs/chai) for tests

## Client overview
* [react-create-app](https://github.com/facebook/create-react-app) for bootstraping the project
* [react-router](https://github.com/ReactTraining/react-router) v4
* [react-easy-state](https://github.com/solkimicreb/react-easy-state)  for state management
* [axios](https://github.com/axios/axios) for HTTP requests
* [marked](https://github.com/markedjs/marked) for post content rendering