import { CheckCircleIcon, CommandLineIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../components/Loading';

export default function AuthorizePluginPage() {
  const { id } = useParams();
  const [label, setLabel] = useState<string>('');

  const [state, setState] = useState<'start' | 'load' | 'done' | 'error'>('start');

  async function approve() {
    setState('load');

    axios.post(`/api/plugin-token/authorize/${id}`, {
      confirm: 'yes',
      label,
    })
      .then(() => setState('done'))
      .catch(e => {
        console.error(e);
        setState('error');
      });
  }

  if (state == 'load') {
    return <Loading />;
  }

  if (state == 'done') {
    return <div className='flex flex-col items-center mt-52'>
      <CheckCircleIcon className='h-40 w-40 text-green-500' />

      <div className="mt-5">
        The access was approved. This tab can be closed - have fun!
      </div>
    </div>;
  }

  if (state == 'error') {
    return <div className='flex flex-col items-center mt-52'>
      <XMarkIcon className='h-40 w-40 text-red-500' />

      <div className="mt-5">
        Failed to approve the access.
      </div>

      <Button className='mt-5' type='submit' label='Retry' onClick={approve} outlined />
    </div>;
  }

  return <div className='flex flex-col items-center'>
    <div className="mt-20">
      <CommandLineIcon className='h-40 w-40 text-green-500' />
    </div>
    <div>
      <div className="mt-10 w-full">
          A vACDM plugin in Euroscope requested to access vACDM in your name.
      </div>
      <form className="mt-10 w-full" onSubmit={approve}>
          <label htmlFor="inputLabel">Label</label>
          <InputText id='inputLabel' className='w-full' value={label} onChange={e => setLabel(e.target.value)} />

          <Button className='mt-5 w-full' type='submit' label='Approve' />
      </form>

    </div>
      {id}
  </div>;
}
