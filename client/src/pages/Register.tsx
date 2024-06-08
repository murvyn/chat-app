import { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { updateRegisterInfo, registerInfo, registerError, registerUser, registerLoading } =
    useContext(AuthContext);
  return (
    <>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
                type="email"
                placeholder="Email"
              />
              <Form.Control
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
                type="password"
                placeholder="Password"
              />
              <Button variant="primary" type="submit">
                Register
              </Button>
              {registerLoading ? "Creating your account" : "Register"}
              {registerError && (
                <Alert variant="danger">
                  <p>{registerError}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
