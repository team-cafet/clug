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
    ValidateQuery
  } from '@foal/core';
  import { getRepository } from 'typeorm';

  import { Member, Club, Address, User } from '../entities';
  import { FinancialStatus, Sexe } from '../entities/member.entity';
import { JWTRequired } from '@foal/jwt';
import { fetchUserWithPermissions, PermissionRequired } from '@foal/typeorm';

  const memberSchema = {
    additionalProperties: false,
    properties: {
      name: { type: 'string', maxLength: 255 },
      surname: { type: 'string', maxLength: 255 },
      sexe: {
        type: 'string',
        enum: [Sexe.MALE, Sexe.FEMALE, Sexe['NON-BINARY']],
        maxLength: 255
      },
      email: { type: 'string', format: 'email', maxLength: 255 },
      phone: { type: 'string', maxLength: 50 },
      birthdate: {
        type: 'string',
        format: 'date',
        maxLength: 255
      },
      financialStatus: {
        type: 'string',
        enum: [
          FinancialStatus.ALERT,
          FinancialStatus.OK,
          FinancialStatus.WARNING
        ],
        maxLength: 255
      },
      club: {type: 'object'},

      address: {type: 'object'},
    },
    required: ['name', 'surname', 'email'],
    type: 'object'
  };
  @PermissionRequired('member_read')
  @ApiUseTag('member')
  export class MemberController {
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
        take: { type: 'number' }
      },
      type: 'object'
    })
    async findMembers(ctx: Context) {
      const members = await getRepository(Member).find({
        skip: ctx.request.query.skip,
        take: ctx.request.query.take
      });
      return new HttpResponseOK(members);
    }

    @Get('/:memberId')
    @ApiOperationId('findMemberById')
    @ApiOperationSummary('Find a member by ID.')
    @ApiResponse(404, { description: 'Member not found.' })
    @ApiResponse(200, { description: 'Returns the member.' })
    @ValidateParams({
      properties: { memberId: { type: 'number' } },
      type: 'object'
    })
    async findMemberById(ctx: Context) {
      const member = await getRepository(Member).findOne(
        ctx.request.params.memberId
      );

      if (!member) {
        return new HttpResponseNotFound();
      }

      return new HttpResponseOK(member);
    }

    @Post()
    @ApiOperationId('createMember')
    @ApiOperationSummary('Create a new member.')
    @ApiResponse(400, { description: 'Invalid member.' })
    @ApiResponse(201, {
      description: 'Member successfully created. Returns the member.'
    })
    @ValidateBody(memberSchema)
    async createMember(ctx: Context) {
      const club: Club|undefined = await getRepository(Club).findOne(ctx.request.body.club)
      if(!club){
          return new HttpResponseNotFound('Club not found')
      }
      ctx.request.body.club = club
      const member = await getRepository(Member).save(ctx.request.body);
      return new HttpResponseCreated(member);
    }

    @Patch('/:memberId')
    @ApiOperationId('modifyMember')
    @ApiOperationSummary('Update/modify an existing member.')
    @ApiResponse(400, { description: 'Invalid member.' })
    @ApiResponse(404, { description: 'Member not found.' })
    @ApiResponse(200, {
      description: 'Member successfully updated. Returns the member.'
    })
    @ValidateParams({
      properties: { memberId: { type: 'number' } },
      type: 'object'
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

    @Put('/:memberId')
    @ApiOperationId('replaceMember')
    @ApiOperationSummary('Update/replace an existing member.')
    @ApiResponse(400, { description: 'Invalid member.' })
    @ApiResponse(404, { description: 'Member not found.' })
    @ApiResponse(200, {
      description: 'Member successfully updated. Returns the member.'
    })
    @ValidateParams({
      properties: { memberId: { type: 'number' } },
      type: 'object'
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

    @Delete('/:memberId')
    @ApiOperationId('deleteMember')
    @ApiOperationSummary('Delete a member.')
    @ApiResponse(404, { description: 'Member not found.' })
    @ApiResponse(204, { description: 'Member successfully deleted.' })
    @ValidateParams({
      properties: { memberId: { type: 'number' } },
      type: 'object'
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
