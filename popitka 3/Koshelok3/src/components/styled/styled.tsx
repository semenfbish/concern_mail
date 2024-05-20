import styled from "styled-components";
export const Card = styled.div`
  width: 520px;
  padding: 10px 10px;
  border-radius: 8px;
  background-color: white;
  @media (prefers-color-scheme: dark) {
    background-color: #111;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  h4{
    font-size: 18px;
  }
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.4;
  text-align: left;
  font-size: 20px;
`;


export const CardNewMess = styled.div`
  padding: 50px 125px;
  border-radius: 8px;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: #111;
  }
  div {
    font-size: 20px; /* Устанавливаем размер текста */
  }
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
`;
export const FlexBoxRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  h3 {
    margin-bottom: 2px;
    line-height: 1; /* Устанавливаем меньший отступ строк */
  }
`;

export const FlexBoxCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  h3 {
    margin-bottom: 5px;
    line-height: 1; /* Устанавливаем меньший отступ строк */
  }
  
`;

export const Button = styled.button`
  background-color: ${(props) =>
    props.disabled ? "#6e6e6e" : "var(--tg-theme-button-color)"};
  border: 0;
  border-radius: 8px;
  padding: 10px 20px;
  color: var(--tg-theme-button-text-color);
  font-weight: 700;
  cursor: pointer;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
`;

export const ContainerCenter = styled.div`
display: flex;
justify-content: flex-end;
`;
export const ContainerRight = styled.div`
  display: flex;
  align-items: flex-end; /* Это выравнивание по верхнему краю */
  justify-content: flex-end; /* Это выравнивание по левому краю */
`;

export const ContainerLeft = styled.div`
  display: flex;
  flex-direction: row;
  h3 {
    
    margin-bottom: -10px;
    line-height: 1; /* Устанавливаем меньший отступ строк */
  }
  gap: 150px; /* Отступ между карточками примерно 100px */
  align-items: flex-start;
  justify-content: flex-start;
`;
// Стили для текстовых элементов внутри контейнера
export const TextLeftAligned = styled.h3`
  margin-bottom: -10px;
  line-height: 1; /* Устанавливаем меньший отступ строк */
  text-align: left; /* Выравнивание текста по левому краю */
`;
 
export const NetButton = styled.button`
  background-color: ${(props) =>
    props.disabled ? "#6e6e6e" : "var(--tg-theme-button-color)"};
  border: 0;
  border-radius: 8px;
  padding: 10px 20px;
  color: var(--tg-theme-button-text-color);
  font-weight: 700;
  cursor: pointer;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};`
  export const BalanceButton = styled.button`
  background-color: ${(props) =>
    props.disabled ? "#6e6e6e" : "var(--tg-theme-button-color)"};
  border: 0;
  border-radius: 8px;
  padding: 10px 20px;
  color: var(--tg-theme-button-text-color);
  font-weight: 700;
  cursor: pointer;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};`

export const Ellipsis = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const InputAddr = styled("input")`
  padding: 10px 20px;
  border-radius: 10px;
  width: 100%;
  border: 1px solid #c2c2c2;

  @media (prefers-color-scheme: dark) {
    border: 1px solid #fefefe;
  }
`;
export const InputMess = styled("textarea")`
  padding: 10px;
  border-radius: 10px;
  width: 400px;
  border: 1px solid #c2c2c2;
  height: 200px;
  resize: auto;
  @media (prefers-color-scheme: dark) {
    border: 1px solid #fefefe;
  }
`;
