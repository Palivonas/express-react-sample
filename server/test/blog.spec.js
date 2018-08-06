const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

const mockPosts = require('./mockPosts');
const mockUsers = require('./mockUsers');

let authorization = null;
let userId = null;

describe('Users and auth', () => {
	it('should create a user', (done) => {
		request(app)
			.post('/api/users')
			.send(mockUsers[0])
			.expect(201, {
				email: mockUsers[0].email,
				name: mockUsers[0].name,
				id: '1',
			})
			.end(done);
	});
	it('should create another user', (done) => {
		request(app)
			.post('/api/users')
			.send(mockUsers[1])
			.expect(201, {
				email: mockUsers[1].email,
				name: mockUsers[1].name,
				id: '2',
			})
			.expect(({ body }) => {
				userId = body.id;
			})
			.end(done);
	});
	it('should get a user', (done) => {
		request(app)
			.get(`/api/users/${userId}`)
			.expect(200, {
				email: mockUsers[1].email,
				name: mockUsers[1].name,
				id: '2',
			})
			.end(done);
	});
	it('should fail auth with invalid credentials', (done) => {
		request(app)
			.post('/api/auth')
			.send({ email: mockUsers[1].email, password: 'spongebob' })
			.expect(401)
			.end(done);
	});
	it('should authenticate', (done) => {
		request(app)
			.post('/api/auth')
			.send({ email: mockUsers[1].email, password: mockUsers[1].password })
			.expect(200)
			.expect(({ body }) => {
				expect(body.token).to.be.a('string').and.not.be.empty;
				authorization = `Bearer ${body.token}`;
			})
			.end(done);
	});
});

describe('Posts', () => {
	it('should get zero posts', (done) => {
		request(app)
			.get('/api/posts')
			.expect(200, [])
			.end(done);
	});
	it('should not create a post without auth', (done) => {
		const post = mockPosts[0];
		request(app)
			.post('/api/posts')
			.send(post)
			.expect(401)
			.end(done);
	});
	it('should create a post', (done) => {
		const post = mockPosts[0];
		request(app)
			.post('/api/posts')
			.set('Authorization', authorization)
			.send(post)
			.expect(201)
			.expect(({ body }) => {
				expect(body.createdAt).to.not.be.empty;
				delete body.createdAt;
			})
			.expect(post)
			.end(done);
	});
	it('should create another post', (done) => {
		const post = mockPosts[1];
		request(app)
			.post('/api/posts')
			.set('Authorization', authorization)
			.send(post)
			.expect(201)
			.expect(({ body }) => {
				expect(body.createdAt).to.not.be.empty;
				delete body.createdAt;
			})
			.expect(post)
			.end(done);
	});
	it('should get created posts', (done) => {
		request(app)
			.get('/api/posts')
			.expect(200)
			.expect(({ body }) => {
				body.forEach((post) => delete post.createdAt);
				// server should order posts by created date descending
				expect(body).to.deep.equal([mockPosts[1], mockPosts[0]], 'Posts data or order incorrect');
			})
			.end(done);
	});
	it('should get a single post by ID', (done) => {
		request(app)
			.get('/api/posts/2')
			.expect(200)
			.expect(({ body }) => {
				delete body.createdAt;
				expect(body).to.deep.equal(mockPosts[1]);
			})
			.end(done);
	});
	it('should not delete a post without auth', (done) => {
		request(app)
			.delete('/api/posts/2')
			.expect(401)
			.end(done);
	});
	it('should delete a post', (done) => {
		request(app)
			.delete('/api/posts/2')
			.set('Authorization', authorization)
			.expect(204)
			.end(done);
	});
	it('should not find the deleted post by ID', (done) => {
		request(app)
			.get('/api/posts/2')
			.expect(404)
			.end(done);
	});
	it('should get less posts in index', (done) => {
		request(app)
			.get('/api/posts')
			.expect(({ body }) => {
				expect(body).to.have.lengthOf(1);
			})
			.end(done);
	});
});
