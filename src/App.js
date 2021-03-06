import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import ScrollBasedBezier from './components/ScrollBasedBezier';
import fancyPlants from './fancy-plants.webp';
import pottedPlant from './potted-plant.webp';

const RecaptchaComponent = lazy(() => import('react-recaptcha'));

const Header = styled.header`
  height: 70vh;
  min-height: 500px;
  display: flex;
  justify-content: center;
  background: linear-gradient(120deg, #bb3139b8 0%, #ffced600 100%);
  color: #fff;
  text-align: center;
  padding-top: 200px;
  box-sizing: border-box;
  position: relative;

  &:before {
    content: '';
    background: url("${fancyPlants}") no-repeat right;
    background-size: contain;
    position: absolute;
    width: 550px;
    top: 0;
    bottom: 0;
    right: 0;
  }

  h1 {
    color: #fff;
    z-index: 1;
  }
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 10px 100px;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  margin: 20px 0;

  .captcha {
    margin-top: 100px;

    > div#g-recaptcha > div {
      margin: 0 auto;
    }
  }
`;

const TextSection = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: 0 -10px;
`;

const TextBox = styled.div`
  color: ${(props) => (props.active ? '#1d77cf' : '#000')};
  flex-grow: 1;
  margin: 10px;
  position: relative;
  height: 70px;

  svg {
    display: ${(props) => (props.error && !props.active ? 'block' : 'none')};
    position: absolute;
    right: 10px;
    top: 13px;

    path {
      fill: red;
    }
  }
`;

const TextLabel = styled.label`
  // font-size: ${(props) => (props.active ? '10px' : '12px')};
  font-size: 10px;
  font-weight: 500;
  text-transform: lowercase;
  letter-spacing: 0.6px;
  position: absolute;
  width: 100%;
  // bottom: ${(props) => (props.active ? '75px' : '43px')};
  bottom: 75px;
  // left: ${(props) => (props.active ? '0' : '10px')};
  left: 0;
  text-align: left;
  cursor: text;
  transition: 0.2s;
`;

const TextField = styled.input`
  border: ${(props) => (props.error ? '2px solid red' : '2px solid #9c9c9e')};
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  outline: 0;

  &:focus {
    border: 2px solid #1d77cf;
  }
`;

const MessageBox = styled.div`
  margin: 20px -10px;
  display: flex;

  > div {
    margin: 0 10px;
    flex-grow: 1;
  }
`;

const TextArea = styled.textarea`
  border: ${(props) => (props.error ? '2px solid red' : '2px solid #9c9c9e')};
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  outline: 0;
  height: 100px;
  resize: none;

  &:focus {
    border: 2px solid #1d77cf;
  }
`;

const Button = styled.button`
  color: ${(props) => (props.disabled ? 'rgba(0, 0, 0, 0.26)' : '#fff')};
  background: ${(props) =>
    props.disabled ? 'rgba(0, 0, 0, 0.12)' : '#032b2f'};
  border: 0;
  border-radius: 2px;
  margin-top: 50px;
  padding: 10px 20px;
  font-weight: bold;
  transition: 0.2s ease;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

const ConnectSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5em;

  a:hover {
    div {
      background-color: blue;
    }

    svg#github path {
      fill: blue;
    }
  }

  div {
    background-color: #ff3e49;
    border-radius: 100px;
    height: 40px;
    width: 40px;
    margin: 10px;

    svg {
      height: 20px;
      width: 21px !important;
      margin: 10px;

      path {
        fill: #fff;
      }
    }
  }

  svg {
    height: 40px;
    width: 40px !important;
    margin: 10px;

    path {
      fill: #ff3e49;
    }
  }
`;

const renderLoader = () => <p>Loading...</p>;

const validateEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validationObj() {
  this.dirty = false;
  this.valid = true;
  this.focus = false;
  this.value = null;
}

function App() {
  let tempErr = {
    name: new validationObj(),
    email: new validationObj(),
    message: new validationObj(),
  };

  const [error, setError] = useState(tempErr);
  const [recaptcha, setRecaptcha] = useState(null);

  useEffect(() => {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
  }, []);

  function onFocus(e) {
    const name = e.target.name;
    const validationObj = Object.assign({}, error);

    validationObj[name].focus = true;

    setError(validationObj);
  }

  function onBlur(e) {
    const name = e.target.name;
    const validationObj = Object.assign({}, error);

    validationObj[name].focus = false;

    setError(validationObj);
  }

  function handleValidation(e) {
    const name = e.target.name;
    const value = e.target.value;
    const validationObj = Object.assign({}, error);

    validationObj[name].dirty = true;
    validationObj[name].value = value === '' ? null : value;

    if (name === 'email') {
      validationObj[name].valid = validateEmail.test(value);
    } else {
      validationObj[name].valid = value !== '';
    }

    setError(validationObj);
  }

  function verifyCallback(response) {
    setRecaptcha(response);
  }

  function callback() {
    console.log('Recaptcha loaded!');
  }

  return (
    <>
      <Header>
        <h1>oh hello,</h1>

        <ScrollBasedBezier
          fill="#cc2e37"
          startInterpolateY={100}
          firstControlPointX={500}
          firstInterpolateY={-200}
          secondControlPointX={600}
          secondInterpolateY={500}
          endpointX={1300}
        />
        <ScrollBasedBezier />
      </Header>

      <Content>
        <h1>i'm kathy.</h1>
        <br />
        <br />
        <br />
        <h2>
          i'm a software engineer based in the south bay area. i enjoy working
          with react on the front end. also important, i have a dog; her name is
          pim.
        </h2>

        <h3>
          <img src={pottedPlant} className="menu__icon" alt="icon menu" />
          experience
        </h3>
        <div>
          <div>Intuit</div>
          <div>2020 – present</div>
        </div>
        <br />
        <div>
          <div>Doctor.com</div>
          <div>2017 – 2020</div>
        </div>

        <h3>
          <img src={pottedPlant} className="menu__icon" alt="icon menu" />
          other work
        </h3>
        <div>
          <a
            href="https://twohalfhitches.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Two Half-Hitches
          </a>
        </div>
        <br />
        <div>
          <a
            href="https://murakami-wedding.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Murakami Wedding
          </a>
        </div>

        <h3>
          <img src={pottedPlant} className="menu__icon" alt="icon menu" />
          get in touch
        </h3>

        <Form
          name="contact"
          method="POST"
          action="/success"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="contact" />
          <TextSection>
            <TextBox active={error.name.focus} error={!error.name.valid}>
              <TextLabel
                htmlFor="name"
                active={error.name.focus || !!error.name.value}
              >
                Name
              </TextLabel>
              <TextField
                id="name"
                name="name"
                type="text"
                onChange={handleValidation}
                error={!error.name.valid}
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </TextBox>
            <TextBox active={error.email.focus} error={!error.email.valid}>
              <TextLabel
                htmlFor="email"
                active={error.email.focus || !!error.email.value}
              >
                Email
              </TextLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                onChange={handleValidation}
                error={!error.email.valid}
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </TextBox>
          </TextSection>

          <MessageBox>
            <TextBox active={error.message.focus} error={!error.message.valid}>
              <TextLabel
                htmlFor="message"
                active={error.message.focus || !!error.message.value}
              >
                Message
              </TextLabel>
              <TextArea
                id="message"
                name="message"
                label="Message"
                error={!error.message.valid}
                onChange={handleValidation}
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </TextBox>
          </MessageBox>

          {process.env.NODE_ENV === 'production' ? (
            <Suspense fallback={renderLoader()}>
              <div className="captcha">
                <RecaptchaComponent
                  sitekey={process.env.REACT_APP_SITE_RECAPTCHA_KEY}
                  render="explicit"
                  verifyCallback={verifyCallback}
                  onloadCallback={callback}
                  badge="inline"
                />
              </div>{' '}
            </Suspense>
          ) : (
            ''
          )}

          <Button type="submit" disabled={!!recaptcha}>
            send
          </Button>
        </Form>

        <ConnectSection>
          <a
            href="https://www.linkedin.com/in/kathy-luu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <div>
              <FontAwesomeIcon icon={faLinkedinIn} />
            </div>
          </a>
          <a
            href="https://github.com/k3luu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Github"
          >
            <FontAwesomeIcon id="github" icon={faGithub} />
          </a>
        </ConnectSection>
      </Content>
    </>
  );
}

export default App;
