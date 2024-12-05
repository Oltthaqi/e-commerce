import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}
  create(createAddressDto: CreateAddressDto, userId: number) {
    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    });
    return this.addressRepository.save(address);
  }

  findAll() {
    return this.addressRepository.find();
  }

  findOne(id: number) {
    return this.addressRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, userId: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this address',
      );
    }
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return this.addressRepository.remove(address);
  }
  async findUserAddresses(userId: number) {
    return this.addressRepository.find({ where: { userId } });
  }
  async findUserAddress(userId: number, addressId: number) {
    return this.addressRepository.findOne({ where: { userId, id: addressId } });
  }

  async removeUserAddress(userId: number, addressId: number) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this address',
      );
    }
    return this.addressRepository.remove(address);
  }
}
