import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Token = new Schema({

	user_id: { type: String, required: true, },
	email: { type: String, required: true, },
	token: { type: String, required: true, },
	created_at: { type: Date, required: true, },
	expires_at: { type: Date, required: true, },
	status: { type: String, required: true, },
	updated_at: { type: Date, required: true, },
	sent_to_email: { type: Boolean, required: true, },
	deleted_at: { type: Date },
        
});

export default mongoose.model("Token", Token);