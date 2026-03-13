import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceRequest } from './schemas/maintenance-request.schema';
import { PropertiesService } from '../properties/properties.service';
import { GeminiService } from '../common/gemini.service';
import { MaintenanceEventsService } from './events/maintenance-events.service';

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  const propertyId = '507f1f77bcf86cd799439011';
  const mockRequestDoc = {
    _id: '507f1f77bcf86cd799439013',
    propertyId: new Types.ObjectId(propertyId),
    description: 'Tap dripping',
    urgency: 'medium',
    category: 'plumbing',
    status: 'triaged',
    save: jest.fn(),
  };

  const mockMaintenanceModel = Object.assign(
    function (doc: unknown): { save: jest.Mock } & typeof mockRequestDoc {
      const instance = {
        ...mockRequestDoc,
        ...(doc as object),
        save: jest.fn().mockImplementation(function (this: unknown) {
          return Promise.resolve(this);
        }),
      };
      return instance as { save: jest.Mock } & typeof mockRequestDoc;
    },
    {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockRequestDoc]),
      }),
    },
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    mockMaintenanceModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockRequestDoc]),
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: getModelToken(MaintenanceRequest.name),
          useValue: mockMaintenanceModel,
        },
        {
          provide: PropertiesService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ _id: propertyId }),
          },
        },
        {
          provide: GeminiService,
          useValue: {
            generateText: jest
              .fn()
              .mockResolvedValue('{"urgency":"medium","category":"plumbing"}'),
          },
        },
        MaintenanceEventsService,
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and triage maintenance request', async () => {
      const dto = { description: 'Kitchen tap is dripping' };
      const result = await service.create(propertyId, dto);
      expect(result).toBeDefined();
      expect(result.description).toBe(dto.description);
    });
  });

  describe('findAllByProperty', () => {
    it('should return requests for property', async () => {
      const result = await service.findAllByProperty(propertyId);
      expect(result).toEqual([mockRequestDoc]);
    });
  });
});
