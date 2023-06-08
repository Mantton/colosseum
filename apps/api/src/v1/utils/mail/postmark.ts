import { ServerClient } from "postmark";
import { POSTMARK_SENDER, POSTMARK_TOKEN, SERVER_URL } from "../env";
import { generateJWT } from "../jwt";

const client = new ServerClient(POSTMARK_TOKEN);

type Identification = {
  email: string;
  handle: string;
};
export const sendMagicLink = async (
  data: Identification,
  isActivation = false
) => {
  const token = generateJWT(data);
  const link = `${SERVER_URL}/v1/auth/verify?token=${token}`;
  await client.sendEmailWithTemplate({
    From: POSTMARK_SENDER,
    To: data.email,
    TemplateAlias: isActivation ? "activate-account" : "verify-login",
    TemplateModel: {
      name: data.handle,
      action_url: link,
    },
    Headers: [
      {
        // Set this to prevent Gmail from threading emails.
        // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
        Name: "X-Entity-Ref-ID",
        Value: new Date().getTime() + "",
      },
    ],
  });
};
