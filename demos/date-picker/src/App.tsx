import { useState } from "react";
import { DatePicker } from "./components/zoblocks/date-picker";
import { ZbDate } from "./lib/zoblocks-datetime";

export default function App() {
  const [date, setDate] = useState<ZbDate | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <DatePicker variant="picker" label="Appointment date" value={date} onChange={setDate} />
    </div>
  );
}
