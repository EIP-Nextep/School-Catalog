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

  async deleteSchool(id: string) {
    return this.prisma.school.delete({ where: { id } });
  }

  async createCourse(data: any) {
    return this.prisma.course.create({ data });
  }

  async findAllCourses() {
    return this.prisma.course.findMany({ include: { modules: true } });
  }

  async findCourseById(id: string) {
    return this.prisma.course.findUnique({ 
      where: { id }, 
      include: { modules: { include: { lessons: true } } } 
    });
  }

  async deleteCourse(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }

  // --- MODULES & LEÇONS ---
  async addModuleToCourse(courseId: string, data: any) {
    return this.prisma.module.create({
      data: { ...data, courseId }
    });
  }

  async addLessonToModule(moduleId: string, data: any) {
    return this.prisma.lesson.create({
      data: { ...data, moduleId }
    });
  }

  async deleteModule(id: string) {
    return this.prisma.module.delete({ where: { id } });
  }

  async deleteLesson(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }
}