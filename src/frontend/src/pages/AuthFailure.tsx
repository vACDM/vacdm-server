import { XMarkIcon } from '@heroicons/react/24/solid';

export default function AuthFailurePage() {
  return <div className='flex flex-col items-center text-red-500'>
    <div className="mt-20">
      <XMarkIcon className='h-40 w-40' />
    </div>
    <div className="mt-10">
      Login failed, try again using the login button in the top right!
    </div>
  </div>;
}
