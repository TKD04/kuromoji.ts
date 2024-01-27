/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
  IpadicFeatures,
  IpadicKnownEntryToken,
  IpadicUnknownEntryToken,
  IpadicWordType,
} from "./Ipadic";

/**
 * Mappings between IPADIC dictionary features and tokenized results
 */
export default class IpadicFormatter {
  static formatKnownEntry(
    wordId: number,
    wordType: IpadicWordType,
    wordPosition: number,
    features: IpadicFeatures
  ) {
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
  }

  static formatUnknownEntry(
    wordId: number,
    wordType: IpadicWordType,
    wordPosition: number,
    features: IpadicFeatures,
    surfaceForm: string
  ): IpadicUnknownEntryToken {
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
    } as const;

    return token;
  }
}
