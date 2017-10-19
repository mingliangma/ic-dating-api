export class Controller {
  status(req, res) {

    console.log()
    res.status(200).json({
      DATABASE_URI: process.env.DATABASE_URI,
      PROJECT_ID: process.env.PROJECT_ID,
      API_KEY: process.env.FIREBASE_API_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
    });
  }
}
export default new Controller();
