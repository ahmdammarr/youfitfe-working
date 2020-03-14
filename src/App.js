import React from "react";
import "./App.css";
import Error404 from "./Components/Error404";
import Login from "./Components/Login/Login";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { AUTH_TOKEN } from "./Components/constants";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import User from "./Components/User/User";

const httpLink = createHttpLink({
  uri: "https://youfit-be.herokuapp.com/"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <BrowserRouter>
          <div className="mnav"></div>

          <div className="sheader">
            <Switch>
              <Route path="/" component={Login} exact />
              <Route path="/profile" component={User} exact />
              <Route component={Error404} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

export default App;

/*
function Dogs({ onDogSelected }) {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <select name="dog" onChange={onDogSelected}>
      {data.dogs.map(dog => (
        <option key={dog.id} value={dog.breed}>
          {dog.breed}
        </option>
      ))}
    </select>
  );
}
 */
