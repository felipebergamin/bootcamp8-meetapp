import Meetup from '../models/Meetup';

class MeetupManagerController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.user.id,
      },
    });

    return res.json(meetups);
  }
}

export default new MeetupManagerController();
