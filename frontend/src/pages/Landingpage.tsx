import { Button } from 'primereact/button';
import logo from '../assets/cdm_logo.png';
import cdm1 from '../assets/cdm1.png';
import Container from '../components/Container';
import FeatureBox from '../components/FeatureBox';
import React, { useEffect } from 'react';
import Typed from 'typed.js';

const Landingpage = () => {
  const el = React.useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['good departure flow', 'considering departure intervals from ECFMP', 'event and booking slot adherence'],
      typeSpeed: 50,
      loop: true
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  
  return (
    <>
      <div>
        <Container className="w-full mx-auto text-center flex flex-col justify-center">
          <h1 className="md:text-8xl sm:text-6xl text-xl font-bold md:py-6">
            vACDM
          </h1>
          <h1 className="md:text-6xl sm:text-6xl text-xl font-bold md:py-6">
            virtual Airport Collaborative Decision Making
          </h1>
          <div className='md:flex justify-center items-center pb-6'>
            <p className='md:text-xl'>
            A VATSIM Tool for
            </p> 
           <span className='md:text-xl pl-2 font-bold' ref={el}> </span>
          </div>

          <div>
            <img className="mx-auto" src={cdm1} alt="" />
          </div>
        </Container>
        {/* mx-auto flex flex-wrap justify-evenly */}
        <Container className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 pt-6">
          <FeatureBox
            headline="Including ECFMP Measures"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            }
          >
            vACDM supports MDI measures from ECFMP and calculates CTOT's
            accordingly.
          </FeatureBox>
          <FeatureBox
            headline="Individual Taxi times"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
            }
          >
            vACDM woks with geographic taxi zones that let you set taxi times individually depending on parking position and runway.
          </FeatureBox>
          <FeatureBox
            headline="Customizable for your vACC"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            }
          >
            vACDM supports MDI measures from ECFMP and calculates CTOT's
            accordingly
          </FeatureBox>
          <FeatureBox
            headline="Customizable for your vACC"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            }
          >
            vACDM supports MDI measures from ECFMP and calculates CTOT's
            accordingly
          </FeatureBox>
          <FeatureBox
            headline="Customizable for your vACC"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            }
          >
            vACDM supports MDI measures from ECFMP and calculates CTOT's
            accordingly
          </FeatureBox>
          <FeatureBox
            headline="Customizable for your vACC"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            }
          >
            vACDM supports MDI measures from ECFMP and calculates CTOT's
            accordingly
          </FeatureBox>
        </Container>
        <Container>

        </Container>
      </div>
    </>
  );
};

export default Landingpage;
