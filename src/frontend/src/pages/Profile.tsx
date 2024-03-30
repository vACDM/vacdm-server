import { MinusIcon } from '@heroicons/react/24/outline';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { useContext, useEffect, useState } from 'react';

import PluginToken from '../../../shared/interfaces/plugin-token.interface';
import ProfilePicture from '../components/ProfilePicture';
import AuthContext from '../contexts/AuthProvider';
import pluginTokenService from '../services/pluginToken.service';
import time from '../utils/time';

export default function ProfilePage() {
  const { auth, logout } = useContext(AuthContext);

  const tabs = {
    details: {
      label: 'Details',
    },
    pluginTokens: {
      label: 'Plugin Tokens',
    },
    raw: {
      label: 'Raw data',
    },
  };
  type TTabId = keyof typeof tabs;

  const [activeTab, setActiveTab] = useState<TTabId>(Object.keys(tabs)[0] as TTabId);
  const [tokens, setTokens] = useState<PluginToken[]>([]);

  const { user } = auth;

  function loadTokens() {
    pluginTokenService.getOwnTokens().then(setTokens).catch(console.error);
  }

  useEffect(() => {
    const int = setInterval(loadTokens, 60000);
    loadTokens();

    return () => {
      clearInterval(int);
    };
  }, []);

  async function revoke(token: PluginToken) {
    const confirmed = confirm(`Confirm you want to revoke the token "${token.label}" (${token._id})`);

    if (!confirmed) {
      return;
    }

    await pluginTokenService.revokeToken(token._id);

    loadTokens();
  }

  if (!user) {
    return <></>;
  }

  return (<>
    <div className="px-5 w-full">
      <div className='flex flex-row items-center my-5'>
        <div>
          <ProfilePicture user={user} />
        </div>
        <div className='ms-6'>
          <div className="font-bold text-lg">
            {user.firstName} {user.lastName}
          </div>
          <div className="mt-1">{user.cid}</div>
          <div className="mt-1">
            {user.admin && <Badge value='Admin' className='bg-yellow-300 text-black dark:text-black px-3 me-2' />}
            {user.hasAtcRating && <Badge value='ATC' severity='success' className='text-black dark:text-black px-3 me-2' />}
            {user.banned && <Badge value='Banned' severity='danger' className='px-3 me-2' />}
          </div>
        </div>
        <div className="ms-auto">
          <Button type='button' onClick={logout} severity="danger" outlined>Sign out</Button>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <Menu className='me-2 min-w-fit w-fit' model={Object.entries(tabs).map(([k, { ...data }]) => ({ ...data, command: () => setActiveTab(k as TTabId), className: activeTab == k ? 'bg-zinc-300 dark:bg-zinc-700' : undefined }))} />
        <Card title={tabs[activeTab].label} pt={{ root: { className: 'w-full' } }}>
          {activeTab == 'details' && <div>
            <table>
              <tbody>
                {Object.entries({
                  'First name': user.firstName,
                  'Last name': user.lastName,
                  'VATSIM CID': user.cid,
                  'vACDM User ID': user._id,
                  'First Seen': time.formatDateTime(user.createdAt),
                  'Last updated': time.formatDateTime(user.updatedAt),
                }).map(([label, value]) => <tr key={label}><th className='text-left pe-4' scope='row'>{label}</th><td>{value}</td></tr>)}
              </tbody>
            </table>
          </div>}
          {activeTab == 'pluginTokens' && <div>
            {!tokens.length ? <>
              You do not have any plugin tokens. Start using the vACDM plugin to have the plugin generate one!
            </> : tokens.map(token => (
              <div key={token._id} className="flex flex-row justify-between pt-1 pb-2 px-2 mx-0 rounded-lg hover:bg-zinc-600">
                <div className="flex flex-col">
                  <div className="text-xl font-bold">{token.label}</div>
                  <table>
                    <tbody>
                      {Object.entries({
                        'ID': token._id,
                        'Last seen': time.formatDateTime(token.lastUsed),
                        'Created at': time.formatDateTime(token.createdAt),
                      }).map(([label, value]) => <tr key={label}><th className='text-left pe-4 text-sm' scope='row'>{label}</th><td className='text-sm'>{value}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <div><Button severity='danger' outlined onClick={() => revoke(token)}><MinusIcon className='w-6' /></Button></div>
              </div>
            ))}
          </div>}
          {activeTab == 'raw' && <pre>{JSON.stringify({ user }, undefined, 2)}</pre>}
        </Card>
      </div>
    </div>
  </>);
}
