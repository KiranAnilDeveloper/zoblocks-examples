import { HelixLoader } from "@/components/zoblocks/helix-loader";

export default function App() {
  return (
    <div>
      <HelixLoader mode="overlay" label="Running the panel" delay={200} />
    </div>
  );
}
