import Response from "../models/response";

const deleteIntervieweeData = async ({ interviewee } = {}) => {
    return await Response.destroy({ where: { intervieweeId: interviewee } });
};

export default deleteIntervieweeData;
