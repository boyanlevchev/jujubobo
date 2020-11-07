import React, {useState, useEffect, useCallback} from 'react';
import {useAudio} from 'react-use';
import { google, outlook, office365, yahoo, ics } from "calendar-link";
import {appendSpreadsheet, checkSpreadsheet} from './spreadsheet_functions.js';
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


function Content(props) {
  const [mouseIsDown, setMouseIsDown] = useState(false)
  const [ctrIsDown, setCtrIsDown] = useState(false)
  const [sIsDown, setSIsDown] = useState(false)

  const [surpriseEngaged, setSurpriseEngaged] = useState(false)

  const [imgContClass, setImgContClass] = useState("image-container bigger-margin")
  const [pressClass, setPressClass] = useState("press-class")
  const [dateHolderClass, setDateHolderClass] = useState("date-holder")
  const [dateClass, setDateClass] = useState("date")
  const [bothButtonsClass, setBothButtonsClass] = useState("buttons")
  const [ctrlClass, setCtrlClass] = useState("ctrl-btn image")
  const [sClass, setSClass] = useState("s-btn image")
  const [buttonClass, setButtonClass] = useState("std-btn hidden")
  const [contClass, setContClass] = useState("container")
  const [surpriseClass, setSurpriseClass] = useState("hearts hidden")
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

  const [clickDown, downState, downControls] = useAudio({
    src: '/click-down.mp3'
  });
  const [clickUp, upState, upControls] = useAudio({
    src: '/click-up.mp3'
  });

  function handleUp() {
    if (mouseIsDown || ctrIsDown || sIsDown) {
      setSClass("s-btn image");
      setCtrlClass("ctrl-btn image");
      upControls.seek(upState.time = 0);
      upControls.play();
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
    downControls.seek(downState.time = 0);
    downControls.play();
  }

  if (ctrIsDown && sIsDown && !surpriseEngaged) {
    // setImgContClass("image-container");
    setPressClass("hidden")
    setSurpriseClass("hearts");
    setButtonClass("std-btn");

    // setDateHolderClass("date-holder")
    // setDateClass("date black-date");
    setBothButtonsClass("buttons transparent");
    setFormClass("form");
    setSurpriseEngaged(true);

    setImgContClass("image-container");

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
  }




  return(
    <div className={contClass}
         onMouseDown={function(){
          setContClass("container happy-cursor");
         }}
         onMouseUp={function(){handleUp()}}>
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
        {/*<h1 className={pressClass}>Press</h1>*/}
        <div className={dateHolderClass}>
          {[...Array(13)].map((e, i) => {
            return <div key={i} className={`bounce-in-top-${i+1}`}><div className={`${dateClass} vibrate-${i+1}`} style={{backgroundImage: `url("${i+1}.png")`}}></div></div>
          })}
        </div>
        <div className={bothButtonsClass}>
          <div className={ctrlClass}
               onMouseDown={function(){if(!ctrIsDown){handleDown("ctr", true)}}}>
          </div>
          <div className={sClass}
               onMouseDown={function(){if(!sIsDown){handleDown("s", true)}}}>
          </div>
        </div>
        <h1 className={pressClass}>Press both keys - Appuyer sur les deux touches</h1>
      </div>









      <form action="" className={formClass}
          onMouseDown={function(){
            setContClass("container happy-cursor");
          }}
          onSubmit={e => {handleFormSubmit(e)}}
         >
        <label htmlFor="firstname">First Name / Prenom:</label>
        <input type="text" id="firstname" required></input>
        <label htmlFor="lastname">Last Name / Nom:</label>
        <input type="text" id="lastname" required></input>
        <label htmlFor="email">Preferred email address / Adresse email prefere:</label>
        <input type="text" id="email" required></input>

        <label htmlFor="address1">Address Street & house number / Addresse rue & numero:</label>
        <input type="text" id="address1" required></input>
        <label htmlFor="address2">Address line 2 (optional) / Complement d'adresse (optionelle)</label>
        <input type="text" id="address2"></input>
        <label htmlFor="address3">City / ville:</label>
        <input type="text" id="address3" required></input>
        <label htmlFor="address4">Country / pays:</label>
        <input type="text" id="address4" required></input>
        <label htmlFor="address5">zip or post code / code postale:</label>
        <input type="text" id="address5" required></input>
        <input type="submit" value="Confirm!" className={"confirm-button"}></input>
      </form>



      <div className={thankYouClass}>
        <h1>Thank you! Your information has been saved and we will be in touch soon!</h1>
        <h2>Click one of the links below to save the date to your favorite calendar!</h2>
        <div className={"links"}>
          <a href={google(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><FontAwesomeIcon icon={faGoogle}/>Google</a>
          <a href={ics(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><FontAwesomeIcon icon={faApple}/>Apple</a>
          <a href={outlook(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><img src={outlookSVG} className="logo" alt="outlook logo"/>Outlook</a>
          <a href={office365(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><img src={officeSVG} className="logo" alt="office logo"/>Office 365</a>
          <a href={yahoo(event)} target="_blank" rel="noopener noreferrer" className={"linkStyles"}><FontAwesomeIcon icon={faYahoo}/>Yahoo</a>
        </div>
      </div>
    </div>
  );
}

export default Content;
