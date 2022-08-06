import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cdm_logo.png'




function Navbar(props: any) {
  const navigate = useNavigate();

  const items = [
    {
       label:'Delivery',
       icon:'pi pi-fw pi-file',
       command: () => {navigate('/') }

    },
    {
       label:'Airports',
       icon:'pi pi-fw pi-pencil',
       command: () => {navigate('/airports') }
 
    },
    {
       label:'Flow Management',
       icon:'pi pi-fw pi-user',
       command: () => {navigate('/flow-management') }
    }
  ];


  const redirectToVatsimAuth = () => {
   let authUrl = [
      'https://auth-dev.vatsim.net/oauth/authorize',
      '?',
      'client_id=424',
      '&',
      'redirect_uri=',
      'http://localhost:3030/api/v1/auth/login',
      '&',
      'response_type=code',
      '&',
      'scope=full_name+vatsim_details+email+country',
    ].join('');
    window.location.replace(authUrl);
  }

  const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;
  const end = <Button label="Login with VATSIM SSO" className="p-button-outlined p-button-success" onClick={redirectToVatsimAuth} />;

    return <Menubar model={items} start={start} end={end} />;
  }

  export default Navbar