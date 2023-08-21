const Koop = require('@koopjs/koop-core');
const provider = require('../index');

const koop = new Koop({ });
koop.register(provider, { dataDir: './demo/provider-data'});
koop.server.listen(9999);