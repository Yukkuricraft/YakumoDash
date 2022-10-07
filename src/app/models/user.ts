export interface IUser {
	sub: string;
	email: string;
}

export class User implements IUser {
	sub = "";
	email = "";
}
