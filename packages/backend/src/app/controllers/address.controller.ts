import {
  Context,
  Get,
  HttpResponseOK,
  ApiUseTag,
  ApiOperationId,
  ApiOperationSummary,
  ApiOperationDescription,
  ApiResponse,
  ValidateQuery,
  ValidateParams,
  HttpResponseNotFound,
  Post,
  ValidateBody,
  HttpResponseCreated,
  Patch,
  Put,
  Delete,
  HttpResponseNoContent
} from '@foal/core';
import { getRepository } from 'typeorm';
import { Address } from '../entities';
import { PermissionRequired } from '@foal/typeorm';

const addressSchema = {
  additionalProperties: false,
  properties: {
    id: { type: 'number' },
    street: { type: 'string', maxLength: 255 },
    streetNumber: { type: 'number', maxLength: 10000 },
    city: { type: 'string', maxLength: 255 },
    country: { type: 'string', maxLength: 255 }
  },
  type: 'object'
};

@ApiUseTag('address')
export class AddressController {
  @PermissionRequired('member_read')
  @Get()
  @ApiOperationId('findAddresss')
  @ApiOperationSummary('Find addresss.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
      'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of addresss.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' }
    },
    type: 'object'
  })
  async findAddresss(ctx: Context) {
    const addresss = await getRepository(Address).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take,
      relations: [ 'club', 'level', 'address' ]
    });
    return new HttpResponseOK(addresss);
  }

  @PermissionRequired('member_read')
  @Get('/:addressId')
  @ApiOperationId('findAddressById')
  @ApiOperationSummary('Find a address by ID.')
  @ApiResponse(404, { description: 'Address not found.' })
  @ApiResponse(200, { description: 'Returns the address.' })
  @ValidateParams({
    properties: { addressId: { type: 'number' } },
    type: 'object'
  })
  async findAddressById(ctx: Context) {
    const address = await getRepository(Address).findOne(
      ctx.request.params.addressId,
      { relations: [ 'club', 'level', 'address' ] }
    );

    if (!address) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(address);
  }

  @PermissionRequired('member_write')
  @Post()
  @ApiOperationId('createAddress')
  @ApiOperationSummary('Create a new address.')
  @ApiResponse(400, { description: 'Invalid address.' })
  @ApiResponse(201, {
    description: 'Address successfully created. Returns the address.'
  })
  @ValidateBody(addressSchema)
  async createAddress(ctx: Context) {
    const address = await getRepository(Address).save(ctx.request.body);
    return new HttpResponseCreated(address);
  }

  @PermissionRequired('member_write')
  @Patch('/:addressId')
  @ApiOperationId('modifyAddress')
  @ApiOperationSummary('Update/modify an existing address.')
  @ApiResponse(400, { description: 'Invalid address.' })
  @ApiResponse(404, { description: 'Address not found.' })
  @ApiResponse(200, {
    description: 'Address successfully updated. Returns the address.'
  })
  @ValidateParams({
    properties: { addressId: { type: 'number' } },
    type: 'object'
  })
  @ValidateBody({ ...addressSchema, required: [] })
  async modifyAddress(ctx: Context) {
    const address = await getRepository(Address).findOne(
      ctx.request.params.addressId
    );

    if (!address) {
      return new HttpResponseNotFound();
    }

    Object.assign(address, ctx.request.body);

    await getRepository(Address).save(address);

    return new HttpResponseOK(address);
  }

  @PermissionRequired('member_write')
  @Put('/:addressId')
  @ApiOperationId('replaceAddress')
  @ApiOperationSummary('Update/replace an existing address.')
  @ApiResponse(400, { description: 'Invalid address.' })
  @ApiResponse(404, { description: 'Address not found.' })
  @ApiResponse(200, {
    description: 'Address successfully updated. Returns the address.'
  })
  @ValidateParams({
    properties: { addressId: { type: 'number' } },
    type: 'object'
  })
  @ValidateBody(addressSchema)
  async replaceAddress(ctx: Context) {
    const address = await getRepository(Address).findOne(
      ctx.request.params.addressId
    );

    if (!address) {
      return new HttpResponseNotFound();
    }

    Object.assign(address, ctx.request.body);

    await getRepository(Address).save(address);

    return new HttpResponseOK(address);
  }

  @PermissionRequired('member_write')
  @Delete('/:addressId')
  @ApiOperationId('deleteAddress')
  @ApiOperationSummary('Delete a address.')
  @ApiResponse(404, { description: 'Address not found.' })
  @ApiResponse(204, { description: 'Address successfully deleted.' })
  @ValidateParams({
    properties: { addressId: { type: 'number' } },
    type: 'object'
  })
  async deleteAddress(ctx: Context) {
    const address = await getRepository(Address).findOne(
      ctx.request.params.addressId
    );

    if (!address) {
      return new HttpResponseNotFound();
    }

    await getRepository(Address).softDelete(ctx.request.params.addressId);

    return new HttpResponseNoContent();
  }
}
