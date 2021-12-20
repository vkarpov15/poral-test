import axios from 'axios';

export async function makeHTTPRequest(): Promise<string> {
  const res = await axios.get('http://httpbin.org/get?answer=test');

  return res.data.args.answer;
}