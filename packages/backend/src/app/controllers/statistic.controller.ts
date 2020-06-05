import { Context, Get, HttpResponseOK, ApiOperationId, ApiOperationSummary, ApiOperationDescription, ApiResponse } from '@foal/core';
import { PermissionRequired } from '@foal/typeorm';
import { getRepository } from 'typeorm';
import { Member } from '../entities';

export class StatisticController {

  @PermissionRequired('member_read')
  @Get('/')
  @ApiOperationId('findStatistic')
  @ApiOperationSummary('Find statistics.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
      'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of members.' })
  async findStatistics() {
    const today = new Date();
    const startDate: string = new Date(today.getFullYear(), today.getMonth(), 2)
      .toISOString()
      .slice(0, 10);
    const endDate: string = today.toISOString().slice(0, 10);

    const membersCount: [{count: number}] = await getRepository(Member).query(
      'SELECT count(*) from member'
    );
    const badPayersCount: [{count: number}] = await getRepository(Member).query(
      'SELECT count(*) from member where "financialStatus" = \'0\''
    );
    const newMembersCount: [{count: number}] = await getRepository(Member).query(
      `SELECT count(*) from member where "createdAt" >= '${startDate}'
      AND "createdAt" <  '${endDate}'`
    );
    const averageAge: [{averageAge: Date}] = await getRepository(Member).query(
      `SELECT to_timestamp(avg(extract(epoch from birthdate)))::date AS averageAge
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
      averageAge: averageAge[0].averageAge,
      olderMember: oldestMember[0],
      youngestMember: youngestMember[0]
    });
  }

}
