const mongoose = require('mongoose');
const plugin = require('..');

let Model;

const pluginSchemaEnabled = new mongoose.Schema({
  name: String,
  age: {
    type: Number,
    lock: true,
  },
});

beforeAll(async () => {
  mongoose.plugin(plugin);
  Model = mongoose.model('Lock', pluginSchemaEnabled);
  await mongoose.connect(process.env.CONNECTION);
});

describe('Locking property values', () => {
  it('should ignore newly created docs', (done) => {
    const doc = new Model({
      name: 'Mike',
      age: 27,
    });

    return doc.save((e) => {
      expect(e).toBeNull();
      done();
    });
  });

  it('should fail to update assigned values', async (done) => {
    const doc = new Model({
      name: 'Mike',
      age: 27,
    });

    await doc.save();
    doc.age = 25;
    return doc.save((e) => {
      expect(e).toBeDefined();
      expect(e.message).toMatch('age');
      done();
    });
  });
});
