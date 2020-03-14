import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidateParams, ValidateQuery
} from '@foal/core';
import { getRepository } from 'typeorm';

import { Club } from '../entities';
import { PermissionRequired } from '@foal/typeorm';

const clubSchema = {
  additionalProperties: false,
  properties: {
    designation: { type: 'string', maxLength: 50 },
    description: { type: 'string', maxLength: 500 },
  },
  required: [ 'designation' ],
  type: 'object',
};

@ApiUseTag('club')
export class ClubController {

  @PermissionRequired('member_read')
  @Get()
  @ApiOperationId('findClubs')
  @ApiOperationSummary('Find clubs.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of clubs.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' },
    },
    type: 'object',
  })
  async findClubs(ctx: Context) {
    const clubs = await getRepository(Club).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(clubs);
  }

  @PermissionRequired('member_read')
  @Get('/:clubId')
  @ApiOperationId('findClubById')
  @ApiOperationSummary('Find a club by ID.')
  @ApiResponse(404, { description: 'Club not found.' })
  @ApiResponse(200, { description: 'Returns the club.' })
  @ValidateParams({ properties: { clubId: { type: 'number' } }, type: 'object' })
  async findClubById(ctx: Context) {
    const club = await getRepository(Club).findOne(ctx.request.params.clubId);

    if (!club) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(club);
  }

  @PermissionRequired('member_write')
  @Post()
  @ApiOperationId('createClub')
  @ApiOperationSummary('Create a new club.')
  @ApiResponse(400, { description: 'Invalid club.' })
  @ApiResponse(201, { description: 'Club successfully created. Returns the club.' })
  @ValidateBody(clubSchema)
  async createClub(ctx: Context) {
    const club = await getRepository(Club).save(ctx.request.body);
    return new HttpResponseCreated(club);
  }

  @PermissionRequired('member_write')
  @Patch('/:clubId')
  @ApiOperationId('modifyClub')
  @ApiOperationSummary('Update/modify an existing club.')
  @ApiResponse(400, { description: 'Invalid club.' })
  @ApiResponse(404, { description: 'Club not found.' })
  @ApiResponse(200, { description: 'Club successfully updated. Returns the club.' })
  @ValidateParams({ properties: { clubId: { type: 'number' } }, type: 'object' })
  @ValidateBody({ ...clubSchema, required: [] })
  async modifyClub(ctx: Context) {
    const club = await getRepository(Club).findOne(ctx.request.params.clubId);

    if (!club) {
      return new HttpResponseNotFound();
    }

    Object.assign(club, ctx.request.body);

    await getRepository(Club).save(club);

    return new HttpResponseOK(club);
  }

  @PermissionRequired('member_write')
  @Put('/:clubId')
  @ApiOperationId('replaceClub')
  @ApiOperationSummary('Update/replace an existing club.')
  @ApiResponse(400, { description: 'Invalid club.' })
  @ApiResponse(404, { description: 'Club not found.' })
  @ApiResponse(200, { description: 'Club successfully updated. Returns the club.' })
  @ValidateParams({ properties: { clubId: { type: 'number' } }, type: 'object' })
  @ValidateBody(clubSchema)
  async replaceClub(ctx: Context) {
    const club = await getRepository(Club).findOne(ctx.request.params.clubId);

    if (!club) {
      return new HttpResponseNotFound();
    }

    Object.assign(club, ctx.request.body);

    await getRepository(Club).save(club);

    return new HttpResponseOK(club);
  }

  @PermissionRequired('member_write')
  @Delete('/:clubId')
  @ApiOperationId('deleteClub')
  @ApiOperationSummary('Delete a club.')
  @ApiResponse(404, { description: 'Club not found.' })
  @ApiResponse(204, { description: 'Club successfully deleted.' })
  @ValidateParams({ properties: { clubId: { type: 'number' } }, type: 'object' })
  async deleteClub(ctx: Context) {
    const club = await getRepository(Club).findOne(ctx.request.params.clubId);

    if (!club) {
      return new HttpResponseNotFound();
    }

    await getRepository(Club).delete(ctx.request.params.clubId);

    return new HttpResponseNoContent();
  }

}
