import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const date = parseISO(req.query.date);
      where.date_time = {
        [Op.between]: [startOfDay(date), endOfDay(date)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit: 10,
      offset: 10 * (page - 1),
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date_time: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed' });
    }

    if (isBefore(parseISO(req.body.date_time), new Date())) {
      return res
        .status(400)
        .json({ error: "You can't create a meetup with a past date" });
    }

    const meetup = await Meetup.create({
      ...req.body,
      user_id: req.user.id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (isBefore(meetup.date_time, new Date())) {
      return res.status(400).json({ error: "You can't update past meetups" });
    }

    if (meetup.user_id !== req.user.id) {
      return res
        .status(401)
        .json({ error: "You can't update meetups managed by others" });
    }

    await meetup.update(req.body);
    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (meetup.user_id !== req.user.id) {
      return res
        .status(401)
        .json({ error: 'You must be the creator of a meetup to delete it' });
    }

    if (isBefore(meetup.date_time, new Date())) {
      return res.status(401).json({ error: "A past meetup can't be deleted" });
    }

    await meetup.destroy();
    return res.json();
  }
}

export default new MeetupController();
