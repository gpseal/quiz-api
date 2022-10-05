/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * Sets auth based routes and functions associated with each,
 * exports router object for use in app.js
 *
 * Routes:
 * /register: for registering new users
 * /login:  logging in users
 * /logout  logging out users
 *
 */

import { Router } from 'express';
import { register, login, logout } from '../../controllers/v1/auth.js';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);

export default router;
