import Material from '../models/Material.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { materialId, quantity, color, paymentMethod, deliveryAddress } = req.body;

    if (!materialId || !quantity || !color || !paymentMethod || !deliveryAddress) {
      return res.status(400).json({ message: 'All order fields are required' });
    }

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (material.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const totalPrice = material.pricePerMeter * quantity;

    const order = await Order.create({
      userId: req.user._id,
      materialId,
      quantity,
      color,
      paymentMethod,
      deliveryAddress,
      totalPrice,
      orderStatus: 'Pending',
    });

    material.stock -= quantity;
    await material.save();

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('materialId', 'materialCode yarnType pricePerMeter')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;

    if (req.user.role !== 'admin' && String(req.user._id) !== String(requestedUserId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orders = await Order.find({ userId: requestedUserId })
      .populate('materialId', 'materialCode yarnType pricePerMeter color')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!['Pending', 'Processing', 'Shipped', 'Delivered'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update order status' });
  }
};
