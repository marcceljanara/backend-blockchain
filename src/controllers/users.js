/* eslint-disable eol-last */
/* eslint-disable import/extensions */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../models/user-models.js';

export const getUsers = async (req, res) => {
  try {
    if (req.role === 'admin') {
      // Jika pengguna adalah admin, kembalikan semua data user
      const users = await Users.findAll({
        attributes: ['id', 'name', 'email'],
      });
      return res.json(users);
    }
    // Jika bukan admin, kembalikan data user yang sedang login
    const user = await Users.findOne({
      where: { id: req.userId },
      attributes: ['id', 'name', 'email'],
    });
    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

export const Register = async (req, res) => {
  const {
    name, email, password, confpassword,
  } = req.body;
  if (password !== confpassword) {
    return res.status(400).json({
      msg: 'Password dan Konfirmasi Password Tidak Cocok',
    });
  }

  try {
    // Cek apakah email sudah ada dalam basis data
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        msg: 'Email sudah terdaftar. Silakan gunakan email lain.',
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);

    await Users.create({
      name,
      email,
      password: hashPassword,
    });

    return res.json({
      msg: 'Registrasi Berhasil',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).json({
        msg: 'Email tidak ditemukan',
      });
    }

    const match = await bcryptjs.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({
        msg: 'Password salah',
      });
    }

    const userId = user.id;
    const { name } = user;
    const { email } = user;
    const { role } = user;
    const accessToken = jwt.sign({
      userId, name, email, role,
    }, process.env.ACCESS_TOKEN, {
      expiresIn: '2m',
    });
    const refreshToken = jwt.sign({
      userId, name, email, role,
    }, process.env.REFRESH_TOKEN, {
      expiresIn: '1d',
    });

    await Users.update({ refresh_token: refreshToken }, {
      where: {
        id: userId,
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

export const Logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(400).json({ msg: 'Refresh token tidak ada' });

  try {
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    const userId = user.id;
    await Users.update({ refresh_token: null }, {
      where: {
        id: userId,
      },
    });

    res.clearCookie('refreshToken');
    return res.status(200).json({
      msg: 'Telah logout',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confNewPassword } = req.body;

  if (newPassword !== confNewPassword) {
    return res.status(400).json({
      msg: 'Password baru dan Konfirmasi Password Tidak Cocok',
    });
  }

  try {
    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        msg: 'Pengguna tidak ditemukan',
      });
    }

    const match = await bcryptjs.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({
        msg: 'Password lama salah',
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashNewPassword = await bcryptjs.hash(newPassword, salt);

    await Users.update({ password: hashNewPassword }, {
      where: {
        id: req.userId,
      },
    });

    return res.json({
      msg: 'Password berhasil diubah',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};