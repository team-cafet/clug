import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidateParams, ValidateQuery
} from '@foal/core';
import { getRepository } from 'typeorm';

import { SubscriptionPlan } from '../entities';

const subscriptionplanSchema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

@ApiUseTag('subscriptionplan')
export class SubscriptionPlanController {

  @Get()
  @ApiOperationId('findSubscriptionplans')
  @ApiOperationSummary('Find subscriptionplans.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of subscriptionplans.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' },
    },
    type: 'object',
  })
  async findSubscriptionplans(ctx: Context) {
    const subscriptionplans = await getRepository(SubscriptionPlan).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(subscriptionplans);
  }

  @Get('/:subscriptionplanId')
  @ApiOperationId('findSubscriptionplanById')
  @ApiOperationSummary('Find a subscriptionplan by ID.')
  @ApiResponse(404, { description: 'Subscriptionplan not found.' })
  @ApiResponse(200, { description: 'Returns the subscriptionplan.' })
  @ValidateParams({ properties: { subscriptionplanId: { type: 'number' } }, type: 'object' })
  async findSubscriptionplanById(ctx: Context) {
    const subscriptionplan = await getRepository(SubscriptionPlan).findOne(ctx.request.params.subscriptionplanId);

    if (!subscriptionplan) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(subscriptionplan);
  }

  @Post()
  @ApiOperationId('createSubscriptionplan')
  @ApiOperationSummary('Create a new subscriptionplan.')
  @ApiResponse(400, { description: 'Invalid subscriptionplan.' })
  @ApiResponse(201, { description: 'Subscriptionplan successfully created. Returns the subscriptionplan.' })
  @ValidateBody(subscriptionplanSchema)
  async createSubscriptionplan(ctx: Context) {
    const subscriptionplan = await getRepository(SubscriptionPlan).save(ctx.request.body);
    return new HttpResponseCreated(subscriptionplan);
  }

  @Patch('/:subscriptionplanId')
  @ApiOperationId('modifySubscriptionplan')
  @ApiOperationSummary('Update/modify an existing subscriptionplan.')
  @ApiResponse(400, { description: 'Invalid subscriptionplan.' })
  @ApiResponse(404, { description: 'Subscriptionplan not found.' })
  @ApiResponse(200, { description: 'Subscriptionplan successfully updated. Returns the subscriptionplan.' })
  @ValidateParams({ properties: { subscriptionplanId: { type: 'number' } }, type: 'object' })
  @ValidateBody({ ...subscriptionplanSchema, required: [] })
  async modifySubscriptionplan(ctx: Context) {
    const subscriptionplan = await getRepository(SubscriptionPlan).findOne(ctx.request.params.subscriptionplanId);

    if (!subscriptionplan) {
      return new HttpResponseNotFound();
    }

    Object.assign(subscriptionplan, ctx.request.body);

    await getRepository(SubscriptionPlan).save(subscriptionplan);

    return new HttpResponseOK(subscriptionplan);
  }

  @Put('/:subscriptionplanId')
  @ApiOperationId('replaceSubscriptionplan')
  @ApiOperationSummary('Update/replace an existing subscriptionplan.')
  @ApiResponse(400, { description: 'Invalid subscriptionplan.' })
  @ApiResponse(404, { description: 'Subscriptionplan not found.' })
  @ApiResponse(200, { description: 'Subscriptionplan successfully updated. Returns the subscriptionplan.' })
  @ValidateParams({ properties: { subscriptionplanId: { type: 'number' } }, type: 'object' })
  @ValidateBody(subscriptionplanSchema)
  async replaceSubscriptionplan(ctx: Context) {
    const subscriptionplan = await getRepository(SubscriptionPlan).findOne(ctx.request.params.subscriptionplanId);

    if (!subscriptionplan) {
      return new HttpResponseNotFound();
    }

    Object.assign(subscriptionplan, ctx.request.body);

    await getRepository(SubscriptionPlan).save(subscriptionplan);

    return new HttpResponseOK(subscriptionplan);
  }

  @Delete('/:subscriptionplanId')
  @ApiOperationId('deleteSubscriptionplan')
  @ApiOperationSummary('Delete a subscriptionplan.')
  @ApiResponse(404, { description: 'Subscriptionplan not found.' })
  @ApiResponse(204, { description: 'Subscriptionplan successfully deleted.' })
  @ValidateParams({ properties: { subscriptionplanId: { type: 'number' } }, type: 'object' })
  async deleteSubscriptionplan(ctx: Context) {
    const subscriptionplan = await getRepository(SubscriptionPlan).findOne(ctx.request.params.subscriptionplanId);

    if (!subscriptionplan) {
      return new HttpResponseNotFound();
    }

    await getRepository(SubscriptionPlan).delete(ctx.request.params.subscriptionplanId);

    return new HttpResponseNoContent();
  }

}
