import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import UserDistributionChart from "./UserDistributionChart";
import CurrentLocationMap from "./CurrentLocationMap";

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const cand = [],
        cli = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userType === "candidate") cand.push(data);
        else if (data.userType === "client") cli.push(data);
      });

      setCandidates(cand);
      setClients(cli);
    };

    fetchUsers();
  }, []);

  return (
    <div className="md:p-6 p-0  flex flex-col gap-6">
      <CurrentLocationMap />
      <UserDistributionChart candidates={candidates} clients={clients} />
    </div>
  );
}
