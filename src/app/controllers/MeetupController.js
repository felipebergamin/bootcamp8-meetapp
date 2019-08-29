import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupController {
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
}

export default new MeetupController();
