import {PublicKey} from 'solace-sdk';

export const TEST_PRIVATE_KEY =
  '182,177,209,146,232,29,199,170,151,161,22,146,203,238,222,240,212,83,59,9,170,179,80,154,16,15,205,81,49,85,99,216,205,53,40,98,14,176,223,191,216,223,218,61,109,178,102,218,255,88,222,12,99,251,125,67,199,123,78,250,251,19,162,6';
export const TEST_PASSWORD = 'test@solace';
export const TEST_EMAIL = 'test@solace.money';

/** Solace sdk constants */
export const NETWORK: 'testnet' | 'local' = 'testnet';
export const PROGRAM_ADDRESS =
  NETWORK === 'testnet'
    ? '8FRYfiEcSPFuJd27jkKaPBwFCiXDFYrnfwqgH9JFjS2U'
    : '3CvPZTk1PYMs6JzgiVNFtsAeijSNwbhrQTMYeFQKWpFw';
export const LAMPORTS_PER_SOL = 1000000000;
// export const SPL_TOKEN = 'DB6BcxUpHDSxEFpqDRjm98HTvX2JZapbBNN8RcR4K11z';
export const SPL_TOKEN = 'DB6BcxUpHDSxEFpqDRjm98HTvX2JZapbBNN8RcR4K11z';
export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);
export const DEFAULT_PRIVATE_KEY = [
  64, 49, 21, 122, 173, 218, 147, 45, 207, 84, 138, 105, 6, 50, 18, 81, 174,
  246, 20, 171, 195, 135, 70, 222, 225, 154, 217, 74, 218, 186, 191, 197, 49,
  170, 69, 11, 200, 3, 223, 9, 39, 74, 201, 163, 68, 222, 53, 183, 52, 220, 243,
  79, 228, 240, 168, 172, 218, 155, 91, 56, 123, 136, 222, 143,
];
export const DEFAULT_PUBLIC_KEY =
  '4LsZkGUwZax7x3qdNubwb9czWk2TJNysrVjzc2pGF91p';

/** Relayer constants */
export const RELAYER_BASE_URL =
  'https://rxc9xav4nk.execute-api.ap-south-1.amazonaws.com';
export const SECOND_RELAYER_BASE_URL = 'https://solace-open-relayer.vercel.app';

/** Cognito constants */
export const COGNITO_USERPOOL_ID = 'ap-south-1_8Ylepg5f1';
export const COGNITO_CLIENT_ID = '5p5t8mcggrifoftsc6ufe4467l';

/** Google api for login and google drive constants */
export const GOOGLE_WEB_CLIENT_ID =
  '757682918669-642g9pqab06h33pl8i2tqjegi60a91ms.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID =
  '757682918669-r08gca3sbdn42o0onj5etmh86pp21qj6.apps.googleusercontent.com';
export const GOOGLE_ANDROID_CLIENT_ID =
  '757682918669-jh26htoc81mopio9sn39pg5nghvagpt0.apps.googleusercontent.com';

/** Filename for google drive storage of encrypted data */
export const PRIVATE_KEY_FILENAME = 'solace_pk.solace';
export const SOLACE_NAME_FILENAME = 'solace_n.solace';

/** Encryption */
export const SOLACE_SALT = 'solace-salt';
export const SOLACE_COST = 5000;

/** Regex */
export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
export const OTP_REGEX = /^[0-9]{6,6}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
