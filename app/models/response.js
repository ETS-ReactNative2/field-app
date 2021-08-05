const Response = sequelize.define("response", {
  questionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  value: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  pushed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  intervieweeId: {
    type: Sequelize.TEXT
  },
  forInterviewee: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  interviewComplete: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: timestampField("createdAt"),
  updatedAt: timestampField("updatedAt"),
});

Response.onLoad = () => {
  // Set up associations here.
};

export default Response;
