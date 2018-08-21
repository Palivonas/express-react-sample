import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

// a workaround to make sure user is authenticated before checking it in permission logic
store.authenticate()
	.catch((err) => {
		window.console.error(err);
	})
	.then(() => {
		ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
	});

registerServiceWorker();
