import User from '../models/User.js';

export const getProfile = async (req, res) => {
  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    address: req.user.address,
    role: req.user.role,
  });
};

export const updateProfile = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admin profile cannot be edited' });
    }

    const { name, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name ?? req.user.name,
        address: address ?? req.user.address,
      },
      { new: true, runValidators: true }
    ).select('-password');

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};
