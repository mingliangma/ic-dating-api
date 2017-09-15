import AccountService from '../../services/account.service';


export class Controller {
  me(req, res) {
    const result = AccountService.me();
    res.json(result);
  }
}
export default new Controller();
