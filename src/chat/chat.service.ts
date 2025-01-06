import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { ChatStatus } from './enums/ChatStatus.enum';
@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private chatRepo: Repository<Chat>) {}

  async create(
    createChatDto: CreateChatDto,
    senderId: number,
    receiverId?: number,
  ) {
    const lastChat = await this.chatRepo.findOne({
      where: [
        {
          sender: { id: senderId },
          status: ChatStatus.OPEN,
          roomId: createChatDto.roomId,
        },
        {
          receiver: { id: senderId },
          status: ChatStatus.OPEN,
          roomId: createChatDto.roomId,
        },
      ],
      order: { id: 'DESC' },
    });
    let roomId: number;
    console.log(lastChat);

    if (lastChat) {
      if (lastChat.receiver === null) {
        receiverId = lastChat.receiver.id
          ? lastChat.receiver.id
          : lastChat.sender.id;
      }
      receiverId = lastChat.sender.id;
      roomId = lastChat.roomId;
    } else {
      const maxRoomChat = await this.chatRepo.findOne({
        where: {},
        order: { roomId: 'DESC' },
      });
      roomId = maxRoomChat ? maxRoomChat.roomId + 1 : 1;
    }

    const chat = this.chatRepo.create({
      message: createChatDto.message,
      roomId,
      sender: { id: senderId },
      receiver: receiverId ? { id: receiverId } : null,
      status: ChatStatus.OPEN,
    });

    return this.chatRepo.save(chat);
  }

  async getAllOpenTickets() {
    const distinctRooms = await this.chatRepo.query(`
      WITH DistinctRooms AS (
        SELECT roomId, MIN(id) AS minId
        FROM e_commerce.chats
        WHERE status = 'OPEN' AND receiverId IS NULL
        GROUP BY roomId
      )
      SELECT c.roomId, c.created_At, c.senderId, c.status
      FROM e_commerce.chats c
      INNER JOIN DistinctRooms dr ON c.id = dr.minId
      ORDER BY c.roomId ASC;
    `);

    return distinctRooms;
  }

  async getAllOpenTicketsForAdmin(adminId: number) {
    const distinctRooms = await this.chatRepo.query(`
      WITH DistinctRooms AS (
        SELECT roomId, MIN(id) AS minId
        FROM e_commerce.chats
        WHERE status = 'OPEN' AND receiverId = ${adminId}
        GROUP BY roomId
      )
      SELECT c.roomId, c.created_At, c.senderId, c.status
      FROM e_commerce.chats c
      INNER JOIN DistinctRooms dr ON c.id = dr.minId
      ORDER BY c.roomId ASC;
    `);
    console.log('Tickets:', distinctRooms);

    return distinctRooms;
  }

  async getAllOpenTicketsForUser(userId: number) {
    const distinctRooms = await this.chatRepo.query(`
      WITH DistinctRooms AS (
        SELECT roomId, MIN(id) AS minId
        FROM e_commerce.chats
        WHERE status = 'OPEN' AND senderId = ${userId} OR receiverId = ${userId}
        GROUP BY roomId
      )
      SELECT c.roomId, c.created_At, c.senderId, c.status
      FROM e_commerce.chats c
      INNER JOIN DistinctRooms dr ON c.id = dr.minId
      ORDER BY c.roomId ASC;
    `);

    return distinctRooms;
  }

  async joinChatAsAdmin(adminId: number, roomId: number) {
    const openChat = await this.chatRepo.findOne({
      where: { roomId, status: ChatStatus.OPEN, receiver: null },
    });

    if (!openChat) {
      throw new Error('Room not found or already assigned.');
    }

    await this.chatRepo.update({ roomId }, { receiver: { id: adminId } });
    return { message: 'Admin joined the chat successfully.' };
  }

  async findAll(roomId: number) {
    if (!roomId || isNaN(roomId)) {
      throw new Error(`Invalid roomId: ${roomId}`);
    }

    return this.chatRepo.find({
      where: { roomId, status: ChatStatus.OPEN },
      order: { id: 'ASC' },
    });
  }

  async getClientName(clientId: number) {
    const chat = await this.chatRepo.findOne({ where: { id: clientId } });
    return chat ? chat.sender : null;
  }
}
