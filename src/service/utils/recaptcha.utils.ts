import axios from 'axios';
import config from '../config';

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(config.recaptcha.verifyUrl, null, {
      params: {
        secret: config.recaptcha.secretKey,
        response: token
      }
    });

    return response.data.success === true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}; 