import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import config from '../config';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await AppDataSource.getRepository(User).findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role, }, config.jwtSecret, {
    expiresIn: '1h',
  });

  res.cookie('token', token, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
});

  res.status(200).json({ message: 'Login successful' });
});


router.get('/verify-token', async (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      return res.json({ user: decoded });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logout successful'});
});

export default router;
