import React, { useState } from "react";
import { AUTH_TOKEN } from "../constants";
import { Mutation, graphql } from "react-apollo";
import gql from "graphql-tag";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const cities_q = gql`
  {
    cities {
      id
      name
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signup(
    $email: String!
    $password: String!
    $firstName: String!
    $lasttName: String!
    $mobileOne: String!
    $mobileTwo: String
    $City: String!
    $address: String!
  ) {
    signup(
      email: $email
      password: $password
      firstName: $firstName
      lasttName: $lasttName
      mobileOne: $mobileOne
      mobileTwo: $mobileTwo
      City: $City
      address: $address
    ) {
      token
      user {
        firstName
        lasttName
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        firstName
        lasttName
      }
    }
  }
`;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lasttName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  confirmpassword: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .test("passwords-match", "Passwords must match ya fool", function(value) {
      return this.parent.password === value;
    }),
  mobileOne: Yup.string()
    .min(11, "Too Short!")
    .max(12, "Too Long!")
    .required("Required"),
  confirmmobileOne: Yup.string()
    .min(11, "Too Short!")
    .max(12, "Too Long!")
    .required("Required")
    .test("passwords-match", "Mobile number must match ya fool", function(
      value
    ) {
      return this.parent.mobileOne === value;
    }),
  mobileTwo: Yup.string()
    .min(11, "Too Short!")
    .max(12, "Too Long!"),
  confirmmobileTwo: Yup.string()
    .min(11, "Too Short!")
    .max(12, "Too Long!")
    .test("passwords-match", "Mobile number must match ya fool", function(
      value
    ) {
      return this.parent.mobileTwo === value;
    }),
  City: Yup.string().required("City is required!"),
  address: Yup.string()
    .min(10, "Too Short!")
    .required("Required")
});
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
});

const Login = props => {
  const [login, setlogin] = useState(true);
  console.log("City", props.data);
  const _confirm = async data => {
    const { token } = login ? data.login : data.signup;
    const { firstName } = login ? data.login.user : data.signup.user;
    _saveUserData(token, firstName);
    props.history.push(`/profile`);
  };

  const _saveUserData = (token, firstName) => {
    localStorage.setItem(AUTH_TOKEN, token);
    localStorage.setItem("Username", firstName);
  };

  return (
    <div className="container">
      {login ? (
        <div className="form-signin">
          <Mutation
            mutation={LOGIN_MUTATION}
            onCompleted={async data => {
              await _confirm(data);
              window.location.reload(false);
            }}
          >
            {(login, loading) => (
              <Formik
                initialValues={{
                  email: "",
                  password: ""
                }}
                validationSchema={loginSchema}
                onSubmit={values => {
                  console.log("values", values);
                  login(
                    {
                      variables: {
                        email: values.email,
                        password: values.password
                      }
                    },

                    console.log("login accessed")
                  );
                }}
              >
                {({ errors, touched }) => (
                  <Form className="flex flex-column">
                    <div class="text-center mb-4">
                      <h1 class="h3 mb-3 font-weight-normal">Login</h1>
                      <p>
                        Join <code>youFit</code> Community
                      </p>
                    </div>
                    <div class="form-label-group">
                      <label>Email address</label>
                      <Field name="email" type="email" class="form-control" />
                      {errors.email && touched.email ? (
                        <div>{errors.email}</div>
                      ) : null}
                    </div>
                    <div class="form-label-group">
                      <label>Password</label>
                      <Field
                        name="password"
                        type="password"
                        class="form-control"
                        placeholder="Choose a safe password"
                      />
                      {errors.password && touched.password ? (
                        <div>{errors.password}</div>
                      ) : null}
                      <div className="card-footer-item card-footer-item-bordered">
                        <a href="./" className="footer-link">
                          Forgot Password
                        </a>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary btn-block btn-mrgn"
                    >
                      Login
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </Mutation>

          <div>
            <div onClick={() => setlogin(!login)}>
              <button className="btn btn-lg btn-primary btn-block btn-create-acount">
                {" "}
                Create An Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div class="container signup">
          <Mutation
            mutation={SIGNUP_MUTATION}
            onCompleted={async data => {
              await _confirm(data);
              window.location.reload(false);
            }}
          >
            {(signup, loading) => (
              <Formik
                initialValues={{
                  firstName: "",
                  lasttName: "",
                  email: "",
                  password: "",
                  confirmpassword: "",
                  mobileOne: "",
                  confirmmobileOne: "",
                  mobileTwo: "",
                  confirmmobileTwo: "",
                  City: "",
                  address: ""
                }}
                validationSchema={SignupSchema}
                onSubmit={values => {
                  console.log("values", values);
                  signup(
                    {
                      variables: {
                        firstName: values.firstName,
                        lasttName: values.lasttName,
                        email: values.email,
                        password: values.password,
                        mobileOne: values.mobileOne,
                        mobileTwo: values.mobileTwo,
                        City: values.City,
                        address: values.address
                      }
                    },

                    console.log("Signup accessed")
                  );
                }}
              >
                {({ errors, touched }) => (
                  <Form className="flex flex-column">
                    <div class="text-center mb-4">
                      <h1 class="h3 mb-3 font-weight-normal">Login</h1>
                      <p>
                        Join <code>youFit</code> Community
                      </p>
                    </div>
                    <div class="form-label-group form-row">
                      <div className="col-6">
                        <label>First Name</label>
                        <Field
                          name="firstName"
                          type="text"
                          class="form-control"
                        />
                        {errors.firstName && touched.firstName ? (
                          <div>{errors.firstName}</div>
                        ) : null}
                      </div>
                      <div className="col-6">
                        <label>Last Name</label>
                        <Field
                          name="lasttName"
                          type="text"
                          class="form-control"
                        />
                        {errors.lasttName && touched.lasttName ? (
                          <div>{errors.lasttName}</div>
                        ) : null}
                      </div>
                    </div>

                    <div class="form-label-group form-row">
                      <div className="col-6">
                        <label>Email address</label>
                        <Field name="email" type="email" class="form-control" />
                        {errors.email && touched.email ? (
                          <div>{errors.email}</div>
                        ) : null}
                      </div>
                      <div class="col-3">
                        <label>Password</label>
                        <Field
                          name="password"
                          type="password"
                          class="form-control"
                          placeholder="Choose a safe password"
                        />
                        {errors.password && touched.password ? (
                          <div>{errors.password}</div>
                        ) : null}
                      </div>
                      <div class="col-3">
                        <label>Confirm Password</label>
                        <Field
                          name="confirmpassword"
                          type="password"
                          class="form-control"
                          placeholder="Confirm your password"
                        />
                        {errors.confirmpassword && touched.confirmpassword ? (
                          <div>{errors.confirmpassword}</div>
                        ) : null}
                      </div>
                    </div>

                    <div class="form-label-group form-row">
                      <div class="col">
                        <label>Mobile Number 1</label>
                        <Field
                          name="mobileOne"
                          type="text"
                          class="form-control"
                          placeholder="Write your number"
                        />
                        {errors.mobileOne && touched.mobileOne ? (
                          <div>{errors.mobileOne}</div>
                        ) : null}
                      </div>
                      <div class="col">
                        <label>Confirm Number</label>
                        <Field
                          name="confirmmobileOne"
                          type="text"
                          class="form-control"
                          placeholder="Confirm your Number"
                        />
                        {errors.confirmmobileOne && touched.confirmmobileOne ? (
                          <div>{errors.confirmmobileOne}</div>
                        ) : null}
                      </div>
                      <div class="col">
                        <label>Mobile Number 2</label>
                        <Field
                          name="mobileTwo"
                          type="text"
                          class="form-control"
                          placeholder="Optional"
                        />
                        {errors.mobileTwo && touched.mobileTwo ? (
                          <div>{errors.mobileTwo}</div>
                        ) : null}
                      </div>
                      <div class="col">
                        <label>Confirm Number</label>
                        <Field
                          name="confirmmobileTwo"
                          type="text"
                          class="form-control"
                          placeholder="Optional"
                        />
                        {errors.confirmmobileTwo && touched.confirmmobileTwo ? (
                          <div>{errors.confirmmobileTwo}</div>
                        ) : null}
                      </div>
                    </div>
                    <div class="form-label-group form-row">
                      <div className="col-6">
                        <label>City </label>
                        <Field
                          component="select"
                          name="City"
                          value="Select a City"
                        >
                          <option
                            value="Select a City"
                            label="Select a City"
                            disabled
                          />
                          <option value="Cairo">Cairo</option>
                          <option value="Alex">Alex</option>
                        </Field>
                        {errors.City && touched.City ? (
                          <p>{errors.City}</p>
                        ) : null}
                      </div>
                      <div class="col">
                        <label>address</label>
                        <Field
                          name="address"
                          type="Required"
                          class="form-control"
                          placeholder="Write Deleivey address"
                        />
                        {errors.address && touched.address ? (
                          <div>{errors.address}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col">
                        <button
                          type="submit"
                          className="btn btn-lg btn-primary btn-block btn-mrgn"
                        >
                          Create Account
                        </button>
                      </div>
                      <div className="col">
                        <div onClick={() => setlogin(!login)}>
                          <button className="btn btn-lg btn-primary btn-block btn-mrgn">
                            {" "}
                            Already Have An Account
                          </button>
                        </div>
                      </div>
                      <div className="col-1"></div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </Mutation>
        </div>
      )}
    </div>
  );
};

export default graphql(cities_q)(Login);
