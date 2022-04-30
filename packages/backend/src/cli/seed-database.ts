import 'reflect-metadata';
import { DatabaseSeeds } from '../seeds/DatabaseSeeds';

exports.command = 'seeds';
exports.desc = 'Seeds database with seeding set of data';
exports.builder = {};

exports.handler = async function (argv) {
  try {
    await new DatabaseSeeds().run();
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};
