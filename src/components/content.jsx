import React, {useState, useEffect} from 'react';
import {useAudio} from 'react-use';
import { google, outlook, office365, yahoo, ics } from "calendar-link";
import {appendSpreadsheet, checkSpreadsheet} from './spreadsheet_functions.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle, faYahoo  } from '@fortawesome/free-brands-svg-icons';
import outlookSVG from '../outlook.svg';
import officeSVG from '../365.svg';

function useKeyPress(keys = {}) {
  // State for keeping track of whether key is pressed
  const [ctrPressed, setCtrPressed] = useState(false);
  const [sPressed, setSPressed] = useState(false);
  const [cmdPressed, setCmdPressed] = useState(false);

  let timeout;
  let startTime;
  let repeatStart = 0;
  let repeatTime = 0;
  // If pressed key is our target key then set to true
  function downHandler(e) {
    // console.log(e)
    // console.log(cmdPressed)
    if (e.keyCode === keys.sKey) {
      e.preventDefault()
      setSPressed(true);

      //This exists to create a fallback, since keyup doesn't get called if combined with Metakey (Mac command key)
      if (e.repeat) {
        // console.log("repeating")
        repeatStart === 0 ? repeatTime = (Date.now() - startTime) : repeatTime = Date.now() - repeatStart
        repeatStart = Date.now()
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          setSPressed(false);
          clearTimeout(timeout);
          repeatTime = 0;
          repeatStart = 0;
        }, repeatTime + 50);
      } else {
        startTime = Date.now()
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          setSPressed(false);
          clearTimeout(timeout);
          repeatTime = 0;
          repeatStart = 0;
        }, 2000);
      }

      return false;
    }
    if (e.keyCode === keys.ctrKey) {
      setCtrPressed(true);
    }
    if (e.keyCode === keys.cmdKey) {
      e.preventDefault();
      // console.log("this one")
      setCmdPressed(true);
      // console.log(cmdPressed)
      return false;
    }
  }

  // If released key is our target key then set to false
  function upHandler(e) {
    // console.log("lifted")
    if (e.keyCode === keys.sKey) {
      e.preventDefault()
      setSPressed(false);
      return false;
    }
    if (e.keyCode === keys.ctrKey) {
      setCtrPressed(false);
      // if (!sPressed) {
      //   setSPressed(false);
      // }
    }
    if (e.keyCode === keys.cmdKey) {
      e.preventDefault()
      setCmdPressed(false);
      if (!sPressed) {
        setSPressed(false);
      }
      return false;
    }
  };

  function cMenuHandler(e) {
    setCtrPressed(false);
    setSPressed(false);
    setCmdPressed(false);
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', e => {downHandler(e)});
    window.addEventListener('keyup', e => {upHandler(e)});
    window.addEventListener('contextmenu', e => {cMenuHandler(e)});
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', e => {downHandler(e)});
      window.removeEventListener('keyup', e => {upHandler(e)});
      window.removeEventListener('contextmenu', e => {cMenuHandler(e)});
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return {ctrPressed: ctrPressed, sPressed: sPressed, cmdPressed: cmdPressed};
}


function Content(props) {
  const [mouseIsDown, setMouseIsDown] = useState(false)
  const [ctrIsDown, setCtrIsDown] = useState(false)
  const [sIsDown, setSIsDown] = useState(false)

  const [surpriseEngaged, setSurpriseEngaged] = useState(false)

  const [imgContClass, setImgContClass] = useState("image-container")
  const [pressClass, setPressClass] = useState("")
  const [dateHolderClass, setDateHolderClass] = useState("date-holder hidden")
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

  const keyPress = useKeyPress({sKey: 83, ctrKey: 17, cmdKey: 91})

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
    setDateHolderClass("date-holder")
    setSurpriseEngaged(true);
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

      <div className={surpriseClass}>
        {/*
        <h1 className={"save-the-date"}>Save the date!
        <br/> Seriously!!
        <br/> Do not book anything else or you will regret it!!!

        </h1>*/}
      </div>

      <div className={imgContClass}>
        <h1 className={pressClass}>Press</h1>
        <div className={dateHolderClass}>
          {[...Array(13)].map((e, i) => {
            console.log("loop")
            return <div key={i} className={`bounce-in-top-${i+1}`}><div className={`date vibrate-${i+1}`} style={{backgroundImage: `url("${i+1}.png")`}}></div></div>
          })}
        </div>
        <div className={"buttons"}>
          <div className={ctrlClass}
               onMouseDown={function(){if(!ctrIsDown){handleDown("ctr", true)}}}>
          </div>
          <div className={sClass}
               onMouseDown={function(){if(!sIsDown){handleDown("s", true)}}}>
          </div>
        </div>
          <button className={buttonClass} onClick={ function() {
          setSurpriseClass("hearts hidden");
          setFormClass("form");
        }}>Click here to save</button>
      </div>
      <form action="" className={formClass}
          onMouseDown={function(){
            setContClass("container happy-cursor");
          }}
          onSubmit={e => {handleFormSubmit(e)}}
         >
        <label htmlFor="firstname">First Name:</label>
        <input type="text" id="firstname" required></input>
        <label htmlFor="lastname">Last Name:</label>
        <input type="text" id="lastname" required></input>
        <label htmlFor="email">Preferred email address:</label>
        <input type="text" id="email" required></input>
        <label htmlFor="address1">Mailing Address - street and house number:</label>
        <input type="text" id="address1" required></input>
        <label htmlFor="address2">Mailing Address - additional (optional):</label>
        <input type="text" id="address2"></input>
        <label htmlFor="address3">Mailing Address - city:</label>
        <input type="text" id="address3" required></input>
        <label htmlFor="address4">Mailing Address - country:</label>
        <input type="text" id="address4" required></input>
        <label htmlFor="address5">Mailing Address - zip or post code:</label>
        <input type="text" id="address5" required></input>
        <input type="submit" value="Confirm!" className={"confirm-button"}></input>
      </form>
      <div className={thankYouClass}>
        <h1>Thank you! Your information has been saved!</h1>
        <h2>Click one of the links below to save the date to your calendar of choice!</h2>
        <a href={google(event)} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGoogle}/>Google</a>
        <a href={ics(event)} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faApple}/>Apple</a>
        <a href={outlook(event)} target="_blank" rel="noopener noreferrer"><img src={outlookSVG} className="outlook-logo" alt="outlook logo"/>Outlook</a>
        <a href={office365(event)} target="_blank" rel="noopener noreferrer"><img src={officeSVG} className="office-logo" alt="office logo"/>Office 365</a>
        <a href={yahoo(event)} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYahoo}/>Yahoo</a>
      </div>
    </div>
  );
}

export default Content;
