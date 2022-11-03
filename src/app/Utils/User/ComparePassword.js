import {compare} from "bcrypt";

export default async function ComparePassword(password, hash) {
	return await compare(password, hash);
}