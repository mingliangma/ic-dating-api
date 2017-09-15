import l from '../../common/logger';

class AccountService {
  me() {
    l.info(`${this.constructor.name}.me()`);
    const result = {
      accountId: '1dfasdf1',
      displayName: 'Ming',
      ethnicity: 'Asian',
      dateOfBirth: '1988-11-1',
      gender: 'female',
      distance: 5,
      pictures: [
        {
          url: 'https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/1601455_10201728349473724_757186058_n.jpg?oh=23097799eabbb1bd04cabd17a48f1023&oe=5A4B8178',
        },
      ],
      signs: [
        {
          signId: 0,
          signName: 'money',
          signAvatarUrl: 'https://image.flaticon.com/icons/png/128/189/189093.png',
          order: 0,
        },
      ],
    };
    return result;
  }
}

export default new AccountService();
