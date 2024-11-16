import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

interface IClass {
    new(...args: any[]): {}
}
export function ResponseSerializer(dto: IClass) {
    return UseInterceptors(new SerializeResponse(dto))
}
class SerializeResponse implements NestInterceptor {
    constructor(private dto: IClass) { }
    intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: unknown) => {
                const serializeResp = plainToClass(this.dto, data, { excludeExtraneousValues: true, enableImplicitConversion: true })
                return serializeResp
            })
        )
    }
}