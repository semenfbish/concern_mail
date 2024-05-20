import { Address } from "ton-core";
import { useTonConnect } from "../hooks/useTonConnect";
import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  InputAddr,
  InputMess,
  CardNewMess,
  ContainerCenter,
  TextContent,} 
from "./styled/styled";
import { useTonClient } from "../hooks/useTonClient";
import { useEffect, useState } from "react";
import { fromNano } from "@ton/ton";
import axios from "axios";
import { Pisma } from "./Pisma";
// Функция для генерации ключа
function generateKeyg(): string {
  // Создаем массив байтов длиной 12 (96 бит)
  const buffer = new Uint8Array(12);
  // Заполняем массив случайными значениями
  window.crypto.getRandomValues(buffer);
  // Конвертируем Uint8Array в стандартный массив чисел
  const byteArray = Array.from(buffer);
  // Кодируем байты в base64 и возвращаем
  return btoa(String.fromCharCode.apply(null, byteArray));
}
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
export function Jetton() {
  const [balancewallet, setBalance] = useState("Loadiiing....");
  const {wallet} = useTonConnect()
  const {client} = useTonClient()

  const {connected} = useTonConnect()
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const add = wallet ? Address.parse(wallet as string) : null;
        if (add) {
          let v = await client?.getBalance(add);
          if(v!=undefined){
            console.log(balancewallet);
          setBalance(fromNano(v).toString());
          await sleep(5000)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [client, wallet]);
  const handleSendMessage = async () => {
    const keyg = await generateKeyg();
    console.log(keyg);
    try {
      let mge = wallet ? Address.parse(wallet as string).toString() : "Я не успел(("; 
      sleep(1000);
      const response = await axios.post("/buckend/send_message", {
        sender_address: mge,
        recipient_address: recipientAddress,
        encrypted_message: message,
        keyg: keyg
      });

      console.log(response.data);
      // Очистить поля ввода после отправки сообщения
      setRecipientAddress("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };



  return (
    <FlexBoxRow>
      <FlexBoxCol>
        <Card>
          <FlexBoxCol>
            <TextContent>
            Ваш адрес для получения писем: 
            <h4>{wallet ? Address.parse(wallet as string).toString() : "Loading..."}</h4>
            </TextContent>
          </FlexBoxCol>
        </Card>
        <Pisma/>
      </FlexBoxCol>
      
      <FlexBoxCol>
      <CardNewMess title="Otpravit">
          <FlexBoxCol>
          <ContainerCenter>
            <InputAddr
              placeholder="Адрес получателя"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            </ContainerCenter>
            <ContainerCenter>
            <InputMess
              placeholder="Сообщение"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            </ContainerCenter>
            <Button disabled={!connected} onClick={handleSendMessage}>Send message</Button>
          </FlexBoxCol>
        </CardNewMess>
      </FlexBoxCol>
    </FlexBoxRow>
  );
}