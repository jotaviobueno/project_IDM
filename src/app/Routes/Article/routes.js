import {Router} from "express";

export const articleRoutes = Router();

// Controllers
import ArticleController from "../../http/Controller/Article/Article.js";

articleRoutes.post("/create/article", ArticleController.storageArticle );
articleRoutes.post("/add-comment", ArticleController.addComment );