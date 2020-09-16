import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { UserSession } from "../context/UserSession";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import FormDiv from "../style/form";
import settings from "../images/settings.png";

const SettingsDiv = styled.div`
  .post {
    width: 150px;
    display: flex;
    font-size: 20px;
    text-align: center;
    margin-left: 20px;
    img {
      margin-left: 25px;
      width: 25%;
    }
  }
`;

const Settings = (props) => {
  const [hobbies, setHobbies] = useState([]);
  const [emailAddress, setEmailAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const session = useContext(UserSession)[0];
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let content = "";

  if (isNaN(session)) {
    props.history.push("/login");
  }

  const postData = (e) => {
    e.preventDefault();
    let data = {
      fieldsOfInterests: String(hobbies).replace(/\s/g, "").split(","),
      username: username,
      profilePicture,
      emailAddress: emailAddress,
    };
    return axios.post(`http://localhost:8080/update-user/${session}`, data).then((res) => {
      props.history.push(`/user/${session}`);
      setShow(false);
    });
  };

  const changeHobbies = (e) => {
    e.preventDefault();
    setHobbies(e.target.value);
  };

  const changeEmailAddress = (e) => {
    e.preventDefault();
    setEmailAddress(e.target.value);
  };

  const changeProfilePicture = (e) => {
    e.preventDefault();
    setProfilePicture(e.target.value);
  };

  const changeUsername = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:8080/user/${session}`).then((res) => {
      setHobbies(res.data.fieldsOfInterests);
      setEmailAddress(res.data.emailAddress);
      setProfilePicture(res.data.profilePicture);
      setUsername(res.data.username);
      setIsLoading(false);
    });
  }, [session]);

  if (!isLoading) {
    content = (
      <SettingsDiv>
        <Button className="post" variant="primary" onClick={handleShow}>
          Settings
          <img src={settings} alt="settings " />
        </Button>
        <Modal className="myModal" show={show} onHide={handleClose}>
          <FormDiv>
            <input className="postText" placeholder="Email Address..." value={emailAddress} onChange={changeEmailAddress}></input>
            <input className="postText" placeholder="Profile Picture link..." value={profilePicture} onChange={changeProfilePicture}></input>
            <input className="postText" placeholder="Username..." value={username} onChange={changeUsername}></input>
            <input type="text" value={String(hobbies)} onChange={changeHobbies} />
            <Button variant="primary" name="submit" className="postButton" onClick={postData}>
              Submit
            </Button>
          </FormDiv>
        </Modal>
      </SettingsDiv>
    );
  } else {
    content = "Loading";
  }
  return content;
};

export default Settings;
