import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { register, login, changePassword, deleteUser, blockUser, unblockUser, editUser } from "../controllers/userController";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";



// test/userController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const app = require('../index'); // Assuming Express app is exported from app.js
const userPayload = { username: 'test', password: 'password' };


vi.mock('../models/userModel', () => ({
    findOne: vi.fn(), // Mocking findOne method
    create: vi.fn()    // Mocking create method if needed
  }));
vi.mock("../models/documentModel");
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");
vi.mock("fs/promises");

describe("userController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if username or password is missing", async () => {
      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
   
    });

    it("should return 400 if password is too short", async () => {
      const req = { body: { username: "test", password: "123" } };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
  
    });

   
  });


  describe('PUT /change-password', () => {
    it('should return 400 if token, oldPassword, or newPassword is missing', async () => {
        const res = await request(app).put('/api/user/change-password').send({});
        expect(res.status).toBe(400);
        // expect(res.text).toBe('token, old password and new password are required');
    });

    it('should return 400 if token is invalid', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).put('/api/user/change-password')
            .set('token', 'invalid-token')
            .send({username: 'existingUser', oldPassword: '123456', newPassword: 'newpassword' });

        expect(res.status).toBe(400);
     
    });

    it('should return 400 if user is not found', async () => {
        jwt.verify.mockReturnValue({ username: 'nonexistentUser' });
      

        const res = await request(app).put('/api/user/change-password')
            .set('token', 'valid-token')
            .send({ username: 'existingUser', oldPassword: '123456', newPassword: 'newpassword' });

        expect(res.status).toBe(400);
       
    });

    it('should return 400 if old password does not match', async () => {
        jwt.verify.mockReturnValue({ username: 'existingUser' });
      
        bcryptjs.compare.mockResolvedValue(false);

        const res = await request(app).put('/api/user/change-password')
            .set('token', 'valid-token')
            .send({ username: 'existingUser', oldPassword: 'wrongpassword', newPassword: 'newpassword' });

        expect(res.status).toBe(400);
      
    });

 
});
describe('DELETE /user/delete', () => {
    it('should return 400 if token or password is missing', async () => {
        const res = await request(app).delete('/api/user/delete').send({});
        expect(res.status).toBe(400);
        expect(res.text).toBe('token and password are required');
    });

    it('should return 400 if token is invalid', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).delete('/api/user/delete')
            .set('token', 'invalid-token')
            .send({ password: 'password' });

        expect(res.status).toBe(400);
        expect(res.text).toBe('invalid token');
    });

    it('should return 400 if user is not found', async () => {
        jwt.verify.mockReturnValue({ username: 'nonexistentUser' });
       

        const res = await request(app).delete('/api/user/delete')
            .set('token', 'valid-token')
            .send({ password: 'password' });

        expect(res.status).toBe(400);
      
    });

    it('should return 400 if password does not match', async () => {
        jwt.verify.mockReturnValue({ username: userPayload.username });
       
        bcryptjs.compare.mockResolvedValue(false);

        const res = await request(app).delete('/api/user/delete')
            .set('token', 'valid-token')
            .send({ password: 'wrongpassword' });

        expect(res.status).toBe(400);
      
    });

});

 
});
