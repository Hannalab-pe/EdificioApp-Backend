import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(private health: HealthCheckService) { }

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Health check del API Gateway' })
    check(): Promise<HealthCheckResult> {
        return this.health.check([
            () => Promise.resolve({ gateway: { status: 'up' } }),
        ]);
    }
}