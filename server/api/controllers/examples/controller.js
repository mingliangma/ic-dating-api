import AccountService from '../../services/account.service';


export class Controller {
  all(req, res) {
    console.log('adsf');
    AccountService.all()
      .then(r => res.json(r));
  }
}
export default new Controller();
