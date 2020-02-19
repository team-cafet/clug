import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidateParams, ValidateQuery
} from '@foal/core';
import { getRepository } from 'typeorm';

import { MembershipPlan } from '../entities';
import { TypeOfFacturation } from '../entities/membership-plan.entity';

const membershipPlanSchema = {
  additionalProperties: false,
  properties: {
    designation: { type: 'string', maxLength: 30 },
    description: { type: 'string', maxLength: 1020 },
    amount: { type: 'number' },
    typeOfFacturation: {
      type: 'integer',
      enum: [
        TypeOfFacturation.WEEKLY,
        TypeOfFacturation.MONTHLY,
        TypeOfFacturation.QUARTERLY,
        TypeOfFacturation.HALF_YEARLY,
        TypeOfFacturation.YEARLY
      ] 
    },
  },
  required: [ 'designation', 'amount', 'typeOfFacturation' ],
  type: 'object',
};

@ApiUseTag('membershipPlan')
export class MembershipPlanController {

  @Get()
  @ApiOperationId('findMembershipPlans')
  @ApiOperationSummary('Find membershipPlans.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of membershipPlans.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' },
    },
    type: 'object',
  })
  async findMembershipPlans(ctx: Context) {
    const membershipPlans = await getRepository(MembershipPlan).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(membershipPlans);
  }

  @Get('/:membershipPlanId')
  @ApiOperationId('findMembershipPlanById')
  @ApiOperationSummary('Find a membershipPlan by ID.')
  @ApiResponse(404, { description: 'MembershipPlan not found.' })
  @ApiResponse(200, { description: 'Returns the membershipPlan.' })
  @ValidateParams({ properties: { membershipPlanId: { type: 'number' } }, type: 'object' })
  async findMembershipPlanById(ctx: Context) {
    const membershipPlan = await getRepository(MembershipPlan).findOne(ctx.request.params.membershipPlanId);

    if (!membershipPlan) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(membershipPlan);
  }

  @Post()
  @ApiOperationId('createMembershipPlan')
  @ApiOperationSummary('Create a new membershipPlan.')
  @ApiResponse(400, { description: 'Invalid membershipPlan.' })
  @ApiResponse(201, { description: 'MembershipPlan successfully created. Returns the membershipPlan.' })
  @ValidateBody(membershipPlanSchema)
  async createMembershipPlan(ctx: Context) {
    const membershipPlan = await getRepository(MembershipPlan).save(ctx.request.body);
    return new HttpResponseCreated(membershipPlan);
  }

  @Patch('/:membershipPlanId')
  @ApiOperationId('modifyMembershipPlan')
  @ApiOperationSummary('Update/modify an existing membershipPlan.')
  @ApiResponse(400, { description: 'Invalid membershipPlan.' })
  @ApiResponse(404, { description: 'MembershipPlan not found.' })
  @ApiResponse(200, { description: 'MembershipPlan successfully updated. Returns the membershipPlan.' })
  @ValidateParams({ properties: { membershipPlanId: { type: 'number' } }, type: 'object' })
  @ValidateBody({ ...membershipPlanSchema, required: [] })
  async modifyMembershipPlan(ctx: Context) {
    const membershipPlan = await getRepository(MembershipPlan).findOne(ctx.request.params.membershipPlanId);

    if (!membershipPlan) {
      return new HttpResponseNotFound();
    }

    Object.assign(membershipPlan, ctx.request.body);

    await getRepository(MembershipPlan).save(membershipPlan);

    return new HttpResponseOK(membershipPlan);
  }

  @Put('/:membershipPlanId')
  @ApiOperationId('replaceMembershipPlan')
  @ApiOperationSummary('Update/replace an existing membershipPlan.')
  @ApiResponse(400, { description: 'Invalid membershipPlan.' })
  @ApiResponse(404, { description: 'MembershipPlan not found.' })
  @ApiResponse(200, { description: 'MembershipPlan successfully updated. Returns the membershipPlan.' })
  @ValidateParams({ properties: { membershipPlanId: { type: 'number' } }, type: 'object' })
  @ValidateBody(membershipPlanSchema)
  async replaceMembershipPlan(ctx: Context) {
    const membershipPlan = await getRepository(MembershipPlan).findOne(ctx.request.params.membershipPlanId);

    if (!membershipPlan) {
      return new HttpResponseNotFound();
    }

    Object.assign(membershipPlan, ctx.request.body);

    await getRepository(MembershipPlan).save(membershipPlan);

    return new HttpResponseOK(membershipPlan);
  }

  @Delete('/:membershipPlanId')
  @ApiOperationId('deleteMembershipPlan')
  @ApiOperationSummary('Delete a membershipPlan.')
  @ApiResponse(404, { description: 'MembershipPlan not found.' })
  @ApiResponse(204, { description: 'MembershipPlan successfully deleted.' })
  @ValidateParams({ properties: { membershipPlanId: { type: 'number' } }, type: 'object' })
  async deleteMembershipPlan(ctx: Context) {
    const membershipPlan = await getRepository(MembershipPlan).findOne(ctx.request.params.membershipPlanId);

    if (!membershipPlan) {
      return new HttpResponseNotFound();
    }

    await getRepository(MembershipPlan).delete(ctx.request.params.membershipPlanId);

    return new HttpResponseNoContent();
  }

}
