import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: Meetup,
          where: {
            date_time: { [Op.gt]: new Date() },
          },
        },
      ],
      order: [[Meetup, 'date_time', 'asc']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const alreadySubscribed = await Subscription.findOne({
      where: {
        user_id: req.user.id,
        meetup_id: req.params.meetupId,
      },
    });

    if (alreadySubscribed) {
      return res.status(400).json({
        error: "You're already subscribed to meetup",
      });
    }

    const timeConflicts = await Subscription.findOne({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: Meetup,
          where: {
            date_time: meetup.date_time,
          },
        },
      ],
    });

    if (timeConflicts) {
      return res.status(401).json({
        error:
          'You are already subscribed to a meetup scheduled for this date and time',
      });
    }

    if (meetup.user_id === req.user.id) {
      return res.status(401).json({
        error: "You can't subscribe to your own meetup",
      });
    }

    if (meetup.past) {
      return res
        .status(401)
        .json({ error: "You can't subscribe to a past meetup" });
    }

    const subscription = await Subscription.create({
      user_id: req.user.id,
      meetup_id: req.params.meetupId,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
