import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const Login = () => {
  const redirectToVatsimAuth = () => {
    let authUrl = [
      'https://auth-dev.vatsim.net/oauth/authorize',
      '?',
      'client_id=424',
      '&',
      'redirect_uri=',
      window.location.protocol,
      '//',
      //window.location.host,
      'localhost:3000',
      '/api/v1/auth/login',
      '&',
      'response_type=code',
      '&',
      'scope=full_name+vatsim_details+email+country',
      '&',
      'approval_prompt=auto'
    ].join('');
    window.location.replace(authUrl);
  };

  const footer = (
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
      <Card
        title='vACDM'
        className='login-card text-center surface-200'
        style={{ width: '25rem' }}
        footer={footer}></Card>
    </>
  );
};

export default Login;
