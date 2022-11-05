import ArticleModel from "../../../Models/Article/Article.js";

class UpdateRepository {

	async updateTitle(article_id, newTitle) {
		const update = await ArticleModel.updateOne({_id: article_id, deleted_at: null}, 
			{title: newTitle, updated_at: new Date()});

		if (update.modifiedCount === 1 )
			return true;

		return false;
	}
}

export default new UpdateRepository;