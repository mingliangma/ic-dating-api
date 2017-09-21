const speakeasy = require('speakeasy');

class OtpService {
  constructor() {
    this.secret = process.env.OTP_SECRET;
  }

  generateToken() {
    const token = speakeasy.totp({
      secret: this.secret,
      encoding: 'base32',
    });
    return token;
  }

  verifyToken(token) {
    const tokenValidates = speakeasy.totp.verify({
      secret: this.secret,
      encoding: 'base32',
      token,
      window: 100,
    });
    return tokenValidates;
  }
}
export default new OtpService();