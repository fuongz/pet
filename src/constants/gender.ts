export enum GENDER_ENUM {
  'Female',
  'Male',
  'Other',
}

export type TGender = keyof typeof GENDER_ENUM
