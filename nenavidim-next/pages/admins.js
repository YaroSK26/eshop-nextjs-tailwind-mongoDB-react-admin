import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Spinner from "../components/Spinner";
import { prettyDate } from "../lib/date";

function AdminsPage({ swal }) {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  function addAdmin(ev) {
    ev.preventDefault();
    axios.post("/api/admins", { email }).then((res) => {
      swal.fire({
        title: "Admin created",
        icon: "success",
      });
      setEmail("");
      loadAdmins();
    }).catch((err) => {
       swal.fire({
         title: "Error",
         text: err.response.data.message,
         icon: "error",
       });
    });
  }

  function deleteAdmin(_id, email) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete admin ${email}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios.delete("/api/admins?_id=" + _id).then(() => {
            swal.fire({
              title: "Admin deleted",
              icon: "success",
            });
            loadAdmins();
          });
        }
      });
  }

  function loadAdmins() {
    setLoading(true);
    axios.get("/api/admins").then((res) => {
      setAdminEmails(res.data);
      setLoading(false);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  return (
    <Layout>
      <h1>Admins</h1>
      <h2 className="mb-2 mt-4">Add new admin</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="google email"
            className="mb-0 "
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Add admin
          </button>
        </div>
      </form>

      <h2 className="mb-2 mt-4">Existing admins</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-center">Admin google email</th>
            <th> Created at</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true}></Spinner>
                </div>
              </td>
            </tr>
          )}

          {adminEmails.length > 0 &&
            adminEmails.map((adminEmail) => (
              <tr key={adminEmail._id} className="text-center">
                <td>{adminEmail.email}</td>
                <td>
                  {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                </td>
                <td>
                  <button
                    onClick={() =>
                      deleteAdmin(adminEmail._id, adminEmail.email)
                    }
                    className="btn-red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }) => <AdminsPage swal={swal}></AdminsPage>);
