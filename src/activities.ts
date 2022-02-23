import axios from 'axios';

export async function getSponsors(): Promise<any[]> {
  const res = await axios.get('https://opencollective.com/mongoose/members.json');

  return res.data;
}