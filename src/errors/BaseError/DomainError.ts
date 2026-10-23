export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    // Gán biến name = chính xác tên của class con
    // Ví dụ class ExamNotFoundError thì this.name = ExamNotFoundError
    this.name = this.constructor.name;
    // Hình thành 1 sợi dây liên kết chuỗi
    /* Error => DomainError => Lỗi cụ thể ( Ví dụ : ExamNotFoundError )
     */
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
