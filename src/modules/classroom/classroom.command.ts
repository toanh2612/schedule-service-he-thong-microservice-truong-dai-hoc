export class RegisterClassroomsCommand {
  constructor(public studentId: string, public classroomIds: string[]) {}
}
