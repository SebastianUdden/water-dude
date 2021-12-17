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
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = leadingZero(now.getUTCMonth() + 1);
  const date = leadingZero(now.getUTCDate());
  return `${year}-${month}-${date}`;
};

const getWaterIntake = (goal: number, count: number) => {
  if (count > goal * 1.5) return "Excessive water intake!";
  return count >= goal ? "Completed" : `${count}/${goal} ml`;
};
const getExcessiveWaterIntake = (goal: number, count: number) =>
  count > goal * 1.5;

const WaterDude = () => {
  const bgColor = "#ffffff";
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any>([]);
  const [today] = useState(getToday());
  const [count, setCount] = useState(0);
  const [isMale, setIsMale] = useState(true);
  const [goal, setGoal] = useState<number>(genderGoal.male);

  useEffect(() => {
    const oldWaterDude = JSON.parse(localStorage.getItem("water-dude") || "{}");
    if (!oldWaterDude) return;
    if (!oldWaterDude[today]) {
      const waterDude = {
        ...oldWaterDude,
        [today]: count,
      };
      localStorage.setItem("water-dude", JSON.stringify(waterDude));
      setCount(0);
      return;
    }
    setCount(oldWaterDude[today]);
    // eslint-disable-next-line
  }, [today]);

  useEffect(() => {
    const oldWaterDude = JSON.parse(localStorage.getItem("water-dude") || "{}");
    setHistory(Object.entries(oldWaterDude).reverse());
    if (count === 0) return;
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
      <Button onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? "Hide" : "View"} history
      </Button>
      {showHistory ? (
        <History>
          <Title>Consumption history</Title>
          <Entries>
            {history.map((h: any) => (
              <Entry
                isSuccess={
                  h[1] >= (isMale ? genderGoal.male : genderGoal.female)
                }
              >
                {h[0]}: <strong>{h[1]}</strong>
              </Entry>
            ))}
          </Entries>
        </History>
      ) : (
        <>
          <Button left onClick={() => setIsMale(!isMale)}>
            Switch Gender
          </Button>
          <h1>Water {isMale ? "Dude" : "Dame"}</h1>
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
        </>
      )}
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
const WaterButton = styled.button<{ danger?: boolean; left?: boolean }>`
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
  top: 7px;
  padding: 8px;
  font-size: 14px;
  ${(p) =>
    p.left
      ? `
        left: 7px;
      `
      : `
        right: 7px;
  `}
`;
const Entries = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: left;
  height: auto;
  overflow-y: scroll;
  height: 60vh;
`;
const Entry = styled.li<{ isSuccess?: boolean }>`
  color: #ff2200;
  border-bottom: 1px solid white;
  padding: 5px;
  ${(p) =>
    p.isSuccess &&
    `
    color: white;
`}
`;
const History = styled.div`
  max-height: 70vh;
  height: 100%;
  margin: 30px 70px 0;
  text-align: left;
  background-color: #1aa7ec;
  color: #fff;
  padding: 20px 20px 50px;
  border-radius: 12px;
  overflow: hidden;
`;
const Title = styled.h1`
  margin: 0 0 20px;
`;

export default WaterDude;
