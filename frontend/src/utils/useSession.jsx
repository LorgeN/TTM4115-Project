import React, { createContext, useContext, useState } from "react";
import { CLIENT } from "./useClient";

export const useProviderValue = () => {
  const [inboundTopic, setInboundTopic] = useState(undefined);
  const [outboundTopic, setOutboundTopic] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [team, setTeam] = useState(undefined);
  const [authenticated, setAuthenticated] = useState(false);
  const [scope, setScope] = useState(undefined);

  return {
    client: CLIENT,
    inboundTopic,
    setInboundTopic,
    outboundTopic,
    setOutboundTopic,
    name,
    setName,
    team,
    setTeam,
    authenticated,
    setAuthenticated,
    scope,
    setScope,
  };
};

const SessionContext = createContext();
SessionContext.displayName = "SessionContext";

export const SessionContextProvider = (props) => {
  const value = useProviderValue();
  return <SessionContext.Provider value={value} {...props} />;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be called within a provider!");
  }

  return context;
};
