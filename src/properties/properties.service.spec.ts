import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { Property } from './schemas/property.schema';
import { GeminiService } from '../common/gemini.service';

describe('PropertiesService', () => {
  let service: PropertiesService;

  const mockPropertyDoc = {
    _id: '507f1f77bcf86cd799439011',
    address: '123 High Street',
    amenities: ['parking'],
    description: 'A nice flat',
  };

  const mockModel = Object.assign(
    function (dto: unknown): unknown {
      const inst = { ...mockPropertyDoc, ...dto } as Record<string, unknown>;
      inst.save = jest.fn().mockResolvedValue(inst) as unknown;
      return inst;
    },
    {
      find: jest.fn().mockReturnThis(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    },
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    mockModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPropertyDoc),
    });
    mockModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPropertyDoc),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getModelToken(Property.name),
          useValue: mockModel,
        },
        {
          provide: GeminiService,
          useValue: {
            embedText: jest.fn().mockResolvedValue([0.1, 0.2]),
          },
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a property', async () => {
      const dto = {
        address: '123 High Street',
        amenities: ['parking'],
        description: 'Nice',
      };
      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockModel.findById).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      mockModel.exec.mockResolvedValue([mockPropertyDoc]);
      const result = await service.findAll(10, 0);
      expect(result).toEqual([mockPropertyDoc]);
      expect(mockModel.find).toHaveBeenCalled();
      expect(mockModel.limit).toHaveBeenCalledWith(10);
      expect(mockModel.skip).toHaveBeenCalledWith(0);
    });
  });

  describe('findById', () => {
    it('should return a property when found', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPropertyDoc),
      });
      const result = await service.findById('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockPropertyDoc);
    });

    it('should throw NotFoundException when not found', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(
        service.findById('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return property', async () => {
      const updated = { ...mockPropertyDoc, address: '456 New St' };
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });
      const result = await service.update('507f1f77bcf86cd799439011', {
        address: '456 New St',
      });
      expect(result).toBeDefined();
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { address: '456 New St' },
        { new: true },
      );
    });

    it('should throw NotFoundException when not found', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(
        service.update('507f1f77bcf86cd799439011', { address: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete property', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPropertyDoc),
      });
      await service.remove('507f1f77bcf86cd799439011');
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException when not found', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
