import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './app.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

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
    module: {
        create: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
    },
    lesson: {
        create: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
    },
};

describe('CatalogService', () => {
    let service: CatalogService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CatalogService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<CatalogService>(CatalogService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Schools', () => {
        const mockSchool = {
            id: '1',
            name: 'Test School',
            description: 'A school for testing',
            logoUrl: null,
            website: null,
            ownerId: 'owner-1',
        };

        it('should create a school', async () => {
            const createData: Prisma.SchoolUncheckedCreateInput = { name: 'Test School', ownerId: 'owner-1' };
            mockPrismaService.school.create.mockResolvedValue(mockSchool);

            const result = await service.createSchool(createData);

            expect(prisma.school.create).toHaveBeenCalledWith({ data: createData });
            expect(result).toEqual(mockSchool);
        });

        it('should find a school by id', async () => {
            mockPrismaService.school.findUnique.mockResolvedValue(mockSchool);

            const result = await service.findSchoolById('1');

            expect(prisma.school.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
            expect(result).toEqual(mockSchool);
        });

        it('should throw NotFoundException if school not found', async () => {
            mockPrismaService.school.findUnique.mockResolvedValue(null);

            await expect(service.findSchoolById('999')).rejects.toThrow(
                new NotFoundException('École non trouvée'),
            );
        });

        it('should find all schools', async () => {
            const schools = [
                mockSchool,
                { ...mockSchool, id: '2', name: 'Other School' },
            ];
            mockPrismaService.school.findMany.mockResolvedValue(schools);

            const result = await service.findAllSchools();

            expect(prisma.school.findMany).toHaveBeenCalled();
            expect(result).toEqual(schools);
        });

        it('should delete a school', async () => {
            mockPrismaService.school.delete.mockResolvedValue(mockSchool);

            const result = await service.deleteSchool('1');

            expect(prisma.school.delete).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(result).toEqual(mockSchool);
        });
    });

    describe('Courses', () => {
        const mockCourse = {
            id: '1',
            title: 'Test Course',
            description: 'Test description',
            price: 10,
            duration: '2h',
            schoolId: '1',
        };

        it('should create a course', async () => {
            const createData: Prisma.CourseUncheckedCreateInput = { title: 'Test Course', schoolId: '1' };
            mockPrismaService.course.create.mockResolvedValue(mockCourse);

            const result = await service.createCourse(createData);

            expect(prisma.course.create).toHaveBeenCalledWith({ data: createData });
            expect(result).toEqual(mockCourse);
        });

        it('should find all courses', async () => {
            mockPrismaService.course.findMany.mockResolvedValue([mockCourse]);

            const result = await service.findAllCourses();

            expect(prisma.course.findMany).toHaveBeenCalled();
            expect(result).toEqual([mockCourse]);
        });

        it('should find school courses', async () => {
            mockPrismaService.course.findMany.mockResolvedValue([mockCourse]);

            const result = await service.findSchoolCourses('1');

            expect(prisma.course.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { schoolId: '1' } }),
            );
            expect(result).toEqual([mockCourse]);
        });

        it('should find a course by id', async () => {
            mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);

            const result = await service.findCourseById('1');

            expect(prisma.course.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: '1' } }),
            );
            expect(result).toEqual(mockCourse);
        });

        it('should delete a course', async () => {
            mockPrismaService.course.delete.mockResolvedValue(mockCourse);

            const result = await service.deleteCourse('1');

            expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(result).toEqual(mockCourse);
        });
        describe('Modules and Lessons', () => {
            const mockModule = {
                id: '1',
                title: 'Test Module',
                order: 1,
                courseId: '1',
            };

            const mockLesson = {
                id: '1',
                title: 'Test Lesson',
                content: 'Test content',
                videoUrl: null,
                moduleId: '1',
            };

            it('should add a module to a course', async () => {
                const createData: Omit<Prisma.ModuleUncheckedCreateInput, 'courseId'> = { title: 'Test Module', order: 1 };
                mockPrismaService.module.create.mockResolvedValue(mockModule);

                const result = await service.addModuleToCourse('1', createData);

                expect(prisma.module.create).toHaveBeenCalledWith({
                    data: { ...createData, courseId: '1' },
                });
                expect(result).toEqual(mockModule);
            });

            it('should delete a module', async () => {
                mockPrismaService.module.delete.mockResolvedValue(mockModule);

                const result = await service.deleteModule('1');

                expect(prisma.module.delete).toHaveBeenCalledWith({
                    where: { id: '1' },
                });
                expect(result).toEqual(mockModule);
            });

            it('should find a module by id', async () => {
                mockPrismaService.module.findUnique.mockResolvedValue(mockModule);

                const result = await service.findModuleById('1');

                expect(prisma.module.findUnique).toHaveBeenCalledWith(
                    expect.objectContaining({ where: { id: '1' } }),
                );
                expect(result).toEqual(mockModule);
            });

            it('should add a lesson to a module', async () => {
                const createData: Omit<Prisma.LessonUncheckedCreateInput, 'moduleId'> = { title: 'Test Lesson' };
                mockPrismaService.lesson.create.mockResolvedValue(mockLesson);

                const result = await service.addLessonToModule('1', createData);

                expect(prisma.lesson.create).toHaveBeenCalledWith({
                    data: { ...createData, moduleId: '1' },
                });
                expect(result).toEqual(mockLesson);
            });

            it('should delete a lesson', async () => {
                mockPrismaService.lesson.delete.mockResolvedValue(mockLesson);

                const result = await service.deleteLesson('1');

                expect(prisma.lesson.delete).toHaveBeenCalledWith({
                    where: { id: '1' },
                });
                expect(result).toEqual(mockLesson);
            });

            it('should find a lesson by id', async () => {
                mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);

                const result = await service.findLessonById('1');

                expect(prisma.lesson.findUnique).toHaveBeenCalledWith(
                    expect.objectContaining({ where: { id: '1' } }),
                );
                expect(result).toEqual(mockLesson);
            });

            it('should throw NotFoundException if lesson not found', async () => {
                mockPrismaService.lesson.findUnique.mockResolvedValue(null);

                await expect(service.findLessonById('999')).rejects.toThrow(
                    NotFoundException,
                );
            });
        });
    });
});
