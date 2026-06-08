import { Injectable } from '@nestjs/common'

import { hash } from 'argon2'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } })
  }

  async create(email: string, password: string) {
    const hashedPassword = await hash(password)

    return await this.prismaService.user.create({
      data: { email, password: hashedPassword },
    })
  }
}
