const { promisify } = require('util')
const delay = promisify(setTimeout);
class Model {
  // static async create () {
  //   await delay(2000);
  //   console.log('async Model.create stuff done')
  //   return new Model()

  // }

  constructor() {
    console.log('constructor done')
  }
}

class Provider extends Model {

}

Provider.create = Provider.create || async function create () {
  await delay(2000);
  console.log('async Provider.create stuff done')
  return new Provider()
}

async function execute() {
  await Provider.create()
}

execute()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
