import { Controller, Get, Patch, Body, Query, Req, UseGuards, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('search')
    async searchUsers(@Query('q') query: string, @Req() req) {
        return this.usersService.searchUsers(query, req.user._id);
    }

    @Get('me')
    async getMe(@Req() req) {
        return this.usersService.getMe(req.user._id);
    }

    @Get('me/media')
    async getMyMedia(@Query('type') type: string, @Req() req) {
        return this.usersService.getUserMedia(req.user._id, type);
    }

    @Patch('me')
    async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req) {
        return this.usersService.updateProfile(req.user._id, updateProfileDto);
    }

    @Patch('me/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
        return this.usersService.updateAvatar(req.user._id, file);
    }

    @Patch('me/settings')
    async updateSettings(@Body() updateSettingsDto: UpdateSettingsDto, @Req() req) {
        return this.usersService.updateSettings(req.user._id, updateSettingsDto);
    }

    @Patch(':id/block')
    async blockUser(@Param('id') id: string, @Req() req) {
        return this.usersService.blockUser(req.user._id, id);
    }

    @Patch(':id/unblock')
    async unblockUser(@Param('id') id: string, @Req() req) {
        return this.usersService.unblockUser(req.user._id, id);
    }

    @Patch(':id/report')
    async reportUser(@Param('id') id: string, @Req() req) {
        return this.usersService.reportUser(req.user._id, id);
    }
}
