import { DomainError } from "../BaseError/DomainError.js";

export class EntityAlreadyExistsError extends DomainError {
  constructor(
    public readonly id: string,
    public readonly entityName?: string,
  ) {
    super(
      !entityName
        ? `ID ${id} đã tồn tại`
        : `ID ${id} của ${entityName} đã tồn tại`,
    );
  }
}
