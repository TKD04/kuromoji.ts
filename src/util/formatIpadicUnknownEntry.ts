export default (
  wordId: number,
  wordType: IpadicWordType,
  wordPosition: number,
  features: IpadicFeatures,
  surfaceForm: string
): IpadicUnknownEntryToken => {
  const [
    ,
    partOfSpeech,
    partOfSpeechSubdivision1,
    partOfSpeechSubdivision2,
    partOfSpeechSubdivision3,
    conjugatedType,
    conjugatedForm,
    basicForm,
  ] = features;
  const token: IpadicUnknownEntryToken = {
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
  };

  return token;
};
