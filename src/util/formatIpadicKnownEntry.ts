import type {
  IpadicFeatures,
  IpadicKnownEntryToken,
  IpadicWordType,
} from "./Ipadic";

export default (
  wordId: number,
  wordType: IpadicWordType,
  wordPosition: number,
  features: IpadicFeatures
): IpadicKnownEntryToken => {
  const [
    surfaceForm,
    partOfSpeech,
    partOfSpeechSubdivision1,
    partOfSpeechSubdivision2,
    partOfSpeechSubdivision3,
    conjugatedType,
    conjugatedForm,
    basicForm,
    howToRead,
    pronunciation,
  ] = features;
  const token: IpadicKnownEntryToken = {
    wordId,
    wordType,
    wordPosition,
    surfaceForm,
    partOfSpeech,
    partOfSpeechSubdivision1,
    partOfSpeechSubdivision2,
    partOfSpeechSubdivision3,
    conjugatedType,
    conjugatedForm,
    basicForm,
    howToRead,
    pronunciation,
  } as const;

  return token;
};
