import { useEffect, useState } from "react";
import styled from "styled-components";
import glass from "../icons/glass.png";
import bottle from "../icons/bottle.png";
import WaterLevel from "./WaterLevel";

const genderGoal = {
  male: 3700,
  female: 2700,
};
const waterIntakes = [300, 700];
const leadingZero = (number: number) => (number < 10 ? `0${number}` : number);

const getToday = () => {
  const now = new Date("2021-11-22");
  const year = now.getUTCFullYear();
  const month = leadingZero(now.getUTCMonth() + 1);
  const date = leadingZero(now.getUTCDate());
  return `${year}-${month}-${date}`;
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
  const [isMale, setIsMale] = useState(true);
  const [goal, setGoal] = useState<number>(genderGoal.male);

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

  useEffect(() => {
    setGoal(isMale ? genderGoal.male : genderGoal.female);
  }, [isMale]);

  const danger = getExcessiveWaterIntake(goal, count);

  return (
    <Wrapper bgColor={bgColor}>
      <Button onClick={() => setIsMale(!isMale)}>Switch Gender</Button>
      <Title>Water {isMale ? "Dude" : "Dame"}</Title>
      <WaterLevel goal={goal} count={count} />
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
const WaterButton = styled.button<{ danger?: boolean }>`
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
  cursor: pointer;
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
const Button = styled(WaterButton)`
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: ;
`;

export default WaterDude;
