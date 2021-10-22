import React from "react";
import styled from "styled-components";
import Dude from "./Dude";

const getFill = (goal: number, count: number) => {
  const result = count / goal;
  if (result > 1) return 100;
  return result * 100;
};

interface Props {
  goal: number;
  count: number;
}

const WaterLevel = ({ goal, count }: Props) => {
  const warning = count - goal;
  return (
    <Wrapper>
      <Stack top>
        <Dude />
      </Stack>
      <Stack>
        <Bar>
          <Fill fill={getFill(goal, count)} />
          {warning > 0 && <Fill2 fill={getFill(goal, warning)} />}
        </Bar>
      </Stack>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
`;
const Stack = styled.div<{ top?: boolean }>`
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(p) =>
    p.top &&
    `
    z-index: 99;
  `}
`;
const Bar = styled.div`
  height: 50vh;
  width: 55vw;
  border: 2px solid #1aa7ec;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 5px;
  border-radius: 12px;
  position: relative;
`;
const Fill = styled.div<{ fill: number }>`
  height: ${(p) => `${p.fill}%`};
  background-color: #1aa7ec;
  width: 100%;
  border-radius: 6px;
  transition: height 500ms ease;
`;
const Fill2 = styled(Fill)`
  position: absolute;
  left: 5px;
  max-height: 97%;
  width: 95.5%;
  background-color: #ac1a0a;
  opacity: ${(p) => p.fill / 100};
`;

export default WaterLevel;
