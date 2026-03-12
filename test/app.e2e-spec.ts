import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { CatalogModule } from "./../src/app.module";

describe("CatalogController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CatalogModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/catalog/schools (GET) - unauthenticated", () => {
    return request(app.getHttpServer())
      .get("/catalog/schools")
      .expect(401)
      .expect((res: request.Response) => {
        const body = res.body as { message: string };
        expect(body.message).toEqual("Token manquant");
      });
  });
});
