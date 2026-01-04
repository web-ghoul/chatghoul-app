import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedsService } from './seeds.service';

@Controller('seeds')
export class SeedsController {
    constructor(private readonly seedsService: SeedsService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async runSeeds() {
        return this.seedsService.run();
    }

    @Post('reset')
    @HttpCode(HttpStatus.OK)
    async resetDatabase() {
        return this.seedsService.reset();
    }
}
