import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async createSchool(data: any) {
    return this.prisma.school.create({ data });
  }

  async findSchoolById(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('École non trouvée');
    return school;
  }

  async findAllSchools() {
    return this.prisma.school.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        website: true,
      },
    });
  }

  async deleteSchool(id: string) {
    return this.prisma.school.delete({ where: { id } });
  }

  async createCourse(data: any) {
    return this.prisma.course.create({ data });
  }

  async findAllCourses() {
    return this.prisma.course.findMany({
      include: {
        school: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async findSchoolCourses(schoolId: string) {
    return this.prisma.course.findMany({
      where: {schoolId},
      include: {
        school: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async findCourseById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        school: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async deleteCourse(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }

  // --- MODULES & LEÇONS ---
  async addModuleToCourse(courseId: string, data: any) {
    return this.prisma.module.create({
      data: { ...data, courseId },
    });
  }

  async addLessonToModule(moduleId: string, data: any) {
    return this.prisma.lesson.create({
      data: { ...data, moduleId },
    });
  }

  async deleteModule(id: string) {
    return this.prisma.module.delete({ where: { id } });
  }

  async deleteLesson(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }

  async findModuleById(id: string) {
    return this.prisma.module.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            school: true,
          },
        },
      },
    });
  }

  async findLessonById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            course: {
              include: {
                school: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`La leçon avec l'ID ${id} n'existe pas.`);
    }

    return lesson;
  }
}
