import AuthContext from "contexts/AuthProvider";
import { Menubar } from "primereact/menubar";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cdm_logo.png";

function Navbar(props: any) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const auth: any = useContext(AuthContext);

  const navItems = [
    {
      label: "Delivery",
      icon: "pi pi-fw pi-file",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Airports",
      icon: "pi pi-fw pi-pencil",
      command: () => {
        navigate("/airports");
      },
    },
    {
      label: "Flow Management",
      icon: "pi pi-fw pi-user",
      command: () => {
        navigate("/flow-management");
      },
    },
    {
      label: "Logout",
      icon:'pi pi-fw pi-power-off',
      command: () => {
        logout();
      },
    },
  ];

 useEffect(() => {

   if (auth.auth.user !== undefined) {
    console.log('auth is there', auth);
    
    setUser(auth.auth.user)
    setItems(navItems)
   }
 
   return () => {
     
   }
 }, [auth]) // eslint-disable-line react-hooks/exhaustive-deps
 
  //const name = auth.auth.user.apidata.personal.name_full;
  
const logout = () => {
  
}
  

  const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;
  const end = <div>{!auth.auth.user ? '':  'Logged in as ' + user?.apidata?.personal?.name_full} </div>

  return <Menubar model={items} start={start} end={end}/>;
}

export default Navbar;
