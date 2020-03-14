import React, { useState } from "react";
import { AUTH_TOKEN } from "../constants";
import { graphql, Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const authToken = localStorage.getItem(AUTH_TOKEN);
let name = localStorage.getItem("Username");
const me = gql`
  query me {
    me {
      firstName
      lasttName
      email
      mobileOne
      mobileTwo
      City
      address
    }
  }
`;

const User = props => {
  const _confirm = async data => {
    const { firstName } = data.updateUser.firstName;
    _saveUserData(firstName);
    props.history.push(`/`);
    console.log("_confirm");
  };

  const _saveUserData = async firstName => {
    localStorage.removeItem("Username");
    localStorage.setItem("Username", firstName);
  };

  return (
    <div className="container-fluid profile">
      <div className="flex flex-fixed">
        {authToken ? (
          <div className="container">
            <div className="row">
              <div className="col-10">
                <h4>Hello, {name}</h4>
              </div>

              <div className="col-2">
                <button
                  className="btn"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN);
                    window.location.reload(false);
                    //props.history.push(`/`);
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
            <hr />
            <div class="container">
              <div className="row">
                <div className="col-9">
                  <h6>Under Construction</h6>
                  <ul class="list-group">
                    <li class="list-group-item">
                      <strong>First Name</strong> {}
                    </li>
                    <li class="list-group-item">
                      <strong>Last Name</strong> {}
                    </li>
                    <li class="list-group-item">
                      <strong>Mobile Number</strong> {}
                    </li>
                  </ul>
                </div>
                <div className="col-3" />
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-3" />
              <div class="col-6">
                <Link className="btn btn-light" to="/">
                  Log-in
                </Link>
              </div>
              <div className="col-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default graphql(me)(User);
/**
 *
 *
 */
