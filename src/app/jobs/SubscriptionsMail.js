import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, manager, subscriber } = data;

    await Mail.sendMail({
      to: `${subscriber.name} <${subscriber.email}>`,
      subject: 'Novo inscrito para seu Meetup!',
      template: 'NewSubscriber',
      context: {
        meetupManagerName: manager.name,
        subscriberName: subscriber.name,
        meetupTitle: meetup.title,
      },
    });
  }
}

export default new SubscriptionMail();
