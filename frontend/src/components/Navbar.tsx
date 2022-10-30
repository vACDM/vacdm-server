import AuthContext from "contexts/AuthProvider";
import { Menubar } from "primereact/menubar";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "services/AuthService";
import logo from "../assets/cdm_logo.png";

function Navbar(props: any) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const auth: any = useContext(AuthContext);

  const navItems: {label: string, icon: string, command: Function, permission?: (user: any) => boolean }[] = [
    {
      label: "Delivery",
      icon: "pi pi-fw pi-file",
      command: () => {
        navigate("/");
      },
      permission: (user) => user && (!user.vacdm.banned && user.vacdm.atc)
    },
    {
      label: "Airports",
      icon: "pi pi-fw pi-pencil",
      command: () => {
        navigate("/airports");
      },
      permission: (user) => user && (!user.vacdm.banned && user.vacdm.admin)
    },
    {
      label: "Flow Management",
      icon: "pi pi-fw pi-user",
      command: () => {
        navigate("/flow-management");
      },
      permission: (user) => user && (!user.vacdm.banned && user.vacdm.atc)
    },
    {
      label: "Logout",
      icon:'pi pi-fw pi-power-off',
      command: () => {
        logout();
      },
      permission: (user) => user 
    },
  ];

 useEffect(() => {

  //  if (auth.auth.user !== undefined) {    
    setUser(auth.auth.user)
    setItems(navItems.filter((item) => (item.permission ? item.permission : () => true)(auth.auth.user)))
  //  }
 
   return () => {
     
   }
 }, [auth]) // eslint-disable-line react-hooks/exhaustive-deps
 
  //const name = auth.auth.user.apidata.personal.name_full;
  
  const logout = () => {

    AuthService.logout();

    navigate('/login');
    
  }
  

  const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;
  const end = <div>{!auth.auth.user ? '':  'Logged in as ' + user?.apidata?.personal?.name_full} </div>

  return <Menubar model={items} start={start} end={end}/>;
}

export default Navbar;
