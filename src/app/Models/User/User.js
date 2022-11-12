import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({

	full_name: { type: String, required: true, },
	username: { type: String, required: true },
	email: { type: String,required: true },
	email_verified: { type: Boolean, required: true },
	password: { type: String, required: true },
	avatar_url: { type: String },
	genre: { type: String, required: true },
	birth_date: { type: Date, required: true },
	resident_country: { type: String, required: true },
	reports: { type: Array, required: true },
	friend_request_sent: [{
		id: String,
		user_id: String
	}],
	request_received: [{
		id: String,
		user_id: String
	}],
	friends: { type: Array, required: true },
	article_owner: { type: Array, required: true },
	permissions: { type: Array, required: true },
	created_at: { type: Date, default: Date.now, required: true },
	updated_at: { type: Date, required: true },
	update_logs: 
	[
		{log: { type: String, required: true }, 
			old: String, 
			new: String,
			id: String,
			updated_at: { type: Date, required: true } }
	],
	deleted_at: { type: Date, default: Date.now }
});

export default mongoose.model("Users", User);