import { useEffect, useState } from 'react';

import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import authService from '../services/AuthService';

import { FrontendSettings } from '@/shared/interfaces/config.interface';

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
    const authUrl = [
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
      'scope=full_name+vatsim_details',
      '&',
      'required_scopes=full_name+vatsim_details',
      '&',
      'approval_prompt=auto',
    ].join('');
    window.location.replace(authUrl);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-column gap-3 align-items-center justify-content-center mx-auto top-0 right-0 left-0">
          <Card
            title="vACDM"
            className="text-center min-w-[25rem] "
          >
            <Button
            onClick={() => redirectToVatsimAuth()}
            >Login with VATSIM SSO</Button>
            <p>
              {config?.vaccImprintUrl && (
                <a className="text-gray-500" href={config?.vaccImprintUrl}>
                  Imprint
                </a>
              )}
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
