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


  //const mergeResult = [...array1, ...array2];

  
  const issueNotes = [] //await IssueNotePresenter.presentAll({ pushed: false });

  if (responses.length === 0) return false;

  const partitions = SubmissionPeriod.partitionMany({ responses, issueNotes });
  console.log("PARTITIONS TO BE SENT");
  console.log(partitions);  
  await new Client().postMyUpdates(partitions); // send all interview data to backend
  await Response.destroy({ ...whereIds(responses) }); // delete all interview data
  //await Response.update({ pushed: true }, { ...whereIds(responses) });
  //await IssueNote.update({ pushed: true }, { ...whereIds(issueNotes) });

  return true;
};

const whereIds = (presented) => (
  { where: { id: { [Op.or]: presented.map(r => r.localId) } } }
);

export default pushInterviewData;
