const request = require('supertest');
const { expect } = require('chai');
const _ = require('lodash');
const { init, expressApp } = require('../src/app');

const mockPosts = require('./mockPosts');
const mockUsers = require('./mockUsers');

let userId = null;
let authorization = null;
let authorization2 = null;

describe('App startup', () => {
	it('should initalize app', async () => {
		await init({ storage: ':memory:' });
	});
});
describe('Users and auth', () => {
	it('should create user1', (done) => {
		request(expressApp)
			.post('/api/users')
			.send(mockUsers[0])
			.expect(201)
			.expect(({ body }) => {
				expect(body.email).to.equal(mockUsers[0].email);
				expect(body.name).to.equal(mockUsers[0].name);
				userId = body.id;
			})
			.end(done);
	});
	it('should authenticate user1', (done) => {
		request(expressApp)
			.post('/api/auth')
			.send({ email: mockUsers[0].email, password: mockUsers[0].password })
			.expect(200)
			.expect(({ body }) => {
				expect(body.token).to.be.a('string').and.not.be.empty;
				authorization = `Bearer ${body.token}`;
			})
			.end(done);
	});
	it('should not create a user with duplicate email', (done) => {
		request(expressApp)
			.post('/api/users')
			.send(mockUsers[0])
			.expect(409)
			.end(done);
	});
	it('should create user2', (done) => {
		request(expressApp)
			.post('/api/users')
			.send(mockUsers[1])
			.expect(201)
			.expect(({ body }) => {
				expect(body.email).to.equal(mockUsers[1].email);
				expect(body.name).to.equal(mockUsers[1].name);
				expect(body.id).to.not.equal(userId);
			})
			.end(done);
	});
	it('should get a user', (done) => {
		request(expressApp)
			.get(`/api/users/${userId}`)
			.expect(200)
			.expect({
				email: mockUsers[0].email,
				name: mockUsers[0].name,
				id: userId,
			})
			.end(done);
	});
	it('should fail auth with invalid credentials', (done) => {
		request(expressApp)
			.post('/api/auth')
			.send({ email: mockUsers[1].email, password: 'spongebob' })
			.expect(401)
			.end(done);
	});
	it('should authenticate user2', (done) => {
		request(expressApp)
			.post('/api/auth')
			.send({ email: mockUsers[1].email, password: mockUsers[1].password })
			.expect(200)
			.expect(({ body }) => {
				expect(body.token).to.be.a('string').and.not.be.empty;
				authorization2 = `Bearer ${body.token}`;
			})
			.end(done);
	});
});

describe('Posts', () => {
	it('should get zero posts', (done) => {
		request(expressApp)
			.get('/api/posts')
			.expect(200, [])
			.end(done);
	});
	it('should not create a post without auth', (done) => {
		const post = mockPosts[0];
		request(expressApp)
			.post('/api/posts')
			.send(post)
			.expect(401)
			.end(done);
	});
	it('should not create a post without data', (done) => {
		request(expressApp)
			.post('/api/posts')
			.set('Authorization', authorization)
			.send({ title: '' })
			.expect(422)
			.end(done);
	});
	it('should create a post', (done) => {
		const post = mockPosts[0];
		request(expressApp)
			.post('/api/posts')
			.set('Authorization', authorization)
			.send(post)
			.expect(201)
			.expect(({ body }) => {
				expect(body.createdAt).to.not.be.empty;
				expect(body.authorId).to.equal(userId);
				delete body.createdAt;
				delete body.authorId;
			})
			.expect(post)
			.end(done);
	});
	it('should create another post', (done) => {
		const post = mockPosts[1];
		request(expressApp)
			.post('/api/posts')
			.set('Authorization', authorization)
			.send(post)
			.expect(201)
			.expect(({ body }) => {
				expect(body.createdAt).to.not.be.empty;
				expect(body.authorId).to.equal(userId);
				delete body.createdAt;
				delete body.authorId;
			})
			.expect(post)
			.end(done);
	});
	it('should get created posts', (done) => {
		request(expressApp)
			.get('/api/posts')
			.expect(200)
			.expect(({ body }) => {
				body.forEach((post) => {
					delete post.createdAt;
					delete post.authorId;
				});
				// server should order posts by created date descending
				expect(body).to.deep.equal([mockPosts[1], mockPosts[0]], 'Posts data or order incorrect');
			})
			.end(done);
	});
	it('should get a single post by ID', (done) => {
		request(expressApp)
			.get('/api/posts/2')
			.expect(200)
			.expect(({ body }) => {
				const post = _.omit(body, 'createdAt', 'authorId');
				expect(post).to.deep.equal(mockPosts[1]);
			})
			.end(done);
	});
	it('should not delete a post without auth', (done) => {
		request(expressApp)
			.delete('/api/posts/2')
			.expect(401)
			.end(done);
	});
	it('should not delete a post by another author', (done) => {
		request(expressApp)
			.delete('/api/posts/2')
			.set('Authorization', authorization2)
			.expect(403)
			.end(done);
	});
	it('should delete a post', (done) => {
		request(expressApp)
			.delete('/api/posts/2')
			.set('Authorization', authorization)
			.expect(204)
			.end(done);
	});
	it('should not find the deleted post by ID', (done) => {
		request(expressApp)
			.get('/api/posts/2')
			.expect(404)
			.end(done);
	});
	it('should get less posts in index', (done) => {
		request(expressApp)
			.get('/api/posts')
			.expect(({ body }) => {
				expect(body).to.have.lengthOf(1);
			})
			.end(done);
	});
	it('should delete user', (done) => {
		request(expressApp)
			.delete(`/api/users/${userId}`)
			.set('Authorization', authorization)
			.expect(204)
			.end(done);
	});
	it('should have deleted user posts as well', (done) => {
		request(expressApp)
			.get('/api/posts')
			.expect([])
			.end(done);
	});
});
