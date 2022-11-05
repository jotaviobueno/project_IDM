import {Router} from "express";

export const articleRoutes = Router();

// Controllers
import ArticleController from "../../http/Controller/Article/Article.js";
import UpdateController from "../../http/Controller/Article/Update.js";

articleRoutes.post("/create/article", ArticleController.storageArticle );
articleRoutes.post("/add-comment", ArticleController.addComment );

articleRoutes.get("/articles", ArticleController.listAllArticles );
articleRoutes.get("/article", ArticleController.listAnArticle );

articleRoutes.patch("/article/update/title", UpdateController.updateTitle );