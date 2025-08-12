const express = require('express');
const router = express.Router();
const Admin = require('../schema/authSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail')
const otpTamplate = require('../utils/otpEmailTamplate')
const cookiesparser = require('cookie-parser')


// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register new admin
router.post('/register', async (req, res) => {
  try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
          return res.status(400).json({ success: false, msg: 'All fields are required' });
      }

      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ success: false, msg: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOtp();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const newUser = new Admin({
          username,
          email,
          password: hashedPassword,
          otp,
          otpExpiresAt
      });

      await newUser.save();

      // Send OTP via email
      const subject = 'Verify your Email - Care to Cure Clinic';
      const html = otpTamplate(newUser);
      await sendEmail(process.env.ADMIN_EMAIL, subject, html); 

      return res.status(201).json({
          success: true,
          msg: 'User registered. OTP sent to email.',
          email: newUser.email
      });
  } catch (error) {
      console.error('Register Error:', error);
      return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

  

// Verify OTP
router.post('/verifyOtp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({success: false, msg: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({success: false, msg: 'Email already verified' });
    }

    if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({success: false, msg: 'OTP expired please try again' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({success:false, msg: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.API_KEY, { expiresIn: '7d' });
    res.cookie("token", token,{
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60000 * 60 * 24 * 7
    })
    res.status(200).json({success:true, msg: 'OTP verified', token });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({success:false, msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ msg: 'Email not verified. Please verify OTP first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // const payload = {  id: user._id, name: user.username, email: user.email } };
    const token = jwt.sign({id: user._id}, process.env.API_KEY, { expiresIn: '7d' });
    res.cookie("token", token,{
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60000 * 60 * 24 * 7 
    })
    res.status(200).json({ msg: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/verify', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isAuthenticated: false, msg: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.API_KEY);
    res.status(200).json({ isAuthenticated: true, user: decoded.user });
  } catch (err) {
    res.status(403).json({ isAuthenticated: false, msg: "Token expired or invalid" });
  }
});

router.post('/logout', async(req, res)=>{
  try {
    res.clearCookie("token");
    res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout Error:', error);
      res.status(500).json({ msg: 'Server error' });
      }
})

router.get('/user', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "Not authenticated" });
      }
      const decoded = jwt.verify(token, process.env.API_KEY);
      const user = await Admin.findById(decoded.id, { password: 0 });
      res.status(200).json(user);
      } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ msg: 'Server error' });
        }
})

module.exports = router;
