import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import authService from 'services/AuthService';
import { FrontendSettings } from '@shared/interfaces/config.interface';

const Login = () => {
  const [config, setConfig] = useState<FrontendSettings>();

  useEffect(() => {
    authService
      .getConfig()
      .then((data) => {
        setConfig(data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const redirectToVatsimAuth = () => {
    let authUrl = [
      config?.vatsimAuthUrl,
      '/oauth/authorize',
      '?',
      'client_id=',
      config?.vatsimAuthClientId,
      '&',
      'redirect_uri=',
      window.location.protocol,
      '//',
      window.location.host,
      //'localhost:3000',
      '/api/v1/auth/login',
      '&',
      'response_type=code',
      '&',
      'scope=full_name+vatsim_details+email+country',
      '&',
      'required_scopes=full_name+vatsim_details+email+country',
      '&',
      'approval_prompt=auto',
    ].join('');
    window.location.replace(authUrl);
  };

  const atcFooter = (
    <span>
      <Button
        label='Login with VATSIM SSO'
        className='p-button p-button-success'
        onClick={redirectToVatsimAuth}
      />
    </span>
  );

  return (
    <>
      <div className='flex justify-content-evenly flex-wrap'>
        <div className='flex align-items-center justify-content-center'>
          <Card
            title='vACDM'
            className='login-card text-center surface-200'
            style={{ width: '25rem' }}
            footer={atcFooter}
          ></Card>
        </div>
      </div>
    </>
  );
};

export default Login;
