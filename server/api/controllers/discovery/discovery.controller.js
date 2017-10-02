import AccountService from '../../services/account.service';

import User from '../../../model/user';
import Hide from '../../../model/hide';

export class Controller {
  hideUser(req, res) {
    const initiatorAccountId = req.body.initiatorAccountId;
    const receiverAccountId = req.body.receiverAccountId;

    //check if initiatorAccountId and receiverAccountId exist

  }

  list(req, res) {
    User.find({}, (err, users) => {
      console.log(users);
      res.status(200).json(users);
    });
  }
}

export default new Controller();
