import { useEffect, useState } from "react";
import MetaService from "services/MetaService";

const Footer = () => {
  const [version, setVersion] = useState<any>([]);

  useEffect(() => {
    MetaService.getVersion().then((data) => {
      setVersion(data);
    });
  }, []);

  return (
    <>
      <div className="footer">
        VATSIM Airport Collaboration Decision Making Version {version.version}
      </div>
    </>
  );
};

export default Footer;
