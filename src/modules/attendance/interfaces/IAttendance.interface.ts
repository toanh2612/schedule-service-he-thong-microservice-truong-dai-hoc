export interface IAttendance {
	id: string;
	studentId: string;
	description: string;
	isJoined: boolean;
	isDeleted: boolean;
	createdDate: Date;
	updatedDate: Date;
}
