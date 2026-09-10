import { PageHero } from "../components/site";

const donationOptions = [
  {
    title: "Church Maintenance",
    text: "Help us preserve and maintain our historic church and its sacred spaces.",
  },
  {
    title: "Charity",
    text: "Support families, individuals and neighbors in need within our community.",
  },
  {
    title: "Education",
    text: "Support educational activities and help children grow in knowledge and faith.",
  },
  {
    title: "Feast Celebrations",
    text: "Help make our parish feasts and community celebrations possible.",
  },
];

export default function Donations() {
  return (
    <main>
      <PageHero title="Support Our Mission" crumb="Donations" />

      <section className="section">
        <div className="container">
          <div
            style={{
              textAlign: "center",
              maxWidth: 650,
              margin: "0 auto 42px",
            }}
          >
            <div className="eyebrow">Your generosity helps us continue</div>

            <h2 className="section-title">
              Give with a faithful heart
            </h2>

            <p className="body-copy">
              Your generous support helps sustain parish life, worship,
              education, church maintenance and practical care for our
              community.
            </p>
          </div>

          <div className="cards-grid">
            {donationOptions.map((item) => (
              <div className="card" key={item.title}>
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: 50,
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div className="eyebrow">Thank you</div>

            <h2 className="section-title">
              Every contribution matters
            </h2>

            <p className="body-copy">
              Your support, whether large or small, helps our parish continue
              its mission of faith, service and community.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}