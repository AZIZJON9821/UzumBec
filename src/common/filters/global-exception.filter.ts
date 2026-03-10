import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string = exception.message || 'Internal server error';

        // Prisma unique constraint xatosi (P2002)
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                const fields = (exception.meta as any)?.target;
                const fieldNames = Array.isArray(fields) ? fields.join(', ') : 'unknown';
                message = `Bu malumot allaqachon mavjud: ${fieldNames}`;
            } else if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                message = 'Yozuv topilmadi';
            } else {
                status = HttpStatus.BAD_REQUEST;
                message = `Database xatosi (${exception.code})`;
            }
        } else if (exception instanceof Prisma.PrismaClientValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Yuborilgan malumotlar tuzilishi notogri. Barcha maydonlarni toliq kiriting.';
        } else if (exception.response) {
            // HttpException
            status = exception.status;
            const resp = exception.response;
            message = Array.isArray(resp?.message)
                ? resp.message.join(', ')
                : resp?.message || exception.message;
        }

        this.logger.error(
            `[${request.method}] ${request.url} -> ${status}: ${message}`,
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
