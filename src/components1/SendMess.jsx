import React, { useRef, useState, useContext } from "react";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import { UserContext } from "../App";
import firebase from '../metro.config';
import ReactJsAlert from "reactjs-alert";
import { arrayUnion, Timestamp } from "firebase/firestore";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import { useI18n } from "../Context/I18nContext";

export default function SendMess() {
  var dt = Timestamp.fromDate(new Date());

  function ajouter() {
    const washingtonRef = firebase.firestore().collection("BiblioUser").doc(email);
    washingtonRef.update({
      messages: arrayUnion({ "recue": "R", "texte": message, "heure": dt })
    });
  }

  const res = async function () {
    await firebase.firestore().collection('MessagesRecue').doc(message).set({
      email: email,
      messages: message
    });
    setStatus(true);
    setType("success");
    setTitle(translations.message_sent);
    setNom("");
    setMessage(translations.enter_message);
    setEmail(translations.enter_email);
    setObjet(translations.enter_subject);
    ajouter();
  };

  const [status, setStatus] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");

  const [objet, setObjet] = useState('');
  const [message, setMessage] = useState('');
  const formRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  const { email, setEmail, nom, setNom } = useContext(UserContext);
  const { language } = useI18n();

  const translations = {
    enter_user_email: language === "FR" ? "Entrer l'email de l'utilisateur" : "Enter user email",
    enter_subject: language === "FR" ? "Entrer l'objet" : "Enter subject",
    enter_message: language === "FR" ? "Entrer le message" : "Enter message",
    send: language === "FR" ? "Envoyer" : "Send",
    message_sent: language === "FR" ? "Message envoyé avec succès" : "Message sent successfully",
    enter_email: language === "FR" ? "Entrer l'email" : "Enter email",
    new_message: language === "FR" ? "Nouveau Message" : "New Message",
  };

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-gradient-primary  py-3">
                <h5 className="mb-0">{translations.new_message}</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Form ref={formRef} onSubmit={handleSubmit}>
                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group controlId='formBasicEmail'>
                        <Form.Label className="text-muted fw-bold small">{translations.enter_user_email}</Form.Label>
                        <Form.Control
                          className="rounded-pill border-light bg-light"
                          type="email"
                          placeholder="email@example.com"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group controlId='formBasicSubject'>
                        <Form.Label className="text-muted fw-bold small">{translations.enter_subject}</Form.Label>
                        <Form.Control
                          className="rounded-pill border-light bg-light"
                          type="text"
                          placeholder={translations.enter_subject}
                          name="subject"
                          value={objet}
                          onChange={(e) => setObjet(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className='mb-4' controlId='formBasicMessage'>
                    <Form.Label className="text-muted fw-bold small">{translations.enter_message}</Form.Label>
                    <textarea
                      className="form-control bg-light border-light rounded"
                      rows="6"
                      placeholder={translations.enter_message}
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ resize: "none" }}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <button
                      type='button'
                      onClick={res}
                      className="btn px-4 py-2 rounded-pill shadow-sm"
                      style={{
                        background: 'linear-gradient(45deg, #db991d, #e6b54a)',
                        color: 'white',
                        border: 'none',
                        fontWeight: "500",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {translations.send}
                    </button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <ReactJsAlert
        status={status}
        type={type}
        title={title}
        quotes={true}
        quote=""
        Close={() => setStatus(false)}
      />
    </div>
  );
}