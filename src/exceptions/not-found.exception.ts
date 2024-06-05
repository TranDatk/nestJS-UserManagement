import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor(model?: string) {
        super(`Id not found in ${model}`, HttpStatus.NOT_FOUND);
    }
}