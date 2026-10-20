import { useState } from "react";
import { Form, Button, Table, Card, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  async function registerStudent(e) {
    e.preventDefault();

    if (firstname === "" || lastname === "" || course === "" || email === "" || address === "") {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch(
        "https://nominatim.openstreetmap.org/search?format=json&q=" +
          encodeURIComponent(address)
      );

      const data = await response.json();

      if (data.length === 0) {
        setMessage("Address not found.");
        return;
      }

      const student = {
        id: Date.now(),
        firstname: firstname,
        lastname: lastname,
        course: course,
        email: email,
        address: address,
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon)
      };

      setStudents([...students, student]);

      setFirstname("");
      setLastname("");
      setCourse("");
      setEmail("");
      setAddress("");

      setMessage("Student registered successfully.");
    } catch (error) {
      setMessage("Something went wrong.");
    }
  }

  function deleteStudent(id) {
    setStudents(
      students.filter((student) => student.id !== id)
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-1">
            Student Location System
          </h1>
          <p className="mb-0">
            Register students and find their location.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Card>
            <Card.Body>
              <h2 className="text-xl font-bold mb-3">
                Student Registration
              </h2>

              {message !== "" && (
                <Alert variant="info">
                  {message}
                </Alert>
              )}

              <Form onSubmit={registerStudent}>
                <Form.Group className="mb-3">
                  <Form.Label>Firstname</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lastname</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                <Button type="submit">
                  Register Student
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h2 className="text-xl font-bold mb-3">
                Student Location
              </h2>

              <MapContainer
                center={[14.5995, 120.9842]}
                zoom={12}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {students.map((student) => (
                  <Marker
                    key={student.id}
                    position={[
                      student.latitude,
                      student.longitude
                    ]}
                  >
                    <Popup>
                      <b>
                        {student.firstname} {student.lastname}
                      </b>
                      <br />
                      Course: {student.course}
                      <br />
                      Email: {student.email}
                      <br />
                      Address: {student.address}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card.Body>
          </Card>

        </div>

        <Card className="mt-4">
          <Card.Body>
            <h2 className="text-xl font-bold mb-3">
              Registered Students
            </h2>

            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>
                      {student.firstname} {student.lastname}
                    </td>
                    <td>{student.course}</td>
                    <td>{student.email}</td>
                    <td>{student.address}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {students.length === 0 && (
              <p className="text-gray-500 mb-0">
                No students registered yet.
              </p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default App;