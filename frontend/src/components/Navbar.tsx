import AuthContext from 'contexts/AuthProvider';
import { Menubar } from 'primereact/menubar';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from 'services/AuthService';
import logo from '../assets/cdm_logo.png';
import { FrontendSettings } from '@shared/interfaces/config.interface';

function Navbar(props: any) {
  const [config, setConfig] = useState<FrontendSettings>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const auth: any = useContext(AuthContext);

  const navItems: { label: string; icon: string; command: Function; permission?: (user: any) => boolean }[] = [
    {
      label: 'Delivery',
      icon: 'pi pi-fw pi-file',
      command: () => {
        navigate('/atc');
      },
      permission: (user) => user && !user.vacdm.banned && user.vacdm.atc,
    },
    {
      label: 'Airports',
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        navigate('/airports');
      },
      permission: (user) => user && !user.vacdm.banned && user.vacdm.admin,
    },
    {
      label: 'Flow Management',
      icon: 'pi pi-fw pi-user',
      command: () => {
        navigate('/flow-management');
      },
      permission: (user) => user && !user.vacdm.banned && user.vacdm.atc,
    },
    {
      label: 'VDGS',
      icon: 'pi pi-fw pi-user',
      command: () => {
        navigate('/vdgs');
      },
      permission: (user) => user,
    },
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        logout();
      },
      permission: (user) => user,
    },
  ];

  useEffect(() => {
    //  if (auth.auth.user !== undefined) {
    setUser(auth.auth.user);
    setItems(navItems.filter((item) => (item.permission ? item.permission : () => true)(auth.auth.user)));
    //  }
    AuthService.getConfig()
      .then((data) => {
        setConfig(data);
      })
      .catch((e) => {
        console.error(e);
      });
    return () => {};
  }, [auth]); // eslint-disable-line react-hooks/exhaustive-deps

  //const name = auth.auth.user.apidata.personal.name_full;

  async function logout() {
    await AuthService.logout();

    window.location.reload();
  }

  const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;
  const end = (
    <div className="flex gap-3 align-items-center">
      <div>{!auth.auth.user ? '' : 'Logged in as ' + user?.apidata?.personal?.name_full} </div>
      {config?.vaccLogoUrl && <img alt="vacc-logo" src={config?.vaccLogoUrl} height="40" />}
    </div>
  );

  return <Menubar model={items} start={start} end={end} />;
}

export default Navbar;
