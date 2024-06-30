import {
  Card,
  FlexBoxCol,
  TextContent,} 
from "./styled/styled";
import { useEffect, useState } from "react";
import axios from "axios";
import { Address } from "ton-core";
import { useTonConnect } from "../hooks/useTonConnect";

// Определение интерфейса для сообщений
interface Message {
    id: number;
    sender_address: string;
    recipient_address: string;
    encrypted_message: string;
  }
  //const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

  export function Pisma() {
  const [messages, setMessages] = useState<Message[]>([]); // Состояние для хранения сообщений
  const {wallet} = useTonConnect()
  useEffect(() => {
    handleGetMessages();

}, [wallet]);
const handleGetMessages = async () => {
  try {
    // Запрос на получение сообщений
    const response = await axios.get("/buckend/get_messages", {
      params: {
        address: Address.parse(wallet as string) 
      }
    });
    setMessages(response.data);
    // Обработка полученных сообщений
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}
  return (
    <FlexBoxCol>
      {messages.map((message, index) => (
        <FlexBoxCol key={index}>
          <Card>
            <TextContent>Адрес отправителя: {message.sender_address}</TextContent>
            <TextContent>Адрес получателя: {message.recipient_address}</TextContent>
            <TextContent>Зашифрованное сообщение: {message.encrypted_message}</TextContent>
          </Card>
        </FlexBoxCol>
      ))}
    </FlexBoxCol>
  );
}