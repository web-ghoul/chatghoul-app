import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get('starred')
    async getStarredMessages(
        @Query('page') page: number,
        @Req() req,
    ) {
        return this.messagesService.getStarredMessages(req.user._id, page);
    }

    @Post(':id/star')
    async toggleStar(
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.messagesService.toggleStar(id, req.user._id);
    }
}
