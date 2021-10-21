import { useEffect, useState } from "react";
import styled from "styled-components";
import glass from "../icons/glass.png";
import bottle from "../icons/bottle.png";

const waterIntakes = [300, 700];

const getToday = () => {
  return "2021-10-22";
};
const getFill = (goal: number, count: number) => {
  const result = count / goal;
  if (result > 1) return 100;
  return result * 100;
};
const getWaterIntake = (goal: number, count: number) => {
  if (count > goal * 1.5) return "Excessive water intake!";
  return count < goal ? `${count}/${goal} ml` : "Completed";
};
const getExcessiveWaterIntake = (goal: number, count: number) =>
  count > goal * 1.5;

const WaterDude = () => {
  const bgColor = "#ffffff";
  const [today] = useState(getToday());
  const [count, setCount] = useState(0);
  const [goal] = useState(2000);

  useEffect(() => {
    const waterDude = JSON.parse(localStorage.getItem("water-dude") || "{}");
    if (!waterDude) return;
    setCount(waterDude[today] || 0);
  }, [today]);

  useEffect(() => {
    if (count === 0) return;
    const oldWaterDude = JSON.parse(localStorage.getItem("water-dude") || "{}");
    const waterDude = {
      ...oldWaterDude,
      [today]: count,
    };
    localStorage.setItem("water-dude", JSON.stringify(waterDude));
    // eslint-disable-next-line
  }, [count]);

  const warning = count - goal;
  const danger = getExcessiveWaterIntake(goal, count);

  return (
    <Wrapper bgColor={bgColor}>
      <Title>Water Dude</Title>
      <Bar>
        <Fill fill={getFill(goal, count)} />
        {warning > 0 && <Fill2 fill={getFill(goal, warning)} />}
      </Bar>
      <Count danger={danger}>{getWaterIntake(goal, count)}</Count>
      <Buttons>
        {waterIntakes.map((wi) => (
          <WaterButton
            disabled={count - goal > goal}
            danger={danger}
            onClick={() => setCount(count + wi)}
          >
            <Icon isBottle={wi === 700} src={wi === 300 ? glass : bottle} />
            {wi}ml
          </WaterButton>
        ))}
      </Buttons>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ bgColor: string }>`
  background-color: ${(p) => p.bgColor};
  color: #1aa7ec;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
`;
const Title = styled.h1``;
const Count = styled.p<{ danger: boolean }>`
  font-weight: 800;
  ${(p) =>
    p.danger &&
    `
      color: #ac1a0a;
  `}
`;
const Buttons = styled.div`
  display: flex;
`;
const WaterButton = styled.button<{ danger: boolean }>`
  background-color: #1aa7ec;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 800;
  padding: 15px;
  margin: 10px 5px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  :hover,
  :active {
    opacity: 0.8;
  }
  ${(p) =>
    p.disabled &&
    `
      opacity: 0.7;
      cursor: not-allowed;
      :hover, :active {
        opacity: 0.7;
      }
    `}
  ${(p) =>
    p.danger &&
    `
      background-color: #ac1a0a;
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
const Icon = styled.img<{ isBottle: boolean }>`
  filter: invert(1);
  margin-right: 5px;
  width: 22px;
  ${(p) =>
    p.isBottle &&
    `
    width: 40px;
    margin: -2px -5px;
    margin-left: -8px;
  `}
`;

export default WaterDude;
