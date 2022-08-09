import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cdm_logo.png";

function Navbar(props: any) {
  const navigate = useNavigate();

  const items = [
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
  ];

  const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;

  return <Menubar model={items} start={start} />;
}

export default Navbar;
