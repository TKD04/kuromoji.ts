/**
 * BOS stands for Begin Of Statement
 * EOS stands for End Of Statement
 */
export type IpadicWordType = "BOS" | "EOS" | "KOWN" | "UNKNOWN";

export type IpadicFeatures = Readonly<
  [
    surfaceForm: string,
    partOfSpeech: string,
    partOfSpeechSubdivision1: string,
    partOfSpeechSubdivision2: string,
    partOfSpeechSubdivision3: string,
    conjugatedType: string,
    conjugatedForm: string,
    basicForm: string,
    howToRead: string,
    pronunciation: string,
  ]
>;

// TODO: Add specific types to partOfSpeech and so on
export type IpadicKnownEntryToken = Readonly<{
  wordId: number;
  wordType: IpadicWordType;
  /** 単語の開始位置 */
  wordPosition: number;
  /** 表層形 */
  surfaceForm: string;
  /** 品詞 */
  partOfSpeech: string;
  /** 品詞細分類1 */
  partOfSpeechSubdivision1: string;
  /** 品詞細分類2 */
  partOfSpeechSubdivision2: string;
  /** 品詞細分類3 */
  partOfSpeechSubdivision3: string;
  /** 活用型 */
  conjugatedType: string;
  /** 活用形 */
  conjugatedForm: string;
  /** 基本形 */
  basicForm: string;
  /** 読み */
  howToRead: string;
  /** 発音 */
  pronunciation: string;
}>;

export type IpadicUnknownEntryToken = Omit<
  IpadicKnownEntryToken,
  "howToRead" | "pronunciation"
>;
