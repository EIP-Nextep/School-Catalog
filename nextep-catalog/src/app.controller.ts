import { 
  Controller, Post, Get, Body, Param, Delete, 
  HttpCode, HttpStatus, Req, UseGuards, 
  ForbiddenException, NotFoundException
} from '@nestjs/common';
import { CatalogService } from './app.service';
import { AuthGuard } from './app.guard';

@Controller('catalog')
@UseGuards(AuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('schools')
  async createSchool(@Body() data: any, @Req() req: any) {
    const ownerId = req.user.sub;
    return this.catalogService.createSchool({ ...data, ownerId });
  }
  
  @Delete('schools/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchool(@Param('id') id: string, @Req() req: any) {
    const ownerId = req.user.sub;
    const school = await this.catalogService.findSchoolById(id);
    
    if (!school)
      throw new NotFoundException("École non trouvée");
    if (school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.deleteSchool(id);
  }

  @Get('schools/:id')
  async getSchool(@Param('id') id: string) {
    return this.catalogService.findSchoolById(id);
  }

  @Post('courses')
  async createCourse(@Body() data: any, @Req() req: any) {
    const ownerId = req.user.sub;
    const school = await this.catalogService.findSchoolById(data.schoolId);
    if (!school || school.ownerId !== ownerId)
      throw new ForbiddenException("Vous n'êtes pas le propriétaire de cette école");

    return this.catalogService.createCourse(data);
  }

  @Delete('courses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCourse(@Param('id') id: string, @Req() req: any) {
    const ownerId = req.user.sub;
    const course = await this.catalogService.findCourseById(id);
    
    if (!course)
      throw new NotFoundException("Cours non trouvé");
    if (course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

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

  @Post('courses/:courseId/modules')
  async addModule(@Param('courseId') courseId: string, @Body() data: any, @Req() req: any) {
    const ownerId = req.user.sub;
    const course = await this.catalogService.findCourseById(courseId);
    
    if (!course || course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.addModuleToCourse(courseId, data);
  }

  @Delete('modules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteModule(@Param('id') id: string, @Req() req: any) {
    const ownerId = req.user.sub;
    const module = await this.catalogService.findModuleById(id); 
    
    if (!module || module.course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.deleteModule(id);
  }

  @Post('modules/:moduleId/lessons')
  async addLesson(@Param('moduleId') moduleId: string, @Body() data: any, @Req() req: any) {
    const ownerId = req.user.sub;
    const module = await this.catalogService.findModuleById(moduleId);

    if (!module || module.course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.addLessonToModule(moduleId, data);
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLesson(@Param('id') id: string, @Req() req: any) {
    const ownerId = req.user.sub;
    const lesson = await this.catalogService.findLessonById(id);

    if (!lesson || lesson.module.course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.deleteLesson(id);
  }
}
