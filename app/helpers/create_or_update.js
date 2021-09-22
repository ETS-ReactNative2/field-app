const createOrUpdate = async (model, { where, attributes }, interviewMode = false) => {
  let record = null;
  
  if (interviewMode) {
    record = await model.create(attributes);
  } else {
    record = await model.findOne({ where });

    if (record) {
      await record.update(attributes);
    } else {
      record = await model.create(attributes);
    }
  }

  return record;
};

export default createOrUpdate;
