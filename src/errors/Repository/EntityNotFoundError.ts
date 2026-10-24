import { DomainError } from "../BaseError/DomainError.js";
// Lỗi không tìm thấy ID của thực thể tương ứng
export class EntityNotFoundError extends DomainError {
  constructor(
    public readonly id: string,
    public readonly entityName?: string,
  ) {
    super(
      !entityName
        ? `Không tồn tại ID :${id}`
        : `Không tìm thấy ${entityName} với ID :${id}`,
    );
  }
}
