import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestCustomException extends BadRequestException {
    constructor(id?: string) {
        super(`Invalid ID format: ${id}`);
    }
}