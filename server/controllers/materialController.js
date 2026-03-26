import Material from '../models/Material.js';

export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    return res.json(materials);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch materials' });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const { materialCode, yarnType, color, pricePerMeter, stock, description } = req.body;
    let imageURL = req.body.imageURL || '';

    if (req.file) {
      imageURL = `/uploads/${req.file.filename}`;
    }

    if (!materialCode || !yarnType || !color || pricePerMeter === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Required material fields are missing' });
    }

    const existing = await Material.findOne({ materialCode });
    if (existing) {
      return res.status(409).json({ message: 'Material code already exists' });
    }

    const material = await Material.create({
      materialCode,
      yarnType,
      color,
      pricePerMeter,
      stock,
      description: description || '',
      imageURL,
    });

    return res.status(201).json(material);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create material' });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    }

    const material = await Material.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    return res.json(material);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update material' });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    return res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete material' });
  }
};
