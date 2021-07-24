import axios from 'axios';

export default function handleNetworkError(err: any) {
  if (axios.isCancel(err)) {
    console.log(err);
  } else console.error(err);
}
