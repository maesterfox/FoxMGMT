import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_CLIENT } from "../queries/clientQueries";
import Spinner from "../components/Spinner";
import ClientInfo from "../components/ClientInfo";

export default function ClientDetail() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CLIENT, {
    variables: { id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong</p>;

  return (
    <div>
      <ClientInfo client={data.client} />
    </div>
  );
}
