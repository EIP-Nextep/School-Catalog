import { Test, TestingModule } from "@nestjs/testing";
import { CatalogService } from "./app.service";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";

const mockPrismaService = {
  school: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  course: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  module: { create: jest.fn(), delete: jest.fn(), findUnique: jest.fn() },
  lesson: { create: jest.fn(), delete: jest.fn(), findUnique: jest.fn() },
};

const mockHttpService = {
  post: jest.fn().mockReturnValue(of({ data: {} })),
};

describe("CatalogService", () => {
  let service: CatalogService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Schools", () => {
    const mockSchool = { id: "1", name: "Test School", ownerId: "owner-1" };

    it("should create a school", async () => {
      const createData: Prisma.SchoolUncheckedCreateInput = {
        name: "Test School",
        ownerId: "owner-1",
      };
      mockPrismaService.school.create.mockResolvedValue(mockSchool);
      const result = await service.createSchool(createData);
      expect(result).toEqual(mockSchool);
    });

    it("should find a school by id", async () => {
      mockPrismaService.school.findUnique.mockResolvedValue(mockSchool);
      const result = await service.findSchoolById("1");
      expect(result).toEqual(mockSchool);
    });
  });

  describe("Courses", () => {
    const mockCourse = {
      id: "1",
      title: "Test Course",
      schoolId: "1",
      domainIds: [],
    };

    it("should create a course", async () => {
      const createData: Prisma.CourseUncheckedCreateInput = {
        title: "Test Course",
        schoolId: "1",
      };
      const authHeader = "fake-token";
      mockPrismaService.course.create.mockResolvedValue(mockCourse);

      const result = await service.createCourse(createData, authHeader);

      expect(prisma.course.create).toHaveBeenCalledWith({ data: createData });
      expect(mockHttpService.post).toHaveBeenCalled();
      expect(result).toEqual(mockCourse);
    });

    it("should find all courses", async () => {
      mockPrismaService.course.findMany.mockResolvedValue([mockCourse]);
      const result = await service.findAllCourses();
      expect(result).toEqual([mockCourse]);
    });
  });

  describe("Modules and Lessons", () => {
    const mockModule = { id: "1", title: "Test Module", courseId: "1" };

    it("should add a module to a course", async () => {
      const createData = { title: "Test Module", order: 1 };
      mockPrismaService.module.create.mockResolvedValue(mockModule);

      const result = await service.addModuleToCourse("1", createData);

      expect(prisma.module.create).toHaveBeenCalledWith({
        data: { ...createData, courseId: "1" },
      });
      expect(result).toEqual(mockModule);
    });

    it("should throw NotFoundException if lesson not found", async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);
      await expect(service.findLessonById("999")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
