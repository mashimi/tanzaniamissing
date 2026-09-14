import Registry from "@/components/Registry";
import { getAllPersons } from "@/lib/records";

export default function Home() {
  return <Registry initial={getAllPersons()} />;
}
