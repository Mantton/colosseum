import { OPENAI_API_KEY } from "../v1/utils/env";
import {
  Configuration,
  CreateModerationResponseResultsInnerCategories,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const client = new OpenAIApi(configuration);

export const analyzeText = async (input: string) => {
  const {
    data: {
      results: [{ categories, flagged }], // TODO: More fine grain control using category_scores
    },
  } = await client.createModeration({
    input,
  });
  const sexualContent = categories.sexual;
  const providerFlagged = flagged;
  const contentFlagged = Object.keys(categories)
    .filter((k) => k !== "sexual")
    .some(
      (k) =>
        categories[k as keyof CreateModerationResponseResultsInnerCategories]
    );
  return {
    sexualContent,
    providerFlagged,
    contentFlagged,
  };
};
