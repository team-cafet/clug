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

import { Membership } from '../entities';
import { PermissionRequired } from '@foal/typeorm';

const membershipSchema = {
  additionalProperties: false,
  properties: {
    startDate: { type: 'string', format: 'date' },
    endDate: { type: 'string', format: 'date' },
    member: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string', format: 'email', maxLength: 255 }
      }
    },
    membershipPlan: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        designation: { type: 'string', maxLength: 30 }
      }
    }
  },
  required: [ 'startDate', 'member', 'membershipPlan' ],
  type: 'object'
};

@ApiUseTag('membership')
export class MembershipController {
  @PermissionRequired('member_read')
  @Get()
  @ApiOperationId('findMemberships')
  @ApiOperationSummary('Find memberships.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
      'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of memberships.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' }
    },
    type: 'object'
  })
  async findMemberships(ctx: Context) {
    ctx.request.query.skip = ctx.request.query.skip || 0;
    ctx.request.query.take = ctx.request.query.take || null;

    const memberships = await getRepository(Membership).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(memberships);
  }

  @PermissionRequired('member_read')
  @Get('/:membershipId')
  @ApiOperationId('findMembershipById')
  @ApiOperationSummary('Find a membership by ID.')
  @ApiResponse(404, { description: 'Membership not found.' })
  @ApiResponse(200, { description: 'Returns the membership.' })
  @ValidateParams({
    properties: { membershipId: { type: 'number' } },
    type: 'object'
  })
  async findMembershipById(ctx: Context) {
    const membership = await getRepository(Membership).findOne(
      ctx.request.params.membershipId
    );

    if (!membership) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(membership);
  }

  @PermissionRequired('member_write')
  @Post()
  @ApiOperationId('createMembership')
  @ApiOperationSummary('Create a new membership.')
  @ApiResponse(400, { description: 'Invalid membership.' })
  @ApiResponse(201, {
    description: 'Membership successfully created. Returns the membership.'
  })
  @ValidateBody(membershipSchema)
  async createMembership(ctx: Context) {
    const membership = await getRepository(Membership).save(ctx.request.body);
    return new HttpResponseCreated(membership);
  }

  @PermissionRequired('member_write')
  @Patch('/:membershipId')
  @ApiOperationId('modifyMembership')
  @ApiOperationSummary('Update/modify an existing membership.')
  @ApiResponse(400, { description: 'Invalid membership.' })
  @ApiResponse(404, { description: 'Membership not found.' })
  @ApiResponse(200, {
    description: 'Membership successfully updated. Returns the membership.'
  })
  @ValidateParams({
    properties: { membershipId: { type: 'number' } },
    type: 'object'
  })
  @ValidateBody({ ...membershipSchema, required: [] })
  async modifyMembership(ctx: Context) {
    const membership = await getRepository(Membership).findOne(
      ctx.request.params.membershipId
    );

    if (!membership) {
      return new HttpResponseNotFound();
    }

    Object.assign(membership, ctx.request.body);

    await getRepository(Membership).save(membership);

    return new HttpResponseOK(membership);
  }

  @PermissionRequired('member_write')
  @Put('/:membershipId')
  @ApiOperationId('replaceMembership')
  @ApiOperationSummary('Update/replace an existing membership.')
  @ApiResponse(400, { description: 'Invalid membership.' })
  @ApiResponse(404, { description: 'Membership not found.' })
  @ApiResponse(200, {
    description: 'Membership successfully updated. Returns the membership.'
  })
  @ValidateParams({
    properties: { membershipId: { type: 'number' } },
    type: 'object'
  })
  @ValidateBody(membershipSchema)
  async replaceMembership(ctx: Context) {
    const membership = await getRepository(Membership).findOne(
      ctx.request.params.membershipId
    );

    if (!membership) {
      return new HttpResponseNotFound();
    }

    Object.assign(membership, ctx.request.body);

    await getRepository(Membership).save(membership);

    return new HttpResponseOK(membership);
  }

  @PermissionRequired('member_write')
  @Delete('/:membershipId')
  @ApiOperationId('deleteMembership')
  @ApiOperationSummary('Delete a membership.')
  @ApiResponse(404, { description: 'Membership not found.' })
  @ApiResponse(204, { description: 'Membership successfully deleted.' })
  @ValidateParams({
    properties: { membershipId: { type: 'number' } },
    type: 'object'
  })
  async deleteMembership(ctx: Context) {
    const membership = await getRepository(Membership).findOne(
      ctx.request.params.membershipId
    );

    if (!membership) {
      return new HttpResponseNotFound();
    }

    await getRepository(Membership).delete(ctx.request.params.membershipId);

    return new HttpResponseNoContent();
  }
}
