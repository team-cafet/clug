/* eslint-disable @typescript-eslint/quotes */
import {
  ApiOperationDescription,
  ApiOperationId,
  ApiOperationSummary,
  ApiResponse,
  ApiUseTag,
  Context,
  Delete,
  Get,
  HttpResponseCreated,
  HttpResponseNoContent,
  HttpResponseNotFound,
  HttpResponseOK,
  Patch,
  Post,
  Put,
  ValidateBody,
  ValidateParams,
  ValidateQuery,
} from '@foal/core';
import { getRepository } from 'typeorm';

import { Member } from '../entities';
import { FinancialStatus, Sexe } from '../entities/member.entity';
import { PermissionRequired } from '@foal/typeorm';

const memberSchema = {
  additionalProperties: false,
  properties: {
    name: { type: 'string', maxLength: 255 },
    surname: { type: 'string', maxLength: 255 },
    sexe: {
      type: 'number',
      enum: [Sexe.MALE, Sexe.FEMALE, Sexe['NON-BINARY']],
    },
    email: { type: 'string', format: 'email', maxLength: 255 },
    phone: { type: 'string', maxLength: 50 },
    birthdate: {
      type: 'string',
      format: 'date',
      maxLength: 255,
    },
    financialStatus: {
      type: 'string',
      enum: [
        FinancialStatus.ALERT,
        FinancialStatus.OK,
        FinancialStatus.WARNING,
      ],
      maxLength: 255,
    },
    club: { type: 'object' },

    address: { type: 'object' },
  },
  required: ['name', 'surname', 'email'],
  type: 'object',
};
@ApiUseTag('member')
export class MemberController {
  @PermissionRequired('member_read')
  @Get()
  @ApiOperationId('findMembers')
  @ApiOperationSummary('Find members.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
      'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of members.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' },
    },
    type: 'object',
  })
  async findMembers(ctx: Context) {
    const members = await getRepository(Member).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take,
      relations: ['club'],
    });
    return new HttpResponseOK(members);
  }

  @PermissionRequired('member_read')
  @Get('/statistics')
  @ApiOperationId('findStatistic')
  @ApiOperationSummary('Find statistics.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
      'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of members.' })
  async findStatistics(ctx: Context) {
    const today = new Date();
    const startDate: string = new Date(today.getFullYear(), today.getMonth(), 2)
      .toISOString()
      .slice(0, 10);
    const endDate: string = today.toISOString().slice(0, 10);

    const membersCount: [{count: number}] = await getRepository(Member).query(
      'SELECT count(*) from member'
    );
    const badPayersCount: [{count: number}] = await getRepository(Member).query(
      `SELECT count(*) from member where "financialStatus" = '0'`
    );
    const newMembersCount: [{count: number}] = await getRepository(Member).query(
      `SELECT count(*) from member where "createdAt" >= '${startDate}'
      AND "createdAt" <  '${endDate}'`
    );
    const averageAge: [{average_age: Date}] = await getRepository(Member).query(
      `SELECT to_timestamp(avg(extract(epoch from birthdate)))::date AS average_age
      FROM member`
    );
    const oldestMember: [Member] = await getRepository(Member).query(
      `SELECT *
      FROM member
      order by birthdate ASC
      LIMIT 1`
    );
    const youngestMember: [Member] = await getRepository(Member).query(
      `SELECT *
      FROM member
      order by birthdate DESC
      LIMIT 1`
    );


    return new HttpResponseOK({
      membersCount: membersCount[0].count,
      badPayersCount: badPayersCount[0].count,
      newMembersCount: newMembersCount[0].count,
      averageAge: averageAge[0].average_age,
      olderMember: oldestMember[0],
      youngestMember: youngestMember[0]
    });
  }

  @PermissionRequired('member_read')
  @Get('/:memberId')
  @ApiOperationId('findMemberById')
  @ApiOperationSummary('Find a member by ID.')
  @ApiResponse(404, { description: 'Member not found.' })
  @ApiResponse(200, { description: 'Returns the member.' })
  @ValidateParams({
    properties: { memberId: { type: 'number' } },
    type: 'object',
  })
  async findMemberById(ctx: Context) {
    const member = await getRepository(Member).findOne(
      ctx.request.params.memberId,
      { relations: ['club'] }
    );

    if (!member) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(member);
  }

  @PermissionRequired('member_write')
  @Post()
  @ApiOperationId('createMember')
  @ApiOperationSummary('Create a new member.')
  @ApiResponse(400, { description: 'Invalid member.' })
  @ApiResponse(201, {
    description: 'Member successfully created. Returns the member.',
  })
  @ValidateBody(memberSchema)
  async createMember(ctx: Context) {
    const member = await getRepository(Member).save(ctx.request.body);
    return new HttpResponseCreated(member);
  }

  @PermissionRequired('member_write')
  @Patch('/:memberId')
  @ApiOperationId('modifyMember')
  @ApiOperationSummary('Update/modify an existing member.')
  @ApiResponse(400, { description: 'Invalid member.' })
  @ApiResponse(404, { description: 'Member not found.' })
  @ApiResponse(200, {
    description: 'Member successfully updated. Returns the member.',
  })
  @ValidateParams({
    properties: { memberId: { type: 'number' } },
    type: 'object',
  })
  @ValidateBody({ ...memberSchema, required: [] })
  async modifyMember(ctx: Context) {
    const member = await getRepository(Member).findOne(
      ctx.request.params.memberId
    );

    if (!member) {
      return new HttpResponseNotFound();
    }

    Object.assign(member, ctx.request.body);

    await getRepository(Member).save(member);

    return new HttpResponseOK(member);
  }

  @PermissionRequired('member_write')
  @Put('/:memberId')
  @ApiOperationId('replaceMember')
  @ApiOperationSummary('Update/replace an existing member.')
  @ApiResponse(400, { description: 'Invalid member.' })
  @ApiResponse(404, { description: 'Member not found.' })
  @ApiResponse(200, {
    description: 'Member successfully updated. Returns the member.',
  })
  @ValidateParams({
    properties: { memberId: { type: 'number' } },
    type: 'object',
  })
  @ValidateBody(memberSchema)
  async replaceMember(ctx: Context) {
    const member = await getRepository(Member).findOne(
      ctx.request.params.memberId
    );

    if (!member) {
      return new HttpResponseNotFound();
    }

    Object.assign(member, ctx.request.body);

    await getRepository(Member).save(member);

    return new HttpResponseOK(member);
  }

  @PermissionRequired('member_write')
  @Delete('/:memberId')
  @ApiOperationId('deleteMember')
  @ApiOperationSummary('Delete a member.')
  @ApiResponse(404, { description: 'Member not found.' })
  @ApiResponse(204, { description: 'Member successfully deleted.' })
  @ValidateParams({
    properties: { memberId: { type: 'number' } },
    type: 'object',
  })
  async deleteMember(ctx: Context) {
    const member = await getRepository(Member).findOne(
      ctx.request.params.memberId
    );

    if (!member) {
      return new HttpResponseNotFound();
    }

    await getRepository(Member).delete(ctx.request.params.memberId);

    return new HttpResponseNoContent();
  }
}
