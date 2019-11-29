module.exports = (schema) => {
  schema.pre('save', async function lockCheck() {
    const fields = [];

    schema.eachPath((name, type) => {
      if (
        type.options.lock &&
        this.isModified(name) &&
        !this.isNew
      )
        fields.push(name);
    });

    if (fields.length)
      throw new Error(
        `Cannot update locked fields: ${fields.join(',')}`,
      );
  });
};
