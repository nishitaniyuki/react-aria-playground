"use client";

import { useReducer } from "react";
import { Tab, Tabs, TabList, TabPanel, Button } from "react-aria-components";

function Counter({ label }: { label: string }) {
  const [count, increment] = useReducer((i) => i + 1, 0);

  return (
    <Button onPress={increment}>
      {label}: {count}
    </Button>
  );
}

export default function TabsForceMount() {
  return (
    <Tabs defaultSelectedKey="counter1">
      <TabList aria-label="Counters">
        <Tab id="counter1">Counter 1</Tab>
        <Tab id="counter2">Counter 2</Tab>
        <Tab id="counter3">Counter 3</Tab>
      </TabList>
      <TabPanel id="counter1" shouldForceMount>
        <Counter label="counter1" />
      </TabPanel>
      <TabPanel id="counter2" shouldForceMount>
        <Counter label="counter2" />
      </TabPanel>
      <TabPanel id="counter3" shouldForceMount>
        <Counter label="counter3" />
      </TabPanel>
    </Tabs>
  );
}
