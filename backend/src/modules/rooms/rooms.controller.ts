import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ChangeSuperAdminDto } from './dto/change-super-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto, @Req() req) {
        return this.roomsService.createRoom(createRoomDto, req.user._id);
    }

    @Get()
    async getUserRooms(@Req() req) {
        return this.roomsService.getUserRooms(req.user._id);
    }

    @Get(':id')
    async getRoom(@Param('id') id: string, @Req() req) {
        return this.roomsService.getRoomById(id, req.user._id);
    }

    @Patch(':id/super-admin')
    async changeSuperAdmin(
        @Param('id') id: string,
        @Body() changeSuperAdminDto: ChangeSuperAdminDto,
        @Req() req,
    ) {
        return this.roomsService.changeSuperAdmin(id, changeSuperAdminDto.newSuperAdminId, req.user._id);
    }

    @Get(':id/media')
    async getRoomMedia(
        @Param('id') id: string,
        @Query('type') type: string,
        @Req() req,
    ) {
        return this.roomsService.getRoomMedia(id, req.user._id, type);
    }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        if (!file) throw new BadRequestException('File is required');
        return this.roomsService.uploadFile(id, req.user._id, file);
    }
}
