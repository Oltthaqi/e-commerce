import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsException,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserRoles } from 'src/roles/enum/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const decoded = this.jwtService.verify(token);
      client.data.userId = decoded.sub;
      console.log(
        `Client connected: ${client.id}, User ID: ${client.data.userId}`,
      );
    } catch (error) {
      console.error('Unauthorized WebSocket connection:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received Payload:', createChatDto);

    const senderId = client.data.userId;

    const chat = await this.chatService.create(createChatDto, senderId);

    const fullSender = await this.userRepo.findOne({
      where: { id: senderId },
      select: ['id', 'username'],
    });

    const message = {
      ...chat,
      sender: {
        id: fullSender.id,
        username: fullSender.username,
      },
    };

    this.server.to(`room-${chat.roomId}`).emit('newMessage', message);

    return await message;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `room-${roomId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('findChat')
  async findAll(@MessageBody() roomId: any) {
    console.log('Received roomId:', roomId);

    let numericRoomId = Number(roomId);
    if (numericRoomId === 0) {
      numericRoomId = 1;
    }
    if (isNaN(numericRoomId)) {
      throw new WsException('Invalid roomId');
    }

    return this.chatService.findAll(numericRoomId);
  }

  @SubscribeMessage('getAllOpenTickets')
  async getAllOpenTickets(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;
    const decoded = await this.jwtService.verify(token);

    if (decoded.roles[0] === UserRoles.ADMIN) {
      try {
        const tickets = await this.chatService.getAllOpenTickets();
        console.log('Tickets:', tickets);

        return tickets;
      } catch (error) {
        throw new WsException('Failed to fetch open tickets' + error.message);
      }
    }
    throw new WsException('Unauthorized');
  }

  @SubscribeMessage('getAllOpenTicketsForAdminAndUser')
  async getAllOpenTicketsForAdmin(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;
    const decoded = await this.jwtService.verify(token);
    console.log('Decoded:', decoded);

    if (decoded.roles[0] === UserRoles.ADMIN) {
      try {
        console.log('hiniiii', decoded.sub);

        const tickets = await this.chatService.getAllOpenTicketsForAdmin(
          decoded.sub,
        );
        console.log('Tickets:', tickets);

        return tickets;
      } catch (error) {
        throw new WsException('Failed to fetch open tickets' + error.message);
      }
    } else {
      try {
        console.log('hiniiii', decoded.sub);

        const tickets = await this.chatService.getAllOpenTicketsForUser(
          decoded.sub,
        );
        console.log('Tickets:', tickets);

        return tickets;
      } catch (error) {
        throw new WsException('Failed to fetch open tickets' + error.message);
      }
    }
  }

  @SubscribeMessage('assignAdminToTicket')
  async assignAdminToTicket(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.auth.token;
    const decoded = this.jwtService.verify(token);

    // Only admins can assign themselves to a ticket
    if (decoded.roles[0] === UserRoles.ADMIN) {
      const adminId = client.data.userId;

      try {
        const result = await this.chatService.joinChatAsAdmin(adminId, roomId);
        this.server
          .to(`room-${roomId}`)
          .emit('adminAssigned', { adminId, roomId });
        return result;
      } catch (error) {
        throw new WsException(error.message);
      }
    }
    throw new WsException('Unauthorized');
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.chatService.getClientName(client.data.userId);

    client.broadcast.emit('typing', { name, isTyping });
  }
}
