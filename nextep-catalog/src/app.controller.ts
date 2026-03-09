import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CatalogService } from './app.service';
import { AuthGuard } from './app.guard';

export interface AuthenticatedUser {
  sub: string;
  email: string;
  role?: string;
}

import { Request } from 'express';
export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

export interface CreateSchoolData {
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  thumbnail?: string;
  schoolId: string;
}

export interface CreateModuleData {
  title: string;
  order: number;
  courseId: string;
}

export interface CreateLessonData {
  title: string;
  content?: string;
  videoUrl?: string;
  moduleId: string;
}

@Controller('catalog')
@UseGuards(AuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('schools')
  async createSchool(
    @Body() data: CreateSchoolData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    return this.catalogService.createSchool({ ...data, ownerId });
  }

  @Delete('schools/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchool(@Param('id') id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const school = await this.catalogService.findSchoolById(id);

    if (!school) throw new NotFoundException('École non trouvée');
    if (school.ownerId !== ownerId)
      throw new ForbiddenException('Permission refusée');

    return this.catalogService.deleteSchool(id);
  }

  @Get('schools/:id')
  async getSchool(@Param('id') id: string) {
    return this.catalogService.findSchoolById(id);
  }

  @Get('schools')
  async getAllSchool() {
    return this.catalogService.findAllSchools();
  }

  @Post('schools/:schoolId/courses')
  async createCourse(
    @Param('schoolId') schoolId: string,
    @Body() data: CreateCourseData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    const school = await this.catalogService.findSchoolById(schoolId);

    if (!school || school.ownerId !== ownerId)
      throw new ForbiddenException(
        "Vous n'êtes pas le propriétaire de cette école",
      );

    return this.catalogService.createCourse({ ...data, schoolId });
  }

  @Delete('courses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCourse(@Param('id') id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const course = await this.catalogService.findCourseById(id);

    if (!course) throw new NotFoundException('Cours non trouvé');
    if (course.school.ownerId !== ownerId)
      throw new ForbiddenException('Permission refusée');

    return this.catalogService.deleteCourse(id);
  }

  @Get('courses')
  async getAllCourses() {
    return this.catalogService.findAllCourses();
  }
  
  @Get('schools/:schoolId/courses')
  async getSchoolCourse(@Param('schoolId') schoolId: string) {
    return this.catalogService.findCourseById(schoolId);
  }

  @Get('courses/:id')
  async getCourseDetails(@Param('id') id: string) {
    return this.catalogService.findCourseById(id);
  }

  @Post('courses/:courseId/modules')
  async addModule(
    @Param('courseId') courseId: string,
    @Body() data: CreateModuleData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    const course = await this.catalogService.findCourseById(courseId);

    if (!course || course.school.ownerId !== ownerId)
      throw new ForbiddenException('Permission refusée');

    return this.catalogService.addModuleToCourse(courseId, data);
  }

  @Delete('modules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteModule(@Param('id') id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const module = await this.catalogService.findModuleById(id);

    if (!module || module.course.school.ownerId !== ownerId)
      throw new ForbiddenException('Permission refusée');

    return this.catalogService.deleteModule(id);
  }

  @Post('modules/:moduleId/lessons')
  async addLesson(
    @Param('moduleId') moduleId: string,
    @Body() data: CreateLessonData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    const module = await this.catalogService.findModuleById(moduleId);

    if (!module || module.course.school.ownerId !== ownerId)
      throw new ForbiddenException('Permission refusée');

    return this.catalogService.addLessonToModule(moduleId, data);
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLesson(@Param('id') id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const lesson = await this.catalogService.findLessonById(id);

    if (!lesson || lesson.module.course.school.ownerId !== ownerId)
      throw new ForbiddenException('Permission refusée');

    return this.catalogService.deleteLesson(id);
  }
}
