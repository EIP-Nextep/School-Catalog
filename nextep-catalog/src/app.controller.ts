import { Controller, Post, Get, Body, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CatalogService } from './app.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // --- ROUTES ÉCOLE ---
  @Post('schools')
  async createSchool(@Body() data: any) {
    return this.catalogService.createSchool(data);
  }
  
  @Delete('schools/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchool(@Param('id') id: string) {
    return this.catalogService.deleteSchool(id);
  }

  @Get('schools/:id')
  async getSchool(@Param('id') id: string) {
    return this.catalogService.findSchoolById(id);
  }

  // --- ROUTES COURS ---
  @Post('courses')
  async createCourse(@Body() data: any) {
    return this.catalogService.createCourse(data);
  }

  @Delete('courses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCourse(@Param('id') id: string) {
    return this.catalogService.deleteCourse(id);
  }

  @Get('courses')
  async getAllCourses() {
    return this.catalogService.findAllCourses();
  }

  @Get('courses/:id')
  async getCourseDetails(@Param('id') id: string) {
    return this.catalogService.findCourseById(id);
  }

  // --- ROUTES MODULES & LEÇONS ---
  @Post('courses/:courseId/modules')
  async addModule(@Param('courseId') courseId: string, @Body() data: any) {
    return this.catalogService.addModuleToCourse(courseId, data);
  }

  @Delete('modules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteModule(@Param('id') id: string) {
    return this.catalogService.deleteModule(id);
  }

  @Post('modules/:moduleId/lessons')
  async addLesson(@Param('moduleId') moduleId: string, @Body() data: any) {
    return this.catalogService.addLessonToModule(moduleId, data);
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLesson(@Param('id') id: string) {
    return this.catalogService.deleteLesson(id);
  }
}