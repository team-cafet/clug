import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidateParams, ValidateQuery
} from '@foal/core';
import { getRepository } from 'typeorm';

import { Level } from '../entities';

const levelSchema = {
  additionalProperties: false,
  properties: {
    name: { type: 'string', maxLength: 50 },
    description: { type: 'string', maxLength: 500 }
  },
  required: [ 'name' ],
  type: 'object'
};

@ApiUseTag('level')
export class LevelController {

  @Get()
  @ApiOperationId('findLevels')
  @ApiOperationSummary('Find levels.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of levels.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' }
    },
    type: 'object'
  })
  async findLevels(ctx: Context) {

    ctx.request.query.skip = ctx.request.query.skip || 0;
    ctx.request.query.take = ctx.request.query.take || null;

    const levels = await getRepository(Level).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(levels);
  }

  @Get('/:levelId')
  @ApiOperationId('findLevelById')
  @ApiOperationSummary('Find a level by ID.')
  @ApiResponse(404, { description: 'Level not found.' })
  @ApiResponse(200, { description: 'Returns the level.' })
  @ValidateParams({ properties: { levelId: { type: 'number' } }, type: 'object' })
  async findLevelById(ctx: Context) {
    const level = await getRepository(Level).findOne(ctx.request.params.levelId);

    if (!level) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(level);
  }

  @Post()
  @ApiOperationId('createLevel')
  @ApiOperationSummary('Create a new level.')
  @ApiResponse(400, { description: 'Invalid level.' })
  @ApiResponse(201, { description: 'Level successfully created. Returns the level.' })
  @ValidateBody(levelSchema)
  async createLevel(ctx: Context) {
    const level = await getRepository(Level).save(ctx.request.body);
    return new HttpResponseCreated(level);
  }

  @Patch('/:levelId')
  @ApiOperationId('modifyLevel')
  @ApiOperationSummary('Update/modify an existing level.')
  @ApiResponse(400, { description: 'Invalid level.' })
  @ApiResponse(404, { description: 'Level not found.' })
  @ApiResponse(200, { description: 'Level successfully updated. Returns the level.' })
  @ValidateParams({ properties: { levelId: { type: 'number' } }, type: 'object' })
  @ValidateBody({ ...levelSchema, required: [] })
  async modifyLevel(ctx: Context) {
    const level = await getRepository(Level).findOne(ctx.request.params.levelId);

    if (!level) {
      return new HttpResponseNotFound();
    }

    Object.assign(level, ctx.request.body);

    await getRepository(Level).save(level);

    return new HttpResponseOK(level);
  }

  @Put('/:levelId')
  @ApiOperationId('replaceLevel')
  @ApiOperationSummary('Update/replace an existing level.')
  @ApiResponse(400, { description: 'Invalid level.' })
  @ApiResponse(404, { description: 'Level not found.' })
  @ApiResponse(200, { description: 'Level successfully updated. Returns the level.' })
  @ValidateParams({ properties: { levelId: { type: 'number' } }, type: 'object' })
  @ValidateBody(levelSchema)
  async replaceLevel(ctx: Context) {
    const level = await getRepository(Level).findOne(ctx.request.params.levelId);

    if (!level) {
      return new HttpResponseNotFound();
    }

    Object.assign(level, ctx.request.body);

    await getRepository(Level).save(level);

    return new HttpResponseOK(level);
  }

  @Delete('/:levelId')
  @ApiOperationId('deleteLevel')
  @ApiOperationSummary('Delete a level.')
  @ApiResponse(404, { description: 'Level not found.' })
  @ApiResponse(204, { description: 'Level successfully deleted.' })
  @ValidateParams({ properties: { levelId: { type: 'number' } }, type: 'object' })
  async deleteLevel(ctx: Context) {
    const level = await getRepository(Level).findOne(ctx.request.params.levelId);

    if (!level) {
      return new HttpResponseNotFound();
    }

    await getRepository(Level).delete(ctx.request.params.levelId);

    return new HttpResponseNoContent();
  }

}
