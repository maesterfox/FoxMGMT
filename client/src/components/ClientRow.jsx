import React from "react";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { DELETE_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queries/clientQueries";
import { GET_PROJECTS } from "../queries/projectQueries";
import { Link } from "react-router-dom";

export default function ClientRow({ client }) {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }],
  });

  return (
    <tr>
      <td data-label="Name">
        <Link to={`/clients/${client.id}`}>{client.name}</Link>
      </td>
      <td data-label="Email">
        <Link to={`/clients/${client.id}`}>{client.email}</Link>
      </td>
      <td data-label="Phone" className="phone-number">
        <Link to={`/clients/${client.id}`}>{client.phone}</Link>
      </td>
      <td data-label="Actions">
        <div className="d-flex gap-2">
          <button className="btn btn-danger btn-sm" onClick={deleteClient}>
            <FaTrash />
          </button>
          <Link to={`/clients/${client.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </td>
    </tr>
  );
}
