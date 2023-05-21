export interface IClassroom {
	id: string;
	name: string;
	description: string;
	isDeleted: boolean;
	createdDate: Date;
	updatedDate: Date;
	teacher?: any;
}
