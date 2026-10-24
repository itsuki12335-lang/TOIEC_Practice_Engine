import { DomainError } from "../BaseError/DomainError.js";
export interface DataCorruptedErrorContext {
  readonly filePath?: string;
  readonly reason?: string;
}
export class DataCorruptedError extends DomainError {
  constructor(public readonly context?: DataCorruptedErrorContext) {
    const file = context?.filePath ? `${context.filePath}` : "";
    const reason = context?.reason ? `${context.reason}` : "";
    super(
      !context
        ? `Dữ liệu lưu trữ trong hệ thống bị hỏng hoặc không thể đọc được.`
        : `Dữ liệu ${file} bị hỏng hoặc không đúng định dạng chuẩn.${reason}`,
    );
  }
}
