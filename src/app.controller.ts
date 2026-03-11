import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Headers,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
} from "@nestjs/swagger";
import { CatalogService } from "./app.service";
import { AuthGuard } from "./app.guard";

export class AuthenticatedUser {
  sub: string;
  email: string;
  role?: string;
}

import { Request } from "express";
export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

export class CreateSchoolData {
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  logoUrl?: string;
  @ApiProperty({ required: false })
  website?: string;
}

export class CreateCourseData {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  price?: number;
  @ApiProperty({ required: false })
  duration?: string;
  @ApiProperty({ required: false })
  thumbnail?: string;
  @ApiProperty()
  schoolId: string;
}

export class CreateModuleData {
  @ApiProperty()
  title: string;
  @ApiProperty()
  order: number;
  @ApiProperty()
  courseId: string;
}

export class CreateLessonData {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  content?: string;
  @ApiProperty({ required: false })
  videoUrl?: string;
  @ApiProperty()
  moduleId: string;
}

@ApiTags("catalog")
@ApiBearerAuth()
@Controller("catalog")
@UseGuards(AuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post("schools")
  @ApiOperation({ summary: "Create a new school" })
  async createSchool(
    @Body() data: CreateSchoolData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    return this.catalogService.createSchool({ ...data, ownerId });
  }

  @Delete("schools/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a school" })
  async deleteSchool(@Param("id") id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const school = await this.catalogService.findSchoolById(id);

    if (!school) throw new NotFoundException("École non trouvée");
    if (school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.deleteSchool(id);
  }

  @Get("schools/:id")
  @ApiOperation({ summary: "Get school details" })
  async getSchool(@Param("id") id: string) {
    return this.catalogService.findSchoolById(id);
  }

  @Get("schools")
  @ApiOperation({ summary: "Get all schools" })
  async getAllSchool() {
    return this.catalogService.findAllSchools();
  }

  @Post("schools/:schoolId/courses")
  @ApiOperation({ summary: "Create a course for a school" })
  async createCourse(
    @Param("schoolId") schoolId: string,
    @Headers("authorization") authHeader: string,
    @Body() data: CreateCourseData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    const school = await this.catalogService.findSchoolById(schoolId);

    if (!school || school.ownerId !== ownerId)
      throw new ForbiddenException(
        "Vous n'êtes pas le propriétaire de cette école",
      );

    return this.catalogService.createCourse({ ...data, schoolId }, authHeader);
  }

  @Delete("courses/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a course" })
  async deleteCourse(@Param("id") id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const course = await this.catalogService.findCourseById(id);

    if (!course) throw new NotFoundException("Cours non trouvé");
    if (course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.deleteCourse(id);
  }

  @Get("courses")
  @ApiOperation({ summary: "Get all courses" })
  async getAllCourses() {
    return this.catalogService.findAllCourses();
  }

  @Get("schools/:schoolId/courses")
  @ApiOperation({ summary: "Get all courses of a school" })
  async getSchoolCourse(@Param("schoolId") schoolId: string) {
    return this.catalogService.findSchoolCourses(schoolId);
  }

  @Get("courses/:id")
  @ApiOperation({ summary: "Get course details" })
  async getCourseDetails(@Param("id") id: string) {
    return this.catalogService.findCourseById(id);
  }

  @Post("courses/:courseId/modules")
  @ApiOperation({ summary: "Add a module to a course" })
  async addModule(
    @Param("courseId") courseId: string,
    @Body() data: CreateModuleData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    const course = await this.catalogService.findCourseById(courseId);

    if (!course || course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.addModuleToCourse(courseId, data);
  }

  @Delete("modules/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a module" })
  async deleteModule(@Param("id") id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const module = await this.catalogService.findModuleById(id);

    if (!module || module.course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.deleteModule(id);
  }

  @Post("modules/:moduleId/lessons")
  @ApiOperation({ summary: "Add a lesson to a module" })
  async addLesson(
    @Param("moduleId") moduleId: string,
    @Body() data: CreateLessonData,
    @Req() req: RequestWithUser,
  ) {
    const ownerId = req.user.sub;
    const module = await this.catalogService.findModuleById(moduleId);

    if (!module || module.course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.addLessonToModule(moduleId, data);
  }

  @Delete("lessons/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a lesson" })
  async deleteLesson(@Param("id") id: string, @Req() req: RequestWithUser) {
    const ownerId = req.user.sub;
    const lesson = await this.catalogService.findLessonById(id);

    if (!lesson || lesson.module.course.school.ownerId !== ownerId)
      throw new ForbiddenException("Permission refusée");

    return this.catalogService.deleteLesson(id);
  }
}
