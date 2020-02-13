// 3p
import { createConnection } from 'typeorm';

// App
import { Club } from '../app/entities';

export const schema = {
  properties: {
    designation: { type: 'string' },
    description: { type: 'string'}
  },
  required: [ 'designation' ],
  type: 'object',
};

export async function main(clubData: Club) {
  // Create a new connection to the database.
  const connection = await createConnection();

  // Create a new task with the text given in the command line.
  const club = new Club();
  club.description = clubData.description;
  club.designation = clubData.designation
  
  // Save the task in the database and then display it in the console.
  console.log(
    await connection.manager.save(club)
  );

  // Close the connection to the database.
  await connection.close();
}