import { compare, hash } from 'bcryptjs';

export class User {
	private _password: string;

	constructor(private readonly _email: string, private readonly _name: string, passHash?: string) {
		if (passHash) {
			this._password = passHash;
		}
	}
	get email() {
		return this._email;
	}

	get name() {
		return this._name;
	}

	get password() {
		return this._password;
	}

	public async setPassword(pass: string, salt: number) {
		this._password = await hash(pass, salt);
	}

	public async isPasswordValid(pass: string) {
		return await compare(pass, this.password);
	}
}
