import "./App.css";
import { Jetton } from "./components/Jetton";
import styled from "styled-components";
import { BalanceButton, ContainerCenter, ContainerRight, FlexBoxCol, FlexBoxRow, NetButton } from "./components/styled/styled";
import { CHAIN, TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "./hooks/useTonConnect";
import "@twa-dev/sdk"
import { useEffect, useState } from "react";
import { useTonClient } from "./hooks/useTonClient";
import { Address, fromNano } from "ton-core";
import axios from "axios";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export const AppContainer = styled.div`
  max-width: 1080px;
  margin: -1500 auto;
  border-radius: 8px;
`;

function App() {
    let {network} = useTonConnect();
  
    const [balancewallet, setBalance] = useState("Loadiiing.....");
    const {wallet} = useTonConnect();
    const {client} = useTonClient();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для отслеживания входа пользователя

    useEffect(() => {
      const fetchData = async () => {
        try {
          const add = wallet ? Address.parse(wallet as string) : null;
          if (add) {
            let v = await client?.getBalance(add);
            if(v!=undefined){
              setBalance(fromNano(v).toString());
              setIsLoggedIn(true); 
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [client, wallet]);

const postDataToDatabase = async () => {
  try {
    let mge = wallet ? Address.parse(wallet as string).toString() : "Я не успел(("; 
    sleep(1000);

      const response = await axios.post("/buckend/create_user", {
        address: mge
      });
      console.log(response.data);
  } catch (error) {
    console.error("Error sending message: ", error);
  }
  };
      useEffect(() => {
        if (isLoggedIn && network && wallet) {
            postDataToDatabase();
        }
    }, [isLoggedIn, network, wallet]);

  return (
    <StyledApp>
      <AppContainer>
        <FlexBoxCol>
          <FlexBoxRow>
            <TonConnectButton/>
            <ContainerCenter>
              <NetButton>
              {network
              ? network === CHAIN.MAINNET
              ? "mainet"
              : "testnet"
              : "N/S"}
              </NetButton>
            </ContainerCenter>
            <ContainerRight>
              <BalanceButton>
              {balancewallet.slice(0,5) + " TON" }
              </BalanceButton>
            </ContainerRight>
          </FlexBoxRow>
          <Jetton />
        </FlexBoxCol>
      </AppContainer> 
    </StyledApp>
  );
  
}

export default App;