import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { LeasesService } from './leases.service';
import { Lease } from './schemas/lease.schema';
import { PropertiesService } from '../properties/properties.service';

describe('LeasesService', () => {
  let service: LeasesService;

  const propertyId = '507f1f77bcf86cd799439011';
  const mockExtractedTerms = {
    monthlyRent: 1200,
    deposit: 2400,
    startDate: '2025-01-01',
    endDate: '2026-01-01',
  };
  const mockLeaseDoc = {
    _id: '507f1f77bcf86cd799439012',
    propertyId: new Types.ObjectId(propertyId),
    extractedTerms: mockExtractedTerms,
    status: 'draft',
    save: jest.fn(),
  };

  const createMockInstance = (
    doc: unknown,
  ): { save: jest.Mock } & typeof mockLeaseDoc => ({
    ...mockLeaseDoc,
    ...(doc as object),
    save: jest.fn().mockResolvedValue({ ...mockLeaseDoc, ...doc }),
  });

  const mockLeaseModel = Object.assign(
    function (doc: unknown): ReturnType<typeof createMockInstance> {
      return createMockInstance(doc);
    },
    {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLeaseDoc]),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLeaseDoc),
      }),
    },
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    mockLeaseModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockLeaseDoc]),
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeasesService,
        {
          provide: getModelToken(Lease.name),
          useValue: mockLeaseModel,
        },
        {
          provide: PropertiesService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ _id: propertyId }),
          },
        },
      ],
    }).compile();

    service = module.get<LeasesService>(LeasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create lease with provided extracted terms', async () => {
      const dto = {
        extractedTerms: mockExtractedTerms,
        status: 'draft' as const,
      };
      const created = await service.create(propertyId, dto);
      expect(created).toBeDefined();
      expect((created as { extractedTerms: unknown }).extractedTerms).toEqual(
        mockExtractedTerms,
      );
    });
  });

  describe('findAllByProperty', () => {
    it('should return leases for property', async () => {
      const result = await service.findAllByProperty(propertyId);
      expect(result).toEqual([mockLeaseDoc]);
    });
  });
});
