import Client from "../helpers/client";
import FileCache from "../helpers/file_cache";
import File from "../helpers/file";
import stitchMyData from "../helpers/stitch_my_data";
import Response from "../models/response";
import IssueNote from "../models/issue_note";
import Attachment from "../models/attachment";
import ResponsePresenter from "../presenters/response_presenter";
import IssueNotePresenter from "../presenters/issue_note_presenter";

const pullData = async ({ connected=true, force, callback=()=>{} } = {}) => {
  let fetched = false;

  const onMiss = () => connected && fetchThenUpdateDatabase(f => fetched = f);
  const maxAge = force ? 0 : undefined;
  const myData = await FileCache.fetch("my_data.json", { onMiss, maxAge });

  const responses = await ResponsePresenter.presentAll({ forInterviewee: false });
  const issueNotes = await IssueNotePresenter.presentAll();
  const combined = stitchMyData(myData, responses, issueNotes);
  
  await callback(combined);
  return fetched;
};

// If the myData fetch succeeds, we can safely delete local responses that have
// been pushed to the backend as these will now appear in the API response.
const fetchThenUpdateDatabase = async (callback) => {
  const myData = await new Client().getMyData();

  await Response.destroy({ where: { pushed: true } });
  await IssueNote.destroy({ where: { pushed: true } });
  await createAttachments(myData);

  // Idea: We could check responses definitely appear in myData before deleting?

  callback(true);
  return myData;
};

const createAttachments = async (myData) => {
  const seen = {};

  await eachNested(myData, async o => {
    if (isFileAttachment(o)) {
      if (seen[o.md5]) { return; } else { seen[o.md5] = true; }

      const where = { md5: o.md5 };
      const attributes = { md5: o.md5, url: o.url };

      const attachment = await createOrUpdate(Attachment, { where, attributes });
      const fileExists = await File.exists(attachment.filename);

      if (fileExists && !attachment.pulled) {
        await attachment.update({ pulled: true });
      }
    }
  });
};

const isFileAttachment = (o) => (
  o && typeof o.md5 !== "undefined" && typeof o.url !== "undefined"
);

export default pullData;
export { createAttachments };
