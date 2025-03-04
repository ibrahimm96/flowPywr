"use client";
import { useDataContext } from "@/contexts/ModelDataContext";

const Page = () => {
  const { modelData } = useDataContext();

  return (
    <div>
      <h1>Node Data</h1>
      <pre>{JSON.stringify(modelData, null, 2)}</pre>
    </div>
  );
};

export default Page;