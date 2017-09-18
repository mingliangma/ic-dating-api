import AccountService from '../../services/account.service';


export class Controller {
  me(req, res) {
    const result = AccountService.me();
    res.json(result);
  }
  verifyPhone(req, res) {
    const result = AccountService.phoneVerification(req.params.phoneNum);
    res.status(201);
    res.json(result);
  }
  verifyCode(req, res) {
    const phoneNum = req.params.phoneNum;
    const code = req.params.code;

    const result = AccountService.codeVerify(phoneNum, code);
    res.status(201);
    res.json(result);
  }

  createAccount(req, res) {
    const result = AccountService.createAccount();
    res.status(201);
    res.json(result);
  }

  login(req, res) {
    const result = AccountService.login();
    res.status(201);
    res.json(result);
  }
}
export default new Controller();
