import { Request, Response } from 'express';
import Service from '../models/service.model';
import { generateApiKey, generateSecret } from '../utils/token.utils';

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, allowedOrigins } = req.body;
    
    // Check if service already exists
    const existingService = await Service.findOne({ name });
    
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service with this name already exists'
      });
    }
    
    // Generate API key and secret
    const apiKey = generateApiKey();
    const secret = generateSecret();
    
    // Create new service
    const service = new Service({
      name,
      apiKey,
      secret,
      allowedOrigins: allowedOrigins || [],
      isActive: true
    });
    
    await service.save();
    
    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        id: service._id,
        name: service.name,
        apiKey: service.apiKey,
        secret: service.secret,
        allowedOrigins: service.allowedOrigins,
        isActive: service.isActive
      }
    });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all services
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().select('-secret');
    
    return res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get a single service
export const getService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id).select('-secret');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, allowedOrigins, isActive } = req.body;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Update fields
    if (name) service.name = name;
    if (allowedOrigins) service.allowedOrigins = allowedOrigins;
    if (isActive !== undefined) service.isActive = isActive;
    
    await service.save();
    
    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: {
        id: service._id,
        name: service.name,
        apiKey: service.apiKey,
        allowedOrigins: service.allowedOrigins,
        isActive: service.isActive
      }
    });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Regenerate API key and secret
export const regenerateKeys = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Generate new API key and secret
    service.apiKey = generateApiKey();
    service.secret = generateSecret();
    
    await service.save();
    
    return res.status(200).json({
      success: true,
      message: 'API key and secret regenerated successfully',
      data: {
        id: service._id,
        name: service.name,
        apiKey: service.apiKey,
        secret: service.secret,
        allowedOrigins: service.allowedOrigins,
        isActive: service.isActive
      }
    });
  } catch (error) {
    console.error('Regenerate keys error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 