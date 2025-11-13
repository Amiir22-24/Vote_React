import { CandidatCreate } from "./Admin/CandidatCreate";

export default function CandidatPage() {
  return (
    <section>
      <button onClick={CandidatCreate}>click moi</button>
      {CandidatCreate && <CandidatCreate />}
      
    </section>
  )
}
