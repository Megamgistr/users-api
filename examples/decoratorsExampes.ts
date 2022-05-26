function Component(id: number) {
	console.log('init');
	return (target: Function) => {
		target.prototype.id = id;
	};
}

function Method(target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
	console.log(propertyKey);
	const oldValue = propertyDescriptor.value;
	propertyDescriptor.value = function (...args: any[]) {
		return args[0] * 10;
	};
}

function Prop(target: Object, propertyKey: string) {
	let value: number;
	const getter = () => value;
	const setter = (newValue: number) => {
		value = newValue;
	};

	Object.defineProperty(target, propertyKey, {
		get: getter,
		set: setter,
	});
}

function Param(target: Object, propertyKey: string, index: number) {
	console.log('kek');
}

@Component(1)
export class User {
	@Prop id: number;

	@Method
	updateId(@Param newId: number) {
		this.id = newId;
		return this.id;
	}
}

console.log(new User().id);
console.log(new User().updateId(5));
