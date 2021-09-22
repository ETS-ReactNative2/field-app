import Client from "../helpers/client";
import SubmissionPeriod from "../helpers/submission_period";
import Response from "../models/response";
import IssueNote from "../models/issue_note";
import ResponsePresenter from "../presenters/response_presenter";
import IssueNotePresenter from "../presenters/issue_note_presenter";

const pushInterviewData = async () => {
  let  responses = [];

  // only submit interview reponses when interview mode is 'done'
  // check the databse for interview questions, 
  responses = await ResponsePresenter.presentAll({ pushed: false, interviewComplete: true, forInterviewee: true });

  const issueNotes = [] //await IssueNotePresenter.presentAll({ pushed: false });

  if (responses.length === 0) return false;

  const partitions = SubmissionPeriod.partitionMany({ responses, issueNotes });
  console.log("PARTITIONS TO BE SENT");
  console.log(partitions);  
  await new Client().postMyUpdates(partitions); // send all interview data to backend
  await Response.destroy({ ...whereIds(responses) }); 
  return true;
};

const whereIds = (presented) => (
  { where: { id: { [Op.or]: presented.map(r => r.localId) } } }
);

export default pushInterviewData;
