import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms/:roomId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    async sendMessage(
        @Param('roomId') roomId: string,
        @Body() sendMessageDto: SendMessageDto,
        @Req() req,
    ) {
        return this.messagesService.sendMessage(roomId, sendMessageDto, req.user._id);
    }

    @Get()
    async getMessages(
        @Param('roomId') roomId: string,
        @Query('page') page: number,
        @Req() req,
    ) {
        return this.messagesService.getMessages(roomId, req.user._id, page);
    }
}
