/* eslint-disable newline-per-chained-call,consistent-return */
import Sign from '../../../model/sign';// get our mongoose model

export class Controller {
  getAllSign(req, res) {
    Sign.find({}, (err, signs) => {
      console.log(signs);
      res.status(200).json(signs);
    });


  }
}

export default new Controller();
