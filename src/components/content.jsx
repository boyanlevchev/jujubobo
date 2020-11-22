import React, {useState, useEffect, useCallback} from 'react';
import useSound from 'use-sound';
import {motion} from 'framer-motion';

import Spinner from '../spinner.svg'

import { google, outlook, office365, yahoo, ics } from "calendar-link";
import {appendSpreadsheet, checkSpreadsheet, scrollToTop} from './spreadsheet_functions.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle, faYahoo  } from '@fortawesome/free-brands-svg-icons';
import outlookSVG from '../outlook.png';
import officeSVG from '../365.png';

function useKeyPress(keys = {}, surpriseEngaged) {
  // State for keeping track of whether key is pressed
  const [ctrPressed, setCtrPressed] = useState(false);
  const [sPressed, setSPressed] = useState(false);
  const [cmdPressed, setCmdPressed] = useState(false);
  const [timeout,setCustomTimeout] = useState();
  const [startTime, setStartTime] = useState();
  const [repeatStart, setRepeatStart] = useState(0);
  const [repeatTime, setRepeatTime] = useState(0);


  const downHandler = useCallback((e) => {
    if (!surpriseEngaged) {
      if (e.keyCode === keys.sKey) {

        e.preventDefault()
        setSPressed(true);

        // This exists to create a fallback, since keyup doesn't get called if combined with Metakey (Mac command key)
        if (e.repeat) {

          repeatStart === 0 ? setRepeatTime(Date.now() - startTime) : setRepeatTime(Date.now() - repeatStart)
          setRepeatStart(Date.now())
          clearTimeout(timeout);
          setCustomTimeout(
            setTimeout(function(){
              setSPressed(false);
              clearTimeout(timeout);
              setRepeatTime(0);
              setRepeatStart(0);
            }, repeatTime + 50)
          );
        } else {
          setStartTime(Date.now())
          clearTimeout(timeout);
          setCustomTimeout(
            setTimeout(function(){
              setSPressed(false);
              clearTimeout(timeout);
              setRepeatTime(0);
              setRepeatStart(0);
            }, 2000)
          );
        }

        return false;
      }
      if (e.keyCode === keys.ctrKey) {
        setCtrPressed(true);
      }
      if (e.keyCode === keys.cmdKey) {
        e.preventDefault();

        setCmdPressed(true);
        return false;
      }
    }
  },[surpriseEngaged])

  // If released key is our target key then set to false
  const upHandler = useCallback((e) => {

    if (e.keyCode === keys.sKey) {
      setSPressed(false);
    }
    if (e.keyCode === keys.ctrKey) {
      setCtrPressed(false);

    }
    if (e.keyCode === keys.cmdKey) {
      setCmdPressed(false);
      if (!sPressed) {
        setSPressed(false);
      }
    }
  },[surpriseEngaged]);

  const cMenuHandler = useCallback((e) => {
    setCtrPressed(false);
    setSPressed(false);
    setCmdPressed(false);
  },[surpriseEngaged]);

  useEffect(() => {
    // If pressed key is our target key then set to true
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    window.addEventListener('contextmenu', cMenuHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
      window.removeEventListener('contextmenu', cMenuHandler);
    };
  }, [cmdPressed, ctrPressed, surpriseEngaged]);

  return {ctrPressed: ctrPressed, sPressed: sPressed, cmdPressed: cmdPressed};
}




const variants = {
  open: { scale: [1, 1, 0.9, 0.7, 0],
          rotate: [0, 0, 180, 1000, 3000],
          borderRadius: ["0", "50%", "50%", "50%", "50%"],
          width: [220, 80, 80, 80, 80]},
  closed: { },
}


function Content(props) {
  const [mouseIsDown, setMouseIsDown] = useState(false)
  const [ctrIsDown, setCtrIsDown] = useState(false)
  const [sIsDown, setSIsDown] = useState(false)

  const [surpriseEngaged, setSurpriseEngaged] = useState(false)

  const [formSubmitted, setFormSubmitted] = useState(false)

  const [imgContClass, setImgContClass] = useState("image-container bigger-margin")
  const [pressClass, setPressClass] = useState("press-class")
  const [dateHolderClass, setDateHolderClass] = useState("date-holder")
  const [dateClass, setDateClass] = useState("date")
  const [bothButtonsClass, setBothButtonsClass] = useState("buttons")
  const [ctrlClass, setCtrlClass] = useState("ctrl-btn image")
  const [sClass, setSClass] = useState("s-btn image")
  const [buttonClass, setButtonClass] = useState("std-btn hidden")
  const [contClass, setContClass] = useState("container")
  const [formClass, setFormClass] = useState("form hidden")
  const [thankYouClass, setThankYouClass] = useState("thank-you hidden")


  const [event] = useState(
    {
      title: "Julie & Boyan's Special Surprise",
      description: 'Keep this weekend free from any other bookings',
      location: 'Secret',
      start: '2021-08-27 18:00:00 0000',
      end: '2021-08-29 13:00:00 0000'
    })

  const keyPress = useKeyPress({sKey: 83, ctrKey: 17, cmdKey: 91}, surpriseEngaged)

  const [clickDown] = useSound(
    '/click-up.mp3',
    { volume: 0.25 }
  );
  const [clickUp] = useSound(
    '/click-down.mp3',
    { volume: 0.25 }
  );

  function handleUp() {
    if (mouseIsDown || ctrIsDown || sIsDown) {
      setSClass("s-btn image");
      setCtrlClass("ctrl-btn image");
      clickUp();
    }
    setMouseIsDown(false);
    setContClass("container");
    setCtrIsDown(false)
    setSIsDown(false);
  }

  function handleDown(key, mouse) {
    if (key === "ctr") {
      setCtrlClass("ctrl-btn image clicked");
      setCtrIsDown(true);
    }
    if (key === "s") {
      setSClass("s-btn image clicked");
      setSIsDown(true);
    }
    if (mouse) {
      setMouseIsDown(true);
    }
    clickDown();
  }

  if (ctrIsDown && sIsDown && !surpriseEngaged) {
    setPressClass("hidden")
    setButtonClass("std-btn");
    setBothButtonsClass("buttons transparent");
    setFormClass("form");
    setSurpriseEngaged(true);

    setImgContClass("image-container");
    scrollToTop();
    setTimeout(function(){
      setBothButtonsClass("hidden");
      setFormClass("form opaqueify");

    }, 400);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const row = {
      "First Name": e.target[0].value,
      "Last Name": e.target[1].value,
      "Email": e.target[2].value,
      "Address Street and Number": e.target[3].value,
      "Address Additional": e.target[4].value,
      "Address City": e.target[5].value,
      "Address Country": e.target[6].value,
      "Address Zip Code": e.target[7].value
    }
    appendSpreadsheet(row, checkSpreadsheet, setThankYouClass, setFormClass);
    setFormSubmitted(true);
  }




  return(
    <div className={contClass}
         onMouseDown={function(){
          setContClass("container happy-cursor");
         }}
         onMouseUp={ e => handleUp()}
         onTouchEnd={ e => {handleUp();}}>
      {clickDown}
      {clickUp}

      {(keyPress.ctrPressed || keyPress.cmdPressed) && !ctrIsDown && !mouseIsDown &&
        handleDown("ctr", false)
      }
      {!(keyPress.ctrPressed || keyPress.cmdPressed) && ctrIsDown && !mouseIsDown &&
        handleUp("ctr", false)
      }
      {keyPress.sPressed && !sIsDown && !mouseIsDown &&
        handleDown("s", false)
      }
      {!keyPress.sPressed && sIsDown && !mouseIsDown &&
        handleUp("s", false)
      }




      <div className={imgContClass}>

        <div className={dateHolderClass}>
          {[...Array(13)].map((e, i) => {
            return <div key={i} className={`bounce-in-top-${i+1}`}><div className={`${dateClass} vibrate-${i+1}`} style={{backgroundImage: `url("${i+1}.png")`}}></div></div>
          })}
        </div>
        <div className={bothButtonsClass}>
          <div className={ctrlClass}
               onTouchStart={ e => {if(!ctrIsDown){handleDown("ctr", true);}}}
               onTouchEnd={ e => e.preventDefault()}
               onMouseDown={ e => {if(!ctrIsDown){handleDown("ctr", true)}}}>
          </div>
          <div className={sClass}
               onTouchStart={ e => {if(!sIsDown){handleDown("s", true);}}}
               onTouchEnd={ e => e.preventDefault()}
               onMouseDown={ e => {if(!sIsDown){handleDown("s", true)}}}>
          </div>
        </div>
        <p className={pressClass}>Press both keys <br/> - <br/>  Appuyer sur les deux touches</p>
      </div>







      <form action="" className={formClass}
          onSubmit={e => {handleFormSubmit(e)}}
         >
        <div>
          <p>Please fill in your details so we can send you an invitation by mail come Spring - this is just a save the date!
          <br/>
          -
          <br/>
          Merci de remplir avec vos informations afin que nous puissions vous envoyer une invitation par courrier au printemps - ceci n’est que pour réservez la date!</p>
        </div>
        <label htmlFor="firstname">First Name / Prenom:</label>
        <input type="text" id="firstname" required></input>
        <label htmlFor="lastname">Last Name / Nom:</label>
        <input type="text" id="lastname" required></input>
        <label htmlFor="email">Preferred email address / Adresse email preferee:</label>
        <input type="text" id="email" required></input>

        <label htmlFor="address1">Address: Street & house number / Rue & numero:</label>
        <input type="text" id="address1" required></input>
        <label htmlFor="address2">Address: line 2 (optional) / Complement d'adresse (optionel):</label>
        <input type="text" id="address2"></input>
        <label htmlFor="address3">City / ville:</label>
        <input type="text" id="address3" required></input>
        <label htmlFor="address4">Country / pays:</label>
        <input type="text" id="address4" required></input>
        <label htmlFor="address5">zip or post code / code postal:</label>
        <input type="text" id="address5" required></input>

        {formSubmitted &&
          <div className={"spinner-div"}>
            <motion.img
              initial={{scale: 0, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{ type: 'spring', bounce: 0.6, duration: 1, delay: 1.5}}
              src={Spinner}
              alt="Loading spinner - wedding!"
              className={"spinner"}/>
          </div>
        }

        <motion.input
          animate={formSubmitted ? "open" : "closed"}
          variants={variants}
          transition={{ duration: 1.5,  ease: [1,.12,1,.9]}}
          type="submit"
          value="Confirm!"
          className={"confirm-button"}>
        </motion.input>

      </form>



      <div className={thankYouClass}>
        <p className={"first-p"}>Thank you! Your information has been saved and we will be in touch soon! <br/><br/>Merci! Votre information a ete enregistree. Nous vous ecrirons bientot!</p>
        <p className={"second-p"}>Click one of the links below to save the date to your favorite calendar!<br/><br/>Choisissez votre calendrier et cliquez sur l'icon en dessous pour y enregistrer la date!</p>
        <div className={"links"}>
          <a href={google(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><FontAwesomeIcon icon={faGoogle}/>Google</a>
          <a href={ics(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><FontAwesomeIcon icon={faApple}/>Apple</a>
          <a href={outlook(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><img src={outlookSVG} className="logo" alt="outlook logo"/>Outlook</a>
          <a href={office365(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><img src={officeSVG} className="logo" alt="office logo"/>Office 365</a>
          <a href={yahoo(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><FontAwesomeIcon icon={faYahoo}/>Yahoo</a>
        </div>
      </div>

      <div className={"footer"}><p>Big thank you to Will Vincent for the drawing and the handwriting! <br/> Grand merci a Will Vincent pour le dessin et son ecriture!</p></div>
    </div>
  );
}

export default Content;
