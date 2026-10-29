import { DomainError } from "../BaseError/DomainError.js";

export class InvalidResultQuestionError extends DomainError{
    constructor(inputNum : number,min:number,max:number){
        super(`Số đáp án đúng không hợp lệ:${inputNum}.Yêu cầu nhỏ nhất là ${min} , lớn nhất là ${max}`)
    }
}