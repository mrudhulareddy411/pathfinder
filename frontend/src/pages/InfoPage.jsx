import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function InfoPage({ title, description }) {
  return (
    <div className="dashboard-clean-bg d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container py-5 flex-grow-1" style={{ maxWidth: "800px" }}>
        <div className="clean-card p-5 text-center">
          <h1 className="fw-bolder text-dark mb-3">{title}</h1>
          <p className="text-secondary fs-5">
            {description || `This is the ${title} page.`}
          </p>
          <hr className="my-4 border-secondary border-opacity-25" />
          <p className="text-muted small">
            This section is currently being updated. Please check back later for detailed {title.toLowerCase()} information.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default InfoPage;
