export interface IGetClassPeriodListFilter {
	id: string | null | undefined;
	subjectId: string;
	addressId: string;
	classIndex: number;
	dateTime: string | Date | null | undefined;
	description: string;
	isDeleted: boolean;
}
